---
layout: post
title: "推理系统 09：连续批处理与统一 Token 调度"
date: 2026-09-07 21:05:00 +0800
categories: [人工智能, 推理系统]
tags: [vLLM, Continuous Batching, Chunked Prefill, Scheduling]
description: "用固定 Token 预算解释运行与等待请求、分块 Prefill、Decode 交错、抢占及吞吐和延迟之间的关系。"
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-08-vllm-engine/) · [下一章](/posts/inference-10-paged-cache/)

静态批处理让一组请求同时开始，常要等最长序列；连续批处理在请求完成后补入新工作。vLLM V1 更准确的观察单位是“本轮给每个请求安排多少 Token”。

<iframe src="/assets/interactive/inference-systems-lab/#scheduler" title="统一 Token 调度实验" loading="lazy" style="width:100%;height:760px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## Token 预算

V1 调度输出包含请求到 scheduled token 数的映射。每轮总数不能超过 `max_num_batched_tokens`，活跃序列也受上限约束。Prefill 与 Decode 不必进入两个完全独立的调度器：长 Prefill 可以分块，和已有 Decode 一起进入执行。

统一预算让调度器表达缓存命中、推测 Token 和分块输入，但“统一”不表示两类 Token 的计算成本完全相同。相同 Token 数在不同上下文、模型与阶段可能有不同耗时。

## 排队与抢占

请求至少经历 WAITING、RUNNING 和完成等状态。新请求能否准入取决于 Token 预算、序列限制、KV 块和其他资源。缓存不足时，运行请求可能被抢占并在以后重算相关状态；具体策略随版本变化。

调度公平性也不是一句 FIFO 能概括。优先已有运行请求有利于推进完成，但长输入可能占用预算；切得更细可改善 Decode 的 ITL，却增加调度和小工作负载开销。策略应由真实到达分布与 SLO 验证。

## 离散事件实验的边界

页面用三个固定请求和简化轮转规则，让读者观察预算怎样跨请求分配。它不是 v0.10.2 scheduler 的逐行移植，因此输出“轮数”不代表 vLLM 实际性能。

真实评估应回放带时间戳、输入和输出长度的负载，报告请求率、并发、TTFT、TPOT、E2EL 与完成率。只用无限并发测最大吞吐，无法回答线上尾延迟。

资料：[vLLM V1 指南](https://docs.vllm.ai/en/v0.10.2/usage/v1_guide.html)；[V1 Scheduler](https://docs.vllm.ai/en/v0.10.2/api/vllm/v1/core/sched/scheduler.html)。
