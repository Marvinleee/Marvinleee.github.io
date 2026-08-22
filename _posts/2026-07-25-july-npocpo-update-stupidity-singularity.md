---
layout: post
title: "July NPO/CPO Update: Stupidity Singularity — NPO/CPO 七月更新：激光护城河、VCSEL CPO 与 Nvidia 供应链变局"
date: 2026-07-25 23:38:00 +0800
categories: [半导体投资]
tags: [CPO, NPO, 激光器, VCSEL, Lumentum, 供应链]
description: "Irrational Analysis 对近期 CPO/NPO 舆论噪音的反击：Nvidia 已将 NPO 方案从 TSMC COUPE 临时迁往 Tower Semi 的 SiPho 平台（根因是 TSMC 的 SiN PDK 拖延与 2D 光栅耦合器翻车）；Lumentum 的 UHP 激光器在 NPO 所需的严苛 RIN/线宽规格下几乎无敌，Coherent 已实质失败并仓促转向 MOPA；Ashkan Seyedi 转投 AMS OSRAM 实为押注其封装/集成能力做 scalable 的 VCSEL CPO。英文原文逐字 + 中文深度解读，并与本站激光/CPO 系列互链。"
image: /assets/img/covers/july-npocpo-update-stupidity-singularity.jpg

---

> 本文整理自 **Irrational Analysis（Substack）**，原文发布于 **2026-07-12**（Published Time: 2026-07-12 01:53:09 UTC），作者重仓半导体、长期多头 Lumentum。
> 标题原文：*July NPO/CPO Update: Stupidity Singularity*。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 全文为公开免费内容（无付费墙截断）；文首免责声明为作者原样声明，已如实保留。

---

# 第一部分：正文（Original Article）

*Irrational Analysis is heavily invested in the semiconductor industry.*

*Positions will change over time and are regularly updated.*

***Opinions are authors own and do not represent past, present, and/or future employers.***

*All content published on this newsletter is based on **public information and independent research** conducted since 2011.*

*This newsletter is not financial advice and readers should **always do their own research before investing in any security.***

*Feel free to contact me via email at: irrational_analysis@proton.me*

Quick note on an easy topic as I spend the day watching world cup quarterfinals at a bar.

So many stupid takes on CPO and NPO recently. CoWoS counters have graduated to COUPE counters. Idiots still think Coherent's UHP laser is viable. And Ashkan's legendary career choice is being mis-interpreted.

