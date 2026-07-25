---
layout: post
title: "AMD and Cerebras Announce Industry-Leading Ultra-Low-Latency and High Throughput AI Inference Solution — AMD 与 Cerebras 推出行业领先的超低延迟、高吞吐 AI 推理方案"
date: 2026-07-25 23:42:00 +0800
categories: [半导体投资]
tags: [半导体, 推理芯片, 算力, Cerebras, AMD, 分离式推理]
description: "AMD(NASDAQ:AMD) 与 Cerebras(NASDAQ:CBRS) 在 Advancing AI 2026 发布技术合作：以『分离式推理(disaggregated inference)』把 AI 推理拆成高吞吐的 prompt 处理（AMD Helios / Instinct GPU）与超低延迟的 token 生成（Cerebras 晶圆级引擎 WSE）两阶段，跨引擎统一工作流，宣称最高 5x tokens/s/watt。英文原文逐字 + 中文深度解读，并与本站《推理芯片架构地图》互链。"
---

> 本文整理自 **AMD 投资者关系 / GlobeNewswire** 官方新闻稿，原文发布于 **2026-07-23**（CreationDate 元数据 2026-07-23 17:49:30 UTC）。
> 标题原文：*AMD and Cerebras Announce Industry-Leading Ultra-Low-Latency and High Throughput AI Inference Solution*。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 全文为公开免费内容（官方新闻稿，无付费墙截断）；文末为 AMD / Cerebras 标准前瞻性声明与免责，已省略联系人细节。

---

# 第一部分：正文（Original Article）

*July 23, 2026*

## AMD and Cerebras Announce Industry-Leading Ultra-Low-Latency and High Throughput AI Inference Solution

**News Highlights**

- AMD and Cerebras are collaborating to advance a workload-optimized approach to ultra-low-latency AI inference infrastructure.
- AMD Helios™ and the Cerebras Wafer-Scale Engine will operate as a single disaggregated inference workflow, combining ultra-high-throughput from AMD Instinct™ GPUs, with ultra-fast token generation of Cerebras Wafer-Scale Engine.
- Cerebras plans to deploy AMD Helios in its data centers, with the joint solution expected to be available first through Cerebras Cloud in the second half of 2026.

SAN FRANCISCO and SUNNYVALE, Calif., July 23, 2026 (GLOBE NEWSWIRE) -- AMD (NASDAQ: AMD) and Cerebras Systems (NASDAQ: CBRS) announced a technical partnership to deliver a new disaggregated AI inference solution that combines AMD Helios™ rackscale solutions with the Cerebras Wafer-Scale Engine. Unveiled at Advancing AI 2026, the solution is designed to deliver the ultra-low latency required for the most advanced AI applications while dramatically increasing the throughput and efficiency.

The joint AMD and Cerebras solution will deploy AMD Helios alongside Cerebras Wafer-Scale Engine technology integrated in a single inference workflow for maximum performance and efficiency. AMD Helios will provide a high-performance, scalable throughput engine. Cerebras Wafer-Scale Engine technology will provide ultra-fast, ultra-low latency decode and token generation. Together, the two compute engines are expected to deliver up to 5x higher tokens per second per watt (T/s/W) i.

AI inference workloads increasingly have different requirements across latency, throughput, token capacity, cost and scale. High-volume workloads prioritize maximizing token generation, while coding, real-time copilots, live agents and agentic workflows demand faster response times. These differences are driving demand for heterogeneous infrastructure that matches compute technologies to specific workload requirements.

The AMD and Cerebras solution addresses this challenge through disaggregated inference, optimizing the two primary stages of the workflow independently. AMD Helios provides ultra-high throughput, processing prompts and large context windows. The Cerebras Wafer-Scale Engine accelerates the memory-bandwidth-intensive token generation, with ultra-low latency. By connecting these best-in-class engines through one integrated workflow, the companies are creating a differentiated platform for ultra-low-latency inference without sacrificing throughput or scale.

"AI inference is becoming one of the largest infrastructure opportunities in AI, and its growing diversity requires a more flexible approach," said Dr. Lisa Su, chair and CEO, AMD. "AMD Helios delivers leadership performance and scale for the broadest range of inference workloads. Together with Cerebras, we are extending that leadership into the most latency-sensitive applications and creating a powerful new platform for real-time agentic AI."

