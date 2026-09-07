---
layout: post
title: "推理系统 14：从单卡到多卡，以及 MoE 专家并行"
date: 2026-09-07 21:10:00 +0800
categories: [人工智能, 推理系统]
tags: [Tensor Parallel, Pipeline Parallel, Data Parallel, Expert Parallel, NCCL]
description: "比较 TP、PP、DP、EP 的切分对象、通信 collective、内存收益与延迟代价，并用简化 Ring AllReduce 模型形成上界。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章](/posts/inference-13-ascend-npu/) · [下一章](/posts/inference-15-benchmarking/)

多卡首先解决容量，其次才可能提高吞吐。切分方式决定每卡保存什么、每层通信什么，以及单请求能否从更多设备受益。

<iframe src="/assets/interactive/inference-systems-lab/#parallel" title="多卡通信实验" loading="lazy" style="width:100%;height:820px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

## 四种切分

Tensor Parallel（TP）在层内切分矩阵。列并行/行并行线性层组合常需要 AllReduce 或 ReduceScatter/AllGather，使每层都可能通信；优点是单层权重和计算可跨设备。

Pipeline Parallel（PP）把不同层放到不同级。激活在级间点对点传递；在线小批推理可能出现流水线气泡，级间层数不均还会形成最慢级。

Data Parallel（DP）复制模型，每个副本服务不同请求。它提高总吞吐和故障隔离，却不让单个副本装下更大的稠密模型。前端负载均衡与每副本缓存独立性影响命中与排队。

Expert Parallel（EP）把 MoE 专家分到设备。路由后 Token 需要 All-to-All 发往对应专家，再将结果送回。负载不均会让热门专家及链路成为瓶颈；冗余专家和动态负载均衡要在额外内存与通信间取舍。

这些维度可以组合，总设备数通常与各并行维度乘积有关，但具体复制/分片对象依实现。Qwen3-8B 是稠密模型，不使用 EP；研究 EP 必须换用明确的 MoE 配置。

## Collective 的语义

AllReduce 让每个 rank 获得所有输入的规约结果；AllGather 让每个 rank 获得拼接数据；ReduceScatter 规约后把不同片段留给各 rank；All-to-All 让每个 rank 向所有目标发送不同分片。

Ring AllReduce 的每设备近似通信量为 2(P−1)/P×N 字节，但时间还受启动延迟、拓扑、协议、消息大小和竞争影响。实验让用户输入“有效带宽”，避免把物理链路峰值直接当作 collective 可用带宽。

单 Token Decode 每层频繁 collective 对延迟敏感；Prefill 大矩阵可能更容易摊销固定开销。跨机 TP 若网络显著慢于机内互连，常需重新考虑 TP/PP 边界。

## 选择顺序

先以容量决定最小分片数，再让高频 TP 通信尽量留在高速 scale-up 域；跨节点用 PP 或 DP 是否更合适，要实测。MoE 还要观察 Token 路由分布和 All-to-All。

vLLM v0.10.2 支持 TP 与 PP，并给出常见建议：单节点 TP，跨节点可令 TP 等于每节点 GPU 数、PP 等于节点数；这是起点而非普遍最优。资料：[vLLM 并行与扩展](https://docs.vllm.ai/en/v0.10.2/serving/parallelism_scaling.html)、[NCCL Collectives](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html)、[vLLM EP](https://docs.vllm.ai/en/v0.10.2/serving/expert_parallel_deployment.html)。
