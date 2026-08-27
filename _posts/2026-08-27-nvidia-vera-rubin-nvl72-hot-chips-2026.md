---
layout: post
title: "NVIDIA Vera Rubin NVL72 Rack at Hot Chips 2026 — Agentic AI 时代的机架设计哲学"
date: 2026-08-27 20:40:00 +0800
categories: [AI硬件]
tags: [NVIDIA, Rubin, NVL72, NVLink 6, Agentic AI, 800VDC, Hot Chips 2026]
description: "ServeTheHome 现场报道 NVIDIA Vera Rubin NVL72 机架：Agentic AI 重塑优化目标（tokens/MW、TTFT、MTBI）、自适应稀疏化、counted-write NVLink 同步与 45°C 液冷+800VDC 机架工程。"
---

> **来源**：[ServeTheHome](https://www.servethehome.com/nvidia-vera-rubin-nvl72-rack-at-hot-chips-2026/) — *NVIDIA Vera Rubin NVL72 Rack at Hot Chips 2026*
> **原文链接**：<https://www.servethehome.com/nvidia-vera-rubin-nvl72-rack-at-hot-chips-2026/>
> **原文发布日**：2026-08-24 ｜ **作者**：Patrick Kennedy（ServeTheHome 创始人）
> **说明**：本文为英文原文全文转载，附中文深度解读。解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

NVIDIA took the Hot Chips 2026 stage to detail the Rubin GPU, its next data center accelerator in the Vera Rubin platform. Agentic AI is the recurring theme, and NVIDIA argues it changes not just the tensor core but the entire compute, networking, power, and serviceability stack around it. It feels like we know a lot about Vera, but let us see what NVIDIA has for Hot Chips.

This article is being written live from the talk, so please excuse any typos.

## NVIDIA Rubin GPU at Hot Chips 2026

NVIDIA is talking about agentic AI is the most complex workload it has ever targeted. They did earlier in its Vera talk as well. It strings together observation, reasoning, and action across LLMs, CPUs, DPUs, orchestration, security, memory, and networking. That breadth is the reason the whole platform gets redesigned, not just the silicon.

![图01｜Agentic AI 是史上最复杂工作负载（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img01.jpg)
*图01｜Slide 2: Agentic AI is the Most Complex Workload in History*

Vera Rubin is presented as a full-stack AI factory platform spanning seven chips and five racks. NVIDIA folds in the Vera CPU, the Rubin GPU, BlueField-4, Spectrum-6, and even Groq LPUs, with storage, networking, tool call, and sandbox support layered on top. Agentic AI needs all of that surface area, from context and memory to the scale-out fabric.

![图02｜Vera Rubin 全栈 AI 工厂平台（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img02.jpg)
*图02｜Slide 3: NVIDIA Vera Rubin Is a Full-Stack AI Factory Platform — 七芯片、五机架*

This figure maps the Vera Rubin NVL72 rack against prior racks along a tokens-per-MW interactivity axis. Vera Rubin lands well above Blackwell NVL72 and far above the Hopper NVL8 generation (HGX H100/H200 8-GPU) near the high-interactivity corner. We first saw the physical rack in partner booths at GTC 2026, and the architecture there aligns with the TPS-per-MW story this talk repeats. NVIDIA Groq LPX also extends this curve.

![图03｜tokens/MW 交互性坐标轴上的世代对比（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img03.jpg)
*图03｜Slide 4: Vera Rubin NVL72 在 tokens-per-MW 轴上的世代跃迁*

Benchmarking has to change for agentic inference. Traditional inference assumed predictable I/O and a single request with static hardware tuning, but agentic workloads bring tool calling, dynamic sequences, and multiple turns across end-to-end tasks. Input sequence lengths grow from the 1k to 32k range to 100k and 400k, which strains hardware tuned for short, fixed prompts. We have seen this at STH quite a bit.

![图04｜推理基准需要 Agentic 化（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img04.jpg)
*图04｜Slide 5: Inference Now Requires Complex Agentic Benchmarks*

NVIDIA points to a SemiAnalysis (Dylan's) benchmark to quantify the payoff. Using DeepSeek-v4-PRO at 140K+ context on the AgentX workload, Vera Rubin NVL72 curves above GB300 NVL72 near the 60M total-token mark, and NVIDIA calls the uplifts 10x and up to 30x in tokens per MW as interactivity climbs.

![图05｜全栈协同设计带来最高 30 倍提升（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img05.jpg)
*图05｜Slide 6: Full-Stack, Co-Design Delivers Up to 30x Greater (tokens per MW)*

Agentic AI also changes what NVIDIA optimizes for. Tokens per watt, time to first token, useful life, and mean time between interruptions (MTBI) all matter more than raw flops because the goal is to maximize revenue over time. TTFT and interactivity become first-class design targets. Basically, NVIDIA's saying that it is not just having a fast system, but it is about maximizing the revenue of the platform.

![图06｜优化目标变为 Token 收入（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img06.jpg)
*图06｜Slide 7: Agentic AI Changes the Optimization Target: Token Revenue*

Here is the Rubin GPU die floorplan paired with the headline factory-level specifications. Note these are 100MW AI Factory, not a single GPU. NVIDIA rates the part at 2 ZFLOPS for NVFP4 inference and 1.4 ZFLOPS for NVFP4 training, with 11 PB of HBM4 memory and 800 PB/s of memory bandwidth within a 100 MW AI factory footprint. As an aside, I guess Raja Koduri's 2021 [Zettascale](https://www.servethehome.com/rajas-chip-notes-lay-out-intels-path-to-zettascale/) was not far off! This design leans on NVLink 6 and NVLink-C2C beside a 5th gen x16 PCIe host interface, and NVIDIA notes the specs are at-scale figures using DSX with MaxLPS. I think we are not going into this too much today which is what I thought this talk was before it started.

![图07｜Rubin GPU 裸片平面图与 100MW 工厂级规格（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img07.jpg)
*图07｜Slide 8: Rubin GPU 裸片平面图 + 2 ZFLOPS NVFP4 推理（100MW AI Factory 口径）*

Context grows with every agent turn and attention expands quadratically, so a long agentic session drives feed-forward and attention compute well past 400k tokens. NVIDIA says adding more raw math to the GPU is not enough.

![图08｜Agentic AI 复合计算需求（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img08.jpg)
*图08｜Slide 9: Agentic AI Compounds Compute Demand and Raises (context length)*

For that, NVIDIA is going through the evolution from FP8 weights in 2023 through narrow-precision NVFP4 to Rubin's adaptive sparsity in 2026, adding HW-managed mixed precision and dedicated silicon for low-precision operations. NVIDIA couples that with structured sparsity and accuracy-preserving compression for both training and inference.

![图09｜窄精度与稀疏化重新定义计算（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img09.jpg)
*图09｜Slide 10: Narrow Precision and Sparsity Redefine the (compute equation)*

Rubin's adaptive sparsity makes the sparse path practical, using a 2:4 sparsity format that NVIDIA says is more general than prior NVFP4 sparsity. Sparsity applies throughout the transformer block, skipping near-zero values in the QKV, attention projection, and MLP feed-forward layers. NVIDIA claims that most models require no changes or fine-tuning and that it deploys as an opt-in for the inference runtime via a flag.

![图10｜稀疏 NVFP4 带来更快更高效的推理（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img10.jpg)
*图10｜Slide 11: Sparse NVFP4 Delivers Faster, More Efficient Inference*

Sparsifying attention is where the token throughput comes from. Rubin retains only the tokens that matter, which NVIDIA says makes the downstream SoftMax and BMM2 operations about 2x faster. This sparse attention path preserves dense cores for dense work and routes the QKV matrices through a dedicated sparsification stage.

![图11｜稀疏化注意力最大化 token 吞吐（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img11.jpg)
*图11｜Slide 12: Sparsify Attention to Maximize Token Throughput*

NVIDIA also claims that sparse path preserves visual quality out of the box. This hardware-generated demonstration pairs a Qwen-Image BF16 dense output with the NVFP4 sparse result of the same cinematic portrait prompt. Side by side, the two renders look essentially identical, but this is just one handpicked data point.

![图12｜稀疏化保持图像质量（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img12.jpg)
*图12｜Slide 13: Rubin Sparsity Preserves Accuracy Out of the Box — Qwen-Image 对比*

A hardware measurement backs the visual demonstration. Accuracy criteria vary by benchmark and reflect the percentage of evaluated items meeting each benchmark's success criteria. NVIDIA shows the sparse results tracking dense across the evaluated benchmarks. The Qwen3.5-395B-A17B is one we have used a lot at STH (albeit running on a Mac Studio M3 Ultra 512GB because of the memory requirements.)

![图13｜稀疏化精度实测（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img13.jpg)
*图13｜Slide 14: Rubin Sparsity Preserves Accuracy Out of the Box — 基准实测*

Distributed inference needs lower-latency GPU-to-GPU sync, and Rubin reworks how that happens. This figure contrasts Blackwell's traditional MEMBAR transfer, which polls and updates an atomic flag, against Rubin's counted-write-based sync. Replacing the memory barrier with a counted write lowers NVLink latency and helps throughput at higher interactivity.

![图14｜Counted Write 降低 NVLink 延迟（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img14.jpg)
*图14｜Slide 15: Counted Writes Lower NVLink Latency to Accelerate (agentic throughput)*

NVLink scale-up is the other big lever for tokens per second. Sixth-generation NVLink ties a 72-GPU scale-up domain with 3.6 TB/s of all-to-all bandwidth per GPU, and NVIDIA cites 4x and 3x factors plus 10x lower latency and 130 TFLOPS of in-network compute compared with Ethernet scale-up. This NVL72 rack relies on the NVLink 6 switch tray to maintain coherence across the entire domain.

![图15｜NVLink scale-up 协同设计（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img15.jpg)
*图15｜Slide 16: NVLink Scale-Up Co-Design Maximizes Tokens per Second*

Around the silicon, NVIDIA is pushing the third-generation MGX open platform for the rack. More than 80 MGX partners span millions of square feet of factory floor across 350+ sites in 30 countries. This rack leans on 45C liquid cooling, 800 VDC, no retimers, hot-swappable, cable-free trays, and a copper scale-up fabric designed to improve throughput per watt, time to first token, and MTBI. The broader Vera Rubin platform was laid out earlier in 2026. Still, this is interesting given that 800 VDC racks were said to be delayed earlier this year. At STH, there is a reason we covered [Liquid-Cooling a TE Connectivity Busbar and More from the Wiwynn Booth](https://www.servethehome.com/liquid-cooling-a-te-connectivity-800v-dc-busbar-and-more-from-the-wiwynn-booth/) a few months ago because we were hearing this was happening. Also, on stage they just said that a hot tub is usually 39C while the liquid cooling here is using 45C liquid.

![图16｜第三代 MGX 开放平台（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img16.jpg)
*图16｜Slide 17: Gen 3 MGX Open Platform — 80+ 伙伴、350+ 站点、30 国*

NVIDIA's Vera Rubin compute tray has no cables and no fans, which the company says improves time to first token and mean time between interruptions versus the GB200 NVL72 compute tray beside it. Removing the cables and fans from the tray simplifies both build and service at rack scale. We saw with the [IBM z17 Mainframe](https://www.servethehome.com/the-ibm-z17-mainframe-brings-ai-with-telum-ii-and-spyre/) that they go into replacing power cables with PCB for reliability, so what NVIDIA is doing makes a lot of sense.

![图17｜MGX 托盘优化制造与可靠性（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img17.jpg)
*图17｜Slide 18: MGX Trays Optimize Manufacturing and Reliability — 无线缆、无风扇托盘*

NVIDIA's loop diagram shows warm-water cooling that removes the chiller and wasted water from the picture while preserving full performance. Raising the facility supply lets more of the power budget go to tokens rather than heat rejection. 45C is one that helps because it increases the temperature differential between the loop and the ambient, which often means a chiller is not needed. Sorry all, struggling to keep up with this one.

![图18｜45°C 进液温度提升效率（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img18.jpg)
*图18｜Slide 19: 45C Inlet Improves Efficiency — Less Energy on Cooling*

Power is another place NVIDIA reclaims headroom. This figure compares a rack power profile with and without smoothing, showing the ramp-up peak, steady state, and ramp-down tail side by side. NVIDIA argues that smoothing reduces idle-time overshoot, so more GPUs fit under a provisioned power cap. The black cylinders in the bottom right of this diagram help do this smoothing. It is neat to get to see this since NVIDIA has been talking about the feature for some time.

![图19｜智能功率平滑回收被浪费的电力（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img19.jpg)
*图19｜Slide 20: Intelligent Power Smoothing Reclaims Squandered Power*

For LLM training on a Vera Rubin NVL72 rack, NVIDIA reports a 13% peak power reduction and improved grid compliance. Combined with other system-level power work, NVIDIA expects up to 40% more GPUs per provisioned watt.

![图20｜功率平滑的量化收益（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img20.jpg)
*图20｜Slide 21: 训练峰值功率降低 13%，每瓦配额可多装 40% GPU*

Now it sounds like we are getting to MTBI. NVIDIA's second-generation RAS engine, or RIST, runs zero-downtime GPU health checks while the workload continues to run, with advanced SRAM ECC and an enhanced NVLink hot-swap service. First-generation health checks required the entire node to be offline for hours, so the change directly affects goodput and predictive maintenance.

![图21｜Vera Rubin 系统弹性最大化有效吞吐（NVIDIA 幻灯片）](/assets/img/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/img21.jpg)
*图21｜Slide 22: Vera Rubin System Resiliency Maximizes Goodput — RIST 零停机健康检查*

Across the talk, NVIDIA framed the Rubin GPU less as a single chip and more as one layer in a factory that spans computing, networking, power, and serviceability.

## Final Words

Rubin GPU is a reminder that NVIDIA is now selling efficiency and total cost of ownership as much as raw flops. Instead of just a hundreds-of-watts GPU, or 1-3kW, NVIDIA is now using a 100MW AI Factory as a unit. Maybe the real message here is twofold. It feels a bit like NVIDIA is doing this to differentiate its offering versus AMD Helios (up later in this Hot Chips block). Also, importantly, it means that if a company has an AI accelerator that looks cool, NVIDIA is basically saying that the unit is a data center-scale, reliable system, not a single fast accelerator or even a fast system.

# 第二部分：解析（深度解读）

## 核心论点摘要

STH 的现场记录捕捉到 NVIDIA 这场演讲的真正主题：**Agentic AI 不只改变了 tensor core，而是改变了整个机架的优化目标函数**。要点：

1. **优化目标从 FLOPS 变成 Token 收入**：tokens/watt、TTFT（首 token 时延）、MTBI（平均无中断时间）成为一等设计目标——「不是拥有一个快系统，而是最大化平台的收入」。
2. **稀疏化是本代算力叙事的核心**：自适应 2:4 稀疏贯穿 QKV/attention projection/MLP，SoftMax 与 BMM2 提速约 2x；多数模型无需重训练，推理运行时一个 flag 即可启用；Qwen-Image 生成与基准精度均「开箱保持」。
3. **机架工程全面重构**：无线缆无风扇托盘、45°C 暖水液冷（免冷水机组）、800VDC（此前传延期，现场确认在推）、功率平滑（训练峰值功率 -13%，每瓦配额多装 40% GPU）、RIST 二代 RAS 引擎零停机健康检查。
4. **口径升格**：规格以 100MW AI Factory 为单位——2 ZFLOPS NVFP4 推理、11PB HBM4、800PB/s 内存带宽。

## 关键概念解读

- **Agentic 基准的必要性**：传统推理假设可预测 I/O 与静态调优；agentic 工作负载带来工具调用、动态序列、多轮任务，输入序列从 1k-32k 膨胀到 100k-400k。NVIDIA 引 SemiAnalysis AgentX 基准（DeepSeek-v4-PRO @140K+ context）：对 GB300 NVL72 在 60M token 附近拉开身位，tokens/MW 提升最高 30x。
- **Counted-write 替代 MEMBAR**：分布式推理的 GPU 间同步从「轮询原子标志位」改为「计数写」，直接降低 NVLink 延迟——这是为高交互性 agentic 负载做的微架构级适配。
- **45°C 进液的系统账**：进液温度高于环境空气温差增大 → 免冷水机组 → 更多电力预算给 token 而非排热（NVIDIA 现场调侃：热水浴缸通常 39°C，这里用 45°C）。
- **SemiAnalysis 姿态变化**：NVIDIA 直接引用 SemiAnalysis 基准作为权威——与 NPO 论战中 SemiAnalysis 下修 CPO 的「对立」形象形成有趣对照。

## 分层拆解表

| 层面 | 关键改动 | 量化收益 |
|---|---|---|
| 计算格式 | FP8 → NVFP4 → 自适应 2:4 稀疏 | SoftMax/BMM2 ~2x；tokens/MW 最高 30x |
| 互连 | NVLink 6：3.6TB/s 全对全/GPU、counted-write 同步 | 对以太网 scale-up：延迟 10x 低、网内计算 130 TFLOPS |
| 散热 | 45°C 暖水液冷、免冷水机组 | 更多功率预算给算 token |
| 供电 | 800VDC + 功率平滑 | 峰值功率 -13%；+40% GPU/瓦 |
| 可靠性 | RIST 零停机健康检查、NVLink 热插拔 | MTBI/goodput 提升（一代需整节点离线数小时） |
| 制造 | Gen3 MGX：无线缆无风扇托盘 | 80+ 伙伴、350+ 站点、30 国 |

## 技术趋势判断

这场演讲的竞争叙事非常明确：**当对手只有一个「看起来很酷的加速器」时，NVIDIA 把销售单位定义成「数据中心级、高可靠系统」**（STH 结语）。对供应链的含义：功率平滑器件（超级电容等）、45°C 液冷组件、800VDC 母排、无线缆化托盘的 PCB/连接器替代方案，都从「锦上添花」变成「性能规格的一部分」。与 AMD Helios 的正面交锋见本站《[AMD MI400 GPU](/posts/amd-mi400-gpu-hot-chips-2026/)》：AMD 以 2.9 EFLOPS 机架 + UALoE 开放生态应战，NVIDIA 以 tokens/MW + MTBI + 100MW 工厂口径立墙。scale-up 网络层面的光/铜之争背景，可结合《[NPO State of the Union](/posts/npo-state-of-the-union/)》阅读。

## 风险提示

30x tokens/MW 为特定基准（AgentX、DeepSeek-v4-PRO、140K context）下的厂商口径；稀疏化的精度保持结论基于有限基准（作者提醒「只是一组挑选的数据点」）；800VDC 机架此前曾有延期传闻，量产节奏需持续验证。本文不构成投资建议。
