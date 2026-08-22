---
layout: post
title: "From GPT-2 to Kimi K3, Explained — 从 GPT-2 到 Kimi K3：注意力架构演进全解（中文翻译 + 模块化解读）"
date: 2026-07-29 21:00:00 +0800
categories: [AI与机器学习]
tags: [大模型, 注意力机制, "Kimi K3", GPT-2, 线性注意力, MoE]
description: "本地文档《From GPT2.0 to Kimi3.0, Explained》技术 worklog 的中文翻译与模块化解读：从 GPT-2 (124M) 到 Kimi K3 (2.8T，22,580×) 的注意力架构演进——线性注意力、DeltaNet、Gated DeltaNet、Kimi Linear(KDA)、MLA/MoE/AttnRes/SiTU。含 23 张架构/公式配图，已全部本地化嵌入，原文与译文均未遗漏。"
image: /assets/img/posts/gpt2-to-kimi3/image3.jpeg

---

> **来源说明**：本文整理自本地文档《22580-From GPT2.0 to Kimi3.0, Explained》（作者未署名，应是一篇公开技术 worklog；标题将 Kimi K3 标注为 2026）。
> **结构**：**第一部分 英文原文** + **第二部分 中文翻译（逐节对照）** + **第三部分 模块化解读**。
> **图片处理**：原文含 **23 张**架构/公式配图（image1–image23），已全部从 docx 抽取并本地化到 `assets/img/posts/gpt2-to-kimi3/`，在原文与译文中均按原始位置嵌入，**无遗漏**。
> 本发布保留英文原文并附中文翻译与模块化解读，仅作技术学习整理，**著作权归原作者所有**；如涉原作者权益请告知。

---

## 第一部分：英文原文（Original Article）

### 22580-From GPT2.0 to Kimi3.0, Explained

![图 1](/assets/img/posts/gpt2-to-kimi3/image1.jpeg)

Twenty-two thousand five hundred and eighty. That's how many GPT-2 (2019) models fit inside KimiK3 (2026). We scaled up by a factor of 22,580 in seven years. But is it just... scale?

In this worklog, I'll walk through how we got here and how much, or how little, has actually changed since then. We'll trace the major architectural developments leading to KimiK3.

![图 2](/assets/img/posts/gpt2-to-kimi3/image2.jpeg)

### GPT-2

GPT-2 is a decoder-only architecture:

The input receives token and positional embeddings:

![图 3](/assets/img/posts/gpt2-to-kimi3/image3.jpeg)

Each transformer block, zoomed in, looks like this:

![图 4](/assets/img/posts/gpt2-to-kimi3/image4.jpeg)

The attention process:

Once the final hidden-state matrix is produced, the language-model head maps it into vocabulary logits. During autoregressive decoding, only the logits at the final position are needed to select the next token.

This is an inefficiency of decoder-only generation: the model computes representations for every input position, but each decode step consumes only the final position's logits. Without caching, much of that work would be repeated for the next token.

![图 5](/assets/img/posts/gpt2-to-kimi3/image5.png)

The KV cache comes from a straightforward observation: after appending the generated token to the input, the model would otherwise recompute projections for all previous tokens. Storing their key and value vectors avoids that redundant work.

That storage is the KV cache. It retains vectors for the previous N-1 tokens and can become large enough to create a memory-bandwidth bottleneck.

Overall, with about 50k possible tokens, 12 blocks, 12 heads, and an embedding dimension of 768, our baseline model is about 124M parameters.

At 2.8 trillion parameters, one KimiK3 model contains roughly as many parameters as 22,580 GPT-2 models.

### Linear Attention

Softmax attention applies its nonlinearity after the q·k product, coupling every query to every key. Linear attention instead applies a feature map, such as ELU+1, to q and k separately. This makes the product re-associable, so the growing set of K and V vectors can be folded into a fixed D×D state.

The paper's O(N²) framing threw me off. It's not true that "the cost per time-step for transformers scales with the square of the current sequence length". That's what Flash Attention fixes...  then I saw that it was released in 2020.

At the time, training commonly materialized the full N×N attention matrix, FlashAttention did not exist, and reference autoregressive implementations often recomputed the token history without a KV cache.

The same process is easier to see visually. Each decode step performs two ND reads and two 1D writes to HBM, while the KV cache grows linearly, in O(N), with the sequence length.

![图 6](/assets/img/posts/gpt2-to-kimi3/image6.png)

Notice the excessive reads and writes, which this paper replaces with:

There is a trade-off.

Here, we replace the exponential used by softmax with ELU+1 applied separately to q and k before they interact. Both approaches normalize the resulting scores, but the feature map used by linear attention is a less expressive approximation of the softmax kernel. That approximation can reduce fidelity, although the practical accuracy loss depends on the architecture and workload.

Notice that we still divide by the sum of qk, which is omitted from the diagram for simplicity. At a high level, attention consists of three steps:

- Make the qk scores non-negative. Linear attention uses ELU+1, while softmax uses exponentiation.
- Divide by the sum.
- Compute the weighted average of the values.

This preserves the basic attention contract, but uses a less expressive feature map to make the QK scores non-negative.

### DeltaNet (Fast Weight Programmers)

A finite cache must overwrite or combine with information already stored. The state from token i-1 does not receive its own slot; it is added to the same D by D matrix. New queries can therefore no longer retrieve a perfectly isolated representation of each earlier token.

That addition is also the source of the efficiency gain. Updating the cache additively rather than by concatenation prevents it from growing in O(N), but the same operation causes information to interfere. DeltaNet addresses this loss of recoverability.

![图 7](/assets/img/posts/gpt2-to-kimi3/image7.png)

