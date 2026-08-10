---
layout: post
title: "The AI Memory Primer — AI 内存入门：HBM 为何是 AI 加速器真正离不开的那一层"
date: 2026-08-10 20:00:00 +0800
categories: [半导体投资]
tags: [半导体, HBM, 存储, SK海力士, 三星, 美光, AI加速器, 良率]
description: 整理 William David (The Chokepoint) 的 AI 内存入门：用仓库/电梯类比讲清 HBM 与 DRAM 的关系、TSV 与薄化晶圆、电压 droop 与良率数学、三家寡头与认证壁垒，以及 SK 海力士/三星/美光的真实竞争格局。英文原文 + 中文深度解读。
---

> 本文整理自 **William David / The Chokepoint**（williamdavid.substack.com，Substack 专栏），原文发布于 **Jul 31, 2026**（标题原文：*The AI Memory Primer*）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。
> ⚠️ 本文为公开免费文章，已含完整正文。

---

# 第一部分：正文（Original Article）

## The AI Memory Primer

### Everyone's watching whether the AI trade is cracking. They're asking the wrong layer.

[William David](https://substack.com/@williamdavid)

Picture a computer's memory chip as a single-story warehouse. Data comes in one door, gets shelved, and comes back out the same door when needed. That's DRAM (Dynamic Random-Access Memory) - the fast, temporary workspace every processor uses while it's actively computing. It's been the same basic design for decades.

Now picture stacking twelve of those warehouses directly on top of each other, and instead of trucks driving in and out through one door on the ground floor, you drill a shaft straight down through all twelve floors and run elevators through it, thousands of them, side by side. That's HBM (High-Bandwidth Memory). It isn't a different kind of building. It's the same warehouse, stacked, with a much faster way to move things in and out.

This distinction matters more than it sounds like it should, because most coverage this week is going to get it backwards.

**The shafts are called TSVs** - through-silicon vias, tiny vertical copper connections drilled through each layer of the stack so power and data can travel straight up instead of sideways across a circuit board. A twelve-layer HBM stack contains millions of them. One bad connection, out of millions, and the layer above it is dead.

To build the stack, each layer starts life as part of a wafer, a thin, round slice of silicon (roughly the size of a dinner plate) that hundreds of individual chips get cut from once manufacturing is finished. For HBM, those slices have to be ground down to an extreme thinness before they're stacked - around 50 micrometers for a twelve-layer stack, dropping to roughly 30 micrometers for sixteen layers. That's less than half the width of a human hair. At that thinness, a wafer cracks easily and bows under its own weight, and a bowed wafer can't be bonded (fused precisely to the layer beneath it) with the accuracy the stack requires.

Then there's the power problem, which is less visible but arguably harder. DRAM is "dynamic" because the tiny electrical charges that hold each bit of data leak away on their own and have to be topped back up thousands of times per second - that top-up is called a refresh. Every refresh needs a quick burst of power delivered through those same vertical shafts, all at once, to every layer in the stack. The floors farthest from where the power comes in, the top of the stack, are the hardest to reach cleanly, and during a refresh burst the voltage reaching them can sag right when it's needed most. Engineers call this voltage droop, and solving it well enough to keep the top layers stable is one of the most closely guarded pieces of know-how in the industry. Nobody publishes exactly how they've solved it - it's one of the few things that meaningfully separates one company's success rate from another's.

All of that complexity eventually gets judged by one number: yield. The math behind it is simple enough to hold in your head. If each individual layer-to-layer bond succeeds 99 times out of 100 (already a very good rate), an eight-layer stack's overall success rate compounds down to about 92%. A twelve-layer stack drops to roughly 87%. Push to sixteen layers and you're near 86%.

Every additional floor in the warehouse is one more chance for a shaft to fail somewhere along its length, and the failures stack up along with the floors.

This is why only three companies in the world currently manufacture HBM at real volume - SK Hynix, Samsung, and Micron. Not because of a patent wall, either - the real moat is something slower: getting approved.

Before any HBM ships in real volume, it has to pass the customer's own testing, usually the GPU (the processor chip doing the heavy computational lifting) maker, most often Nvidia. A standard DRAM chip clears that testing in three to six months. HBM takes six to nine months at a minimum - and can stretch past three years when the customer wants custom features built in. Whatever gets approved today is what ships two to three years from now.

Samsung is the clearest proof this isn't a formality you can rush through with enough money. Its HBM3E chips failed Nvidia's thermal and power testing in the spring of 2024. A second attempt stumbled again the following year. Samsung, one of the most sophisticated chip manufacturers on the planet, didn't pass until September 2025 - about eighteen months after that first failure, a delay that swallowed almost an entire GPU generation. That's what "hard to manufacture" actually means (it isn't something thrown around as marketing language). Think about it: a company with nearly unlimited engineering resources needed a year and a half to solve a problem its two rivals had already solved.

Samsung didn't lose that time because it lacked engineers. It lost it because eighteen months was what the physics demanded.

Micron's story runs the opposite direction, and it's just as telling. Micron actually holds nearly twice as many core HBM patents as SK Hynix does, yet controls only about a fifth of the market to SK Hynix's more than half. If raw engineering depth decided this business, that gap shouldn't exist. What actually happened: Micron came to HBM later than its two rivals, then quietly cleared the same testing gauntlet that took Samsung a year and a half to pass (production-capable stacks certified for Nvidia's H200 in early 2024, then certified again for the newer GB300 roughly a year later) without any of the public stumbles Samsung went through. A late start didn't cost Micron a slow approval - it cost Micron its place in line for orders once approval finally came. Passing the test and winning the volume turn out to be two different races, and a company can win one without winning the other.

Once I understood that approval mattered more than patents, I started reading memory earnings differently: less as a scorecard of who's most advanced, and more as a scorecard of who's been in line the longest.

**So here's the part that actually matters for how you read this week's news:**

DRAM and HBM aren't two different products competing for the same customers. They're the same underlying chip, split into two very different tiers by how hard each one is to build.

The regular tier - ordinary DRAM and its mobile cousin, LPDDR - is decades-old, well-understood, and increasingly commoditized. This is where Chinese producers like CXMT are closing the gap fastest, because it's the more standardized, more achievable version of the technology.

The stacked tier (HBM) is where the difficulty lives, and it's the tier every AI accelerator actually needs. CXMT is reportedly working on its own HBM, using wider shafts that trade away some density for a better success rate - a real, serious effort, still years behind the approval track record SK Hynix, Samsung, and Micron have built up across multiple GPU generations.

That's bifurcation, not migration. Nobody is walking away from ordinary DRAM. It's simply becoming the tier where competition is real and margins compress, while HBM stays the tier where three companies hold an approval-and-experience advantage that's genuinely hard to shortcut.

**One honest complication worth sitting with, because a shorter version of this piece would skip it:**

Has HBM actually escaped memory's old boom-and-bust pattern? Nobody knows for certain yet, and it's worth being straight about that rather than pretending otherwise. Memory has lived through more than a dozen of these cycles over five decades. Demand surges, prices spike, manufacturers race to add capacity, that capacity lands two to three years later all at once, and the market floods. Margins that once ran above 50% fall into the low twenties or worse.

The optimistic case says this time is genuinely different - multi-year contracts already signed, real capacity discipline learned the hard way from past crashes, and approval cycles long enough to stop the kind of overnight oversupply that broke every prior cycle. The skeptical case says exactly this story gets told near the top of every cycle, and that HBM's premium just buys the incumbents time before it eventually compresses toward what memory has always become (a standardized part any approved vendor can sell). Both readings come from serious people. What's actually true is somewhere in between: the mechanics described above make this cycle different in kind from the ones before it. That's not the same thing as a guarantee the industry has escaped its own history for good.

**Which brings us to this week:**

SK Hynix reported a record quarter, revenue and operating profit both up sharply from a year ago, and missed Wall Street's forecast on both lines anyway. Look at where the miss actually came from. HBM4 mass production shipments did begin in the second quarter, on schedule, and the company said so directly. What hadn't happened yet was the ramp. Management told analysts on the same call that shipments of some high-value products were pushed into the second half, and that the resulting change in product mix is what pulled the average selling price down. Starting and ramping are two different things, and only one of them had happened by the end of June.

One more thing: Samsung reported on July 30 too - a record quarter. The company says it was the first to ship HBM4 commercially this year, and it has already sent HBM4E samples to major customers. In 2024, Samsung was the company that couldn't get HBM3E through Nvidia's testing. Now it's shipping the next generation and sampling the one after that. SK Hynix still holds the larger share of HBM, and that advantage matters. But qualification resets every cycle. Losing one generation doesn't mean losing the next.

The mirage isn't that the quarter was fine. It's that the market is about to spend a few days treating a timing problem as a demand problem. Shipments moving from one half of the year to the next tells you something about a ramp schedule. It tells you nothing about whether the layer that's genuinely scarce - the one with the eighteen-month approval cycles and the compounding math above - is any less scarce than it was in April.

Memory is one layer. It's not the only one that works this way. The AI Hardware Primer maps the rest of the stack, the foundry, the packaging, the GPU itself, and the same pattern runs through every layer of it:

## [The AI Hardware Primer](https://williamdavid.substack.com/p/the-ai-hardware-primer)

*Financial data sourced from company earnings reports and public market data as of July 30, 2026.*

*This post is for informational purposes only and is not investment advice. The Chokepoint is an independent investment research publication. Nothing in this publication should be construed as a recommendation to buy, sell, or hold any security. All company references and price data are provided for informational and contextual purposes only. Conduct independent due diligence and consult a qualified financial advisor before making any investment decisions.*

The full archive is at [williamdavid.substack.com](https://williamdavid.substack.com/).

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

这篇「AI 内存入门」是 The Chokepoint 系列里把 **HBM 为什么是 AI 加速器真正离不开的那一层**讲得最通俗、也最诚实的一篇。它用「单层仓库 vs 十二层堆叠 + 垂直电梯」的类比，把 HBM 与 DRAM 的关系、TSV、薄化晶圆、电压 droop、良率数学、以及三家寡头的认证壁垒串成一条线。

最可贵的是它的诚实：作者明确区分了「**通过测试**」和「**拿到量**」是两场不同的赛跑，并正视了 HBM 是否真能逃出内存行业几十年「boom-and-bust」周期这一无人能确定的问题。这对站内读者理解 [AI 硬件入门](/posts/the-ai-hardware-primer/) 里那句「切换 HBM 供应商需 18 个月重设计」提供了底层机制。

## 二、核心论点拆解

| 主题 | 原文要点 | 投资含义 |
| --- | --- | --- |
| HBM vs DRAM | 同一底层芯片，按「制造难度」劈成两档：普通 DRAM/LPDDR 标准化、商品化；HBM 堆叠、每颗 AI 加速器都离不开 | 这是 bifurcation（分叉）不是 migration（迁移）；没人放弃普通 DRAM，只是它成竞争红海、毛利压缩 |
| TSV 与薄化 | 垂直铜柱 TSV 穿过每层；12 层约 50 µm、16 层约 30 µm 薄化，低于半根头发；翘曲使键合精度难达标 | 物理制造难度，是 HBM 三寡头护城河的来源 |
| 电压 droop | 刷新需经 TSV 瞬时供电，顶层最难干净送达；电压下垂是行业最保密的 know-how | 不公开解法 → 良率差异是厂商真正分水岭 |
| 良率数学 | 单层键合 99% → 8 层约 92%、12 层约 87%、16 层约 86%（复利衰减） | 每多一层就多一次失败机会，失败随层数堆叠 |
| 认证壁垒 | 标准 DRAM 测试 3–6 月；HBM 最少 6–9 月、定制可超 3 年；今天认证的 2–3 年后才出货 | 真护城河是「获批」而非专利墙 |
| 三星 vs 美光 | 三星 HBM3E 2024 春 fail、2025 年 9 月才过（吞掉近一代）；美光专利近 SK 海力士 2 倍却仅约 1/5 份额，晚入场失去的是「排队位置」 | 「通过测试」与「拿到量」是不同赛跑 |
| 本周财报 | SK 海力士创纪录季但双线 miss——HBM4 已按时量产、未 ramp，产品组合压低 ASP；三星亦创纪录、称今年首发 HBM4 商用并送样 HBM4E | 市场会把「timing 问题」误读成「demand 问题」 |

一句话：**DRAM 与 HBM 不是争同一批客户的两个产品，而是同一颗芯片按制造难度劈成的两档；稀缺的那档（HBM）由三家靠「认证 + 经验」构筑、难以捷径跨越的护城河把持**。

## 三、关键概念 / 技术解读

**1. 仓库/电梯类比。** DRAM = 单层仓库，一个门进出；HBM = 把十二层仓库垂直堆叠、钻 TSV 垂直「电梯」数千根并排。HBM 不是另一种建筑，是同一仓库叠起来 + 更快的进出方式。

**2. TSV 与薄化晶圆。** TSV（through-silicon via）是穿过每层的微小垂直铜柱，让电力/数据直上而非沿板横向走；12 层堆叠需把硅片薄化到约 50 µm、16 层约 30 µm（小于半根头发宽）。此厚度下晶圆易裂、自重下弯，弯了就无法以所需精度键合。

**3. 电压 droop（电压下垂）。** DRAM「动态」因每位电荷自泄漏、需每秒数千次刷新；每次刷新都要经 TSV 瞬时给每层供电，最顶层最难干净送达，刷新瞬间电压会 sag。解决到能稳住顶层是行业最保密的 know-how——不公开，正是厂商良率差异的真正分水岭。

**4. 良率数学（复利衰减）。** 单层键合 99% 已很好，但 8 层整体约 92%、12 层约 87%、16 层约 86%。每多一层就多一次沿柱失败的机会，失败随层数堆叠。

**5. 三寡头与认证壁垒。** 全球仅 SK 海力士、三星、美光三家规模化造 HBM——不是专利墙，是「获批」这条更慢的护城河。HBM 出货前须过客户（多为英伟达）自测：标准 DRAM 3–6 月，HBM 最少 6–9 月、定制超 3 年；今天认证的 2–3 年后才出货。

**6. 三星 vs 美光的两个反向故事。** 三星 HBM3E 2024 春 fail、2025.9 才过，吞掉近一代 GPU——「hard to manufacture」是物理要求，不是营销词。美光核心 HBM 专利近 SK 海力士 2 倍却仅约 1/5 份额：晚入场没让它审批慢，却让它失去「获批后排队拿单」的位置。通过测试 ≠ 拿到量，是两场不同赛跑。

**7. 分叉而非迁移 + 周期诚实。** 普通 DRAM/LPDDR 商品化、CXMT 追赶最快；HBM 难度档 AI 离不开，CXMT 自研 HBM 用更宽柱换成功率、仍落后数年。作者诚实承认：无人确定 HBM 是否真逃出内存 boom-and-bust；乐观（多年合约、产能纪律、长认证周期）与怀疑（每轮顶部都讲这故事）都有道理，真相在中间——本轮回异于前，但不等于永远逃脱。

## 四、与本站其他文章的链接

- [AI 硬件入门](/posts/the-ai-hardware-primer/) —— 本文是那篇「HBM 切换需 18 个月重设计」的底层机制展开。
- [台积电 CPO 领先、三星把第三颗芯片贴到 HBM 旁](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) —— 三星 HBM 认证坎坷 + 2.xD 三合一封装背景。
- [CPO 最大的瓶颈：高良率测试](/posts/cpo-biggest-bottleneck-high-volume-testing/) —— 与本文「HBM 良率复利衰减、认证周期」同一底层逻辑。

## 五、行业 / 投资意义

- **读内存财报要读「排队时长」而非「谁最先进」。** 作者明确：通过测试与拿到量是两场赛跑；美光专利多却份额小，是「晚入场失去排队位置」的典型。
- **本周财报的误读预警。** SK 海力士创纪录季却双线 miss，因 HBM4 已按时量产但未 ramp、产品组合压低 ASP；市场会把「timing 问题」当「demand 问题」。真正稀缺层（18 个月认证 + 复利良率）并未比 4 月宽松。
- **明确点名标的**：SK 海力士（约 58% HBM 份额，先发与认证优势）、三星（2024 折戟后 2025.9 过关、2026 首发 HBM4 商用 + 送样 HBM4E）、美光（专利强、晚入场但认证顺利）、CXMT（普通 DRAM 追赶最快、自研 HBM 仍落后）。
- **分叉逻辑下的投资框架**：普通 DRAM 成竞争红海、毛利压缩；HBM 三寡头靠认证+经验优势，难捷径跨越。但需警惕内存行业周期性——HBM 溢价终可能向标准化回归。

## 六、风险提示

- **周期风险无法证伪。** 作者诚实指出无人确定 HBM 是否真逃出 boom-and-bust；多年合约/产能纪律/长认证或可延缓，但不等于永久逃脱。
- **认证周期重置。** 每个 GPU 世代资格重置，输一代不等于输下一代——对三星是利好弹性，对落后者是持续压力。
- **非投资建议。** 文末明确声明「for informational purposes only, not investment advice」，文中公司/价格数据仅作信息标注，须独立尽调。
- **地缘/客户集中风险。** HBM 高度绑定英伟达等 GPU 客户认证，客户侧任何路线图变化都会传导到 HBM 供应商的出货节奏与产品组合。

*以上解读基于原文信息整理，不构成投资建议。*
