---
layout: post
title: "Where I'm Looking: Semiconductors & AI Hardware — 我的关注清单：半导体与 AI 硬件（10 个被物理约束与估值错位交汇的标的）"
date: 2026-08-10 20:00:00 +0800
categories: [半导体投资]
tags: [半导体, AI硬件, 台积电, ASML, SK海力士, 美光, 材料, 供应链, 投资组合]
description: 整理 William David (The Chokepoint) 的季度关注清单：用「物理约束层 vs 估值错位」框架，列出代工/内存/材料基建三大类共 10 个情形（TSMC、ASML、ONTO、SK 海力士、美光、Entegris、AXT、Coherent、ASM International、Linde），并逐一给出 bear case 与催化剂。英文原文 + 中文深度解读。
---

> 本文整理自 **William David / The Chokepoint**（williamdavid.substack.com，Substack 专栏），原文发布于 **Jul 19, 2026**（标题原文：*Where I'm Looking: Semiconductors & AI Hardware*，系列收官/季度格式第一篇）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。
> ⚠️ 本文为公开免费文章，已含完整正文；文中股价/财务数据为作者写作时点（2026-07-17 前后）快照，须实时核实，非投资建议。

---

# 第一部分：正文（Original Article）

## Where I'm Looking: Semiconductors & AI Hardware

### The framework doesn't produce dozens of ideas. It eliminates most of them.