"The demand for ultra-fast inference is growing at an unprecedented pace. Cerebras delivers the world's fastest, ultra-low-latency inference," said Andrew Feldman, CEO and co-founder, Cerebras. "Partnering with AMD gives us an incredible opportunity to bring that performance to even more customers."

Fast token generation is becoming increasingly important as AI moves into software development, autonomous agents, robotics, scientific discovery and other applications where response time directly shapes the user experience and the usefulness of the system. The joint solution brings together complementary architectures purpose-built for these demands.

AMD Helios provides the high-throughput prompt engine, rack-scale efficiency and deployment scale required to process large numbers of complex requests. Cerebras Wafer-Scale Engine technology provides the ultra-low-latency and decode performance needed to return tokens in real time. The result is a solution designed specifically for the ultra-low-latency segment of the inference market, with AMD Helios as the foundation for high-throughput and balanced inference workloads across the data center.

Cerebras plans to deploy AMD Helios systems in its data centers, with the joint solution expected to become available initially through Cerebras Cloud in the second half of 2026.

**Supporting Resources**

- Follow AMD at Advancing AI 2026 (Press Kit)
- Learn more about AMD Helios™ rackscale solution
- Learn more about AMD Instinct™ Accelerators
- Learn more about the Cerebras Wafer-Scale Engine

**About AMD**

AMD (NASDAQ: AMD) drives innovation in high-performance and AI computing to solve the world's most important challenges. Today, AMD technology powers billions of experiences across cloud and AI infrastructure, embedded systems, AI PCs and gaming. With a broad portfolio of AI-optimized CPUs, GPUs, networking and software, AMD delivers full-stack AI solutions that provide the performance and scalability needed for a new era of intelligent computing. Learn more at www.amd.com.

**About Cerebras Systems**

Cerebras Systems (NASDAQ: CBRS) builds the world's fastest AI infrastructure. The Cerebras team of pioneering computer architects, computer scientists, AI researchers, and engineers of all types came together to make AI blisteringly fast through innovation and invention. We believe that when AI is fast, it will change the world. Leading global corporations, research institutes, and governments choose Cerebras to run their AI workloads. Cerebras solutions are available on premises and in the cloud. Visit cerebras.ai for more.

---

*i Based on modelling by AMD Performance Labs and Cerebras in July 2026 to determine tokens per second per kilowatt (TPS/kW) at a comparable interactivity point with Kimi 2.6 1T Model comparing an AMD Helios rackscale solution with Cerebras WSE to a Cerebras WSE-only configuration. System manufacturers may vary configurations, yielding different results. MI400-021*

*Source: Advanced Micro Devices, Inc.*

---

# 第二部分：解析（深度解读）

## 1. 核心论点摘要

这是一份**官方合作新闻稿**，不是技术白皮书。一句话：AMD 与 Cerebras 在 Advancing AI 2026 上宣布一项**技术合作**——用"**分离式推理（disaggregated inference）**"的思路，把一次 AI 推理拆成两个阶段，分别交给两家各自最擅长的硬件：

- **Prompt / 上下文处理阶段（高吞吐）** → 由 **AMD Helios** rackscale 方案（核心是 Instinct GPU，MI400 系列）承担，负责吃下大 prompt、长上下文窗口。
- **Token 生成 / 解码阶段（超低延迟）** → 由 **Cerebras 晶圆级引擎（Wafer-Scale Engine, WSE）** 承担，靠其超大片上 SRAM 与内存带宽做逐 token 的实时解码。

两者通过**统一工作流**串联，官方宣称最高可带来 **5× 的 tokens/s/watt（T/s/W）** 能效提升。Cerebras 计划先在自己的数据中心部署 Helios，联合方案预计 **2026 下半年** 率先通过 **Cerebras Cloud** 对外提供。

## 2. 关键概念解读

### 2.1 分离式推理（Disaggregated Inference）：prefill 与 decode 解耦
推理之所以要"拆"，是因为两个阶段的计算瓶颈**根本不同**：

| 阶段 | 计算特征 | 瓶颈 | 最优硬件取向 |
|------|----------|------|--------------|
| **Prefill / Prompt 处理** | 大矩阵乘、可高度并行 | Compute-bound（算力） | 高算力 GPU（AMD Instinct / NVIDIA） |
| **Decode / Token 生成** | 逐 token、反复读取全部权重 | Memory-bandwidth-bound（内存带宽） | 超大带宽 + 大 SRAM（Cerebras WSE） |

