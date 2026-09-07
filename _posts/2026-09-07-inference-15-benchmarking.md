---
layout: post
title: "推理系统 15：用真实测量解释延迟、吞吐与成本"
date: 2026-09-07 21:10:00 +0800
categories: [人工智能, 推理系统]
tags: [Benchmark, TTFT, TPOT, Throughput, Goodput, Observability]
description: "建立可复现推理基准：固定软件与请求分布，区分 TTFT、TPOT、ITL、E2EL、吞吐、goodput 与百分位，并避免常见误导。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-14-parallelism/)

系列最后一章把前面的模型、调度、缓存与硬件放进同一个实验协议。测量的目标不是找一个最大的 tokens/s，而是回答：在给定请求分布和服务目标下，系统完成了多少合格请求，失败模式在哪里。

<iframe src="/assets/interactive/inference-systems-lab/#parallel" title="百分位与通信上界实验" loading="lazy" style="width:100%;height:820px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 固定可复现条件

报告模型仓库与修订、tokenizer/template、权重与 KV dtype、vLLM/后端/驱动版本、设备与拓扑、启动参数、是否预热。工作负载要给出请求到达过程、输入/输出长度分布、采样和停止设置、前缀重复度及并发。

`ignore_eos` 能固定输出长度，却改变真实完成行为；合成随机 Token 能控制长度，却未必反映缓存命中、结构化输出和真实文本分布。最好同时报告受控微基准与生产回放。

## 指标定义

TTFT=t_first−t_arrival。对输出数 O>1，TPOT=(t_last−t_first)/(O−1)；ITL 直接观察相邻输出间隔；E2EL=t_complete−t_arrival。吞吐可用完成请求/s 或输入+输出 Token/s，但二者回答不同问题。

Goodput 是满足指定 SLO 的请求率。例如同时要求 TTFT≤500 ms、TPOT≤40 ms；吞吐上升而合格比例下降时，goodput 可能不升反降。

平均值隐藏尾部。P99 的定义还依样本量和插值方法；10 个样本算出的 P99 几乎只是最大值附近，不能代表稳定尾延迟。必须报告 n、运行时长、冷启动是否纳入及置信区间/重复次数。

## 开环与闭环负载

闭环客户端等上一个请求完成再发下一个，系统变慢时自动降低到达率，容易掩盖排队崩溃。开环按外部时钟发请求，更适合研究给定请求率，但必须控制过载与测试持续时间。

扫负载时寻找三个区域：低负载延迟基线、吞吐近线性增长区、排队快速上升的饱和点。最大吞吐之后继续加压只会扩大队列；生产容量应给突发与故障留余量。

## 从现象回到原因

TTFT 高而 TPOT 正常：检查排队、长 Prefill、分块策略和前缀命中。TPOT 高：检查 Decode 批量、权重/HBM、长上下文注意力和每层通信。吞吐抖动：检查请求长度、抢占、CPU 调度、图回退和负载不均。多卡扩展差：分解计算与 collective 时间。

功耗应说明是芯片、服务器还是机架口径，并在同等质量与 SLO 下计算能量/合格请求。云成本同样要计空闲、失败重试与副本冗余，而非只用标价除峰值吞吐。

## 最小实验矩阵

至少选择短/长输入、短/长输出，低/中/高请求率，分别测冷/热缓存；每个点充分预热并重复。保存原始逐请求时间戳，而不只保留汇总表，这样才能重新计算百分位和关联失败。

vLLM 的 serve benchmark 支持 TTFT、TPOT、ITL、E2EL 百分位与 SLO goodput。生产指标还包括运行/等待请求、KV 使用率、Token 计数等。资料：[vLLM serve benchmark](https://docs.vllm.ai/en/v0.10.2/cli/bench/serve.html)与[生产指标](https://docs.vllm.ai/en/v0.10.2/design/metrics.html)。

至此，链路从 Unicode、Token、层内计算、采样、缓存、调度延伸到 GPU/NPU 与实测。任何优化结论都应能沿这条链路指出改变的对象、适用条件与证据。
