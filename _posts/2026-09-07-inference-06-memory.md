---
layout: post
title: "推理系统 06：模型推理的内存究竟用在哪里"
date: 2026-09-07 21:02:00 +0800
categories: [人工智能, 推理系统]
tags: [HBM, KV Cache, Memory, Qwen, vLLM]
description: "分别核算权重、KV Cache、激活、临时工作区、运行时与碎片，建立单卡和多卡容量预算。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-05-prefill-decode/) · [下一章](/posts/inference-07-quantization/)

“8B 模型用 BF16 大约 16 GB”只是权重数量级。服务能否运行，还取决于缓存、临时张量、内核工作区、框架状态、通信缓冲和碎片。

<iframe src="/assets/interactive/inference-systems-lab/#memory" title="推理容量实验" loading="lazy" style="width:100%;height:760px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 权重预算

参数量 P、平均每参数 b 位，紧凑理论容量为 Pb/8 字节。实际量化还有尺度、零点、分组元数据与对齐；部分权重可能保留高精度。checkpoint 文件、加载时主机内存和最终设备内存不是同一数字。

Tensor Parallel 可分片部分权重，但归一化、小参数或某些状态可能复制。Pipeline Parallel 按层切分，负载均衡取决于每级内容。

## KV Cache 预算

Qwen3-8B 单序列缓存为：

$$M_{KV}=2LH_{kv}d_hTs.$$

BF16 下每位置 144 KiB，4096 位置为 576 MiB。N 条同长度、无共享序列为 N 倍。生成 Token 会继续增长；前缀命中可共享物理块，但逻辑长度仍存在。

分页使容量以块分配。请求使用 t 个 Token、块大小 q，需要 ceil(t/q) 块，尾块空位为 ceil(t/q)q−t。块大可能减少元数据和管理次数，却提高尾部浪费上界。

## 动态空间

推理不保存训练反向激活，但执行步仍需隐藏状态、投影、规约与采样缓冲。融合能减少完整中间张量写回；图捕获可能预留多种批次形状；通信库也分配缓冲。

分配器“已保留”、张量“已分配”和设备总使用量要区分。诊断 OOM 应记录请求形状、并发、缓存块、图模式和量化，而不只截取一个显存数字。

规划时先从每卡可用容量减去权重与常驻开销，余量才属于 KV 和工作区。按真实输入/输出长度分布估算，同时用最坏情况检验拒绝与抢占。实验的“其他 10%”只是教学预留，不能替代 profiling。

资料：[vLLM CacheConfig](https://docs.vllm.ai/en/v0.10.2/api/vllm/config/cache.html)。
