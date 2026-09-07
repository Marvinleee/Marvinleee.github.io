---
layout: post
title: "从文本到芯片：大模型推理交互技术系列"
date: 2026-09-06 23:00:00 +0800
categories: [人工智能, 推理系统]
tags: [Qwen, vLLM, GPU, NPU, 交互教学]
description: "完整十五章交互技术系列：从文本、Token 与 Transformer 数学，到 vLLM 调度、GPU/NPU 架构、多卡并行与性能测量。"
toc: true
---

一条聊天请求只有几行 JSON，服务器内部却同时发生着字符串处理、张量计算、内存分配和设备调度。本系列沿着这条链路逐层展开：先看清每一步传递什么，再推导为什么要这样计算，最后核对真实软件和硬件怎样实现它。

目标读者掌握大学线性代数与基础概率，不需要预先学过 CUDA。我们会保留矩阵维度、数据类型、源码入口和工程限制，而把每个新概念放到一个可以追踪的请求里。交互实验用于改变条件、检查推导与验证理解。

## 已发布：从这里开始

1. [第 1 章：一条请求如何抵达硬件，又变成回答](/posts/inference-01-request-to-hardware/)——区分数据流和控制流，建立 Prefill、Decode、缓存与执行器的全景。
2. [第 2 章：从 Unicode、聊天模板到 Token 与嵌入张量](/posts/inference-02-text-to-tensor/)——用真实分词样本检查字节、ID、模板和查表之间的关系。

3. [第 3 章：逐项算清一个真实 Qwen3 Transformer 层](/posts/inference-03-transformer-layer/)——推导 QK Norm、RoPE、GQA、残差与门控 MLP，用数值实验验证因果性。
4. [第 4 章：从 logits 到下一个 Token](/posts/inference-04-logits-sampling/)
5. [第 5 章：Prefill 与 Decode](/posts/inference-05-prefill-decode/)
6. [第 6 章：推理内存](/posts/inference-06-memory/)
7. [第 7 章：量化](/posts/inference-07-quantization/)
8. [第 8 章：请求进入 vLLM V1](/posts/inference-08-vllm-engine/)
9. [第 9 章：连续批处理与 Token 调度](/posts/inference-09-scheduling/)
10. [第 10 章：PagedAttention 与前缀缓存](/posts/inference-10-paged-cache/)
11. [第 11 章：张量公式到设备程序](/posts/inference-11-operators-kernels/)
12. [第 12 章：NVIDIA Rubin 与 Blackwell Ultra](/posts/inference-12-nvidia-gpu/)
13. [第 13 章：Ascend NPU 与 vLLM Ascend](/posts/inference-13-ascend-npu/)
14. [第 14 章：多卡与 MoE 并行](/posts/inference-14-parallelism/)
15. [第 15 章：真实性能测量](/posts/inference-15-benchmarking/)

[全屏打开推理链路实验室](/assets/interactive/inference-atlas/)

## 十五章路线

全系列已经发布。表格概括每章的推导与实验目标。

| 单元 | 章节 | 推导与实验目标 |
|:--|:--|:--|
| 输入与模型 | 01 请求全链路（已发布） | 定位数据、组件和执行阶段 |
| 输入与模型 | 02 文本到张量（已发布） | 真实 Token ID、模板与嵌入查表 |
| 输入与模型 | 03 一个 Transformer 层（已发布） | RMSNorm、Q/K/V、QK Norm、RoPE、GQA、残差与门控 MLP |
| 输入与模型 | 04 [从 logits 到 Token](/posts/inference-04-logits-sampling/) | 稳定 softmax、温度、概率筛选、采样与停止 |
| 时间与内存 | 05 [Prefill 和 Decode](/posts/inference-05-prefill-decode/) | 矩阵形状、依赖关系、缓存复用、计算与访存 |
| 时间与内存 | 06 [内存预算](/posts/inference-06-memory/) | 权重、KV、激活、临时空间、分页及分片 |
| 时间与内存 | 07 [量化](/posts/inference-07-quantization/) | 表示范围、缩放、误差、分组与实际内核支持 |
| vLLM | 08 [请求进入引擎](/posts/inference-08-vllm-engine/) | 固定源码版本，追踪服务入口与 V1 引擎 |
| vLLM | 09 [连续批处理](/posts/inference-09-scheduling/) | Token 预算、排队、分块 Prefill、抢占与延迟 |
| vLLM | 10 [分页与前缀缓存](/posts/inference-10-paged-cache/) | 逻辑块到物理块、复用、回收及命中边界 |
| 硬件执行 | 11 [算子到设备程序](/posts/inference-11-operators-kernels/) | 分发、编译、融合、内核启动、执行图与驱动 |
| 硬件执行 | 12 [NVIDIA GPU](/posts/inference-12-nvidia-gpu/) | Rubin 平台、CUDA SM、Tensor Core、HBM 与互连 |
| 硬件执行 | 13 [Ascend NPU](/posts/inference-13-ascend-npu/) | Cube/Vector/Scalar、CANN、TorchNPU 与插件栈 |
| 系统与验证 | 14 [多卡与 MoE](/posts/inference-14-parallelism/) | TP、PP、DP、EP 以及 collective 通信代价 |
| 系统与验证 | 15 [性能测量](/posts/inference-15-benchmarking/) | TTFT、TPOT、吞吐、尾延迟及可复现基准 |

