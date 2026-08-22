---
layout: post
title: "SerDes Part 2: The Bigger Picture Behind the Copper–Optics War — 铜光之战大局：SerDes 是系统级公司的入场券"
date: 2026-08-13 20:00:00 +0800
categories: [半导体产业]
tags: [SerDes, CPO, 铜互连, AEC, 光通信, 产业格局]
description: "Nutty 的 SerDes 系列第二篇：铜与光的战争远未尘埃落定——物理站在光一边，但金钱与时间站在铜一边；先进 SerDes 是挑战者跻身系统级公司的「入场券」，而定价权仍握在 NVIDIA 与 Broadcom 手中。"

---

> **来源**：Nutty（硅谷模拟 IC 设计工程师）· *Nutty* Substack · 原文发布于 **2026-08-12**（UTC）
> **结构**：正文（英文原文，免费段）+ 解析（中文深度解读）
> ⚠️ **付费墙说明**：原文 `audience: only_paid`。本页仅含公开免费段（止于 *A Preview of What's Ahead* 处两张付费区预览图之前的全部正文）；付费深解——14 家公司的完整坐标分布图、各家已在硅上验证的最高 SerDes 速率——**未包含**。文中出现的「两张预览图」为作者公开的付费区引子，已如实标注。

![封面图](https://substack-post-media.s3.amazonaws.com/public/images/664c143f-ec15-49be-8163-46fbce53dd8a_1774x887.png)

*An analysis of industry and technology structure, not investment advice · The author may hold positions in securities mentioned*

> 作者站内交叉引用（已发布于本站）：[SerDes Part 1：读懂 CPO 之前你必须知道的 SerDes 技术](/posts/serdes-part-1-the-technology-you-should-know-before-cpo/)；作者在原文中还交叉引用了其「Substrate 投资手册」与「康宁在 AI 基础设施中的角色」两篇（均在其 Substack，未在本站发布）。

---

# 第一部分：正文（Original Article）

## Same War, Bigger Picture

On August 11, **Lumentum** ($LITE) reported the final quarter of its fiscal year. Quarterly revenue came in at $1.0 billion, more than double the year-ago figure, and next quarter's guidance is $1.225 to $1.275 billion, a range that reaches the company's target financial model 'more than a quarter ahead of schedule.' But to me, the most important statement was not these results. It was the CEO's final comment.

> "Increasing demand for ultra-high-power CPO lasers, an initial order for ELS modules, as well as our breadth of NPO engagements are the first signs that optics are starting to penetrate in-rack connectivity, significantly upping our optical TAM."

Most readers know the long war between copper and optics. The battlefield keeps moving toward the chip, and at first glance the Lumentum CEO's remark reads as light announcing one more step into that territory. It feels natural to see the copper camp as a setting sun and the optics camp as a rising one. And you likely know, too, that the companies orchestrating all of this are the ones who build the systems. But is that really the whole story? Is the future so plainly settled, and will time raise only the optics companies' hands in victory?

Let me take a brief detour. A while ago I wrote a few pieces on glass substrates.

If you have read them, you know the one-sentence summary: glass substrates are attractive, but it is far too early to declare the era of silicon and organic substrates over. The war between copper and optics is the same. **Physics is on light's side, but time supports copper more than you would think.** And there is one more thing supporting copper: money. Copper is the cash-cow business, delivering revenue and profit right now. The scary thing about a cash cow is that new futures are born out of it. With the profits it throws off, a company can invest aggressively to fill in whatever it lacks. That can be R&D, it can be M&A, or it can be aggressive hiring. And this latent capacity is routinely underestimated.

There is one more point worth thinking about. These transitions are not made by time. They are made by companies, more precisely by the companies that span whole systems, leading from the front. These are the companies with pricing power, or more exactly, the power to decide the future. In the mobile era Apple and Google held that position; Nvidia ($NVDA) and Broadcom ($AVGO) carry the role today. Naturally there are challengers who want a share of that seat. Because a systems business of this kind is not something just anyone can attempt, the challengers are also companies you already know well. It is just that the future they are drawing has been hard to pin down.

**SerDes** is an especially important IP for the companies playing this challenger role. I will call it the 'ticket of admission' to becoming a systems company. **Which means: without advanced SerDes technology, you cannot even dream of being one.** I will cover this in more detail in the sections ahead.

Today's piece starts with a single picture.

![图：公司坐标系——横轴为「尺度」（向左进入封装内、向右超出机柜），纵轴为各公司主营营收所在的产业链位置](https://substack-post-media.s3.amazonaws.com/public/images/b7e5d1aa-af7f-4c5d-aabe-df9a4dc27ed1_860x980.png)

The horizontal axis of the figure is 'dimension.' Moving left, the scale shrinks (inside the package); moving right, it grows (beyond the rack). The vertical axis is where each company's main revenue lives. Higher means closer to switches and systems; lower means closer to chips and IP. Let me start by placing just three companies on it.

**Credo** ($CRDO) is the standard-bearer of the copper camp. A single product, the AEC (Active Electrical Cable), accounts for essentially all of its growth: more than 99% of its fiscal 2026 revenue increase came from AEC. The product puts circuitry inside a copper cable to revive the attenuated signal. Passive copper's reach shrinks toward 1 to 2 meters as generations advance, and the AEC stretches it out to 7 meters. As it happens, in-rack wiring today runs 1 to 4 meters, which makes AEC indispensable.

**Coherent** ($COHR) gets 75% of its quarterly revenue from its datacenter and communications segment, centered on the lasers and transceivers that handle electrical-to-optical conversion. It has long mass-produced these as pluggable modules, and it is now trying to carry that form toward CPO (you may remember from Part 1 that the electrical-optical conversion never disappears; it only moves).

**Nvidia** sells systems. And then it 'designs' systems. The latter matters more than the former, because 'designing' is another name for the power to reshape the market as you wish. That is why it stretches across every dimension from package to rack.

For the past year, under the banner of 'the CPO transition,' we have focused on which company does it and which company grips the bottleneck in that value chain. It resembles the period a few years back when a company's stock price was decided by whether it mentioned 'AI' on its earnings call. (I am reminded of the shoe company whose stock jumped just because the word 'AI' showed up.) It is time to step back and look at the bigger picture. Just as the number of times a company says 'AI' does not decide its stock price, or more precisely its fair price, the word 'CPO' cannot paint every company's future in beautiful colors.

Here is a preview of the two figures completed in the paid section: where the fourteen names sit on the map, and up to what speed each company has proven in silicon.

---

*<em>A Preview of What's Ahead</em>*

> ⚠️ 以下两张为作者公开的「付费区预览图」——完整解读（14 家公司坐标分布、各家已在硅上验证的最高 SerDes 速率）属付费内容，本页未包含。

![付费区预览图一：14 家公司的坐标系完整分布（付费内容预览）](https://substack-post-media.s3.amazonaws.com/public/images/16e78ef4-1a30-4ff7-90f1-5ea7c7c646e4_860x956.png)

![付费区预览图二：各家已在硅上验证的最高 SerDes 速率（付费内容预览）](https://substack-post-media.s3.amazonaws.com/public/images/c30fb2dc-1986-492e-865e-9ccc85869a3f_860x709.png)

---

# 第二部分：解析（深度解读）

## 核心论点摘要

Nutty 借 Lumentum FY 财报（单季营收 10 亿美元、同比翻倍，且 CPO 超高出光激光器 / ELS 模块初步订单 / NPO 广泛合作印证「光开始渗透机柜内互联」）切入，但立刻把话题从「谁在 CPO 里赢」拉回到一个更大的问题：**铜与光的战争到底由谁、由什么决定？**

三个核心判断：

1. **物理站在光一边，但金钱与时间站在铜一边。** 光在损耗/带宽上占优，但铜是「现金牛」——当下就能产生利润，而这些利润会被用来补研发、做并购、抢人，反过来延长铜的生命周期。这种「现金牛孕育新未来」的惰性能力常被低估。
2. **技术切换不是时间推动的，是公司推动的——更准确地说是「横跨整个系统、从前端引领」的公司。** 它们掌握定价权，也就是决定未来的权力。移动时代是 Apple / Google，今天这一角色由 **NVIDIA 与 Broadcom** 承担；挑战者想抢这张椅子，而 SerDes 就是挑战者的「入场券」。
3. **「CPO」这个词不能给每家公司画出漂亮的未来。** 就像几年前「在财报电话会上提一句 AI 股价就涨」（连卖鞋的公司都因出现 AI 二字而跳涨），盲目用 CPO 叙事给公司定价是危险的。要看清每张牌在坐标系里的真实位置。

## 关键概念解读

- **AEC（Active Electrical Cable，有源铜缆）**：在铜缆里塞入重定时器/均衡电路，把衰减的信号「救活」。无源铜随代际演进有效距离缩到 1–2 米，AEC 把它拉到 7 米；而机柜内走线恰好是 1–4 米，所以 AEC 成了「不可或缺」。Credo 99% 以上的 FY2026 增量营收来自 AEC——它是铜阵营的旗手，也是单一产品高度集中的样本。
- **CPO / NPO**：光电转换从可插拔模块搬到封装/近封装（详见 [SerDes Part 1](/posts/serdes-part-1-the-technology-you-should-know-before-cpo/)）。转换从未消失，只是「搬家」。Coherent 75% 季度营收来自数据中心与通信（激光器+收发器），正把可插拔形态向 CPO 推进。
- **坐标系（横轴=尺度，纵轴=营收位置）**：作者用一张二维图把公司摆位——横轴左为封装内、右为机柜外；纵轴高为靠近交换机/系统、低为靠近芯片/IP。NVIDIA 同时「卖系统」且「设计系统」，后者才是重塑市场规则的能力，所以它横跨从封装到机柜的每个维度。
- **SerDes 作为「入场券」**：先进 SerDes IP 是挑战者想成为系统级公司的前提——没有它，连梦想的资格都没有。这正是为什么 Broadcom、Marvell、乃至想上桌的挑战者都把高速 SerDes 当成战略资产。

## 分层拆解表（免费段可见的公司摆位）

| 公司 | 阵营 | 关键产品/营收结构 | 坐标系位置特征 |
|---|---|---|---|
| **Credo (CRDO)** | 铜（旗手） | AEC 贡献 FY2026 增量营收 >99% | 营收集中在铜互联，机柜内 1–4m 刚需 |
| **Coherent (COHR)** | 光（可插拔→CPO） | 数据中心与通信占季度营收 75%（激光器/收发器） | 营收靠电光转换，正把形态推向 CPO |
| **NVIDIA (NVDA)** | 系统 | 既「卖系统」更「设计系统」 | 横跨封装→机柜全维度，掌握定价权 |

> 付费段会把上述 3 家扩展到 **14 家公司**的完整坐标，并给出各家已在硅上验证的最高 SerDes 速率——这部分本页未包含。

## 技术趋势与投资含义

- **不要被单一叙事（AI / CPO）定价**：作者的核心提醒是把「提词儿」和「公允价值」分开。对投资而言，关键看公司在坐标系里的真实位置与定价权，而非贴了哪个标签。
- **铜的韧性被低估**：现金牛的利润再投资能力是铜阵营最被忽视的护城河。AEC 在机柜内短距场景的刚需，意味着「光全面替代铜」是渐进而非突变。
- **系统级定价权在 NVIDIA / Broadcom**：想做挑战者，「先进 SerDes」是硬门槛。关注拥有自研高速 SerDes 且能向系统层延伸的玩家，而非仅有单点器件的公司。
- **上游光器件（激光器/ELS/收发器）确定性更高**：Lumentum 的 CPO 激光器需求、ELS 初步订单、NPO 合作广度，是「光渗透机柜内」最早兑现的订单信号——这与本站已发布的 [光互联会是 AI 的下一个瓶颈吗？](/posts/is-optical-connectivity-ai-next-bottleneck/) 中「200G EML / 高功率 CW 激光器短缺」的判断相互印证。

## 与本站其他文章的连接

- [SerDes Part 1：读懂 CPO 之前你必须知道的 SerDes 技术](/posts/serdes-part-1-the-technology-you-should-know-before-cpo/) — 本篇前作，讲清 SerDes 为何是 CPO 的底层约束。
- [Pushing the Speed Limit：SerDes 收发器 224/448 Gbps](/posts/pushing-the-speed-limit-serdes-transceivers-224-448gbps/) — 速率极限与实现路径。
- [光互联会是 AI 数据中心的下一个瓶颈吗？](/posts/is-optical-connectivity-ai-next-bottleneck/) — 光渗透机柜内/机柜间的节奏与激光器瓶颈。
- [TSMC 在 CPO 领先，三星在 HBM 旁塞第三颗芯片](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) · [AI 瓶颈移向先进封装](/posts/the-ai-bottleneck-is-moving-to-advanced/) — 系统级整合视角。

## 风险提示

- 本文为作者结构性行业分析，**非投资建议**，作者可能持有文中提及证券。
- 免费段仅含框架性论述与 3 家公司摆位；14 家公司完整坐标与各家公司硅上已验证最高速率属付费内容，**本页未包含**，请勿据此推断具体标的结论。
- 铜光切换节奏、CPO 渗透速度均受下游 AI 资本开支周期影响，存在节奏不及预期风险。
