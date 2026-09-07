---
layout: post
title: "推理系统 03：逐项算清一个真实 Qwen3 Transformer 层"
date: 2026-09-06 23:30:00 +0800
categories: [人工智能, 推理系统]
tags: [Qwen, Transformer, RMSNorm, RoPE, GQA, SwiGLU, vLLM]
description: "从 [T,4096] 出发，推导 Qwen3-8B 的 RMSNorm、Q/K/V、头内归一化、RoPE、GQA、两次残差与门控 MLP，并用可计算的缩小模型验证因果性。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章：文本到张量](/posts/inference-02-text-to-tensor/) · [下一章：logits 与采样](/posts/inference-04-logits-sampling/)

第 2 章把 Token ID 变成了隐藏向量。本章接住这个张量，沿一个 Transformer 层走到底。读完之后，你应当能给出每个主要张量的形状，说明哪个操作混合了位置、哪个操作只变换特征，以及为什么层的输入输出形状相同，数值却已经不同。

我们使用 Qwen3-8B 的固定配置：隐藏维度 d=4096，Query 头数 Hq=32，KV 头数 Hkv=8，单头维度 dh=128，MLP 中间维度 f=12288，共 36 层。配置修订仍为 `b968826d9c46dd6066d109eabc6255188de91218`。这里推导其中一层，不把不同层的权重视为共享。

## 1. 数值实验：小到可以核对，大到保留结构

<iframe src="/assets/interactive/transformer-layer/" title="Transformer 层逐项数值实验" loading="lazy" style="width:100%;height:1000px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

[全屏打开实验](/assets/interactive/transformer-layer/)

实验真正执行矩阵运算，不只是播放预设动画。它使用 3 个位置、4 维隐藏状态、2 个 Query 头、1 个 KV 头、2 维单头和 6 维 MLP。权重完全人为设定；归一化的 gamma 取 1，epsilon 为 10⁻⁶。网页的 JavaScript 双精度结果不等同于 BF16 实机结果。

先保持三个开关开启，沿 22 步走一遍。然后只改变最后位置的输入：前两个位置的最终输出应该不变。关闭因果掩码再试，它们就可能变化。这个实验检验的是运算关系，不是语言生成能力。

## 2. 先把整个层写成两条残差方程

省略批次维度，以行向量为约定，输入 X 的形状为 [T,d]。一个 Qwen3 层可以概括为：

$$
R=X+\operatorname{Attention}(\operatorname{RMSNorm}_1(X)),
$$

$$
Y=R+\operatorname{MLP}(\operatorname{RMSNorm}_2(R)).
$$

这里 Attention 包含 Q/K/V 投影、Q/K 头内归一化、RoPE、带掩码的注意力和输出投影。MLP 包含 gate、up、SiLU、逐元素乘法和 down 投影。

注意第二个归一化读取 R，第一次残差保留原始 X；不能把归一化后的 X̂ 当成残差直接相加。输入层归一化与注意力后归一化也有各自的可学习参数。

整个层保持 [T,d]。这让多个层能够串接，但它们各自学习不同变换。第一个层通常接收嵌入，后续层接收前一层输出；36 层之后还有模型级最终归一化和输出头，它们不属于本章这一个层的内部。

## 3. RMSNorm：沿哪一维，除以什么

对某个位置的向量 x∈ℝᵈ，定义：

$$
\operatorname{RMSNorm}(x)_j
=\gamma_j\frac{x_j}{\sqrt{\frac{1}{d}\sum_{k=0}^{d-1}x_k^2+\epsilon}}.
$$

它先沿特征维度计算均方，再取平方根并加入数值稳定项。每个位置独立计算，不对 T 个位置求平均；这保证归一化本身不会让未来位置泄漏到过去。

例如 x=[1,0,−1,0.5]，均方为 2.25/4=0.5625。取 gamma=1，忽略极小 epsilon，分母约为 0.75，结果约为 [1.3333,0,−1.3333,0.6667]。可在实验第 2 步核对。