Eloquently put by Schlag's paper (Fast Weight Programmers): "when the sequence length exceeds storage capacity, the model may end up in an overcapacity regime. To properly operate under such a regime, the model should learn to dynamically interact with the memory contents and selectively decide which key-value associations to keep and which ones to delete. The purely additive instruction may be inappropriate for this purpose…. endlessly adding new associations to a memory of finite size, as in Eq. 17, inevitably will reach a limit."

The regime that makes linear attention attractive, where N is much larger than D, also exposes its main limitation. Once the state exceeds its effective capacity, associations begin to interfere because the update is additive and nothing leaves the cache.

A visual example makes this easier to follow.

![图 8](/assets/img/posts/gpt2-to-kimi3/image8.jpeg)

Take a single association written as S = k.T @ v. If read back with the same key and you get k @ (k.T @ v), which is (k @ k.T) v, which is the squared norm of k times v. So read returns scaled by key's squared norm, and if normalize k to unit length, or just divide result by norm, get v back exactly.

Q is also a learned pointer. Wq and Wk read the same residual stream, and the query for a fact points at the key direction that fact was written into. The update first asks what information the current key retrieves from the cache. It subtracts that existing information from the value we want to store, multiplies the key by the difference, and adds the result back. Old information is removed and new information is written in its place.

### DeltaNet (Parallelizing Linear Transformers with Delta Rule)

This is the most difficult section of the post. It took me about seven hours to develop a working understanding of it, so I will build the explanation from the implementation. In short, DeltaNet implements a first-order linear recurrence with generalized Householder transition matrices, enabling chunk-wise parallel forward passes for hardware-efficient linear-time training. It splits the inputs and outputs into several chunks of size C, and computes outputs for each chunk based on the final state of the previous chunk and the query key value blocks of the current chunk.

The practical problem is prefill. A direct implementation of the Delta rule over a sequence of T tokens would look like this:

Unlike standard attention, this formulation requires a correction at every key vector, so the path to a parallel matrix multiplication is not immediately obvious. Even without the Delta rule, a direct linear-attention prefill remains sequential:

A chunked formulation provides a more efficient approach. The mechanics are easier to understand through an example:

![图 9](/assets/img/posts/gpt2-to-kimi3/image9.jpeg)

Setting C=N recovers standard O(N^2) attention, while C=1 gives regular linear attention. Intermediate values we interpolate between trade additional within-chunk work for better hardware utilization. In practice, C is often 64 or 128 because tensor-core instructions operate efficiently at that granularity; UMMA is one example.

The intermediate tiles are folded into S as part of the state update:

![图 10](/assets/img/posts/gpt2-to-kimi3/image10.jpeg)

Within a block, we do q(kᵀv). This is score first, the normal attention order with masking. Across blocks, we follow (kᵀv)q, so we're doing recurrent order, state first. Attention grows in O(N²) and this does not. Inside a block I do real attention (the masked QKᵀ times V), and across blocks I fold everything into the state and read it back with one matmul. So the cost splits in two. There's a fixed piece, 2Ld², which is the state work and doesn't care about C at all. And there's a growing piece, 2LCd, which is the score matrices sitting on the diagonal. Full attention is just the case where C equals L, and then that second term becomes 2L²d, quadratic. So the smaller I make C, the fewer FLOPs I do.

C=1 is the cheapest option in pure FLOP terms, but not necessarily in wall-clock time. A GPU can complete more arithmetic faster when the work maps efficiently onto its matrix-multiply hardware.

The next step is to extend the same approach to DeltaNet.

![图 11](/assets/img/posts/gpt2-to-kimi3/image11.jpeg)

The underlying issue is simple: the chunking method used for purely additive attention does not directly apply to the delta updates:

We need every single state in order to compute the information that needs to be subtracted out. We can't parallelize it the same way without some mathematical re-parameterization. The authors therefore rewrite the delta updates from:

Here, a sequential loop computes one delta per iteration. The reparameterized form is:

This formulation allows the chunked code to compute all C deltas at once:

This gets us to our first comparison point: MHA vs DeltaNet Transformers:

![图 12](/assets/img/posts/gpt2-to-kimi3/image12.jpeg)

### Gated Delta Net

We now have a method for making precise changes to the cache. With each new fact (each new key vector), we can look at exactly the old information stored at that point and replace it with the new information we want to attend to.

However, this mechanism can forget only an association for which it has a specific replacement. It cannot efficiently clear multiple associations during a context switch or decay memory generally to free capacity.

If we were doing purely additive linear attention:

Adding the ability to forget would be simple. We'd just need a parameter controlling the forgetful state:

![图 13](/assets/img/posts/gpt2-to-kimi3/image13.png)

This is the Mamba-2 contribution. We decay the previous cache, then add the new cache at full strength, preventing the state from growing without bound.

Uniformly decaying all key-value associations at each time step by a dynamic ratio is a working approach, and it's what Mamba does. But it doesn't account for the varying importance of different key-value associations.

That is, if the model needs to forget one specific association, all associations are forgotten equally. The Delta rule, in contrast, can update a single fact but has no way to make the rest of the facts decay.

So the Gated Delta rule combines Mamba's gated update rule with the Delta rule. It adds a parameter, alpha, that switches to the pure Delta rule when set to one and clears the memory when set to zero. The challenge is implementing this with the same parallel-chunks method.

The implementation uses the same DeltaNet reparameterization described in the previous section. The mathematics is nearly identical, with one addition: a data-dependent scalar between zero and one that controls the decay of the previous state. This combines effective key-value association learning with adaptive memory management.

The corresponding code changes are shown below:

![图 14](/assets/img/posts/gpt2-to-kimi3/image14.jpeg)

The γʳ/γⁱ term accounts for cumulative decay. A token written at time step x and read at x+t has been multiplied by αₓαₓ₊₁αₓ₊₂…αₓ₊ₜ. This is the multiplicative analogue of a prefix-sum calculation.

The resulting architecture looks like this:

![图 15](/assets/img/posts/gpt2-to-kimi3/image15.jpeg)

### KDA/Kimi Linear

At this point, researchers began experimenting with hybrid models that combine multiple forms of attention within one architecture, like Gated DeltaNet withM Mamba.

Kimi Linear drew attention for one central claim: under controlled comparisons, it outperformed full attention. The authors presented it as a drop-in architectural replacement with better quality and up to 6x higher decode throughput.

Kimi Linear improves on Gated DeltaNet by introducing fine-grained gating. Instead of a single scalar decay, it learns a separate decay value for each channel.

![图 16](/assets/img/posts/gpt2-to-kimi3/image16.jpeg)

The KDA update rule remains similar, but the code now looks more like this:

![图 17](/assets/img/posts/gpt2-to-kimi3/image17.jpeg)

Here, alpha.reshape(nb, C, d) captures the paper's most significant contribution: fine-grained control over memory decay.

Placed beside the DeltaNet Transformer, the Kimi Linear architecture introduces three major changes:

- It uses a hybrid system that interleaves Multi-head Latent Attention (MLA) layers.
- It replaces the MLP with a Mixture-of-Experts (MoE) layer.
- It adds capacity to DeltaNet through the alpha projection.

![图 18](/assets/img/posts/gpt2-to-kimi3/image18.jpeg)

The later sections cover MLA and MoE in more detail. For now, the important point is that this is not blind scaling. The additional capacity has a specific mathematical purpose: the per-channel scale gives the model finer control over memory decay.

Scaling laws remain relevant, but capacity must be added in the right place and in a form the system can use. Each architecture in this progression adds capacity to address a concrete limitation in the preceding system.

### Kimi K3

Ultimately, the KimiK3 language backbone looks similar to the Kimi Linear model above. It contains 23 four-layer macrocycles. In each macrocycle, three layers use Kimi Delta Attention and the fourth uses Multi-head Latent Attention. The first layer uses a dense feed-forward network; every remaining layer uses a latent Mixture-of-Experts.

At first glance, the changes from Kimi Linear appear modest:

- A substantial increase in scale
- Blockwise AttnRes every 12 layers
- MLA query LoRA and output gating
- Latent-space MoE
- SiTU activations
- Gated MLA

KDA supplies constant-state recurrent memory, while periodic MLA layers retain full softmax retrieval over the context. The following simplified visualization provides a useful reference for the changes discussed below.

![图 19](/assets/img/posts/gpt2-to-kimi3/image19.jpeg)

We will begin with the more direct changes: Gated MLA, latent-space MoE, and SiTU activations.

Gated MLA determines how much of each retrieved feature passes from MLA into the residual stream. It does this through element-wise multiplication with a gate projected from the input.

In a conventional MoE, a learned router uses dot-product similarity to send each token to a subset of expert networks. KimiK3 has 898 experts in total. Two are shared and process every token; of the remaining 896, the router selects 16 for each token.

KimiK3 also changes the expert activation. Instead of applying SiLU to the up projection, multiplying it element-wise by the gate, and then applying the down projection, it uses SiTU:

The model also down-projects inputs to the shared experts and up-projects their final sum:

![图 20](/assets/img/posts/gpt2-to-kimi3/image20.jpeg)

This illustrates a recurring challenge in model inference. Without a fused kernel, the new activation is almost 3x slower than the original path. One offsetting optimization is that the experts operate in a compressed latent space, which makes their forward pass much faster and nearly halves the FLOPs.

The remaining changes are MLA query LoRA, output gating, and blockwise Attention Residuals every 12 layers. AttnRes adds roughly 2% inference latency, but provides two important benefits:

- Selective retrieval of earlier representations, which mitigates residual dilution and hidden-state growth
- A 1.25x compute advantage

AttnRes and MLA address the same underlying limitation from different directions. KDA layers operate with constant-size state and must inevitably discard information. MLA retrieves from the token context, while AttnRes retrieves from earlier depth-wise representations.

### AttnRes

Thanks to @chloey3k for help with this section. In each forward pass, the input passes through a stack of layers. Here, each layer consists of an attention block (KDA or MLA) and an MLP or MoE block. Normally, the input to each layer is the sum of the original embedding and every preceding layer's output, all weighted equally.

![图 21](/assets/img/posts/gpt2-to-kimi3/image21.jpeg)

Here, h_i is the input to layer i, h_1 is the embedding of the current token (the last token in the sequence so far), and f_i(h_i) is the output of layer i (an attention or MLP block).

The problem is the lack of selective access. Different layer types receive the same aggregated state, even though they may benefit from different weightings. Because the recurrence is purely additive, later layers must also learn increasingly large outputs to influence the accumulated residual, which can destabilize training. Instead of treating all the layers equally, AttnRes multiplies each term of that sum by a specialized weight, which lets the model give more importance to whichever layers are most useful in context.

![图 22](/assets/img/posts/gpt2-to-kimi3/image22.jpeg)

Each weight alpha_i is computed from a query-key dot product. The query is learned for each layer, while the keys and values come from earlier residual-stream states. The scores are normalized to sum to one, then used to form a weighted combination of those states.

![图 23](/assets/img/posts/gpt2-to-kimi3/image23.jpeg)