[William David](https://substack.com/@williamdavid)

*This is the closing post of the Semiconductors & AI Hardware Series. The series documented the physical constraint layer underneath the AI buildout. This post follows the money.*

*This post is the first edition of a quarterly format. The situations named here reflect where the physical constraint intersects a valuation dislocation today. When the constraint moves - and it will - the list moves with it.*

Two things happened in the same 48-hour window last week.

ASML reported €9.3 billion in Q2 revenue - above the ceiling of its own guidance. TSMC reported $40.2 billion, a 77% year-over-year profit increase, raised full-year guidance to $43-45 billion, and committed another $100 billion to Arizona. C.C. Wei said on the call that packaging capacity is "so tight it is limiting my customers' growth."

**And chip stocks went down.**

That divergence - record earnings, declining prices - is the starting point for this post. Not because it signals a turn. Because it tells you which layer the market has been pricing and which layer it hasn't.

The framework the series built doesn't produce dozens of ideas. It eliminates most of them. What remains after the framework runs are the situations where the bottleneck and the valuation have begun moving in different directions. The pullback created more valuation dislocations than existed three months ago.

The series made four arguments. None of them have changed.

First: the AI buildout depends on a fabrication and packaging layer concentrated in a single geography. TSMC is 90% of leading-edge logic, 180 kilometers from the Chinese coast, with CoWoS packaging as the sole commercial supplier at scale. The $265 billion Arizona commitment is the right answer to that problem. It runs on a 5-7 year construction timeline. The constraint is still where the series said it was.

Second: HBM is not a commodity. Switching suppliers requires redesigning the chip package from scratch. Three suppliers exist. SK Hynix's guidance is that demand exceeds its supply capacity beyond 2030. Micron has declined to name a date at all, saying it has no line of sight on when supply catches up. The materials that build HBM - tungsten contacts in every DRAM die - route through the same licensing architecture the series documented at the indium layer.

Third: the policy layer is aimed at the wrong level. The MATCH Act targets equipment. China is supplying 35% of fab equipment domestically. The qualification clock runs 2-5 years after any restriction takes effect. Policy can disrupt. It cannot resolve the constraint on the timeline the law assumes.

Fourth: inference efficiency is compressing at the application layer. Open-weight models are absorbing enterprise adoption. The $0.50 barrel of intelligence is real. But every cheap derivative still traces to a training run that needed leading-edge silicon - and the training layer still routes through the physical constraint the series documented.

One thing has changed since Part 1. Intel's 18A is in production on Panther Lake. EMIB-T packaging is matching CoWoS yields. The monoculture has a credible challenger for the first time in years. The timeline remains multi-year. The direction is no longer purely hypothetical. Both things can be true.

Ten situations follow. Organized by where they sit in the stack.

*One note before proceeding: these ideas are intentionally concentrated around one thesis. If the physical-constraint framework is wrong, several of these will likely underperform together. This is not a diversified list. It is ten expressions of the same underlying argument.*

*These are not recommendations. The thesis and bear case for each is named. The reader decides.*

## FABRICATION

**TSMC (TSM, $398.37 as of July 17, 2026)**

The series argued TSMC in four elements: 90% concentration of leading-edge logic, Arizona at approximately 2% of revenue, CoWoS as sole-supplier chokepoint fully allocated through 2027, and geographic risk 180 kilometers from the Chinese coast. Every element was confirmed on the July 16 earnings call. Nvidia alone secured approximately 60% of TSMC's CoWoS output for 2026, leaving remaining AI and ASIC customers competing for what's left.

*Since the call: reports in early August describe TSMC expanding outsourced CoW volume to ASE and SPIL, beyond the WoS work already routine at those partners. Confirmed on July 16 was TSMC's allocation share. Not yet confirmed at the time was how much of that allocation TSMC would keep executing itself.*

The stock being flat on record earnings tells you the demand narrative was already priced. The $60-64 billion capex raise - an $8 billion increase in a single quarter - is not a forecast. Companies do not commit capital at that scale without multi-year customer agreements already locked. C.C. Wei said demand will remain strong "all the way to probably 2029, 2030." That is the longest demand visibility window the company has ever provided publicly.

On the Arizona question: the AP1 and AP2 advanced packaging facilities are targeted for mass production in 2028 at the earliest. Until they are online, every AI accelerator that uses TSMC's most advanced packaging still routes through Taiwan. Arizona diversifies production. It does not yet diversify capability.

**Bear case:** Taiwan cross-strait escalation before AP1 and AP2 reach commercial scale. Intel's EMIB-T packaging, if it continues improving, provides the first credible alternative to CoWoS at the layer that currently binds before fabrication.

**Next confirmation:** Monthly revenue releases from TSMC investor relations - available within the first two weeks of each month. The single most important real-time data point in the series.

**ASML (ASML, $1,747.58 as of July 17, 2026)**

The two-sided thesis was confirmed and sharpened by Q2. The bull side: full-year guidance raised to €43-45 billion, 2027 EUV orders nearly fully received, 30% capacity expansion planned for 2027. The risk side: China at 14% of system sales in Q2 versus 19% in Q1. The specific exposure the MATCH Act targets is already compressing without the law passing.

A substantial portion of every leading-edge capacity expansion eventually routes through ASML's order book before it appears in ASML's results. That's a forward order embedded in someone else's guidance. TSMC's $60-64 billion capex raise is the clearest expression of that dynamic: equipment orders already locked, revenue recognition to follow.

Meanwhile, Chinese chipmakers are accepting ASML's price increases while TSMC resists. Neither can walk away. That's the monopoly confirmed in a single data point.

**Bear case:** MATCH Act passes and triggers DUV export restrictions before allied demand absorbs the revenue gap. The H2 China system sales figure - implied at approximately €5.9 billion to hit 20% of the full-year guide - does not materialize if export controls tighten mid-year. That's the number management didn't explicitly state on the call but that the arithmetic requires.

**Key confirmation event:** Q3 results and China revenue as a percentage of system sales. If that figure continues compressing toward 10%, the MATCH Act risk is already resolving without legislation.

**Onto Innovation (ONTO, $279.85 as of July 17, 2026)**

Part 3 documented the CoWoS packaging constraint in detail. ONTO makes the inspection and metrology tools that qualify and monitor that constraint. The Dragonfly G5 system targets 2.5D and 3D chiplet packaging inspection - the fastest-growing segment of semiconductor equipment as advanced packaging replaces node scaling. Management projected 2026 revenue growth above 30%, driven by advanced packaging. Every packaging line in Arizona's AP1 and AP2 facilities will require process control tools before it enters production.

Why ONTO over KLA? KLA is the dominant name across all inspection categories. ONTO is more concentrated in advanced packaging specifically - which is where the growth is - at a substantially lower valuation. ONTO trades at a meaningful discount to KLA on EV/Revenue despite competing directly in the fastest-growing segment. Camtek (CAMT) covers similar ground, primarily in bumping and advanced packaging inspection, but with more exposure to memory packaging than the logic-and-CoWoS focus that makes ONTO's Dragonfly positioning relevant to the specific constraint the series documented.

**Bear case:** KLA expands its advanced packaging inspection suite and absorbs the CoWoS inspection opportunity before ONTO establishes dominant design wins. The competitive question - whether packaging inspection becomes winner-take-most or remains competitive - is a business risk more than a macro risk.

**Catalyst to watch:** Q2 earnings August 6 and advanced packaging backlog as a percentage of total order intake.

## MEMORY

**SK Hynix (SKHY, $154.03 as of July 17, 2026)**

The series argued the HBM constraint in two sentences: no substitute exists, and switching suppliers requires redesigning the chip package from scratch. SK Hynix holds 58% of the market and delivered HBM4 to Nvidia nearly a year ahead of Samsung. The Nasdaq listing on July 10 removed friction that kept US institutional capital out of this position for 14 years.

The tension is structural, not just timing. SK Hynix sells HBM under long-term supply agreements at pre-negotiated contract prices. When conventional DRAM spot prices rose approximately 30% quarter-over-quarter in Q2, fixed HBM pricing dragged SK Hynix's blended ASP below what a fully spot-priced product mix would have delivered. This isn't a Q2 problem. It is the permanent arithmetic of a company whose dominant product trades at pre-negotiated terms. The bull case is that HBM4 contracts will be negotiated at higher price points as older agreements roll off. That's a 2027 story.

Q2 earnings land July 29 on a stock with no US trading history and no established institutional base. On July 13, the stock fell 15.4% in Seoul on a single broker note. On July 14, it reversed entirely. That volatility is the price of the position.

**Bear case:** LTA pricing structure continues to cap upside capture in an upcycle while competitors on spot pricing benefit more directly. 600%+ appreciation on the Korean-listed shares over twelve months compresses the margin for error. DFARS clock begins January 1, 2027 - SKHY is Korean, which cuts against the geopolitical diversification thesis for defense-adjacent customers.

**Catalyst to watch:** Q2 earnings July 29. HBM4 volume ramp guidance and any commentary on 2027 contract pricing - that's where the LTA constraint begins to ease.

**Micron Technology (MU, $848.95 as of July 17, 2026)**

The results make this the strongest fundamental situation on the list. Q3 FY2026: revenue $41.46 billion, up 346% year-over-year. Gross margin 84.9%. EPS $25.11. Q4 guided to $50 billion revenue and 86% gross margins - a further acceleration. HBM3E and HBM4 are fully booked through calendar 2027, with demand extending into 2028. The CEO said Micron can only fulfil 50-66% of customer demand in the medium term. The company generated as much cumulative cash flow in the last two quarters as in its entire prior history.

The geopolitical argument has strengthened since Part 1. DFARS-qualified fabs in Idaho and New York. $22 billion in strategic customer agreements with approximately $18 billion in cash deposits already received. Ford supply agreement signed July 6. New York fab pouring first concrete July 9. $3 billion additional strategic investment announced July 9. Korean fabs face energy cost shocks and helium supply constraints that Micron's domestic fabs do not - though domestic manufacturing reduces geopolitical risk without eliminating global supply chain exposure entirely.

The stock is down materially from recent highs on broader semiconductor sentiment. The fundamentals have not moved in the direction the stock has.

**Bear case:** CXMT bonded DDR5 yields continue improving and qualify for datacenter workloads at scale - memory architecture substitution at the server layer, not inference efficiency, is the scenario that breaks the shortage thesis. At 84%+ gross margins, the stock is pricing a cycle that has limited room for disappointment.

**Catalyst to watch:** Q4 FY2026 earnings in September. Any update on 2028 demand visibility would extend the structural case beyond what management has already guided.

## MATERIALS & INFRASTRUCTURE

**Entegris (ENTG, $138.74 as of July 17, 2026)**

The series spent four parts arguing that the constraint isn't at the chip - it's at the chemistry and materials one layer beneath it. Entegris is the company that most directly embodies that argument.

Entegris supplies ultra-pure process chemicals, advanced filtration systems, and specialty materials to semiconductor fabs. Every domestic fab - TSMC Arizona, Micron Idaho and New York, Intel Ohio - requires Entegris materials. The qualification process for process chemistry runs 12-18 months and cannot be compressed. A new fab that opens in Arizona cannot run its processes until the chemistry is qualified. Entegris is the qualification gate that sits inside every CHIPS Act announcement - and the first supplier to finalize its CHIPS Act award agreement.

Management stated in Q1 2026 that "materials intensity and process complexity continue to increase" - the direct mechanism by which content per wafer grows with every node transition. The company articulates a 24-month demand cycle: fab construction products ramp first, then WFE and filtration, then unit-driven business. Memory is currently in wave 1. Advanced logic is transitioning through waves 2 and 3.

**Bear case:** AI capex digestion causes customers to defer chemical procurement, compressing near-term revenue before the CHIPS Act fab ramp absorbs the volume. The company is navigating a CFO transition (new CFO Sukhi Nagesh replacing the departing CFO) which adds execution uncertainty at the leadership level.

**Catalyst to watch:** TSMC Arizona Phase 2 equipment installation confirmation - Entegris materials qualification must precede any volume production ramp. Each new domestic fab is effectively a new multi-year Entegris customer.

**AXT Inc (AXTI, $45.86 as of July 17, 2026)**

*This is the highest-risk, most asymmetric situation on the list - and the one most directly traceable to the physical argument made in Part 2.*

AXT's Tongmei subsidiary is the primary Western-aligned supplier of indium phosphide substrates - the foundational material for optical transceivers, silicon photonics, and 5G components. Every InP wafer that ships for these applications routes through their substrate production. The indium licensing gate Part 2 documented - China's Ministry of Commerce licensing every export shipment - sits directly in their supply chain as both a risk and a structural barrier to entry for anyone trying to replicate their position.

On July 2, 2026, AXT signed a $22 million supply agreement with a major optical transceiver customer. That is the first confirmed commercial-scale validation of the indium licensing chain argument from Part 2. The Tongmei IPO pivot from Shanghai to Hong Kong removes the primary valuation overhang on the Chinese subsidiary.

This situation stacks multiple conditions: InP licensing stability, optical demand acceleration, Tongmei IPO success, continued Western customer preference, and manageable political risk. All can hold. That is a different statement than saying all will. This is the most asymmetric name on the list, not necessarily the highest conviction.

**Bear case:** China tightens MoC licensing on InP exports specifically - the exact leverage point Part 2 documented becomes the investment risk. A negative regulatory decision on the Tongmei Hong Kong IPO removes the subsidiary valuation catalyst.

**Catalyst to watch:** Tongmei Hong Kong IPO filing timeline. Additional supply agreements confirming commercial-scale InP substrate demand from Western optical customers.

**Coherent Corp (COHR, $277.60 as of July 17, 2026)**

Part 2 documented the indium licensing gate - China's Ministry of Commerce licensing every InP export shipment. The CEO of Coherent flew to Beijing personally to raise delays. That constraint sits in Coherent's cost structure as a risk. The stock is down 38% from its all-time high.

What the pullback prices: execution risk, InP supply dependency, and the broader optical name repricing. What it doesn't change: Q3 FY2026 showed record bookings, backlog visibility extending to calendar 2028, and 6-inch InP wafer yields now exceeding the 3-inch lines they replaced. The execution concern that was legitimate twelve months ago has largely resolved. NVIDIA confirmed it by taking a $2 billion equity stake and signing a multiyear CPO supply agreement - the most significant commercial validation in Coherent's history.

The more interesting argument: silicon cannot generate light. As silicon photonics scales, InP demand grows with it rather than being displaced by it. Coherent's integration of the InP substrate layer through DustPhotonics positions it to capture the demand growth from the technology that appears to be competing with its existing products. The company plans to double InP output capacity by next quarter and more than double again by end of 2027.

**Bear case:** CPO deployment timeline slips into 2028, delaying the revenue ramp the NVIDIA agreement implies. The execution risk has reduced. The demand timing risk has not.

**Catalyst to watch:** Q4 FY2026 earnings August 13. CPO revenue as a percentage of total datacom sales and any update on the NVIDIA supply agreement volume timeline.

**ASM International (ASMIY, $995.94 as of July 17, 2026)**

The series named ASML as the unreplaceable equipment layer. ASM International sits one layer deeper in the same argument - at the atomic layer deposition process that makes the gate-all-around transistor transition physically possible.

At 2nm and below, gate-all-around architecture is the structural requirement. ALD is the process that enables it - applying ultra-thin material coatings one atomic layer at a time with the precision that no other deposition technique can match at this geometry. ASM International holds the dominant ALD market position. There are no legacy process substitutes at the 2nm node. The qualification timeline for ALD chemistry and tooling runs years, not quarters.

Q1 2026 revenue was €862.5 million - at the high end of guidance, with a record adjusted operating margin of 33.1%. Management described gate-all-around as "shaping up to be a large node" and confirmed Q2 is guided to €980 million with H2 expected stronger than H1. The SAM uplift at 1.4nm is expected to be even larger than what ASMIY captured at 2nm. Pilot line investment for 1.4nm begins later this year.

Less followed than ASML. Less covered than KLAC. Positioned at a layer the market has not yet priced with the same precision it has applied to lithography.

**Bear case:** Gate-all-around adoption timeline slips as leading-edge logic customers delay node transitions on cost grounds. MATCH Act export restrictions reduce China revenue. The OTC ADR structure (ASMIY) means lower liquidity than exchange-listed names.

**Key confirmation event:** TSMC N2 and Intel 18A volume production ramp confirmation - both require ALD at the gate-all-around layer. Any pilot line order disclosure for 1.4nm would validate the SAM expansion thesis ahead of schedule.

**Linde plc (LIN, $513.22 as of July 17, 2026)**

Nobody in semiconductor coverage is writing about Linde as a semiconductor play. That classification gap is the opportunity.

Every semiconductor fab runs helium continuously for wafer cooling, leak detection, and process chambers. Qatar's Ras Laffan complex - approximately 33% of global helium supply - sustained damage that will take 3-5 years to repair per QatarEnergy. China banned helium exports July 10. Fabs entered 2026 with emergency buffer stocks that are depleting.

Linde holds long-term supply contracts with semiconductor fabs globally. Q1 2026: EPS up 10%, electronics segment up 10% driven by AI chip investments. Management described the helium market as facing "acute global shortages" and confirmed it is prioritizing long-term agreements and anticipating continued price increases throughout the year. The detail that matters most: full-year 2026 guidance was set with no implied helium upside. Every helium pricing improvement is incremental to the numbers already guiding the stock.

Why Linde over Air Products or Air Liquide? All three benefit from helium supply disruption. Linde is the largest industrial gas company by market share and revenue, with the deepest semiconductor fab contract exposure globally. Air Products has a stronger hydrogen thesis for the longer-duration energy transition play. Air Liquide carries more European fab exposure. For the specific helium-as-semiconductor-constraint argument the series implies, Linde is the most direct expression.

**Bear case:** Ras Laffan repair timeline accelerates beyond current guidance, restoring helium supply before pricing power compounds. US-Iran diplomatic resolution restores Hormuz stability and removes the geopolitical premium from industrial gas pricing.

**Catalyst to watch:** Q2 earnings July 31 and helium segment pricing commentary. Guidance already excludes helium improvement - any upside statement from management is additive to consensus.

## How to Read This List

Not all ten situations carry equal conviction or risk. A loose grouping helps:

**Highest conviction** - where the physical constraint is most observable, substitution most remote, and the thesis requires the fewest additional assumptions:

*TSMC, ASML, Micron, Entegris, Linde.*

**High conviction** - where the structural thesis is sound but timing, competitive dynamics, or execution add meaningful uncertainty:

*SK Hynix, ONTO, ASM International, Coherent.*

**Highest asymmetry** - where the framework fits but multiple conditions must hold simultaneously:

*AXT.*

This is not a ranking. It is a map of where different risks live within the same underlying argument.

## What Would Make This Wrong

Every thesis in this list depends on one assumption: that qualification remains slow and substitution remains difficult. If qualification timelines compress dramatically, if advanced packaging becomes commoditized faster than expected, or if a new manufacturing architecture removes today's bottlenecks entirely, this framework will need to change.

Chokepoints don't disappear overnight. But they do move. The series already acknowledged Intel's EMIB-T as the first credible challenge to the CoWoS monoculture. That's the template for how bottlenecks migrate: not sudden obsolescence, but gradual movement of the binding constraint to a different layer. The job is to track where the constraint moves, not to assume it stays put.

**That's why this list gets revisited every quarter. The framework is permanent. The names are not.**

Readers may notice what isn't on this list.

**NVIDIA isn't here. AMD isn't here. Broadcom isn't here.**

That's intentional.

Great products are not always great bottlenecks. The framework the series built starts where substitution becomes difficult and qualification takes years. That's where pricing power tends to last longest - not because the product is better, but because the alternative doesn't exist yet, or costs more time than the market has patience for.

**The market spends most of its time pricing products. This publication spends its time pricing constraints. Over long periods, the second often matters more than the first.**

*The series begins with Semiconductors & AI Hardware, Part 1: [The Compute Layer](https://williamdavid.substack.com/p/semiconductors-and-ai-hardware-part).*

*The full archive is at [williamdavid.substack.com](https://williamdavid.substack.com/).*

*Financial data sourced from company earnings releases, SEC filings, and public market data as of July 17, 2026. Stock prices sourced from live market data, closing prices July 17, 2026: TSM $398.37, ASML $1,747.58, ONTO $279.85, SKHY $154.03, MU $848.95, ENTG $138.74, AXTI $45.86, COHR $277.60, ASMIY $995.94, LIN $513.22. All prices require live verification before any investment decision. References to specific price levels reflect conditions at time of writing and should not be relied upon as current.*

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

William David 这篇是 Semiconductors & AI Hardware 系列的「收官 + 季度清单」第一篇。它把前面几篇铺开的「物理约束层」框架，落到一个可操作的清单：**10 个情形，按在栈里的位置分代工 / 内存 / 材料基建三类，每个都给 bear case 与催化剂**。价值不在「荐股」，而在示范了如何把「瓶颈 vs 估值错位」当成选股滤波器——以及那句最清醒的话：**NVIDIA / AMD / Broadcom 不在清单上，因为好产品不等于好瓶颈**。

对站内读者，它与 [AI 硬件入门](/posts/the-ai-hardware-primer/)、[AI 内存入门](/posts/the-ai-memory-primer/)、[AI 瓶颈移向先进封装](/posts/the-ai-bottleneck-is-moving-to-advanced/) 是同一框架的不同切面：这篇是「按此框架当下该看哪些名字」。

## 二、核心论点拆解

| 类别 | 标的（作者分组） | 原文核心逻辑 | 投资含义 |
| --- | --- | --- | --- |
| 代工 | TSMC / ASML / ONTO | TSMC 四要素（90% 先进逻辑、亚利桑那 2%、CoWoS 独占 fully allocated、距岸 180 km）全被 7-16 财报确认；ASML 是每家扩产订单最终经过的垄断节点；ONTO  Concentrated 在先进封装检测（Dragonfly G5） | 需求叙事已 price；看点是 Arizona 产能（2028）、中国营收占比、先进封装 backlog |
| 内存 | SK 海力士 / 美光 | SKHY 58% HBM 份额但 LTA 定价拖累 blended ASP（2027 故事）；MU Q3 FY26 营收 +346%、毛利 84.9%、HBM 订到 2027、仅能满足 50–66% 需求 | 最强基本面；bear 是 CXMT DDR5 良率突破做服务器端架构替代 |
| 材料基建 | Entegris / AXT / Coherent / ASM Intl / Linde | Entegris 是「芯片下一层的化学与材料」资格闸门；AXT/Coherent 卡 InP（磷化铟）许可链；ASMIY 卡 2nm GAA 的 ALD；Linde 卡氦（卡塔尔 Ras Laffan 受损、中国禁运） | 材料层是约束最底层；Linde 被分类错误（工业气体≠半导体）正是误定价机会 |
| 置信度分组 | 最高：TSMC/ASML/MU/ENTG/LIN；高：SKHY/ONTO/ASMIY/COHR；最高不对称：AXT | 框架相同，风险分布不同 | 不是排名，是「同一论点内不同风险落点」的地图 |
| 刻意排除 | NVIDIA / AMD / Broadcom | 好产品≠好瓶颈；框架从「替代难、认证数年」处起步 | 定价权最长不在产品更好，而在替代尚不存在或太慢 |

一句话：**The framework is permanent. The names are not.（框架永恒，名字每季重访）**——市场大部分时间给产品定价，本文给约束定价，长期后者往往更关键。

## 三、关键概念 / 技术解读

**1. 框架的「消除」而非「产生」。** 系列四论点未变：制造/封装层地理集中（TSMC 90% 先进逻辑 + CoWoS 独占）、HBM 非商品（切换需重设计、三家寡头、需求超 2030）、政策层（MATCH Act 打设备、中国已自供 35% 设备、资格时钟 2–5 年）打错层级、推理效率在应用层压缩但每衍生物仍回溯到训练层的前沿硅。框架跑完剩下的是「瓶颈与估值开始反向移动」的情形。

**2. 代工三标的。** TSMC：纪录盈利却股价走平=需求已 price；单季 +80 亿 capex 到 600–640 亿=已有多年客户协议锁定；Arizona AP1/AP2 封装厂最早 2028 才量产，在此之前最先进封装仍经台湾。ASML：每家扩产订单先进 ASML 订单簿再体现在业绩，是「嵌在别人指引里的远期订单」；中国系统销售占比从 Q1 19% 降到 Q2 14%，MATCH Act 针对的暴露已在法律通过前自行压缩。ONTO：比 KLA 更 Concentrated 在先进封装检测（增长最快的装备细分），估值折价明显。

**3. 内存两标的。** SK 海力士：58% HBM 份额但 LTA 预定价拖累 blended ASP，bull case 是 HBM4 合约价随旧约滚动而上调（2027）。美光：Q3 FY26 营收 414.6 亿（+346%）、毛利 84.9%、HBM 订到 2027、仅能满足 50–66% 需求；地缘强化（DFARS 认证厂、220 亿战略协议、180 亿已收定金）；bear 是 CXMT DDR5 良率突破做服务器端架构替代（这是「打破短缺论点」的场景，不是推理效率）。

**4. 材料基建五标的（本文最独到）。** Entegris：超纯工艺化学品/过滤/特种材料，资格认证 12–18 月不可压缩，是每个 CHIPS 法案公告里的「资格闸门」。AXT：Tongmei 是西方阵营首要 InP 衬底供应商，中国商务部每批出口许可既是风险也是进入壁垒；2026-07-02 签 2200 万供应协议是 InP 许可链论点的首个商业验证。Coherent：InP 依赖 + 中国许可风险，但 NVIDIA 20 亿股权 + 多年 CPO 供应协议是最重要商业验证；硅不能发光，硅光越扩 InP 需求越增。ASM International：2nm 以下 GAA 必需的 ALD 工艺垄断者，无传统替代，资格时钟数年。Linde：每家 fab 持续用氦做晶圆冷却/检漏/工艺腔；卡塔尔 Ras Laffan（约 33% 全球供应）受损需 3–5 年修、中国 7-10 禁运；2026 指引未含氦上行，任何涨价都是增量。

**5. 置信度分组与刻意排除。** 最高置信（约束最可观察、替代最远）：TSMC/ASML/MU/ENTG/LIN。高置信：SKHY/ONTO/ASMIY/COHR。最高不对称（多条件须同时成立）：AXT。NVIDIA/AMD/Broadcom 刻意不在列——好产品不等于好瓶颈。

## 四、与本站其他文章的链接

- [AI 硬件入门](/posts/the-ai-hardware-primer/) —— 本文框架的同源总纲（代工/封装/HBM/材料四层）。
- [AI 内存入门](/posts/the-ai-memory-primer/) —— SK 海力士 / 美光 / HBM 认证壁垒的底层机制。
- [AI 瓶颈移向先进封装、三家日本公司掌握钥匙](/posts/the-ai-bottleneck-is-moving-to-advanced/) —— 材料层（玻璃布/铜箔/微钻）「六锁」框架，与本文 Entegris/AXT/Coherent 的材料主线咬合。
- [台积电 CPO 领先、三星把第三颗芯片贴到 HBM 旁](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) —— InP / 硅光相关的 Coherent、AXT 背景。

## 五、行业 / 投资意义

- **框架 > 名单。** 作者明确「框架永恒、名字每季重访」，且所有情形都押注同一底层论点（物理约束 + 慢认证），非分散组合；若框架错，多个会一起跑输。
- **材料/基建层是「约束最底层 + 分类错误误定价」的交集。** Linde（工业气体被当非半导体）、Entegris（化学资格闸门）、AXT/Coherent（InP 许可链）都体现「市场给产品定价、本文给约束定价」。
- **明确点名的 10 个标的（作者写作时点快照，须实时核实）**：TSMC(TSM $398.37)、ASML($1,747.58)、ONTO($279.85)、SK 海力士(SKHY $154.03)、美光(MU $848.95)、Entegris(ENTG $138.74)、AXT($45.86)、Coherent(COHR $277.60)、ASM International(ASMIY $995.94)、Linde(LIN $513.22)。每个都附 bear case 与催化剂（TSMC 月营收、ASML Q3 中国占比、SKHY 7-29 财报、MU 9 月 Q4、Entegris TSMC 亚利桑那 Phase 2、AXT Tongmei 港股 IPO、Coherent 8-13 Q4、ASMIY N2/18A ramp、Linde 7-31 Q2 氦定价）。
- **刻意排除 NVIDIA/AMD/Broadcom**：好产品≠好瓶颈，定价权最长处不在产品更好，而在替代不存在或太慢。

## 六、风险提示

- **非投资建议、须实时核实。** 文末明确「These are not recommendations」；所有股价/财务为 2026-07-17 前后快照，须 live verification，不可当作当前值。
- **框架单点依赖风险。** 所有情形押同一论点（资格慢 + 替代难）；若资格时钟剧缩、先进封装商品化快于预期、或新架构彻底移除瓶颈，框架需改写。作者自承 Intel EMIB-T 已是 CoWoS 垄断的首个可信挑战——瓶颈会迁移，不是突然过时。
- **个股 bear case 各异。** 如 MU 的 CXMT DDR5 良率突破、COHR 的 CPO 时间线滑到 2028、Linde 的 Ras Laffan 修复加速、AXT 的中国 InP 许可收紧与 Tongmei IPO 风险——均须独立评估。
- **流动性/结构风险。** ASMIY 为 OTC ADR，流动性低于上市名；部分标的（AXT、SKHY）波动率高、机构基础薄。

*以上解读基于原文信息整理，不构成投资建议。*
