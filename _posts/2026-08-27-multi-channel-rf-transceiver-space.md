---
layout: post
title: "Comparing Multi-Channel RF Transceivers for Space — 太空应用多通道 RF 收发器横评"
date: 2026-08-27 20:35:00 +0800
categories: [电子工程]
tags: [RF收发器, 卫星, ADC, DAC, RFSoC, Versal RF, Agilex, 太空电子]
description: "Spacechips CEO Rajan Bedi 横评六款多通道 RF 收发器：AMD RFSoC/Versal RF、Altera Agilex Direct RF、TI AFE80xx、Jariet Elektra、ADI AD9082，覆盖太空应用的选型逻辑与抗辐照现状。"
---

> **来源**：[EDN](https://www.edn.com/comparing-multi-channel-rf-transceiver-options-for-space-applications/) — *Comparing multi-channel RF transceiver options for space applications*
> **原文链接**：<https://www.edn.com/comparing-multi-channel-rf-transceiver-options-for-space-applications/>
> **原文发布日**：2026-08-25 ｜ **作者**：Dr. Rajan Bedi（Spacechips CEO & 创始人）
> **说明**：本文为英文原文全文转载，附中文深度解读。解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

Spacechips has been asked by its clients many times, "Which is the best device?" The answer? "It depends."

Payload manufacturers are increasingly exploiting the SWaP (size, weight, and power) advantages of single-chip, multi-channel transceivers, combining DSP and AI with RF ADCs and DACs. These devices offer significant benefits and flexibility to satellite operators, allowing them to change receive and transmit frequency plans in-orbit to deliver better services and more insights.

Using systems based on them, telecommunication operators can achieve better link performance, coverage and spectrum efficiency, while earth-observation users can transmit and receive multiple RF bands within the same orbital pass to monitor different terrains and penetration depths using a single transponder. SIGINT/ELINT operators can monitor UHF to K-band using one radio channel. The following example (**Figure 1**) illustrates C and Ku-band carriers being simultaneously under-sampled at 3 GSPS with respect to their absolute centre frequencies, but over and bandpass sampled in relation to their information bandwidths.

![图01｜C 与 Ku 波段载波的欠采样与带通采样（Spacechips）](/assets/img/posts/multi-channel-rf-transceiver-space/img01.jpg)
*图01｜Figure 1: C/Ku 波段载波在 3 GSPS 下同时欠采样（对绝对中心频率）与带通过采样（对信息带宽）。来源：Spacechips*

### Evolving market requirements

Satellite applications are increasingly processing wider and instantaneously reconfigurable bandwidths to deliver better services and more value-add. As a designer and manufacturer of software-defined transponders, my company Spacechips considers various single-chip transceivers for different customers. These devices enable operators to change, receive and transmit frequency plans, information bandwidths, modulation and waveform types *in-orbit*, in response to varying communication and traffic needs.

Integrated, multi-channel semiconductors such as the AMD's (formerly Xilinx's) RFSoC and Versal RF, Altera's Agilex Direct RF, Texas Instruments' AFE80xx, Jariet Technologies' Elektra and Analog Devices' AD9082 offer obvious advantages such as smaller size, lower power consumption and in some cases, elimination of the external interfaces between the ADC/DAC and DSP. I remember doing the layout of the first Spacechips SDR1 prototype, where the digital interface between the ADC and the FPGA required fifty impedance- and length-matched traces, as shown in **Figure 2**.

![图02｜传统 ADC-FPGA 接口的复杂度（Spacechips）](/assets/img/posts/multi-channel-rf-transceiver-space/img02.jpg)
*图02｜Figure 2: ADC LVDS 数字输出（左）与 FPGA（右）互连展示了传统系统设计复杂度。来源：Spacechips*

Over the past near-two decades, transponder architectures have become increasingly software-defined, with traditional, analogue superheterodyne circuits being replaced by digital and re-configurable logic. The latest, single-chip, multi-channel transceivers offer the potential to deliver true software-defined microwave. My company's (Spacechips) customers constantly ask questions such as the following:

- Which microchip they should use
- How they can improve ADC/DAC performance when directly processing RF carriers
- If parts will function reliably in space, and if they have heritage
- How can the customers implement in-orbit AI and machine learning, and
- How they should they design-in the parts.

There's a big difference between:

- Evaluating these devices using development kits that accept a ±1V carrier and looking at its idealized output spectrum, and
- Developing a payload baselining the same part, combining RF and high-speed digital, and delivering the advertised SNR and SFDR from a -120 dBm input!