The model therefore does not have to condition only on its immediate predecessor. AttnRes gives each layer selective access to earlier layer outputs, allowing its learned query to retrieve the representations most useful for the current computation.

The pseudocode below applies the same idea at block granularity. A block is the element-wise sum of the attention and MLP outputs accumulated across 12 decoder layers, stored as a single depth representation for later AttnRes mixing.

Applying residual attention at every layer would add too much training and inference cost. Applying it only at fixed block boundaries captures most of the benefit at a lower cost. In KimiK3, each boundary occurs after 12 decoder layers. Across 23 four-layer macrocycles, this produces eight AttnRes blocks, which increases our inference speed.

This is possibly the most important part of the block_attn_res function

This completes the progression from GPT-2 to KimiK3.

The central change is not scale alone. Each architectural step changes what the model stores, how it updates that state, or how it retrieves information that a fixed-size state cannot preserve.

KimiK3 combines constant-state recurrent memory, periodic softmax retrieval, sparse expert capacity, and selective depth-wise residual access. The result is a system that spends additional capacity where it has a specific functional role.

In essence, a fixed-capacity associative memory (fixed dimensions) needs an eviction policy, since a purely additive linear operation eventually adds interference once at capacity. To that end, learned selection, like gating, routing, or decay, is necessary, and attention is the most effective selective-read mechanism.

---

## 第二部分：中文翻译（逐节对照）

### 22580-From GPT2.0 to Kimi3.0, Explained

![图 1](/assets/img/posts/gpt2-to-kimi3/image1.jpeg)

两万两千五百八十。这个数字等于能装进一个 KimiK3（2026）里的 GPT-2（2019）模型的数量。七年间，我们把规模放大了 22,580 倍。但……真的只是规模吗？

在这篇工作日志里，我将梳理我们是如何走到今天的，以及自那时起，到底有多少（或者说少得可怜的）东西真正发生了改变。我们会沿着通向 KimiK3 的主要架构演进脉络一路追溯。

![图 2](/assets/img/posts/gpt2-to-kimi3/image2.jpeg)

### GPT-2

GPT-2 是一种仅解码器（decoder-only）架构：

输入会接收词元（token）嵌入与位置（positional）嵌入：

![图 3](/assets/img/posts/gpt2-to-kimi3/image3.jpeg)

每个被放大的 Transformer 模块长这样：

![图 4](/assets/img/posts/gpt2-to-kimi3/image4.jpeg)

注意力计算过程：

一旦生成最终的隐状态矩阵，语言模型头（head）会将其映射为词表 logits。在自回归解码时，只需最终位置的 logits 即可选出下一个 token。

这正是仅解码器生成的一个低效之处：模型为每一个输入位置都计算了表示，但每一步解码只用到最终位置的 logits。如果不做缓存，下一步解码时这些计算大多要重做。

![图 5](/assets/img/posts/gpt2-to-kimi3/image5.png)

KV 缓存源于一个朴素的观察：把生成出的 token 追加到输入后，模型原本需要为所有此前 token 重新计算投影。把它们的 key 和 value 向量存下来，就能避免这些冗余计算。

这套存储就是 KV 缓存。它保留前 N-1 个 token 的向量，并且可能变得足够大，以至于造成显存带宽瓶颈。

总体而言，在约 5 万词表、12 个模块、12 个注意力头、嵌入维度 768 的配置下，我们的基线模型约有 1.24 亿（124M）参数。

KimiK3 拥有 2.8 万亿（2.8 trillion）参数，一个 KimiK3 模型大约相当于 22,580 个 GPT-2 模型之和。

### 线性注意力（Linear Attention）

Softmax 注意力在 q·k 乘积之后才施加非线性，把每个 query 与每个 key 耦合在一起。线性注意力则改为对 q 和 k 分别施加一个特征映射（如 ELU+1）。这让乘积变得可重新结合（re-associable），于是不断增长的 K、V 向量集合可以被折叠进一个固定的 D×D 状态中。

论文里 O(N²) 的提法一开始让我困惑。"Transformer 每个时间步的代价随当前序列长度的平方增长"这种说法并不准确——这正是 FlashAttention 所解决的问题……后来我才注意到，那篇论文是 2020 年发布的。

在当时，训练通常会把完整的 N×N 注意力矩阵实体化（materialize），FlashAttention 还不存在，而很多参考性的自回归实现在没有 KV 缓存的情况下会重新计算 token 历史。

同一过程用图来看更直观。每个解码步会对 HBM 做两次 ND 读和两次 1D 写，而 KV 缓存随序列长度以 O(N) 线性增长。

![图 6](/assets/img/posts/gpt2-to-kimi3/image6.png)

注意这些过量的读写，论文用如下方式替代：

这里存在一个权衡。

在此，我们用 ELU+1 替代 softmax 所用的指数运算，且是在 q、k 交互之前分别施加到两者上。两种方式都会对最终得分做归一化，但线性注意力所用的特征映射是对 softmax 核的一种表达力更弱的近似。这种近似可能降低保真度，不过实际的精度损失取决于具体架构与工作负载。

注意我们仍然要除以 qk 之和（为简洁图中省略）。从高层看，注意力包含三步：

- 让 qk 得分非负。线性注意力用 ELU+1，softmax 用指数。
- 除以总和。
- 计算 value 的加权平均。

这保留了注意力的基本契约，但使用了表达力更弱的特征映射来让 QK 得分非负。

### DeltaNet（快速权重编程器 / Fast Weight Programmers）

一个容量有限的缓存，必须对已存储的信息进行覆盖或合并。来自 token i-1 的状态并没有自己的独立槽位，而是被加到同一个 D×D 矩阵中。因此，新的 query 再也无法检索到每个早期 token 完全隔离的表示。

