---
layout: post
title: "There Is No Such Thing as a 'CPO Stock': How the Market Misread SemiAnalysis — 世上没有「纯 CPO 股」这回事"
date: 2026-08-02 19:20:00 +0800
categories: [半导体投资]
tags: [CPO, 光通信, Lumentum, Coherent, Broadcom, 投资]
description: "本文整理 PhotonCap 对 2026 年 6 月 9 日 CPO「延迟」抛售的解读：英文原文 + 中文深度解读，剖析市场如何将 800VDC 与 CPO 两条时间线误读为同一笔交易，并拆穿「纯 CPO 股」这一伪命题。"
image: /assets/img/covers/there-is-no-such-thing-as-a-cpo-stock.jpg

---

> 本文整理自 **PhotonCap**（photoncap.net），原文发布于 **Jun 10, 2026**（标题原文：*There Is No Such Thing as a 'CPO Stock': How the Market Misread SemiAnalysis*）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。
> ⚠️ 本文含付费段落，以下仅发布公开可读部分；付费深解未包含。

---

# 第一部分：正文（Original Article）

## There Is No Such Thing as a 'CPO Stock': How the Market Misread SemiAnalysis

[PhotonCap](https://substack.com/@photoncap) · Jun 10, 2026

### $LITE $COHR $MRVL $AVGO $POET | CPO Delay Selloff, Reader Mailbag Edition

On June 9, an institutional-only [SemiAnalysis](https://open.substack.com/pub/semianalysis) note read as a "CPO rollout delay" and optical networking stocks broke in a single session. AAOI down 14%, COHR down 11%, LITE down 8%, CIEN down 7% [1][2]. But were the names the market sold really "CPO delay casualties"?

One reader asked about selling Lumentum, Soitec, and Sivers to rotate into Broadcom and Marvell. The instinct was right. The sense that you buy the fundamental layer, not the form factor, is right. The problem was that the execution pointed the opposite way.

This piece looks at three things the market missed in the CPO delay selloff: how CPO and 800VDC got bundled into one AI infrastructure delay trade, production versus volume, and the false category of a "CPO stock." (Relevant tickers: $LITE $COHR $MRVL $AVGO, plus Soitec, Sivers, $POET.)

### Contents

- Intro: a reader's trade
- An institutional-only note, and a summary of a summary
- The real order of the selloff: price first, explanation later
- "Production has started," but production is not volume
- Many form factors, one set of toll-gates
- Form-factor exposure matrix (LITE, COHR, Sivers, Soitec, POET)
- The "safe haven" paradox
- NVIDIA's capital map
- Buy the dip? Scenarios, downside, monitoring
- References and sources

## Intro: A Reader's Trade, June 9

On June 9, intraday, more than ten DMs came in about this across X, Substack, and elsewhere. Here is one of the more specific ones, anonymized and close to verbatim.

> "Photon Cap, SemiAnalysis just reported that CPO for NVIDIA Rubin Ultra is now delayed to 2028. I'm thinking about selling Soitec, Sivers and Lumentum tomorrow and shifting the money into AVGO and Marvell. What's your opinion?"

The timing is perfect. Midday June 9, AAOI fell 14% and dragged the whole optical networking complex down with it [1]. COHR down 11%, LITE down 8%, CIEN down 7% [2]. The trigger was a note SemiAnalysis sent to institutional clients only, and the gist was that the CPO rollout slips later than the market expects [1].

The reader's instinct gets one thing right. The feel of "don't get pinned to a single form factor, buy the fundamental layer." But the execution points the wrong way. In two places.

First, **the premise got compressed.** "CPO for Rubin Ultra in 2028" does not appear in any primary source, nor in any credible secondary one. What the note covered was two separate timelines. (a) NVIDIA's large-scale adoption of native 800VDC lands around 2028, and (b) CPO shipment volume comes in below expectations in 2027 with full mass production slipping toward 2028 to 2029 [3]. The market bundled the two into a single "AI infrastructure buildout is slipping" trade and sold them together, and in the process the two timelines collapsed into one number, "Rubin Ultra CPO 2028." **800VDC is a power architecture. CPO is an optical interconnect. Different layers, traded as one basket.** Not because anyone mistook one for the other, but because they got de-risked together as one correlated theme.

Second, there is a category error. Lumentum, Soitec, and Sivers get bundled as "CPO plays," so the logic runs: CPO is late, they die, therefore AVGO and Marvell are the safe zone. But once you see where AVGO and Marvell stand, the trade is tangled against its own premise. More on that below.

## An Institutional-Only Note, and a Summary of a Summary

Sourcing first.

The June 9 note is **not in any public newsletter or general paid tier. It is institutional-only** [1]. One community write-up even concedes that the figures it quotes (800VDC 2028 / CPO 2027 shortfall / mass production 2028 to 2029) are based on "third-party summaries" [3].

One key word here. **"Delayed" is not "dead"** [3]. A timing debate and a demand denial are completely different stories. And this is not a claim that SemiAnalysis is wrong. What they made is a timing-and-magnitude call on the CPO volume ramp. What this piece makes is a mechanism call on which layer is pinned to which form factor. Different kinds of claims, and not in conflict. If anything, the Downside scenario PhotonCap wrote on June 4 sits close to their base case. More on that later.

## [Taiwan GTC (Computex 2026): CPO Just Entered Production, So Why Are Coherent and Lumentum, the Companies It Was Supposed to Kill, Still on the Supplier List?](https://photoncap.net/p/taiwan-gtc-computex-2026-cpo-just)

![Taiwan GTC (Computex 2026): CPO Just Entered Production — cover image](https://substack-post-media.s3.amazonaws.com/public/images/465e579d-62fe-4bfa-a24b-00c13ca951ab_1701x925.png)

Jun 4

On May 31, 2026 (US press release date, Taiwan GTC Taipei keynote), NVIDIA called Spectrum-X Ethernet Photonics "now in production." It is the world's first co-packaged optics (CPO) Ethernet switch built on 200G SerDes, with CoreWeave, Lambda, and Oracle Cloud Infrastructure among the first adopters. One caveat up front: "now in production" marks the start of a manufacturing ramp, while broad availability is guided to the second half of 2026, so the two should be read separately. CPO pulls optical I/O right next to the switch silicon, so the market's first reaction was pluggable transceiver cannibalization. Yet on the 11-partner supply chain list NVIDIA disclosed back in 2025, the very companies that build pluggables (Coherent, Lumentum) show up again as CPO suppliers. This piece looks at who actually builds what behind that one-line "production" claim, and how cannibalization and upside can happen inside the same company at once.

> What retail saw was not the original. It was a summary of a summary. Closing that gap is where this piece begins.

## The Real Order of the Selloff: Price First, Explanation Later

One question remains. If retail cannot see the report, how did the selloff hit intraday? Reverse the order and the answer appears.

Institutions read it first. A SemiAnalysis institutional-only note reaches institutional clients, hedge funds, long-short and pod-shop desks, and tech-specialist funds before anyone else [1]. Optical was already a crowded trade, with AAOI, LITE, COHR, GLW, and MRVL bid up on the CPO and NVIDIA photonics narrative. In a seat like that, one line saying "2027 volume is too rich" is enough to trigger de-risking. Institutions read the original and trim, retail has not seen it yet, and this is not the first time a big technical claim made the market sell first and do the work later. Price moves first, and the explanation gets attached afterward [4].

Then Seeking Alpha and Tae Kim report "why it fell," and the public learns the event. Tae Kim, on the same day, read NVIDIA executive comments as refuting the SemiAnalysis narrative rather than confirming it [5]. Last, KuCoin, Futu, and coin-news feeds recompress the summary into something louder. "800VDC delayed," "CPO delayed," and "mass production 2028 to 2029" collapse into one line, and the reader's "Rubin Ultra CPO 2028" is born right here [6].

Unfold the timeline and you can see where this "delay" narrative was assembled. The January CPO Book already noted that CPO deployment, economics, and serviceability are not simple [7], and the March "Inference Kingdom Expands" said Rubin's in-rack scale-up stays copper-centric while CPO goes rack-to-rack and into larger world-size links [8]. The May 26 "Inside the 800VDC Revolution, Part 1" framed 800VDC as a four-phase gradual shift, with the facility-level move landing in 2028 to 2029 [9]. None of these described "Rubin internals all CPO by 2028." The picture got synthesized when the market laid one line from the June 9 note on top of all this.

> The selloff did not happen because retail read the report. It happened because institutions read it first, trimmed first, and the public learned the headline only after the price had already moved. That order is the gap PhotonCap exists to close.

## "Production Has Started." But Production Is Not Volume

The same week, the data on the other side.

NVIDIA's own blog states Spectrum-X Ethernet Photonics is "now in full production," with CPO-based next-generation Spectrum-X switching going into scale-out and scale-across deployments on the Vera Rubin platform. It named CoreWeave, Lambda, and Oracle Cloud Infrastructure as the first adopters, and broke the silicon-to-system pipeline into layers: TSMC (silicon photonics fab), SPIL (chip-scale packaging and test), TFC (laser die modules), and Foxconn (system assembly) [10].

At GTC Taipei, networking SVP Gilad Shainer said the CPO switch developed with TSMC had begun shipping to select partners, at up to 400 Tb/s, with production capacity expanding in 2H26 [11][12]. These remarks predate the June 9 note. They were made on the GTC Taipei floor on June 3 and 4, and were re-summoned after the selloff as NVIDIA-side counter-evidence. The point that holds is no delays, mass production and customer deliveries beginning in 2H26, and a distinction: **small-scale commercial validation and large-scale deployment are different stages** [13].

That is the whole thing. "Production" and "broad availability" are not the same word. Between the first switch reaching a select partner and the standard form factor going into clusters of tens of thousands of GPUs sits a packaging-capacity ramp. What SemiAnalysis pointed at was most likely the speed of that ramp. That is not "CPO dies." That is "the volume ceiling opens slower than expected."

## Many Form Factors, One Set of Toll-Gates

The optical interconnect in an AI data center is not one shape. Four broadly compete. **Pluggable transceivers** (today's workhorse), **NPO** (near-package optics), **LPO** (linear pluggable optics), and **CPO** (co-packaged optics). They split on how far from the switch chip the optical engine sits, and on whether a DSP is in or out.

Here is what investors miss. **Whichever of the four wins, there is always a laser inside, a substrate inside, and fiber inside.** The light source that makes the photons, the fiber that carries them, the substrate and materials that bind chip and optics into one package. These do not sit on top of form factor. They sit underneath it, as shared toll-gates.

![Figure 1: Four form factors, one set of toll-gates — the pluggable / NPO / LPO / CPO spectrum and the common laser, substrate, and fiber layers underneath](https://substack-post-media.s3.amazonaws.com/public/images/06567363-a404-4437-adff-fb8cff5aba3b_1704x923.png)

*Source: PhotonCap*

So "if CPO is late, optical stocks die" is a fear that lumps distinct layers together. A CPO delay does not push every optical layer the same direction. Some layers take the hit, and some buy time as pluggable runs longer. The problem is that the market put both in the same basket and sold them together.

That is the range anyone can reconstruct from public material. The real question is separate.

**What if the names being sold are not pinned to CPO, and the names being bought are the actual CPO principals? Isn't this trade pointed the wrong way?**

Who holds which toll-gate, why AVGO and Marvell are not a clean hedge, and why NVIDIA's own capital is the strongest counter-evidence of all. That part is for paying subscribers.

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

2026 年 6 月 9 日的那场 CPO「延迟」抛售，是一个教科书级别的案例：市场用一笔它根本读不到原始凭证的传闻，完成了一整套自我实现的砸盘。导火索是一份 **SemiAnalysis 仅面向机构投资者** 的付费笔记，全文从未公开；散户卖出时所依据的，是经过了「机构减仓 → 财经媒体解读 → 币圈/券商资讯流二次压缩」至少两到三层转手的标题。当 AAOI 单日跌 14%、COHR 跌 11%、LITE 跌 8%、CIEN 跌 7% 时，绝大多数参与者手里的「事实」已经和源头差了几个世代。

这篇文章真正的价值，在于它把市场硬捏成一笔交易的 **两条时间线** 拆了开来。触发抛售的叙事被压缩成了「Rubin Ultra 的 CPO 推迟到 2028」，但 SemiAnalysis 原笔记讲的是两件独立的事：(a) NVIDIA 大规模采用原生 **800VDC**（800 伏直流供电架构）大约落在 2028 年；(b) **CPO 在 2027 年的出货 volume 低于预期，全面量产滑向 2028–2029**。把一条「供电架构的采用节奏」和一条「光互连的放量节奏」缝成一个数字，是典型的范畴错误——800VDC 是电源层，CPO 是光互连层，本是不同层面，只是因为同属「AI 基建」这一高相关主题而被一起去风险化。

更深层的一击，是它拆穿了「CPO 股」这个伪概念。原文的核心论点是：**没有任何一只股票是纯粹的 CPO 标的**，真正的、跨形态共享的敞口，藏在每种封装形态之下都绕不开的「收费站」（toll-gates）——激光器、基板、光纤。理解了这一点，所谓「CPO 推迟 → Coherent/Lumentum 完蛋 → 换仓到 AVGO/MRVL 避险」的逻辑链条就站不住脚了。

## 二、核心论点拆解

| 市场误读（Misconception） | 原文纠正（Reality） |
|---|---|
| 「Rubin Ultra 的 CPO 推迟到 2028」 | 任何一手/可信二手来源都没有这句话；是两条独立时间线被压成了一个数字 |
| 800VDC 延迟 = AI 基建整体推迟 | 800VDC 是供电架构，CPO 是光互连；相关主题，但不同层面，被当成一篮子一起卖 |
| CPO 晚了 → Coherent/Lumentum 死亡，换到 AVGO/MRVL 就是避险 | AVGO/MRVL 本身就是 CPO 的核心当事人（交换机 ASIC + 共封装），并非干净的对冲；付费段落本该给出「为何被卖」vs「实际敞口」对照表 |
| 「已开始量产 = 现在就能买到/放量了」 | 量产 ≠ 广泛可用；从首批交付个别客户，到标准形态铺进数万 GPU 集群之间，隔着一条封装产能爬坡曲线 |

四组误读环环相扣。第一组制造了「谎言」本身；第二组把谎言扩展成了「整个 AI 基建 story 垮掉」；第三组给出了一个自相矛盾的应对动作；第四组则模糊了 NVIDIA 自己「now in full production」声明的真实含义。原文的功力，在于它没有否认 SemiAnalysis 对「放量速度」的判断，而是指出：**那是一个关于「哪一层被钉死在哪一种形态上」的机制判断，与 SemiAnalysis 关于「volume ramp 的节奏与量级」的判断并不冲突**——甚至 PhotonCap 自己在 6 月 4 日写的 Downside 情景，和 SemiAnalysis 的 base case 颇为接近。

## 三、关键概念 / 技术解读

**800VDC（800V 直流供电）**：是数据中心供电架构向高压直流演进的方向，原文强调它是「四阶段渐进式迁移」，设施级（facility-level）的动作落在 2028–2029。它和今天机柜内主流的 48V/54V 母线是两回事，也与光互连无关。把它和 CPO 混为一谈，等于把「机房供电改造时间表」当成了「光模块换代时间表」。

**四种光互连形态**：原文点名了 Pluggable（可插拔，今天的主力）、NPO（近封装光学）、LPO（线性可插拔，去掉了 DSP）、CPO（共封装光学，把光引擎直接贴在交换芯片旁边）。它们按「光引擎离交换芯片多远」以及「DSP 在不在链路里」来区分。CPO 把光 I/O 拉到交换芯片旁边，所以市场第一反应是「可插拔收发器要被革命了」。

**「收费站」（toll-gates）逻辑**：这是全文最值得投资者记住的一点——**无论四种形态里谁赢，里面永远有激光器、有基板、有光纤**。产生光子的光源、传输光子的光纤、把芯片与光学件粘合封装在一起的基板与材料，它们不在形态的「上面」，而在形态的「下面」，是跨形态共享的底层消耗。于是 CPO 推迟的真实含义被颠倒了：它不会让所有光层同向下跌，反而会让可插拔（pluggable）多活一段时间——**CPO 越晚，可插拔的现金牛期就越长**，这对今天靠可插拔吃饭的 Coherent、Lumentum 短期未必是利空，甚至可能延长其收获期。

**「量产 vs volume」的区分**：NVIDIA 自己口径是 Spectrum-X Ethernet Photonics「now in full production / 已进入量产」，并且 CPO 交换机（与 TSMC 共研）已开始向选定合作伙伴出货，速率最高 400 Tb/s，产能在 2026 下半年扩张。但「首批交付」和「标准形态铺进数万 GPU 集群」之间隔着一条封装产能爬坡。SemiAnalysis 真正指向的，大概率是这条爬坡的**速度**，而非「CPO 死了」。原文的金句是：这不是「CPO 死了」，而是「放量天花板比预期开得慢」。

## 四、与本站其他 CPO / 硅光系列文章的链接

- [The Illusion of CPO（CPO 专题终章）](/posts/the-illusion-of-cpo-cpo-special-final/)：与本文「没有纯 CPO 股」一脉相承，进一步拆解 CPO 叙事的幻觉。
- [CPO 最大瓶颈：高量产测试](/posts/cpo-biggest-bottleneck-high-volume-testing/)：正对应本文「量产 ≠ 放量」的核心论点——产能与测试才是真正卡住 volume 的瓶颈。
- [光学入门（三）：共封装光学](/posts/optics-primer-part-3-co-packaged/)：适合补齐 pluggable / NPO / LPO / CPO 四种形态的技术背景。
- [CPO/NPO 激光器（二）：Lumentum 的技术与护城河](/posts/lasers-for-cponpo-part-2-lumentums-tech-and-moat/)：对应本文「激光器是底层收费站」——Lumentum 既是可插拔龙头，又是 CPO 供应链上的激光器供应商。

## 五、投资意义

文中点名的标的可以分为两层来看：

**表层（被抛售的「CPO 概念股」）**：LITE（Lumentum）、COHR（Coherent）、以及未上市的 Soitec、Sivers、POET。原文提醒，把它们一概打成「CPO 推迟受害股」是错的——Coherent 与 Lumentum 恰恰同时出现在 NVIDIA 2025 年披露的 11 家 CPO 供应链名单里，它们既是被「革命」的可插拔玩家，也是 CPO 的供应商，吞噬与上行可以在同一家公司内部同时发生。

**底层（真正的「收费站」敞口）**：激光器（如 TFC 的激光 die module）、硅光基板（如 TSMC 的 silicon photonics fab）、光纤，以及封装测试（SPIL）、系统组装（Foxconn）。这些无论哪种形态胜出都会被消耗，是穿越形态之争的「卖铲人」。

**关于「换仓到 AVGO/MRVL 避险」**：原文的核心反讽就在这里——Broadcom（AVGO）与 Marvell（MRVL）本身就是交换机 ASIC 与 CPO 的**核心当事人**，它们不仅不能逃离 CPO 的节奏风险，反而正是 CPO 敞口最重的一方。把一个「被误读为 CPO 受害」的篮子，换到一个「其实是 CPO  principals」的篮子，逻辑是自我对冲掉的。

**潜在错位（dislocation）机会**：6 月 9 日这一跌，源头是对一份读不到的笔记的二手误读。若认可「CPO 推迟只是延长可插拔寿命 + 放量天花板开得慢」，那么当天被无差别砸下的 Coherent/Lumentum，反而可能是被叙事错杀的标的——当然，这必须等付费段落里的「实际敞口对照表」来验证。

## 六、风险提示

- **付费信息缺失**：本文只发布公开可读部分，原文真正给出「谁持有哪些收费站、各标的实际敞口对照表」的付费段落未包含。上文关于「谁持有哪道收费站」的归因为本文基于公开信息推断，并非作者原表结论，存在偏差可能。
- **SemiAnalysis 仍可能对**：若 2027 年 CPO volume 真如其所言大幅低于预期，连底层「收费站」供应商的营收也会被递延，并非高枕无忧。
- **拥挤交易风险**：原文指出光通信板块在 6 月 9 日前已是拥挤交易（AAOI、LITE、COHR、GLW、MRVL 都被 CPO/NVIDIA 光子叙事推高），任何去风险化都可能非常暴力——单日 AAOI -14% 即为例证。
- **单一叙事依赖**：整条逻辑高度依赖 NVIDIA 的 CPO 路线图与 800VDC 采用节奏，一旦 NVIDIA 路线图调整，相关标的敞口假设需重估。
- **来源属性**：原文为独立分析师（single-analyst）的 Substack 研究，属个人观点，非投资建议；本解读亦仅供学习参考。

*以上解读基于原文信息整理，不构成投资建议。*
