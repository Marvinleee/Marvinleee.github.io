---
layout: post
title: "推理系统 04：从 logits 到下一个 Token"
date: 2026-09-07 21:00:00 +0800
categories: [人工智能, 推理系统]
tags: [Logits, Softmax, Sampling, Qwen, vLLM]
description: "推导输出投影、稳定 Softmax、温度、top-k、top-p、随机采样与停止条件，解释概率如何成为下一个 Token。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-03-transformer-layer/) · [下一章](/posts/inference-05-prefill-decode/)

第 3 章的 36 层之后，最终隐藏状态仍是 4096 个数。模型需要把它变成词表中每个候选的分数，再由解码策略选出一个 Token。这个选择会成为下一轮输入，所以一次微小差异可能改变此后的完整生成轨迹。

<iframe src="/assets/interactive/inference-systems-lab/#sampling" title="Logits 与采样实验" loading="lazy" style="width:100%;height:760px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 输出头与 logits

对当前最后位置隐藏向量 h∈ℝᵈ，输出投影为 z=hWᵀ，其中 z∈ℝⱽ。Qwen3-8B 的 V=151936，配置 `tie_word_embeddings=false`，所以输出头与输入嵌入不是同一组权重。z 的每一项称为 logit；它没有被限制在 0—1，也不是已经归一化的概率。

Softmax 将其变为分布：

$$p_i=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}.$$

计算时应先令 m=max(z/T)，再使用 exp(zᵢ/T−m)。所有项同时减 m 不改变比值，却避免大正数指数溢出。实现常以更高精度做规约；“权重是 BF16”不等于概率计算全过程只能使用 BF16。

温度 T>1 压平分布，0<T<1 放大差距。T=0 不能代入除法，通常表示单独的贪心规则 `argmax(z)`。温度改变相对分布，不会为模型增加知识。

## top-k 与 top-p

top-k 只保留分数最高的 k 个候选。top-p 将候选按概率降序排列，保留累计概率首次达到阈值 p 的最小前缀。两者共同使用时，执行顺序会影响候选集合，因此必须记录实现与配置；实验明确采用先 top-k、后 top-p。

截断后必须重新归一化。设保留集合 S，则 qᵢ=pᵢ/Σⱼ∈S pⱼ（i∈S），其他候选为 0，随后从 q 抽样。固定随机种子也不保证跨硬件、库版本和并行配置绝对复现，因为浮点规约、候选排序与随机数消费顺序可能改变。

贪心解码确定地选最大项；抽样解码随机选取。beam search、重复惩罚、语法约束和自定义 logits processor 又会改变路径。本章实验只展示温度与两种常见截断。

## 停止与流式边界

生成可因 EOS Token、最大输出长度、停止字符串、结构化输出完成、客户端取消或服务端策略而结束。EOS 是词表候选；停止字符串通常需要对已解码文本匹配，两者层级不同。

已采样 Token 不一定立刻形成可显示的完整文本，停止串也可能跨片段。网络 chunk 数不能当作 Token 数。top-p 的候选数也不是固定的：分布尖锐时少，分布平坦时多。

资料：[Transformers 生成策略](https://huggingface.co/docs/transformers/main/en/generation_strategies)。互动数值为固定玩具 logits，不是 Qwen3 真实输出。