而这种加法，也正是效率提升的来源。以加法而非拼接来更新缓存，使其不会以 O(N) 增长；但同一操作也会导致信息相互干扰。DeltaNet 正是要解决这种"可恢复性丧失"的问题。

![图 7](/assets/img/posts/gpt2-to-kimi3/image7.png)

Schlag 的论文（Fast Weight Programmers）说得很好："当序列长度超过存储容量时，模型可能陷入过容量（overcapacity）状态。要在这种状态下正常运行，模型应当学会动态地与原存储内容交互，并有选择地决定保留哪些键-值关联、删除哪些。纯粹加法的指令可能并不适合这一目的……如式 17 所示，向一个有限大小的记忆中无休止地添加新关联，终将触及极限。"

让线性注意力具有吸引力的那个状态——N 远大于 D——也暴露了它的主要局限。一旦状态超出其有效容量，关联就开始相互干扰，因为更新是加法的，且没有任何东西离开缓存。

用一个可视化例子更容易理解。

![图 8](/assets/img/posts/gpt2-to-kimi3/image8.jpeg)

取单个关联，写作 S = kᵀ @ v。如果用相同的 key 读回，得到 k @ (kᵀ @ v)，即 (k @ kᵀ) v，也就是 k 的平方范数乘以 v。所以读回的结果是按 key 平方范数缩放后的 v；如果把 k 归一化为单位长度，或者直接把结果除以该范数，就能精确还原 v。

Q 也是一个可学习的指针。Wq 与 Wk 读取同一条残差流（residual stream），而某个事实对应的 query 会指向该事实被写入的 key 方向。更新时，先询问当前 key 从缓存中检索到了什么信息；再从想要存储的 value 中减去这部分已有信息，把 key 乘以该差值，再加回缓存。旧信息被移除，新信息写入其位。

### DeltaNet（用 Delta 规则并行化线性 Transformer）

这是全文最难的一节。我花了大约七个小时才建立起可工作的理解，所以我将从实现出发来展开讲解。简而言之，DeltaNet 用广义 Householder 转移矩阵实现一阶线性递推，从而支持分块（chunk-wise）并行的正向传播，以实现硬件高效的线性时间训练。它把输入和输出切分为若干个大小为 C 的块（chunk），并基于前一个块的最终状态与当前块的查询-键-值（QKV）块来计算每个块的输出。

实际问题在于预填充（prefill）。在长度为 T 的序列上直接实现 Delta 规则，会像这样：

与标准注意力不同，这种形式要求对每个 key 向量都做一次修正，因此通往并行矩阵乘法的路径并不显而易见。即便没有 Delta 规则，直接的线性注意力预填充也仍然是串行的：

分块形式提供了一种更高效的方法。其机理通过一个例子更容易理解：

![图 9](/assets/img/posts/gpt2-to-kimi3/image9.jpeg)

令 C=N 就回到标准的 O(N²) 注意力，而 C=1 则得到常规线性注意力。介于两者之间的取值，是以块内额外计算量为代价，换取更好的硬件利用率。实践中 C 常取 64 或 128，因为张量核（tensor-core）指令在该粒度上效率最高；UMMA 就是一个例子。

这些中间分块（tile）会作为状态更新的一部分，被折叠进 S：

![图 10](/assets/img/posts/gpt2-to-kimi3/image10.jpeg)

在一个块内部，我们做的是 q(kᵀv)——先算得分，这是带掩码的正常注意力顺序。跨块时，我们遵循 (kᵀv)q，也就是递推顺序、先处理状态。注意力以 O(N²) 增长，而这种方式不会。块内我做真正的注意力（带掩码的 QKᵀ 乘以 V），跨块时我把所有东西折叠进状态，再用一次矩阵乘法读回。于是代价被一分为二：一个固定项 2Ld²，是状态相关工作，与 C 完全无关；还有一个增长项 2LCd，是落在对角线上的得分矩阵。完整注意力只是 C=L 的特例，此时第二项变成 2L²d，即二次方。所以 C 取得越小，我做的 FLOPs 就越少。

C=1 在纯 FLOP 意义上最便宜，但在实际墙钟时间上未必。当计算能高效映射到 GPU 的矩阵乘法硬件上时，它可以更快地完成更多算术。

下一步，是把同样的方法推广到 DeltaNet。

![图 11](/assets/img/posts/gpt2-to-kimi3/image11.jpeg)

根本问题很简单：用于纯加法注意力的分块方法，并不能直接套用到 delta 更新上：

为了计算需要减去的信息，我们需要每一个状态。不做某种数学上的重新参数化，就无法用同样的方式并行化。因此作者把 delta 更新从如下形式改写为：

这里，一个串行循环每轮计算一个 delta。重新参数化后的形式是：

这种形式让分块代码能够一次性计算全部 C 个 delta：

这把我们带到了第一个对比点：MHA 与 DeltaNet Transformer 的对比：

![图 12](/assets/img/posts/gpt2-to-kimi3/image12.jpeg)

### 门控 Delta 网络（Gated Delta Net）

现在，我们有了一种对缓存进行精确修改的方法。每来一个新事实（每个新的 key 向量），我们都能精确查看存储在该位置的旧信息，并用我们想要关注的那个新信息替换它。

然而，这种机制只能遗忘"有特定替代品"的关联。它无法在上下文切换时高效地清除多个关联，也无法普遍地让记忆衰减以释放容量。

如果我们做的是纯加法线性注意力：

加入"遗忘"能力会很简单——只需一个参数来控制遗忘状态：

![图 13](/assets/img/posts/gpt2-to-kimi3/image13.png)

