---
layout: post
title: "推理系统 12：从 CUDA SM 到 NVIDIA Rubin 与 Blackwell Ultra"
date: 2026-09-07 21:08:00 +0800
categories: [人工智能, 推理系统]
tags: [NVIDIA, Rubin, Blackwell Ultra, GPU, CUDA, NVLink]
description: "以 2026 年公开的 Vera Rubin 平台为最新坐标，以资料完整的 Blackwell Ultra B300 为定量案例，解释 SM、Tensor Core、HBM 与互连。"
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-11-operators-kernels/) · [下一章](/posts/inference-13-ascend-npu/)

截至 2026 年 9 月，NVIDIA 已宣布 Vera Rubin 平台进入量产；平台包含 Vera CPU、Rubin GPU、NVLink 6、ConnectX-9、BlueField-4 与 Spectrum-6。公开材料足以描述平台组成，却未公开所有低层 GPU 参数。因此，本章不编造 Rubin 的 SM 数与缓存细节；通用执行机制依据 CUDA 官方模型，定量系统案例采用公开资料更完整的 Blackwell Ultra B300/GB300 NVL72。

<iframe src="/assets/interactive/inference-systems-lab/#roofline" title="GPU 硬件上界实验" loading="lazy" style="width:100%;height:720px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 主机、设备与内核

CUDA 把 CPU 与其内存称为 host，把 GPU 与设备内存称为 device。程序从 CPU 开始，通过运行时分配内存、拷贝或建立可访问关系，并启动 kernel。异步队列使主机与设备工作重叠；任何隐式同步都可能破坏重叠。

GPU 由多个 GPC 组织许多 SM。SM 内含寄存器文件、执行单元，以及可在 L1 与 shared memory 间配置的统一数据缓存；GPU 还有所有 SM 共享的 L2，再连接 HBM/global memory。寄存器和 shared memory 快且容量有限，HBM 容量大、延迟更高。推理内核的核心工作就是在这些层级之间安排 tile。

线程按 block 组织，block 被调度到 SM；NVIDIA SIMT 执行以 32 线程 warp 为基本组。分支分歧会让同一 warp 的不同路径串行化。占用率受线程、寄存器和 shared memory 共同约束；占用率高并不保证算术单元效率最高。

Tensor Core 面向矩阵乘加 tile，支持的数据类型和累积规则依架构而异。模型的 GEMM 需要合适的维度、布局与内核才能使用它。Softmax、归一化、采样和地址计算还会使用其他执行资源。

## 为什么 HBM 同样关键

低并发 Decode 每轮只产生少量 Token，却要读取大量权重，常难以充分复用；HBM 带宽会成为紧上界。Prefill 或高并发增加矩阵工作，权重可跨更多 Token 摊销，更可能靠近计算上界。

Roofline 说明峰值 FLOPS 与峰值带宽必须同时看。产品表中的峰值通常带有指定精度、稀疏性和工作负载条件；不能把一个 FP4 稀疏峰值用于 BF16 密集内核的时间估计。

## 从一颗 GPU 到 GB300 NVL72

NVIDIA 的 GB300 NVL72 参考架构包含 72 颗 Blackwell Ultra GPU 和 36 颗 Grace CPU；每个计算托盘为 4 GPU、2 CPU。官方组件表给出每托盘 4 GPU 合计 1152 GB HBM，即每 GPU 288 GB 的系统配置。整机架用九个 NVSwitch 托盘构成 72 GPU 的全互连域，官方聚合带宽口径为 130 TB/s。

这些数字属于 GB300 NVL72 系统，不能写成单颗 GPU 带宽。每 GPU 的 HBM、机架 NVLink 域、机外网络分别解决容量/本地读写、scale-up 通信和 scale-out 通信。跨层带宽不能互换。

ConnectX-8 为 GB300 NVL72 提供对外网络；Rubin 平台更新为 NVLink 6、ConnectX-9 等组件。Rubin 是 2026 年最新平台坐标，B300 是本章可量化案例，两者不能混成一张虚构规格表。

## 推理映射

模型权重与 KV Cache驻留 HBM；GEMM tile 在 SM 内搬入 shared memory/寄存器并由 Tensor Core 等单元计算；逐元素与规约处理归一化、旋转和 Softmax；多 GPU Tensor Parallel 通过 NVLink/NVSwitch 执行 collective；跨机副本或更大并行域走网络。

性能问题也按层诊断：先看请求调度是否喂饱设备，再看 HBM 与计算单元，再看卡间通信，最后看机外网络。只说“GPU 利用率 90%”不能定位具体层。

资料截止 2026-09-07：[Vera Rubin 官方公告](https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform)、[GB300 NVL72 组件](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)、[CUDA Programming Model](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html)。厂商性能倍数依其测试条件，本章不将其当作通用 vLLM 跑分。
