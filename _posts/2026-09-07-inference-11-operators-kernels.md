---
layout: post
title: "推理系统 11：张量公式怎样变成设备程序"
date: 2026-09-07 21:07:00 +0800
categories: [人工智能, 推理系统]
tags: [PyTorch, CUDA, Kernel, Compiler, Fusion]
description: "沿算子分发、图捕获与编译、内核选择、启动、线程组织和内存层次，解释模型公式到 GPU/NPU 执行的距离。"
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-10-paged-cache/) · [下一章](/posts/inference-12-nvidia-gpu/)

论文写 `Y=XW`，硬件不会直接执行这行数学。框架先建立张量操作，分发到设备后端，运行时选择或生成内核，驱动把工作提交给设备。每一层都可能改变布局和性能，却应保持允许误差范围内的数值语义。

## 从模型调用到算子

Python 模型调用进入 PyTorch 的算子系统。设备、dtype、形状、布局和后端决定具体实现。vLLM 还使用并行线性层、定制注意力、量化与通信算子；某个 `forward` 调用不等于一个内核。

Eager 模式按操作发起执行，图捕获或编译尝试复用稳定执行图、融合操作并降低 CPU 启动开销。动态请求形状会带来图分段、多个捕获尺寸或回退。图模式提高速度的前提是实际路径命中已准备的图。

## 内核怎样计算矩阵

矩阵乘法通常分块：线程块处理输出 tile，把输入 tile 搬入片上存储或寄存器，多次执行乘加并累积。Tensor Core 等矩阵单元处理特定小块和 dtype；边界、布局、转置、量化尺度都会影响可用路径。

Softmax 需要求最大值、指数与和，是规约；RMSNorm 求平方和；RoPE 做逐元素旋转。融合可以在寄存器或片上存储中衔接这些步骤，减少 HBM 往返。融合也受寄存器压力、并行度与可维护性限制，并非越多越快。

## CPU、运行时与驱动

应用从 CPU 启动；主机负责 Python、调度、准备元数据和发起设备工作。异步执行允许 CPU 与设备重叠，但错误的同步、数据拷贝或主机瓶颈仍会留下设备空洞。

GPU 中线程组成 block/grid 并被分配到 SM；warp 是 NVIDIA CUDA 的执行概念。NPU 有自己的计算核心、队列与编译栈，不能直接用 warp 描述。共同抽象是：计算单元需要数据，数据在多级存储间移动，软件决定时序和布局。

性能分析应从时间线确认 CPU、内核、拷贝和通信，再查看算子形状与硬件计数器。看到 GPU 利用率高不自动说明 Tensor Core 饱和；看到某个内核耗时最高也不说明只优化它就能按比例改善端到端延迟。

资料：[CUDA Programming Model](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html)与[vLLM torch.compile 集成](https://docs.vllm.ai/en/latest/design/torch_compile.html)。
