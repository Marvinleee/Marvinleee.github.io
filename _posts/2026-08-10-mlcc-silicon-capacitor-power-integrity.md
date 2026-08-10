---
layout: post
title: "Complementary, Not Competing: MLCCs and Silicon Capacitors in AI Server Power Integrity — 互补而非竞争：AI 服务器电源完整性中的 MLCC 与硅电容"
date: 2026-08-10 20:00:00 +0800
categories: [半导体投资]
tags: [半导体, AI服务器, MLCC, 硅电容, 电源完整性, HBM, 三星电机]
description: 整理 TrendForce 关于 AI 服务器电源完整性的分析：板级 MLCC 与封装级硅电容如何分工互补，硅电容凭借极低 ESL 与近 die 去耦成为 AI 加速器的关键高端元件，以及村田/SEMCO/台耀等供应链格局与双轨未来。英文原文 + 中文深度解读。
---

> 本文整理自 **TrendForce**（insights.trendforce.com，Substack 专栏），原文发布于 **Jun 18, 2026**（标题原文：*Complementary, Not Competing: MLCCs and Silicon Capacitors in AI Server Power Integrity*）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。
> ⚠️ 本文为公开免费文章，已含完整正文。

---

# 第一部分：正文（Original Article）

## Complementary, Not Competing: MLCCs and Silicon Capacitors in AI Server Power Integrity

### MLCCs Hold the Board. Silicon Capacitors Enter the Package.

