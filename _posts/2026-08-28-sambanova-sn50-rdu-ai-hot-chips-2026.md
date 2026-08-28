---
layout: post
title: "SambaNova SN50 RDU @ Hot Chips 2026 — 以数据流架构榨干「模型带宽利用率」"
date: 2026-08-28 21:40:00 +0800
categories: [AI硬件, AI加速器]
tags: [SambaNova, SN50, RDU, Dataflow, MoE, 模型带宽利用率, Hot Chips 2026, 推理加速]
description: "ServeTheHome 现场报道 SambaNova 第五代 RDU（SN50）：以巨量片上 SRAM + 无全局同步的数据流架构把「模型带宽利用率（MBU）」做到 GPU 做不到的高位，并给出 H200 负责 prefill、SN50 负责 decode 的异构解聚部署。"
---

> **来源**：[ServeTheHome](https://www.servethehome.com/sambanovas-sn50-rdu-for-ai-at-hot-chips-2026/) — *SambaNova's SN50 RDU for AI at Hot Chips 2026*
> **原文链接**：<https://www.servethehome.com/sambanovas-sn50-rdu-for-ai-at-hot-chips-2026/>
> **原文发布日**：2026-08-25 ｜ **作者**：Ryan Smith（ServeTheHome）
> **说明**：本文为英文原文全文转载，附中文深度解读。解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

![图01｜SN50 Dataflow](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img01.png)
*图01｜SN50 Dataflow*

For as new as the dedicated AI accelerator field is, SambaNova is one of the older and more established hardware vendors. The company is now in the fifth generation of their reconfigurable dataflow unit (RDU) technology, with the SN50 that was launched earlier this year. As with the other major AI vendors at this year’s Hot Chips conference, the company has come to present new technical details on SN50, and outline what makes it competitive in the burgeoning field of dedicated AI accelerators.

### SambaNova’s SN50 RDU for AI at Hot Chips 2026

SambaNova’s hardware has taken on an increased prominence in the industry thanks to the company’s connection to Intel. While Intel itself is still trying to catch up on AI accelerators, the company has become increasingly attached to the hip to SambaNova, whose RDUs provide the dedicated, high-efficiency and low-latency AI accelerators that round out Intel’s hardware stack. Thus the company’s progress with the SN50 (and future RDUs) is material not just for SambaNova, but for Intel as well.

![图02｜Inference Decode](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img02.png)
*图02｜Inference Decode*

Setting the stage, agentic inference is all the rage right now. Where does all the execution time go? SambaNova has a breakdown of it. Most time is spent in decode, especially on DeepSeek V3 where it’s 97% of the time, versus 3% for prefill.

![图03｜Decode Bandwidth Bound](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img03.png)
*图03｜Decode Bandwidth Bound*

And decode, in turn, is bandwidth-bound. The FLOPS-per-byte ratio is quite low, even for large batch sizes.

![图04｜HBM Bandwidth Utilization](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img04.png)
*图04｜HBM Bandwidth Utilization*

Bandwidth utilization is often misunderstood. SambaNova is laying out what they mean for this talk. In short, they aren’t talking about just how much HBM bandwidth is being used, but rather the Model Bandwidth Utilization (MBU) model. And specifically, what fraction of that is being used to cache data and otherwise handle data usage.

![图05｜Model Bandwidth Utilization](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img05.png)
*图05｜Model Bandwidth Utilization*

Looking at the current state of tech, GPUs offer low bandwidth usage, even with highly optimized GPU-friendly benchmarks.

![图06｜GPU Scaling](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img06.png)
*图06｜GPU Scaling*

Things get worse for GPUs when you scale up the number of them; performance does go up, but MBU drops significantly.

![图07｜Frontier Models](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img07.png)
*图07｜Frontier Models*

Meanwhile frontier models require being able to scale up.

![图08｜Power Capacity](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img08.png)
*图08｜Power Capacity*

Again with a GPU example, a GPU can get to around 30TB/second of model bandwidth. But they can’t get past that.

![图09｜SN50 Dataflow](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img09.png)
*图09｜SN50 Dataflow*

Enter SambaNova’s SN50 dataflow RBU. They have doubled-down on what worked well from SN40, such as the large on-chip SRAM. 5x as many FLOPS as SN40, and it is designed to scale-up to a much larger domain of 256+ chips. And there is a separate scale-out network using 400Gb networking.

Notably, there are no I/O dies or similar here. Instead it is just two max reticle dies for the logic, and then HBM stacks for the memory.

Though it is interesting that SambaNova’s choice of HBM here is quite dated; SN50 still uses HBM2e here (which is going to be a problem in the future as production of the memory is already ramping down).

![图10｜SN50 Rack](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img10.png)
*图10｜SN50 Rack*

Moving up to the SN50 rack architecture, there are 16 RDUs in a single air-cooled rack, split over two nodes.

![图11｜Chip Architecture](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img11.png)
*图11｜Chip Architecture*

Diving a bit deeper into SN50 and the dataflow architecture. The core element of the SN50 is the sea of compute cores (PCUs) and memory cores (PMUs). There is no hardware memory management; this is all software managed. Every unit operates when it has input and sends it to the outputs.

![图12｜Transformer Structure](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img12.png)
*图12｜Transformer Structure*

To better illustrate how the dataflow architecture works, here is an example of how it maps to a transformer.

![图13｜GPU Transformers](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img13.png)
*图13｜GPU Transformers*

Here is what a GPU looks like.

![图14｜SN50 Transformers](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img14.png)
*图14｜SN50 Transformers*

And how it look on the SN50.

![图15｜Compute Comms Overlap](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img15.png)
*图15｜Compute Comms Overlap*

For compute, data from the HBM is fed into the AGCU portal that control off-chip access, and from there into the PCUs and PMUs.

![图16｜Double-Buffered PMUs](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img16.png)
*图16｜Double-Buffered PMUs*

The SRAM amount used is not a function of the size of the model.

![图17｜No Global Synchronization](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img17.png)
*图17｜No Global Synchronization*

![图18｜SN50 Scaling](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img18.png)
*图18｜SN50 Scaling*

That was one RDU. How do things scale up for multiple RDUs? SambaNova employs both scale-up and scale-out networking. The Scale-up network is based on 800GbE, while scale-out is 400GbE. And then there is a front-end network.

![图19｜Scale-up and Scale-Out](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img19.png)
*图19｜Scale-up and Scale-Out*

SambaNova uses an all-to-all topology for an 8 socket configuration.

![图20｜Scaling Beyond One Node](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img20.png)
*图20｜Scaling Beyond One Node*

To go above 8 sockets, then the scale-up network is employed using Ethernet switches. Links are ganged, and every node is connected to each of two switches in this 64 chip socket configuration.

![图21｜512 Socket Example](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img21.png)
*图21｜512 Socket Example*

Then things can be scaled out further, in this case employing both scale-up and out for a 512 socket configuration.

![图22｜Model Parallelism](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img22.png)
*图22｜Model Parallelism*

The key to performance on SN50 is overlap. SN50 supports all forms of model parallelism, and the collective communication forms that these models are built on.

![图23｜GEMM Benchmarking](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img23.png)
*图23｜GEMM Benchmarking*

Here is a brief look at performance with GEMM benchmarking. The utilization is consistently 70% or higher even at 32 sockets.

![图24｜Importance of Overlap](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img24.png)
*图24｜Importance of Overlap*

If you are able to overlap, you can do the compute and communications in parallel. That kind of overlap is not something GPUs can do.

![图25｜HBM and Compute Overlap](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img25.png)
*图25｜HBM and Compute Overlap*

The building block for SambaNova is collective communication, which is the purple boxes in these diagrams. And the SRAMs can stream from one to another without having to go through a higher layer (e.g. HBM).

![图26｜MoEs with TP](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img26.png)
*图26｜MoEs with TP*

Here’s a look at parallelism with tensor parallel.

![图27｜DeepSeek TP-32](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img27.png)
*图27｜DeepSeek TP-32*

Here is a look at the bandwidth utilization that SN has achieved with DeepSeek.

![图28｜MoEs with TP and EP](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img28.png)
*图28｜MoEs with TP and EP*

Meanwhile they can also use expert parallel (EP) as an additional form of parallelism. This relies on broadcast-dispatch as well as all-to-all dispatch-combine.

![图29｜Token Dispatch](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img29.png)
*图29｜Token Dispatch*

With all-to-all, one way is to dynamically send everything to the target RDUs.

![图30｜Dispatch Broadcast](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img30.png)
*图30｜Dispatch Broadcast*

Alternatively, you can just blast everything to all of the RDUs and then filter out things afterwards.

![图31｜Dispatch All-to-All](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img31.png)
*图31｜Dispatch All-to-All*

The all-to-all method requires a group-by operation at the end of the router to collect (group) the tokens before transmitting them SRAM-to-SRAM. All-to-all also means allowing dynamic traffic.

![图32｜Dispatch Broadcast and Filter](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img32.png)
*图32｜Dispatch Broadcast and Filter*

Now here’s the other method of broadcast + filter. That is still an SRAM-to-SRAM operation, but with a filter operation on the PCUs of the receiving RDU. This keeps the network traffic parallel; though it does increase it a bit. And by not depending on the router, the transfer can be started early.

![图33｜EP on 64-Socket SN50](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img33.png)
*图33｜EP on 64-Socket SN50*

Here is another DeepSeek example, with SambaNova getting close to 80% bandwidth utilization for loading the experts in MoE.

![图34｜High MBU at Scale](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img34.png)
*图34｜High MBU at Scale*

As a result of this, SN50 achieves a high MBU value even at scale, with MBU holding at 45% even with 256 SN50s. And this makes it possible to keep adding RDUs to scale up things even further. This, in turn, means that models don’t have to give up bandwidth.

![图35｜SN50 Power Scaling](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img35.png)
*图35｜SN50 Power Scaling*

Going back to SambaNova’s original chart about power scaling, here is what SN50 clusters of different sizes look like. A 512 RDU configuration is able to scale up to an aggregate model bandwidth capacity of over 350 TB/second. The systems can strongly scale, with MBUs still in the 40% range at 512 sockets.

![图36｜SN50 Heterogeneous Disaggregation](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img36.png)
*图36｜SN50 Heterogeneous Disaggregation*

Ultimately SambaNova is promoting a very similar picture as other dedicated inference chip firms, using one type of chips for prefill (and midfill), while using separate accelerators (i.e. SN50) for decode. Specifically, they’ve been using NVIDIA H200 + SN50, with RoCE for transferring between them.

![图37｜SN50 Heterogeneous Disaggregation In Action](/assets/img/posts/sambanova-sn50-rdu-ai-hot-chips-2026/img37.png)
*图37｜SN50 Heterogeneous Disaggregation In Action*

Finally, taking a look at that performance in action, based on an Artificial Analysis benchmark of SN50. The hardware achieves over 750 tokens-per-second in MiniMax M2.7.

# 第二部分：解析（深度解读）

## 核心论点摘要

SambaNova 在 Hot Chips 2026 上展示第五代可重构数据流单元（RDU）SN50，核心论点是：**智能体推理里 decode 占了几乎全部时间（DeepSeek V3 达 97%），而 decode 是带宽受限的**——GPU 即便优化后「模型带宽利用率（MBU）」仍偏低，且随 GPU 数量扩张而骤降。SN50 用「巨量片上 SRAM + 无全局同步的数据流架构」把 MBU 顶到 GPU 做不到的高位。

1. **器件**：SN50 相对 SN40 算力 5×，可扩展到 256+ 芯片域，独立 400Gb scale-out；无 I/O die，仅 2 颗最大光罩逻辑 die + HBM 堆叠。
2. **架构**：PCU（计算核）+ PMU（内存核）的海洋，无硬件 MMU、纯软件管理，单元「有输入即触发、结果发往输出」；SRAM 用量与模型大小无关，无全局同步。
3. **扩展**：scale-up 800GbE、scale-out 400GbE、前端网络；8 插槽全互联，超过 8 插槽经以太网交换机扩展到 64/512 芯片。
4. **MBU 数据**：256 颗 SN50 时 MBU 仍保持 45%；512 RDU 聚合模型带宽 >350 TB/s，MBU 仍在 40% 量级（强扩展）。

## 关键概念解读

- **MBU（Model Bandwidth Utilization）才是真指标**：不是「HBM 带宽用满没」，而是「有多大比例带宽真正用于缓存模型权重/处理数据」。GPU 即使跑 GPU-friendly 基准，MBU 也低；扩展 GPU 数量时 MBU 反而大幅下降——因为 GPU 为计算优化，不为数据搬运优化。
- **Overlap 是 SN50 的命门**：计算与通信可并行（SRAM 之间 SRAM-to-SRAM 直流传，不经 HBM 高层），这是「GPU 做不到」的能力；GEMM 基准在 32 插槽仍保持 70%+ 利用率。
- **MoE 的 EP 两类分发**：all-to-all（路由器末端 group-by 收集 token）vs broadcast+filter（SRAM-to-SRAM，在接收 RDU 的 PCU 上过滤、可提前启动、网络流量并行但略增）。DeepSeek TP-32 下加载专家的 MBU 接近 80%。
- **异构解聚部署**：prefill 用 NVIDIA H200、decode 用 SN50，二者间 RoCE 传输——SN50 实为「decode 专用件」，而非通用训练芯片，与 Cerebras/Groq 等推理专用路线同构。

## 分层拆解表

| 维度 | SN50（数据流 RDU） | 典型 GPU |
|---|---|---|
| 瓶颈判断 | decode 带宽受限，MBU 优先 | 计算优化，MBU 随规模下降 |
| 内存层级 | 巨量片上 SRAM，无 HBM 往返 | HBM 为主，受带宽利用率约束 |
| 同步模型 | 无全局同步，单元事件驱动 | SIMT + 全局屏障 |
| 计算/通信 | 可 overlap（SRAM-to-SRAM） | 难以原生 overlap |
| 扩展 | scale-up 800GbE / scale-out 400GbE | NVLink / 专用互联 |
| 定位 | decode 专用（配 H200 做 prefill） | 训练+推理通用 |

## 技术趋势判断

SN50 是「空间/数据流架构」对抗 GPU 的又一实例，与本站已发的 XCENA（CXL 近内存计算）、Broadcom Thor Ultra（喂饱 GPU 的 800G 网络）构成本届 Hot Chips 同一主题的三种回答：**内存与数据搬运才是 AI 的真实瓶颈**。SambaNova 的独到之处是用 MBU 这一可量化指标把「GPU 低效」讲清楚，并用片上 SRAM 数据流实现高 MBU + 计算通信 overlap。值得一提的是，SN50 仍采用 **HBM2e**（作者明确指出其量产正在退坡，是未来隐患），且深度绑定 Intel 生态——这两点构成其现实约束。

**投资映射**：「数据流/SPMD 空间架构」阵营（SambaNova、Tenstorrent、Cerebras、Groq）对 GPU 的替代逻辑在于推理 decode 场景；MBU 是衡量这类架构优劣的实用透镜；「prefill 用 GPU、decode 用专用芯片」的异构解聚正成为新兴部署范式，利好高端 GPU（prefill 侧）与专用推理芯片（decode 侧）两端。

## 风险提示

SN50 采用 HBM2e，面临供给退坡与未来带宽天花板风险；深度绑定 Intel 生态，受 Intel AI 战略与出货节奏牵连；与 H200 的异构解聚依赖 RoCE 跨芯片传输，端到端延迟与调度成熟度需实测；>750 tok/s 的 Artificial Analysis 基准为厂商口径。本文不构成投资建议。
