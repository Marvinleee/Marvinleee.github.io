---
layout: post
title: "Broadcom Thor Ultra 以太网 NIC @ Hot Chips 2026 — 800GbE 时代的 AI 规模互连"
date: 2026-08-28 21:35:00 +0800
categories: [AI硬件, 网络互连]
tags: [Broadcom, Thor Ultra, 800GbE, RoCE, Ultra Ethernet, Hot Chips 2026, AI 网络]
description: "ServeTheHome 现场报道 Broadcom Thor Ultra：5nm、2.4B 晶体管的 800GbE 网卡，强化 RoCE（分组喷射+乱序放置+超越 Go-Back-N 的可靠性和可编程拥塞控制），直指 AI scale-out 与 NVIDIA ConnectX-8、AMD Vulcano 正面对垒。"
---

> **来源**：[ServeTheHome](https://www.servethehome.com/broadcom-thor-ultra-ethernet-nic-at-hot-chips-2026/) — *Broadcom Thor Ultra Ethernet NIC at Hot Chips 2026*
> **原文链接**：<https://www.servethehome.com/broadcom-thor-ultra-ethernet-nic-at-hot-chips-2026/>
> **原文发布日**：2026-08-25 ｜ **作者**：Patrick Kennedy（ServeTheHome）
> **说明**：本文为英文原文全文转载，附中文深度解读。解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

![图01｜Broadcom Thor Ultra 800GbE Controller 1](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img01.jpg)
*图01｜Broadcom Thor Ultra 800GbE Controller 1*

Broadcom is now on stage at Hot Chips 2026 with the Thor Ultra Ethernet NIC, an 800GbE adapter aimed squarely at AI and HPC fabrics. This Thor Ultra family launched earlier this year, and this session goes deeper on the design behind it.

This one we are doing live, so please excuse any typos.

### Broadcom Thor Ultra Ethernet NIC at Hot Chips 2026

Broadcom is setting the stage for Thor Ultra. Ethernet here spans scale-up in the rack, scale-out across racks, and scale-across between data centers, and each layer drives a shared set of NIC requirements. Each needs high bandwidth, enhanced RDMA, low latency, and QoS, joined by virtualization, security, timing, telemetry, and diagnostics. It is a little bit awkward given what NVIDIA’s framewrok will look like later in this session block.

![图02｜Slide 2: Ethernet Networking for AI and HPC](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img02.jpg)
*图02｜Slide 2: Ethernet Networking for AI and HPC*

Thor Ultra pairs a PCIe Gen6 x16 host interface with an 8-port 100G MAC, 256 SR-IOV virtual functions, and 8x 100G Serdes, and it offloads RoCEv2, stateless packet processing, and inline encryption. Enhanced RoCE here exceeds 64K queue pairs, with a TruFlow engine and BroadSAFE security.

![图03｜Slide 3: Introducing Thor Ultra Ethernet NIC](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img03.jpg)
*图03｜Slide 3: Introducing Thor Ultra Ethernet NIC*

Broadcom lays out the generational leap from the prior Thor here. What stands out is packet spraying with out-of-order placement, reliability beyond Go-Back-N, simpler, programmable congestion control, and double the ports with multiplane connectivity.

![图04｜Slide 4: Thor Ultra Ethernet NIC - Generational Context](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img04.jpg)
*图04｜Slide 4: Thor Ultra Ethernet NIC - Generational Context*

This is the silicon itself, on 5nm, with a 2.4 billion-transistor count in a 27×27 package, at 40-42W max power. TX and RX buffers, an embedded CPU subsystem, and the P4-like programmable engines that carry much of the eRoCE work are all visible in the die. How cool is this! A die shot from a modern NIC!

![图05｜Slide 5: Thor Ultra Chip - Physical Design](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img05.jpg)
*图05｜Slide 5: Thor Ultra Chip - Physical Design*

Broadcom ships Thor Ultra in OCP NIC 3.0 and PCIe form factors configured for one OSFP112 or two QSFP112 ports. An OSFP112 port supports 800G, 2x 400G, 4x 200G, or 8x 100G, so operators can reuse a single board across multiple port densities. Cabling covers DAC, LPO, AEC, and optics, and the board tops out at 50-55W without optics.

![图06｜Slide 6: Thor Ultra NIC Boards](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img06.jpg)
*图06｜Slide 6: Thor Ultra NIC Boards*

Here is the packet pipeline in more detail. TX and RX threads each handle work queues, transport and congestion control, programmable scheduling, and plane management via firmware and PCIe, while the P4-like engines handle programmable processing.

![图07｜Slide 7: Thor Ultra NIC Pipeline](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img07.jpg)
*图07｜Slide 7: Thor Ultra NIC Pipeline*

This figure maps the enhanced RoCE feature set. Multipath sprays packets across up to eight planes. Out-of-order placement handles RDMA responses while keeping sends and atomics in order, and reliable delivery leans on selective ACK and NACK with retransmission.

![图08｜Slide 8: Thor Ultra enhanced RoCE (eRoCE) Features](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img08.jpg)
*图08｜Slide 8: Thor Ultra enhanced RoCE (eRoCE) Features*

Path selection runs per packet with headers carrying placement info. SACK bitmaps track received packets per QP. The receiver reorders before in-order message delivery.

![图09｜Slide 9: Thor Ultra eRoCE Implementation](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img09.jpg)
*图09｜Slide 9: Thor Ultra eRoCE Implementation*

Congestion control centers on Receiver Credit-Based Congestion Control as the eRoCE baseline. This receiver hands credits to active senders, uses speculative credits for line-rate startup, and stays aware of ECN, trimming, and CSIG telemetry, with P4-like match-action engines for customizable algorithms. I wonder why we have “P4-like” not just P4 engines.

![图10｜Slide 10: Thor Ultra Congestion Control Implementation](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img10.jpg)
*图10｜Slide 10: Thor Ultra Congestion Control Implementation*

Now we are at the peer memory path for GPU and XPU systems. Thor Ultra uses dma-buf for local peer-to-peer DMA between the NIC and GPU memory, and eRoCE for remote data transfers, with the RoCE user library in user space and the RoCE driver in the kernel.

![图11｜Slide 11: Thor Ultra NIC Peer Memory Data Transfer Support](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img11.jpg)
*图11｜Slide 11: Thor Ultra NIC Peer Memory Data Transfer Support*

Multi-tenancy support includes QoS and virtualization features which seem fairly standard for a modern NIC.

![图12｜Slide 12: Thor Ultra Multi-tenancy Support](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img12.jpg)
*图12｜Slide 12: Thor Ultra Multi-tenancy Support*

Timing support covers PTPv2 with nanosecond packet timestamping plus Precision Time Measurement. PPS in and out, a time-of-day plane, and an external TCXO feed the PHC here, which is how AI and HPC systems stay synchronized. If you like network timing, we recently filmed a video at a major hyper-scaler’s networking lab, so stay tuned for that in the first half of September.

![图13｜Slide 13: Thor Ultra Timing Support](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img13.jpg)
*图13｜Slide 13: Thor Ultra Timing Support*

Security starts at the silicon with a FUSE-based root of trust, a ROM bootstrap loader, and authenticated firmware updates. SPDM device attestation and PSP-based encryption and decryption round out that picture.

![图14｜Slide 14: Thor Ultra NIC Security](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img14.jpg)
*图14｜Slide 14: Thor Ultra NIC Security*

Health monitoring, chip and optics temperature tracking, eye diagrams, diagnostics, crash and core dumps, and DMTF- and OCP-standards-based manageability are in the feature set.

![图15｜Slide 15: Thor Ultra NIC: Enabling Stability, Control and Visibility](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img15.jpg)
*图15｜Slide 15: Thor Ultra NIC: Enabling Stability, Control and Visibility*

Broadcom splits the kernel stack into the bng_re RoCE driver and the bng_en NIC driver, with the libbng_re user library above them, all riding standard libibverbs and rdma-core interfaces.

![图16｜Slide 16: RoCE Software Components for Linux OS](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img16.jpg)
*图16｜Slide 16: RoCE Software Components for Linux OS*

Peer memory and direct collectives connect to NCCL, RCCL, and MPI through a verbs provider and xCCL plugins, on an upstream dma-buf peer memory model that leaves applications unmodified.

![图17｜Slide 17: XPU/GPU Infrastructure Support](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img17.jpg)
*图17｜Slide 17: XPU/GPU Infrastructure Support*

Broadcom shares initial collective data on a Gen5 GPU platform. Across two nodes with 8 Gen5 GPUs each and 16 ranks over sixteen 400G links, the chart puts all_reduce at 383.93 GB/s and reduce_scatter at 380.23 GB/s against a 400 GB/s ceiling, while alltoall is the clear outlier at 84.62 GB/s. That makes sense just given the workloads. Bus bandwidth holds above 96% of line rate across most operations.

![图18｜Slide 18: Collective Performance - Initial Data on a Gen5 GPU Platform](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img18.jpg)
*图18｜Slide 18: Collective Performance - Initial Data on a Gen5 GPU Platform*

On the TCP side, iperf3 on a Gen6 CPU with 512 GB DDR5-8000 hits 791 Gbps unidirectional at 16 parallel flows, about 98.9% of the 800G link. Bidirectional traffic aggregates to roughly 1.51 Tbps, and throughput climbs near-linearly to eight flows before the link saturates. I wonder if we could get this on our Keysight CyPerf bench like we did with the NVIDIA ConnectX-8 C8240 800G Dual 400G NIC Review, where we actually got that running at 800Gbps on a PCIe Gen5 server? That is a question for another day.

![图19｜Slide 19: Thor Ultra TCP Throughput](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img19.jpg)
*图19｜Slide 19: Thor Ultra TCP Throughput*

For RDMA writes, the unidirectional path saturates at 781 Gbps, and the bidirectional path reaches 1558 Gbps, about 97.6% of the 1.6 Tb/s aggregate and roughly double the unidirectional rate. Unidirectional hits about 88% of line rate by 32 KB messages and lands within 3% of peak by 128 KB.

![图20｜Slide 20: Thor Ultra Throughput for RDMA Writes](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img20.jpg)
*图20｜Slide 20: Thor Ultra Throughput for RDMA Writes*

Broadcom says the hard problems solved in this generation were multipathing, RoCE enhancements such as reliability and out-of-order placement, and programmable congestion control each trace back to the packet processing pipeline.

![图21｜Slide 21: Hard Engineering Problems Solved](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img21.jpg)
*图21｜Slide 21: Hard Engineering Problems Solved*

Here is a look at the Linux tools.

![图22｜Slide 24: Thor Ultra Linux Tools](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img22.jpg)
*图22｜Slide 24: Thor Ultra Linux Tools*

Broadcom packed a lot into this session, from the physical die up through the Linux toolchain. Thor Ultra is clearly built as a systems play for AI scale-out, and the architecture hangs together across silicon, software, and manageability.

### Final Words

This Thor Ultra launch puts Broadcom squarely in the 800G NIC contest alongside NVIDIA’s ConnectX-8 and AMD’s Vulcano. Its data path is built for enhanced RoCE or MRC++, and QoS plus virtualization enable XPU and CPU as a service, with security, manageability, and timing for sync across systems.

![图23｜Broadcom Thor Ultra 800GbE OCP NIC 3.0 Adapter 3](/assets/img/posts/broadcom-thor-ultra-ethernet-nic-hot-chips-2026/img23.jpg)
*图23｜Broadcom Thor Ultra 800GbE OCP NIC 3.0 Adapter 3*

Given we saw the physical cards and chip almost a year ago at OCP Summit 2025, it was cool to get more detail on the parts.

# 第二部分：解析（深度解读）

## 核心论点摘要

Broadcom 在 Hot Chips 2026 上把 Thor Ultra 定位为 **800GbE 时代的 AI/HPC 规模互连网卡**，直接对标 NVIDIA ConnectX-8 与 AMD Vulcano/Pensando。全场叙事围绕「以太网如何承载 AI scale-up / scale-out / scale-across」展开：

1. **器件规格**：5nm、24 亿晶体管、27×27 封装、40–42W 上限；PCIe Gen6 x16 主机接口 + 8×100G MAC + 256 个 SR-IOV VF + 8×100G SerDes；卸载 RoCEv2、无状态包处理与行内加密。
2. **代际跃迁**：分组喷射（packet spraying）+ 乱序放置、超越 Go-Back-N 的可靠性、更简洁可编程的拥塞控制、端口翻倍与多平面连接。
3. **性能实测**：两个节点各 8 张 Gen5 GPU、16 条 400G 链路下 all_reduce 383.93 GB/s、reduce_scatter 380.23 GB/s（对比 400 GB/s 天花板）；TCP 单向下行 791 Gbps（800G 链路的 98.9%）；RDMA 写单向饱和 781 Gbps、双向 1558 Gbps（聚合 1.6Tb/s 的 97.6%）。

## 关键概念解读

- **eRoCE（增强 RoCE）的工程重心在包处理流水线**：分组喷射 + 乱序放置解决以太网 incast 与尾延迟问题；超越 Go-Back-N 的可靠性避免单流阻塞拖垮整条链路；可编程拥塞控制把调优从「固定算法」变成「数据面可改」。这正是 Ultra Ethernet Consortium（UEC）路线相对传统 RoCE / InfiniBand 的差异点。
- **P4-like 可编程引擎**：把大量 eRoCE 工作下沉到数据面，TX/RX 线程负责工作队列、传输与拥塞控制、可编程调度与平面管理，固件 + PCIe 协同。
- **Peer memory 与无改应用**：dma-buf 实现 NIC↔GPU 本地 P2P DMA，eRoCE 负责远端传输；经 verbs provider + xCCL 插件对接 NCCL/RCCL/MPI，应用代码零改动。
- **完整的系统属性**：PTPv2 纳秒级打标 + PHC 做跨系统同步；FUSE 信任根 + 认证固件更新 + SPDM 证明 + PSP 加解密；温度/眼图/诊断/崩溃转储 + DMTF/OCP 可管理性——企业级网卡该有的「稳定性、可控性、可见性」齐备。

## 分层拆解表

| 维度 | Thor Ultra 实测 | 参照 |
|---|---|---|
| 主机接口 | PCIe Gen6 x16 | 800G 满血喂料 |
| 集合通信（2×8 Gen5 GPU, 16×400G） | all_reduce 383.93 / reduce_scatter 380.23 GB/s | 400 GB/s 天花板 |
| TCP 吞吐（Gen6 CPU, 16 流） | 791 Gbps 单向（98.9%） | 800G 链路 |
| RDMA 写 | 781 Gbps 单向 / 1558 Gbps 双向 | 1.6 Tb/s 聚合 97.6% |
| 形态 | OCP NIC 3.0 / PCIe；1×OSFP112 或 2×QSFP112 | 单板复用多端口密度 |

## 技术趋势判断

Thor Ultra 是 Broadcom 在「以太网替代 InfiniBand 承载 AI 训练」浪潮中的关键落子。其差异化不在峰值带宽，而在 **eRoCE 的可靠性与拥塞控制可编程性**——这恰恰是大规模以太网 AI  fabric 最痛的点。结合本站已发的 AMD MI400（UALoE 以太网 scale-up）、NVIDIA Vera Rubin，三大厂不约而同把「以太网 + 高带宽 NIC」作为机架/工厂规模互连底座。当速率迈向 800G/1.6T，电信号损耗会逐步把共封装光学（CPO）推上前台——Thor Ultra 虽为电口，却是这条演进链上的必经一代。

**投资映射**：Broadcom 的网络硅（Tomahawk 交换 + Thor NIC）是「AI 训练以太网化」的确定性受益方；800G NIC 市场由 NVIDIA（ConnectX-8）、AMD（Vulcano）、Broadcom（Thor Ultra）三方角力，关注各自的 UEC 对齐度与生态绑定。

## 风险提示

实测多基于 Broadcom 自身基准平台（Gen5/Gen6 GPU、特定链路数），第三方独立复现（如 Keysight CyPerf）尚未给出；alltoall 在集合通信中明显是 outlier（84.62 GB/s），对 MoE 等 all-to-all 密集负载仍需单独评估；与 NVIDIA 全栈 NVLink/ConnectX 的端到端体验差异，取决于客户软件栈迁移成本。本文不构成投资建议。