![Figure: 作者开篇配图（meme/示意图）](https://substack-post-media.s3.amazonaws.com/public/images/53ba4686-39fd-4340-b090-9f27cf13f53b_579x652.png)

Saalam Ashkan! Mobarak!

1. CPO vs NPO: For Dummy Supply-Chain Degenerates
2. Re-affirming Lumentum Superior UHP Laser
3. VCSEL CPO: The Ashkan Arc
4. Jihad Against Jim Anderson

A lot of idiots who understand nothing on the engineering of advanced optics (CPO, NPO) are spouting bullshit while blindly re-gurgitation Taiwan rumor mill.

To be clear, CPO and NPO are conceptually very similar. NPO has worse power efficiency and worse channel density. But the underlying tech is very similar.

TSMC seems to have botched their high-density 2D grating couplers. That issue, alongside delayed SiN PDK development has given a temporary advantage to Tower Semi. Nvidia moved their program from TSMC to Tower and everyone who actually follows this space properly knew 6+ months ago.

The downside of a Tower-based NPO solution is twofold.

1. Lower channel density. (need more wavelengths)
2. Worse power efficiency

#1 is because of longer electrical channel with more reflections (bump capacitance is killer) requiring strong electrical SerDes. More EQ and more complex driver.

#2 is because of the previously mentioned items + exponential laser power and noise requirements. To compensate for fewer channels, modulation speed has to go up. This means SNR requirements go up and laser burden also goes up.

There exists a sweet-spot for datarate of a CPO system between 32G and 64G NRZ. Personally I prefer 64G NRZ but there are arguments for any datarate in that range.

Too slow and your heater power explodes. Too fast and the laser power + SerDes power explodes. These are not linear penalties.

Nvidia has decided to temporarily move away from TSMC COUPE. This is because TSMC has dragged their feet on SiN and (more importantly) botched 2-D grating couplers.

Plan-A was slow-and-wide (~50-64G NRZ) 8-wavelength DWDM on TSMC COUPE CPO.

Plan-B is 200/400G PAM4 on 16-wavelength DWDM on Tower SiPho NPO.

Everyone who follows this space properly knew this 6 months ago. The entities who blindly peddle Taiwan leaks with zero understanding of the underlying technology have been spreading panic derived from their own incompetence.

At higher modulation rate, the noise requirements (RIN, linewidth) of the laser go way up.

![Figure: 高调制速率下激光噪声（RIN/线宽）要求急剧上升的示意图/曲线](https://substack-post-media.s3.amazonaws.com/public/images/f8cac7c8-b12d-43a5-b639-8e3b4215d349_879x1137.png)

Laser linewidth murders the extinction ratio of ring modulators.

This means longer cavity length, bigger InP chip, and new (higher price) SKU for Lumentum. Absolutely fucking nobody other than Lumentum and Broadcom can meet the laser specs needed for Nvidia NPO. Retards, LITE content goes way up with Nvidia moving from CPO to NPO. Reality is the opposite of what you pod monkeys think.

![Figure: Lumentum 激光规格 / NPO 所需激光参数相关幻灯片（其一）](https://substack-post-media.s3.amazonaws.com/public/images/76f12cd4-34e7-461e-9bb6-baabd6693e6d_1011x1535.webp)

![Figure: Lumentum 激光规格 / NPO 所需激光参数相关幻灯片（其二）](https://substack-post-media.s3.amazonaws.com/public/images/54b063d7-ed1d-437e-b5a8-aea141c5839b_906x1535.webp)

You can see I trimmed Tower for risk management reasons but not a single share of Lumentum was sold this year. I dare every institutional investor reading this to short Lumentum. Free market will decide who is right, me (engineering-driven investment analysis) or the fools who parrot Taiwan leaks using ClaudeChatGPT.

The data is public. Only Lumentum's data mind you. Everyone else is a coward who wont publish proper information outside of NDA.

![Figure: Lumentum 公开激光数据幻灯片（输出功率 / 温度 / 噪声）](https://substack-post-media.s3.amazonaws.com/public/images/c05cc8c5-86b3-4e40-bb1f-c2c30a12f178_880x978.png)

Lasers can hit a wide range of power levels depending on the temperature. For example, Lumentum's UHP (ultra-high-power) laser is officially rated for 350mW of output power with a soft cap at 400 mW. You can run it at 450mW but reliability becomes questionable and wall-plug-efficiency (WPE) AKA power conversion efficiency suffers.

The output power and efficiency depends strongly on temperature. Higher temperature means less power and worse efficiency. Most people choose to operate the hot-side of the TEC (thermo-electric-cooler) at 50C and the cold-side at 40C. This provides a good balance between system-level thermal efficiency and laser performance. At OFC 2026, Lumentum's demo was at 30C cold-side TEC setpoint to make themselves look better. I am telling you 40C is the correct (reasonable/realistic) comparison point.

Lumentum also shows public noise data across output power. Nobody else has done this. There is a reason for this.

**I would like every single buy-side and sell-side analyst to print out the above Lumentum slide and request Coherent to share the same data in the same format under the same test conditions.**

I know the answers. No need to send me your notes.

Coherent has failed in the UHP laser market. They know they have failed. This is provable given their roadmap.

There are two ways of making a high-power laser.

1. Make big laser.
2. MOPA

MOPA stands for main-oscillator power-amplifier. Essentially it is a smaller 100mW laser feeding into an amplifier all on the same InP chip.

The benefit is the noise of the final output depends on the smaller 100mW laser and is thus much easier to manage.

The drawback is the monolithic InP chip is much larger and there is significant mode-hop (flickering/instability) risk due to the cavity between the DFB and the SOA.

Furukawa already has a MOPA for UHP market. Coherent is working on it as a pivot given how dogshit their existing 400 mW laser is.

Lumentum and Broadcom are running circles around literally everyone else. There is no Chinese competition. I dont give a fuck what the rumors about JY 300mW DFB are. Show me the linewidth. Show me the cavity length. Show me the WPE curve.

Jim Anderson is bluffing. He has nothing until the MOPA is ready next year and even then it might fail due to mode hops.

Ashkan Seyedi is a very important person. If you worked in optics world, you know who this guy is. He previously was the head of Nvidia optics before Jensen poached Ling Liao from Intel to take over. Ling and Ashkan are both very smart but Ling is sharper IMO.

Within Nvidia, there were two factions. Team ring-modulator (Santa Clara) and team VCSEL CPO (Isreal/Mellanox). Team ring-modulator won last year. Ashkan was a part of team ring. Go look at his academic paper publishing history.

[https://scholar.google.com/citations?hl=en&user=TVhiqXwAAAAJ&view_op=list_works&sortby=pubdate](https://scholar.google.com/citations?hl=en&user=TVhiqXwAAAAJ&view_op=list_works&sortby=pubdate)

His PhD was on GaAs nanowire photodiodes arrays (for micro-LED systems) and all his recent work is on ring-modulator DWDM. Ashkan is a vocal hater of micro-LED.

So when this Nvidia hot-shot defected to a dying euro-poor LED shitco, every optics tourist immediately assumed he has become a micro-LED supporter.

![Figure: 梗图（与 "micro-LED 支持者" 误读相关的调侃）](https://substack-post-media.s3.amazonaws.com/public/images/d6d09b28-1e80-493a-9173-9d65ff54151e_498x451.gif)

Fundamentally what you need to understand is micro-LED and VCSEL CPO/NPO are conceptually very similar. The key delta is max datarate.

LEDs are limited to 2-5 GHz bandwidth, with a (very generous) cap around 10 GHz is the LED people come up with something groundbreaking.

VCSELs meanwhile can hit 50-70GHz bandwidth without issue.

Optics people often ignore electrical reality. I don't give a damn how nice your shitty LEDs are. Having a huge number of lanes and single-digit GHz will result in disastrous EMI and crosstalk. It won't work without a super-heavy FEC on all the hundreds of fucking lanes. Anyone with a basic system-level understanding realizes this immediately.

VCSEL CPO/NPO is literally what micro-LED wishes it could be. Objectively better in every way except cost.

Yes, micro-LED is cheaper. It also does not and never will work at scale so who the fuck cares.

AMS OSRAM is a dying company. They have both LED and VCSEL but in reality most of their business is LED. That existing business (LED lighting) has been annihilated by the Chinese.

**What you have to understand is VCSEL CPO/NPO quality depends on the quality of the packaging, integrated drivers, manufacturing, and yield of the system. The VCSEL quality itself is not that important. Many can make a 32-64G NRZ VCSEL.**

Broadcom is the king of VCSEL. Coherent has very good VCSEL. In fact, Coherent's VCSEL NPO demo at OFC 2026 was excellent.

Lumentum, Furukawa, and many others also have good VCSEL.

My gut feeling is Ashkan saw something in AMS OSRAM historical LED packaging expertise and decided this was his chance to make VCSEL CPO/NPO work at scale. He is very smart. He knows something. I am certain.

They have a packaging/integration ace up their sleeves. Something to take meh internal VCSELS and make a real NPO/CPO solution that can credibly compete with SiPho DWDM rings.

![Figure: 与 AMS OSRAM / VCSEL CPO 封装整合相关的配图](https://substack-post-media.s3.amazonaws.com/public/images/c529a6ce-fcb4-41c3-9ce8-9968a9c9ea78_886x736.png)

I am not short COHR.

It's just I don't like their CEO.

Trash talking semis CEOs amuses me.

A particular moment in the last earnings call highlights why I do not like Jim Anderson.

![Figure: 财报电话会截图（Citi 分析师追问收发器毛利率的相关段落）](https://substack-post-media.s3.amazonaws.com/public/images/562c8fc2-a64a-4799-9559-339149f50fcd_1363x694.png)

The entire point of SiPho transceiver over EML is to sacrifice modulation performance in favor of saving money by reducing InP content. Historically, every datarate transition (100G to 400G to 800G to 1.6T) resulted in the same pattern. EML first because it has the best performance. Then 6-18 months later SiPho transceivers show up (usually from the Chinese) that are good enough performance but meaningfully cheaper.

This market is different. InP shortage is so fucked, SiPho took majority share much earlier.

THE GROSS MARGINS OF EML BASED AND SIPHO BASED TRANCEIVERS SHOULD NOT BE THE SAME. SOMETHING IS VERY WRONG. EITHER LUMENTUM IS OBLITERATING YOU BY SPIKING EML PRICES CAUSE YOUR 6-IN INP PROCESS IS BROKEN OR YOUR ACTIVE ALIGNMNET YIELD OF SIPHO TRANCEIVERS IS HORRENDUS. OR MAYBE BOTH.

Jim Andersion has been CEO of Coherent for 2 years and he still lacks a basic understanding of the business he is running.

I'm pretty sure sell-side knows more about the business. That's why the Citi dude asked the question. He probably has followed optics for many years and knows the gross-margin profile of different types of transceivers.

So when the same dude who does not understand transceiver basics claims he has a viable UHP CW laser for CPO/NPO, yea I don't fucking believe him.

Print out the Lumentum slide showing detailed data on UHP laser and ask Jim Andersion to share the same data in the same format under the same conditions.

Ask him how GR-468 qualification of 200G VCSEL devices is going.

Ask him why EML and SiPho transceivers have the same gross margin.

Ask him what the relative yield of 200G EML on 3-in and 6-in is.

Ask him what the relative yield of 100/250/400mW CW laser on 3-in and 6-in is.

---

# 第二部分：解析（深度解读）

> 注：以下为中文深度解读，系基于作者公开观点与本站既有技术文章的归纳，不构成投资建议。作者本人重仓 Lumentum、年内未减一股，观点有明显持仓偏置，阅读时请保持独立判断。

## 一、核心论点摘要

作者（Irrational Analysis，重仓半导体、长期多头 Lumentum）对近期 CPO/NPO 圈的"噪音"开火。可压缩为五条判断：

1. **Nvidia 已把 NPO 方案从 TSMC COUPE 临时迁到 Tower Semi 的 SiPho 平台**——这件事业内 6 个月前就已知晓，但台湾泄密链的解读全是恐慌性胡说。
2. **根因**：TSMC 在 SiN PDK 上拖延，且把高密度 2D 光栅耦合器（grating coupler）搞砸了；NPO（而非 CPO）是退而求其次的 Plan-B。
3. **Lumentum 的 UHP（超高效率）激光器**在 NPO 所需的更严苛 RIN/线宽规格下几乎无敌；除 Lumentum 与 Broadcom 外无人能达标。Coherent 的 UHP 激光已实质失败，正仓促转向 MOPA。
4. **Ashkan Seyedi（前 Nvidia 光学的核心人物）跳槽到 AMS OSRAM**，不是去搞 micro-LED，而是看中其历史 LED 封装/集成能力，意图做 scalable 的 VCSEL CPO/NPO——VCSEL 本身不难，封装与集成才是关键，而 Broadcom 是 VCSEL 之王。
5. **投资结论**：强烈看多 Lumentum（年内一股未卖），看空/不信任 Coherent 的 UHP 叙事；嘲讽 Jim Anderson 不懂收发器基本面。

## 二、关键概念解读

- **CPO vs NPO**：概念相近，NPO 在能效与通道密度上更差，但底层技术相似。NPO 用更长电通道、更多反射（bump 电容是杀手），需要更强的电 SerDes、更多均衡与更复杂驱动。
- **COUPE / 2D 光栅耦合器**：TSMC 的 CPO 硅光平台；2D 光栅耦合器是光纤—芯片耦合效率的关键，TSMC 在此翻车，给了 Tower 临时优势。
- **DWDM 波长数**：CPO（Plan-A）用 8 波长 ~50–64G NRZ；Tower NPO（Plan-B）用 16 波长 200/400G PAM4，以更多波长弥补单通道密度不足。
- **速率甜区 32G–64G NRZ**：太慢 → heater 功耗爆炸；太快 → 激光 + SerDes 功耗爆炸；二者都是非线性惩罚。
- **UHP 激光与线宽**：高调制速率下 RIN/线宽要求急剧上升；线宽会"谋杀"环形调制器的消光比 → 需要更长腔长、更大 InP 芯片、更贵 SKU。这正是 Lumentum 的护城河。
- **MOPA（主振荡功率放大）**：小 100mW 激光喂入同 InP 芯片上的放大器，噪声由小激光决定、更易控；缺点是单片 InP 更大、DFB 与 SOA 间有 mode-hop（跳模）风险。Furukawa 已有，Coherent 正 pivot。
- **VCSEL vs micro-LED**：VCSEL 50–70GHz 带宽轻松；micro-LED 仅 2–5GHz（上限 ~10GHz）。micro-LED 多 lane + 单 GHz 会带来灾难性 EMI/串扰，需超强 FEC。VCSEL CPO 是 micro-LED "想成为却做不到"的形态——除成本外全面更优，但 micro-LED 永远无法规模落地。
- **EML vs SiPho 收发器毛利率**：历史上 SiPho 用更少 InP 换更便宜，毛利率应低于 EML；二者毛利率相同"非常不对"——要么 Lumentum 靠 EML 涨价碾压，要么 Coherent 的 SiPho 主动对准良率稀烂，或两者皆是。

## 三、分层拆解：谁受益 / 谁承压

| 主体 | 作者判断 | 关键依据 |
| --- | --- | --- |
| **Lumentum (LITE)** | 强多头，内容权重随 NPO 上升 | UHP 激光规格独家、公开噪声数据、更长腔长 SKU |
| **Broadcom** | 与 Lumentum 并列唯二达标 | VCSEL 之王 + 激光规格达标 |
| **Tower Semi** | 临时受益（Nvidia NPO 迁移） | TSMC 光栅耦合器翻车 |
| **Coherent (COHR)** | 看空 UHP 叙事、质疑 CEO | UHP 激光失败转 MOPA、毛利率异常 |
| **AMS OSRAM** | 看中其封装整合能力（Ashkan 押注） | LED 封装历史 + 整合 ace |
| **Furukawa** | MOPA 已就绪 | UHP MOPA 供货 |
| **中国厂商（JY 等）** | 质疑 300mW DFB 传闻 | 要求亮线宽 / 腔长 / WPE 曲线 |
| **TSMC** | 短期受挫（SiN 拖延 + 光栅翻车） | Nvidia 迁出 COUPE |

## 四、技术趋势与供应链含义

- **Nvidia 的 CPO/NPO 路线从 TSMC 的 COUPE 临时退到 Tower 的 SiPho NPO**，凸显硅光 PDK 成熟度（SiN、光栅耦合器）的决定性作用；一旦 COUPE/SiN 补齐，Plan-A（高密度 CPO）仍可能回归。
- **"激光规格"正成为 CPO/NPO 最硬的瓶颈与护城河**：不是谁有 InP 产能，而是谁能交付低 RIN / 窄线宽 / 高 WPE 的 CW 激光。这也解释了为何作者敢让买方/卖方分析师拿着 Lumentum 幻灯片去逼 Coherent 公开同口径数据。
- **VCSEL CPO 的胜负手在封装与系统化集成，而非 VCSEL 芯片本身**——这解释了 Ashkan 为何去 AMS OSRAM 而非纯 VCSEL 厂：看中的是其历史 LED 封装/集成能力，用"还行的内部 VCSEL + 一流封装"去正面对抗 SiPho DWDM 环形调制方案。

## 五、与本站其他文章的连接

- [Lumentum 激光技术解析：InP 平台（系列 Part 1）](/posts/lasers-for-cponpo-part-1-the-inp/) 与 [Lumentum 的 UHP 技术与护城河（系列 Part 2）](/posts/lasers-for-cponpo-part-2-lumentums-tech-and-moat/)：本篇是 Part 2 中"UHP 规格护城河"的市场侧印证。
- [CPO 特别终章：CPO 的幻象](/posts/the-illusion-of-cpo-cpo-special-final/)：Nvidia 路线变动与"CPO 是否真能落地"的互证。
- [TSMC 在 CPO 领先，Samsung 居第三](/posts/tsmc-ahead-in-cpo-samsung-third-chip/)：TSMC 光栅耦合器翻车后的格局变化。
- [硅光链路预算与光非理想性](/posts/silicon-photonics-link-budget-and-optical-nonidealities/)：RIN / 线宽 / 消光比等损耗项的技术底稿。
- [光学入门 Part 3：共封装光学](/posts/optics-primer-part-3-co-packaged/)：CPO/NPO 概念基础。

## 六、风险提示

- **持仓偏置**：作者明确重仓 Lumentum、年内未卖一股，观点自带多头立场；非投资建议。
- **信息源质量**："台湾泄密链"信息参差，本篇是对其的**反驳**而非中立事实；Coherent 的 MOPA 若明年成功且规避 mode-hop，叙事可能反转。
- **数据口径**：作者称仅 Lumentum 公开了完整激光数据，其余厂商在 NDA 外不披露，结论依赖单一信源的可信度。
- **监管/良率**：GR-468 认证、3-inch / 6-inch InP 良率、主动对准良率等仍是悬而未决的变量，文中多处为作者断言而非已验证事实。