Does your test equipment have the sensitivity and RF bandwidth to prove this amplitude, for example? And there's also a huge disparity between powering a 10 W and a 120 W semiconductor!

Spacechips provides training on, including demonstrating, the aforementioned AMD, Altera, Texas Instruments, Jariet Technologies and Analog Devices parts; in my next series of posts, I'll share insights and lessons learned. This first tutorial will introduce devices, compare their specifications, and discuss their respective suitability for satellite applications.

Future posts will share design-in experiences and measurement results. And with that all said, discrete, space-grade, broadband ADCs and DACs up to K-band are also available, some of which offer advantages over these devices, e.g. RF bandwidth, reliability, availability, and space-qualified status. I have [previously written](https://www.edn.com/re-configurable-ka-band-satellite-communication-without-rf-frequency-conversion/) about some of these latter options.

### AMD RFSoC and Versal RF

Back in 2017, [I first posted](https://www.edn.com/introducing-rfsoc/) about AMD's first-generation RFSoC product family. Gen. 3 integrates a Zynq UltraScale+ MPSoC with 14-bit, 5 GSPS, 6 GHz ADCs and 14-bit, 10 GSPS, 6 GHz DACs (**Figure 3**). The DFE variant operates up to 7.125 GHz. The original RFSoC was the first semiconductor device to integrate high-speed mixed-signal convertors with an FPGA and Arm Cortex processors, removing the traditional physical interfaces between these respective technologies.

![图03｜RFSoC 家族架构（AMD）](/assets/img/posts/multi-channel-rf-transceiver-space/img03.jpg)
*图03｜Figure 3: RFSoC 家族将混合信号转换器与 FPGA fabric 和 Arm 处理器集成。来源：AMD*

AMD's Versal RF improves on RFSoC by offering faster and wider bandwidth mixed-signal converters, i.e. 14-bit, 8/32 GSPS, 18 GHz ADCs and 14-bit, 16 GSPS, 18 GHz DACs (**Figure 4**). The Versal ACAP product range contains dedicated AI engines with vector processors to accelerate machine learning, and AMD plans to formally qualify two devices from the new Versal RF product family: the VR1602 and VR1652 parts.

![图04a｜Versal RF 产品家族（AMD）](/assets/img/posts/multi-channel-rf-transceiver-space/img04.jpg)
*图04a｜Figure 4 (上): Versal RF 产品家族多种器件选项。来源：AMD*

![图04b｜Versal RF 产品家族（AMD）](/assets/img/posts/multi-channel-rf-transceiver-space/img05.jpg)
*图04b｜Figure 4 (下): 不同 ADC/DAC 数量与类型的 Versal RF 型号。来源：AMD*

### Altera Agilex Direct RF

Conceptually, Altera's Agilex 9 Direct RF family is similar to RFSoC, but it offers faster and wider-RF bandwidth mixed-signal converters enabling millimeter-wave sensing payloads, i.e. 10-bit, 64 GSPS, 36 GHz ADCs and 10-bit, 64 GSPS, 36 GHz DACs (**Figure 5**). Higher sampling frequencies enable the digitization and synthesis of wider instantaneous information bandwidths. A lower bandwidth, higher dynamic performance, sixteen channel, 14-bit, 4 GSPS, 7.1 GHz ADC and 14-bit, 12 GSPS, 7.1 GHz DAC version is also available. The Agilex 9 Direct RF FPGA contains robust tensor-capable DSP blocks within its fabric to support SIMD execution to accelerate AI operations.

![图05｜Agilex 9 Direct RF 架构（Altera）](/assets/img/posts/multi-channel-rf-transceiver-space/img06.jpg)
*图05｜Figure 5: Agilex 9 Direct RF FPGA 在可编程 fabric 内集成张量 DSP 块。来源：Altera*

### Texas Instruments AFE80xx

Texas Instruments' AFE80xx is an integrated RF transceiver offering 14-bit, 4 GSPS, 7.1 GHz ADCs and 14-bit, 12 GSPS, 7.1 GHz DACs (**Figure 6**). The AFE80xx has eight JESD204B/C serial interfaces to connect to an ASIC or an FPGA at speeds up to 32.5 Gbps per lane. The AFE8010 variant is a ten-channel receiver-only device.

![图06｜AFE80xx 功能框图（Texas Instruments）](/assets/img/posts/multi-channel-rf-transceiver-space/img07.jpg)
*图06｜Figure 6: AFE80xx 功能框图展示单芯片级功能集成度。来源：Texas Instruments*

### Jariet Technologies Elektra

Jariet Technologies offers the Elektra-MA/MK/MX dual-channel transceivers containing two 10-bit, 40 to 64 GSPS ADCs and DACs processing instantaneous bandwidths of 6.4 GHz up to 36 GHz (**Figure 7**). Elektra devices have sixteen JESD204B/C interfaces to connect to an ASIC or an FPGA at speeds up to 30 Gbps per lane.

![图07｜Elektra 器件接口（Jariet Technologies）](/assets/img/posts/multi-channel-rf-transceiver-space/img08.jpg)
*图07｜Figure 7: Elektra 的 JESD204B/C 接口连接 ASIC 或 FPGA，每 lane 高达 30 Gbps。来源：Jariet Technologies*

### Analog Devices AD9082

Analog Devices' AD9082 integrates two, 12-bit, 6 GSPS, 8 GHz ADCs and four 16-bit, 12 GSPS, 8 GHz DACs (**Figure 8**). The AD9082 has sixteen JESD204B/C interfaces to connect to an ASIC or an FPGA at speeds up to 24.75 Gbps per lane.

![图08｜AD9082 集成多路高性能 ADC/DAC（Analog Devices）](/assets/img/posts/multi-channel-rf-transceiver-space/img09.jpg)
*图08｜Figure 8: AD9082 集成多路高精度高性能 ADC 与 DAC。来源：Analog Devices*

### General comments

As noted earlier, Spacechips has been asked many times, "*Which is the best device?*" Some of our clients need to perform a lot of real-time DSP and/or AI inference on the incoming carrier traffic, so a Versal RF or an Agilex 9 Direct RF may be a better fit for their application. However, several of our other customers do not fit this same definition, and a large, complex, highly-integrated device requiring lots of power rails and watts is therefore likely not their optimum solution.

Two of our clients need more dynamic performance than that offered by ten-bit ADCs/DACs, and exploiting the processing gain from over-sampling is one way to deliver higher SNR. Many users complain about not achieving the advertised data sheet performance and we therefore teach them how to extract every last dB of performance from these parts. Just because a device has a specified sampling/reconstruction clock frequency of ***Fs*** GSPS, this does not always result in an information bandwidth close to theoretical Nyquist, i.e. ***Fs/2*** Hz.

For some of our customers, there are financial and programmatic reasons that influence which part to baseline. One of our primary clients, for example, requires a year to approve a new supplier. This timeline did not fit with the project schedule and they resultantly developed an expensive, over-engineered system (in my opinion). For some of our clients, the physical size and/or power consumption of an integrated transceiver may be prohibitive, e.g. a 1U COTS payload might not have an adequate area or financial budget, and its small platform may not be able to generate sufficient energy to supply a power-hungry device.

Other integrated transceivers also exist, of course, but I focus here on the ones that are of most interest to Spacechips and our customers. Most of the devices are part of a wider product suite offering varying numbers of channels, resolutions and sampling speeds. **Table 1** summarizes the basic specifications of the six devices and families discussed here.

| | **RFSoC** | **Versal RF** | **Direct RF** | **AFE80xx** | **Elektra** | **AD9082** |
|---|---|---|---|---|---|---|
| **Architecture** | FPGA, Arm, RX/TX ADC & DAC | FPGA, Arm, RX/TX ADC & DAC | FPGA, Arm, RX/TX ADC & DAC | RX/TX, ADC & DAC | RX/TX, ADC & DAC | RX/TX, ADC & DAC |
| **Technology Node** | 16 nm FinFET | 7 nm FinFET | 10 nm SuperFin | 16 nm FinFET | 12nm CMOS | 28nm CMOS |
| **Integrated FPGA** | Yes | Yes | Yes | No | No | No |
| **ADC Resolution** | 14-bit | 14-bit | 10-bit | 14-bit | 10-bit | 12-bit |
| **Maximum ADC Sampling Rate** | 5 GSPS | 32 GSPS | 64 GSPS | 4 GSPS | 40 to 64 GSPS | 6 GSPS |
| **ADC RF Bandwidth** | 6 GHz | ~18 GHz | 36 GHz | 7.1 GHz | 36 GHz | 8 GHz |
| **DAC Resolution** | 14-bit | 14-bit | 10-bit | 14-bit | 10-bit | 16-bit |
| **Maximum DAC Sampling Rate** | 10 GSPS | 16 GSPS | 64 GSPS | 12 GSPS | 40 to 64 GSPS | 12 GSPS |
| **DAC RF Bandwidth** | 6 GHz | ~18 GHz | 36 GHz | 7.1 GHz | 36 GHz | 8 GHz |
| **Maximum Instantaneous Bandwidth** | ~2 to 4 GHz | ~16 GHz | > 20 GHz | 0.4 to 1.2 GHz | 6.4 GHz | ~4 to 8 GHz |
| **AI Acceleration** | Fabric | AI Engines | Tensor Fabric | No | No | No |

**Table 1** A comparison of device specifications covers the companies and products discussed in this blog post. Source: Spacechips

All of the parts discussed here contain integrated DDCs and DUCs to assist with carrier digitization and synthesis, respectively, as well as re-programmability. For fixed frequency plans, bandpass carriers can be directly under-sampled and aliased into the baseband zone (**Figure 1**). For example, for a 64 GSPS ADC, a 400 MHz-wide signal centered at 25 GHz can be digitized at 1 GSPS (bandwidth over-sampling of 2.5). For wider-band carriers, e.g. SIGINT spectrum monitoring or SATCOM gateways, you do not need to decide beforehand which signal you want; you can digitize the complete Nyquist bandwidth and, using software DDC control, gain, filter and decimate the required signals.

Some of the devices contain multiple independent DDCs to extract separate baseband streams. Decimation lowers the sample rate supplying the FPGA with data, at 1 GSPS versus 64 GSPS as in the above example, reducing memory bandwidth and easing FPGA resource utilization. For CMOS devices, a lower switching speed also reduces power consumption.

On the transmitting side, some of the DACs can directly up-convert baseband to IF/RF images in the higher Nyquist zones, as illustrated in the following example with an update rate of 10 GSPS (**Figure 9**). Similarly for wider-band carriers, a DUC can significantly reduce the data bandwidth to the FPGA, interpolating, up-converting, removing unwanted images and flattening the sinc roll-off within the desired passband. Changing frequency plans requires reprogramming the NCO rather than altering the entire analog RF chain.

![图09｜C/Ku 载波在第一与第四 Nyquist 区（Spacechips）](/assets/img/posts/multi-channel-rf-transceiver-space/img10.jpg)
*图09｜Figure 9: C 与 Ku 波段载波位于第一与第四 Nyquist 区。来源：Spacechips*

None of the parts discussed here were developed specifically for space applications, but several are currently operating in-orbit. All are fabricated using ultra-deep-submicron geometries, e.g. 16 or 7 nm FinFET, 10 nm SuperFin or 28 or 12 nm CMOS, and their thinner oxide as well as general scaling have made them intrinsically tolerant to total-dose changes over the lifetime of a mission. Several also contain process-level radiation-hardening to eliminate single-event latch-up.

Device-level mitigation, e.g. the use of EDAC within fabric memory and triplicated HDL, as well as system techniques, e.g. power-rail monitors, have collectively improved overall reliability sufficiently for certain customers, resulting in very enabling transponder designs. Some of the devices have been irradiated and several are currently being tested in-beam.

### Conclusions

My next planned article will describe using, testing and designing-in the devices discussed here, all of which have unique requirements. Please note that the company and product names contained within this writeup are copyrighted and trademarked by their owners!

I'm off to the lab begin testing several the first of the parts. Until next time, the person who shares their best integrated transceiver design-in story in the [comments below](https://www.edn.com/comparing-multi-channel-rf-transceiver-options-for-space-applications/#comments) will win a Spacechips' Training World Tour tee-shirt. Our global training schedule can be viewed at our website (www.spacechips.co.uk/training_courses), or email us (events@spacechipsllc.com) for more information.

*[Dr. Rajan Bedi](https://www.edn.com/author/rajan-bedi/) is the CEO and founder of Spacechips, which designs and builds a range of advanced, AI-enabled, re-configurable, L to K-band, ultra high-throughput transponders, SDRs, Edge-based on-board processors and Mass-Memory Units for telecommunication, Earth-Observation, ISAM, SIGINT, navigation, 5G, internet and M2M/IoT satellites. The company also offers Space-Electronics Design-Consultancy, Avionics Testing, Technical-Marketing, Business-Intelligence and Training Services. (www.spacechips.co.uk).*

# 第二部分：解析（深度解读）

## 核心论点摘要

Spacechips CEO Rajan Bedi 的这篇横评回答了卫星载荷设计里最高频的问题「哪颗芯片最好」——答案是「看情况」。三个层次：

1. **技术选型的分叉点**：需要实时 DSP/AI 推理 → Versal RF 或 Agilex 9 Direct RF（带 FPGA/AI 引擎）；不需要 → TI AFE80xx / Jariet Elektra / AD9082（纯转换器，功耗预算友好）。
2. ** datasheet 性能 ≠ 系统性能**：评估板 ±1V 载波下的理想频谱，与 -120dBm 输入下交付标称 SNR/SFDR 的真实载荷之间有巨大鸿沟；Fs GSPS ≠ Fs/2 的信息带宽。
3. **抗辐照不是门槛**：这些器件全都不是为太空设计的，但超深亚微米工艺（更薄栅氧+几何缩放）天然抗总剂量，多家已有在轨运行记录；SEL 靠工艺级加固消除，配合 EDAC/三模冗余/电源轨监控达到可用可靠性。

## 关键概念解读

- **欠采样/带通采样的实战价值**：C/Ku 双波段载波可在 3GSPS 下同时数字化——一次过境用单个转发器监视多种地形与穿透深度；SIGINT/ELINT 用户单信道覆盖 UHF 到 K 波段。
- **DDC/DUC + NCO 重编程 = 真·软件定义微波**：改频率计划只需重编程 NCO，不动模拟射频链；64GSPS 全 Nyquist 数字化后用软件 DDC 抽取目标信号，decimation 同时降低 FPGA 资源与 CMOS 器件功耗。
- **过采样换 SNR**：需要高于 10-bit 动态性能的客户，可用过采样处理增益「抠出每一个 dB」——这是 10-bit 高速器件（Agilex/Elektra）用户的生存技能。
- **非技术约束同样致命**：供应商审批周期（某客户要一年）、1U 平台的面积/功耗/预算，都可能否决「纸面最优」的器件。

## 分层拆解表（核心规格浓缩）

| 器件 | 节点 | ADC | DAC | 瞬时带宽 | AI 加速 | 定位 |
|---|---|---|---|---|---|---|
| AMD RFSoC Gen3 | 16nm | 14b/5GSPS/6GHz | 14b/10GSPS/6GHz | 2-4GHz | Fabric | 开创者，成熟在轨 |
| AMD Versal RF | 7nm | 14b/32GSPS/18GHz | 14b/16GSPS/18GHz | ~16GHz | AI Engines | VR1602/VR1652 拟正式太空认证 |
| Altera Agilex 9 Direct RF | 10nm | 10b/64GSPS/36GHz | 10b/64GSPS/36GHz | >20GHz | Tensor Fabric | 毫米波感知极限带宽 |
| TI AFE80xx | 16nm | 14b/4GSPS/7.1GHz | 14b/12GSPS/7.1GHz | 0.4-1.2GHz | 无 | 无 FPGA、低功耗、JESD204B/C×8 |
| Jariet Elektra | 12nm | 10b/40-64GSPS/36GHz | 10b/40-64GSPS/36GHz | 6.4GHz | 无 | 双通道超宽带专用 |
| ADI AD9082 | 28nm | 12b/6GSPS/8GHz×2 | 16b/12GSPS/8GHz×4 | 4-8GHz | 无 | 精度与通道数均衡（DAC 16-bit 最优） |

## 技术趋势判断

这篇文章展示了「先进制程混合信号器件溢出到太空市场」的趋势：为地面 5G/雷达开发的 7-16nm 收发器，凭缩放带来的天然抗辐照能力直接上轨——太空级器件的传统壁垒（认证周期、专工艺）正在被 COTS+器件级缓解的组合侵蚀。另一条暗线是**在轨 AI**：Versal 的 AI Engines 与 Agilex 的张量 DSP 都在把「卫星上跑机器学习」变成货架能力。这与本站关注的另一战场（数据中心侧的 AI 硬件军备，见《[AMD MI400](/posts/amd-mi400-gpu-hot-chips-2026/)》《[NVIDIA Vera Rubin NVL72](/posts/nvidia-vera-rubin-nvl72-hot-chips-2026/)》）共享同一批半导体供应商——AMD/Altera/ADI/TI 在两个市场的技术复用值得跟踪。

## 风险提示

本文作者经营太空电子培训与咨询业务，横评带有商业导流性质；各器件实测性能数据将在其后续文章给出，本文仅有规格表；太空认证状态（VR1602/VR1652「计划正式认证」）尚未完成，任务采信需以辐照测试报告为准。
