---
layout: post
title: "The AI Hardware Primer — AI 硬件入门：被忽视的真正瓶颈在硬件层"
date: 2026-08-10 20:00:00 +0800
categories: [AI硬件]
tags: [AI加速器, CoWoS, HBM, 台积电, 供应链]
description: 整理 William David (The Chokepoint) 的 AI 硬件入门：拆解 AI 投资叙事里被忽视的硬件约束——台积电代工垄断、CoWoS 先进封装产能 fully allocated、HBM 切换需 18 个月重新设计、以及最底层的材料（钨/镓/磷化铟）约束。英文原文 + 中文深度解读。
image: /assets/img/covers/the-ai-hardware-primer.jpg

---

> 本文整理自 **William David / The Chokepoint**（williamdavid.substack.com，Substack 专栏），原文发布于 **Jul 20, 2026**（标题原文：*The AI Hardware Primer*）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。
> ⚠️ 本文为公开免费文章，已含完整正文。

---

# 第一部分：正文（Original Article）

## The AI Hardware Primer

### Everyone is watching the models. The constraint is somewhere else.

[William David](https://substack.com/@williamdavid)

*Nvidia is down. The frontier labs are heading toward public markets at eye-watering valuations. A Chinese AI lab just released a model that rivals the best American ones at a fraction of the cost. If you're trying to make sense of what's happening - and what it means for where to put capital - most of what you've read hasn't explained the part that actually matters. This post does.*

Start with what everyone is looking at.

Nvidia stock has sold off. The explanation circulating: AI models are getting more efficient, which means less demand for chips, which means less revenue for Nvidia. Meanwhile Anthropic and OpenAI are reportedly preparing for public markets at valuations in the hundreds of billions. And Kimi K3 - a Chinese AI lab released last week - just demonstrated that a non-American lab can match the best frontier models, openly, at a fraction of the cost.

Those three facts feel like they tell a coherent story. Cheaper AI, less hardware demand, American AI companies racing to go public before the window closes. Sell the chips, maybe buy the labs before they list.

That story has a problem. It's built on a misunderstanding of where the constraint in this buildout actually lives. And the misunderstanding starts with something almost no coverage of the AI trade bothers to explain: what the hardware actually does, and why certain parts of it cannot be made cheaper by software improvements.

The AI buildout runs on a stack - a set of layers, each one resting on the one beneath it. The application you use sits at the top. The materials required to build the whole thing sit at the bottom. Each layer has its own constraints, its own suppliers, its own timelines. What's happening at the top - models getting cheaper, labs going public - is real. It's just not the whole picture. The diagram below maps the full stack. Everything in this publication fits somewhere on this diagram. If you understand the diagram, you understand how the rest of the series connects.

Start at the bottom and work up.

## What a chip actually is

A semiconductor chip is a piece of silicon covered in billions of tiny switches. Silicon is useful because it can be made to conduct or resist electricity depending on conditions - that controllable property is what makes computation possible. Those switches - transistors - turn on and off billions of times per second. That switching is computation. Everything an AI model does, every word it generates, every question it answers, is the product of those switches firing in sequence.

The switches have to be impossibly small. The most advanced chips today are built at dimensions measured in nanometers - billionths of a meter. A human hair is roughly 80,000 nanometers wide. The transistors in a leading-edge chip are a few nanometers across. Building them requires machines of almost incomprehensible precision, chemicals of extraordinary purity, and process knowledge accumulated over decades. There is no shortcut. You cannot will a chip fabrication facility into existence with capital alone. The knowledge has to be built, qualified, and proven - and that takes years regardless of how much money goes in.

## Why AI runs on a specific kind of chip

Not all chips are the same. The processor in your laptop - a CPU - is optimized for sequential tasks. It does one complex thing after another, very quickly. A GPU was originally designed for graphics rendering, which requires doing millions of simple calculations simultaneously rather than one complex calculation at a time.

AI training and inference happen to require exactly that: massive parallel computation. The GPU became the engine of the AI buildout almost by accident. Nvidia happened to be building the best ones, and its software platform created a switching cost that competitors have spent years trying to overcome.

When a company announces it is spending billions on AI infrastructure, most of that money is going toward clusters of GPUs. Nvidia's chips - each costing $25,000 to $40,000 - are the workhorses of the buildout. A single large AI training run might use tens of thousands of them simultaneously.

## Why one company in Taiwan makes most of them

Here is the fact that most AI coverage buries or ignores entirely: Nvidia does not manufacture its own chips. Neither does AMD, Apple, Google, or most of the companies designing cutting-edge silicon. They design the blueprint and send it to a foundry - a specialized manufacturer that does nothing but fabricate chips.

Taiwan Semiconductor Manufacturing Company is that foundry. TSMC manufactures approximately 90% of the world's most advanced chips. The GPU powering most AI infrastructure today was designed by Nvidia and built by TSMC. The next generation will be too. There is no meaningful alternative at the leading edge.

TSMC sits on an island 180 kilometers from the Chinese coast. Its most advanced manufacturing capacity - the facilities that can build the chips AI requires - is concentrated in Taiwan. Billions are being committed to build new facilities in Arizona. Arizona is also approximately 2% of TSMC's current revenue, and its most advanced facilities won't reach production until 2028 at the earliest.

The constraint isn't just where TSMC is located. It's what TSMC does that nobody else can replicate at scale - and the years it takes to qualify any alternative.

## Why a chip needs more than fabrication

A chip doesn't go straight from the fabrication facility to a data center. It has to be packaged - physically connected to memory, power delivery, and other chips in a way that lets them communicate fast enough to be useful.

This is the part of the AI buildout that receives almost no coverage, and it is where some of the most important constraints live.

CoWoS is TSMC's advanced packaging process. It physically integrates high-bandwidth memory with a GPU on the same silicon platform - a thin layer that allows the two to communicate at speeds a conventional circuit board cannot match. Without this integration, the most powerful AI chips cannot function at their rated performance. The memory and the processor need to be that close to each other, physically, for the data transfer speeds that AI inference requires.

TSMC is the only commercial supplier of this packaging at scale. It is fully allocated through 2027. When TSMC's CEO said on the most recent earnings call that packaging capacity is "so tight it is limiting my customers' growth," he was describing a physical constraint that no amount of capital can quickly resolve. You can announce a new facility. You cannot qualify one in a quarter.

## The memory the chip depends on

The memory that sits alongside the GPU in that package is not the same memory as in your laptop. Regular memory is fast enough for most computing tasks. AI inference at scale requires something faster - memory that can transfer data to the processor almost instantaneously, in massive volumes, without lag.

High Bandwidth Memory - HBM - stacks multiple memory chips vertically, connects them through microscopic channels, and places them directly beside the GPU. It is physically inseparable from the chip it serves. Three companies make it at commercial scale: SK Hynix, Micron, and Samsung. SK Hynix holds approximately 58% of the market.

Here is the detail that matters most: switching HBM suppliers requires redesigning the entire chip package from scratch. The memory and the GPU are co-designed. A chip built around one manufacturer's HBM cannot simply swap in another's without an 18-month redesign cycle minimum. That is not a commercial negotiating position. That is a physical constraint.

This is the layer the Semiconductor & AI Hardware Series spends the most time on. If you want the full argument - why the shortage persists through 2027, why the switching cost is structural, and what the investment implications are - that series is where it lives.

## What a model actually needs to run

This is where everything above connects to the news that sent Nvidia lower and left many investors confused.

When an AI model generates a response, it draws on everything it learned during training. That accumulated knowledge is stored as numbers - billions or trillions of them - called weights. They encode, statistically, how language works: what words follow other words, how concepts relate, what a coherent answer looks like. Every response the model generates is the product of those weights doing work.

All of those weights have to be loaded into HBM and kept there the entire time the model is running. The model cannot predict which weights it will need next, so all of them have to be within reach at all times.

Think of it like a chef. A great chef needs two things: the skill to cook, and the ingredients within reach. Compute is the cooking. The weights in memory are everything on the counter.

You can make the chef faster. You cannot make a meal with ingredients that aren't there.

## What Kimi K3 actually showed

The important point isn't the architecture itself. It's that software efficiency and hardware requirements are not the same thing.

Kimi K3 uses an architecture called Mixture of Experts. Instead of activating all 2.8 trillion weights for every response, the model routes each piece of a question to a specialized subset - roughly 50 billion weights at a time. Less active computation per response. A more efficient model.

The market drew a conclusion: models are getting more efficient, chip demand will fall.

Here is what the market missed. All 2.8 trillion weights still have to be on the counter. Kimi K3 requires several terabytes of HBM to exist in a runnable state - regardless of how efficient each individual response is. When Kimi K3 paused new subscriptions 48 hours after launch because demand overwhelmed capacity, it was not a compute problem. It was a memory problem. The model needed more HBM than it had available.

More efficient model. Same memory requirement. Different hardware. Different constraint.

The efficiency argument compresses the compute bill. It does not compress the memory bill. Those are different chips, different supply chains, and they are not moving in the same direction.

## Why the frontier labs aren't where the constraint lives

Which brings us to Anthropic, OpenAI, and what to make of these companies when they eventually reach public markets.

The frontier labs have built the most capable AI systems in the world and are genuinely changing how businesses work. They are also sitting on top of a supply chain they don't control.

OpenAI trains on TSMC chips. Anthropic runs inference on servers full of HBM. Neither manufactures the hardware. Neither controls the materials. If CoWoS packaging capacity tightens - and it has - they pay more and wait longer. If HBM is allocated to Nvidia first - and it is - they buy what's left. Their compute bills are enormous. The hardware that determines how much they can grow and what it costs is controlled by companies they have no ownership in.

The frontier labs are the most visible part of the AI buildout. They are not the most constrained part. The most constrained parts - the fabrication layer, the packaging layer, the memory layer - tend to have more durable pricing power than the application layer above them.

This is not an argument against the frontier labs. It is an argument for understanding where in the stack the constraint actually lives. The market spends most of its time pricing what's visible. The more durable question is what makes the visible part possible.

## The layer underneath everything

One more thing.

Every layer described above depends on materials that are difficult to produce, geographically concentrated, and in several cases controlled by China through export licensing. Tungsten is in the contacts of every memory chip. Gallium - under Chinese export control - goes into the power electronics that run data centers. Indium phosphide is at the heart of the optical connections that move data between chips at the speeds AI infrastructure requires.

The semiconductor story and the critical minerals story are the same argument at different layers of the same stack. The chip constraint is real. The constraint underneath the chip is also real. And the further down the stack you go, the fewer substitutes exist and the longer the timelines become before anything changes. That argument runs through the Critical Minerals Series at the full archive.

## What to do with this

This post is not a recommendation. It is a map.

The AI buildout is the largest capital deployment in modern industrial history. Most coverage focuses on which model is winning, which lab is ahead, which application is growing fastest. Those are real questions. They are not the only questions.

The questions that tend to matter more over time: where does the constraint live? Who controls the layer that everything above it depends on? What would have to be true for that constraint to resolve - and how long would that take?

Next time you read that AI is getting cheaper, ask which layer is getting cheaper. The model layer might be. The memory layer isn't. The packaging layer isn't. The materials layer isn't.

Those are different parts of the same buildout. They are not all going in the same direction.

*The Semiconductor & AI Hardware Series and the Critical Minerals Series explore each of these layers in depth.*

*Ready to go deeper? The Semiconductor & AI Hardware Series starts here:*

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

William David 这篇「AI 硬件入门」是 The Chokepoint 系列里最「科普向」的一篇，但观点极其锋利：**市场的 AI 叙事把注意力钉在「模型层」，而真正的约束在更底层的硬件——代工、封装、内存、材料**。它用一个「栈（stack）」的隐喻，把「应用在最上、材料在最下」的层级讲清楚，并逐一击破「模型更高效 → 芯片需求下降 → 卖英伟达」这个看似自洽、实则建在误解上的故事。

对站内读者，这篇文章是 [先进封装 EMIB vs CoWoS](/posts/advanced-packaging-intels-emib-vs/) 与 [台积电 CPO 领先](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) 那两条「后道瓶颈」叙事的通俗版总纲，也把 [CPO 测试瓶颈](/posts/cpo-biggest-bottleneck-high-volume-testing/) 所依赖的「CoWoS fully allocated 到 2027」直接点了出来。

## 二、核心论点拆解

| 层级（从下到上） | 原文约束 | 投资含义 |
| --- | --- | --- |
| 材料 | 钨（每颗存储芯片触点）、镓（中国出口管制，用于数据中心功率电子）、磷化铟（芯片间光互联核心） | 越往下层，替代越少、时间线越长；关键矿物与半导体是同一栈的不同层 |
| 代工（fab） | 台积电造全球约 90% 最先进芯片；先进产能集中在台湾，距大陆海岸 180 km；美国厂 2028 前不达产 | 地理 + 资格认证双重约束，资本无法快速复制 |
| 封装 | CoWoS 是台积电独占的先进封装，fully allocated 至 2027；CEO 亲口说产能紧到「限制客户增长」 | 物理约束，不是资本能立刻解决的；宣布建厂 ≠ 一季内认证达标 |
| 内存（HBM） | 三家（SK 海力士 58%、美光、三星）；切换供应商需从头重设计封装，最少 18 个月 | 结构性转换成本，不是商务谈判姿态，是物理约束 |
| 模型运行 | 所有 weights 必须常驻 HBM；Kimi K3 暂停订阅是内存问题不是算力问题 | 软件效率压缩算力账单，不压缩内存账单 |
| 前沿实验室 | OpenAI/Anthropic 不造硬件、不控材料，坐在自己无法控制的供应链之上 | 最显眼 ≠ 最受约束；越底层定价权越持久 |

一句话：**模型可以更高效，但 2.8 万亿 weights 始终要在 HBM 里「上得了台面」——更高效的是模型，不变的是内存；这是不同的芯片、不同的供应链、不同的约束方向**。

## 三、关键概念 / 技术解读

**1. 芯片是什么 + 为何无法用钱速成。** 芯片是覆盖数十亿晶体管的硅片，晶体管在纳米级（人类头发约 80,000 nm 宽，先进芯片晶体管仅几 nm）。制造需要极高精度设备、极纯化学品、数十年工艺积累——没有捷径，资本 alone 无法凭空造出晶圆厂，知识与资格认证要数年。

**2. 为何 AI 跑在特定芯片上。** CPU 串行优化，GPU 天生并行——AI 训练/推理恰好需要海量并行。英伟达恰好做了最好的 GPU，其软件平台又制造了切换成本。单颗 GPU 2.5 万–4 万美元，一次大型训练可能同时用数万颗。

**3. 为何一家台湾公司造了大部分。** 英伟达/AMD/苹果/谷歌都不自己造——送进代工厂。台积电造全球约 90% 最先进芯片，且先进产能集中在台湾（距大陆海岸 180 km）；亚利桑那厂目前约 2% 营收、最先进产能 2028 前不达产。约束不只是「在哪」，更是「别人无法规模化复制、且替代需数年认证」。

**4. 为何芯片不止要制造、还要封装。** CoWoS 把 HBM 与 GPU 物理集成在同一硅平台上，没有这层集成，最强 AI 芯片无法跑在额定性能。台积电是唯一的规模化商业供应商，fully allocated 到 2027。CEO 说产能紧到「限制客户增长」——这是资本无法快速解决的物理约束。

**5. HBM 的切换成本是物理约束。** HBM 由 SK 海力士（约 58%）、美光、三星三家规模化制造；切换供应商需从头重设计整个芯片封装，最少 18 个月。内存与 GPU 是 co-designed，不是换个料号。

**6. Kimi K3 真正说明的事。** MoE 架构只激活约 500 亿 weights/次（总 2.8 万亿），模型更高效；但 2.8 万亿 weights 全部仍须常驻 HBM（数 TB）。K3 上线 48 小时因需求过载暂停订阅——是内存问题，不是算力问题。效率论点压缩算力账单，不压缩内存账单。

**7. 最底层材料。** 钨（存储芯片触点）、镓（中国出口管制，数据中心功率电子）、磷化铟（芯片间光互联核心）——越往下层，替代越少、时间线越长。半导体故事与关键矿物故事是同一栈的不同层。

## 四、与本站其他文章的链接

- [先进封装：Intel EMIB 对决台积电 CoWoS](/posts/advanced-packaging-intels-emib-vs/) —— 本文「封装约束」的通俗展开。
- [台积电 CPO 领先、三星把第三颗芯片贴到 HBM 旁](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) —— 本文「HBM 与 compute die 同封装」背景的延伸。
- [CPO 最大的瓶颈：高良率测试](/posts/cpo-biggest-bottleneck-high-volume-testing/) —— 直接对应本文「CoWoS fully allocated 到 2027、产能是物理约束」的判断。
- [AI 瓶颈正在移向先进封装、三家日本公司掌握钥匙](/posts/the-ai-bottleneck-is-moving-to-advanced/) —— 把本文「后道 + 材料」的线索推向极致（付费深解）。

## 五、行业 / 投资意义

- **定价权在越底层越持久。** 最显眼的模型/应用层 ≠ 最受约束层；制造、封装、内存这些层，定价权比应用层更耐用。市场大部分时间给「看得见的东西」定价，而更持久的问题是「是什么让看得见的东西成为可能」。
- **「AI 变便宜」要分层问。** 模型层可能变便宜，但内存层、封装层、材料层都不会。「更高效模型 → 芯片需求崩」是误读：算力账单被压缩，内存账单没有。
- **明确点名的结构性标的/约束**：台积电（代工垄断 + CoWoS 独占）、SK 海力士/美光/三星（HBM 三寡头）、以及底层材料（钨、镓、磷化铟）的中国出口管制风险。这些与本站 CPO/硅光系列（Coherent、Lumentum 的 InP 激光）直接咬合。

## 六、风险提示

- **本文为公开科普，非个股推荐。** 文中公司名/缩写仅作产业链标注，不构成投资建议；作者明确说「This post is not a recommendation. It is a map.」
- **时间线风险。** 台积电亚利桑那厂 2028 前不达产、CoWoS fully allocated 到 2027——这些是作者写作时点（2026-07）的判断，随产能扩张可能变化。
- **地缘风险被作者反复强调。** 台积电先进产能集中于台湾、关键矿物受中国出口管制——属系统性风险，无法被资本短期消除。
- **模型效率叙事的反身性。** 「更高效模型」可能确实压低单位算力需求，但作者论证它不压内存需求；若未来架构真能大幅削减 HBM 常驻量，则内存约束逻辑需重估。

*以上解读基于原文信息整理，不构成投资建议。*