RMSNorm 不减去均值，因此结果不保证均值为零。gamma 是逐特征可学习的尺度，不必为 1。epsilon 和 gamma 也意味着不能无条件地说输出 RMS 严格等于 1。它与 LayerNorm 的区别及设计动机见 [RMSNorm 论文](https://arxiv.org/abs/1910.07467)。

工程上，参考实现把均方计算提升到 FP32，再转换回输入类型；这说明“模型以 BF16 推理”不代表所有中间运算都只有 BF16 精度。高效内核可能融合规约和缩放，但仍应遵守相应数值语义。

## 4. Q/K/V 是三组不同的投影

令 X̂=RMSNorm₁(X)。采用右乘权重的数学记法：

$$
Q_f=\hat XW_Q,\quad K_f=\hat XW_K,\quad V_f=\hat XW_V.
$$

| 权重 | 数学形状 | 投影输出 | 拆头后的逻辑形状 |
|:--|:--|:--|:--|
| WQ | [4096,4096] | [T,4096] | [T,32,128] |
| WK | [4096,1024] | [T,1024] | [T,8,128] |
| WV | [4096,1024] | [T,1024] | [T,8,128] |

这里 1024=8×128。Qwen3-8B 配置关闭 attention bias，因此上述投影没有额外偏置。

PyTorch 的 `Linear(in,out)` 参数通常存成 [out,in]，计算是 XWᵀ。表格采用 [in,out] 是为了数学推导直观；查阅 checkpoint 或源码时必须把转置约定对齐，不能误判参数形状。

Q 可以理解为当前位置用来匹配的向量，K 为可匹配的向量，V 为随后聚合的内容向量。但“问题、地址、内容”只能作类比。三者都是学习到的数值投影，并不携带人能直接读出的标签。

拆头 reshape 不会凭空增加元素。真实实现还可能 transpose 成 [B,H,T,dh]，或采用打包布局；形状的轴顺序与张量是否物理连续必须分别讨论。

## 5. Qwen3 的关键细节：Q/K 还要沿单头归一化

在投影和拆头之后，Qwen3 对每个 Query 与 Key 向量做单头维度的 RMSNorm：

$$
\bar q_{t,h}=\operatorname{RMSNorm}_Q(q_{t,h}),\qquad
\bar k_{t,g}=\operatorname{RMSNorm}_K(k_{t,g}).
$$

这次求平均的长度是 128，不是隐藏维度 4096，也不是所有头一起的长度。参考实现的 Q norm 和 K norm 各有一个长度 128 的尺度向量，分别在本类各头之间复用。它们不是 32 或 8 套独立尺度向量。V 不经过这两个归一化。

所以，输入 RMSNorm、Q norm、K norm 不是同一操作的重复命名：输入归一化作用于投影前隐藏状态，头内归一化作用于投影后 Q/K。直接套用没有 QK Norm 的通用注意力图，会漏掉 Qwen3 的实际路径。

这一顺序可在 [Transformers v4.51.3 的 Qwen3Attention](https://github.com/huggingface/transformers/blob/v4.51.3/src/transformers/models/qwen3/modeling_qwen3.py) 对照。它是数学语义参考，不表示 vLLM 在服务时逐行调用这份实现。

## 6. RoPE：把位置写进点积的相对关系

对二维子空间，旋转矩阵为：

$$
R(\alpha)=\begin{bmatrix}\cos\alpha&-\sin\alpha\\\sin\alpha&\cos\alpha\end{bmatrix}.
$$

位置 p 对第 r 组二维分量施加角度 pωᵣ，基本频率形式为：

$$
\omega_r=\theta^{-2r/d_h},\qquad r=0,\ldots,d_h/2-1.
$$

本章固定配置的 theta 为 1000000，未配置额外 rope scaling。对 Q/K 应用旋转后，记为 q̃、k̃。V 不旋转。

为什么它能引入相对位置？对列向量形式的二维 q、k：

$$
(R(p\omega)q)^\mathsf T(R(s\omega)k)
=q^\mathsf TR((s-p)\omega)k.
$$

使用了 Rᵀ(pω)R(sω)=R((s−p)ω)。在固定的未旋转 q/k 下，位置进入点积的方式依赖差值 s−p。原理见 [RoFormer / RoPE 论文](https://arxiv.org/abs/2104.09864)。

真实布局还有一个需要注意的细节：本章参考实现的 `rotate_half` 把前半维与后半维配对，即 (0,64)、(1,65)…，而不是直接假设 (0,1)、(2,3)…。这与二维旋转的数学思想兼容，但对照实际张量时不能忽略坐标排列。

玩具 dh=2，只有一组频率且 ω₀=1。把所有位置一起平移，注意力结果应在浮点容差内不变；单独改变相对距离则通常会变化。这个实验验证二维旋转性质，不证明模型在任意超长上下文仍然可靠。位置外推还受到训练范围、频率分布与扩展策略影响。

## 7. GQA：共享 K/V，不共享注意力概率

32 个 Query 头对应 8 个 KV 头，分组数为 32/8=4。按参考实现的头顺序，可写映射：

$$
g(h)=\lfloor h/4\rfloor.
$$

Q 头 0—3 使用 KV 头 0，Q 头 4—7 使用 KV 头 1，依此类推。各 Q 头仍有不同 Query，因此算出的分数和概率通常不同。

对 Query 头 h、查询位置 t、候选位置 s：

$$
S^{(h)}_{t,s}=\frac{\tilde q_{t,h}^{\mathsf T}\tilde k_{s,g(h)}}{\sqrt{128}}+M_{t,s}.
$$

共享减少了 K/V 投影输出和缓存量，却没有把 Query 头数从 32 改成 8，也不能直接把注意力乘法量当作四分之一。GQA 在 MHA 和 MQA 之间建立共享程度的取舍，背景见 [GQA 论文](https://arxiv.org/abs/2305.13245)。

参考 eager 路径可能通过扩展 KV 头来表达计算；优化内核可以按组读取，避免为共享复制完整缓存。数学上可重复使用一个向量，不意味着物理缓存必须存四份。

## 8. 掩码、缩放与 Softmax 各自解决什么

完整单序列 Prefill 的因果掩码为：

$$
M_{t,s}=\begin{cases}0,&s\le t,\\-\infty,&s>t.\end{cases}
$$

未来位置在 Softmax 后得到零权重。行表示查询位置，列表示被读取位置，因此图中右上角被遮住。不同约定下图可能转置，不能只靠三角形朝向判断正确性。

缩放因子 1/√dh 用于控制点积随维度增长的量级。经典独立、零均值、单位方差分量假设下，未缩放点积方差约为 dh。Qwen3 的 Q/K Norm 与学习尺度会改变实际统计分布，但并未取消实现中的 1/√dh。

对一行分数 z，数值稳定的 Softmax 写成：

$$
a_s=\frac{\exp(z_s-m)}{\sum_j\exp(z_j-m)},\qquad m=\max_jz_j.
$$

减去最大值不改变精确数学结果，因为分子分母同时乘了 exp(−m)，但能降低指数溢出风险。分母沿候选 Key 位置求和，不是沿所有头求和。

合法可见位置的概率和为 1。完整 Prefill 的位置至少能读自己，因此不会出现全行被遮住的情况；通用批处理实现还必须妥善处理 padding 等边界。注意力概率是内部混合权重，不是事实正确率，也不是最终词表概率。

## 9. 聚合 V、拼接头，再投影回隐藏空间

每个 Query 头产生：

$$
o_{t,h}=\sum_{s\le t}a^{(h)}_{t,s}v_{s,g(h)}.
$$

同一个头内，输出向量是可见 V 的加权和。然后沿特征维拼接所有头：

$$
C_t=\operatorname{Concat}(o_{t,0},\ldots,o_{t,31})\in\mathbb R^{4096},
\qquad A=CW_O.
$$

WO 为 [4096,4096]。拼接是把各头结果排在一起，并非把 32 个头相加。输出投影可以在不同头贡献之间进行线性混合。输出 A 形状为 [T,4096]，现在才与原始 X 相加得到 R。

注意力分支改变了每个位置能获得的信息，但残差把原始状态也保留下来。这不等于简单复制输入：数值相加会把分支计算加入后续层的状态。

## 10. 门控 MLP：混合特征，而非再次混合 Token

令 Z=RMSNorm₂(R)。两条投影同时读取 Z：

$$
G=ZW_{gate},\qquad U=ZW_{up},\qquad G,U\in\mathbb R^{T\times12288}.
$$

定义 SiLU：

$$
\operatorname{SiLU}(z)=z\sigma(z)=\frac{z}{1+e^{-z}}.
$$

MLP 输出为：

$$
F=(\operatorname{SiLU}(G)\odot U)W_{down},\qquad Y=R+F.
$$

这里 ⊙ 是逐元素乘法。gate、up 权重形状均为 [4096,12288]，down 为 [12288,4096]，均无偏置。三个矩阵不能被简写为一个普通的“先升维再降维”两矩阵结构。

门控中的 SiLU 输出可以为负，也可以大于 1，不是开关概率。SwiGLU 是这种门控形式的常用名称，其思想背景见 [GLU Variants Improve Transformer](https://arxiv.org/abs/2002.05202)。

MLP 对每个位置使用相同权重独立计算，不跨位置进行加权求和。它虽然不直接读取其他 Token 行，但其输入 R 已经包含注意力聚合的上下文，所以也不能说它“与上下文无关”。

最后一次残差后，Y 仍为 [T,4096]。这是交给下一层的隐藏状态，不是词表概率，也不是 Token ID。

## 11. 把形状转成可核对的参数与运算量

只算本层主要线性矩阵：

$$
P_{attn}=d(H_qd_h)+2d(H_{kv}d_h)+(H_qd_h)d
=41943040.
$$

$$
P_{MLP}=3df=150994944.
$$

两者合计 192937984 个参数。再加入两个长度 4096 的层 RMSNorm 与两个长度 128 的 Q/K norm，共增加 8448 个参数，得到本层 192946432。这里不含嵌入、最终归一化和 LM Head。36 层权重各自不同，总参数核算应另外加上层外组件。

MLP 占主要线性权重约 78.3%。这能帮助解释为什么只盯住 attention 可能漏掉大量计算和参数，但不能据此断言 MLP 占运行时间的同样比例。

采用一次乘法加一次加法记作 2 FLOPs 的约定，主要投影的理论计算量约为：

$$
F_{linear}\approx2T(P_{attn}+P_{MLP}).
$$

T=128 时约为 49.39 GFLOPs。若按完整方阵计算 QKᵀ 与 AV，两者合计约：

$$
F_{attention,dense}\approx4H_qT^2d_h,
$$

此时约为 0.268 GFLOPs。因果优化可以跳过部分区域，这个表达式不是对具体内核指令数的精确统计，也没算归一化、RoPE、Softmax 和门控逐元素运算。

两项分别随 T 与 T² 增长，所以上下文变长时比例会改变。Decode 又使用少量新 Query 对大量缓存 Key，形状不同。理论 FLOPs 不能直接除以设备峰值就宣称获得真实延迟，后面章节会引入访存和测量。

## 12. 哪些张量保留，哪些只是中间结果

该层在每个历史位置保留 K/V，典型路径中的 Key 已经过 Q/K norm 与 RoPE。单层、单位置、BF16 的理论缓存字节数为：

$$
2\times8\times128\times2=4096\ \text{bytes}=4\ \text{KiB}.
$$

36 层合计就是第 1 章的 144 KiB/位置。Query 通常不作为自回归历史缓存保留；它代表当前正在查询的位置。

注意力概率矩阵则是数学表达中的中间量。教学页为了检查行和与掩码而完整显示它；分块融合的注意力内核可以避免把完整 [T,T] 概率矩阵写回设备内存。张量“在公式中存在”与“在显存中分配完整缓冲区”是两回事。

训练为反向传播保留的激活与推理需求也不同。本章讲推理，不能把训练激活内存直接套入请求预算。

## 13. 对照 vLLM：相同数学，不同执行组织

以 [vLLM v0.10.2 的 qwen3.py](https://github.com/vllm-project/vllm/blob/v0.10.2/vllm/model_executor/models/qwen3.py) 为入口，可以看到专门的并行线性层、旋转位置处理和 Attention 组件。它组织的是推理执行路径。

Q/K/V 可以通过合并投影组织，gate/up 也可合并计算；合并并不意味着三者共享权重。多个数学步骤还可能被融合为设备内核，残差状态也可能通过融合接口跨调用传递。源码中的一次函数调用不必对应公式中的一个方框。

多卡下投影权重可能分片，部分输出需要通信归并，因此本章完整矩阵是全模型的逻辑视角。单卡 NPU 后端和 NVIDIA GPU 后端也可能选择不同算子与布局。不能把参考 PyTorch 语义、vLLM 调度以及具体设备内核混成同一层抽象。

## 14. 三个可以证伪的实验

**实验一：修改未来。**保持掩码开启，将最后位置 x₂[0] 从 1 改成 −3。前两个位置的最终输出最大差应为零。因为归一化和 MLP 按行执行，注意力又遮住未来，整个层都不能把第三行变化传给前两行。关闭掩码就移除了这一保证。

**实验二：共同移动位置。**开启 RoPE，把位置从 [0,1,2] 改为 [7,8,9]。未旋转向量不变、相对距离不变，输出在浮点容差内应一致。实验只验证基本 RoPE 的固定向量性质，不验证任意上下文外推能力。

**实验三：同一 KV，不同 Query。**在两个 Query 头之间切换。K、V 相同，分数和概率却一般不同。这正是“共享 K/V”与“共享注意力结果”的区别。

## 15. 练习与答案

**问题一：**把 Hkv 从 8 改成 32，其他维度保持不变，KV 缓存怎样变化？Q 投影是否变大？

<details><summary>展开答案</summary><p>理论 KV 容量变成四倍，K/V 投影输出也变成四倍；Q 头数没有改变，Q 投影不变。总模型参数与运算量需按各项重新计算，不能把整个模型简单乘四。</p></details>

**问题二：**输入 RMSNorm 已经执行过，为什么不能把 Q/K norm 删除而认定结果等价？

<details><summary>展开答案</summary><p>投影改变向量的维度和数值分布；Q/K norm 又沿单头维度使用独立参数。归一化与任意线性变换一般不可交换，删除它会改变训练模型定义的函数。</p></details>

**问题三：**attention 输出是 V 的加权和，是否能说整个层输出始终位于 V 的凸包内？

<details><summary>展开答案</summary><p>不能。单个头在 Softmax 权重非负且和为 1 的条件下，其加权输出属于对应 Value 集合的凸包。后续拼接、输出投影、残差和非线性 MLP 已改变这一讨论空间。</p></details>

**问题四：**完整层输出还是 [T,4096]，是否说明它没有减少或增加信息？

<details><summary>展开答案</summary><p>形状相同只说明元素数量相同，不保证变换可逆或信息论意义上的保持。归一化、投影、非线性与上下文混合都需要分别分析。</p></details>

下一章会在最终隐藏状态之后接上输出头，讨论 logits、稳定 Softmax、温度、top-k/top-p 与随机采样，解释向量怎样成为下一个 Token。

## 来源与实验边界

- [固定模型配置](https://huggingface.co/Qwen/Qwen3-8B/blob/b968826d9c46dd6066d109eabc6255188de91218/config.json)：本章形状与配置参数来源。
- [Transformers v4.51.3 Qwen3 实现](https://github.com/huggingface/transformers/blob/v4.51.3/src/transformers/models/qwen3/modeling_qwen3.py)：语义顺序核对，尤其 QK norm、RoPE 配对与残差。
- [vLLM v0.10.2 Qwen3 实现](https://github.com/vllm-project/vllm/blob/v0.10.2/vllm/model_executor/models/qwen3.py)：推理执行组织的源码入口。
- [独立教学计算源码](/assets/interactive/transformer-layer/core.js)：固定玩具权重与完整层计算，可在浏览器或 Node.js 中检查。

真实模型配置、数学推导与人造数值实验分别呈现。网页不加载 Qwen 权重，不执行 vLLM，不报告 GPU/NPU 实测性能。
