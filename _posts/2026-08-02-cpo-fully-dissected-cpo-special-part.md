---
layout: post
title: "CPO, Fully Dissected [CPO Special Part 2] — CPO 全拆解（CPO 专题篇）"
date: 2026-08-02 19:05:00 +0800
categories: [半导体技术]
tags: [CPO, 光引擎, 硅光, 先进封装, 激光器]
description: "整理自 Damnang (Substack) 的 CPO 专题第二篇，逐层解剖 CPO 封装的光路、光电引擎（EIC/PIC）、调制器技术路线（MZI/MRR/EAM/TFLN）、外置激光源与封装集成，并附中文深度解读与产业链标的梳理。"
image: /assets/img/covers/cpo-fully-dissected-cpo-special-part.jpg

---

> 本文整理自 **Damnang（Substack）**，原文发布于 **Mar 19, 2026**（标题原文：*CPO, Fully Dissected [CPO Special Part 2]*）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。

---

# 第一部分：正文（Original Article）

## CPO, Fully Dissected [CPO Special Part 2]

[Damnang](https://damnang2.substack.com) · Mar 19, 2026

*Note: If you haven’t read Part 1, that’s the better place to start, especially if you’re coming from outside the field.*

## **The Flow of Light: A Quick Map**

Before diving into individual components, here’s the full picture of how light moves through a CPO system. Don’t worry if some of the terminology doesn’t land yet. Read through it once, work through the rest of the article, then come back and read this again. It’ll click.

1. An external laser generates pure, unmodulated light (CW light)
2. That light travels through a PM fiber into the PIC
3. Inside the PIC, the light is split and distributed across multiple channels
4. Each channel’s modulator encodes data onto the light, driven by electrical signals from the EIC
5. The modulated light travels along waveguides toward the coupling interface
6. It exits through the FAU into optical fiber
7. On the receiving end, the process runs in reverse: light arrives at the PIC’s photodetector and gets converted back into an electrical signal
8. The EIC’s TIA amplifies that signal
9. The host chip receives the data

## **1. Opening the CPO Package: What You’re Looking At**

The best way to understand CPO is to look down at a finished package and go through the pieces one by one. Five things stand out.

![Figure 1: Top view of a finished CPO package](https://substack-post-media.s3.amazonaws.com/public/images/5250aa62-48a5-49e9-b108-92fbe980806a_900x490.jpeg)

**The host chip (Host ASIC)** sits in the center. This is the brain of the package, the main chip everything else exists to serve. In a switch, it’s the switch ASIC. In an AI accelerator, it’s a GPU or custom AI ASIC. In a network card, it’s the NIC chip. CPO doesn’t change what the main chip is. The defining feature is simply that in a CPO package, this chip sits within a few millimeters of the optical engines.

Right now, the place in the market where CPO is most urgently needed is the scale-out network switches that connect racks to each other. Switches carry more optical ports than anything else in a datacenter, and when you have tens or hundreds of optical channels feeding into a single chip, the power and density advantages of CPO show up most dramatically. This article uses switches as the primary example, but the optical engine, laser, and PIC architecture described below is fundamentally the same whether the host chip is a GPU or a custom ASIC.

**Optical engines** are arranged around the host chip. These are the heart of CPO. An optical engine converts the host chip’s electrical signals into light for transmission, and on the receive side converts incoming light back into electrical signals for the host chip. Essentially, they do the job that pluggable optical modules on the front panel used to do, but from millimeters away instead of 15 to 30 centimeters. A single package can hold anywhere from eight to more than thirty optical engines, and each one typically handles several terabits per second of bandwidth.

Each optical engine contains an **EIC and a PIC**. The EIC is the electronic chip, handling driver circuits, TIAs, and related circuitry. The PIC is the photonic chip, handling modulators, photodetectors, and waveguides.

On the transmit side (TX): CW light from the external laser enters the PIC. The **modulator** inside the PIC, driven by signals from the EIC, imprints data onto the light by varying its intensity or phase. The modulator doesn’t generate light; it encodes information onto light that already exists.

On the receive side (RX): Incoming data-carrying light enters the PIC, where a **photodetector** converts it into electrical current. The EIC’s TIA amplifies that current into a voltage level that digital circuits can read, and that signal gets passed to the host chip.

**The external laser module** plugs into the front panel, outside the package. Lasers generate the light that everything else depends on, and CPO deliberately keeps them outside the optical engine for reasons covered below. Light from the laser module travels through specialty fiber into each optical engine’s PIC.

**Optical fiber** carries data light out of the package to the network, and brings incoming data light back in. A single optical engine connects to dozens of individual fibers, so across the whole package you’re looking at hundreds of fibers in and out.

**The package substrate** is the platform everything mounts on. The host chip, optical engines, power delivery circuits, and everything else sit on a single substrate, connected by fine copper traces. The critical point in CPO is that the electrical path between the host chip and the optical engines doesn’t cross a board. It stays inside the package, measured in millimeters. That short distance is what makes the power, signal quality, and port density improvements possible.

## **2. The Optical Engine: EIC and PIC**

The optical engine is CPO’s most critical component, and it contains two distinct chips.

**EIC: The Electronic Chip**

The EIC handles electrical signals. It takes high-speed data from the host chip and conditions it into a form that optical components can work with.

![Figure 2: EIC (Electronic IC) architecture](https://substack-post-media.s3.amazonaws.com/public/images/5f379704-db0f-4ee9-9f90-b86c80ecec6f_900x491.jpeg)

On the transmit side, driver circuits reshape the electrical signal to the right amplitude and waveform to drive the modulator. On the receive side, a TIA (Transimpedance Amplifier) takes the tiny photocurrent generated by the photodetector and amplifies it into a voltage level readable by digital logic.

*EIC designers: Broadcom, NVIDIA (in-house); Alphawave Semi (for Lightmatter’s L200, SerDes IP)*

One important point here. Conventional pluggable optical modules contain a heavy DSP chip. The reason is that electrical signals traveling 15 to 30 centimeters to the front panel get degraded significantly, and recovering those signals requires substantial computation. In CPO, the electrical path between the host chip and optical engine is only a few millimeters. Signals arrive essentially intact, so the DSP can be eliminated entirely or reduced to something far lighter. This is one of the core reasons CPO uses much less power: all the energy that used to go into signal recovery simply goes away.

**PIC: The Photonic Chip**

The PIC is where light is actually manipulated. If conventional semiconductor chips work with electrons, the PIC works with photons. Several optical components are integrated onto a single chip.

![Figure 3: PIC (Photonic IC) architecture](https://substack-post-media.s3.amazonaws.com/public/images/10699257-d28c-4212-96c3-7f460ae1e974_900x491.jpeg)

**Waveguides** are the roads light travels on inside the PIC. Just as optical fiber confines light within glass over long distances, waveguides on a PIC use silicon or silicon nitride (SiN) to confine light within channels a few hundred nanometers to a few micrometers wide, on the order of one-hundredth the width of a human hair. Every optical component on the PIC connects through these waveguides.

The choice of waveguide material matters. Silicon waveguides confine light tightly, which keeps them small, but they have somewhat higher propagation loss. SiN waveguides have lower loss but require more space. The choice of material is one of the first decisions in PIC design.

**Modulators** encode data onto light. Light arriving from the external laser is pure CW light, carrying no information. The modulator’s job is to imprint zeros and ones onto it. At its simplest, this means turning light on and off: bright for 1, dark for 0. In practice, schemes like PAM4 use four intensity levels to encode two bits per symbol. The modulator is CPO’s most consequential technical decision point, covered in its own section below.

**Photodetectors** convert light into electrical current. Where the modulator does electrical-to-optical conversion, the photodetector does the reverse. It absorbs incoming light and generates a proportional electrical current, which the EIC’s TIA then amplifies into a usable signal. Today’s silicon photonics PICs use germanium (Ge) photodetectors as the standard. Silicon itself doesn’t absorb infrared light at the telecom wavelengths used in communications (1310nm, 1550nm), but germanium does, and it can be grown on silicon substrates with good compatibility. Ge photodetectors are fabricated as part of the PIC process at foundries like TSMC, GlobalFoundries, and Tower Semiconductor.

![Figure 4: Germanium photodetector on a silicon photonics PIC](https://substack-post-media.s3.amazonaws.com/public/images/7e3a315a-4ea7-4858-8963-4af60d841932_900x491.jpeg)

**MUX/DEMUX components** combine and separate light of different wavelengths. To send more data over a single fiber, you can generate light at multiple wavelengths simultaneously, load different data onto each, and send them all down the same fiber at once. This is WDM, Wavelength Division Multiplexing. Think of it like radio: FM 88.1 and FM 91.5 travel through the same air simultaneously without interfering with each other. The multiplexer (MUX) combines multiple wavelengths on the transmit side; the demultiplexer (DEMUX) separates them on the receive side.

There are two main WDM variants. CWDM (Coarse WDM) spaces wavelengths about 20nm apart, which keeps components simple and temperature-tolerant, but limits the fiber to four to eight wavelengths. DWDM (Dense WDM) packs wavelengths within a few nanometers of each other, supporting sixteen or more wavelengths per fiber, but demands much tighter temperature control and component precision.

**Fiber coupling interfaces** are where light exits the PIC into external fiber, or enters the PIC from external fiber. This is trickier than it sounds. A PIC waveguide is a few hundred nanometers wide. A single-mode fiber core is about 9 micrometers in diameter, roughly thirty times larger. Bridging that size mismatch without losing light is the central challenge of coupling.

Two approaches exist. Edge coupling sends light horizontally out of the chip’s side. A spot size converter at the chip’s edge gradually expands the optical mode to match the fiber. It’s reliable and low-loss, but you can only couple at the chip’s perimeter, which limits how many fibers you can connect. Surface grating coupling deflects light vertically out of the chip’s top surface. It’s more flexible spatially, since you can place coupling points anywhere on the surface, but tends to have somewhat higher loss.

**FAUs (Fiber Array Units)** are precision-aligned assemblies that attach multiple fibers to the PIC simultaneously. A single optical engine connects to dozens of fibers, and every one of them needs to be aligned to its coupling point on the PIC to within a micrometer. Even a small misalignment bleeds light and degrades performance. FAU alignment precision and the stability of the attachment process are among the most critical factors determining CPO manufacturing yield.

*PIC designers/manufacturers: Broadcom, NVIDIA, Lightmatter, Ayar Labs, Celestial AI (acquired by Marvell), POET Technologies*

*PIC foundries: TSMC (COUPE), GlobalFoundries (GF Fotonix), Tower Semiconductor*

## **3. Modulators: The Most Important Technical Fork in the Road**

The choice of modulator is where CPO companies diverge most sharply from each other. Two approaches dominate today, with two more on the horizon as next-generation candidates.

![Figure 5: Modulator technology comparison — MZI, MRR, EAM, and TFLN](https://substack-post-media.s3.amazonaws.com/public/images/01ae6876-2445-4b20-b9fe-e8cf0ab71245_900x491.jpeg)

MZI (Mach-Zehnder Interferometer) Modulator

This is the most conceptually straightforward approach. Light entering the modulator gets split into two paths. An electrical signal shifts the phase of light in one path. When the two paths recombine, they either reinforce each other (producing bright light, representing 1) or cancel each other out (producing darkness, representing 0).

A useful analogy: imagine sending two waves across a pool. When the waves meet in phase, they add together into a larger wave. When they meet out of phase, they cancel each other and the water goes still. MZI modulation works the same way with light.

The strengths are thermal stability and a long track record. Temperature variation in a datacenter doesn’t meaningfully affect MZI performance. The technology has nearly four decades of validation in the telecom industry. It also handles complex modulation formats like PAM4 well, because its response is highly linear.

The weakness is size. Creating enough phase shift requires waveguide arms several millimeters long, which consumes substantial PIC area. More area per modulator means fewer channels per PIC, which limits the bandwidth density per optical engine.

*MZI adopters: Broadcom (Bailly, Davisson)*

MRR (Micro-Ring Resonator) Modulator

A micro-ring resonator is a tiny circular waveguide, typically five to ten micrometers in diameter. At a specific resonant wavelength, light gets trapped in the ring. An electrical signal shifts the resonance condition slightly, toggling the ring between trapping light (0) and allowing it to pass (1).

Think of a guitar string. It resonates at a specific frequency determined by its physical properties. Change those properties slightly and you shift the resonance. MRR modulators work on exactly that principle, but with light instead of sound.

The size advantage is substantial. An MRR is less than one-tenth the footprint of an MZI modulator. Far more channels fit on the same PIC area. MRRs also require lower drive voltages, which reduces power consumption, and because each ring is inherently wavelength-selective, it doubles as a filter for WDM applications, eliminating the need for a separate multiplexer.

The problem is thermal sensitivity. A one-degree temperature change shifts the resonant wavelength by roughly 0.1nm. That’s enough to detune the ring and break modulation entirely. The solution is to attach a micro-heater to each ring for real-time thermal compensation. As channel counts grow, so does the number of heaters and the power they consume, which partially offsets the MRR’s efficiency advantage. Maintaining precise thermal control of hundreds of tiny rings sitting next to a host chip dissipating several hundred watts is a genuinely hard engineering problem.

MRR-based CPO switches are now entering production. In GPU-level CPO specifically, MRR’s small footprint is nearly mandatory. GPU packages are already densely packed with HBM, leaving almost no room for optical engines. Only something as compact as an MRR can fit.

*MRR adopters: NVIDIA (Quantum-X, Spectrum-X Photonics), Lightmatter (Passage)*

Next-Generation Candidates: EAM and TFLN

**EAM (Electro-Absorption Modulator)** changes a material’s light absorption coefficient directly in response to an electrical signal, toggling between transmitting and absorbing light. It offers better thermal tolerance than MRR while still achieving reasonable density, and it avoids MZI’s size problem.

*EAM development: Celestial AI (acquired by Marvell, building on Rockley Photonics IP)*

**TFLN (Thin-Film Lithium Niobate) Modulator** replaces silicon with lithium niobate thin film as the active material. Lithium niobate has a far stronger electro-optic response than silicon, enabling fast, efficient modulation in a compact footprint with excellent thermal stability. It hasn’t reached volume production yet, but it’s the most credible candidate for 400G-per-lane and beyond, where MZI and MRR both hit their limits.

*TFLN development: POET Technologies in collaboration with QCi (Quantum Computing Inc.), targeting second half of 2026*

**Why does the modulator choice matter this much?** Because it determines PIC area, power consumption, thermal management complexity, WDM implementation approach, and ultimate bandwidth scalability, all at once. MZI’s stability suits environments where thermal management is tractable, like switches. MRR’s density suits environments where space is the binding constraint and thermals are severe, like GPU packages. The modulator choice tells you exactly what market a company is targeting and how they plan to get there.

## **4. The External Laser: Why Keep the Light Source Outside**

Every CPO system needs a laser to generate light. In most implementations, that laser lives outside the optical engine, in a replaceable module on the front panel, rather than inside the package. This is called an ELS, External Laser Source.

Three reasons drive this design decision.

![Figure 6: External Laser Source (ELS) module on the front panel](https://substack-post-media.s3.amazonaws.com/public/images/e6dd2cf2-15f7-4230-9674-656fa31940ab_900x491.jpeg)

**Thermal isolation.** Laser diodes are extremely sensitive to temperature. Heat increases their output wavelength, reduces efficiency, and dramatically shortens lifespan. The host chip produces hundreds of watts of heat during operation. Placing a laser next to that heat source degrades it rapidly. Putting the laser on the front panel and delivering only light via fiber neatly separates the laser from the thermal environment.

**Repairability.** Laser diodes have shorter service lives than most semiconductor components. An external module can be replaced without touching the rest of the package. Modern CPO products make laser modules field-replaceable from the front panel, and typically include redundant laser sources within each module so that if one fails, the remaining sources compensate for the loss.

**Manufacturing yield.** High-quality telecom lasers are made from InP (indium phosphide) and other III-V compound semiconductors, which are entirely different materials from silicon and require different fabrication processes. Integrating lasers directly into a silicon PIC means combining two incompatible material systems, which makes the process enormously complex and kills yield. Fabricating them separately and optimizing each independently is far more practical.

Light from the external laser arrives at the PIC as CW light, pure and unmodulated. It enters through a PM (polarization-maintaining) fiber, gets distributed across multiple channels inside the PIC, and feeds into the modulators, which stamp data onto it before sending it out.

A typical CPO switch system uses around 16 to 18 laser modules, collectively supplying light to hundreds of optical channels.

Laser supply is one of the most significant bottlenecks in the CPO ecosystem. Only a small number of companies worldwide can manufacture telecom-grade InP lasers at scale, and CPO adoption will create an enormous surge in demand.

*InP laser diode manufacturers: Lumentum, Coherent, Sivers Semiconductors*

*ELS module packaging: Lumentum, Coherent (in-house ELSFP); POET Technologies (Starlight, wafer-level packaging via Optical Interposer)*

## **5. Packaging: Assembling All of This Into One System**

Packaging is how all the components described above, the host chip, optical engines (EIC and PIC), external laser modules, and fiber, get physically integrated into a working system. It helps to think about packaging in two stages.

![Figure 7: Two-stage CPO packaging — EIC/PIC integration and host package assembly](https://substack-post-media.s3.amazonaws.com/public/images/d2df124c-d6b0-4142-833c-908be262ab7c_900x491.jpeg)

**Stage 1: Assembling the Optical Engine (EIC + PIC Integration)**

Two approaches exist for combining the EIC and PIC.

**2.5D integration** places both chips side by side on a common substrate, connected by traces on that substrate. Thermal management is simpler and the fabrication process is less demanding, but the configuration takes up more area and the electrical path between the two chips is longer.

**3D stacking** places the EIC directly on top of (or beneath) the PIC, connected vertically through micro-bumps or hybrid bonding, a technique that joins chips at the atomic level. The footprint shrinks dramatically and the inter-chip electrical path drops to tens of micrometers. The tradeoff is that heat from both chips overlaps, making thermal management harder, and the process is significantly more complex.

The industry is moving toward 3D stacking. EICs with hundreds of millions of transistors stacked directly on top of PICs are now entering volume production.

**Stage 2: Integrating Optical Engines Into the Host Chip Package**

Separately from how EIC and PIC are combined inside an optical engine, there’s the question of how finished optical engines get positioned relative to the host chip.

The most common configuration places the host chip at the center of an organic substrate with optical engines arranged around it. Short substrate traces connect the host chip to each engine. Fiber exits the PIC via edge coupling at the package periphery.

Within this configuration, some designs permanently bond the optical engines to the substrate, while others use detachable module formats (OSAs, or Optical Sub-Assemblies). Permanent bonding yields a more compact package with optimized electrical paths, but if an optical engine fails, the entire package has to be replaced. Detachable modules allow field replacement, but add connectors and interface complexity that consume space. The right choice depends on what datacenter operators prioritize: density or maintainability.

Current CPO package dimensions run roughly 75mm x 75mm to 120mm x 120mm depending on the switch generation. With eight to sixteen or more optical engines per package, each handling several terabits per second, total package bandwidth reaches tens to over one hundred terabits per second.

**Why Packaging Capability Is a Strategic Asset**

CPO packaging requires a fundamentally different skill set than conventional semiconductor packaging. Standard packaging is purely an electrical problem. CPO packaging simultaneously demands precise fiber alignment, preservation of the PIC’s optical characteristics, and thermal management of the laser light source. The number of foundries and packaging houses that can actually deliver all of this is small, and that scarcity is exactly why packaging and foundry capability functions as a strategic moat in the CPO ecosystem.

The industry is gravitating toward integrated platforms that handle PIC fabrication, EIC-PIC 3D stacking, and full package integration under one roof. Companies building on such platforms avoid the complexity of coordinating separate foundry and packaging vendors, which compresses development timelines and cuts cost.

*Integrated platform: TSMC COUPE (adopted by NVIDIA, Broadcom, Ayar Labs)*

Some foundries also offer monolithic silicon photonics processes that integrate electronic and optical components on a single chip within the same fabrication run. This eliminates the need for separate EIC and PIC chips entirely, though the tradeoff is that these processes don’t support leading-edge logic nodes like 3nm or 5nm.

*Monolithic platform: GlobalFoundries GF Fotonix (used for Lightmatter Passage)*

*Test and verification equipment: Keysight Technologies*

*Photonic EDA tools: Synopsys, Cadence, Ansys (Lumerical)*

## **Conclusion**

That’s everything visible when you open a CPO package. To put it plainly, CPO is not a single breakthrough component. It’s a precision integration of many technologies working in concert. The host chip’s SerDes generates high-speed electrical signals. The EIC translates those signals into a form optical components can use. The PIC’s modulator encodes data onto laser light. The photodetector converts received light back into electricity. And all of it gets assembled into a single package through micrometer-precision fiber alignment and thermal management that has to work reliably at datacenter scale. Pull out any one piece, or let any one piece fall below spec, and nothing works.

This is also why no single company can own CPO entirely. The modulator alone splits into four technical camps: MZI, MRR, EAM, and TFLN. The laser requires a completely different material system from the rest of the package. Packaging demands capabilities that span both electrical and optical engineering. Who controls which pieces of this puzzle will ultimately determine who wins in the CPO era.

Part 3 covers where this architecture goes beyond switches, and why each step of that expansion gets progressively harder to pull off.

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

Damnang 这篇《CPO, Fully Dissected [CPO Special Part 2]》是 CPO 专题的第二篇，定位非常清晰：它不谈市场热度，也不预测出货量，而是把一颗 CPO（Co-Packaged Optics，共封装光学）封装"打开盖子"逐层解剖——从光在系统里怎么走，到主机芯片、光电引擎（EIC/PIC）、调制器、外置激光源、封装集成，最后落到"为什么没有哪家公司能单独吃下 CPO"。

对中文读者（尤其是半导体/光通信投资者与工程师）而言，这篇文章的价值在于它把 CPO 从一句口号还原成**一组具体的工程权衡**：短距离电信号传输（毫米级）为什么能砍掉 DSP、MZI 与 MRR 两种调制器为什么分别适配交换机与 GPU、InP 激光源为什么要放在封装外面、3D 堆叠与 2.5D 集成各自牺牲了什么。这些权衡恰恰是决定产业链谁有护城河、谁会被淘汰的关键。

它与本站的 CPO 系列高度互补：本站已有《The Illusion of CPO（CPO 专题终篇）》对 CPO 叙事的解构、对激光与 NPO/CPO 瓶颈的讨论，以及对测试瓶颈的专门拆解。本文正好补齐"封装内部到底由哪些部件构成、每个部件由谁做"这一环，建议对照阅读。

## 二、核心论点拆解

文章的主线可以压缩成一句话：**CPO 不是单一器件突破，而是多种技术在同一封装内的精密集成，因此任何单一环节的掉链子都会让整颗封装失效，也就没有谁能通吃全栈。**

关键子论点如下：

| 层级 | 核心主张 | 关键数字 / 事实 | 投资含义 |
|------|----------|----------------|----------|
| 系统光路 | 光由外置激光产生→PM 光纤入 PIC→调制→FAU 出光纤；接收端反向 | 9 步完整链路 | 外置激光 + 光纤耦合是独立供应链 |
| 主机芯片 | CPO 不改变主芯片，只是让它离光引擎只有几毫米 | 电信号路径从 15–30cm 缩到毫米级 | 可省掉/大幅简化 DSP |
| 光电引擎 | 每引擎含 EIC（电）+ PIC（光），单包 8–30+ 引擎，每引擎数 Tbps | 整包带宽 tens 至 >100 Tbps | 引擎数量与良率决定成本 |
| 调制器 | MZI / MRR 当前主流，EAM / TFLN 为下一代 | 1°C 漂移使 MRR 谐振漂移 ~0.1nm；MRR 面积 < MZI 的 1/10 | 技术路线站队决定目标市场 |
| 外置激光 | 热隔离 + 可维修 + 良率（InP 与硅不兼容）三大理由 | 单交换机系统 ~16–18 个激光模块 | InP 激光是生态最大瓶颈之一 |
| 封装 | 2.5D vs 3D 堆叠；引擎相对主芯片的永久键合 vs 可插拔 OSA | 封装尺寸约 75×75mm 至 120×120mm | 能"一屋端"的平台型厂商有护城河 |

文章最有信息量的一句判断是：**调制器的选择同时决定了 PIC 面积、功耗、热管理复杂度、WDM 实现方式与带宽可扩展性**。换言之，看一家 CPO 公司选哪种调制器，就能反推它在打哪个市场、用什么路径取胜。

## 三、关键概念 / 技术解读

**1. 短距离电信号为何能"干掉 DSP"**
传统可插拔光模块要把电信号送 15–30 厘米到前面板，信号严重劣化，必须用重型 DSP 做恢复。CPO 把电光转换搬到离主芯片几毫米处，信号基本无损到达，于是 DSP 可整体去除或极度瘦身。这是 CPO 省电的核心来源之一——省下的正是原先全部用于信号恢复的能量。注意：这与本站的《CPO 最大瓶颈：高良率测试》讨论形成张力——省掉 DSP 是系统级省电，但 CPO 的良率/测试成本反而更高。

**2. 调制器四条技术路线**
- **MZI（马赫-曾德尔干涉仪）**：靠两臂相位差干涉实现亮/暗。热稳定、近 40 年电信验证、PAM4 线性度好；缺点是波导臂需数毫米长，占 PIC 面积大、通道密度低。代表：Broadcom（Bailly、Davisson）。适配热管理可控的交换机场景。
- **MRR（微环谐振器）**：直径 5–10 微米的小环，靠谐振陷光/放光切换。面积 < MZI 的 1/10，驱动电压低、天然波长选择性（可兼作 WDM 滤波器）。致命弱点是温敏：1°C 漂移约 0.1nm，需每环配微加热器实时补偿，数百个环贴着数百瓦主芯片做精密热控是真正的工程难题。代表：NVIDIA（Quantum-X、Spectrum-X Photonics）、Lightmatter（Passage）。GPU 级 CPO 因 HBM 挤占空间，MRR 几乎是必选项。
- **EAM（电吸收调制器）**：直接改材料吸收系数切换通/阻光，热容忍优于 MRR、密度尚可、避免 MZI 的大尺寸。代表：Celestial AI（被 Marvell 收购，基于 Rockley Photonics IP）。
- **TFLN（薄膜铌酸锂）**：用铌酸锂薄膜替代硅，电光响应远强于硅，紧凑、热稳定，是 400G/通道及以上最可信候选，但尚无量产。代表：POET Technologies 与 QCi 合作，目标 2026 下半年。

**3. 外置激光源（ELS）为何在封装外**
三个理由：① 激光二极管极怕热（主芯片数百瓦热量会快速劣化激光、缩短寿命），放到前面板只送光进光纤即可热隔离；② 激光寿命短于多数半导体，前面板可现场更换且模块内通常冗余；③ 电信级激光用 InP 等 III-V 化合物半导体，与硅工艺不兼容，集成进 PIC 会极大拉低良率，分开设厂各自优化更现实。典型交换机系统约 16–18 个激光模块，供数百个光通道。

**4. 封装两段论**
Stage 1 是引擎内部 EIC/PIC 组合：2.5D（并排、热管好但占面积、芯片间电距长）vs 3D 堆叠（EIC 叠在 PIC 上，微凸点或混合键合，电距缩到数十微米、面积骤减，但两芯片热叠加、工艺极复杂）——行业正转向 3D 堆叠，数亿晶体管 EIC 直接叠 PIC 已进入量产。Stage 2 是引擎相对主芯片的排布：常见为主芯片居中、引擎环绕、边缘耦合出光纤；又可分永久键合（更紧凑，但引擎坏了整包报废）与可插拔 OSA（可现场换，但增连接器与复杂度）。取舍本质是"密度 vs 可维护性"。

**5. 良率命门：FAU 与耦合**
PIC 波导宽数百纳米，而单模光纤芯径约 9 微米（约 30 倍差距），跨尺寸低损耦合是耦合核心难题。边缘耦合可靠低损但只能沿周界；表面光栅耦合空间灵活但损耗偏高。FAU（光纤阵列单元）要把数十根光纤每根对到微米级精度，稍有偏斜就漏光、掉性能——FAU 对位精度与贴装稳定性是 CPO 制造良率最关键的因子之一。

## 四、与本站其他 CPO / 硅光系列文章的链接

- [The Illusion of CPO（CPO 专题终篇）](/posts/the-illusion-of-cpo-cpo-special-final/)：同一作者的 CPO 专题姊妹篇，对"CPO 叙事"做解构，建议与本文对照看"部件构成"与"叙事风险"。
- [CPO 最大瓶颈：高良率测试](/posts/cpo-biggest-bottleneck-high-volume-testing/)：本文强调 FAU 对位与 3D 堆叠是良率命门，该文进一步展开测试与量产的 bottleneck。
- [硅光链路预算与光非理想性](/posts/silicon-photonics-link-budget-and-optical-nonidealities/)：本文提到的波导损耗、耦合损耗、温漂，在该文有更系统的链路预算框架。
- [NPO/CPO 激光器（一）：InP 基础](/posts/lasers-for-cponpo-part-1-the-inp/)：本文点明 InP 激光是生态最大瓶颈，该文详解 InP 材料与激光原理。
- [NPO/CPO 激光器（二）：Lumentum 的技术与护城河](/posts/lasers-for-cponpo-part-2-lumentums-tech-and-moat/)：本文列出的 InP 激光厂商 Lumentum / Coherent / Sivers，该文聚焦 Lumentum 的 moat。
- [共封装光学入门（光学校本 第三篇）](/posts/optics-primer-part-3-co-packaged/)：对 co-packaged optics 的基础铺垫，适合在本文之前打底。
- [TSMC 在 CPO 领先，三星第三颗芯片](/posts/tsmc-ahead-in-cpo-samsung-third-chip/)：本文多次提到 TSMC COUPE 平台（NVIDIA、Broadcom、Ayar Labs 采用），该文展开代工格局。

## 五、投资意义

按文中明确点名的公司与平台，可梳理出几条清晰的投资线索：

- **平台/代工型（最强护城河）**：TSMC COUPE 被 NVIDIA、Broadcom、Ayar Labs 采用，是"PIC 制造 + EIC-PIC 3D 堆叠 + 整包集成"一屋端平台的代表；GlobalFoundries GF Fotonix 提供单片硅光（用于 Lightmatter Passage），但代价是不支持 3nm/5nm 先进逻辑节点；Tower Semiconductor 亦是 PIC 代工方。能"一屋端"的整合平台压缩开发周期、降本，是生态稀缺资源。
- **EIC / PIC 设计**：Broadcom、NVIDIA（自研）、Lightmatter、Ayar Labs、Celestial AI（Marvell）、POET Technologies；EIC SerDes IP 侧 Alphawave Semi 供货 Lightmatter L200。Broadcom 的 Bailly/Davisson 走 MZI 路线，NVIDIA 的 Quantum-X / Spectrum-X Photonics 走 MRR 路线，路线站队本身就是判断其目标市场（交换机 vs GPU）的钥匙。
- **InP 激光（供给瓶颈，最值得重视）**：文中明确 Lumentum、Coherent、Sivers Semiconductors 是少数能规模量产电信级 InP 激光的厂商，POET（Starlight，晶圆级 Optical Interposer 封装）也做 ELS 模块。CPO 放量将带来 InP 激光需求暴增，供给端高度集中 → 议价权与涨价弹性值得跟踪。
- **设备与 EDA**：测试验证 Keysight；光子 EDA Synopsys、Cadence、Ansys（Lumerical）。这些是 CPO 从样品到量产的"卖水人"。

一句话：本文把 CPO 的"价值分布"摊开——主芯片（NVIDIA/Broadcom 等）与平台代工（TSMC/GF）吃集成红利，而最稀缺、最可能被"卡脖子"的却是**外置 InP 激光供给**与**能搞定 FAU 对位/3D 堆叠的封装良率**。

## 六、风险提示

- **技术路线分化风险**：调制器 MZI/MRR/EAM/TFLN 四路并进，最终哪一路线在 400G/通道及以上胜出未定；押错路线（如过早重仓尚未量产的 TFLN）存在技术替代风险。
- **良率与量产风险**：3D 堆叠、FAU 微米级对位、数百环热控都是量产难题，本文坦诚"任一片低于规格，整机即失效"——这意味着 CPO 放量节奏可能慢于市场预期。
- **供给瓶颈外溢**：InP 激光高度集中且扩产周期长，若需求暴增而供给受限，可能反过来制约 CPO 整机出货，利好激光厂但拖累系统厂。
- **可维修性权衡**：永久键合虽紧凑，但单引擎失效即整包报废，若数据中心更看重可维护性而选可插拔 OSA，则封装形态与成本结构会改变。
- **信息时效**：本文为 2026-03-19 发布，所列厂商路线与产品节点（如 POET/QCi 的 TFLN 目标 2026 下半年）会随时间变化，需以最新公告为准。

*以上解读基于原文信息整理，不构成投资建议。*
