---
layout: post
title: "推理系统 10：PagedAttention 与前缀缓存的真实边界"
date: 2026-09-07 21:06:00 +0800
categories: [人工智能, 推理系统]
tags: [PagedAttention, Prefix Caching, KV Cache, vLLM]
description: "区分逻辑块、物理块、块表与注意力内核，解释分页分配、写时复制、前缀匹配、回收和尾块浪费。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-09-scheduling/) · [下一章](/posts/inference-11-operators-kernels/)

PagedAttention 常被简写成“像虚拟内存一样消除碎片”。更准确地说，分页缓存让请求逻辑位置通过块表映射到物理 KV 块，按需分配并支持共享；尾块、元数据和内部布局仍有成本。

<iframe src="/assets/interactive/inference-systems-lab/#scheduler" title="分页缓存实验" loading="lazy" style="width:100%;height:760px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 块表的作用

逻辑 Token 位置 t 可分解为逻辑块号 floor(t/q) 与块内偏移 t mod q。块表给出物理块号，内核据此定位每层 K/V。逻辑相邻块不必在物理内存连续。

长度 t 需要 ceil(t/q) 块。最后一块最多浪费 q−1 个位置；空闲块可交给其他请求。分页减少了按最大长度预留连续区域造成的浪费，也避免频繁搬动已有缓存。

分页管理与注意力计算要区分。PagedAttention 名称同时指向围绕分页 KV 的系统设计和读取块表的内核路径；块表本身不会减少模型需要的数学注意力。

## 前缀缓存

若新请求的完整缓存块 Token 与已有前缀匹配，可以复用对应物理块，跳过那部分 Prefill。匹配需要模型、适配器、缓存 dtype 与影响计算的上下文一致；仅字符串看起来相同并不足够。

哈希用于定位候选前缀，不是语义相似搜索。未填满的尾块通常不宜像完整不可变块那样自由共享；请求继续生成时还要避免修改其他请求可见的数据，必要时采用新块或写时复制思想。

前缀命中减少重复 Prefill，却不免除 Decode，也不自动降低逻辑上下文长度带来的注意力访问。请求要求 prompt logprobs 等输出时，某些版本还可能需要重新计算完整提示。

## 回收和失败模式

请求完成或取消后减少块引用；无引用块回到空闲池。缓存压力过高时会触发等待、抢占或重算。块泄漏、引用计数错误、哈希上下文遗漏都会影响正确性，所以缓存不是纯性能旁路。

命中率要以可复用 Token 计量，并结合节省的 Prefill、额外哈希成本和尾延迟。一个高请求命中率可能只复用了很短前缀；Token 命中率更接近节省工作量，但仍不是速度提升比例。

资料：[vLLM Paged Attention 设计](https://docs.vllm.ai/en/latest/design/paged_attention/)及[v0.10.2 V1 指南](https://docs.vllm.ai/en/v0.10.2/usage/v1_guide.html)。
