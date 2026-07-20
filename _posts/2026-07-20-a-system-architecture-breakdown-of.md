---
layout: post
title: "Pushing the Speed Limit: Designing SerDes Transceivers for the 224 and 448Gbps Scaling Era — 突破速率极限：面向 224/448Gbps 时代的 SerDes 收发器系统架构拆解"
date: 2026-07-20 23:15:00 +0800
categories: [半导体投资]
tags: [半导体, SerDes, 收发器, 高速通信, 信号完整性, DSP]
description: "整理自 Chad Wallace（Silicon Co-Design, Substack）的技术科普：从 112G→224G→448Gbps 演进下的物理约束出发，拆解现代 DSP-based 收发器的数据通路、TX 侧串行器/MUX 树/电流舵 DAC、RX 侧时间交织 SAR ADC，以及时钟架构挑战。英文原文 + 中文深度解读。"
---

> 本文整理自 Chad Wallace (Substack / siliconcodesign.com) 的技术科普文章，原文发布于 2026-03-23。
> 标题原文：*Pushing the Speed Limit: Designing SerDes Transceivers for the 224 and 448Gbps Scaling Era*。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> ⚠️ 文末时钟架构（CDR / LC-VCO PLL / 多相时钟 / 时钟分配）的**详细展开在付费段**，公开免费部分仅列出名称，本文如实标注、未含付费深解。

---

# 第一部分：正文（Original Article）

## Pushing the Speed Limit: Designing SerDes Transceivers for the 224 and 448Gbps Scaling Era