这就是 Mamba-2 的贡献。我们先让先前的缓存衰减，再以全强度加入新的缓存，从而防止状态无界增长。

在每个时间步按一个动态比例统一衰减所有键-值关联，是一种可行的方法，也是 Mamba 的做法。但它没有考虑不同键-值关联之间重要性的差异。

也就是说，如果模型需要遗忘某一个特定关联，所有关联都会被同等遗忘。相比之下，Delta 规则可以更新单个事实，却无法让其余事实衰减。

于是，门控 Delta 规则把 Mamba 的门控更新规则与 Delta 规则结合起来。它新增一个参数 alpha：设为 1 时切换到纯 Delta 规则，设为 0 时清空记忆。难点在于用同样的并行分块方法来实现它。

实现上使用了上一节描述的同一套 DeltaNet 重新参数化。数学几乎完全相同，只多了一样东西：一个介于 0 与 1 之间的、数据依赖的标量，用于控制前一状态的衰减。这把有效的键-值关联学习与自适应的记忆管理结合在了一起。

相应的代码改动如下所示：

![图 14](/assets/img/posts/gpt2-to-kimi3/image14.jpeg)

γʳ/γⁱ 项用于累计衰减。一个在时刻 x 写入、在 x+t 读取的 token，会被乘以 αₓαₓ₊₁αₓ₊₂…αₓ₊ₜ。这是前缀和（prefix-sum）计算在乘法意义上的对应物。

由此得到的架构如下：

![图 15](/assets/img/posts/gpt2-to-kimi3/image15.jpeg)

### KDA / Kimi Linear

到了这一步，研究者开始尝试混合模型——在同一个架构中组合多种注意力形式，例如 Gated DeltaNet 与 Mamba 的结合。

Kimi Linear 引起关注，源于一个核心主张：在受控对比下，它的表现优于完整注意力。作者将其定位为一种"即插即用"的架构替代方案，质量更好，且解码吞吐最高可达 6 倍。

Kimi Linear 通过引入细粒度门控来改进 Gated DeltaNet。它不再使用一个单一的标量衰减，而是为每一个通道（channel）学习一个独立的衰减值。

![图 16](/assets/img/posts/gpt2-to-kimi3/image16.jpeg)

KDA 的更新规则大致不变，但代码现在更像这样：

![图 17](/assets/img/posts/gpt2-to-kimi3/image17.jpeg)

这里，alpha.reshape(nb, C, d) 抓住了本文最重要的贡献：对记忆衰减的细粒度控制。

与 DeltaNet Transformer 并列来看，Kimi Linear 架构引入了三项重大改动：

- 它采用混合系统，交错排布多头潜在注意力（MLA）层。
- 它用混合专家（MoE）层替换了 MLP。
- 它通过 alpha 投影为 DeltaNet 增加容量。

![图 18](/assets/img/posts/gpt2-to-kimi3/image18.jpeg)

后续章节会更详细地讲解 MLA 与 MoE。就目前而言，重点是：这不是盲目的规模扩张。额外的容量有着明确的数学目的——逐通道的缩放让模型对记忆衰减拥有更精细的控制。

缩放定律依然有效，但容量必须加在正确的位置、以系统能用得上的形式加入。这一演进链条上的每一种架构，都是为了弥补前一代系统中某个具体的局限而增加的容量。

### Kimi K3

归根结底，KimiK3 的语言主干与上面的 Kimi Linear 模型相似。它包含 23 个四层宏周期（macrocycle）。在每个宏周期里，有三层使用 Kimi Delta 注意力，第四层使用多头潜在注意力（MLA）。第一层使用稠密前馈网络，其余所有层都使用潜在混合专家（latent MoE）。

乍一看，相较于 Kimi Linear 的改动似乎不大：

- 规模的大幅提升
- 每 12 层做一次分块注意力残差（AttnRes）
- MLA 的 query LoRA 与输出门控
- 潜在空间 MoE
- SiTU 激活函数
- 门控 MLA

KDA 提供恒定状态（constant-state）的递推记忆，而周期性的 MLA 层保留了对上下文的完整 softmax 检索。下面这张简化示意图，为后文讨论的改动提供了一个有用的参照。

![图 19](/assets/img/posts/gpt2-to-kimi3/image19.jpeg)

我们从更直接的改动说起：门控 MLA、潜在空间 MoE，以及 SiTU 激活函数。

门控 MLA 决定了从 MLA 检索到的每个特征有多少能进入残差流。它通过与一个由输入投影出的门控做逐元素相乘来实现。

在常规 MoE 中，一个可学习的路由器用点积相似度把每个 token 送往专家网络的一个子集。KimiK3 共有 898 个专家，其中 2 个是共享专家、处理每个 token；在剩余 896 个中，路由器为每个 token 选出 16 个。

KimiK3 还改动了专家激活函数。它不再对 up 投影施加 SiLU、再与门控逐元素相乘、最后做 down 投影，而是改用 SiTU：

模型还会把输入向下投影到共享专家，再向上投影它们的最终求和：

![图 20](/assets/img/posts/gpt2-to-kimi3/image20.jpeg)

这体现出模型推理中一个反复出现的挑战。如果没有融合（fused）内核，新激活函数几乎比原路径慢 3 倍。一个抵消性的优化是：专家在压缩后的潜在空间中运行，这让它们的正向传播快得多，并几乎把 FLOPs 减半。

其余改动是 MLA 的 query LoRA、输出门控，以及每 12 层的分块注意力残差（AttnRes）。AttnRes 会增加约 2% 的推理延迟，但带来两项重要收益：

