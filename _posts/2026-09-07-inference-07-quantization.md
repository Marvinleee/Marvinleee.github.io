---
layout: post
title: "推理系统 07：量化改变了什么，又没有改变什么"
date: 2026-09-07 21:03:00 +0800
categories: [人工智能, 推理系统]
tags: [Quantization, FP8, INT8, INT4, KV Cache]
description: "从仿射量化、分组尺度和误差出发，区分权重、激活与 KV Cache 量化，并讨论内核支持与真实收益。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-06-memory/) · [下一章](/posts/inference-08-vllm-engine/)

量化把数值映射到更窄表示，以减少存储、传输或使用专用低精度计算。它不改变逻辑层数和张量形状，却引入尺度、舍入、饱和及内核约束。

<iframe src="/assets/interactive/inference-systems-lab/#memory" title="权重与 KV 位宽实验" loading="lazy" style="width:100%;height:760px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 基本仿射模型

$$q=\operatorname{clip}(\operatorname{round}(x/s)+z),\qquad \hat x=s(q-z).$$

x̂ 是反量化近似。舍入产生误差，超出校准范围会饱和。对称量化常令 z=0；FP8 使用指数与尾数，不能用整数仿射公式完整描述。

全张量一个尺度简单，但异常值决定范围；按通道或分组使用尺度可降低局部误差，同时增加元数据和内核复杂度。group size 是质量、容量与执行效率的共同参数。

## W、A、KV 分开看

W4A16 表示权重约 4 位、激活约 16 位；W8A8 同时压缩权重与激活。KV Cache 有独立 dtype。“INT4 模型”不代表所有规约、中间量和缓存都是 4 位。

仅压权重会减少容量与读取字节，但矩阵乘法可能需要解包或反量化。若设备没有匹配的格式、布局和内核，文件更小不保证更快。

KV FP8 理论上将 16 位缓存字节减半，可容纳更多上下文或并发。K/V 动态范围和尺度质量会影响注意力；不同后端支持的格式与尺度路径必须查兼容矩阵。vLLM v0.10.2 对特定硬件的功能状态不能外推到所有 GPU/NPU。

## 如何评价

单个权重均方误差不够。应测目标任务质量、困惑度或准确率，并覆盖长上下文、稀有输入和结构化输出。生成有路径依赖：微小 logit 变化可能改变一次离散采样，随后文本分叉。

性能测试要固定模型、量化方法、后端、硬件、批量和长度分布，同时报告容量、TTFT、TPOT、吞吐与质量。先确认后端支持，再使用验证过的 checkpoint/流程，分别测试质量和性能，最后决定是否量化 KV。

资料：[vLLM 量化](https://docs.vllm.ai/en/v0.10.2/features/quantization/)与[缓存配置](https://docs.vllm.ai/en/v0.10.2/api/vllm/config/cache.html)。实验只估算位宽容量，未模拟误差。
