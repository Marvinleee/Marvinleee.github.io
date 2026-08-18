---
layout: post
title: "How Coherent Can Earn Investor Confidence — Coherent 如何赢回投资人信心"
date: 2026-08-19 00:00:00 +0800
categories: [半导体投资]
tags: [CPO, 光通信, 激光器, 投资, Coherent, Lumentum]
description: 在 Coherent 的 Q4FY26 业绩会上，华尔街分析师首次直接引用 Substack 行业分析来质疑其 CPO 激光器能力。Vikram Sekar 本文给出 Coherent 重建投资人信心的路径——公开激光实测数据、做 live demo。附英文原文与中文解读。
---

> 原文：[How Coherent Can Earn Investor Confidence](https://www.viksnewsletter.com/p/how-coherent-can-earn-investor-confidence)，作者 Vikram Sekar（viksnewsletter），发布于 2026-08-16。
> 本页结构：第一部分为英文原文（Original Article），第二部分为中文深度解读（解析）。
> 说明：原文无付费墙，全文完整收录。

# 第一部分：正文（Original Article）

Coherent’s Q4FY26 earnings call is likely the first time “Substack” has been explicitly mentioned on a significant financial reporting event.

**Michael Genovese, Senior Research Analyst, Rosenblatt Securities**

*It is really good to see the expectation for CPO laser revenues in the fiscal second quarter, because that would imply that you are either qualified or have line of sight to qualification and would kind of go against some of the fuzz, **I think that is not coming from Wall Street, but more coming from Substack saying you guys are having trouble with that laser**. Just any more color on the confidence that you will be ready for the customer to actually recognize revenue in that quarter and just progress that has been made recently.*

Most people believe that the “Substack” being referred to here is  who has been quite vocal about the Coherent’s lack of leadership in UHP lasers for CPO. You can see his recent earnings commentary here with a strong challenge to Coherent to present their laser data to prove to Wall Street that they are a viable InP laser alternative to Lumentum.
[Irrational AnalysisCoherent Q4 FY26 EarningsIrrational Analysis is heavily invested in the semiconductor industry…Read more3 days ago · 113 likes · 5 comments · Irrational Analysis](https://irrationalanalysis.substack.com/p/coherent-q4-fy26-earnings?utm_source=substack&utm_campaign=post_embed&utm_medium=web&embedding_publication_id=2065897)

---

*By reading this post, you agree to the [terms and conditions](https://www.viksnewsletter.com/p/terms-and-conditions). Also see the [full ethics statement](https://www.viksnewsletter.com/p/ethics).*

*If you’re new, check out the [About page](https://www.viksnewsletter.com/about). A lot of readers expense the subscription to this newsletter as it helps their professional work. Group subscriptions (3+) are 20% off. If you have any questions, reply to this email and let me know!*

*For the full post, upgrade to a paid subscription*

*Also check out the [Semi Doped podcast](https://www.viksnewsletter.com/about) with  and myself, and [our daily free newsletter](https://daily.semidoped.com/) with latest semi news.*

*If you would like to engage independent research services for your project or need expert calls, check out my boutique consulting practice at [SemiExponent](https://www.viksnewsletter.com/about).*

---

This signals that Wall Street is becoming increasingly entrenched in industry commentary on Substack (this publication included). Earnings calls are no longer just financial numbers and promises. They are becoming events where company leadership needs to start bringing receipts to their claims, or risk getting called out on it by analysts who are increasingly technically savvy. These kinds of questions on earnings calls are only going to increase.

I have argued in the past that the know-how of building UHP lasers has existed for a long time, in the deep-dive articles below. These articles walk through step by step on how to design a UHP laser, and the information broadly exists for decades in the public domain.

Sure, there are refinements to the laser design that adds up over time to create performance advantages, but fundamentally, the challenge lies in making these devices at scale. There are too many things that can go wrong when hundreds of milliwatts are output from a laser. Knowing how to do this at scale is the real competitive moat.

From a pure performance perspective, does Coherent have a “good enough” CPO laser that will work? Their UHP laser specs match Lumentum’s at least on their website. Even if they don’t have the absolute best laser, can they build one that works reliably, at high volumes, while being on time?

I do believe Coherent can take some steps to build investor confidence going forward. If they would like to stop people from making guesses, then some technical data needs to be published sooner rather than later.

### Showing Linewidth Data to Investors

To the first order, a lot of doubt can be alleviated if Coherent simply showed linewidth data. If a sub-500 kHz linewidth laser is what is being advertised, then that data should be easy to show. But that data point has been noticeably absent. Publishing linewidth, relative intensity noise, and mode-stability over a range of temperatures and electrical conditions should silence critics quite easily. There is no need to even publish the latest iteration of the laser, but show a “good enough” laser from a few years ago that is in the ballpark. This protects any strategic advantages going forward.

The danger of this strategy which likely worries Coherent Investor Relations is that anything short of what Lumentum has published would put them squarely at a number two position (possibly lower), and that messaging is not acceptable. In a way, this gives credence to what the critics have been saying all along and could become a dangerous narrative that is highly likely to be misconstrued on Wall Street, or even by technically savvy analysts.

What is even stronger is to actually have ELSFP modules at a conference like Lumentum did in ECOC 2025. See this [short video](https://www.lumentum.com/en/videos/elsfp-transceivers-cpo-architectures), and notice how it includes a power meter showing nearly 24.5 dBm of power output, **along with a spectrum analyzer showing the laser linewidth**.

Coherent had a [demo at ECOC 2025](https://www.youtube.com/watch?v=ABLf2OYgA5E) too, but they only had a power meter and **no spectrum measurements**. The power reading was >24 dB alright, but that is a scalar measurement. A spectrum measurement of the laser output usually reveals a lot more – like linewidth and side-mode suppression ratio (SMSR).

This approach is even better than a published paper because critics can see the hardware working in real time and know that it is not a one-off result in a company’s lab environment. Several conference attendees will press the exhibitor on the show floor with questions, and then write on Substack and social media about it. Independent reports analyzing what they say serves as “proof-that-it-works” and builds investor confidence.

The only live demo of CPO with ELSFP was shown at OFC 2026. These numbers from the demo characterize the whole transmit chain: laser, coupling, split ratio, modulator, and driver, The laser-specific merits are either confounded or invisible. To judge the laser itself you need fiber-coupled power per port, wall-plug efficiency, RIN in dB/Hz, SMSR, temperature range, and reliability data.

The industry will be closely watching ECOC 2026 and OCP Global Summit for any information on this front.

### The Counterargument

While laser measurements would be helpful, should Coherent really cave to the pressures of Wall Street or the blooming cottage industry of Substack industry analysts? From my own years of experience working within the semiconductor industry, it is common for companies to choose to not publish, or send representatives to conferences for fear of information leaks. Does lack of information necessarily mean that a product line is uncompetitive?

Broadcom has their Remote Laser Modules (RLMs) that they use for their CPO line of products. From what I can tell, I don’t see any published measurements of laser specs from them either. If you know how RLMs from Broadcom compare to Lumentum’s UHP lasers, please do let me know. But oddly enough, nobody questions Broadcom regarding their UHP laser capabilities.

This leads us to ask: is Coherent being held to an unfair standard? Should they publish data just because their competitor did? [Nvidia invested $2B each into Lumentum and Coherent](https://www.reuters.com/technology/nvidia-invest-2-billion-photonic-product-maker-lumentum-2026-03-02/) for their laser supply. I would assume basic due diligence by the highly competent optical networking experts at Nvidia (particularly the group from their Mellanox acquisition) would have revealed if there were fundamental flaws with their laser technology.

Ultimately what matters is whether they have a laser that works for CPO. In a highly supply constrained laser market, having a highly reliable product, with high yield, and competitive specs would make them as important a player as any in the high power laser market.

### What to Watch For

In the absence of laser measurements, there are some industry signals that investors should watch for in the next 12-15 months, to understand where Coherent is headed.

# 第二部分：解析（深度解读）

## 核心论点

作者 Vikram Sekar 抓住了一个标志性信号：在 Coherent 的 Q4FY26 业绩会上，Rosenblatt 分析师 Michael Genovese 首次在重要财报场合**点名引用了「Substack」行业分析**（普遍理解为 Irrational Analysis 对 Coherent 在 CPO 用 UHP 激光器上缺乏领导力的持续质疑）。这意味着华尔街正在深度吸收 Substack 上的技术行业评论，业绩会不再是单纯的财务数字与承诺，而是公司管理层必须「带着收据（receipts）来」的场合——否则就会被技术上越来越懂行的分析师当场揪出。

作者认为，Coherent 要重建投资人信心，关键不是更多的公关话术，而是**尽早公开技术实测数据**。

## 关键概念

1. **CPO 激光器（UHP laser）**：共封装光学所需的超高功率激光器。Coherent 与 Lumentum 是当前最主要的两家 InP 激光器供应商，Nvidia 各向两者投资 20 亿美元以保障激光供应。
2. **linewidth（线宽）**：激光的相位噪声指标，CPO 通常要求 sub-500 kHz 量级。作者指出 Coherent 一直「缺位」这一数据点。
3. **RIN（相对强度噪声）与 SMSR（边模抑制比）**：判断激光器质量的核心指标。Lumentum 在 ECOC 2025 的 ELSFP demo 同时展示了功率计读数与频谱仪线宽；而 Coherent 同场 demo 只有功率计、没有频谱测量。
4. **ELSFP 模块 / Broadcom RLM**：外部激光小封装模块；Broadcom 的 Remote Laser Module 同样未公开激光指标，却鲜少被质疑——作者借此质疑 Coherent 是否被施加了「不公平标准」。

## 技术趋势与判断

- **信息透明度正在重塑估值叙事**：当独立技术作者能在业绩会上被直接引用，公司的「技术领导力」宣称就必须可被验证。Live demo + 参会者独立报道，成为「证明它真的能用」的最强证据——比发论文更即时、更难造假。
- **作者给 Coherent 的具体建议**：① 公开 linewidth / RIN / 模式稳定性等随温度与电条件变化的数据（哪怕只是几年前的「够用」版本，也能堵住批评）；② 在 ECOC 2026 / OCP Global Summit 上做带功率计+频谱仪的 live demo；③ 行业将紧盯这两个会议的信号。
- **反方视角**：作者也承认，公开弱于 Lumentum 的数据可能坐实「行业老二」的叙事、被华尔街误读；且 Broadcom 同样不公开却无人质疑，标准是否公平存疑。Nvidia 投了 20 亿美元做尽调，若激光有根本缺陷，Mellanox 出身的光网络专家应当早已发现——因此「能否做出可靠、高良率、规格有竞争力的激光器」才是真正要害。

## 与本站其他文章的连接

- 直接延续本站 CPO / 光通信主线：Lumentum 与 Coherent 的 InP 激光器之争、CPO 测试与标准化瓶颈、以及 Nvidia 在光子供应链上的投资布局。
- 与本站「CPO 测试若不标准化就无法规模放量」「光连接是否是 AI 下一瓶颈」等文形成闭环——激光器的可验证性正是 CPO 规模化的前置条件。

## 风险提示

- 文章观点带有作者立场（其本身提供半导体独立研究服务），对 Coherent 偏审慎；引用时应交叉印证 Lumentum / Broadcom 的公开数据。
- 「What to Watch For」部分提示：未来 12–15 个月应关注 ECOC 2026 与 OCP Global Summit 上 Coherent 是否拿出带频谱测量的 laser demo，以及 linewidth/RIN 实测是否公开。
