---
layout: post
title: "推理系统 05：Prefill 与 Decode 为什么是两种工作负载"
date: 2026-09-07 21:01:00 +0800
categories: [人工智能, 推理系统]
tags: [Prefill, Decode, KV Cache, Arithmetic Intensity]
description: "从矩阵形状、依赖关系与算术强度解释 Prefill 和 Decode 的性能差异，以及为什么批量和上下文会改变瓶颈。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-04-logits-sampling/) · [下一章](/posts/inference-06-memory/)

Prefill 与 Decode 使用同一套权重，却有不同形状和复用条件。把两者都称为“一次前向传播”在数学上可以，在性能分析上不够。

<iframe src="/assets/interactive/inference-systems-lab/#roofline" title="算术强度实验" loading="lazy" style="width:100%;height:720px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## Prefill：许多已知位置一起进入

长度 T 的输入全部给定。线性层概念上计算 [T,d]×[d,f]，权重可在多个 Token 间复用。因果注意力仍限制位置 t 只能读取 0…t，但高效内核能并行组织大量工作。

注意力稠密计算量随 T² 增长，投影与 MLP 主要随 T 增长。分块 Prefill 会把长输入跨调度轮推进，改变调度和峰值工作集，却不改变模型应得到的因果结果。

Prefill 最后位置产生首个输出，因此 TTFT 包含排队、输入处理、Prefill、采样和传输。输入越长通常工作越多，但真实延迟还受批量、缓存命中与内核影响。

## Decode：每轮只有新位置未知

自回归依赖意味着第 n 个输出要等第 n−1 个确定。每轮通常为每个活跃序列处理一个新 Token；历史 K/V 从缓存读取，无需重新生成。

缓存没有让历史消失。当前 Query 仍读取可见历史 Key 并聚合 Value；每轮也需读取模型权重。小批量 Decode 中，权重难以在足够多 Token 间摊销，常表现出更强的带宽约束。

连续批处理让一步同时处理许多序列，提高矩阵宽度与权重复用，代价是排队和单请求延迟可能变化。吞吐与时延不能同时无限优化。

## Roofline 上界

算术强度 I=FLOPs/传输字节。峰值计算 C、带宽 B 给出：

$$P\le\min(C,BI),\qquad I^*=C/B.$$

I<I* 时带宽上界更紧，I>I* 时计算上界更紧。它不是延迟预测器：缓存层次、有效带宽、融合、占用率、通信和启动开销都会让实际值更低。

Prefill 通常形成较高算术强度；Decode 的强度随并发批量增加。这些是条件性倾向，不能只凭阶段名称断言瓶颈。

## 指标分工

TTFT 是请求到首个输出；TPOT 常按首 Token 后时间除以后续 Token 数；ITL 是相邻流式 Token 间隔；E2EL 是完整端到端时间。工具对起终点可能不同，比较时必须固定实现定义与负载分布。

资料：[vLLM benchmark 指标](https://docs.vllm.ai/en/v0.10.2/cli/bench/serve.html)。实验滑块为抽象上界，不对应具体产品。