- 有选择地检索更早的表示，缓解残差稀释（residual dilution）与隐状态增长
- 1.25 倍的计算优势

AttnRes 与 MLA 从不同方向解决了同一个底层局限。KDA 层以恒定大小的状态运行，必然要丢弃信息。MLA 从 token 上下文中检索，而 AttnRes 从更早的、按深度排列的表示中检索。

### AttnRes（注意力残差）

感谢 @chloey3k 在本节提供的帮助。在每次正向传播中，输入会穿过一层层的堆叠。这里，每一层由一个注意力块（KDA 或 MLA）和一个 MLP 或 MoE 块组成。通常，每一层的输入是原始嵌入与之前每一层输出的加和，且权重相等。

![图 21](/assets/img/posts/gpt2-to-kimi3/image21.jpeg)

这里，h_i 是第 i 层的输入，h_1 是当前 token（到目前为止序列中的最后一个 token）的嵌入，而 f_i(h_i) 是第 i 层的输出（一个注意力或 MLP 块）。

问题在于缺乏选择性访问。不同类型的层收到的是同一个聚合状态，尽管它们可能受益于不同的权重。由于递推是纯加法的，后面的层还必须学会越来越大的输出，才能影响累积的残差，这可能使训练不稳定。AttnRes 不再对所有层一视同仁，而是用专门的权重去乘这个和式中的每一项，让模型能够把更大的重要性赋予在上下文中最有用的那些层。

![图 22](/assets/img/posts/gpt2-to-kimi3/image22.jpeg)

每个权重 alpha_i 由一个 query-key 点积计算得出。query 为每个层单独学习，而 key 与 value 来自更早的残差流状态。得分被归一化为总和为 1，然后用来对这些状态形成加权组合。

![图 23](/assets/img/posts/gpt2-to-kimi3/image23.jpeg)

因此，模型不必只依赖于它的直接前驱。AttnRes 让每一层都能选择性地访问更早的层输出，使其学到的 query 能检索出对当前计算最有用的表示。

下面的伪代码在块的粒度上应用了同一思想。一个块是横跨 12 个解码层累积而来的、注意力与 MLP 输出的逐元素加和，被存储为单一的深度表示，供后续的 AttnRes 混合使用。

在每一层都施加残差注意力，会增加过多的训练与推理成本。只在固定的块边界上施加，则能以更低的成本获得大部分收益。在 KimiK3 中，每个边界出现在 12 个解码层之后。在 23 个四层宏周期上，这产生了 8 个 AttnRes 块，从而提升了我们的推理速度。

这可能是 block_attn_res 函数中最重要的一部分。

至此，从 GPT-2 到 KimiK3 的演进就完成了。

核心的变革并不只是规模。每一个架构步骤，改变的都是"模型存什么、如何更新那个状态、以及如何检索固定大小状态所无法保留的信息"。

KimiK3 把恒定状态的递推记忆、周期性的 softmax 检索、稀疏专家容量，以及选择性的按深度残差访问结合在了一起。其结果是一个把额外容量花在"有明确功能角色"之处上的系统。

本质上，一个固定容量（固定维度）的联想记忆需要一套"逐出策略（eviction policy）"，因为一旦达到容量上限，纯粹加法的线性操作终将引入干扰。为此，可学习的"选择性"——如门控、路由或衰减——是必要的；而注意力，是最有效的选择性读取机制。

---

## 第三部分：模块化解读（Modular Interpretation）

> 本节把全文拆成若干"模块"，每个模块给出**核心结论 + 关键数据/机制 + 与产业/本站主题的连接**。文中所指图示均对应第一、二部分的图号。

### 模块一：开篇命题——22,580 倍不是"只是规模"

- **核心**：七年间模型从 GPT-2（124M）放大到 Kimi K3（2.8T），规模放大 22,580 倍；但作者明确抛出一个问题："but is it just... scale?"——答案是否定的。
- **主张**：架构演进的每一步，改变的是"模型**存什么 / 怎么更新状态 / 怎么检索固定状态留不住的信息**"，而非单纯堆参数。这是全文的统领性论点，也是后面所有模块的落脚点。
- **连接**：对"半导体投资"而言，这直接回应当下对"Scaling Law 是否撞墙"的争论——**算力/参数的边际收益，取决于架构能否把新增容量用在"有明确功能角色"的地方**。

### 模块二：GPT-2 基线——decoder-only 与 KV 缓存的代价

- **机制**：仅解码器架构，token + 位置嵌入；每个块含注意力 + FFN；LM head 把隐状态映射到词表 logits，解码时只用最后一位。
- **关键代价**：每步解码只消费最终位置 logits，却为所有位置都算了表示 → **KV 缓存**由此而生（存下历史 K/V 避免重算），但缓存随序列长度 O(N) 增长，**会变成显存带宽瓶颈**。
- **关键数据**：基线 124M（5万词表 / 12 层 / 12 头 / dim 768）；Kimi K3 = 2.8T ≈ 22,580 个 GPT-2。
- **连接**：KV cache 的 HBM 带宽瓶颈，正是 **HBM 容量/带宽、推理卡显存、长上下文成本** 的产业命题根源——本站多次讨论的"推理侧"约束在此有了架构层面的注脚。

### 模块三：线性注意力——把 O(N²) 折叠成固定状态

- **机制**：用特征映射（ELU+1）分别作用于 q、k，使 QK 乘积可重新结合，把不断增长的 K/V 折叠进固定 D×D 状态，从而摆脱对完整 N×N 注意力矩阵的依赖。
- **权衡**：线性注意力是对 softmax 核的"表达力更弱的近似"，可能损精度（取决于架构/负载）。
- **注意**：作者澄清 O(N²) 的提法来自 2020 年（FlashAttention 之前）的训练/实现现实，而非理论下限——这是读这类文章容易踩的坑。
- **连接**：**张量核利用率、分块粒度（C=64/128）** 是硬件效率关键；线性注意力把"算力 vs 带宽"的博弈从注意力矩阵转向固定状态读写。