传统做法是同一台机器同一套权重既做 prefill 又做 decode，二者互相挤占资源。把它们**物理/逻辑拆开、各自用最匹配的芯片**，就是"分离式推理"——这也是当下大厂（如 GPT 类服务的 prefill/decode 分离部署）已在工程上验证过的方向。本文的卖点在于：**不止逻辑分离，而是跨两家不同架构的芯片做成统一工作流**。

### 2.2 Cerebras 晶圆级引擎（WSE）：用"整片晶圆"换带宽
Cerebras 的杀手锏是把**一整片 wafer 直接做成一颗芯片**（Wafer-Scale Engine），片上集成巨量 SRAM 与极宽内存总线，从而在 token 生成这种"内存带宽敏感"的任务上做到极致低延迟。它天然契合 decode 阶段的需求——这也解释了为什么这次合作里 Cerebras 负责的是"延迟"而非"吞吐"。

### 2.3 AMD Helios：rackscale 的高吞吐基座
Helios 是 AMD 的 **rackscale（整机架级）** AI 方案，以 Instinct GPU（MI400 系列）为核心，提供可扩展的吞吐引擎与部署规模，负责承载海量的并发 prompt 请求。它是整个方案的"基座"，也延续了 AMD 在 broad-range 推理负载上的定位。

### 2.4 能效指标 T/s/W
新闻稿把"tokens per second per watt"作为主指标，契合数据中心最关心的**单位功耗产出**。但注意这是**能效**而非**绝对性能**——5× 是相对"WSE-only 配置"的建模结果，且明确标注基于 Kimi 2.6 1T 模型在"可比交互点"的对比。

## 3. 与本站其他文章的连接

- **《[推理芯片架构地图：12 家公司按三大瓶颈分类](/posts/the-inference-chip-architecture-map/)》**（2026-07-25）：Cerebras 正是那篇里"**SRAM / 晶圆级阵营**"的代表玩家——靠内存带宽而非 HBM 堆料取胜。本新闻稿相当于给该分类里 Cerebras 这条路线补上了"与 GPU 阵营（AMD）互补"的现实注脚：**未来推理不止是单芯片路线之争，更可能是跨架构的异构组合**。
- 推理负载正在**分化**：高吞吐（批量生成）vs 超低延迟（coding、实时 copilot、agentic workflow）。这种分化正是驱动"异构基础设施"需求的根本原因，也是上述架构地图中"按瓶颈分类"逻辑的产业印证。

## 4. 技术趋势判断

1. **异构推理基础设施成为主线**：当推理需求从"能不能跑"进入"延迟/吞吐/成本/规模各自优化"，单一架构很难通吃，prefill/decode 分离 + 跨厂商组合会逐渐常态化。
2. **AMD 的 rackscale 叙事补齐**：Helios 让 AMD 从"卖 GPU"升级为"卖整机架推理方案"，直接对标 NV 的 rack-scale（如 GB200 NVL72）叙事。
3. **Cerebras 从"最快"走向"可及"**：借 AMD 的产能与渠道，把极致低延迟推理推向更多客户（先走 Cerebras Cloud）。

## 5. 风险提示（重要）

- **合作 ≠ 已量产**：联合方案预计 **2026 下半年**才通过 Cerebras Cloud 首发，当前是**官宣/路线图**阶段，存在时间表与可用性的不确定性。
- **5× 是厂商建模值**：脚注明确写明来自 AMD Performance Labs + Cerebras 的 2026 年 7 月建模（Kimi 2.6 1T，对比 WSE-only），**非独立第三方基准**，实际结果随系统配置而异。
- **Cerebras 客户集中度风险**：其披露文件点名 OpenAI、G42、MBZUAI、AWS 等少数大客户，依赖度高风险在披露中已自陈。
- 文末为 AMD / Cerebras 标准**前瞻性声明与免责**（Safe Harbor / Regulation FD），投资相关判断请以 SEC 正式申报文件为准。

> ⚠️ 本文为**官方新闻稿公开全文**，无付费墙；不含任何付费/未公开内容。以上解读为基于公开信息的投资视角的技术梳理，**非买卖建议**。
