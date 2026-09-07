---
layout: post
title: "推理系统 08：一条请求怎样进入 vLLM V1"
date: 2026-09-07 21:04:00 +0800
categories: [人工智能, 推理系统]
tags: [vLLM, EngineCore, Scheduler, Model Runner]
description: "固定 vLLM v0.10.2，追踪 API、处理器、引擎核心、调度器、执行器、输出处理器与流式响应的责任边界。"
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-07-quantization/) · [下一章](/posts/inference-09-scheduling/)

vLLM 不是模型，也不是 GPU 驱动。它接收请求、组织 Token 预算和缓存、调用设备执行，再把结果送回前端。本章固定 **v0.10.2 的 V1 路径**，避免滚动文档与源码错位。

## 从 API 到引擎

OpenAI 兼容服务解析请求，应用聊天模板和分词，将采样参数、Token IDs 与请求标识交给异步引擎。前端承担网络生命周期、校验与流式协议；它不直接执行 Transformer 矩阵。

引擎客户端与 EngineCore 之间可跨进程。EngineCore 持有调度器和 model executor：调度器根据运行、等待请求与缓存状态产生本轮计划；executor 令 worker/model runner 准备输入并执行模型；调度器再更新请求状态和缓存分配。

主循环可概括为：接收新增/取消 → schedule → execute_model → update_from_output → 返回核心输出。源码坐标是 [core.py](https://github.com/vllm-project/vllm/blob/v0.10.2/vllm/v1/engine/core.py) 与 [scheduler.py](https://github.com/vllm-project/vllm/blob/v0.10.2/vllm/v1/core/sched/scheduler.py)。

输出处理器将核心结果变成用户可见的增量，维护完成原因、解码状态和统计。网络客户端慢、取消或断开时，控制消息还要回到引擎回收请求。完成一次模型执行不等于完成一个 HTTP 请求。

## Worker 与 Model Runner

executor 解决“在哪些设备、进程执行”；worker 管理设备与缓存；model runner 把本轮计划转换为位置、Token、块表等设备输入并调用模型。GPU runner 是具体后端路径，NPU 插件有自己的适配层，不能把 GPU 文件当作全部设备的共同实现。

模型实现描述并行线性层、注意力、位置编码和权重加载。高性能路径可能使用自定义算子、编译图或融合内核，调用边界不与论文方框一一对应。

## 三种常见误读

第一，API server 并不等于推理引擎；多个进程与队列会影响端到端时间。第二，scheduler 不决定模型概率，它决定资源和执行顺序。第三，vLLM 优化吞吐不意味着每个功能、模型、设备和版本都有相同加速。

阅读源码时从请求标识和数据结构追踪，不从函数名猜执行次数；同时固定 commit、启动参数与后端。官方架构入口：[vLLM v0.10.2 Architecture Overview](https://docs.vllm.ai/en/v0.10.2/design/arch_overview.html)。