### 模块四：DeltaNet——用"delta 规则"解决可恢复性

- **问题**：固定容量缓存用"纯加法"更新（信息叠加进同一 D×D 矩阵），一旦序列长度超过容量（overcapacity 状态），关联开始相互干扰、且信息不可孤立恢复。
- **解法（delta rule）**：Q 是可学习指针；更新时先查询"当前 key 从缓存检索到什么"，再从待存 value 中减去该部分，只写入差异（old out, new in）。
- **并行化难点**：delta 更新需要"减去已存信息"，无法直接套用纯加法的分块并行 → 作者用**广义 Householder 转移矩阵 + 重新参数化**，实现 chunk-wise 并行、硬件高效的线性时间训练（见 图 9–12）。
- **关键直觉**：块内做"真注意力"（masked QKᵀ·V），跨块折叠进状态 + 一次 matmul 读回；代价拆成固定项 2Ld² 与随 C 增长项 2LCd，C 越小 FLOPs 越少。

### 模块五：Gated DeltaNet——遗忘与门控（Mamba-2 思路）

- **delta 的短板**：只能"用特定替代品覆盖"某一关联，无法在上下文切换时批量清除、也无法普遍衰减以释放容量。
- **Mamba-2 贡献**：先衰减旧缓存、再以全强度加入新缓存，防止状态无界增长——但"统一衰减"不区分关联重要性。
- **Gated Delta = Mamba 门控 + Delta 规则**：新增数据依赖标量 α（α=1 纯 delta，α=0 清空），用同一套并行分块实现；γ 项对应"累积衰减的前缀积"（见图 13–15）。

### 模块六：Kimi Linear / KDA——细粒度门控 + 混合架构

- **主张**：受控对比下优于完整注意力，质量更好、解码吞吐最高 **6×**，定位"即插即用"替代。
- **核心改进**：把"单一标量衰减"升级为**逐通道（per-channel）独立衰减值**（α.reshape(nb,C,d)，见图 16–17）——这是全文最重要的贡献点：对记忆衰减的细粒度控制。
- **三项架构改动**：① 交错 MLA 层；② MoE 替换 MLP；③ alpha 投影为 DeltaNet 增容（见图 18）。
- **点睛**：这不是盲扩——每加一份容量，都对应前代一个具体局限，且有明确数学用途。

### 模块七：Kimi K3——把一切组合（MLA / MoE / AttnRes / SiTU）

- **主干**：23 个四层宏周期；每周期 3 层 Kimi Delta Attention + 1 层 MLA；首层稠密 FFN，其余 latent MoE。
- **直接改动**：
  - **Gated MLA**：门控决定检索特征有多少进入残差流。
  - **MoE**：898 专家（2 共享 + 每 token 选 16/896）；用 **SiTU** 替代 SiLU 路径（无融合内核时约慢 3×，但专家在压缩潜在空间运行、FLOPs 近乎减半，见图 19–20）。
  - **AttnRes**（每 12 层）：+2% 延迟，换来选择性检索更早表示（缓解残差稀释/隐状态增长）+ **1.25× 计算优势**；23 宏周期 → **8 个 AttnRes 块**（见图 21–23）。
  - 另含 MLA query LoRA、输出门控。
- **一句话总结架构哲学**：KDA 给"恒定状态递推记忆"，周期性 MLA 保留"完整 softmax 检索"，二者从不同方向补同一个底层局限（固定状态必然丢信息）。

### 模块八：一条主线——固定容量联想记忆需要"逐出策略"

- 全文收敛到一句话：**固定维度联想记忆必须有"逐出策略（eviction policy）"**，否则纯加法一旦到容量上限就引入干扰；可学习的"选择性"（门控 / 路由 / 衰减）是必要的，而**注意力是最有效的选择性读取机制**。
- 这解释了为什么现代大模型普遍走向"混合"： recurrent/linear 负责恒态高效，attention/MLA 负责按需精确检索，MoE 负责稀疏容量，AttnRes 负责跨深度选择性访问。

### 模块九：产业 / 投资视角（个人观点，非建议）

- **推理效率 > 裸算力**：Kimi 路线强调"解码吞吐 6×、计算 1.25×、FLOPs 近半"——在推理成本主导商业化的阶段，**架构带来的单位算力产出**比堆卡更重要。利好推理侧优化（内核融合、MoE 调度、显存/带宽）。
- **HBM 与带宽仍是硬约束**：KV cache 瓶颈、latent 空间压缩、固定状态递推，本质上都在和"显存带宽/容量"博弈——印证本站对 HBM、先进封装（CoWoS）、高带宽互连机会的判断。
- **混合架构成主流范式**：linear/recurrent + attention + MoE + 跨深度残差，正在成为前沿大模型标准配方；相关**训练框架、算子库、专用推理芯片**有结构性机会。
- ⚠️ **风险提示**：本文为技术 worklog（作者未署名、年份为标注值），部分数据（2.8T、898 专家、6× 吞吐）应以 Kimi 官方公布为准；架构结论随代际快速变化，且文章不含任何财务/投资建议，本模块仅为技术-产业映射的学习性推演。

---

*原文：本地文档《22580-From GPT2.0 to Kimi3.0, Explained》（worklog，作者未署名）。英文原文与中文翻译经整理后一并发布，著作权归原作者所有。*