GPU/NPU 章节会区分芯片、板卡、服务器和整机柜，并明确产品资料日期。NPU 不是单一统一架构，不能把一种设备的软件支持外推到全部设备。

## 主线与版本约定

主线选用 **Qwen3-8B**。它是稠密、自回归、Decoder-only 模型，能够贯穿 GQA、RoPE 和门控 MLP 等机制；选择它是为了公开配置与实现的可核验性，而非将其称为最新或性能最强模型。

首批内容固定模型仓库修订为 `b968826d9c46dd6066d109eabc6255188de91218`。分词样本使用 `tokenizers 0.20.3` 执行该修订的 tokenizer.json，并记录文件摘要。聊天样本通过同修订官方 Jinja 模板生成，使用单轮 user 消息、追加 assistant 起始段并关闭思考模式。

vLLM 的源码解释以 **v0.10.2 的 V1 路径**为阅读基线。这是固定的历史版本，不是“当前最新版”。后续遇到新硬件专属功能时，会显式建立新的版本组合，不能拿旧后端的支持情况判断新产品。首批文章没有声称已在本机运行 Qwen3-8B 或 vLLM。

## 如何阅读数值与实验

本系列区分三种证据：

- **配置推导**：从公开配置算出的形状、元素个数和理论字节数；标明假设与单位。
- **教学模拟**：用于观察调度或缓存行为；步数和时间轴不等于设备实测。
- **真实结果**：分词器实际编码结果，或日后在指定设备、软件与负载下测量的数据。

二维矩阵玩具使用独立的人造数值，不冒充真实权重。真实分词实验只需要分词器，不需要下载数十 GB 权重。容量计算不能直接推出延迟；峰值算力也不能直接等同于服务吞吐。

## 符号与单位

| 符号 | 含义 |
|:--|:--|
| T | 当前讨论的 Token 数；具体是输入长度、缓存长度还是本轮调度量，正文会说明 |
| B | 序列数；仅在规则批次表示中直接使用 |
| d | 隐藏维度，主线模型为 4096 |
| L | Transformer 层数，主线模型为 36 |
| Hq / Hkv | Query 头数 / KV 头数，分别为 32 / 8 |
| dh | 单头维度，128 |
| V | 模型嵌入与输出维度使用的词表行数，151936 |
| GB / GiB | 十进制 10⁹ 字节 / 二进制 2³⁰ 字节，不能混用 |

每章末尾的练习要求读者说明原因，而不只是选出术语。理解本系列的一个检验方法是：给定一个张量，你能指出它的形状、来源、存放位置、生命周期，以及下一步谁会读它。

## 来源

- [Qwen3-8B 模型卡](https://huggingface.co/Qwen/Qwen3-8B)
- [固定修订的模型配置](https://huggingface.co/Qwen/Qwen3-8B/blob/b968826d9c46dd6066d109eabc6255188de91218/config.json)
- [vLLM v0.10.2 源码](https://github.com/vllm-project/vllm/tree/v0.10.2)
- [实验数据与校验摘要](/assets/interactive/inference-atlas/samples.json)
- [离线样本复现脚本](/assets/interactive/inference-atlas/generate_samples.py)
