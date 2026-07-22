---
layout: post
title: "Lasers for CPO/NPO: Part 2 – Lumentum's Technology and Moat — CPO/NPO 激光器（二）：Lumentum 的技术与护城河"
date: 2026-07-22 21:20:00 +0800
categories: [半导体投资]
tags: [半导体, CPO, 光通信, 激光器, Lumentum, InP, 硅光, 护城河]
description: "整理自 Viks Newsletter：CPO 超高功率(UHP) CW 激光器系列第 2 篇（判词篇）。市场 FUD 说 Lumentum 领先却少有人讲清工程难点与护城河。免费段拆『重新展宽(re-broadening)』两大机制（空间烧孔 + MQW 随机复合相位噪声），并给出 κL≈0.7 的甜点（相位平坦度覆盖近 200°）。真正的腔长工程、可靠性、模态稳定与『护城河不在 UHP 设计本身』的判词位于付费墙之后。英文原文（免费公开部分）+ 中文深度解读。"
---

> 本文整理自 [Viks Newsletter](https://www.viksnewsletter.com/p/lasers-for-cponpo-part-2-lumentums-tech-and-moat)（Substack）的付费技术专栏，原文发布于 **2026-07-22**（作者署名为 Viks / SemiExponent）。
> 标题原文：*Lasers for CPO/NPO: Part 2 – Lumentum's Technology and Moat*。本文为**系列第 2 篇（判词篇）**，承接 [Part 1 – The InP DFB Laser](/posts/lasers-for-cponpo-part-1-the-inp/)。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> ⚠️ 本文来源标注为**付费可单篇购买**文章。jina 抓取的公开免费部分涵盖引言、市场 FUD、两篇参考论文（2007 JDS Uniphase / 2022 CLEO）、"Contents"目录、以及"重新展宽"问题（两大机制 + κL≈0.7 甜点）；后续 **Suppressing Re-Broadening 工程细节、精确腔长设计、长腔利弊（可靠性/模态稳定）、"护城河不在 UHP 设计本身"的判词** 等核心章节位于付费墙之后（正文止于 "How do we choose?"），**本发布未包含任何付费内容**。作者明确声明本文纯技术拆解、"非 Lumentum 投资建议"。

---

# 第一部分：正文（Original Article）

## Lasers for CPO/NPO: Part 2 – Lumentum's Technology and Moat

[Viks Newsletter](https://www.viksnewsletter.com/p/lasers-for-cponpo-part-2-lumentums-tech-and-moat) · Jul 22, 2026

In this series on UHP lasers for CPO/NPO, our purpose is to carefully dissect the technology to understand how it works, where the engineering difficulty lies, what architectural options exist, and deeply understand where the technology differentiation and moat actually lies for key industry players. If you want to understand why these external lasers are needed, see [Part 1](/posts/lasers-for-cponpo-part-1-the-inp/).

> **← 系列第 1 篇**：[Lasers for CPO/NPO: Part 1 – The InP DFB Laser](/posts/lasers-for-cponpo-part-1-the-inp/)
> ![Lasers for CPO/NPO: Part 1 – The InP DFB Laser](https://substack-post-media.s3.amazonaws.com/public/images/a4fb909d-81b1-47be-b7b3-8be6119647a8_1024x559.png)

There is a lot of FUD in the market about ultra high power (UHP) lasers for CPO and who the leading provider is in this segment. Everybody I've asked about UHP lasers unequivocally says Lumentum is in the lead, but few are able to discuss the engineering challenges in making UHP lasers, where the Lumentum advantage lies (if it even exists), and what the real alligator-filled moat is that keeps competitors out.

In Part 2, we will explore exactly how Lumentum overcame these challenges via their [2007 paper as JDS Uniphase](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/6485/64850G/Very-high-power-1310nm-InP-single-mode-distributed-feed-back/10.1117/12.701321.short), and via their later [2022 CLEO paper](https://www.lumentum.com/sites/default/files/2025-12/high_power_cw_laser_for_co-packaged_optics_2022.pdf) on UHP lasers. We will touch on reliability and single mode operation, and dig into how defensible their UHP laser platform is, including what it means for the competition.

**Contents:**

- **Suppressing Re-Broadening for sub-MHz Linewidth**: How to choose the key design parameter that makes UHP lasers work
- **Precisely Engineering the Cavity Length**: Are longer lasers necessarily worse? How do laser designers choose the laser cavity length?
- **Pros and Cons for Longer Cavity Length**: What does cavity length help with, and what it means for reliability and mode-stability
- **The Moat isn't the UHP Laser design**: The engineering mindset is to out-design the competition in UHP lasers, but reality is different: is it good enough?

Even in 2007, Lumentum (then JDSU) realized that increasing the output power of a DFB past a few 10s of milliwatts resulted in the laser linewidth getting broader than 1 MHz even if the "Schawlow-Townes-Henry" equation predicts that it should get narrower as the laser power is increased (explained in part 1). Good lasers should have narrow linewidth because the transmission of an optical pulse on an optical fiber broadens the pulse anyway; no need to have that problem at the source.

![Pulse broadens as power gets higher. Source: Gemini, for conceptual purposes only.](https://substack-post-media.s3.amazonaws.com/public/images/b8ed4f21-8b27-4386-9b39-098ac97ef617_1024x559.png)

They explain that there were two things causing this:

1. With so much optical power in the laser, photons are not distributed uniformly in the physical structure under the DFB grating. We explained this effect as spatial hole burning in part 1. This non-uniformity also causes a non-uniform refractive index, which in turn makes the linewidth broaden.

2. Within the InP multiple quantum well (MQW, where electricity is converted to light), there are random charge recombinations always occurring. This added to the "phase noise" of the system and also caused linewidth to broaden.

The former mechanism was more dominant, but the latter is significant enough to not be ignored. It was already known through other published work at the time that the easiest way to avoid re-broadening is to make the cavity length (L) longer. This generally helps distribute the photons in the cavity more evenly and keep the refractive index as even as possible under the DFB grating.

But it is not quite as simple as just increasing length because how evenly the photons are distributed depends on the DFB grating design. In part 1, we explained how there is a quantity κ – the grating's reflection strength per unit length – combined with the length of cavity L, determines how evenly the photons are distributed.

As a recap from part 1:

> **κL is the key knob that decides how light is distributed along the chip**.
>
> - If the κL is too low, then light spreads out and leaks towards the ends. Insufficient feedback to hold the light in the channel evenly, and wavelength selection is weak.
> - If κL is too high, then light gets trapped and piles up in the middle of the chip and causes spatial hole burning.

Engineering the right UHP laser now came down to picking the right cavity length L, for a given grating reflection strength κ set by the grating design. There is a goldilocks range for κL where the photon field was the flattest – which JDSU determined to be 0.7. Look at the pink lines in the graphs below, for different phases of the optical signal. κL=0.7 provides a flatness over nearly 200 degrees of phase – much better than κL=0.5 or κL=1.

Now that κL is set, the crux of the problem is that both κ and L are design parameters that can be chosen to keep κL=0.7. How do we choose?

---

*⚠️ 以下为正文付费墙之后的内容（Subsections：Suppressing Re-Broadening 工程细节 / Precisely Engineering the Cavity Length / Pros and Cons for Longer Cavity Length / The Moat isn't the UHP Laser design）。jina 仅返回至上方 "How do we choose?" 处的免费预览，本发布未包含任何付费内容。*

---

# 第二部分：解析（深度解读）

## 核心论点摘要

Part 2 是系列里"揭晓护城河"的一篇——Part 1 把判词留到了这里。开头点出市场的 FUD：人人都说 **Lumentum 在 UHP（超高功率）激光器领先**，但没人能讲清三件事——工程难点到底在哪、Lumentum 的优势是否真实存在、真正把对手挡在门外的"鳄鱼潭(alligator-filled moat)"有多深。Viks 用两篇论文做解剖刀：**[2007 JDS Uniphase 论文](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/6485/64850G/Very-high-power-1310nm-InP-single-mode-distributed-feed-back/10.1117/12.701321.short)**（Lumentum 前身）与 **[2022 CLEO 论文](https://www.lumentum.com/sites/default/files/2025-12/high_power_cw_laser_for_co-packaged_optics_2022.pdf)**。

免费段交代了"**重新展宽(re-broadening)**"问题：把 DFB 输出功率推过几十 mW 后，线宽反而变宽、超过 1 MHz——这违背了 Schawlow-Townes-Henry 方程的预测（"功率越高线宽越窄"）。两个成因：① 高功率下光子在 DFB 光栅下方分布不均，即 Part 1 讲的**空间烧孔(spatial hole burning)**，造成折射率不均匀 → 线宽展宽；② InP **多量子阱(MQW)** 内持续发生随机电荷复合，给系统叠加"相位噪声" → 线宽展宽。前者主导、后者亦不可忽略。主流解法是**加长腔长 L**（让光子分布更均匀、折射率更平），但 L 与光栅强度 κ 共同决定 κL，而 κL 才是控制光沿芯片分布的旋钮——JDSU 找到的"甜点"是 **κL≈0.7**（相位平坦度覆盖近 200°，远优于 0.5 或 1）。

免费段止于"κ 和 L 都能调、怎么选？"——真正的**腔长工程、可靠性、模态稳定**，以及"**护城河不在 UHP 设计本身**"的判词，全在付费墙后。

## 关键概念解读

- **重新展宽(re-broadening)**：高功率下线宽不降反升的反常现象。根源是"功率越高 → 光子分布越不均 → 空间烧孔 → 有效折射率畸变 → 线宽展宽"，再叠加 MQW 随机复合带来的相位噪声。这直接威胁 CPO 对窄线宽的要求（光纤传输本身就会展宽脉冲，源头不该再添一层）。
- **空间烧孔(spatial hole burning)**：高功率时增益区光子密度沿轴向不均，局部"烧"出增益凹陷，破坏单模与线宽——是 UHP 激光器"四道墙"之一（Part 1 已铺垫）。
- **κL 旋钮**：κ = 光栅单位长度反射强度，L = 腔长。κL 决定光场沿芯片的平坦度。太低 → 光漏向两端、选模弱；太高 → 光堆积在中间 → 空间烧孔。JDSU 的甜点 **κL≈0.7**，使相位平坦度覆盖近 200°。
- **为什么加长 L**：更长腔长让光子分布更均匀、折射率更平，缓减 re-broadening；但"长腔"并非越长越好——可靠性、模态稳定、取光效率的利弊权衡在付费段展开（Part 1 的"四道墙"在此交汇：热 / 线宽展宽 / 取光 / 灾难性光损伤）。

## 投资逻辑（与本站的连接）

这篇文章是本站 CPO 光源侧叙事的**关键一环**——它试图回答 Part 1 埋下的"谁领先、护城河多深"：

- [《Lasers for CPO/NPO: Part 1 – InP DFB 激光器》](/posts/lasers-for-cponpo-part-1-the-inp/)：本文即 Part 1 承诺的"判词篇"。Part 1 铺了四道墙与 κL 伏笔，本文从 κL≈0.7 接着往下走——两篇应连读。
- [《TSMC 领先 CPO / 三星第三颗芯片》](/posts/tsmc-ahead-in-cpo-samsung-third-chip/)：封装内光 I/O 需要稳定、高功率、窄线宽的 UHP CW 光源，本文主角（Lumentum 的 DFB）正是其最上游。
- [《CPO 测试瓶颈》](/posts/the-100-second-bottleneck-behind-nvidia-cpo/)：Lumentum 的 UHP 激光良率/线宽直接决定 CPO 光引擎的可测性与测试栈卡位。
- [《光测试赛道》](/posts/why-you-should-be-watching-optical-test/)：量产前，光源与光引擎的良率爬坡是测试设备最先兑现收入的环节。
- 一句话：Part 1 已论证 Lumentum 的"领先"是 20 年 DFB 工艺积累的物理结果；Part 2 本应回答"这个领先能否被复制"——但**答案（护城河深度判词）在付费墙后，本发布无法给出实证**，请勿据此做单向押注。

## 风险提示

- 本文为**付费技术专栏的免费预览段**，止于 "How do we choose?"（κL≈0.7 设定处）。**Suppressing Re-Broadening 工程细节、精确腔长设计、长腔利弊（可靠性/模态稳定）、"护城河不在 UHP 设计本身"的判词** 均位于付费墙之后，本发布**未含任何付费内容**。
- 作者明确声明：本文为纯第一性原理技术拆解，"**非对 Lumentum 的投资背书**"，读者需自行研究。
- 原文发布于 **2026-07-22**（与本站发布同日）；文中引用的 2007 JDS Uniphase / 2022 CLEO 论文为公开学术与厂商材料，具体产品参数以 Lumentum 官方为准。
- 系列"护城河判词"尚未在本发布中给出（在付费段），当前不宜据此做单向押注。
