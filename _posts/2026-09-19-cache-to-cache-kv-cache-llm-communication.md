---
layout: post
title: "Cache-to-Cache（C2C）：让大模型绕过文本直接交换 KV-Cache —— ICLR 2026 论文全文精读"
date: 2026-09-19 09:00:00 +0800
categories: [AI 推理, 论文精读]
tags: [LLM, KV-Cache, 多模型协作, 推理加速, 论文精读, ICLR2026]
description: "通读 arXiv:2510.03215（ICLR 2026 已接收）全文：C2C 用一个神经网络把源模型的 KV-Cache 投影融合进目标模型，让模型之间绕过文本直接交换语义。准确率较单模型提升 6.4-14.2%、较文本通信提升 3.1-5.4%，延迟平均快 2.5 倍。含英文原文全文（15 张表、13 组图）与中文结构化解读。"
math: true
toc: true
---

> **来源**：Tianyu Fu, Zihan Min, Hanling Zhang, Jichao Yan, Guohao Dai, Wanli Ouyang, Yu Wang. *Cache-to-Cache: Direct Semantic Communication Between Large Language Models*. **ICLR 2026**（已接收）。清华大学 THU-NICS 等。
>
> **原文**：arXiv:2510.03215 —— [摘要页](https://arxiv.org/abs/2510.03215) ｜ [HTML 全文](https://arxiv.org/html/2510.03215v2) ｜ [PDF](https://arxiv.org/pdf/2510.03215)。v1 提交于 2025-10-03，v2 修订于 2026-03-02（本篇依据 v2）。
>
> **代码**：<https://github.com/thu-nics/C2C> ｜ DOI：<https://doi.org/10.48550/arXiv.2510.03215>
>
> **转载说明**：第一部分为论文英文原文的完整转载（含全部 15 张表格与 13 组配图，仅调整排版层级、统一数学记号），版权归原作者所有；第二部分为独立撰写的中文结构化解读，其中带有质疑与边界的判断属于解读者的观点，不代表原作者立场。

## 论文速览

| 项目 | 内容 |
|---|---|
| 标题 | Cache-to-Cache: Direct Semantic Communication Between Large Language Models |
| 作者 | Tianyu Fu, Zihan Min, Hanling Zhang, Jichao Yan, Guohao Dai, Wanli Ouyang, Yu Wang |
| 机构 | 清华大学（THU-NICS 等） |
| 发表 | ICLR 2026（已接收） |
| 主题 | 多 LLM 协作、KV-Cache 通信、推理加速 |
| 一句话 | 让两个大模型不必「传话」，而是把 KV-Cache 投影融合，实现语义直连 |
| 关键收益 | 较单模型 +6.4~14.2% 准确率；较文本通信 +3.1~5.4%，平均 2.5× 延迟加速 |
| 训练成本 | 只训融合器，300 步（<9 GPU 小时）即可接近最终效果 |
| 代码 | <https://github.com/thu-nics/C2C> |

# 第一部分：英文原文（Original Paper）

## Abstract

Multi-LLM systems harness the complementary strengths of diverse Large Language Models, achieving performance and efficiency gains that are not attainable by a single model.
In existing designs, LLMs communicate through text, forcing internal representations to be transformed into output token sequences.
This process both loses rich semantic information and incurs token-by-token generation latency.
Motivated by these limitations, we ask: *Can LLMs communicate beyond text?*
Oracle experiments show that enriching the KV-Cache semantics can improve response quality without increasing cache size, supporting KV-Cache as an effective medium for inter-model communication.
Thus, we propose Cache-to-Cache (C2C), a new paradigm for direct semantic communication between LLMs.
C2C uses a neural network to project and fuse the source model’s KV-cache with that of the target model to enable direct semantic transfer.
A learnable gating mechanism selects the target layers that benefit from cache communication.
Compared with text communication, C2C utilizes the deep, specialized semantics from both models, while avoiding explicit intermediate text generation.
Experiments show that C2C achieves 6.4-14.2% higher average accuracy than individual models.
It further outperforms the text communication paradigm by approximately 3.1-5.4%, while delivering an average 2.5× speedup in latency.
Our code is available at [https://github.com/thu-nics/C2C](https://github.com/thu-nics/C2C).

## 1 Introduction

![图 1｜T2T 文本通信与 C2C 缓存通信的范式对比](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig01-scheme.png)

*Figure 1: (a) Previous Text-to-Text (T2T) communication passes information through explicit text generation. (b) Our Cache-to-Cache (C2C) communication directly projects and merges KV-Cache with rich semantics from different LLMs.*

With the rapid progress of Large Language Models (LLMs) (Guo et al., 2025; Yang et al., 2025a; OpenAI, 2025), they are now applied across increasingly diverse domains and tasks.
To meet versatile demands, LLMs are trained with distinct focuses, such as coding (Hui et al., 2024), mathematics (Yang et al., 2024a), visual understanding (Bai et al., 2025), edge computing (Zhang et al., 2024b), and so on.
Meanwhile, general-purpose LLMs can also simulate specialized capabilities through prompt engineering, enabling flexible role adaptation across downstream applications.

Leveraging the diversity of LLMs, many multi-LLM systems are proposed to further enhance overall performance and efficiency (Guo et al., 2024; Tran et al., 2025).
In **collaborative multi-LLM systems** (Li et al., 2023; Wu et al., 2023), LLMs are assigned distinct roles and proactively exchange text messages.
Mirroring human collaboration, these systems accumulate partial understandings or sub-solutions from different agents via verbal communication. They harness the collective capabilities of multiple LLMs to solve complex problems that a single model cannot.
By contrast, **routing-based** multi-LLM inference systems rely on passive context inheritance rather than active message exchange.
These systems coordinate models of varying parameter sizes or reasoning depths for more dynamic and efficient responses (Li et al., 2024; Fu et al., 2025a; Ong et al., 2024; OpenAI, 2025).
Downstream models inherit the context from preceding models in multi-round conversations, then generate follow-up responses to the new questions based on their own understanding of the conversation history.

However, current text-to-text (T2T) interfaces restrict information exchange among LLMs, particularly when conveying rich or diverse semantic interpretations of a shared context.
As illustrated in Figure 2, these limitations arise from several inherent constraints of T2T communication.
First, as a low-bandwidth medium, text introduces an information bottleneck. The high-dimensional internal representations must be repeatedly compressed into linear strings and then decompressed by the receiver LLM.
When models differ in knowledge or assigned roles, some signals may be irrecoverable (e.g., interpreting `<p>` as a section marker).
Second, natural language is inherently ambiguous, with idioms, underspecified references, and vague expressions.
Although recent agent protocols aim to standardize text messages (Anthropic, 2024; Surapaneni et al., 2025), rigid templates remain insufficient for flexible, open-domain collaboration.
Third, T2T communication incurs noticeable latency.
Every exchange requires exhaustive, token-by-token decoding of contextual explanations in sequence.
These limitations motivate a key question:

*Can LLMs communicate beyond text?*

In this work, we explore using KV-Cache as the medium for LLM communication.
KV-Cache is a naturally richer representation than text. It also enables fully parallel communication through direct projection, avoiding the slow sequential decoding in text exchanges.
Our oracle experiments show that
(1) enriching KV-Cache under the same context length increases accuracy,
(2) KV-Cache is convertible between LLMs,
(3) different LLMs encode distinct semantic understandings and contextual knowledge of the same input, reflecting their complementary strengths.

Encouraged by these findings, we propose Cache-to-Cache (C2C), a new paradigm for richer and faster multi-LLM communication. As shown in Figure 1(b), C2C projects the KV-Cache from a source model into the space of a target model and merges them through a neural cache fuser.
Experiments show that C2C achieves 6.4-14.2% higher average accuracy than individual models. It further outperforms the T2T paradigm by approximately 3.1-5.4%, while delivering an average 2.5$\times$ speedup in latency.

![图 2｜Coder–Writer 协作场景下 T2T 与 C2C 的概念对比](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig02-idea.png)

*Figure 2: Conceptual comparison of T2T and C2C communication in a Coder-Writer collaboration example. In T2T, the Coder’s ambiguous text instruction fails to convey the structural semantics of `<p>` as a paragraph separator, causing the Writer to misplace the content. C2C directly projects the Coder’s KV-Cache into the Writer, transferring both the semantic understanding and precise insertion location without intermediate text generation.*

## 2 Related Work

### 2.1 KV-Cache Sharing and Reuse

Based on the similarity of KV-Cache between layers, intra-model cache sharing methods (Yang et al., 2024b; Wu and Tu, 2024; Sun et al., 2024; Brandon et al., 2024; Wu et al., 2025) have been proposed to reuse shallow layers’ KV-Cache for deeper layers to accelerate single LLM inference.
Another research focus is to reuse a portion of KV-Cache (e.g., common prefix, reference documents) for the same model in multiple user queries (Bang, 2023; Ye et al., 2024; Yao et al., 2024; Qin et al., 2024; Yang et al., 2025b; Ye et al., 2025; Eyuboglu et al., 2025).
DroidSpeak (Liu et al., 2024a) extends cache reuse to models fine-tuned from the same base model.
Unlike existing works that focus on computational efficiency through cache reuse, our approach leverages the KV-Cache as a medium for semantic transfer between LLMs.
Furthermore, unlike existing cache sharing methods that are restricted to only a single model or models with identical structure and size, our method supports sharing across different model families and varying model sizes.

### 2.2 Multi-LLM Systems

**Collaborative multi-LLM systems**.
Collaborative systems treat multiple LLMs as peers that exchange information to improve collective performance.
Chain-of-Agents (Zhang et al., 2024c) and MetaGPT (Hong et al., 2023) create sequential message flows where agents directly communicate using natural language interfaces.
Mixture-of-Agents (Wang et al., 2024), DyLAN (Liu et al., 2024b), and Owl (Hu et al., 2025) introduce layered communication architectures. Target LLMs aggregate messages from multiple models using voting or summarization mechanisms.
Multi-agent debate methods (Estornell and Liu, 2024; Liang et al., 2024; Du et al., 2023) involve iterative communication rounds, letting LLM agents discuss and refine responses.
Recent works such as MCP Anthropic (2024) and A2A Surapaneni et al. (2025) establish formal text protocols beyond natural language, standardizing agent interaction and tool usage in collaborative multi-LLM systems.
These approaches rely on text-level interfaces, where communication requires one model to generate text token-by-token and another to ingest it as input.
Our work explores a deeper and more efficient collaboration (Pidkuiko and Starkov, 2025; Zheng et al., 2025b) by directly sharing internal KV-Cache representations.

**Routing-based multi-LLM inference systems**.
To accelerate LLM inference, several systems leverage multiple models with different capabilities and costs.
Dynamic model selection methods (OpenAI, 2025; Ong et al., 2024; Feng et al., 2024; Ning et al., 2024) route queries to different models with varying sizes and configurations to balance efficiency and performance.
Token-level routing methods (Zhang et al., 2024a; Shen et al., 2024; Zheng et al., 2025a; Fu et al., 2025a) enable finer-grained selection, utilizing smaller models for simple token generation within the reasoning process of complex tasks.
While these systems achieve efficiency through strategic model switching, they either completely drop context from other models, or simply rely on their own understandings of the context.
Without understanding sharing, smaller models cannot benefit from the richer representations already computed by larger models.

## 3 Method

### 3.1 Preliminaries

**LLM inference**. Autoregressive LLM inference involves two stages: *prefill* and *decode*. Prefill encodes the full input to produce the first output token; decode then generates subsequent tokens iteratively using the last token and the cached key–value (KV) states.
Formally, let $X_{[0:n]}=[x_{0},\dots,x_{n-1}]$ be the input token sequence.
After prefill, LLM produces a per-token KV-Cache
$\mathcal{C}(X_{[0:n]})=[c_{0},\dots,c_{n-1}]\in\mathbb{R}^{n\times d}$.
For notation brevity, $d$ denotes the KV dimensionality that is flattened from all layers into a single vector per token.
The range subscripts are omitted when clear.
During decoding, with the current token $y_{i}$ and caches from the input and the generated prefix, the next token is predicted as

$$
y_{i+1}=\mathcal{P}\!\left(y_{i}\mid\mathcal{C}(X)\,\oplus\,\mathcal{C}(Y_{[0:i]})\right),
$$

where $\oplus$ denotes sequence-wise concatenation.
The cache updates as $\mathcal{C}(Y_{[0:i+1]})=\mathcal{C}(Y_{[0:i]})\oplus\mathcal{C}(y_{i})$.

**LLM communication**.
In LLM communication scenarios, we define the LLM that provides contextual understanding or knowledge as *Sharer*, and the one that utilizes it as *Receiver*.

### 3.2 Oracles for Cache-to-Cache Communication

We aim to explore whether LLMs can have direct semantic communication through KV-Cache.
Specifically, we design two oracle experiments to answer the following questions:
(1) *Benefit*: can a model’s capabilities be improved through KV-Cache semantic enrichment without extending sequence length?
(2) *Convertibility*: can the KV-Cache of one model be effectively utilized by another model?

#### 3.2.1 Cache Enrichment Oracle

To validate the benefit of cache enrichment,
we first explore whether the semantic quality of KV-Cache can be improved without increasing its size.
Few-shot prompting suggests this might work: providing *exemplars* $E$ before the *question* $X$ often improves accuracy. But does this arise from attending to more context tokens, or from $E$ enriching how $X$ is embedded in KV-Cache?

We evaluate this via three setups:
(1) *Direct*: prefill on $X$ only and decode with $\mathcal{C}(X)$;
(2) *Few-shot*: prefill on $E\oplus X$ and decode with $\mathcal{C}(E\oplus X)$ (longer cache);
(3) *Oracle*: prefill on $E\oplus X$ but *discard* the exemplar segment and keep only the question-aligned slice

$$
\mathcal{C}^{*}(X)\;=\;\mathcal{C}_{[\,\lvert E\rvert :\lvert E\rvert +\lvert X\rvert \,]}(E\oplus X),
$$

so that decoding uses a question-length cache with no extra tokens. Here, $\lvert \cdot\rvert $ denotes sequence length. In Equation 1, this corresponds to substituting $\mathcal{C}(X)$ with $\mathcal{C}^{*}(X)$ before decoding.

Comparing *Direct* and *Oracle* isolates the effect of cache enrichment: any gain arises from the richer question embeddings induced by $E$, not from attending to additional token caches as in *Few-shot*.
As shown in Table 1, the *Oracle* setup improves response quality at the same cache length.

Additionally, we analyze how cache enrichment affects different transformer layers.
Our findings show substantial variation across layers: while some layers benefit from cache enrichment, others experience performance degradation (details in Appendix A.2.1).
Furthermore, these layer-wise effects accumulate as more layers are augmented.
As shown in Figure 4, selectively applying cache enrichment to the top-performing layers (e.g., top-5) yields slightly higher accuracy than enriching all layers, while targeting the worst-performing layers leads to accuracy decline.
This finding guides the gating mechanism of our cache fuser (Section 3.3.2).

![图 3｜源模型、目标模型与转换后 KV-Cache 的 t-SNE 可视化](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig03-tsne.svg)

*Figure 3: T-SNE visualization of KV-Cache representations from the source (Qwen3-4B), target (Qwen3-0.6B), and the transformed cache. After transformation, the source cache falls within the target’s representation space.*

![图 4｜选择性富化不同数量层的 KV-Cache 对准确率的影响](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig04-gate-oracle.svg)

*Figure 4: Effect of selectively enriching different numbers of layers’ KV-Cache on accuracy. Enriching more best-performing layers yields increased accuracy, while enriching the worst-performing ones declines accuracy.*

**Table 1: Cache enrichment experiment. Oracle prefills on exemplars ($E$) and question ($X$), then drops the exemplar cache before decoding, isolating semantic enrichment from cache length.**

| **Method** | **Cache Len.** | **Cache Enrich.** | **Acc. (%)** |
|---|---|---|---|
| Direct | $\lvert X\rvert $ | No | 58.42 |
| Few-shot | $\lvert E\rvert +\lvert X\rvert $ | Yes | 63.39 |
| Oracle | $\lvert X\rvert $ | Yes | 62.34 |

**Table 2: Average effective rank of KV-Cache from Sharer, Receiver, and the C2C-fused one. The increase after fusion indicates that C2C enriches the Receiver KV-Cache semantics.**

|  | **Average Effective Rank** |  |  |
|---|---|---|---|
| **Type** | **Sharer** | **Receiver** | **C2C** |
| K Cache | 539 | 388 | 395 |
| V Cache | 689 | 532 | 560 |

#### 3.2.2 Cache Transformation Oracle

To verify that one model’s KV-Cache can be utilized by another, we conducted cross-model transformation experiments.
We train a 3-layer MLP to map the KV-Cache from a source LLM (Qwen3-4B) to a target LLM (Qwen3-0.6B), with more setups detailed in Appendix A.3.2.

T-SNE visualizations in Figure 3 reveal that the raw KV-Caches of the two LLMs are far apart in representation space. After transformation, the mapped KV-Cache lies inside the target model’s representation space. These results demonstrate that KV-Caches from different models are generally convertible, as the transformed cache is covered by the target model’s representation space.

One thing to note is that the transformed cache occupies only a smaller subset of the target’s space. It indicates that the source model’s semantic information cannot fully cover the target’s, despite the source being larger. This reflects inherent differences in how each model encodes context.
Another observation also supports this interpretation: the correct-answer sets of different models exhibit limited overlap (Figure 7), despite the comparable aggregated accuracy of respective models.
These findings suggest that if specialized contextual understanding from different models can be successfully projected and fused, it may harness the complementary strengths of the respective models.

### 3.3 C2C Design

#### 3.3.1 Overview

Building on the oracle experiments, we propose the C2C scheme. Its core objective is to extract useful contextual understanding or knowledge from one model (the Sharer) and fuse it into another model (the Receiver).

In general, the C2C paradigm contains a set of key/value cache fusers $\mathcal{F}$ and a layer mapping strategy $\mathcal{G}$.
During the prefill stage, fuser $\mathcal{F}_{n}$ takes the $n$th layer cache of the Receiver Model $\mathcal{C}_{n}(X)$ and the corresponding $\mathcal{G}(n)$th layer cache of the Sharer Model $\mathcal{C}^{\mathcal{S}}_{\mathcal{G}(n)}(X)$ and generates the corresponding fused cache with residual connection:

$$
\mathcal{C}^{\mathcal{F}}=\left\{\mathcal{C}_{n}(X)+\mathcal{F}_{n}\!\left(\mathcal{C}_{n}(X),\;\mathcal{C}^{\mathcal{S}}_{\mathcal{G}(n)}(X)\right)\right\}_{n=1}^{N}
$$

During decoding, with the current token $y_{i}$ and caches from the input and the generated prefix, the next token is predicted as:

$$
y_{i+1}=\mathcal{P}\left(y_{i}\middle\lvert \mathcal{C}^{\mathcal{F}}(X)\oplus\mathcal{C}(Y_{[0:i]})\right)
$$

![图 5｜缓存融合器（Cache Fuser）架构与训练方案](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig05-fuser-arch.png)

*Figure 5: Cache fuser architecture and training scheme. Fuser projects and combines KV-Caches, then adds the result to Receiver’s cache through a learnable gate. LLMs are frozen during training.*

#### 3.3.2 Fuser Structure

To enhance the Receiver’s KV-Cache without destructive overwriting of its information, the fuser is designed under a residual integration principle. As shown in Figure 5, it contains three key modules:

(1) **Projection module** concatenates the Receiver’s KV-Cache with the Sharer’s KV-Cache, then processes the concatenated features through a projection layer followed by a feature fusion layer.

(2) **Dynamic weighting module** applies an input-aware head modulation layer to dynamically reweight the projected information.

(3) **Learnable gate** introduces a trainable per-layer gate value that decides whether to inject the Sharer’s context. The gate applies a Gumbel-sigmoid with temperature annealing to smoothly transition from differentiable during training to binary at inference.

We also explore a more complex yet potentially more powerful fuser variant in Appendix A.1.3.

#### 3.3.3 Model Alignment

Fusing KV-Caches across model families and sizes requires alignment at two levels: tokens and layers.
For *token alignment*, different tokenizers may produce slightly varied token sequences for the same input.
We align them by decoding each Receiver token into its string form and re-encoding it using the Sharer’s tokenizer.
When one-to-many mappings occasionally occur, we select the Sharer token with maximal string coverage to preserve information.
For *layer* alignment, we adopt a terminal alignment strategy: the final layers of both models are aligned first, then the penultimate layers, and so on in reverse order until reaching the shallower model’s first layer.
Details in Appendices A.1.1 and A.1.2.

#### 3.3.4 Training Scheme

During training, we freeze both the Sharer and Receiver models, training only the C2C module for KV-Cache fusion.
We employ standard next-token prediction loss on the Receiver’s response predictions, similar to supervised fine-tuning (SFT).
The key difference is that the Receiver predicts responses conditioned on fused KV-Cache rather than its own.

The training procedure consists of three stages:
(1) Forward: both models encode the input context to produce their respective KV-Caches.
(2) Fusion: the C2C module fuses both KV-Caches and replaces the Receiver’s cache.
(3) Supervision: the Receiver prefills the response using the fused cache, and gradients backpropagate through C2C to minimize prediction loss.

## 4 Experiment

### 4.1 Setup

We brief the experiment setups here, with more details in Appendix A.3.

**Models**.
We evaluate C2C across various model families, including Qwen2.5 (Yang et al., 2024a; Hui et al., 2024), Qwen3 (Yang et al., 2025a), Llama3.2 (Dubey et al., 2024), and Gemma3 (Team et al., 2025). To test generalizability, we select different configurations for the Sharer-Receiver model combinations, including models of different generations (Qwen3 and Qwen2.5), different families (Qwen, Llama, and Gemma), different sizes (0.6B to 14B), different specializations (general, code, and math model), and different training stages (pretrained and instruction fine-tuned models).
For ablative and diagnostic analyses (scaling behavior, ablation study, behavior analysis), we fix the Receiver and Sharer to Qwen3 models unless otherwise specified.
This consistency eliminates confounders from model alignment and isolates the core impact of C2C.

**Baselines**. We compare C2C with two LLM collaboration methods to contextualize performance:
(1) Text-to-Text (T2T) communication: models collaborate through an analyze-then-respond hand-off for each query. The Sharer generates an analytical text of key information to solve the input question. This text is concatenated with the original question and fed to the Receiver to mirror standard collaborative pipelines. Corresponding prompts are in Appendix A.3.6.
(2) Query-level routing (Ong et al., 2024): models collaborate by selecting the appropriate LLM for different queries.
We also include individual model performance (Sharer or Receiver alone) to establish a lower bound for collaborative gains.

**Benchmarks**.
We evaluate on four widely used benchmarks spanning reasoning, knowledge, and language domains to ensure comprehensive coverage. OpenBookQA (Mihaylov et al., 2018) for fact-based reasoning, MMLU-Redux (Gema et al., 2025) for knowledge in the general domain, ARC-Challenge (ARC-C) (Clark et al., 2018) for scientific and logistic reasoning, and C-Eval (Huang et al., 2023) for comprehensive knowledge in the Chinese domain.

**Training dataset**.
To ensure the generalizability of C2C, we utilize the first 500k samples of the OpenHermes2.5 Dataset (Teknium, 2023), a general finetuning dataset, to train C2C fusers.
To reduce training cost, we use MMLU as the training set for scaling behavior and behavior analysis experiments, unless otherwise specified.

**Evaluation settings**.
We use average accuracy as the performance metric. We use text generation and answer extraction as the evaluation mode for C2C and baselines, with the max generation length set to 64 for multi-choice benchmarks. All experiments are conducted in the zero-shot setting with zero generation temperature to ensure reproducibility.
We use average inference time as the efficiency metric, measured using a single NVIDIA A100 GPU with batch size one.

### 4.2 Main Results

**Performance**.
As shown in Table 4, C2C consistently improves the Receiver model performance across different settings and benchmarks. Representative example output is provided in Appendix A.4.4.
After applying C2C, accuracy increases by an average of 11.00%, 9.64%, and 11.88% across the three Sharers.
Compared with text-to-text communication, C2C achieves an average accuracy increase of 5.36%, 4.15%, and 3.06%.
Query-level routing prioritizes efficiency but limits accuracy to the better of the two original models.
Notably, Qwen3-4B Base as the Sharer often ignores instructions, resulting in poor standalone performance and excessively long T2T communication times.
In contrast, C2C bypasses this issue, highlighting an interesting use case in which a weaker instruction-tuned Receiver can leverage a stronger base model’s knowledge via C2C, even when base model cannot follow instructions. We also explore strong-to-weak communication (details in Appendix A.2.2) using Qwen3-4B as the Sharer, showing that C2C effectively enables the Receiver to benefit from a stronger Sharer.

**Efficiency**.
As shown in Table 4, C2C achieves significant speedups of 3.46$\times$, 1.51$\times$, and 14.41$\times$ over T2T by eliminating intermediate text generation.
As detailed in Table 3, T2T requires the Sharer to decode 80 output tokens, incurring 1312ms of decoding overhead, whereas C2C replaces this sequential decoding with parallel cache fusion in 90ms.
Further analysis of Llama3.2-1B’s exceptionally fast inference is provided in Appendix A.4.3.

**Table 3: Average token count and inference time breakdown on MMLU-Redux (Sharer: Qwen2.5-0.5B-Instruct, Receiver: Qwen3-0.6B). ∗Includes 90ms KV-Cache fusion time.**

|  |  |  | **Text-to-Text** |  | **Cache-to-Cache** |  |
|---|---|---|---|---|---|---|
| **Metric** | **Receiver-only** | **Sharer-only** | Sharer | Receiver | Sharer | Receiver |
| Input Tokens | 170 | 187 | 103 | 332 | 170 | 170 |
| Output Tokens | 11 | 19 | 80 | 10 | 0 | 12 |
| Prefill Time (ms) | 27 | 20 | 21 | 32 | 20 + 90∗ | 27 |
| Decode Time (ms) | 281 | 326 | 1312 | 231 | 0 | 308 |
| Total Time (ms) | 308 | 346 | 1596 |  | 445 |  |

**Table 4: Accuracy (%) and inference time (seconds) of different communication methods across four benchmarks. The Receiver is fixed as Qwen3-0.6B, paired with three different Sharers.**

| **Sharer** | **Task** | **Metric** | **Receiver** | **Sharer** | **Routing** | **Text-to-Text** | **Cache-to-Cache** |
|---|---|---|---|---|---|---|---|
| Qwen2.5-0.5B | MMLU-Redux | Acc | 35.53 | 38.42 | 35.58 | 41.03 | **42.92** |
| Qwen2.5-0.5B | MMLU-Redux | Time | 0.29 | 0.34 | 0.27 | 1.52 | 0.40 |
| Qwen2.5-0.5B | OpenBook | Acc | 39.20 | 45.60 | 40.80 | 44.00 | **52.60** |
| Qwen2.5-0.5B | OpenBook | Time | 0.27 | 0.35 | 0.29 | 0.81 | 0.30 |
| Qwen2.5-0.5B | ARC-C | Acc | 41.04 | 42.09 | 40.70 | 49.48 | **54.52** |
| Qwen2.5-0.5B | ARC-C | Time | 0.29 | 0.39 | 0.29 | 1.00 | 0.36 |
| Qwen2.5-0.5B | C-Eval | Acc | 32.04 | 40.21 | 34.61 | 35.88 | **41.77** |
| Qwen2.5-0.5B | C-Eval | Time | 0.26 | 0.31 | 0.26 | 1.51 | 0.34 |
| Llama3.2-1B | MMLU-Redux | Acc | 35.53 | 32.30 | 33.38 | 43.32 | **44.42** |
| Llama3.2-1B | MMLU-Redux | Time | 0.29 | 0.06 | 0.18 | 0.75 | 0.50 |
| Llama3.2-1B | OpenBook | Acc | 39.20 | 32.60 | 36.40 | 41.20 | **47.80** |
| Llama3.2-1B | OpenBook | Time | 0.26 | 0.07 | 0.17 | 0.70 | 0.43 |
| Llama3.2-1B | ARC-C | Acc | 41.04 | 33.57 | 37.22 | 50.00 | **53.39** |
| Llama3.2-1B | ARC-C | Time | 0.28 | 0.07 | 0.18 | 0.70 | 0.47 |
| Llama3.2-1B | C-Eval | Acc | 32.04 | 31.31 | 31.92 | 35.27 | **40.77** |
| Llama3.2-1B | C-Eval | Time | 0.25 | 0.04 | 0.15 | 0.71 | 0.49 |
| Qwen3-4B-Base | MMLU-Redux | Acc | 35.53 | 1.03 | 16.39 | 43.87 | **43.95** |
| Qwen3-4B-Base | MMLU-Redux | Time | 0.29 | 2.06 | 0.28 | 7.54 | 0.45 |
| Qwen3-4B-Base | OpenBook | Acc | 39.20 | 2.20 | 22.20 | 46.40 | **53.20** |
| Qwen3-4B-Base | OpenBook | Time | 0.26 | 1.98 | 0.27 | 5.08 | 0.34 |
| Qwen3-4B-Base | ARC-C | Acc | 41.04 | 1.48 | 19.65 | 53.91 | **55.39** |
| Qwen3-4B-Base | ARC-C | Time | 0.28 | 2.06 | 0.28 | 6.56 | 0.40 |
| Qwen3-4B-Base | C-Eval | Acc | 32.04 | 5.65 | 15.10 | 38.92 | **42.79** |
| Qwen3-4B-Base | C-Eval | Time | 0.25 | 2.02 | 0.26 | 3.59 | 0.39 |

### 4.3 Scaling Behavior

![图 6｜随 Sharer 模型规模变化的准确率增益（a: C2C，b: T2T）](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig06-scaling.svg)

*Figure 6: Accuracy improvements ($\Delta$Accuracy) on the MMLU-Redux benchmark. (a) C2C communication. (b) T2T communication. The $x$-axis denotes the Sharer model from the Qwen2.5-Instruct series, while the curves correspond to Receiver models from the Qwen3 series. The accuracy improvements of C2C generally increase faster than T2T.*

**Scaling sequence lengths**.
We evaluate how C2C scales with respect to sequence length on long-context tasks from the LongBenchV1 benchmark.
All C2C fusers are trained and tested on different sets of LongBenchV1.
As shown in Table 6, C2C consistently outperforms text-to-text communication across all sequence-length intervals. This demonstrates C2C’s advantages across input length ranges.
More detailed setups and results are in Appendices A.2.2 and A.3.4.

**Table 5: Performance scaling with sequence length on LongBenchV1, using Qwen3-0.6B Receiver and Qwen2.5-0.5B Sharer.**

| Length | Receiver | Sharer | T2T | C2C |
|---|---|---|---|---|
| 0-4k | 30.52 | 24.94 | 33.46 | **37.31** |
| 4-8k | 26.03 | 23.18 | 29.70 | **34.01** |
| 8k+ | 25.99 | 16.44 | 25.64 | **30.72** |

**Table 6: Ablation of C2C improvement sources. Single: fine-tunes Receiver without any Sharer. Identical: C2C with the same LLM as both Sharer and Receiver. C2C: use different LLMs as Sharer and Receiver.**

| Setting | #Param. | OpenBook | ARC-C | MMLU | C-Eval |
|---|---|---|---|---|---|
| Single | 596M | 45.80 | 47.65 | 36.81 | 35.81 |
| Identical | 529M | 50.60 | 52.52 | 42.17 | 40.34 |
| C2C | 478M | **52.60** | **54.52** | **42.92** | **41.77** |

**Scaling model sizes**.
We investigate how C2C scales with respect to the Sharer and Receiver model sizes.
All C2C fusers are trained on MMLU’s auxiliary train split and evaluated on MMLU-Redux.
As shown in Figure 6, the $x$-axis denotes Sharer size (Qwen2.5-Instruct series), the $y$-axis shows accuracy gains of C2C over Receiver-only baselines ($\Delta$ Accuracy), and each curve represents a Receiver from the Qwen3 series.
We find that the accuracy improvements of C2C generally increase faster than T2T.
This trend shows that when the Sharer possesses richer knowledge, C2C is able to more effectively transmit useful information to the Receiver.
Note that the relative gains for larger Receivers are less pronounced due to their stronger baselines and higher overlap with the Sharer’s knowledge.

**Different model combinations**.
We test different Sharer-Receiver combinations, including different model families and different task-specific models.
The result in Table 7 shows that C2C outperforms text-to-text communication on all five combinations by an average of 8.59% on MMLU-Redux. This supports that by employing C2C, the Receiver model can effectively utilize contextual understanding from different models to enhance performance.
Notably, when using Qwen2.5-Math as the Sharer, the communication text becomes substantially longer, as analyzed in Appendix A.4.3.
To further test the generalizability of C2C, we swap the Sharer and Receiver models. The results show that C2C robustly brings a 5.05% increase in accuracy while applying T2T results in a 6.30% decrease in performance.

Together, these experiments support the scalability of C2C as an effective and efficient new LLM communication paradigm.

**Table 7: Comparison of Receiver-only, Sharer-only, T2T, and C2C across accuracy and time. The pairs are grouped into heterogeneous settings (where the Receiver is paired with Sharers of different capabilities) and swap settings (where Receiver and Sharer roles are exchanged).**

| Pair Type | Receiver | Sharer | Metric | Receiver | Sharer | T2T | C2C |
|---|---|---|---|---|---|---|---|
| Heterogeneous | Qwen3-0.6B | Gemma3-1B | Acc | 35.53 | 31.75 | 41.35 | **45.90** |
| Heterogeneous | Qwen3-0.6B | Gemma3-1B | Time | 0.29 | 0.54 | 1.04 | 0.30 |
| Heterogeneous | Qwen3-0.6B | Qwen2.5-Math-1.5B | Acc | 35.53 | 39.86 | 43.71 | **46.13** |
| Heterogeneous | Qwen3-0.6B | Qwen2.5-Math-1.5B | Time | 0.29 | 8.71 | 6.60 | 0.27 |
| Heterogeneous | Qwen3-0.6B | Qwen2.5-Coder-0.5B | Acc | 35.53 | 25.09 | 39.74 | **46.89** |
| Heterogeneous | Qwen3-0.6B | Qwen2.5-Coder-0.5B | Time | 0.29 | 0.26 | 1.59 | 0.27 |
| Swap | Qwen2.5-0.5B | Qwen3-0.6B | Acc | 38.42 | 35.53 | 32.12 | **43.47** |
| Swap | Qwen2.5-0.5B | Qwen3-0.6B | Time | 0.34 | 0.29 | 0.98 | 0.21 |
| Swap | Qwen3-0.6B | Qwen2.5-0.5B | Acc | 35.53 | 38.42 | 41.03 | **46.50** |
| Swap | Qwen3-0.6B | Qwen2.5-0.5B | Time | 0.29 | 0.34 | 1.52 | 0.26 |

### 4.4 Ablation Study

**Sources of improvement**.
In Table 6, we ablate the source of C2C performance gain by fixing the Receiver (Qwen3-0.6B) and varying the Sharer.
*Single* denotes standard full fine-tuning of the Receiver without Sharer.
*Identical* denotes C2C where both Sharer and Receiver are Qwen3-0.6B.
Our default C2C uses Qwen2.5-0.5B as the Sharer.
Under the same training configuration, C2C consistently attains higher accuracy than both *Single* and *Identical*.
This confirms that C2C improvements do not purely come from added trainable capacity or overfitting to the training set. Instead, it points to complementary contextual understanding contributed by the heterogeneous Sharer. *Identical* still outperforms *Single*, indicating that cache-level self-communication can provide useful auxiliary understanding, echoing effects observed in latent reasoning and looped transformers (Saunshi et al., 2025; Fu et al., 2025b).

**Fuser architecture**. In Table 8 we show the effect of different components in the C2C design. Compared with pure projection that discards the Receiver’s cache, fusing both models’ KV-Caches and retaining the Receiver’s via residual connection increases accuracy by 24.18%. Adding a gate for fused layer selection further increases the average accuracy by 3.07%.

**Table 8: Ablation of C2C fuser components. Project: directly replacing the Receiver’s KV-Cache with projected Sharer cache. +Fuse: fusing both caches and adding the result back to Receiver’s via residual. +Gate: adding per-layer learnable gating.**

| Method | MMLU | ARC-C | OpenBook | CEval | Average |
|---|---|---|---|---|---|
| Project | 20.01 | 19.57 | 21.80 | 21.41 | 20.70 |
| +Fuse | **43.36** | 51.65 | 47.60 | 36.91 | 44.88 |
| +Gate (=C2C) | 42.92 | **54.52** | **52.60** | **41.77** | **47.95** |

### 4.5 Behavior Analysis

**Effective rank analysis**.
We analyze the effective rank of KV-Cache before and after cache-to-cache communication.
Effective rank (Roy and Vetterli, 2007) is a common measure of the intrinsic dimensionality of model weights or activation values; a higher intrinsic dimension means richer semantic information, as formalized in Appendix A.4.1.
As Table 2 shows, after cache-to-cache fusing, the effective ranks of K and V increased from 388 to 395 and from 532 to 560, respectively. This indicates that C2C enriches the semantic space by successfully transforming the Sharer’s representations and injecting knowledge into the Receiver model.

**Accuracy breakdown**.
Our analysis reveals that the source of C2C’s accuracy gains depends on the relative capacity of the communicating models and varies across task subcategories. Details can be found in Appendix A.2.3. We also find that in some specific cases, C2C may fail as the contextual understanding from the Sharer model is not always accurate and can mislead the Receiver into generating the wrong answer. Representative example is provided in Appendix A.4.6.

**Progressive behavior**. We analyze the progressive behavior of C2C by gradually increasing the percentage of context KV-Cache being updated by C2C (details in Appendix A.2.4).
When the percentage is above 50%, increasing the percentage continuously yields better performance.

**Gate behavior**. We analyze the behavior of C2C ’s learnable gates under different training regimes in Appendix A.4.2. We can draw the conclusion that general-purpose training favors broad gate activation with fine-grained modulation via weights, whereas task-specific
training favors sparse gate activation with stronger reliance on the selected layers.

## 5 Discussion

**Future work**. C2C opens several directions for future research.
(1) Cache communication in multi-agent systems: C2C may serve as a better communication primitive for real-world agentic tasks with complex multi-round reasoning, coding, and tool use. A preliminary case study on mathematical problem solving is provided in Appendix A.5.3.
(2) Cross-modal collaboration: beyond text-only models, fusing caches among vision–language models (VLMs) and vision–language–action (VLA) models may enable richer multi-modal collaboration.
(3) Inference acceleration: C2C can enhance speculative decoding and enable token-level routing across heterogeneous models for lower latency and cost.
(4) Privacy-aware collaboration: LLMs can transmit KV-Cache segments without explicit text, limiting content exposure and improving privacy.

**Limitations**. (1) Multi-LLM systems experience performance degradation when a much weaker Sharer provides noisy information to a stronger Receiver. This limitation is shared by both T2T and C2C, as Sharer semantic quality directly impacts Receiver performance. (2) While pairwise KV-Cache communication is feasible and advantageous, scaling up the number of communicating LLMs with $O(N)$ training cost remains an open problem. Preliminary efforts towards this goal are in Appendix A.5.1 and A.5.2.

## 6 Conclusion

We demonstrate that LLMs can communicate beyond text. We introduce Cache-to-Cache (C2C), a general paradigm that transforms and fuses key–value (KV) caches across models to enable direct semantic communication. Across diverse tasks and model configurations, C2C consistently achieves higher task performance and better efficiency than text-to-text communication. These results establish cache-to-cache as a practical alternative to token-based communication and highlight its promise for scalable, low-latency multi-LLM systems.

## Acknowledgments

This work was supported by National Natural Science Foundation of China (No. 62506197, 62325405, 62104128, U19B2019, U21B2031, 61832007, 62204164, 92364201), Tsinghua EE Xilinx AI Research Fund, and Beijing National Research Center for Information Science and Technology (BNRist).
We thank Xuefei Ning for her valuable discussions and suggestions.

## Ethics Statement

This study raises no ethical issues. No human subjects or sensitive personal data were involved in the experiments.

## Reproducibility Statement

We provide sufficient information to allow the results reported in this paper to be reproduced.
All experiments were conducted using publicly available datasets along with open-source models and code. Implementation details, including data selection, model architectures, hyperparameters, and training procedures, are provided in Appendix A. The code, configuration files, and model checkpoints are released at [https://github.com/thu-nics/C2C](https://github.com/thu-nics/C2C).

## References

- Anthropic (2024) Anthropic Introducing the model context protocol. Note: Online; Nov. 25, 2024Accessed: 2025-09-08 External Links: [Link](https://www.anthropic.com/news/model-context-protocol) Cited by: §1, §2.2.

- Bai et al. (2025) S. Bai, K. Chen, X. Liu, J. Wang, W. Ge, S. Song, K. Dang, P. Wang, S. Wang, J. Tang, et al. Qwen2. 5-vl technical report. arXiv preprint arXiv:2502.13923. Cited by: §1.

- Bang (2023) F. Bang Gptcache: an open-source semantic cache for llm applications enabling faster answers and cost savings. In Proceedings of the 3rd Workshop for Natural Language Processing Open Source Software (NLP-OSS 2023), pp. 212–218. Cited by: §2.1.

- Brandon et al. (2024) W. Brandon, M. Mishra, A. Nrusimha, R. Panda, and J. Ragan-Kelley Reducing transformer key-value cache size with cross-layer attention. Advances in Neural Information Processing Systems 37, pp. 86927–86957. Cited by: §2.1.

- Clark et al. (2018) P. Clark, I. Cowhey, O. Etzioni, T. Khot, A. Sabharwal, C. Schoenick, and O. Tafjord Think you have solved question answering? try arc, the ai2 reasoning challenge. arXiv preprint arXiv:1803.05457. Cited by: §4.1.

- Du et al. (2023) Y. Du, S. Li, A. Torralba, J. B. Tenenbaum, and I. Mordatch Improving factuality and reasoning in language models through multiagent debate. In Forty-first International Conference on Machine Learning, Cited by: §2.2.

- Dubey et al. (2024) A. Dubey, A. Jauhri, A. Pandey, A. Kadian, A. Al-Dahle, A. Letman, A. Mathur, A. Schelten, A. Yang, A. Fan, et al. The llama 3 herd of models. arXiv e-prints, pp. arXiv–2407. Cited by: §4.1.

- Estornell and Liu (2024) A. Estornell and Y. Liu Multi-llm debate: framework, principals, and interventions. Advances in Neural Information Processing Systems 37, pp. 28938–28964. Cited by: §2.2.

- Eyuboglu et al. (2025) S. Eyuboglu, R. Ehrlich, S. Arora, N. Guha, D. Zinsley, E. Liu, W. Tennien, A. Rudra, J. Zou, A. Mirhoseini, et al. Cartridges: lightweight and general-purpose long context representations via self-study. arXiv preprint arXiv:2506.06266. Cited by: §2.1.

- Feng et al. (2024) T. Feng, Y. Shen, and J. You Graphrouter: a graph-based router for llm selections. arXiv preprint arXiv:2410.03834. Cited by: §2.2.

- Fu et al. (2025a) T. Fu, Y. Ge, Y. You, E. Liu, Z. Yuan, G. Dai, S. Yan, H. Yang, and Y. Wang R2R: efficiently navigating divergent reasoning paths with small-large model token routing. arXiv preprint arXiv:2505.21600. Cited by: §1, §2.2.

- Fu et al. (2025b) T. Fu, Y. You, Z. Chen, G. Dai, H. Yang, and Y. Wang Think-at-hard: selective latent iterations to improve reasoning language models. arXiv preprint arXiv:2510.08577. Cited by: §4.4.

- Gema et al. (2025) A. P. Gema, J. O. J. Leang, G. Hong, A. Devoto, A. C. M. Mancino, R. Saxena, X. He, Y. Zhao, X. Du, M. R. G. Madani, et al. Are we done with mmlu?. In Proceedings of the 2025 Conference of the Nations of the Americas Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 1: Long Papers), pp. 5069–5096. Cited by: §4.1.

- Guo et al. (2025) D. Guo, D. Yang, H. Zhang, J. Song, R. Zhang, R. Xu, Q. Zhu, S. Ma, P. Wang, X. Bi, et al. Deepseek-r1: incentivizing reasoning capability in llms via reinforcement learning. arXiv preprint arXiv:2501.12948. Cited by: §1.

- Guo et al. (2024) T. Guo, X. Chen, Y. Wang, R. Chang, S. Pei, N. V. Chawla, O. Wiest, and X. Zhang Large language model based multi-agents: a survey of progress and challenges. arXiv preprint arXiv:2402.01680. Cited by: §1.

- He et al. (2025) Z. He, R. Abhyankar, V. Srivatsa, and Y. Zhang Cognify: supercharging gen-ai workflows with hierarchical autotuning. In Proceedings of the 31st ACM SIGKDD Conference on Knowledge Discovery and Data Mining V. 2, pp. 932–943. Cited by: §A.5.3.

- Hong et al. (2023) S. Hong, X. Zheng, J. P. Chen, Y. Cheng, C. Zhang, Z. Wang, S. K. S. Yau, Z. H. Lin, L. Zhou, C. Ran, L. Xiao, and C. Wu MetaGPT: meta programming for multi-agent collaborative framework. ArXiv abs/2308.00352. External Links: [Link](https://api.semanticscholar.org/CorpusID:260351380) Cited by: §2.2.

- Hu et al. (2025) M. Hu, Y. Zhou, W. Fan, Y. Nie, B. Xia, T. Sun, Z. Ye, Z. Jin, Y. Li, Q. Chen, Z. Zhang, Y. Wang, Q. Ye, B. Ghanem, P. Luo, and G. Li Owl: optimized workforce learning for general multi-agent assistance in real-world task automation. arXiv preprint arXiv:2505.23885. Cited by: §2.2.

- Huang et al. (2023) Y. Huang, Y. Bai, Z. Zhu, J. Zhang, J. Zhang, T. Su, J. Liu, C. Lv, Y. Zhang, Y. Fu, et al. C-eval: a multi-level multi-discipline chinese evaluation suite for foundation models. Advances in Neural Information Processing Systems 36, pp. 62991–63010. Cited by: §4.1.

- Hui et al. (2024) B. Hui, J. Yang, Z. Cui, J. Yang, D. Liu, L. Zhang, T. Liu, J. Zhang, B. Yu, K. Lu, et al. Qwen2. 5-coder technical report. arXiv preprint arXiv:2409.12186. Cited by: §1, §4.1.

- Li et al. (2023) G. Li, H. Hammoud, H. Itani, D. Khizbullin, and B. Ghanem Camel: communicative agents for” mind” exploration of large language model society. Advances in Neural Information Processing Systems 36, pp. 51991–52008. Cited by: §1.

- Li et al. (2024) Y. Li, F. Wei, C. Zhang, and H. Zhang Eagle: speculative sampling requires rethinking feature uncertainty. arXiv preprint arXiv:2401.15077. Cited by: §1.

- Liang et al. (2024) T. Liang, Z. He, W. Jiao, X. Wang, Y. Wang, R. Wang, Y. Yang, S. Shi, and Z. Tu Encouraging divergent thinking in large language models through multi-agent debate. In Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing, pp. 17889–17904. Cited by: §2.2.

- Liu et al. (2024a) Y. Liu, Y. Huang, J. Yao, S. Feng, Z. Gu, K. Du, H. Li, Y. Cheng, J. Jiang, S. Lu, et al. DroidSpeak: kv cache sharing for cross-llm communication and multi-llm serving. arXiv preprint arXiv:2411.02820. Cited by: §2.1.

- Liu et al. (2024b) Z. Liu, Y. Zhang, P. Li, Y. Liu, and D. Yang A dynamic llm-powered agent network for task-oriented agent collaboration. In First Conference on Language Modeling, Cited by: §2.2.

- Mihaylov et al. (2018) T. Mihaylov, P. Clark, T. Khot, and A. Sabharwal Can a suit of armor conduct electricity? a new dataset for open book question answering. In Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing, pp. 2381–2391. Cited by: §4.1.

- Ning et al. (2024) X. Ning, Z. Lin, Z. Zhou, Z. Wang, H. Yang, and Y. Wang Skeleton-of-thought: prompting llms for efficient parallel generation. In The Twelfth International Conference on Learning Representations, External Links: [Link](https://openreview.net/forum?id=mqVgBbNCm9) Cited by: §2.2.

- Ong et al. (2024) I. Ong, A. Almahairi, V. Wu, W. Chiang, T. Wu, J. E. Gonzalez, M. W. Kadous, and I. Stoica Routellm: learning to route llms with preference data. arXiv preprint arXiv:2406.18665. Cited by: §A.1.3, §1, §2.2, §4.1.

- OpenAI (2025) OpenAI Introducing gpt-5. Note: [https://openai.com/index/introducing-gpt-5/](https://openai.com/index/introducing-gpt-5/)Accessed: 2025-09-11 Cited by: §1, §1, §2.2.

- Pidkuiko and Starkov (2025) A. Pidkuiko and B. Starkov Gibberlink. Note: [https://github.com/PennyroyalTea/gibberlink](https://github.com/PennyroyalTea/gibberlink)GitHub repository, accessed 2025-11-05 Cited by: §2.2.

- Qin et al. (2024) R. Qin, Z. Li, W. He, M. Zhang, Y. Wu, W. Zheng, and X. Xu Mooncake: a kvcache-centric disaggregated architecture for llm serving. arXiv preprint arXiv:2407.00079. Cited by: §2.1.

- Roy and Vetterli (2007) O. Roy and M. Vetterli The effective rank: a measure of effective dimensionality. In 2007 15th European signal processing conference, pp. 606–610. Cited by: §A.4.1, §4.5.

- Saunshi et al. (2025) N. Saunshi, N. Dikkala, Z. Li, S. Kumar, and S. J. Reddi Reasoning with latent thoughts: on the power of looped transformers. arXiv preprint arXiv:2502.17416. Cited by: §4.4.

- Shen et al. (2024) Z. Shen, H. Lang, B. Wang, Y. Kim, and D. Sontag Learning to decode collaboratively with multiple language models. In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pp. 12974–12990. Cited by: §2.2.

- Sun et al. (2024) Y. Sun, L. Dong, Y. Zhu, S. Huang, W. Wang, S. Ma, Q. Zhang, J. Wang, and F. Wei You only cache once: decoder-decoder architectures for language models. Advances in Neural Information Processing Systems 37, pp. 7339–7361. Cited by: §2.1.

- Surapaneni et al. (2025) R. Surapaneni, M. Jha, M. Vakoc, and T. Segal Announcing the agent2agent protocol (a2a). Note: Google Developers BlogAccessed: 2025-09-08 External Links: [Link](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) Cited by: §1, §2.2.

- Team et al. (2025) G. Team, A. Kamath, J. Ferret, S. Pathak, N. Vieillard, R. Merhej, S. Perrin, T. Matejovicova, A. Ramé, M. Rivière, et al. Gemma 3 technical report. arXiv preprint arXiv:2503.19786. Cited by: §4.1.

- Teknium (2023) Teknium OpenHermes 2.5: an open dataset of synthetic data for generalist llm assistants. HuggingFace. External Links: [Link](https://huggingface.co/datasets/teknium/OpenHermes-2.5) Cited by: §4.1.

- Tran et al. (2025) K. Tran, D. Dao, M. Nguyen, Q. Pham, B. O’Sullivan, and H. D. Nguyen Multi-agent collaboration mechanisms: a survey of llms. arXiv preprint arXiv:2501.06322. Cited by: §1.

- Wang et al. (2024) J. Wang, J. Wang, B. Athiwaratkun, C. Zhang, and J. Zou Mixture-of-agents enhances large language model capabilities. arXiv preprint arXiv:2406.04692. Cited by: §2.2.

- Wu and Tu (2024) H. Wu and K. Tu Layer-condensed kv cache for efficient inference of large language models. In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pp. 11175–11188. Cited by: §2.1.

- Wu et al. (2023) Q. Wu, G. Bansal, J. Zhang, Y. Wu, S. Zhang, E. Zhu, B. Li, L. Jiang, X. Zhang, and C. Wang Autogen: enabling next-gen llm applications via multi-agent conversation framework. arXiv preprint arXiv:2308.08155 3 (4). Cited by: §1.

- Wu et al. (2025) Y. Wu, H. Wu, and K. Tu A systematic study of cross-layer kv sharing for efficient llm inference. In Proceedings of the 2025 Conference of the Nations of the Americas Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 2: Short Papers), pp. 396–403. Cited by: §2.1.

- Yang et al. (2025a) A. Yang, A. Li, B. Yang, B. Zhang, B. Hui, B. Zheng, B. Yu, C. Gao, C. Huang, C. Lv, et al. Qwen3 technical report. arXiv preprint arXiv:2505.09388. Cited by: §1, §4.1.

- Yang et al. (2024a) A. Yang, B. Zhang, B. Hui, B. Gao, B. Yu, C. Li, D. Liu, J. Tu, J. Zhou, J. Lin, et al. Qwen2. 5-math technical report: toward mathematical expert model via self-improvement. arXiv preprint arXiv:2409.12122. Cited by: §1, §4.1.

- Yang et al. (2025b) J. Yang, B. Hou, W. Wei, Y. Bao, and S. Chang Kvlink: accelerating large language models via efficient kv cache reuse. arXiv preprint arXiv:2502.16002. Cited by: §2.1.

- Yang et al. (2024b) Y. Yang, Z. Cao, Q. Chen, L. Qin, D. Yang, H. Zhao, and Z. Chen Kvsharer: efficient inference via layer-wise dissimilar kv cache sharing. arXiv preprint arXiv:2410.18517. Cited by: §2.1.

- Yao et al. (2024) J. Yao, H. Li, Y. Liu, S. Ray, Y. Cheng, Q. Zhang, K. Du, S. Lu, and J. Jiang Cacheblend: fast large language model serving with cached knowledge fusion. arXiv e-prints, pp. arXiv–2405. Cited by: §2.1.

- Ye et al. (2025) H. Ye, Z. Gao, M. Ma, Q. Wang, Y. Fu, M. Chung, Y. Lin, Z. Liu, J. Zhang, D. Zhuo, et al. KVCOMM: online cross-context kv-cache communication for efficient llm-based multi-agent systems. arXiv preprint arXiv:2510.12872. Cited by: §2.1.

- Ye et al. (2024) L. Ye, Z. Tao, Y. Huang, and Y. Li ChunkAttention: efficient self-attention with prefix-aware kv cache and two-phase partition. In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pp. 11608–11620. Cited by: §2.1.

- Zhang et al. (2024a) K. Zhang, J. Wang, N. Ding, B. Qi, E. Hua, X. Lv, and B. Zhou Fast and slow generating: an empirical study on large and small language models collaborative decoding. CoRR. Cited by: §2.2.

- Zhang et al. (2024b) M. Zhang, X. Shen, J. Cao, Z. Cui, and S. Jiang Edgeshard: efficient llm inference via collaborative edge computing. IEEE Internet of Things Journal. Cited by: §1.

- Zhang et al. (2024c) Y. Zhang, R. Sun, Y. Chen, T. Pfister, R. Zhang, and S. Arik Chain of agents: large language models collaborating on long-context tasks. Advances in Neural Information Processing Systems 37, pp. 132208–132237. Cited by: §2.2.

- Zheng et al. (2025a) W. Zheng, Y. Chen, W. Zhang, S. Kundu, Y. Li, Z. Liu, E. P. Xing, H. Wang, and H. Yao Citer: collaborative inference for efficient large language model decoding with token-level routing. arXiv preprint arXiv:2502.01976. Cited by: §2.2.

- Zheng et al. (2025b) Y. Zheng, Z. Zhao, Z. Li, Y. Xie, M. Gao, L. Zhang, and K. Zhang Thought communication in multiagent collaboration. arXiv preprint arXiv:2510.20733. Cited by: §2.2.

## Appendix A Appendix

### A.1 Design Choice Exploration

We detail the design of C2C and discuss alternative design choices.

#### A.1.1 Layer Alignment

**Terminal alignment**.
In this strategy, the layers of the two models are aligned starting from the output side. Specifically, the final layer of the smaller model is paired with the final layer of the larger model, the penultimate layer with the penultimate layer, and so on. This scheme prioritizes alignment between the deeper layers across models, which typically capture higher-level semantic representations.

**Depth-normalized alignment**.
In this strategy, both models’ layer indices are normalized to $[0,1]$ by dividing by $(L-1)$, where $L$ is the total number of layers in the model. Let the model with fewer layers ($L_{\min}$) serve as the anchor. For each anchor layer $i$ (with normalized index $i/(L_{\min}-1)$), we select the layer $j$ in the other model ($L_{\max}$) whose normalized index $j/(L_{\max}-1)$ is closest:

$$
j^{\star}\;=\;\arg\min_{j}\Bigl\lvert \tfrac{i}{L_{\min}-1}-\tfrac{j}{L_{\max}-1}\Bigr\rvert .
$$

This method produces an alignment that distributes correspondences approximately uniformly across the model depth.

**C2C Choice**.
In our design, we adopt **terminal alignment**, as it provides a simpler and more direct layer mapping strategy that empirically performs slightly better in our experiments.

#### A.1.2 Tokenization Alignment

For dialogue inputs, we first apply the chat template of each tokenizer, which produces a sequence consisting of alternating sections of (1) *template tokens* and (2) *message tokens*. These two types of sections are handled differently during alignment.

**Template sections**.
Template tokens are structural markers (e.g., role delimiters, formatting tokens) that differ across tokenizers and carry no semantic content. To preserve sequence consistency without introducing unnecessary distortions, these sections are aligned by simple length padding: the shorter side is padded with `<pad>` tokens until both tokenizers’ sequences are of equal length.

**Message sections**.
Message tokens correspond to the actual textual content of user or assistant dialogs. Each target model token in a message section is decoded into its string form and re-encoded using the source model tokenizer.
Special tokens (e.g., `<pad>`, `<eos>`) are mapped directly if possible; otherwise, the source model’s unknown token is used.
For regular tokens, if the re-encoding produces a single source model token, a direct one-to-one mapping is established. If multiple source model tokens are produced (a one-to-many case), one of the two selection strategies is applied:
(1) *first-occurrence selection*: choose the first source model token from the candidate set, yielding a deterministic and computationally efficient mapping.
(2) *Maximal-coverage selection*: decode each candidate token, compute its string length, and select the longest; this heuristic aims to preserve maximal surface correspondence with the original target model token.

**C2C choice** We observed that the two selection strategies generally produce very similar results, with more than 80% of sequences yielding identical alignments across strategies. Based on this observation, we empirically adopt **Maximal-coverage selection** as the default strategy to reduce the risk of losing information in one-to-many tokenization cases.

Through this design, template sections are aligned structurally via padding, while message sections are aligned semantically at the token level, ensuring robust correspondences between target model and source model representations in chat-formatted inputs.

#### A.1.3 Fuser Architecture

**Table 9: Comparison of the default C2C fuser and the complex C2C-C variant (Sharer: Qwen3-4B, Receiver: Qwen3-0.6B). PGR (Performance Gap Recovered) measures the fraction of the accuracy gap between the Receiver and Sharer that is recovered.**

|  | **C-Eval** |  |  | **ARC-C** |  |  | **MMLU-Redux** |  |  | **OpenBook** |  |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Method** | Acc | PGR | Time | Acc | PGR | Time | Acc | PGR | Time | Acc | PGR | Time |
| Qwen3-4B | 68.09 | 100% | 0.24 | 87.48 | 100% | 0.24 | 71.38 | 100% | 0.24 | 79.40 | 100% | 0.25 |
| Qwen3-0.6B | 32.04 | 0% | 0.18 | 41.04 | 0% | 0.19 | 35.53 | 0% | 0.18 | 39.20 | 0% | 0.21 |
| T2T | 36.96 | 14% | 0.92 | 52.00 | 24% | 0.80 | 42.95 | 21% | 0.99 | 46.40 | 18% | 1.70 |
| C2C | 44.40 | 34% | 0.27 | 60.17 | 41% | 0.27 | 45.92 | 29% | 0.27 | 55.20 | 40% | 0.28 |
| C2C-C | 60.63 | 79% | 0.21 | 80.96 | 86% | 0.23 | 62.78 | 76% | 0.15 | 70.40 | 78% | 0.26 |

Beyond the C2C fuser, we also examined a more complex yet potentially more powerful variant, which we denote as **C2C-C (Complex)**. The main complexity comes from the introduction of an additional projection stage: instead of directly concatenating Sharer and Receiver caches as in C2C, Sharer cache is first projected into the receiver’s dimensionality through a 3-layer MLP. The concatenated representation is then processed along two familiar routes—feature fusion and dynamic weighting—to yield the final S&R cache.

The main experiment results are presented in Table 9.
Note that we fix the maximum response length to 8 tokens and the maximum communication length to 256 tokens in this experiment to reduce evaluation cost.
C2C-C attains stronger performance than the default C2C, suggesting that increasing the architectural sophistication of fuser can further amplify the benefits of C2C communication.
In this table, we also report Performance Gap Recovered (PGR) (Ong et al., 2024) metric, which quantifies how much of the performance gap between a weak and a strong model is recovered. Nevertheless, the focus of this work is on introducing the C2C paradigm itself. For this purpose, we adopt a simple yet effective fuser design, leaving systematic investigation of more elaborate architectures to future work.

### A.2 Additional Experimental Results

#### A.2.1 Cache Enrichment Detail

In Table 10 we show the effect of single-layer cache enrichment. Layer 4 and 16 benefit from the cache enrichment approach by replacing the KV-Cache with the few-shot one, while cache enrichment on other layers shows performance degradation.

**Table 10: Accuracy (%) when enriching only a single transformer layer’s KV-Cache via the cache enrichment oracle. Baseline without enrichment: 58.42%. Bold indicates layers that benefit from enrichment.**

| **Layer** | **Acc.** | **Layer** | **Acc.** | **Layer** | **Acc.** | **Layer** | **Acc.** |
|---|---|---|---|---|---|---|---|
| 0 | 56.36 | 7 | 56.82 | 14 | 54.24 | 21 | 57.74 |
| 1 | 56.36 | 8 | 55.01 | 15 | 58.06 | 22 | 57.23 |
| 2 | 57.14 | 9 | 56.78 | 16 | **58.45** | 23 | 55.22 |
| 3 | 57.53 | 10 | 55.29 | 17 | 57.88 | 24 | 55.75 |
| 4 | **58.52** | 11 | 57.05 | 18 | 57.21 | 25 | 56.16 |
| 5 | 56.45 | 12 | 55.04 | 19 | 56.71 | 26 | 55.79 |
| 6 | 54.56 | 13 | 54.83 | 20 | 55.93 | 27 | 55.01 |

#### A.2.2 Strong-to-Weak Communication

**Table 11: LongBenchV1 scores comparing Receiver-only, Sharer-only, T2T, and C2C in the strong-to-weak setting (Sharer: Qwen3-4B, Receiver: Qwen3-0.6B) across different input lengths.**

| Length | Receiver | Sharer | T2T | C2C |
|---|---|---|---|---|
| 0–4k | 30.52 | 50.48 | 38.52 | 41.46 |
| 4–8k | 26.03 | 48.28 | 35.79 | 37.57 |
| 8k+ | 25.99 | 44.36 | 33.79 | 34.23 |
| Average | 27.63 | 47.90 | 36.18 | 37.97 |

Table 11 reports the results on LongBenchV1 when pairing the weak receiver Qwen3-0.6B with a much stronger sharer, Qwen3-4B, under different input lengths. Across all length regimes, C2C consistently outperforms both the receiver alone and the T2T baseline. On average, C2C achieves a 51.01% PGR over the weak-to-strong gap. These results demonstrate that in strong-to-weak settings, C2C can effectively transfer the stronger model’s contextual understanding, yielding notable gains for the weaker receiver.

We additionally evaluated the strong-to-weak setting (Qwen3-0.6B as receiver and Qwen3-4B as sharer) on other benchmarks beyond LongBenchV1. The detailed results are provided in Section A.1.3, Table 9.

#### A.2.3 Accuracy Breakdown

We analyze where the accuracy gains of C2C come from by using Venn diagrams on the MMLU-Redux benchmark, as illustrated in Figure 7. For this analysis, we use the C2C-C variant introduced in Section A.1.3, as it has the potential to achieve stronger performance and provides a clearer breakdown of where C2C ’s accuracy originates.

**Models with comparable capacity**. When the Receiver (Qwen3-0.6B) and the Sharer (Qwen2.5-Math-1.5B-Instruct, denoted as Qwen2.5-Math-1.5B) have comparable overall capacity but complementary strengths, C2C not only inherits part of the Sharer’s ability but also solves additional questions by integrating understanding from both models.

**Models with disparate capacity**. When the Sharer (Qwen3-4B) is substantially stronger than the Receiver (Qwen3-0.6B), C2C tends to integrate more of the stronger model’s understanding. Quantitatively, in the disparate-capacity case (Figure 7(b)), among the questions that the Sharer can answer correctly, C2C also answers 72.11% correctly. In contrast, in the comparable-capacity case (Figure 7(a)), C2C succeeds on only 50.97%.

![图 7(a)｜能力相当的模型对：正确答案集合的 Venn 分解](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig07a-venn-comparable.svg)

*(a) Sharer: Qwen2.5-Math-1.5B, Receiver: Qwen3-0.6B*

![图 7(b)｜能力悬殊的模型对：正确答案集合的 Venn 分解](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig07b-venn-disparate.svg)

*(b) Sharer: Qwen3-4B, Receiver: Qwen3-0.6B*

**Subcategory breakdown**. We analyze the accuracy gains on different subcategories using the radar plot and histogram plot shown in Figure 8, Figure 9, and Figure 10. The result shows that for the Qwen2.5-0.5B and Qwen3-0.6B model pair, C2C outperforms T2T on 12 out of 17 total categories. Using C2C in history, law, and chemistry can bring an additional 7, 7.6, and 7.5 accuracy improvement compared to T2T. For the Qwen3-4B and Qwen3-0.6B model pair, C2C outperforms T2T on all 17 categories. Using T2T in engineering results in a 1% performance drop, showing the case where text communication between models fails to help the receiver models achieve better performance. At the same time, C2C better utilizes the 4B model’s contextual understanding of the problems and achieves a 24% increase in accuracy.

![图 8(a)｜分学科准确率雷达图（Sharer: Qwen2.5-0.5B，Receiver: Qwen3-0.6B）](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig08a-radar-setting1.svg)

*(a) Sharer: Qwen2.5-0.5B, Receiver: Qwen3-0.6B*

![图 8(b)｜分学科准确率雷达图（Sharer: Qwen3-4B，Receiver: Qwen3-0.6B）](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig08b-radar-setting2.svg)

*(b) Sharer: Qwen3-4B, Receiver: Qwen3-0.6B*

![图 9｜相对 Receiver 基线的分学科准确率增益（0.5B / 0.6B）](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig09-gains-setting1.svg)

*Figure 9: Per-subcategory accuracy gain of T2T and C2C over the Receiver baseline on MMLU-Redux. (Sharer: Qwen2.5-0.5B, Receiver: Qwen3-0.6B)*

![图 10｜相对 Receiver 基线的分学科准确率增益（4B / 0.6B）](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig10-gains-setting2.svg)

*Figure 10: Per-subcategory accuracy gain of T2T and C2C over the Receiver baseline on MMLU-Redux. (Sharer: Qwen3-4B, Receiver: Qwen3-0.6B)*

#### A.2.4 Progressive Behavior

![图 11｜融合 cache 替换比例与准确率的关系（前向/后向替换对比）](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig11-proportion.svg)

*Figure 11: MMLU-Redux accuracy as the proportion of the Receiver’s KV-Cache replaced by C2C-fused cache increases. “Former” replaces tokens front-to-back; “Latter” replaces back-to-front. (Sharer: Qwen3-4B, Receiver: Qwen3-0.6B)*

To investigate the impact of fused KV-Cache proportion on the accuracy of the receiver model, we gradually added the proportion of fused KV-Cache derived from the sharer to the receiver model before generating outputs. Specifically, former and latter refer to progressively replacing the receiver’s KV-Cache with the fused KV-Cache from front to back and back to front, respectively.
We observe that the overall accuracy first decreases and then increases as the replacement ratio grows.
The performance reduction may stem from the gap between training and testing, where only the full receiver KV-Cache is used during training.
When the fused proportion goes up to over 50%, the performance of C2C continues to increase with respect to the proportion, reflecting the progressive benefits of C2C.
Note that projecting using the latter cache generally has a larger impact than projecting the former, since it is closer to the final response.

### A.3 Additional Experiment Setup

#### A.3.1 Cache Enrichment

We conducted Oracle experiments with Qwen3-0.6B and Qwen3-4B to examine how KV-Cache enrichment influences model performance. The evaluation was performed on MMLU-Redux. The few-shot examples are selected from MMLU while excluding overlaps with MMLU-Redux to ensure fairness. To probe different ways of applying cache enrichment, we compared four cache enrichment strategies: All-layer Cache Enrichment (apply cache enrichment on all layers), Single-Layer Cache Enrichment (apply cache enrichment only on single layers), Selective Cache Enrichment - Best (select n layers that have the highest accuracy according to Single-Layer Cache Enrichment), Selective Cache Enrichment - Worst (select n layers that have the lowest accuracy according to Single-Layer Cache Enrichment). All methods utilized Few-Shot–optimized KV-Caches while maintaining the same cache length as Zero-Shot, enabling a controlled evaluation of cache enrichment and its layer-specific effects.

#### A.3.2 Cache Transformation

We employed the MMLU-Redux dataset to train a 3-layer MLP that maps the last layer KV-Cache in the source LLM (Qwen3-4B) to the last layer of the target LLM (Qwen3-0.6B). In this oracle experiment, we adopt the MSE loss of the projected KV-Cache and the target KV-Cache instead of the next-token prediction loss, as we aim to test whether the representation space can be transformed using a neural network. The Key Cache and Value Cache are first concatenated on the hidden space dimension, then put for MSE calculation. A detailed calculation of loss is shown in the following code:

```

source_prefilled = source_model.forward(prefill_input_id)
target_prefilled = target_model.forward(prefill_intput_id)
source_k, source_v = source_prefilled.past_key_values[-1]
target_k, target_v = target_prefilled.past_key_values[-1]
project_k = k_projector(source_k)
project_v = v_projector(source_v)
mseloss(torch.dstack([project_k, project_v]),
        torch.dstack([target_k, target_v]))

```

For visualization, 300 samples were randomly selected from the dataset. The source, target, and transformed KV-Cache were all projected into two-dimensional space using t-SNE, allowing us to examine the alignment of representations between the two models. For t-SNE generation, we set perplexity to 50 and max iterations to 1000.

#### A.3.3 Query-level routing

Query-level routing aims to improve the performance–efficiency trade-off by dynamically assigning harder queries to a stronger LLM. Following prior work, we adopt a matrix factorization framework. Query embeddings are obtained from the OpenAI text-embedding-3-small encoder, while model embeddings are taken from pretrained vectors of gpt-4-1106-preview and mixtral-8x7b-instruct-v0.1. These embeddings are used to compute a strong win rate score for each query, which reflects its relative difficulty. Queries are then ranked by this score. For each evaluated model pair, we define the strong model as the one achieving higher standalone benchmark accuracy and the weak model as the lower-performing one. Queries in the upper half of the ranking are routed to the strong model, while those in the lower half are routed to the weak model.

#### A.3.4 Evaluation Method

**Main evaluation**. We evaluate C2C on four multiple-choice benchmarks: OpenBookQA, MMLU-Redux, ARC-Challenge, and C-Eval. For MMLU-Redux, we exclude questions annotated with the error type *no correct answer*. For all evaluations, we adopt a deterministic generation configuration without sampling, using greedy decoding to ensure reproducibility. Specifically, we use Non-CoT prompts, following the unified format described in Section A.3.6. Model outputs are then matched to the correct option labels to compute accuracy. To control evaluation cost, we set the maximum response length to 64 tokens unless otherwise specified, where the response refers to the final answer generated by the Receiver, since the base models do not always follow instructions, and longer limits would substantially increase inference time. For the T2T setting, we additionally set the maximum communication length to 256 tokens, where the communication refers to the messages passed from the Sharer to the Receiver.

**LongBench evaluation**.
We evaluate C2C on the LongBench-E dataset, which comprises a total of 13 individual datasets.
The prompts and evaluation procedures use the official LongBench settings, with a maximum output length of 2,048 tokens.

#### A.3.5 C2C Training

**Training data**.
(1) *Performance experiment.*
The fuser was trained on the OpenHermes-2.5 Dataset with a maximum sequence length of 2,048 tokens. Training used 500,000 samples for one epoch with a macro batch size of 256, corresponding to 1,929 total training steps.

(2) *Scaling sequence lengths experiment.*
The fuser was trained on the LongBench-E benchmark with a maximum sequence length of 12,000 tokens.
The data was randomly split into 3/4 for training and 1/4 for evaluation by data index, ensuring independence between training and evaluation.
Training used 1,896 samples for one epoch with a macro batch size of 16, corresponding to 118 total training steps.

(3) *Scaling model sizes and different model combinations experiment.*
The fuser was trained on the auxiliary_train split of the MMLU dataset with a maximum sequence length of 1,024 tokens. Training used 15,000 samples for one epoch with a macro batch size of 128, corresponding to 116 total training steps.

**Training scheme**. All experiments were conducted with a fixed random seed of 42 to ensure reproducibility. Unless otherwise noted, the training configuration was as follows: optimization employed a learning rate of $1\times 10^{-4}$ with a linear scheduler and a 10% warmup ratio, a weight decay of 0.01, and a maximum gradient norm of 1. The temperature was linearly annealed from 1.0 to 0.001 across the total number of training steps. Layer alignment was configured with the last aligned scheme across all experiments. The tokenization alignment was applied only when the paired models employed different tokenizers, in which case the longest strategy was used. For data preparation, each dataset was partitioned into a training split (99%) and a small held-out validation split (1%). The validation split was not used for model updates but was monitored during training to report evaluation loss.

#### A.3.6 Evaluation Prompts

Text 1 presents the prompts used for the main evaluation on multiple-choice datasets.
Text 2 is the alternative non-CoT version used for response diagnosis in Appendix A.4.4.
Text 3 provides the prompt for the Sharer model in the T2T evaluation; the Receiver model uses the same prompt as in the C2C setting.
Text 4 shows the prompt used in the cache enrichment experiment. For the zero-shot method, no shots are included in the prompt. The few-shot method uses exactly the same prompt as Text 4. For Oracle methods, we adopt the few-shot prompt but remove the KV-Cache associated with the shots after the forward pass.
The prompt for LongBench evaluation follows its official configuration, which varies across the different sub-datasets.

### A.4 Additional Analysis

#### A.4.1 Effective Rank

We list the definition of effective rank that was proposed by Roy and Vetterli (2007) here as a reference. For a matrix W that has size $M\times N$, the singular value decomposition of it can be expressed as $W=U\Sigma V$ and the singular values $\sigma=(\sigma_{1},\sigma_{2},...,\sigma_{min(M,N)})^{T}$ are the non-negative diagonal entries of the matrix $\Sigma$.
The singular value distribution is denoted as:

$$
p_{i}=\frac{\sigma_{i}}{\|\sigma\|_{1}}
$$

Denote the Shannon Entropy as:

$$
H(p_{1},p_{2},...,p_{min(M,N)})=-\sum_{i=1}^{min(M,N)}p_{i}\log p_{i}
$$

The effective rank is defined as:

$$
erank(W)=e^{-\sum_{i=1}^{min(M,N)}p_{i}logp_{i}}
$$

In Figure 12, we present the effective rank of key and value caches across all the layers. The plot shows a continuous increase in the effective rank of value caches after applying C2C, especially in the shallow layers. Key caches after applying C2C also have a comparable effective rank and increase at deep layers.

![图 12(a)｜各层 Key cache 的有效秩](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig12a-erank-key.svg)

*(a) Effective rank of the Key cache.*

![图 12(b)｜各层 Value cache 的有效秩](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig12b-erank-value.svg)

*(b) Effective rank of the Value cache.*

#### A.4.2 Gating Behavior

We analyze the behavior of the learnable gates by contrasting models trained on general-purpose versus task-specific data. This comparison reveals markedly different gating dynamics across the two regimes.

**General-purpose training**.
When C2C is trained on the OpenHermes-2.5 dataset, the learned key and value gates remain almost fully open. Across the three model combinations reported in Table 4, the average gate activation ratio exceeds 98.21%. Despite this near-complete activation, we observe that in certain layers the dynamic weights are concentrated at very small values—for example, the average key weight in some layers falls below 0.1. This suggests that under general-purpose training, C2C leverages the dynamic weighting mechanism to modulate how much information is incorporated from the sharer on a per-query basis, effectively treating dynamic weights as the primary control signal while leaving most gates open.

**Task-specific training**.
In contrast, when C2C is trained on the MMLU auxiliary_train split, the gates exhibit a much sparser activation pattern. Across model combinations shown in Table 7, the average gate activation ratio drops to 52.67%. For the layers where gates do open, however, the dynamic weights are substantially larger, with most layers exhibiting average weights above 0.4. This indicates that under task-specific training, the gating mechanism selects a smaller subset of layers that are consistently useful, while the dynamic weights primarily regulate the contribution strength of these selected layers.

Overall, these findings highlight the adaptive interplay between gates and weights: general-purpose training favors broad gate activation with fine-grained modulation via weights, whereas task-specific training favors sparse gate activation with stronger reliance on the selected layers.

#### A.4.3 Outlier cases in inference time

**Llama3.2**. We observe that the Llama3.2 model achieves significantly lower inference time compared to other baselines in Table 4. This improvement can be attributed to two factors. First, the Llama3.2 model itself has faster inference speed due to its implementation. Second, under the Non-CoT evaluation prompts described in Section A.3.6, the model tends to output only a single option letter (e.g., “A” or “B”), rather than a longer formatted string such as “The correct answer is A.” The shorter outputs further reduce the average decoding time, leading to the observed advantage.

**Qwen2.5-Math**. In contrast, the Qwen2.5-Math model exhibits considerably longer inference time, as shown in Table 7. The primary cause is its tendency to ignore the Non-CoT evaluation and T2T prompts described in Section A.3.6, producing verbose, step-by-step solutions rather than concise answers. To accommodate these long outputs and avoid truncation, we set both the maximum response length and the maximum communication length to 1024 tokens during evaluation. Under this configuration, the model decodes substantially more tokens on average, resulting in significantly longer inference time.

#### A.4.4 Example Model Output

To help better understand the response pattern of different models, we show the example response from different methods using the CoT prompt.
We use Qwen2.5-0.5B as the Sharer model and Qwen3-0.6B as the Receiver model.

As shown in the following examples, Qwen3-0.6B misunderstood the question. It treated a probe for deeper meaning as merely a rephrasing task. Qwen2.5-0.5B-Instruct misinterpreted the question type altogether, taking it as sentence completion and answering the replaced question instead, with overly verbose reasoning. T2T altered the context of the question itself. In contrast, C2C maintained a solid understanding, recognizing that the rewritten sentence aimed to explore deeper moral reasoning, and accordingly selected the correct answer.

#### A.4.5 Training Cost Analysis

Here we present the training cost in Table 12. As shown in the table, accuracy quickly increases in the first few hundred steps. With 300 training steps (less than 9 GPU hours), C2C achieves a comparable result to the final checkpoint.

**Table 12: Training cost (wall-clock and GPU hours) and MMLU-Redux accuracy at each training step (columns) for three Sharer–Receiver pairs.**

| **C2C Setting** | **Metric** | **0** | **50** | **100** | **150** | **300** | **1929** |
|---|---|---|---|---|---|---|---|
| **Qwen2.5-0.5B+Qwen3-0.6B** | Wall-clock (h) | - | 0.15 | 0.29 | 0.44 | 0.87 | 5.59 |
| **Qwen2.5-0.5B+Qwen3-0.6B** | GPU Hours | - | 1.20 | 2.32 | 3.52 | 6.95 | 44.72 |
| **Qwen2.5-0.5B+Qwen3-0.6B** | MMLU-Redux | 35.53 | 40.36 | 41.10 | 42.06 | **44.30** | 42.92 |
| **Llama3.2-1B+Qwen3-0.6B** | Wall-clock (h) | - | 0.18 | 0.35 | 0.53 | 1.05 | 6.78 |
| **Llama3.2-1B+Qwen3-0.6B** | GPU Hours | - | 1.44 | 2.80 | 4.24 | 8.44 | 54.24 |
| **Llama3.2-1B+Qwen3-0.6B** | MMLU-Redux | 35.53 | 28.66 | 41.16 | 43.98 | 44.37 | **44.42** |
| **Qwen3-4B-Base+Qwen3-0.6B** | Wall-clock (h) | - | 0.16 | 0.32 | 0.48 | 0.96 | 6.17 |
| **Qwen3-4B-Base+Qwen3-0.6B** | GPU Hours | - | 1.28 | 2.56 | 3.84 | 7.68 | 49.36 |
| **Qwen3-4B-Base+Qwen3-0.6B** | MMLU-Redux | 35.53 | 38.07 | 39.56 | 40.77 | **44.11** | 43.95 |

Additionally, in Figure 13 we have plots of training loss and validation loss to compare the settings using Qwen2.5-0.5B or Llama3.2-1B as Sharer. The plot shows that for both settings, the training loss converges at 250 steps and the eval loss becomes stable at step 1000, suggesting that C2C across different model families incurs no extra computational cost.

![图 13(a)｜训练损失对比](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig13a-train-loss.svg)

*(a) Training loss comparison*

![图 13(b)｜验证损失对比](/assets/img/posts/cache-to-cache-kv-cache-llm-communication/fig13b-eval-loss.svg)

*(b) Validation loss comparison*

**Table 13: MMLU accuracy in the one-Receiver, multiple-Sharers setting (Receiver: Qwen3-0.6B, Sharer 1: Qwen3-4B-Base, Sharer 2: Qwen2.5-1.5B-Math). Arrows denote KV-Cache transfer direction via C2C.**

| **Type** | **MMLU Acc.** |
|---|---|
| Receiver | 35.53 |
| Sharer1 | 1.03 |
| Sharer2 | 39.86 |
| Sharer1 → Receiver | 60.71 |
| Sharer2 → Receiver | 46.13 |
| Sharer1, Sharer2 → Receiver | 64.60 |

#### A.4.6 Failure Mode Analysis

We have shown that in various settings, C2C, as a new communication paradigm, can increase the receiver model performance by using the sharer’s contextual understanding. However, in some specific cases, C2C can fail to do so as the contextual understanding from the Sharer model is not always accurate and can mislead the Receiver into generating wrong answers. As shown in Figure 7, though in general the number of correctly answered questions increases, there are some questions that the receiver can answer correctly but are answered incorrectly after applying C2C. Below we show an example of an accounting question where Qwen3-0.6B generates the correct answer. However, when using T2T and C2C, Qwen2.5-0.5B conveys incorrect information, leading Qwen3-0.6B to the wrong answer. 
 This type of failure is more likely when using a very weak Sharer with strong Receiver and can lead to a performance degradation as mentioned in the limitation part.

### A.5 C2C Extensions and Future Work

As an initial exploration, this work focuses on pairwise communication to establish a foundation for future research. Communication via KV-Cache among multiple models is a direction that requires future exploration, with different designs that can be employed. Here, we explore two settings that involve multiple Sharers and/or Receivers.

#### A.5.1 One Receiver, Multiple Sharers

We explore the scenario in which three models are involved in the communication. Here we set Qwen3-0.6B as the Receiver and use both Qwen2.5-1.5B-Math and Qwen3-4B-Base as Sharers. Here, we separately trained the C2C fusers from Qwen2.5-1.5B-Math to Qwen3-0.6B and Qwen3-4B-Base to Qwen3-0.6B. The result in Table 13 shows that without additional training, the receiver can use C2C to fuse two Sharers’ semantic information and improve the performance.

#### A.5.2 Multiple Receivers Multiple Sharers

We provide a possible path towards more efficient scaling, with $O(N)$ fusers instead of $O(N^{2})$ fusers to communicate among $N$ LLMs.

The design philosophy is to decompose $M\times N$ communication routes into $M\times 1$, then $1\times N$ steps, with $1$ being the unified latent space.
This is achieved by using Projectors $P_{s_{i}}$ to transform the KV-Cache from different Sharer LLMs $s_{0},\dots,s_{M-1}$ into a unified latent representation KV-Latent $L$, then using the C2C fuser $F_{r_{j}}$ to fuse them with each Receiver model $r_{0},\dots,r_{N-1}$. $C_{s_{i}}$ represents the KV-Cache from model $s_{i}$.
For M Sharers, N Receivers, we have M projectors and N fusers. Each sharer-receiver pair has its own gate.
During training, all Sharer KV-Caches are projected into a unified hidden space with respective Projectors.

$$
C_{s_{i}}\xrightarrow{P_{s_{i}}}U_{s_{i}},\quad i=\mathbb{M}=\{0,\dots,M-1\}
$$

Then, each of the $N$ Receivers fuses all the $M$ available information from this hidden space.

$$
(U_{s_{i}},C_{r_{j}})\xrightarrow{F_{r_{j}}}C_{r_{j}},\quad j=\mathbb{N}=\{0,\dots,N-1\}
$$

This yields $N$ updated caches $C_{r_{j}}^{\prime}$, which can be optimized using the same SFT loss discussed in Section 3.3.4.
Losses from all Receivers are summed to update all Projectors and fusers.
During inference, the model supports both one-to-one and many-to-one (multi-sharer to single receiver) settings.
As an initial exploration, we directly adopted the training data, fuser architecture, and hyperparameter settings from the pairwise fuser training, with vast possibilities left for future work.

In Table 14 we show the result of using Qwen2.5-Coder-0.5B-Instruct and Qwen2.5-Math-1.5B-Instruct as Sharers, Qwen3-0.6B and Qwen2.5-0.5B-Instruct as Receivers.

**Table 14: MMLU-Redux accuracy in the multiple-Receiver, multiple-Sharer setting with shared latent projectors. Receivers: Qwen3-0.6B and Qwen2.5-0.5B-Instruct; Sharers: Qwen2.5-Coder-0.5B-Instruct and Qwen3-4B-Base.**

| **Sharer** | **Receivers (MMLU Acc.)** |  |
|---|---|---|
| **Sharer** | Qwen3-0.6B | Qwen2.5-0.5B |
| None | 34.78 | 38.44 |
| Coder-0.5B | 46.07 | 42.44 |
| 4B-Base | 51.23 | 59.17 |
| Both | 51.08 | 59.81 |

#### A.5.3 Incorporating with Agentic Flow

Here we show an exploration of C2C in agentic flow. We adopt the agentic flow for math problem-solving, following the workflow and prompts from Cognify (He et al., 2025). The workflow consists of a problem interpreter that analyzes the math problem and a problem solver that calculates the answer. For C2C, we use the prompt of the math solver, so the problem interpretation is done by KVCache fusion. Here we present the result on GSM8K. As shown in the table, the multi-agent flow increases the accuracy of math problem solving by 20.01. C2C has an accuracy of 62.55, increasing the accuracy by 1.37 when compared with the multi-agent flow using T2T. The performance can be further elevated to 78.01 by using T-C2C, which lets the math interpreter generate the interpretation and use C2C on both the question and the interpretation.

**Table 15: GSM8K accuracy comparing single-model inference, multi-agent T2T flow, C2C, and T-C2C (T2T interpretation combined with C2C cache fusion).**

| Method | Accuracy |
|---|---|
| Single Model (Qwen3-0.6B) | 41.17 |
| T2T (Multi-agent flow) | 61.18 |
| C2C | 62.55 |
| T-C2C | 78.01 |

# 第二部分：中文结构化解读

> 以下为独立撰写的中文解读，聚焦「论证链条是否成立」「证据强度如何分层」「对工程实践意味着什么」三件事，不逐句复述原文，也不替代原论文。原文数据以第一部分为准。

## 一、核心主张

一句话：**两个大模型之间不必通过「写一段话再读一段话」来交换信息，可以直接把一方的 KV-Cache 投影、融合进另一方的 KV-Cache。**

论文把提供上下文理解/知识的一方称为 **Sharer**，把使用它的一方称为 **Receiver**。C2C（Cache-to-Cache）在 Receiver 的 prefill 阶段，用一个小型神经网络把 Sharer 的 KV-Cache 融合进 Receiver 的对应层，然后照常解码。

三个量化的结论：

| 对比对象 | 平均提升 |
|---|---|
| 单个模型（Receiver-only / Sharer-only） | **+6.4% ~ +14.2%** 准确率 |
| 文本通信（Text-to-Text，T2T） | **+3.1% ~ +5.4%** 准确率，**平均 2.5×** 延迟加速 |
| 查询级路由（Query-level Routing） | 路由的准确率上限是「两个模型里更好的那个」，C2C 能超过这个上限 |

## 二、问题定义：文本为什么是瓶颈

论文对 T2T 的诊断有三条，值得逐条看：

1. **带宽瓶颈（information bottleneck）**。模型内部是「高维表示」，要传给另一个模型必须先压缩成「线性字符串」，接收方再解压回自己的表示。这个压缩—解压往返本身就是有损的。论文举的例子极具代表性：Coder 模型想让 Writer 模型知道 `<p>` 在这里是「段落分隔符」，用自然语言描述，Writer 会把内容插错位置——**结构语义在文本信道里丢了**。

2. **语言固有的歧义**。习语、指代不清、模糊表达。论文承认 MCP、A2A 一类协议在标准化文本消息，但「刚性模板对灵活开放域协作仍然不够」。

3. **延迟**。每一次交换都要把「解释」逐 token 解码出来。

其中第 1 条和第 3 条是**可以被绕过**的：KV-Cache 本身是高维表示（不用压缩），而且投影融合可以并行（不用逐 token）。

但第 2 条其实并没有被「解决」——C2C 只是绕开了文本信道，语言歧义问题依然存在于提示词里。论文把它当作动机，而不是当作被 C2C 攻克的问题，这个措辞是诚实的。

## 三、论证链条：三个 Oracle 实验

这是全文方法论上最值得学的一段。作者没有直接上架构，而是先用「作弊实验」（oracle）把两个前提问题分开证明。

### 前提一：KV-Cache 能不能在同长度下携带更多语义？

设计很干净。三条路径：

| 设置 | prefill 内容 | 解码时用的 cache | cache 长度 |
|---|---|---|---|
| Direct（基线） | 问题 $X$ | $\mathcal{C}(X)$ | $\lvert X\rvert$ |
| Few-shot | 示例 $E$ + 问题 $X$ | $\mathcal{C}(E\oplus X)$ | $\lvert E\rvert+\lvert X\rvert$ |
| **Oracle** | 示例 $E$ + 问题 $X$ | **只保留问题那一段**：$\mathcal{C}^{*}(X)=\mathcal{C}_{[\,\lvert E\rvert:\lvert E\rvert+\lvert X\rvert\,]}(E\oplus X)$ | $\lvert X\rvert$ |

结果：Direct **58.42** → Few-shot **63.39**（cache 变长）→ Oracle **62.34**（cache 长度不变）。

**关键推论**：Oracle 和 Direct 的 cache 长度完全相同，唯一差别是「问题那一段的 cache 是在看过示例之后算出来的」。所以 62.34 − 58.42 = **3.92 个点的增益来自「语义更丰富」，而不是「看了更多 token」**。

这一步的重要性在于：它把 KV-Cache 从「计算副产品」提升为「可独立承载语义的介质」。**没有这一步，整个 C2C 立不住。**

### 前提二：不同模型的 KV-Cache 能不能互相转换？

用一个 3 层 MLP 把 Qwen3-4B 最后一层的 KV-Cache 映到 Qwen3-0.6B 的空间，训练目标是 MSE（而不是 next-token loss），因为要验证的是「表示空间可否变换」，不是「任务性能」。

t-SNE 结论有两句，第二句更值得注意：

- 变换后，源模型的 cache 落进了目标模型的表示空间内 → **可转换**；
- 但只占目标空间的一个**较小子集** → 源模型（更大）的语义**无法完全覆盖**目标的。

第二句是全文一个重要的自我设限：跨模型融合不是「无损继承」，而是「部分互补」。作者顺势补了一个旁证：不同模型的正确答案集合重叠有限，即使各自的总准确率相近（Figure 7：能力相当的一对，C2C 能答对 Sharer 答对的 50.97%；4B 对 0.6B 的悬殊一对，这个比例升到 **72.11%**）。

### 前提一到前提二的推论

- 富化有用 → 值得做融合；
- 但**不是所有层都受益**：单层富化实验（Table 10）里，28 层中只有第 4 层（58.52%）和第 16 层（58.45%）超过基线 58.42%，其余层反而下降；
- 所以需要**可学习的门控**来挑层——这正是 C2C 第三个模块的由来。

这条「实验 → 反例 → 设计」的路径比直接讲架构清楚得多。

## 四、机制拆解

### 4.1 数学形式

融合后的 cache 是对 Receiver 原始 cache 的**残差注入**：

$$
\mathcal{C}^{\mathcal{F}}=\left\{\mathcal{C}_{n}(X)+\mathcal{F}_{n}\!\left(\mathcal{C}_{n}(X),\ \mathcal{C}^{\mathcal{S}}_{\mathcal{G}(n)}(X)\right)\right\}_{n=1}^{N}
$$

读法：第 $n$ 层的结果 = Receiver 第 $n$ 层原值 + 融合器输出。$\mathcal{G}$ 是层映射（Sharer 的哪一层对应 Receiver 的第 $n$ 层）。

**「加」而不是「换」是设计要点**，下面消融数据会证明这一点是生死线。

### 4.2 融合器的三个模块

| 模块 | 做什么 | 为什么 |
|---|---|---|
| Projection（投影） | 拼接双方 cache → 投影层 → 特征融合层 | 跨维度、跨模型对齐 |
| Dynamic weighting（动态加权） | input-aware 的 head 调制，按查询动态重新加权 | 不同问题上，Sharer 的有用程度不同 |
| Learnable gate（可学习门控） | 每层一个可训练门值，Gumbel-sigmoid + 温度退火（训练时可微 → 推理时二值） | 决定「这一层要不要注入」 |

### 4.3 两级对齐

跨模型融合必须先解决「对不上」的问题：

- **Token 对齐**：不同 tokenizer 对同一句话切分不同。做法是把 Receiver 的每个 token 解码成字符串、再用 Sharer 的 tokenizer 重编码。一对多时提供两种选择——*first-occurrence*（取第一个）与 *maximal-coverage*（取解码后字符串最长的）。实测两策略 80% 以上结果一致，默认选后者（更不容易丢信息）。
- **层对齐**：把两个模型的层从「输出侧」开始反向配对（最后一层对最后一层、倒数第二对倒数第二……）。论文比较了另一种按深度归一化的对齐方案，**两者接近但 terminal alignment 略好**，于是采用它。

值得注意的是，论文对层对齐只给了「经验上略好」这一句解释，**没有理论依据**。这是一个诚实的留白。

### 4.4 训练

冻结 Sharer 与 Receiver，**只训融合器**。损失是 Receiver 的 next-token prediction（相当于 SFT），只是条件从「自己的 cache」换成「融合后的 cache」。三步循环：双方各自 prefill → 融合并替换 → Receiver 用融合 cache 预填回答并回传梯度。

## 五、实验证据

### 5.1 主结果（Receiver 固定 Qwen3-0.6B）

| Sharer | 对单模型提升 | 对 T2T 提升 | 相对 T2T 延迟加速 |
|---|---|---|---|
| Qwen2.5-0.5B-Instruct | +11.00% | +5.36% | 3.46× |
| Llama3.2-1B | +9.64% | +4.15% | 1.51× |
| Qwen3-4B-Base | +11.88% | +3.06% | **14.41×** |

评测覆盖 MMLU-Redux、OpenBookQA、ARC-Challenge、C-Eval 四个多选基准。

### 5.2 最能说明问题的一组数字

**Qwen3-4B-Base 作为 Sharer 时，它自己单独评测只有 1.03%~5.65% 的准确率**——因为它是不听指令的 base 模型，根本不会按格式作答。于是 T2T 需要它先「生成分析文本」，结果要么跑偏、要么啰嗦到爆炸：

| 指标 | T2T | C2C |
|---|---|---|
| MMLU-Redux 准确率 | 43.87 | **43.95** |
| 单题推理时间 | **7.54 s** | **0.45 s** |

**这是全文最有说服力的案例**：一个「不会说话」的模型，它的知识仍然可以被 0.6B 的小模型取用——因为知识本来就不在文本层，而在 cache 里。C2C 绕过了这个模型的语言能力缺陷。

### 5.3 效率从哪来（Table 3 拆解）

T2T 的代价被量化得很清楚：Sharer 需要解码 **80 个 token**，产生 **1312 ms** 的解码开销；C2C 用一次**并行 cache 融合（90 ms）** 替代了这段串行解码。Receiver 侧的解码时间基本不变（231 ms → 308 ms），因为回答该生成还是要生成。

也就是说：**C2C 省掉的是「中间传话」的成本，不是推理本身的成本。**

### 5.4 消融：哪些设计是必需的

**改善来源（Table 6）**——排除「只是加了参数」的质疑：

| 设置 | 参数量 | OpenBook | ARC-C | MMLU | C-Eval |
|---|---|---|---|---|---|
| Single（只微调 Receiver） | 596 M | 45.80 | 47.65 | 36.81 | 35.81 |
| Identical（同模型自融合） | 529 M | 50.60 | 52.52 | 42.17 | 40.34 |
| **C2C（异模型融合）** | **478 M** | **52.60** | **54.52** | **42.92** | **41.77** |

参数**最少**的 C2C 效果最好 → 增益不来自训练容量。另外 Identical 也优于 Single，说明「cache 层自通信」本身就有用（作者把它关联到 latent reasoning 与 looped transformer 一类工作）。

**融合器组件（Table 8）**——这一张表暴露了设计红线：

| 方法 | MMLU | ARC-C | OpenBook | C-Eval | 平均 |
|---|---|---|---|---|---|
| Project（直接替换 Receiver 的 cache） | 20.01 | 19.57 | 21.80 | 21.41 | **20.70** |
| +Fuse（残差融合） | **43.36** | 51.65 | 47.60 | 36.91 | 44.88 |
| +Gate（= C2C） | 42.92 | **54.52** | **52.60** | **41.77** | **47.95** |

**用投影后的 Sharer cache「换掉」Receiver cache，准确率直接崩到 20.7%**（比 Receiver 单跑 35.53% 还低）。加上残差融合后跳到 44.88%（+24.18%），再加门控到 47.95%（+3.07%）。

结论：**Receiver 自己的 cache 不能丢**。融合是「叠加理解」，不是「替换理解」。

### 5.5 规模行为

- **序列长度**（LongBenchV1，Qwen3-0.6B Receiver + Qwen2.5-0.5B Sharer）：

| 长度区间 | Receiver | Sharer | T2T | C2C |
|---|---|---|---|---|
| 0–4k | 30.52 | 24.94 | 33.46 | **37.31** |
| 4–8k | 26.03 | 23.18 | 29.70 | **34.01** |
| 8k+ | 25.99 | 16.44 | 25.64 | **30.72** |

长上下文区间优势不但没衰减，反而在 8k+ 时拉开更大（+5.08 对 T2T）。

- **模型规模**：Sharer 越强，C2C 的增益上升得比 T2T 更快（Figure 6）。论文解释为「Sharer 拥有更丰富的知识时，C2C 能更有效地把有用信息传过去」。同时指出更大的 Receiver 相对增益较小——因为它本身强、且与 Sharer 的知识重叠更多。
- **强→弱**：Qwen3-4B → Qwen3-0.6B，LongBenchV1 平均 **PGR 51.01%**（回收了强弱差距的一半）。
- **异构组合**：五种不同族/专长组合上，C2C 平均比 T2T 高 **8.59%**；把 Sharer 与 Receiver 角色互换，C2C 仍稳定 **+5.05%**，而 T2T 反向掉 **−6.30%**。

### 5.6 行为分析：三个有信息量的发现

**（1）有效秩上升 → 语义空间确实被拓宽。** 融合后 K cache 有效秩 388 → 395，V cache 532 → 560（Table 2）。作者用「内在维度变高 = 语义更丰富」来解释。幅度不大但方向一致，且 V cache 提升更明显、浅层尤甚（Figure 12）。

**（2）门控的「打开率」反映训练取向。** 这是一个很少被讨论、但工程上很有用的观察：

| 训练数据 | 门平均激活率 | 调节主力 |
|---|---|---|
| 通用数据（OpenHermes-2.5） | **> 98.21%** | 动态权重（有的层平均 key 权重 < 0.1） |
| 任务专精（MMLU aux train） | **52.67%** | 门控选层（被选中的层平均权重 > 0.4） |

即：**通用训练倾向于「门全开、靠权重细调」；任务训练倾向于「少选层、靠权重加强」**。这意味着门控值本身可以作为「这个 Sharer 对这一任务是否真的有补充信息」的诊断信号。

**（3）渐进行为揭示训练/推理不匹配。** 逐步提高「被融合 cache 的比例」时，准确率**先降后升**，超过 50% 后才单调变好。作者归因于训练时只用完整 Receiver cache、测试时却替换一部分造成的分布差异。另外「从后往前替换」比「从前往后」影响更大——因为更靠近输出。

这一条其实是个**警告**：C2C 的收益是「全有或全无」式的，部分融合会破坏已训练好的状态。

## 六、扩展方向（附录）

### 6.1 一个 Receiver 多个 Sharer（Table 13）

Qwen3-0.6B 作为唯一 Receiver，分别训好两个独立融合器，推理时**不做任何额外训练**即可叠加：

| 组合 | MMLU 准确率 |
|---|---|
| Receiver 单独 | 35.53 |
| 只接 Sharer1（Qwen3-4B-Base） | 60.71 |
| 只接 Sharer2（Qwen2.5-1.5B-Math） | 46.13 |
| **Sharer1 + Sharer2 同时接** | **64.60** |

多源信息可以叠加，这是好消息。

### 6.2 多对多：把 $O(N^2)$ 压到 $O(N)$

设计思路是把 $M\times N$ 条通信路径**分解成** $M\times 1$ 再 $1\times N$：用 $M$ 个 Projector 把各 Sharer 的 cache 投到**统一的 KV-Latent 空间**，再用 $N$ 个 fuser 融合进各 Receiver。这样只需要 $M+N$ 个模块而不是 $M\times N$。Table 14 的初步结果支持这一路线（Qwen3-0.6B：34.78 → 51.23；Qwen2.5-0.5B：38.44 → 59.17）。

但注意细节：这组数据里「两个 Sharer 同时用」相比「只用强的那个」提升很小（51.23 → 51.08 甚至略降）。所以**共享 latent 空间的方案目前还只是「可行」，不是「已经划算」**。

### 6.3 接入 Agentic 流程（Table 15，GSM8K）

| 方法 | 准确率 |
|---|---|
| 单模型（Qwen3-0.6B） | 41.17 |
| 多 agent T2T 流程（Cognify 式：解释器 + 求解器） | 61.18 |
| C2C（求解器提示词，理解交给 cache 融合） | 62.55 |
| **T-C2C**（解释器仍出文本，但问题与解释都走 cache 融合） | **78.01** |

**T-C2C 这 78.01 是最亮的一个数字**，比 T2T 流程高 16.83 个点。它说明 C2C 并不要求「完全抛弃文本」——**混合形态（文本做显式推理、cache 做语义传递）可能才是现实中最优的**。这一点论文自己只给了两行，但工程含义很大。

## 七、批判性评估：结论的可采信度分层

按证据强度重排全文结论：

| 结论 | 证据强度 | 理由 |
|---|---|---|
| KV-Cache 在同长度下可承载更丰富语义 | **强** | Oracle 设计干净（丢弃示例段 cache），因果隔离清楚 |
| KV-Cache 可跨模型族/尺寸转换 | **强** | t-SNE + 定量重叠率双向支持；且作者主动标注了「只覆盖子集」的限制 |
| 残差融合是必需设计（不可直接替换） | **强** | 20.70% vs 44.88% 的差距大到无需统计检验 |
| C2C 优于 T2T（准确率 + 延迟） | **中** | 方向一致、覆盖多模型对；但延迟数字依赖具体硬件与实现，且 T2T 的 baseline 拉得较低（参考下方质疑） |
| 训练成本低（300 步 / <9 GPU 小时） | **中** | 只有 ≤1.5B 量级的模型对上有数据 |
| 可高效扩展到多模型（$O(N)$） | **弱-中** | 仅「初步探索」，且 Table 14 中多 Sharer 叠加的边际收益已接近 0 |

### 需要读者自己补上的边界

1. **规模天花板**。全部实验都在 **≤14B、主体是 0.5B–4B** 的模型对上。没有任何 70B+ 或前沿模型的证据。融合器的设计（残差 + 门控）在更大模型上是否同样成立，论文没有回答。

2. **评测面的局限**。四个多选题基准 + LongBench-E + GSM8K，全部是「有标准答案」的任务，**没有开放式生成质量的评估**。而「C2C 是否保留了原文的风格、语气、细节」恰恰是文本通信之外的盲区——用多选题测不出。

3. **T2T baseline 的强弱**。T2T 一侧只让 Sharer 生成「关键信息分析文本」，且提示词是固定的（附录 A.3.6）。这是一个**未经调优**的 baseline。一个认真做过 prompt engineering 的 T2T 流水线可能拉近差距。论文的 +3~5% 应在这个前提下理解。

4. **带宽成本未被评估**。这是我认为最实质的缺口：**KV-Cache 的体量远大于等效文本**。传输/共享一份 cache，比传一段话要多得多的字节。论文的「2.5× 加速」是在**单张 A100、batch=1 的本地场景**下测的——此时 cache 不需要跨网络。一旦进入跨节点/跨服务，cache 的传输开销会直接吃掉这部分收益，甚至反向变差。论文完全没有讨论这个维度。

5. **部署形态被隐含限定**。C2C 要求**拿到对方的 KV-Cache**，这意味着：
   - Sharer 必须**本地可跑**（或至少能看到其内部状态）；
   - **无法用于只暴露 API 的第三方模型**（你拿不到闭源服务的 KV-Cache）。

   所以 C2C 本质是「**自托管多模型栈的内部优化**」，而不是「跨服务模型编排的通信协议」。这一点论文没说明确，但对落地选型是决定性的。

6. **失败模式是真实的**。附录 A.4.6 给出了一个会计题的例子：Receiver 原本答对，Sharer 传了错误上下文，T2T 和 C2C 都被带偏。作者明确说「这种失败在使用极弱 Sharer + 强 Receiver 时更容易发生」。这与「Sharer 质量直接决定 Receiver 表现」的限制一致——**C2C 会放大 Sharer 的错误，也会放大它的正确**。

7. **隐私方向的反直觉**。论文把「隐私感知协作：传输 KV-Cache 片段而不暴露显式文本」列为未来方向。但从安全角度，**cache 是比文本更原始的内部状态**，它可能编码了文本里没有的信息（也更难审计、更难脱敏）。把它当作「隐私增强」还是「隐私风险」，需要另外的专门研究——论文的表述偏乐观。

## 八、对工程实践的启示

### 8.1 短期内能用上的，是方法而不是代码

以使用外部 LLM API（如 DeepSeek 的 OpenAI-compatible 接口）为主的技术栈，**目前无法直接使用 C2C**——拿不到第三方模型的 KV-Cache。它的适用前提是「自己在同一台机器/同一个推理栈上跑多个模型」。

但**方法层面有三点可以立刻搬走**：

- **Oracle 先行的论证范式**。在花力气搭系统之前，先设计一个「如果信息传递是完美的，收益有多大」的作弊实验，用上限值决定值不值得投入。C2C 的 Oracle 实验（丢弃示例段 cache、只保留问题段）就是一个很好的模板，可以直接套用到业务 NLP 任务上：**判断某个信息瓶颈到底值不值得优化**。
- **多智能体流水线里的「传话反模式」**。如果团队在做多 agent 流程，中间产物用长自然语言「传话」是信息损耗与延迟的双重来源。可行的折中是本文的 **T-C2C 形态**——显式推理仍走文本（可读、可审计），但**密集语义走结构化/嵌入表示**，而不是长篇自然语言。
- **门控激活率当诊断信号**。如果将来做任何「多源信息融合」的模型改造，门控的打开率可以作为「这个信息源在当前任务上是否真的有增量」的廉价探针。

### 8.2 什么时候值得考虑 C2C 这条路线

| 条件 | 是否成立 |
|---|---|
| 你想让「更强的模型」帮助「更便宜的模型」，且两者都在自托管栈内 | ✅ 典型适用 |
| 你只是想降低推理成本（用小模型替代大模型） | ⚠️ 需要 Sharer 本来就在跑才划算，否则多一次 prefill |
| 你需要跨服务/跨 API 的模型协作 | ❌ 不可用（拿不到 cache） |
| 你需要严格可审计的中间产物 | ⚠️ 建议用 T-C2C 混合形态 |
| 你的瓶颈是长上下文的显存/成本 | ✅ 论文的长序列结果（8k+ 仍有 +5）指向这条价值 |

### 8.3 一个容易忽略的成本项

C2C 的推理期开销是**双方的 prefill + 一次 cache 融合**。如果 Sharer 本来就要为别的目的跑（例如它同时是路由器、或它本来就是这个请求的主模型），这份 prefill 是「顺带」的，几乎免费；但如果**为了 C2C 专门去跑一个 Sharer**，就要把它的 prefill 时间算进总账。论文 Table 3 里 Receiver-only 总时间 308 ms、C2C 445 ms——**如果只算单次请求、不考虑 Sharer 的复用，C2C 比单模型慢**。它的优势是对比「需要传话的多模型方案」，不是对比「单模型方案」。这一点在推广时很容易被误读。

## 九、与本站其他文章的联系

- **[推理引擎系列：Paged KV-Cache](/posts/inference-10-paged-cache/)**——C2C 直接操作 KV-Cache 的内存布局与层级结构，理解分页管理的读者会更容易看懂「融合某一层意味着什么」。
- **[Prefill 与 Decode 两阶段](/posts/inference-05-prefill-decode/)**——C2C 的全部收益都锚在「prefill 可以并行、decode 必须串行」这一结构差异上；这篇是本篇最好的前置读物。
- **[循环/复用 Transformer 的可视化指南](/posts/recurrent-looped-transformer-visual-guide/)**——论文的 Identical 消融（同模型自融合也涨点）与 latent reasoning、looped transformer 系列工作在机理上同源。
- **[并行策略综述](/posts/inference-14-parallelism/)** 与 **[vLLM 引擎](/posts/inference-08-vllm-engine/)**——若要把 C2C 落到生产推理栈，融合器如何与现有调度、并行切分共存是下一个问题。
- **光互联 / CPO / NPO 系列**（如 [通往 CPO 之路](/posts/newphotonics-on-the-road-to-cpo-npo/)、[CPO 模块级测试](/posts/senko-advantest-viavi-cpo-module-level-testing/)）——本文提到的 cache 通信（论文引用了 Mooncake 这类以 KV-Cache 为中心的分离式架构）把「模型间的互联带宽」推成新的瓶颈。**KV-Cache 的中心化与多模型协作，是光互联需求的上游驱动力之一**：如果 cache 而非文本成为模型间通信的默认介质，单位请求要搬运的字节数会上升一个量级。

## 十、一句话结论

C2C 证明了一件反直觉但重要的事：**大模型之间的「知识」不必先变成「语言」才能传递**。它在 ≤4B 模型对上给出了干净、可复现的增益（+6.4~14.2% 准确率、2.5× 延迟优势），并把「Query-level Routing 的准确率上限只能到两个模型中更好的那个」这条天花板掀掉了。

但要看清它的边界：**它是自托管多模型栈的内部优化，不是跨 API 的通用协议；它省的是「传话」的成本，不是「推理」的成本；它在多选题上验证充分，在开放生成、大模型规模、跨节点带宽三件事上仍缺乏证据。** 最值得带走的不是它的实现，而是它那套先把「信息介质本身值不值得优化」用 Oracle 实验钉死的做法。

