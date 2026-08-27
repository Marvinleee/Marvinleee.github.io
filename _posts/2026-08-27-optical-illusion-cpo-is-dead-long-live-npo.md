---
layout: post
title: "Optical Illusion: CPO is Dead, Long Live NPO — 光学幻觉下的真实增量"
date: 2026-08-27 20:10:00 +0800
categories: [半导体投资]
tags: [CPO, NPO, Lumentum, NVIDIA, SemiAnalysis, 光通信, Kyber]
description: "Jason's Chips 拆解 SemiAnalysis CPO 延迟论与 FundaAI NPO 翻倍论同时出现的逻辑：NPO 吃掉的是 Kyber 机架而非 CPO 的份额，光互连总内容量是增加的。"
---

> **来源**：[Jason's Chips](https://www.jasonschips.ai/p/optical-illusion-cpo-is-dead-long) — *Optical Illusion: CPO is Dead, Long Live NPO — SemiAnalysis CPO Delay Selloff & NPO Mass Adoption Rumors*
> **原文链接**：<https://www.jasonschips.ai/p/optical-illusion-cpo-is-dead-long>
> **原文发布日**：2026-06-10 ｜ **作者**：Jason's Chips
> **说明**：本文为英文原文全文转载，附中文深度解读。原文以英文写就，未作翻译；解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

We have gotten a hilarious amount of discussion in a three-day span about CPO.

![图01｜原文配图（Jason's Chips）](/assets/img/posts/optical-illusion-cpo-is-dead-long-live-npo/img01.png)
*图01｜原文配图（Jason's Chips）*

The takeaway from all of this news aggregated together is actually massively bullish and incremental positive to optics. NOT negative!! I'll explain why.

All it takes is some very simple logical deduction.

## Contents

1. SemiAnalysis Note
2. FundaAI Note
3. What Is NPO and Why NPO
4. Does NPO Use InP & ELS
5. Lumentum at Mizuho
6. Conclusion

---

*By accessing this content, you acknowledge and agree to our [terms and conditions.](https://jasonschips.substack.com/p/terms-and-conditions) This research is **not financial advice**.*

---

## SemiAnalysis Note

The (very sad) title of their report was "Powered Down, Lights Off."

I will skip all of the 800 VDC stuff.

For optics, the gist is that they revised down both scale out and scale up CPO in the near term, pushing out adoption.

For scale out, the downward revision is for Spectrum X specifically, and the reasoning is that the optical engine attach yields are bad. Apparently, optical engine attach yields are 95% today (because there are 32 OEs per Spectrum 6 switch). The entire system has a 19% yield. Therefore, because COUPE is incompetent, these switches are being pushed out two quarters. These are the main scale-out CPO deployments, since Ethernet is shipping in higher volume than InfiniBand, which is why the market got so scared.

For scale-up, SemiAnalysis didn't provide too much new information, but just reiterated that the deployments won't come until Feynman and won't ship in high volume until late 2028 or 2029.

But I've been saying this too!

> The most important concept to understand when analyzing the CPO supply chain is the power of e x p o n e n t i a l.

I don't know who thought scale-up CPO would be ramping in 2027. Just because Jensen announced NVL576 for Rubin Ultra doesn't mean it would actually ship in volume, and it's not.

Feynman brings the light.

## FundaAI Note

At the very same time, FundaAI published a note claiming that NPO deployments are going to double.

I think the reason has to do with Kyber being scrapped.

> New conspiracy theory
> 90% not true.
>
> Kyber mid-plane PCB is having yield issues due to infinite size and number of layers so Nvidia needs a backup plan, and CPO ain't ready for prime time.
>
> NPO is next best thing for full optical scale up
>
> Probably totally wrong.
> Do not take

Kyber racks require high-grade (M9) CCL (copper-clad laminate) because the per-lane rates are increasing, the layer counts per tray are increasing, and the cableless design pushes these signals through the midplanes and orthogonal backplanes, putting even more pressure on the CCL for M9 CCL. Traditional glass fiber won't cut it. You need quartz fiber, which is much harder to manufacture and whose supply chain is much less mature.

This supply chain probably isn't ready.

Therefore, whatever shipments were relegated to Kyber for Rubin Ultra probably switched over to NPO.

Now notice: Mass adoption of NPO plus rumors of CPO delay sounds like NPO is replacing CPO, but actually that's not what happened at all. CPO was always going to be 28/29, and NPO is actually replacing Kyber, meaning that we have **more incremental optical content than before**.

The complete opposite of the consensus perception of this "optical illusion". (get it)

## What Is NPO and Why NPO

NPO is Near Packaged Optics. This is like co-packaged optics, except the optics aren't co-packaged with the XPU. It's only packaged near the XPU. Easy enough.

![图02｜原文配图（Jason's Chips）](/assets/img/posts/optical-illusion-cpo-is-dead-long-live-npo/img02.jpeg)
*图02｜原文配图（Jason's Chips）*

As a result, you would avoid this compounding yield problem that SemiAnalysis claims killed CPO. NPO is socketable. It is much, much easier.

## Does NPO Use InP & ELS

Probably.

And this is what makes the market reaction to all of this so silly.

Look at the diagram for NPO.

According to this design (SemiAnalysis), the only difference is in the packaging. The laser, the fiber, and the optical engine have the exact same content. This means that every single NPO lane is just as much InP revenue for Lumentum and others as CPO.

Now I must caveat this with the fact that this design (specifically using an external laser source) is not forced for NPO the same way it is for CPO. This is because external lasers are the solution to heat (lasers hate being near the hot XPU (serviceability) and laser failing can just be swapped if it's external instead of blowing up the entire tray; but for NPO, the module itself is placed away from the XPU and is also socketed, which reduces blast radius.

It seems like if NPO uses InP, the design is still external lasers. If NPO uses VCSEL, the lasers are likely internalized. However, because we're talking about 1.6T and 3.2T, if a slow and wide approach is not adopted, lane rates are 200G or higher, which is beyond what VCSELs can support. Therefore, it is most likely that NPO uses the same ELS architecture that CPO does. It is okay if this architecture is not permanent, because in a few years CPO will be here and force external lasers to stay anyways.

## Lumentum at Mizuho

There are two important takeaways from their comments at this conference (which occurred at the same time as the SemiAnalysis note).

First is their stance towards NPO.

![图03｜原文配图（Jason's Chips）](/assets/img/posts/optical-illusion-cpo-is-dead-long-live-npo/img03.png)
*图03｜原文配图（Jason's Chips）*

Yeah, that's right. Lumentum thinks NPO could be an even bigger opportunity than CPO (in the medium term).

This is only possible if NPO uses the same ELS architecture as CPO. As selling commodity lasers into the NPO market would simply never have numbers that can eclipse anything involving UHP CPO lasers (which are ~10x the price) no matter how many optical engines there are.

The second is that Michael Hurlston confirmed scale-out CPO could contribute $50 to $100 million of incremental revenue THIS QUARTER.

That is a $200-$400m run rate in the middle of 2026, which likely implies $400m full year revenue, which is 50-100k switches according to my flawless model.

SemiAnalysis says, "The street currently models 60 to 100k scale-out CPO switches shipped by 2027... We think today's pace of scale-out production is too low to reach this bogey."

According to Lumentum's actual revenue, it seems like today's pace of scale-out production is not too low to reach this bogey.

## Conclusion

Based on the evidence I see in the past few days, the optical story has gotten better, not worse.

Scale-out CPO seem to be on track and pushing Lumentum's revenue this quarter to the high end of their guidance.

Scale up CPO was never delayed, as it was always shipping with Feynman, not Rubin Ultra, in the first place.

And NPO does not cannibalize CPO. Instead, it cannibalizes the Kyber racks, making it purely incremental content for optics.

If NPO uses ELS, NPO would contribute the exact same revenue to optical players as CPO, which, based on Lumentum's comments about the NPO market, seems by far the most likely scenario.

# 第二部分：解析（深度解读）

## 核心论点摘要

这篇 6 月的文章是「NPO 恐慌」的反方经典：市场把 SemiAnalysis 的 CPO 下修 + FundaAI 的 NPO 翻倍读成了「NPO 取代 CPO」，作者的拆解是——**NPO 吃掉的是 Kyber 机架（铜/复杂 PCB 方案），不是 CPO 的份额；光互连总内容量是净增加的**。三个论证支柱：

1. **scale-out CPO 从未延迟**：SemiAnalysis 下修的是 Spectrum-X（因 32 个光引擎/交换机的复合良率问题推迟两个季度），而 Lumentum CEO Hurlston 确认当季 scale-out CPO 就有 $50-100M 增量收入（年化 $200-400M，对应 5-10 万台交换机）——实际收入数据打脸「产量太低」论。
2. **scale-up CPO 本来就在 Feynman（2028/29）**：Jensen 公布 NVL576 ≠ 2027 年量产出货，「指数复合」才是理解 CPO 供应链的正确姿势。
3. **NPO = Kyber 的备胎**：Kyber 中平面 PCB 因 M9 级 CCL/石英纤维供应链不成熟而受挫，NPO 顶上——增量而非替代。

## 关键概念解读

- **InP/ELS 问题（本文最有投资价值的洞察）**：NPO 与 CPO 在 SemiAnalysis 的架构图里**激光器、光纤、光引擎内容完全相同**，差别只在封装位置。若 NPO 沿用 ELS（外置激光源）架构，则每条 NPO lane 对 Lumentum 等 InP 厂商的收入贡献与 CPO lane 完全一致——「NPO 翻倍」直接翻倍 InP 需求。
- **为什么 NPO 大概率用 ELS**：1.6T/3.2T 时代若不走「慢而宽」（slow-and-wide），lane rate ≥200G，超出 VCSEL 能力上限 → 只能 InP；而热与可维护性约束决定了外置激光仍是主流解。
- **Lumentum 管理层的中期排序**：NPO 机会可能**大于** CPO（中期）——这只在 ELS 架构下成立（UHP CPO 激光器约 10 倍价格，纯商品化激光器撑不起这个说法）。

## 分层拆解表

| 事件 | 市场共识解读 | 本文的反驳 | 对光供应链的净影响 |
|---|---|---|---|
| SemiAnalysis 下修 CPO | CPO 叙事崩塌 | 只针对 Spectrum-X 良率推迟 2Q；scale-up 本就在 28/29 | 中性偏正面 |
| FundaAI：NPO 部署翻倍 | NPO 取代 CPO | NPO 取代的是 Kyber 铜方案 | 光内容净增加 |
| Kyber 中平面 PCB 良率问题 | （少有人关联） | M9 CCL/石英纤维供应链不成熟 → NPO 兜底 | NPO 需求上修 |
| Lumentum $50-100M/季 | 被忽视 | 实际出货数据反驳「产量过低」 | CPO 兑现中 |

## 技术趋势判断

这篇文章的方法论价值在于**区分「形态切换」与「内容量增减」**：市场习惯把包装形式（CPO/NPO/可插拔）的更迭当成零和博弈，但 AI 网络的真实驱动是「每 GPU 光引擎密度」的持续上升（本站《[NPO Company Map](/posts/npo-company-map/)》中 2.25→4.0 光引擎/GPU 的测算与此一致）。只要密度上行，形态之争影响的是**谁赚走每一层**（InP 厂 vs 封装厂 vs 模块厂），而非总量。相关阅读：《[NPO State of the Union](/posts/npo-state-of-the-union/)》《[July NPO/CPO Update](/posts/july-npo-cpo-update-stupidity-singularity/)》。

## 风险提示

作者的「无懈可击模型」（50-100k 交换机）为自嘲式粗估；Kyber 被砍/PCB 良率论作者自己标注「90% 不真的、别当真」；NPO 采用 ELS 仍是概率判断而非确认事实，若厂商选择 VCSEL 内置方案，InP 收益逻辑将打折。本文不构成投资建议。
