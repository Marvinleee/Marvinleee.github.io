---
layout: post
title: "推理系统 13：Ascend NPU 与 vLLM Ascend 的实际软件栈"
date: 2026-09-07 21:09:00 +0800
categories: [人工智能, 推理系统]
tags: [NPU, Ascend, Atlas A3, CANN, TorchNPU, vLLM Ascend]
description: "以 Atlas A3/Ascend 910C 为具体平台，区分 AI Core、Cube/Vector/Scalar、片上存储与 CANN、TorchNPU、vLLM 插件的责任。"
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-12-nvidia-gpu/) · [下一章](/posts/inference-14-parallelism/)

“NPU”不是一种统一指令集或统一内存结构。本章选定 Huawei Atlas A3 系列作为具体对象：公开资料显示 Atlas 900 A3 SuperPoD 采用 Ascend 910C，并以 384 个 Ascend NPU 组成系统。硬件微架构公开程度有限，因此只陈述官方开发资料支持的抽象，不推测未公开缓存与核心数量。

## AI Core 中的三类计算

CANN 自定义算子资料将 AI Core 的主要计算单元分为 Cube、Vector 与 Scalar。Cube Unit 处理矩阵类计算；Vector Unit 处理向量/逐元素与部分规约；Scalar Unit 负责标量和控制相关工作。模型中的 GEMM、Norm、RoPE、Softmax 因此需要不同单元、数据搬运与同步协作。

数据仍需从设备外部内存进入更靠近计算的片上存储，再按 tile 供计算单元使用。算子性能取决于搬运与计算重叠、布局、双缓冲和核心间切分。峰值矩阵算力无法代表 Softmax 或小批 Decode 的全部表现。

这些概念与 GPU 的“矩阵单元、向量单元、多级存储”可以在系统层比较，但不能把 Cube 直接称为 Tensor Core，或用 CUDA warp 描述 Ascend 执行。编程模型、指令和工具链不同。

## vLLM 到 NPU 的分层

当前 vLLM Ascend 文档给出的验证栈包括：vLLM → vLLM Ascend 插件 → PyTorch/TorchNPU → CANN Toolkit/算子与 NNAL/ATB → 驱动、固件 → Ascend 硬件。每层版本需要作为兼容组合验证。

以文档当前示例的 v0.23.0 组合，Python 3.12、PyTorch 2.10.0、TorchNPU 2.10.0.post4、CANN/NNAL 9.1.0 与 HDK 26.0.RC1 被列为一套验证栈；A3 使用单独镜像标签。该信息会滚动变化，部署时应选同一发布矩阵的一整行，不能随意拼装“更新”的单项版本。

vLLM Ascend 是社区维护的硬件插件。它复用 vLLM 的引擎与调度抽象，并实现设备、worker、attention、量化、通信与定制算子的接缝。模型名称出现在通用 vLLM 不等于在 A3 上全部特性都已验证；功能矩阵还要区分 BF16、量化、前缀缓存、推测解码、图模式和并行方式。

## 与 GPU 比较的方法

先固定相同模型权重、精度、输入输出长度、并发与质量容差；再记录 TTFT、TPOT、吞吐、峰值内存、功率口径和失败率。若一种平台使用 W8A8、另一种用 BF16，吞吐数字不能脱离质量与容量直接比较。

软件成熟度是性能的一部分：算子是否覆盖、是否回退、图模式是否命中、通信后端是否适配，都会决定硬件可用效率。可移植 API 提高功能可达性，却不保证同一内核布局自动最优。

## 系统尺度

Atlas 900 A3 SuperPoD 的 384 NPU 是系统口径。单 NPU、服务器节点、SuperPoD 互连域与多集群网络应分层描述。模型分片跨越的边界决定 collective 走哪种链路；拓扑错误可能抵消更多计算设备带来的收益。

资料截止 2026-09-07：[vLLM Ascend 安装与兼容栈](https://docs.vllm.ai/projects/ascend/en/main/getting_started/installation.html)、[插件概览](https://docs.vllm.ai/projects/ascend/en/main/)、[Huawei SuperPoD 公告](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)、[CANN 自定义算子指南](https://www.hiascend.com/document)。
