---
layout: post
title: "The Open-Source AI Era: Will Hyperscalers Keep Buying Chips? — 开源 AI 时代：云巨头还会继续买芯片吗？"
date: 2026-07-21 08:05:00 +0800
categories: [半导体投资]
tags: [半导体, AI, 开源模型, Hyperscaler, HBM, 算力]
description: "整理自 Damnang：开源模型（DeepSeek/Qwen/Kimi K3）正快速吞噬中端 AI 工作量份额，市场担忧 hyperscaler 不再买芯片。文章用 OpenRouter 数据 + 前后端毛利拆解证明：企业切到自托管开源模型后，hyerscaler 的单位价格从 $25/M token 崩到 <$1，但净影响取决于『复用率』——真实证据显示预算被一个季度烧光、token 用量年增 5–7 倍，hyerscaler 实则受益。英文原文（免费公开部分）+ 中文深度解读。"
---

> 本文整理自 [Damnang (Substack)](https://damnang2.substack.com/p/the-open-source-ai-era-will-hyperscalers) 的文章，原文发布于 **2026-07-19**（作者署名为 Damnang）。
> 标题原文：*The Open-Source AI Era: Will Hyperscalers Keep Buying Chips?*。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> ⚠️ 本文为**付费专栏文章**，公开免费部分涵盖第 1–5 节（开放模型如何赚钱、前沿毛利算术、切换如何改变 hyperscaler 收入、多余利润是否变算力投资、内存投资是否增长）至「结论之前」一节；原文后续「算力与内存投资：加/持/减」等付费段位于付费墙之后，**本发布未包含任何付费内容**。

---

# 第一部分：正文（Original Article）

## The Open-Source AI Era: Will Hyperscalers Keep Buying Chips?

[Damnang](https://damnang2.substack.com/p/the-open-source-ai-era-will-hyperscalers) · Jul 19, 2026

![Cover](https://substack-post-media.s3.amazonaws.com/public/images/fceb3c0e-e86e-48fb-9974-b8662bd26d82_1744x901.png)

Semiconductor investors have had a run of unsettling news.

Hyperscalers are announcing far fewer new data centers, and chip stocks that rode the AI story have been sliding. On top of that, on July 16 Moonshot released Kimi K3, a 2.8-trillion-parameter model that placed level with the top US models in blind arena (LMArena) rankings, with its weight files scheduled for release on July 27. A wave of open models promising frontier-level performance at a fraction of the price has fed a simple worry,

Why would hyperscalers keep buying chips at this scale?

Has the market really moved past the semiconductor theme? This article works through the numbers in public view: how open models make money, what frontier developers' margins actually look like, and what happens to hyperscaler profits when workloads move to cheaper models. The goal is to answer one question. Does the switch to open models make hyperscalers buy fewer chips, and where does compute and memory demand go from here?

**Contents**

1. How open models make money, and how fast they are spreading
2. The arithmetic of frontier margins
3. How the switch to open models changes hyperscaler revenue
4. Does the extra profit turn into compute investment?
5. Will memory investment grow?
6. Conclusion

> **Disclaimer**
>
> _The figures cited here come from public sources: earnings releases, filings, public reports, and press coverage. All interpretation and outlook are the author's personal analysis, and nothing here is a recommendation to buy or sell any security._

A token is the smallest unit of text an AI model processes, and model fees are charged per token. Frontier models are the top closed models, such as OpenAI's GPT or Anthropic's Claude, sold only through a paid API. Open models are models whose weight files are published, so anyone can download and serve them (they are also called open-weight models).

Open-model developers earn money differently from the frontier. Because the weights are public, a company that hosts the model itself owes the developer nothing. Even when the developer sells its own paid API, competing hosts selling the same model cap what it can charge.

The economics of that hosting business are real. Inference specialists report serving 70B-class models profitably at $0.90 to $2.00 per million tokens, and Together AI said its annualized bookings passed $1.15 billion. Serving margins exist in the open camp. What is zero, on the self-hosting path, is any mandatory premium for the model itself.

On capability, Epoch AI's measurements put the best open models about four months behind the frontier. Kimi K3, released July 16, placed above the previous frontier generation in blind arena rankings right away, and level with the newest frontier models.

Usage data shows the shift too. OpenRouter is a routing platform that lets developers call hundreds of models through one API, so where its traffic goes is a widely used proxy for model market share. On this platform, the share of calls sent to models priced under $1 per million tokens rose from 18% in January 2026 to 41% in June. The share of tokens processed by Chinese open models such as DeepSeek, Qwen, and Kimi went from under 2% in late 2024 to about 61% in May and June 2026. Counting all open-weight models, the latest weekly snapshot is about 69%.

![Figure 1](https://substack-post-media.s3.amazonaws.com/public/images/e03e6221-36a3-4db1-b788-d684cfa1e727_1655x744.png)

_Figure 1. OpenRouter usage split two ways. Left: share of all calls sent to budget models (under $1 per million tokens), from 18% to 41% in five months. Right: share of all tokens processed by Chinese open models, from under 2% to about 61% in eighteen months (token-count basis, retrieved June 2026). Source: OpenRouter public data and press reports._

While volume moves at this speed, where has the money gone? Start with frontier developers' margins.

Public reports put Anthropic's gross margin (revenue minus the cost of serving) at -94% in 2024, improving to the mid-60s by 2026, with a 36% operating margin before model training costs (a research estimate). OpenAI's inference cost reportedly quadrupled in 2025 and its adjusted gross margin slipped from 40% to 33%.

Add training costs and the picture changes. Reporting based on OpenAI's 2024 investor projections put its 2026 loss at $14 billion. Anthropic told investors it expects its first quarterly operating profit in Q2 2026, $560 million at roughly a 5% margin, while stopping short of promising a profitable full year. The accounting bases are not identical, but for scale: Anthropic's 36% before training (a research estimate) sits near AWS's 35–38% operating margin (37.7% in Q1 2026), while the margin including training is around 5% even in the first profitable quarter, far below the hyperscalers' 30s.

What matters more than the margin rate is that the premium is actually being paid. As of late May 2026, Anthropic processed about 11% of tokens on OpenRouter but took about 42% of estimated model spend on the platform. Benchmark gaps have narrowed to a few points, yet a 25x price gap ($25–30 per million tokens for Opus-class versus under $1 for budget open models) keeps getting paid. The reason is that companies do not pay for benchmark points. They pay for an agent that does not fall apart in the middle of a fifty-step job, for reliability where failure is expensive, and to avoid re-validating their whole workload on a new model.

![Figure 2](https://substack-post-media.s3.amazonaws.com/public/images/25695620-7412-46cb-aed2-494ccc968423_1504x747.png)

_Figure 2. Frontier share on OpenRouter, late May 2026: 11% of token volume, 42% of estimated spend on the platform. Volume is moving, but the money still sits with the frontier. Source: OpenRouter public data and press reports._

So the real risk that open models pose to frontier developers is not a falling margin rate. It is the loss of mid-tier volume. Open-model hosts now offer APIs that are drop-in compatible with OpenAI's and Anthropic's, so switching models can be a one-line change. Work with well-defined requirements, such as document classification, extraction, summarization, and simple code, is leaving first. What stays on the frontier is the hardest work, where the capability gap is worth money. Prices there are holding, but as the middle drains away, frontier revenue growth depends more and more on how fast that top tier expands.

Hyperscaler AI revenue comes through three accounts: renting compute to frontier developers, charging cloud customers for model usage, and selling their own products with models inside, like Microsoft Copilot. The open-model switch changes the customer account first.

Take a base case: an enterprise pays $25 for a job of one million tokens on a frontier API, and follow the money before and after the switch. Before, the payment reaches the hyperscaler indirectly. The $25 first becomes revenue for a developer such as OpenAI or Anthropic. At the reported 65% gross margin, the developer spends $8.75 of it on serving cost, that is, buying cloud compute, and keeps $16.25 to fund payroll and training. The hyperscaler books $8.75 of revenue. At a 35% infrastructure operating margin, that is $3.06 of profit and $5.69 of server operations.

For simplicity, this model treats the developer's entire serving cost as hyperscaler compute purchases, assumes that after the switch the company deploys directly on the same hyperscaler's cloud, and prices every tier on the same basis of one million output tokens.

When the same company moves to an open model, the pass-through disappears. The weights are free, so nothing is owed to a developer, and everything the customer pays to run the model in the cloud is infrastructure revenue for the hyperscaler. Structurally, this is better revenue: compute rental that used to ride on someone else's model becomes a direct sale to the hyperscaler's own customer. What comes with it is a price collapse. The same million tokens drops from $25 to under $1.

![Figure 3](https://substack-post-media.s3.amazonaws.com/public/images/34bb4bfa-4174-46cf-b0f1-4d691ea7b92b_1807x887.png)

_Figure 3. The base case, before and after. Before, only $8.75 of the $25 reaches the hyperscaler. After, the full payment is infrastructure revenue, but the payment equals $1 plus whatever portion of the saved $24 gets spent again._

That $1 is not a discounted version of the $25 model. It is the price of a small model whose active parameters, and therefore compute per token, are a tenth to a fiftieth of the frontier's. Open serving prices form where competing hosts add a margin over cost (hence the profitable $0.90–2.00 price points). So on both paths, the compute the hyperscaler provides equals about 65% of the revenue it books.

![Figure 4](https://substack-post-media.s3.amazonaws.com/public/images/4e6e64a1-907d-423f-b6a4-d3291ee59843_1504x827.png)

_Figure 4. Price and estimated compute for one million tokens, by model tier. Open models use the competitive serving cost ratio (price × 0.65); the frontier uses the reported 65% gross margin in reverse (price × 0.35). Prices are on an output-token basis. The budget model's compute ($0.65) is a small fraction of the frontier's ($8.75), while the top open model, Kimi K3 ($9.75), is frontier-class. Author's estimates._

If the switch is to a top open model, there is little to weigh.

K3's compute payment of $9.75 is larger than the frontier's $8.75, so hyperscaler revenue and server operations rise the moment the switch happens, regardless of any reuse. The case where the outcome can go either way is the trade-down to a budget model, so the base case continues on the $1 path, the least favorable one for the hyperscaler.

Under the assumptions above, the size of the customer account after the switch is set by the reuse rate: how much of the saved $24 goes back into tokens. If none of it does, hyperscaler revenue is $1 and profit is $0.35, far below the $3.06 before. If 32% is reused, profit matches at $3.06. If all of it is reused, revenue is $25, profit is $8.75, and server operations are $16.25, which is 2.9 times the level before the switch.

![Figure 5](https://substack-post-media.s3.amazonaws.com/public/images/1e2a203f-ae04-48f4-956a-79c775e8416d_1756x896.png)

_Figure 5. How the same $25 splits at different reuse rates. The middle bar is the 32% break-even, where post-switch hyperscaler profit ($3.06) matches the pre-switch level; above it, the post-switch path earns more. Scenario analysis under the author's assumptions (frontier gross margin 65%; infrastructure operating margin 35%)._

If companies re-spend just a third of what they save, the hyperscaler earns as much as before. So where are companies actually sitting? Reports keep coming of annual AI budgets used up in a single quarter, and token usage is growing five to seven times a year. That is not re-spending savings; that is growing the budget itself. Reality sits to the right of the rightmost bar in the chart. In that zone, the $16.25 premium that used to go to the frontier developer disappears, and hyperscaler profit and server operations fill the space.

The other two accounts point the same way. In the own-product account, swapping in an open model removes the license fee from the cost line and improves margins. The developer-rental account carries a risk: if mid-tier volume loss squeezes frontier revenue, developers could slow their training compute purchases. But multi-year rental contracts with OpenAI and Anthropic sit in backlog, so this account is not one that breaks quickly.

So a hyperscaler whose profits grow with this switch faces the next question: raise, hold, or cut **compute and memory investment?**

The following sections take it up in detail.

---

# 第二部分：解析（深度解读）

## 核心论点摘要

Damnang 这篇文章回答的是一个让半导体投资者夜不能寐的问题：**开源模型（DeepSeek / Qwen / Kimi K3）这么猛，hyperscaler 是不是就不买芯片了？** 作者的核心结论是——**不会，而且大概率反而更受益**。

论证链条很干净：
1. 开源模型确实在吃份额（OpenRouter 上 <$1/M token 的调用占比 5 个月从 18%→41%；中国开源模型 token 占比 18 个月从 <2%→~61%）。
2. 但**钱还攥在前沿模型手里**——Anthropic 只用 11% 的 token 量拿了 42% 的平台支出，25 倍价差（Opus 级 $25–30 vs 预算开源 <$1）照样有人付，因为企业买的是"五十步任务不崩"的可靠性和避免重验工作流。
3. 企业从前沿 API 切到自托管开源模型时，原本被开发者吃掉的"过手"毛利消失，全部变成 hyperscaler 的直接基础设施收入——但**单价从 $25 崩到 <$1**。
4. 净影响取决于**复用率（reuse rate）**：省下的 $24 里有百分之几又花回 token。32% 即盈亏平衡；100% 复用则 hyperscaler 利润是切换前的 2.9 倍。
5. 真实世界信号（年度 AI 预算一个季度烧光、token 用量年增 5–7 倍）显示企业落在"超额复用"区——**开源不是在消灭算力，是在用更低单价把总 token 量轰到天上去**。

## 关键概念解读

- **Frontier vs Open-weight（开放权重）模型**：前者（GPT/Claude）只卖付费 API，权重不公开；后者发布权重文件，谁都能下载自托管。开源开发者赚不到"模型税"，只能靠自己的托管 API 赚辛苦钱（利润率真实存在，$0.90–2.00/M token 可盈利）。
- **毛利拆解**：前沿开发者毛利率约 65%，但加上训练成本后季度经营利润率仅 ~5%，远低于 hyperscaler 的 30 几。也就是说**前沿模型公司本身并不比云厂商更赚钱**，它们只是把算力支出（65%）回流给了 hyperscaler。
- **复用率（reuse rate）**：这是全文的"胜负手"变量。开源省下的钱若被重新投入推理，总算力需求不降反升。作者的基准情景里 32% 即打平，现实中远超此值。
- **三本账**：hyperscaler 的 AI 收入来自①租算力给前沿开发者、②按用量向云客户收费、③自家产品内嵌模型（如 Copilot）。开源切换先冲击第①类"过手"收入，但②③类直接受益。

## 投资逻辑（与本站的连接）

这篇文章是本站"光投资系列"的**需求侧补完**——它论证了算力与内存总需求不会因为开源而塌方，反而因 token 量暴增而扩张。这直接支撑：

- [《CPO 测试瓶颈》](/posts/the-100-second-bottleneck-behind-nvidia-cpo/)：更多 token = 更大推理集群 = 更多光互联带宽 = CPO/光测试需求只增不减。
- [《TSMC 领先 CPO / 三星第三颗芯片》](/posts/tsmc-ahead-in-cpo-samsung-third-chip/)：XPU-HBM 封装内光 I/O 的赛道成立的前提，正是"算力需求持续扩张且向内存侧迁移"。
- [《光测试赛道》](/posts/why-you-should-be-watching-optical-test/)：推理规模扩张 → 光模块/光引擎产量上升 → 测试设备先兑现收入。
- **HBM/内存侧**：文章专门抛出"内存投资是否增长"一问（付费段展开），其结论方向显然偏多——这与三星把第三颗芯片贴到 HBM 旁的逻辑互相印证。

一句话：**开源模型是"降本增效"的需求放大器，不是半导体的丧钟**。对 CPO、光测试、HBM、先进封装这条链，叙事反而被加强。

## 风险提示

- 本文为**付费专栏免费预览段**，第 6 节"结论"及"算力/内存投资加减持"的定量情景在付费墙之后，本发布未含——**最终投资结论以原文付费段为准**。
- 复用率是作者假设变量，对结论极度敏感：若真实复用率不足 32%，hyperscaler 短期利润确会承压。
- 前沿开发者（OpenAI/Anthropic）若因中端量流失而削减训练算力采购，会通过"开发者租算力"这本账间接影响 hyperscaler——但多年长约在 backlog，短期不破。
- 数据来源为公开财报/报道与公司自述，口径不完全一致；文中margin数字含研究估算。
- 全文为作者个人分析，非投资建议。
