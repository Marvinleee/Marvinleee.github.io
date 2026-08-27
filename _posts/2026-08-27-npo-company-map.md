---
layout: post
title: "NPO Company Map — 下一波光收入驱动因素的公司版图"
date: 2026-08-27 20:20:00 +0800
categories: [半导体投资]
tags: [NPO, CPO, 光通信, Rubin Ultra, NVL576, 光引擎, 供应链]
description: "Crux Capital 把 NPO 拆解为可投资的公司版图：光引擎密度从 2.25 到 4.0 每 GPU 的测算，以及 dollars 流向哪些环节。"
---

> **来源**：[Gaetano (Crux Capital)](https://cruxcapitalgroup.substack.com/p/is-this-the-next-optics-revenue-driver) — *NPO (Near Package Optics) Company Map — Is This The Next Optics Revenue Driver?*
> **原文链接**：<https://cruxcapitalgroup.substack.com/p/is-this-the-next-optics-revenue-driver>
> **原文发布日**：2026-06-08 ｜ **作者**：Gaetano（Crux Capital）
> **说明**：本文为英文原文（公开部分）全文转载，附中文深度解读。⚠️ 原文核心章节「Where the NPO dollars accrue」（公司受益名单）位于付费墙之后，未包含在本文中。解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

We need to talk about NPO (Near Packaged Optics).

It is gaining a lot of traction this weekend and I want to revisit it in depth.

And present to you the companies that I think are best positioned to capture dollars.

As a quick foundation, give this a read. It'll only take a few minutes and it's very watered down.

> **[Education: LPO, NPO, CPO](https://cruxcapitalgroup.substack.com/p/education-lpo-npo-cpo)**
>
> If you have following my work then you should have a good idea of why Optics is necessary for continue AI growth.

There was a FundaAI report that dropped recently.

![图01｜原文配图（Gaetano）](/assets/img/posts/npo-company-map/img01.png)
*图01｜原文配图（Gaetano）：FundaAI 报告截图*

I haven't read the article, but I wanted to take this opportunity to discuss all things NPO.

- Why it is being used
- Who supplies into it
- What it means for CPO adoption
- Where do dollars accrue?

I put out a tweet asking people who they think the main beneficiaries are from this information.

And it was exciting to me that most of the relevant companies weren't being highlighted.

That means there is alpha here, even in a follower base that is very in tune with this industry.

Some of the companies with exposure here will surprise you…

So let's unpack it all.

---

## First, what is NPO?

The simplest way to think about it is that the optical engine moves much closer to the GPU, XPU, switch ASIC, or accelerator.

![图02｜原文配图（Gaetano）](/assets/img/posts/npo-company-map/img02.jpeg)
*图02｜原文配图（Gaetano）：NPO 示意图*

But it still stays outside the most aggressive part of the advanced package.

A traditional pluggable optical module sits at the front of the box. The ASIC has to send very fast electrical signals across the board to reach that module. At lower speeds, that worked well enough. But at 200G per lane, 224G signaling, 1.6T links, and eventually 3.2T links, the electrical path starts to become a problem.

The signal degrades, power goes up, the board gets harder to design, retimers and equalizers become more important, thermals get more complicated, and the whole system becomes harder to scale.

NPO tries to solve that by moving the optical engine much closer to the chip. That shortens the electrical path. It lets the signal turn into light earlier. And that can help the system become more power-efficient, higher-density, and easier to scale.

NPO is so important is because it gives the industry a practical middle step.

It is more advanced than a front-panel pluggable and it is less aggressive than putting optics directly inside the full package.

That middle ground is why hyperscalers and semiconductor companies are interested.

---

## Why NPO is being used now

The AI network is changing over time.

The first major AI networking wave was mostly about scale-out. That meant connecting many servers and many racks together with Ethernet fabrics, switches, pluggable optics, DSPs, retimers, and a lot of fiber.

The next wave is increasingly about scale-up. Scale-up is the network that helps many GPUs or XPUs behave more like one large compute system. This layer needs extremely high bandwidth, low latency, and strong reliability. It also sits much closer to the compute layer than traditional data center interconnect.

That is why copper starts to get pressured. Copper can still work well over short distances. Inside the rack, it can be lower latency, cheaper, and easier to deploy than optics. But as the scale-up domain gets larger and the lane rates move higher, copper becomes harder to push. The reach gets shorter, the power rises, the signal integrity challenge gets worse, and the system needs more high-speed electrical support around the link.

That is where NPO enters the conversation.

---

## Why the Rubin Ultra / NVL576 discussion

The reason NPO gained so much attention this weekend is because of the claim that Rubin Ultra / NVL576 could use meaningfully more optical engine content per GPU than many people had modeled.

If optical engine density rises per GPU, the supply-chain impact can be large.

For example, if a 576-GPU system uses 2.25 optical engines per GPU, that implies roughly 1,296 optical engines.

If that moves closer to 4.0 optical engines per GPU, that implies roughly 2,304 optical engines.

So rather than questioning if CPO will ever be fully adopted, I want to focus on how much optical content gets pulled closer to the GPU before full CPO becomes dominant.

This may change the beneficiary list.

If NPO scales, dollars flow into optical engines, silicon photonics, drivers, TIAs, photodetectors, lasers, VCSELs, external light sources, fiber attach, connectors, and passive photonics.

---

## What NPO means for CPO adoption

I view NPO as a bridge.

Both NPO and CPO are pointing in the same direction. Optics are moving closer to compute. The difference is how aggressive the integration is.

CPO pushes optics deeper into the package or directly next to the switch ASIC. That can offer major power and density advantages over time. But it also creates harder packaging, yield, thermal, and serviceability questions.

NPO gives the industry a more modular way to move first.

It gives customers more flexibility around qualification, repair, sourcing, and manufacturing.

That is why NPO should become the first major commercial ramp before full CPO becomes more mature.

---

## Where the NPO dollars accrue

*（本章节及公司名单位于原文付费墙之后，未包含在本文转载范围内）*

# 第二部分：解析（深度解读）

## 核心论点摘要

这篇 6 月初的文章是「NPO = 下一波光收入驱动因素」叙事的源头之一（与 FundaAI 报告同期引发周末热议）。作者的框架：

1. **把问题从「CPO 会不会被采用」换成「full CPO 之前有多少光内容被拉到 GPU 旁边」**——这是全文最有价值的一句反问，直接把争论从定性（形态之争）转为定量（密度之增）。
2. **NVL576 光引擎密度测算**：2.25 光引擎/GPU（576 GPU 系统 ≈1,296 个光引擎）→ 若升至 4.0（≈2,304 个），供应链弹性接近翻倍。
3. **NPO 是桥梁不是终点**：与 CPO 同方向，差别只在集成激进程度；NPO 以模块化、可认证、可维修、可换供应商的优势率先商业化爬坡。

## 关键概念解读

- **scale-out → scale-up 的网络重心迁移**：第一波 AI 网络（Ethernet fabric + 可插拔 + DSP）解决「连接」；下一波 scale-up 解决「多 GPU 如同一台计算机」，需要极高带宽/低延迟/强可靠——铜的 reach、功耗、信号完整性在此域开始顶不住，这是 NPO 进入对话的物理前提。
- **「光引擎/GPU 密度」作为投资口径**：作者暗示这一指标将取代「交换机端口数」成为光供应链建模的核心自变量。 dollars 流向清单：光引擎、SiPho、driver、TIA、光电探测器、激光器、VCSEL、ELS、光纤连接、连接器、无源光子器件。

## 分层拆解表

| 维度 | 可插拔 | NPO | CPO |
|---|---|---|---|
| 光引擎位置 | 前面板 | 板上、距芯片数厘米、插座化 | 封装内/紧邻 ASIC |
| 电通道长度 | 长（损耗+重定时） | 短 | 最短 |
| 200G/lane 以上适配性 | 差 | 好 | 最好 |
| 封装/良率风险 | 无 | 低（模块化） | 高 |
| 认证/维修/换源灵活性 | 最高 | 高 | 低 |
| 商业化节奏 | 存量王者 | **当前爬坡主角** | 交换机侧起步 |

## 技术趋势判断

NVL576/Rubin Ultra 的光引擎密度上修（2.25→4.0）若兑现，意味着光供应链的总量逻辑从「交换机端口 × 端口速率」切换为「GPU 数 × 光引擎/GPU」——量纲变化带来的弹性远超形态之争。这与本站《[Optical Illusion](/posts/optical-illusion-cpo-is-dead-long-live-npo/)》（NPO 吃 Kyber 份额、纯增量）、《[NPO State of the Union](/posts/npo-state-of-the-union/)》（财报措辞切换）构成同一叙事的三个视角：物理层（密度）、叙事层（措辞）、财务层（增量归属）。

## 风险提示

原文核心的公司受益名单在付费墙后，本文转载不含该部分，请勿据截断内容推断作者的具体推荐；光引擎/GPU 密度数字（2.25/4.0）来自未经证实的传闻性报告（作者本人也注明「还没读那篇文章」）；Rubin Ultra 光学配置存在继续变动的可能。本文不构成投资建议。