[TrendForce](https://substack.com/@trendforceinsights)

Discussions of AI server capacitor demand have largely centered on multi-layer ceramic capacitors (MLCCs): rising consumption, shortages of high-capacitance products, and growing need for high-voltage components. But as power integrity requirements intensify across AI servers and high-performance computing (HPC), another component is drawing increasing attention: **silicon capacitors.**

In May 2026, Samsung Electro-Mechanics announced a silicon capacitor supply contract worth approximately USD 1 billion with a major global customer, covering deliveries through 2027 and 2028. A month later, the company outlined its strategic direction, pointing toward an integrated approach that bundles silicon capacitors, MLCCs, and package substrates. This reflects a broader market trend: silicon capacitors are emerging as vital complementary components for package-level power integrity.

What roles do silicon capacitors and MLCCs each play in power integrity, and how do they complement each other? This article examines the technical characteristics of both, and the supply chain dynamics.

> ***Related report: [MLCC Market Outlook 1Q26~2Q26](https://www.trendforce.com/research/download/RP260525QD?utm_source=tf_substack&utm_medium=post)***

## **Power Integrity Moves Inside the Package**

As GPUs' thermal design power (TDP) rapidly escalates, components such as power shelves, VRMs, DC-DC converters, and OAM boards require significantly more MLCCs for filtering and voltage regulation so as to prevent voltage ripples from compromising computational stability. In the meantime, as AI accelerator platforms evolve to incorporate chiplets, HBM, and high-density advanced packaging, power integrity challenges are no longer confined to the PCB level; they are penetrating deeply into the package itself.

In a multi-die architecture, a single GPU package might house a compute die, an I/O die, and an NVLink I/O die. Together with HBM, silicon interposers, and package substrates, these components form a highly dense system. Every individual die and power domain necessitates an independent, rapidly responding decoupling network. Relying exclusively on board-level MLCCs creates excessively long current paths, introducing parasitic inductance that severely throttles transient response speeds.

## **Silicon Capacitors' Advantages**

Manufactured using semiconductor fabrication processes, silicon capacitors utilize a silicon substrate paired with thin-film dielectric materials like silicon oxide or silicon nitride. Unlike traditional MLCCs—which generate capacitance through alternating layers of ceramic dielectrics and metal electrodes—silicon capacitors align more closely with semiconductor manufacturing principles. They leverage techniques such as thin-film deposition, deep trench structures, and customized packaging to increase capacitance per unit area while minimizing parasitic inductance.

The defining characteristics of silicon capacitors are their **exceptionally low equivalent series inductance (ESL)** and their **ability to be placed in close proximity to the chip.** During high-load operations, the current demands of AI GPUs, CPUs, ASICs, and HBMs fluctuate rapidly within fractions of a second; minimizing ESL ensures the capacitor can rapidly compensate for instantaneous power demands and maintain rigorous power stability, which is precisely the core value of silicon capacitors for near-die decoupling inside the package.

A further advantage of silicon capacitors is their superior **capacitance stability** across high frequencies, temperature variations, and DC bias. In environments with high DC bias or elevated temperatures, MLCCs utilizing certain material compositions often suffer from capacitance degradation or unpredictable fluctuations. By contrast, silicon capacitors—benefiting from silicon-based thin-film dielectrics and precise semiconductor manufacturing—deliver exceptional capacitance stability and dimensional accuracy. This makes them highly suitable for applications requiring high-density mounting, rapid high-frequency response, and unwavering capacitance.

> ***Related report: [NVIDIA FY1Q27 AI Server Outlook: GB/VR Rack Leads](https://www.trendforce.com/research/download/RP260521EJ3?utm_source=tf_substack&utm_medium=post)***

## **Different Jobs, Different Layers**

**MLCCs** serve as the primary components for system-level power stability in AI servers, offering unparalleled advantages in cost, supply scale, maturity, and mass deployment. As AI servers transition into the Rubin generation, the simultaneous increases in GPU power consumption, HBM density, NVLink bandwidth, and high-speed networking chip requirements will continue to drive the expansion of MLCC usage. [TrendForce](https://www.trendforce.com/presscenter/news/20260518-13046.html) notes that while a single NVIDIA GB200 board requires approximately **6,500** MLCCs, the next-generation Rubin architecture—featuring double the TDP and significantly more complex power management—will push per-board usage to roughly **12,000** units.

**Silicon capacitors**, on the other hand, provide a high-end solution for package-level power integrity in AI accelerators, excelling in low ESL, ultra-thin profiles, high-frequency stability, and custom integration.

Depending on placement requirements, silicon capacitors can be configured in top-side, land-side, or embedded formats, and positioned alongside GPUs, CPUs, or ASICs, at the bottom of silicon interposers, or embedded within the package substrate itself. The closer the capacitor is to the die, the shorter the current loop and the lower the parasitic inductance, which is critical for suppressing transient voltage fluctuations and high-frequency noise.

The relationship between MLCCs and silicon capacitors should therefore be understood as complementarity, not substitution.

## Supply Chain Dynamics

MLCCs mainly use traditional passive component processes, dominated by established players such as Murata, SEMCO, Taiyo Yuden, and Yageo. In contrast, the silicon capacitor supply chain is more closely aligned with semiconductor processes and advanced packaging. TrendForce believes that the core competency for silicon capacitor vendors lies in their ability to co-design with AI GPU, ASIC, HBM, and packaging platforms, and to pass qualification by high-end customers. Overall, silicon capacitors carry higher entry barriers and longer customer qualification cycles, and the supply scale remains relatively limited.

## Outlook: A Dual-Track Future

The key to silicon capacitors' future growth is not to completely replace MLCCs, but to ride the rising penetration of advanced AI packaging and gradually become standard components inside GPU, ASIC, and HBM packages. However, several challenges remain, including cost and supply scale, customer validation cycles, and a high degree of design binding.

In the long term, capacitor demand in AI servers will evolve into a dual-track structure of board-level MLCCs and package-level silicon capacitors. MLCCs will continue to benefit from rising per-rack power consumption and growing demand for high-capacitance and high-voltage products, while silicon capacitors will benefit from PDN (power delivery network) upgrades inside AI accelerator packages, tighter HBM integration, and the proliferation of chiplet architectures.

> ***For a full analysis of silicon capacitor technology, supplier dynamics, and market outlook, access our report: [Power Integrity Upgrades in AI Servers: Evolving Roles of Silicon Capacitors and MLCCs.](https://www.trendforce.com/research/download/RP260611CK?utm_source=tf_substack&utm_medium=post)***

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

TrendForce 这篇把 AI 服务器里一个容易被「GPU / HBM / CPO」叙事淹没的细分赛道讲清楚了：**电源完整性（power integrity）正从 PCB 板级，沉到封装级**。当 AI 加速器进入 chiplet + HBM + 高密度先进封装时代，电流路径变长、瞬态响应变慢，「在 die 旁边放电容」从可选项变成必选项。

对站内读者而言，这篇文章补上了 [先进封装 EMIB vs CoWoS](/posts/advanced-packaging-intels-emib-vs/) 那篇没展开的一层：**封装不只是把 die 连起来，还要在物理上解决「die 要的电怎么瞬间供上」**。而硅电容（silicon capacitor）正是为此而生的近 die 去耦元件。

## 二、核心论点拆解

| 维度 | 原文要点 | 产业 / 投资含义 |
| --- | --- | --- |
| 需求重心迁移 | 电源完整性挑战从 PCB 级渗入封装级；多 die + HBM + 先进封装使每颗 die 都要独立快速去耦网络 | 板级 MLCC 电流路径过长 → 寄生电感扼杀瞬态响应，必须在封装内补近 die 电容 |
| 硅电容本质 | 半导体工艺（硅衬底 + 氧化硅/氮化硅薄膜 + 深沟槽 + 定制封装），极低 ESL、可贴 die 极近 | 高负载下瞬时补电、维持电源稳定，是封装内 near-die 去耦的核心价值 |
| 电容稳定性 | 高频 / 温变 / DC 偏置下容量稳定，不似部分 MLCC 配方会衰减漂移 | 适合高密度贴装、快速高频响应、稳定容量 |
| 分工而非替代 | MLCC = 系统级（板级）主力，成本低、规模大、成熟；硅电容 = 封装级高端方案，低 ESL、超薄、可定制 | 两者是互补关系，不是替代关系 |
| 用量锚点 | GB200 单板约 6,500 颗 MLCC；Rubin（双倍 TDP）推到约 12,000 颗 | 板级 MLCC 随机架功耗与 HBM 密度持续扩张 |
| 供应链格局 | MLCC：村田 / SEMCO（三星电机）/ 太阳诱电 / 国巨；硅电容更贴近半导体与先进封装，认证周期长、壁垒高 | 硅电容胜负手在「与 GPU/ASIC/HBM/封装平台协同设计 + 高端客户认证」 |

一句话：MLCC 守住板，硅电容进封装；**不是谁取代谁，而是随 AI 封装渗透，硅电容成为 GPU/ASIC/HBM 封装内的标准件**。

## 三、关键概念 / 技术解读

**1. 电源完整性（PI）为何下沉到封装。** 随着 GPU TDP 飙升，power shelf、VRM、DC-DC、OAM 板都需要更多 MLCC 做滤波与稳压。但多 die 架构（compute die + I/O die + NVLink I/O die + HBM + 硅 interposer + 封装基板）把系统压到极密，每个 die / 电源域都需要独立、快速响应的去耦网络。只靠板级 MLCC → 电流路径过长 → 寄生电感 → 瞬态响应被严重拖慢。解法是在封装内、die 旁就近补电容。

**2. 硅电容的技术护城河：极低 ESL + 近 die。** 硅电容用半导体工艺（薄膜沉积、深沟槽、定制封装）做单位面积高容值且寄生电感极小。AI GPU/CPU/ASIC/HBM 在高负载时电流在亚秒内剧烈波动，极小 ESL 才能瞬时补偿、维持电源稳定——这正是封装内 near-die 去耦的价值。此外它在高频、温变、DC 偏置下容量稳定，而部分 MLCC 配方在大 DC 偏置 / 高温下会衰减漂移。

**3. 贴得越近，环路越短，电感越低。** 硅电容可按 top-side / land-side / embedded 三种形态布置，贴在 GPU/CPU/ASIC 旁、硅 interposer 底部、或埋入封装基板。越近 die，电流环路越短、寄生电感越低，对抑制瞬态电压波动与高频噪声越关键。

**4. 双轨未来。** 长期看，AI 服务器电容需求演化为「板级 MLCC + 封装级硅电容」双轨：MLCC 受益于单机架功耗上升、高容值/高压需求增长；硅电容受益于 AI 加速器封装内 PDN 升级、HBM 更紧集成、chiplet 架构扩散。

## 四、与本站其他文章的链接

- [先进封装：Intel EMIB 对决台积电 CoWoS](/posts/advanced-packaging-intels-emib-vs/) —— 本文是那篇「封装内物理问题」的延伸：die 连起来之后，电源怎么瞬间供上。
- [台积电 CPO 领先、三星把第三颗芯片贴到 HBM 旁](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) —— HBM 与 compute die 同封装，正是电源完整性下沉到封装级的同一背景。

## 五、行业 / 投资意义

- **硅电容是 AI 封装渗透的「卖铲人」。** 它不取代 MLCC，而是随先进封装渗透率提升、成为 GPU/ASIC/HBM 封装内的标准件；壁垒在「与平台协同设计 + 高端客户认证」，认证周期长、供应规模有限，先发者护城河较深。
- **明确点名的方向性标的与事件**：三星电机（SEMCO，Samsung Electro-Mechanics）2026 年 5 月签下约 10 亿美元硅电容供货合同（交付至 2027–2028），并提出「硅电容 + MLCC + 封装基板」一体化捆绑战略；MLCC 传统龙头村田（Murata）、太阳诱电（Taiyo Yuden）、国巨（Yageo）继续受益于板级用量扩张（GB200 约 6,500 颗 → Rubin 约 12,000 颗）。
- **存量逻辑 vs 增量逻辑并存。** MLCC 是「量大、成熟、成本主导」的存量赛道；硅电容是「高壁垒、长认证、封装内增量」的增量赛道。双轨结构意味着两者需求曲线并不互斥，而是随机架功耗与封装密度同步上行。

## 六、风险提示

- **硅电容仍处早期渗透。** 成本与供应规模、客户验证周期、设计绑定度高，距「全面标准件」仍有距离；TrendForce 强调的是「随渗透提升逐渐成为标准件」，不是立即放量。
- **认证周期是护城河也是风险。** 高壁垒、长认证意味着一旦头部客户绑定，后来者难切入；但反过来，若 AI 封装路线（如 CPO / 面板级封装）演进改变 PDN 结构，硅电容的形态与需求也可能随之调整。
- **MLCC 的存量竞争。** 板级 MLCC 虽用量增长，但参与者多、周期性明显，容量衰减/价格周期仍是传统风险，不能把「AI 用量增长」简单等同于「盈利线性增长」。
- **本文偏产业分析、非个股推荐。** 文中 tickers / 公司名仅作产业链标注，不构成投资建议。

*以上解读基于原文信息整理，不构成投资建议。*