来源：[Chad Wallace (Substack)](https://www.siliconcodesign.com/p/a-system-architecture-breakdown-of) · 2026-03-23

![Figure 1. DSP-Based Transceiver architecture.](https://substack-post-media.s3.amazonaws.com/public/images/98fb4c00-c723-4834-a814-6dbebeebfe12_1453x632.png)

**Figure 1.** DSP-Based Transceiver architecture. Reproduced from A. Carusone *et al*., 'Modern Wireline Transceivers,' *IEEE Journal of Solid-State Circuits*, vol. 61, no. 2, pp. 395–422, Feb. 2026, licensed under **CC BY-NC-ND 4.0**.

*Editor's Note (5/30/26): Moving forward, I am transitioning this Substack into a deep-dive resource on System Architecture that covers the packaging, thermal, power, and signal integrity stack. To reflect the depth of the synthesis and combination of topics involved, the deepest technical layers of each of my guides will now be reserved for paid subscribers.*

*Before each paywall, I'll post links to some of my other adjacent posts that give you a well rounded flavor of the interactions amongst other domains.*

As data speeds climb from 112Gbps to 224Gbps and 448Gbps, data starting running into **physics constraint**s and **transceivers become more complex** to compensate for these effects.

In this post I'll be doing a **system architecture breakdown** of a modern DSP-based transceiver. I'll explain the underlying physics constraints and the major blocks data passes through. Then, I'll do a deep dive into the **high-speed** building blocks (shown in yellow) on the TX and RX side. I'll be covering the following:

*   The real problem: increasing data throughput under physical limits

*   System Datapath overview

*   TX Architecture:

    *   Serializer / Mux tree

    *   DAC - 6-7 Bit current steering DAC

*   RX Side - Time-Interleaved ADC

*   🔒Clocking Architecture

    *   🔒Clock Recovery: Bang Bang Phase Detector

    *   🔒Clock Generation: LC-VCO Based PLL

    *   🔒Multi-phase clock generation: The phase Interpolator

    *   🔒Clock Distribution: Repeater, transmission line, and resonator-based

Most of the figures in these slides are from the ISSCC tutorials as well as the papers in the references.

As data rates climb, we need to ask ourselves: what fundamentally constraints the data speed from first principles?

Data speed is now limited by physics and device parameters on the chip, which include, but not limited to, the following:

*   **Channel Loss:** Loss scales with signal frequency, and high frequency attenuation rounds out the sharp edges of digital signals

*   **High impedance nodes in analog circuits:** Active loads have a high input resistance, which is good for gain, but also creates dominant poles that lower overall BW.

*   **On-Chip Capacitance:** Bigger transistors have bigger C that can affect rise/fall times of signals

*   **Noise / Jitter:** The randomness in clock / data edges affect how fast those signals can be relative to the clock period. This impacts reliability of high speed digital circuits and time-interleaved switches

What tricks do designers have to increase speed? I contend there are two major paradigm shifts:

*   **Current steering circuits:** These circuits steer constant currents through switches to a resistive load. The main advance is that it**minimizes charging/discharging time of parasitic capacitors.** However, current steering circuits tend to consume more power than equivalent charged-based topologies.

*   **Time interleaving:** Instead of making a single component faster, place many in parallel and distribute data through "ranks" of S/H and T/H switches. Time interleaving introduces added complexity in clocks to coordinate parallel operations

Next lets look at the major blocks in the datapath.

The function of a transceiver is quite simple: transmit a large amount of data from the TX and RX with minimal errors across a medium as fast as possible.

For short reach, low speed operation, the architecture relied mostly on analog blocks. However, due to recent data demands, one of the big paradigm shifts is a move to **digital** for the processing. Digital is great at performing parallel processing of data at a moderate clock (1-10's GHz) frequency.

![Figure 2. A 224Gbps PAM-4 8-Lane Serdes for backplane interconnect.](https://substack-post-media.s3.amazonaws.com/public/images/4c91d941-5bb0-4e2c-88eb-f2b3e1d99ecc_495x435.png)

**Figure 2.** A 224Gbps PAM-4 8-Lane Serdes for backplane interconnect. Source: W. Chen, "Clocking and CDR Techniques for High Performance Wireline Transceiver" presented at the IEEE International Solid-State Circuits Conf. (ISSCC), San Francisco, CA, Feb. 15-19, 2026.

However, when it comes to data transmission, **edge density** becomes the constraint. You can only pack so much circuitry to drive the parallel channels on the edge of a chip and copper cables in the system.

As a result, data transmission favors **serialized data at a high speed** to pack as much data density as possible and transmit on a single cable.

These constraints influence the architecture of modern wireline transceivers.

On the TX Side, the main high speed blocks include:

*   **Forward Error Encoding (FEC)** - Encodes the data with parity bits that correct for channel error at the RX side

*   **Feed Forward Equalization (FFE)** - Pre-distorts the signal using a FIR filter to compensate for channel losses

*   **Serializer** - Serializes the digital data from multiple channels and raises the effective output rate. 112 Gb/s PAM4 corresponds to a 56 GBd symbol rate, though practical serializers often use half-rate or quarter-rate architectures that are time-interleaved

*   **High-speed DAC** - turns digital symbols into an analog waveform

*   **Driver** - amplitudes the signal before it is transmitted on the channel

In the Channel:

*   **Matching network** - matches the TX and RX to the characteristic impedance to avoid reflections and transmission line effects

*   **Channel** - attenuates and distorts the transmitted signal

In the RX:

*   **Receiver front-end** - conditions the signal by amplifying it (variable gain amplifier) and providing equalization (CTLE)

*   **TI-ADC** - converts the analog value to digital values

*   **Deserializer** - converts the digitized data from the transmission rate to the digital frequency

*   **DSP** - processes and recovers data

As a result of the added digital complexity, high speed and parallel processing blocks require a **robust clock architecture** to synchronize the data properly.

In the following sections, we'll step through each of the high speed blocks, with the principle of operation, the key impairments, and how they affect the system level.

![Figure 3. A Binary-Mux Tree.](https://substack-post-media.s3.amazonaws.com/public/images/fc3d1148-d08d-4786-8504-21c92de4208f_591x340.png)

**Figure 3.** A Binary-Mux Tree. Reproduced from B. Razavi, "Design Techniques for High-Speed Wireline Transmitters," *IEEE OJ-SSCS*, 2021 (CC BY).

The mux tree is used for serializing / deserializing data. Here, stages of 2-1 muxes are arranged in ranks. This ensure each interconnect between muxes aren't heavily loaded that can slow down operation.

The final rank operates with the highest-rate clock, while earlier ranks use divided versions of that clock so that each stage runs at a rate compatible with its local data rate.

![Figure 4. A Basic charge-steering MUX.](https://substack-post-media.s3.amazonaws.com/public/images/cb0e85f4-3d57-4be0-94c8-eff0a6dea0ba_738x425.png)

Figure 4. A Basic charge-steering MUX. Reproduced from B. Razavi, "Design Techniques for High-Speed Wireline Transmitters," *IEEE OJ-SSCS*, 2021 (CC BY).

A common high-speed mux cell is the **current steering mux cell**. This cell uses two differential pairs for each of the inputs. To select each input, the SEL signal, synchronized to the CLK, steers the current between the two input branches.

**Impairments**

![Figure 5. Divider and MUX Delay.](https://substack-post-media.s3.amazonaws.com/public/images/e1c50430-c7b2-424d-babc-7a462c8617ff_442x534.png)

**Figure 5.** Divider and MUX Delay. Reproduced from B. Razavi, "Design Techniques for High-Speed Wireline Transmitters," *IEEE OJ-SSCS*, 2021 (CC BY).

*   **Kickback noise from clock feedthrough.** Clock feedthrough and switching transients can disturb internal common-mode nodes and degrade timing margin, especially in the final high-speed stages.

*   **Skew between SEL and clk.**

*   **Skew between stages in the MUX tree.** The accumulated clock delay associated with the driver and the mux itself can cause ranks to fail to clock the data fast enough.

![Figure 6. Ideal DAC with Current steering cell.](https://substack-post-media.s3.amazonaws.com/public/images/23df379c-ba18-4f53-9f5e-36c0f7b7f172_921x403.png)

**Figure 6.** Ideal DAC with Current steering cell. Source: S. Su, "Principles and Practices of High-Speed Digital-to-Analog Converter Design" presented at the IEEE International Solid-State Circuits Conf. (ISSCC), San Francisco, CA, Feb. 15-19, 2026.

The high speed DAC commonly employs a **segmented current steering architecture.** This architecture uses scaled current sources representing the "weight" of the binary bits. The steered currents are summed and converted to an output voltage across a load impedance.

The current steering cell consist of two main branches and a selector with a flip flop and driver. This current source is generated from the bottom two transistors. The driver cell "steers" this current between two branches: the left branch to enable the bit and right branch to disable it. The switch control is retimed so current steering occurs with precise timing at the symbol rate.

Current continuity is often preferred for high speed because it minimizes voltage swings from constantly charging / discharging capacitive nodes. However, it also consumes static power even when the bit is disabled.

![Figure 7. A 7b DAC-based quarter-rate TX example with seven thermometer and four binary output segments.](https://substack-post-media.s3.amazonaws.com/public/images/63ad248a-7707-4c84-878b-1fa7d30c8a37_678x670.png)

**Figure 7.** A 7b DAC-based quarter-rate TX example with seven thermometer and four binary output segments. Reproduced from A. Carusone *et al*., 'Modern Wireline Transceivers,' *IEEE Journal of Solid-State Circuits*, vol. 61, no. 2, pp. 395–422, Feb. 2026, licensed under **CC BY-NC-ND 4.0**.

This current cell is then scaled to a segmented architecture, which uses both unary and binary DACs. Unary (or thermometer code) uses unit-sized current sources arrayed in a 2x2 grid in layout to achieve better matching of current sources.

In many wireline transmitters, DAC resolution is kept modest, often around 6–7 bits, because channel loss, jitter, and front-end noise dominate before very fine quantization does.

**Impairments**

![Figure 8. Impairments of Current steering DAC.](https://substack-post-media.s3.amazonaws.com/public/images/727a67f5-f986-41a6-840a-2dd4e6e59c71_894x396.png)

**Figure 8.** Impairments of Current steering DAC. Source: S. Su, "Principles and Practices of High-Speed Digital-to-Analog Converter Design" presented at the IEEE International Solid-State Circuits Conf. (ISSCC), San Francisco, CA, Feb. 15-19, 2026.

There are several impairments that cause both timing and amplitude errors:

*   **Time delay**

*   **Voltage glitches**

*   **Clock Skew**

*   **Finite Input impedance**

*   **EMI at all sources**

![Figure 9. Jitter and Noise PDFs and how the affect BER.](https://substack-post-media.s3.amazonaws.com/public/images/af476d26-6075-49f5-9f6b-e88ec3bbaaa4_1326x787.png)

**Figure 9.** Jitter and Noise PDFs and how the affect BER. Source: M. Li. "Design and Verification for High-Speed I/Os at 10 to 112 to 224 Gbps, and 448 Gbps with Jitter, Signal Integrity, and Power Optimized: A Tutorial for Designcon 2026" DesignCon 2026

These impairments introduce **timing and amplitude error at the system level**. They translates to jitter in the x domain and noise in the y dimension. These effects directly affect the size of the "eye" at the RX side, so it is important to account for these and spec these appropriately.

![Figure 10. An Asynchronous SAR ADC with Timing Diagram.](https://substack-post-media.s3.amazonaws.com/public/images/2fb4b5bb-f786-4a44-8606-d2a55ab057aa_1224x515.png)

**Figure 10.** An Asynchronous SAR ADC with Timing Diagram. Reproduced from A. Carusone *et al*., 'Modern Wireline Transceivers,' *IEEE Journal of Solid-State Circuits*, vol. 61, no. 2, pp. 395–422, Feb. 2026, licensed under **CC BY-NC-ND 4.0**.

A common modern RX approach uses **time-interleaved asynchronous SAR ADCs** operating in a self-clocked manner.

In normal asynchronous SARs, it takes N clock cycles to complete an N bit conversion. In asynchronous circuits, **self-clocking** allows the completion of one comparison to automatically trigger the next.

Self-clocking removes the need for a very high external clock, but it makes the conversion timing dependent on timing delays and handshake robustness.

Asynchronous SARs are commonly used due to low comparator count, simple digital logic, and capacitive DACs for energy efficient operation at typical 6-7 bit resolution.

![Figure 11. A Time-Interleaved SAR ADC.](https://substack-post-media.s3.amazonaws.com/public/images/d93902ef-969d-4d4b-82b7-f4f8b9506440_944x550.png)

**Figure 11.** A Time-Interleaved SAR ADC. Reproduced from A. Carusone *et al*., 'Modern Wireline Transceivers,' *IEEE Journal of Solid-State Circuits*, vol. 61, no. 2, pp. 395–422, Feb. 2026, licensed under **CC BY-NC-ND 4.0**.

These SAR ADCs are **time interleaved**. The high speed data is "fanned out" to each of the sub-ADCs in order for their analog values to be digitalized. This is accomplished through a two-rank NxM interleaving scheme. This architecture performs sampling in two ranks:

*   **Rank 1 - Track and hold.** The first rank tracks and holds the signal. The performance of these switches are critical as they sample the full BW signal.

*   **Rank 2 - Sample and hold buffer.** These buffer the T/H signals to drive the parallel ADCs.

In modern PAM-4 112Gbps, the interleave factors range from 36-128 sub-ADCs depending on the layout area, with 64 being common. [1]

![Figure 12. How Sampling / Clocking Jitter affects voltage error.](https://substack-post-media.s3.amazonaws.com/public/images/f36847c5-8714-40ab-b47a-246345d09468_781x475.png)

**Figure 12.** How Sampling / Clocking Jitter affects voltage error. Source: W. Chen, "Clocking and CDR Techniques for High Performance Wireline Transceiver" presented at the IEEE International Solid-State Circuits Conf. (ISSCC), San Francisco, CA, Feb. 15-19, 2026.

**Impairments:** There are several impairments:

*   **Skew and Jitter of clock**

*   **Mismatches between sub-ADCs**

These impairments translate **timing mismatches** into **sampled voltage errors**, often in a signal-dependent way, and can create both **noise-like degradation** and **spurious tones.**

Perhaps the most important part of a high speed chip is the one everyone takes for granted: **The clock.**

The clock distribution becomes an increasingly important constraint as dimensions and speeds have scaled down. There are several challenges the clock faces:

*   **The clock needs to be recovered** from the asynchronous RX data to ensure that the clock is in "sync" with the data to clock it appropriately

*   The VCO needs to generate a reference clock with **low jitter**

*   The time-interleaved blocks need some form of **multi-phase clock** to synchronize operations across parallel processing elements cleanly

*   The parallel clock distribution needs **minimal skew** to minimize mismatches

After the pay wall I'll describe the clocking architecture in more detail.

---

# 第二部分：解析（深度解读）

## 一、核心论点摘要

本文是对**现代 DSP-based SerDes 收发器**的系统级架构拆解，核心逻辑：

1. **物理约束是速率天花板**：从 112G→224G→448Gbps，速率提升遇到通道损耗、高阻节点、片上电容、噪声/抖动四大物理瓶颈。
2. **两大范式转变**突破速度：电流舵（current steering）电路 + 时间交织（time interleaving）并行。
3. **数据通路全景**：TX（FEC→FFE→串行器→DAC→Driver）→ 通道（匹配网络+信道）→ RX（前端→TI-ADC→解串器→DSP）。
4. **深度拆解三个高速模块**：串行器/MUX 树、电流舵 DAC、时间交织 SAR ADC。
5. **时钟是"被忽视的主角"**：CDR、低抖动 VCO、多相时钟、低偏斜分配——这部分（🔒付费）是全文最难也最关键的部分。

> ⚠️ 付费段内容（时钟架构：Bang-Bang 鉴相器、LC-VCO PLL、相位插值器、时钟分配）未含。

## 二、关键概念解读

### 2.1 为什么需要电流舵 + 时间交织

| 技术 | 原理 | 好处 | 代价 |
|------|------|------|------|
| **电流舵（Current Steering）** | 用开关把恒定电流导向电阻负载 | 最小化对寄生电容的充放电时间→速度快 | 比电荷型拓扑功耗高（静态功耗） |
| **时间交织（Time Interleaving）** | 多路并行 + 分级 S/H、T/H 开关分担数据 | 不需单器件更快，靠并行提吞吐 | 时钟协调复杂度高、子通道失配 |

**投资视角**：这两大范式直接定义了 224G/448G SerDes 的芯片架构。电流舵 DAC 和 TI-ADC 是发射端/接收端的"硬骨头"，也是 IP 壁垒所在。

### 2.2 TX 数据通路各模块

```
数字数据 → [FEC] → [FFE 预失真] → [Serializer 串行器/MUX树] → [电流舵 DAC] → [Driver] → 通道
```

- **FEC**：加奇偶校验位，在 RX 端纠错（应对信道损伤）
- **FFE**：用 FIR 滤波器预失真，补偿通道损耗（与信号完整性篇的通道损耗直接对应）
- **Serializer**：把多路低速并行的数字数据串行化。112Gb/s PAM4 = 56 GBd 符号率，实际常用半速率或四分之一速率的时间交织架构
- **DAC**：把数字符号转成模拟波形（6-7 bit 足以，因为通道损耗/抖动/前端噪声比精细量化更早成为瓶颈）
- **Driver**：传输前放大信号

### 2.3 电流舵 DAC：分段式架构

| 维度 | 说明 |
|------|------|
| 基本单元 | 两个电流源分支 + 选择器（FF+driver），开关重定时到符号率精确切换 |
| 分段式（Segmented） | 一元码（thermometer）+ 二进制码混合；一元码用单位电流源 2x2 阵列布局以优化匹配 |
| 分辨率 | 通常仅 6–7 bit |
| 主要损伤 | 时间延迟、电压毛刺、时钟偏斜、有限输入阻抗、各源 EMI |

**关键直觉**：电流连续性优于电荷翻转——它最小化电容节点的电压摆幅，但即使 bit 关闭也耗静态功耗（功耗 trade-off）。

### 2.4 RX：时间交织异步 SAR ADC

| 特性 | 说明 |
|------|------|
| 异步 SAR | 一次比较完成自动触发下一次，无需超高外部时钟 |
| 自时钟（self-clocking） | 简化时钟需求，但转换时序依赖延迟与握手鲁棒性 |
| 时间交织 | NxM 两 ranks：Rank1 T/H 采样全带宽，Rank2 S/H buffer 驱动并行 ADC |
| 交织因子 | 现代 112G PAM4 下 36–128 个子 ADC，常见 64 |
| 主要损伤 | 时钟偏斜/抖动、子 ADC 失配 → 时序失配转为采样电压误差 → 噪声退化 + 杂散 tones |

**投资视角**：TI-ADC 的子通道失配（mismatch）和时钟偏斜（skew）是 448G 时代的核心工程难点，直接决定 BER。做高速 ADC IP 的公司（如 ADI、TI、以及 SerDes IP 厂商内嵌的 ADC）技术壁垒极高。

### 2.5 时钟架构（付费段预告）

全文结尾点出时钟是"被所有人想当然、却最关键的部分"，列出四大挑战：

1. **时钟恢复（CDR）**：从异步 RX 数据恢复时钟
2. **低抖动 VCO**：生成参考时钟
3. **多相时钟**：驱动时间交织模块的并行同步
4. **低偏斜分配**：并行时钟分布最小化失配

这与本站已发布的 [PLL 入门](https://marvinlee.cn/posts/the-phase-locked-loop-a-primer/) 和 [信号完整性入门](https://marvinlee.cn/posts/signal-integrity-a-primer/) 形成完整知识闭环。

## 三、与本站其他文章的连接

- **信号完整性入门**：本文的 FFE 预失真、通道损耗、抖动/Jitter 正是信号完整性篇的物理基础。参见 [信号完整性入门](https://marvinlee.cn/posts/signal-integrity-a-primer/)。
- **PLL 入门**：本文结尾的时钟架构（VCO、多相时钟、CDR）本质上是 PLL 的应用。参见 [PLL 入门](https://marvinlee.cn/posts/the-phase-locked-loop-a-primer/)。
- **光通信入门**：SerDes 正是光模块 DSP 的核心，224G/448G 演进直接推动 CPO/硅光。参见 [光通信入门](https://marvinlee.cn/posts/high-speed-optical-communications/)。
- **光投资地图**：SerDes IP、高速 ADC/DAC、CPO 都是光投资地图的核心标的。参见 [光投资地图 v1.0](https://marvinlee.cn/posts/optical-investment-map-v1-0/)。

## 四、风险提示

- **功耗墙**：电流舵电路的静态功耗 + 时间交织的并行规模，使 448G SerDes 的功耗成为系统级瓶颈（尤其与光模块的功耗预算竞争）。
- **工艺节点依赖**：时间交织 SAR ADC 的失配、时钟偏斜随工艺微缩更敏感，需要数字辅助校准（digital background calibration），增加 DSP 复杂度。
- **标准与生态**：224G 标准（OIF/CEI-224G）仍在成熟中，448G 更早期；不同厂商 TX/RX 架构差异大，互操作性认证是落地关键风险。
- **集成趋势**：本文作者已将 Substack 转向"系统架构"深度付费内容，表明最深的时钟/封装/热/电源堆栈知识正走向付费墙——公开免费内容的深度在下降，做投研需关注一手付费源。
