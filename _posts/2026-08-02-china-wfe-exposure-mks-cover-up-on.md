---
layout: post
title: "China WFE Exposure, MKS Cover-Up, On-Chip Cooling & All Things Substrates — 中国 WFE 曝光、MKS 的掩盖、片上冷却与基板全景"
date: 2026-08-02 18:40:00 +0800
categories: [半导体投资]
tags: [半导体设备, WFE, MKS, 中国半导体, 片上液冷, ABF基板]
description: "整理自 Chips & Wafers（Substack）的每周更新，英文原文涵盖中国 WFE 需求退烧、MKS 对中国营收披露的「掩盖」、AI 芯片片上液冷路线图与 ABF 基板（CoWoS 之「基」）复苏信号；本页保留完整英文原文并附中文深度解读。"
---

> 本文整理自 **Chips & Wafers（Substack）**（[chipsandwafers.substack.com](https://chipsandwafers.substack.com)），原文发布于 **Jul 04, 2025**（标题原文：*China WFE Exposure, MKS Cover-Up, On-Chip Cooling & All Things Substrates*）。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 来源说明：内容经公开页面获取；本发布保留完整英文原文并附中文深度解读，仅作信息整理与学习用途，**著作权归原作者所有，建议在原站支持作者订阅**。
> ⚠️ 本文含付费段落，以下仅发布公开可读部分；付费深解未包含。

---

# 第一部分：正文（Original Article）

## China WFE Exposure, MKS Cover-Up, On-Chip Cooling & All Things Substrates

### Chips & Wafers Weekly Update

### **China WFE Exposure**

After a sharp run-up in 2023–2024, the share of U.S. and Japanese WFE exports going to China has started to cool. At the peak, China was absorbing over 54% of Japan’s annual WFE exports and a growing slice from the US, fueled by an aggressive domestic fab buildout and front-loaded procurement ahead of anticipated export controls. But recent monthly figures show a clear deceleration. Some of this is the natural hangover from the inventory binge, but there’s also a structural ceiling in play: the window to ramp tools into China’s fabs is narrowing, and mature-node capex - while still robust - is settling into a steadier state. The data doesn’t suggest a collapse, but the fever has broken.

![China WFE exports to China](https://substack-post-media.s3.amazonaws.com/public/images/d0a6bf0e-2180-4bcb-a3a3-187e6b5d792d_1653x992.png)

*Source: Chips & Wafers Data*

Japan is showing a small bump in the past couple of months but remains below recent peaks. There have been announcements about additional capacity expansions in 2026, but how that will impact future WFE orders is yet to be determined.

*Source: Chips & Wafers Data*

We will continue to monitor this data closely and share it with our customers, in order to provide valuable insight into the overall China exposure of the big WFE players.

[AMAT -4.45%↓](https://substack.com/search/%24AMAT) [KLAC -3.19%↓](https://substack.com/search/%24KLAC) [LRCX -7.43%↓](https://substack.com/search/%24LRCX) [TEL -2.42%↓](https://substack.com/search/%24TEL)

### **MKS Instruments’ China Cover-Up**

With China’s semiconductor capacity buildout losing steam, US suppliers are starting to dance around the uncomfortable reality of shrinking China exposure. One particularly creative example is [MKSI -5.05%↓](https://substack.com/search/%24MKSI).

Beginning with their Q2 ’24 report, MKS changed how it discloses geographic revenue. Rather than reporting revenue based on *“the location where the sale originated”* (which typically corresponds to customer HQ), they’ve switched to reporting based on the *“end customer”* shipping location.

![MKS geographic revenue disclosure change](https://substack-post-media.s3.amazonaws.com/public/images/48fdea4e-8f49-4142-9590-3d08e69ee69e_727x271.png)

*Source: MKSI 10-Q*

But what exactly is the *end customer* here? If it’s the next link in the supply chain - say, an equipment maker integrating MKS subcomponents - why not just say *shipping destination*? Instead, it sounds like MKS is attributing revenue all the way down the value chain to the **ultimate fab or foundry** using the WFE tool. That’s an unusually indirect and opaque way to disclose revenue, and it raises more questions than it answers.

![MKS China revenue trend](https://substack-post-media.s3.amazonaws.com/public/images/08050c02-3300-4b12-91fd-0a46650040b1_753x453.png)

*Source: MKSI Financials*

Most critically, this shift seems to blur the picture of what’s really happening in China. By merging old China-segment revenue into this new framework, the company avoids showing a clear decline in China sales - despite industry-wide evidence of reduced Chinese procurement of U.S.-origin subcomponents.

This reporting sleight of hand suggests more than just accounting tweaks. It may hint that Chinese toolmakers are pulling back from U.S. suppliers like MKS altogether. That puts [AEIS 0.00%↑](https://substack.com/search/%24AEIS) at risk, while players like Comet (Switzerland) - with lower exposure to US restrictions - could quietly benefit.

### **Next-Gen Liquid Cooling (It’s Not Immersion)**

As AI accelerators push past 1,000W per chip, traditional forced-air cooling is reaching its thermal and power efficiency limits. Up to **40% of system power** is now spent just on delivering current and removing heat - forcing the industry towards even *more* direct liquid cooling.

In a great [*SemiEngineering*](https://semiengineering.com/novel-assembly-approaches-for-3d-device-stacks/) [piece](https://semiengineering.com/novel-assembly-approaches-for-3d-device-stacks/), we get clear insight into the cooling roadmap. The next frontier isn’t just better heat sinks - it’s **cooling at the level of the silicon package itself**. A TSMC experiment of a 4 SoC + 8 HBM CoWoS-R package with silicon-integrated micro-coolers showed that 3,000W+ can be dissipated using 40°C water directly across a reticle-scale package with minimal warpage. Unlike cold plates and TIMs, this approach brings the coolant right to the die, improving heat removal at >2.5 W/mm².

![TSMC CoWoS-R direct-to-silicon liquid cooling](https://substack-post-media.s3.amazonaws.com/public/images/4f535eed-f604-4dac-a165-e375169e7658_478x434.png)

*Source: Y-J Lien, “Direct-to-Silicon Liquid Cooling Integrated on CoWoS Platform,” IEEE Electronic Components and Technology Conference, May 2025*

But others are thinking even deeper: Georgia Tech proposes treating cooling structures as *chiplets themselves*, embedding TSV-based cooling microfins directly into the stack. These “cooling chiplets” don’t just remove heat; they also help deliver power - all within a hybrid-bonded system.

![Georgia Tech TSV-based cooling microfins](https://substack-post-media.s3.amazonaws.com/public/images/2454c9a1-be76-487f-a289-de0b3b8d2a58_635x303.png)

*Source: Yan et al., “Toward TSV-Compatible Microfluidic Cooling for 3D ICs,” in IEEE Transactions on Components, Packaging and Manufacturing Technology, vol. 15, no. 1, pp. 104-1,12, Jan. 2025, doi: 10.1109/TCPMT.2024.3516653.*

The parallel here with optics is striking: just as compute-photonics co-packaging aims to minimize distance from the compute source to the optics, thermal co-packaging aims to bring the coolant as close to the compute (heat-source) as possible. Whether through liquid cooling on-die or TSV-infused microfluidics, **cooling is becoming a first-class design constraint - not an afterthought.**

### **All Things Substrates**

Yesterday, we [hosted an X Spaces](https://x.com/i/spaces/1BdGYqnjejAGX) to discuss ABF substrates: what they are, what they do, who the suppliers are, what the roadmap looks like, etc.

It was a great conversation, and we highly encourage our followers to listen in on this key innovation that is a **bedrock of CoWoS** (ever wondered what the *S* stands for in CoWo***S***? Now you know). We also explored what interesting innovations and investing opportunities might arise from this space.

![ABF substrate / CoWoS](https://substack-post-media.s3.amazonaws.com/public/images/2f30c7be-b39c-4b0c-a474-537731e90da4_1280x720.jpeg)

*Source: TSMC*

Additionally, following our recent piece on *Mainstream Recovery*, we’ve been digging deeper to find more data points to support our thesis. Below, we’re sharing with our paid subscribers an additional indicator - from the substrate space - suggesting that we may already be on the precipice of a recovery in mainstream applications.

Next week we will be publishing a dedicated Substack detailing recent suggestive substrate data for our paid subscribers only. Stay tuned.

Unless you’re a paid subscriber - that’s a wrap for now. See you next week! Happy 4th of July!

*Chips & Wafers Team*

---

# 第二部分：解析（深度解读）

## 一、这篇文章为什么重要

这篇 *Chips & Wafers Weekly Update* 把四条看似分散的线索拧成一根主线：**中国晶圆厂设备（WFE）超级周期正在"退烧"、MKS Instruments 在披露口径上玩了一个值得警惕的"会计魔术"、AI 加速器的散热正从机箱级走向硅片级、以及 ABF 基板（即 CoWoS 的"S"）可能已站在 mainstream（成熟/主流应用）复苏的拐点**。

对半导体投资者而言，最刺眼、也最原创的判断是 **MKS 那段**——它暗示一家关键零部件供应商可能正在用"披露口径变更"来掩盖中国营收的真实下滑。一旦"中国去美化"在设备与零部件层面加速，受影响的就不只是 MKS 一家，而是整条美国 WFE 供应链的 forward estimate（前瞻盈利预期）。与此同时，片上液冷与 ABF 基板两节又准确指向了 AI 算力链条里两个被严重低估的"隐形瓶颈"：热设计约束与载板供给。读懂这一篇，等于拿到一张 2025 年下半年半导体设备与先进封装的"风险-机会"地图。

## 二、核心论点拆解

| 主题 | 核心判断 | 关键证据 | 隐含推论 |
|---|---|---|---|
| **中国 WFE 退烧** | 美/日对华 WFE 出口份额见顶回落，但不是崩盘 | 中国曾吸收日本年 WFE 出口的 **>54%**；近期月度数据明显减速；成熟节点 capex 仍稳健但趋于平稳 | 设备巨头（AMAT/KLAC/LRCX/TEL）的中国营收增速见顶，forward guide 需下修风险 |
| **MKS 的"掩盖"** | 自 **Q2'24** 起，MKS 把地理营收口径从"销售发起地"改为"最终客户发货地"，模糊中国下滑 | MKSI 10-Q 披露口径变更；旧"中国段"收入被并入新框架 | 中国本土设备商可能正在整体撤出对 MKS 等美系供应商的采购 |
| **片上液冷** | 散热从"风冷/冷板"走向"硅片级直达"，成为一等设计约束 | 单芯片 >1000W；整机最高 **40%** 功率花在供流+散热；TSMC CoWoS-R 4 SoC+8 HBM 用 40°C 水耗散 **3000W+**，热流 >2.5 W/mm² | 液冷部件、微通道、TSV 微流控将成新增量环节 |
| **ABF 基板 / CoWoS** | ABF 是 CoWoS 的"地基"，其景气可作先进封装前瞻指标 | 举办 X Spaces 专门讲 ABF；称其为 CoWoS 的 bedrock | 若 ABF 数据确认 mainstream 复苏，载板厂（欣兴/南亚/ Ibiden 等）拐点临近 |

## 三、关键概念 / 技术解读

**1. WFE 与"地理营收"确认口径**
WFE（Wafer Fab Equipment，晶圆厂设备）指光刻、刻蚀、薄膜、量测、清洗等一整条产线设备，是一个以"年度出货额/区域占比"衡量景气的高频指标。设备商通常按 *"the location where the sale originated"*（销售发起地，通常≈客户总部）来确认区域营收。问题在于：MKS 卖的并不是整机，而是**激光、电源与功率控制、真空、光学、运动控制等子部件**，其直接客户是 AMAT、LAM、TEL 这类设备厂。若按"设备厂总部（美国/日本）"确认，这些收入会被计入"非中国"；若按"最终使用其部件的晶圆厂所在地（中国）"确认，则计入"中国"。MKS 把口径改为 *"end customer（最终客户）shipping location"*，本质是把收入一路归因到终端晶圆厂——这是一种异常间接、且不透明的披露方式。

**2. 为什么这像"掩盖"而非"会计优化"**
行业层面的事实是：美国对华半导体设备/零部件采购正在降温（见第一节）。如果 MKS 维持旧口径，其"中国段"营收本应随行业同步明显下滑。但改用"最终客户"口径后，原本属于中国段的收入被稀释、并入一个更宽泛的新框架，下滑被"抹平"。文章据此做出更大胆的推断：**中国本土设备商可能正在整体撤出对 MKS 等美系供应商的采购**——这才是披露变更的"真凶"，而非单纯的会计美化。

**3. 受影响方与潜在受益方**
- **AEIS（Advanced Energy Industries）**：做半导体制造用的电源与 plasma 功率解决方案，与 MKS 同处"可被替代的美系零部件"位置，因此承压（文中标注 0.00% 持平，但点名"at risk"）。
- **Comet Group（瑞士，SIX: COTN）**：做真空电容、X 射线与 e-beam 检测部件，受美国出口管制敞口更低，可能间接受益于"中国客户转向非美供应商"。
- 顺着这个逻辑，真正的受益者往往是中国本土设备/零部件玩家（如北方华创、中微公司、拓荆、盛美上海等"国产化"主线）——文章虽未点名，但"Chinese toolmakers pulling back from U.S. suppliers"指的就是这一去美化趋势。

**4. 片上液冷（On-chip / Direct-to-Silicon Liquid Cooling）**
当单芯片功耗突破 **1000W**、整机高达 **40%** 的功率消耗在"供流 + 散热"上时，传统强制风冷触及热/能效天花板。TSMC 在 **CoWoS-R（4 SoC + 8 HBM）** 封装里集成**硅基微冷却器（silicon-integrated micro-coolers）**，用 **40°C 的水**直接横扫 reticle（光罩）级封装，可耗散 **3000W+**、翘曲（warpage）极小、热流密度 **>2.5 W/mm²**。相比冷板（cold plate）和导热界面材料（TIM），它把冷却剂直接送到 die（裸芯片）表面。Georgia Tech 更进一步，把冷却结构当成"冷却 chiplet（cooling chiplets）"，用 **TSV（硅通孔）微翅片**嵌入堆叠、并以**混合键合（hybrid bonding）**实现"既散热又供电"。

文章点出一个与光学的深刻类比：**正如 compute-photonics 共封装要把光尽量贴近计算源，热共封装（thermal co-packaging）要把冷却剂尽量贴近热源**——冷却正从"事后补丁"升级为"一等设计约束"。这对理解后续 CPO（共封装光学）同样关键：光引擎和算力都怕热，热设计直接决定可封装密度与良率。

**5. ABF 基板 = CoWoS 的"S"**
ABF（Ajinomoto Build-up Film，味之素积层膜）是倒装与高级封装中的核心载板材料；**CoWoS 之"S"= Substrate（基板）**。ABF 载板长期是先进封装的瓶颈环节，其稼动率与价格常被用作 AI/先进封装需求的前瞻指标。文章借此把"mainstream 复苏"的论点锚定在基板数据上——这恰与本站长期跟踪的 CoWoS 供需主线相互印证。

## 四、与本站其他 CPO / 硅光系列文章的链接

本篇的"液冷→共封装"类比与"ABF=CoWoS 之基"的判断，可与本站以下文章对照阅读：

- [光学共封装入门（第三篇）：Co-Packaged Optics](/posts/optics-primer-part-3-co-packaged/) —— 理解 CoWoS/CPO 封装结构与"把光贴近算力"的底层逻辑。
- [CPO 的幻象（CPO 专题终章）](/posts/the-illusion-of-cpo-cpo-special-final/) —— 从系统层面拆解 CoWoS/CPO 的瓶颈，与本文"散热/基板是一等约束"相互呼应。
- [TSMC 在 CPO 领先，Samsung 第三颗芯片](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) —— 进一步展开 TSMC 在 CoWoS 与先进封装上的位置，正是本文 ABF/基板论点的产业背景。
- [推理芯片架构地图](/posts/the-inference-chip-architecture-map/) —— 看 HBM/SoC 堆叠与功耗密度怎么把"片上液冷"推上议程。

## 五、投资意义

- **WFE 四巨头（AMAT / KLAC / LRCX / TEL）**：中国份额退烧意味着"中国驱动的高增长"叙事边际减弱，需警惕 forward guide 对 China exposure 的下修；但成熟节点 capex 仍稳健，属"增速见顶、非需求崩盘"。
- **MKS（MKSI）**：披露口径变更本身是**盈利质量（earnings quality）红旗**。投资者应回溯其 10-Q，按旧口径还原中国段营收趋势，警惕"用会计口径对冲订单下滑"的风险；若中国本土设备商去美化加速，其中长期成长性与估值溢价都面临重估。
- **Advanced Energy（AEIS）**：同为可替代的美系零部件供应商，处"at risk"名单，需关注其中国区营收趋势。
- **Comet Group（瑞士）**：受美国管制敞口低，可能承接"非美供应链"外溢订单，是潜在的间接受益标的。
- **中国设备/零部件国产化主线（北方华创、中微、拓荆、盛美等）**：若"Chinese toolmakers pulling back from U.S. suppliers"成立，国产化率提升的确定性增强。
- **先进封装与热管理增量环节**：TSMC 片上液冷、TSV 微流控显示——**液冷部件、微通道、载板、hybrid bonding 材料**将随 AI 功耗攀升成为新增量；ABF 载板厂（欣兴、南亚、Ibiden、Shinko 等）若数据确认 mainstream 复苏，存在拐点机会。

## 六、风险提示

- **付费内容缺失**：本文仅含公开可读部分，关键的"substrate 复苏指标"与后续付费专文未包含，关于 ABF/mainstream 复苏的判断缺乏文中的数据支撑，需自行核实。
- **MKS 指控属作者推断**：披露口径变更是否确为"掩盖"尚无公司背书，存在合法会计优化、或客户结构变化的其他解释；下注前应以 10-Q/业绩会口径交叉验证。
- **中国 WFE 数据的季节性**：文章承认部分减速是"库存 binge 后的自然 hangover"，不能简单外推为长期趋势；2026 产能扩张公告亦可能带来订单回升。
- **技术路线不确定性**：片上液冷（含 microfluidic/TSV）仍处实验与早期量产阶段，量产良率、翘曲控制、冷却液可靠性均存不确定性，落地节奏可能慢于叙事。
- **宏观与政策风险**：对华出口管制进一步收紧/放松、AI 资本开支周期波动，都会同时改写 WFE 需求与"去美化"速度两条主线。

*以上解读基于原文信息整理，不构成投资建议。*
