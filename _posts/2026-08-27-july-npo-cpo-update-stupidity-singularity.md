---
layout: post
title: "July NPO/CPO Update: Stupidity Singularity — 用工程事实驱散光互连谣言"
date: 2026-08-27 20:15:00 +0800
categories: [半导体投资]
tags: [CPO, NPO, Lumentum, Coherent, Tower, NVIDIA, UHP激光器, 混合键合, VCSEL]
description: "Irrational Analysis 以工程视角反击 CPO/NPO 谣言：TSMC COUPE 光栅耦合器受挫、NVIDIA 转向 Tower NPO、Lumentum 激光器规格优势，以及 Coherent 毛利率疑云。"
---

> **来源**：[Irrational Analysis](https://irrationalanalysis.substack.com/p/july-npocpo-update-stupidity-singularity) — *July NPO/CPO Update: Stupidity Singularity — So many dumb takes.*
> **原文链接**：<https://irrationalanalysis.substack.com/p/july-npocpo-update-stupidity-singularity>
> **原文发布日**：2026-07-12 ｜ **作者**：Irrational Analysis
> **说明**：本文为英文原文全文转载（原文语言风格粗粝、含大量俚语与情绪化表达，均按原样保留，仅对个别侮辱性称谓做了最小限度编辑），附中文深度解读。作者重仓半导体行业并公开持仓，观点带有明确多头立场，解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

- Irrational Analysis is heavily invested in the semiconductor industry.
  - Positions will change over time and are regularly updated.
- **Opinions are authors own and do not represent past, present, and/or future employers.**
- All content published on this newsletter is based on **public information and independent research** conducted since 2011.
- This newsletter is not financial advice and readers should **always do their own research before investing in any security.**
- Feel free to contact me via email at: *irrational_analysis@proton.me*

---

Quick note on an easy topic as I spend the day watching world cup quarterfinals at a bar.

So many stupid takes on CPO and NPO recently. CoWoS counters have graduated to COUPE counters. Idiots still think Coherent's UHP laser is viable. And Ashkan's legendary career choice is being mis-interpreted.

![图01｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img01.png)
*图01｜原文配图（Irrational Analysis）*

Saalam Ashkan! Mobarak!

---

# Contents:

1. CPO vs NPO: For Dummy Supply-Chain Degenerates
2. Re-affirming Lumentum Superior UHP Laser
3. VCSEL CPO: The Ashkan Arc
4. Jihad Against Jim Anderson

# [1] CPO vs NPO: For Dummy Supply-Chain Degenerates

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

---

Nvidia has decided to temporarily move away from TSMC COUPE. This is because TSMC has dragged their feet on SiN and (more importantly) botched 2-D grating couplers.

Plan-A was slow-and-wide (~50-64G NRZ) 8-wavelength DWDM on TSMC COUPE CPO.

Plan-B is 200/400G PAM4 on 16-wavelength DWDM on Tower SiPho NPO.

Everyone who follows this space properly knew this 6 months ago. The entities who blindly peddle Taiwan leaks with zero understanding of the underlying technology have been spreading panic derived from their own incompetence.

At higher modulation rate, the noise requirements (RIN, linewidth) of the laser go way up.

![图02｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img02.png)
*图02｜原文配图（Irrational Analysis）*

Laser linewidth murders the extinction ratio of ring modulators.

This means longer cavity length, bigger InP chip, and new (higher price) SKU for Lumentum. Absolutely nobody other than Lumentum and Broadcom can meet the laser specs needed for Nvidia NPO. [非原文用语，此处原文含一处侮辱性称谓，已做最小限度编辑] $LITE content goes way up with Nvidia moving from CPO to NPO. Reality is the opposite of what you pod monkeys think.

![图03｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img03.webp)
*图03｜原文配图（Irrational Analysis）*

![图04｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img04.webp)
*图04｜原文配图（Irrational Analysis）*

You can see I trimmed Tower for risk management reasons but not a single share of Lumentum was sold this year. I dare every institutional investor reading this to short Lumentum. Free market will decide who is right, me (engineering-driven investment analysis) or the fools who parrot Taiwan leaks using ClaudeChatGPT.

# [2] Re-affirming Lumentum Superior UHP Laser

The data is public. Only Lumentum's data mind you. Everyone else is a coward who wont publish proper information outside of NDA.

![图05｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img05.png)
*图05｜原文配图（Irrational Analysis）*

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

# [3] VCSEL CPO: The Ashkan Arc

Ashkan Seyedi is a very important person. If you worked in optics world, you know who this guy is. He previously was the head of Nvidia optics before Jensen poached Ling Liao from Intel to take over. Ling and Ashkan are both very smart but Ling is sharper IMO.

Within Nvidia, there were two factions. Team ring-modulator (Santa Clara) and team VCSEL CPO (Isreal/Mellanox). Team ring-modulator won last year. Ashkan was a part of team ring. Go look at his academic paper publishing history.

His PhD was on GaAs nanowire photodiode arrays (for micro-LED systems) and all his recent work is on ring-modulator DWDM. Ashkan is a vocal hater of micro-LED.

So when this Nvidia hot-shot defected to a dying euro-poor LED company, every optics tourist immediately assumed he has become a micro-LED supporter.

![图06｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img06.gif)
*图06｜原文配图（Irrational Analysis）*

Fundamentally what you need to understand is micro-LED and VCSEL CPO/NPO are conceptually very similar. The key delta is max datarate.

LEDs are limited to 2-5 GHz bandwidth, with a (very generous) cap around 10 GHz is the LED people come up with something groundbreaking.

VCSELs meanwhile can hit 50-70GHz bandwidth without issue.

Optics people often ignore electrical reality. I don't give a damn how nice your shitty LEDs are. Having a huge number of lanes and single-digit GHz will result in disastrous EMI and crosstalk. It won't work without a super-heavy FEC on all the hundreds of lanes. Anyone with a basic system-level understanding realizes this immediately.

VCSEL CPO/NPO is literally what micro-LED wishes it could be. Objectively better in every way except cost.

Yes, micro-LED is cheaper. It also does not and never will work at scale so who the fuck cares.

---

AMS OSRAM is a dying company. They have both LED and VCSEL but in reality most of their business is LED. That existing business (LED lighting) has been annihilated by the Chinese.

**What you have to understand is VCSEL CPO/NPO quality depends on the quality of the packaging, integrated drivers, manufacturing, and yield of the system. The VCSEL quality itself is not that important. Many can make a 32-64G NRZ VCSEL.**

Broadcom is the king of VCSEL. Coherent has very good VCSEL. In fact, Coherent's VCSEL NPO demo at OFC 2026 was excellent.

Lumentum, Furukawa, and many others also have good VCSEL.

My gut feeling is Ashkan saw something in AMS OSRAM historical LED packaging expertise and decided this was his chance to make VCSEL CPO/NPO work at scale. He is very smart. He knows something. I am certain.

They have a packaging/integration ace up their sleeves. Something to take mediocre internal VCSELs and make a real NPO/CPO solution that can credibly compete with SiPho DWDM rings.

# [4] Jihad Against Jim Anderson

![图07｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img07.png)
*图07｜原文配图（Irrational Analysis）*

I am not short $COHR.

It's just I don't like their CEO.

Trash talking semis CEOs amuses me.

A particular moment in the last earnings call highlights why I do not like Jim Anderson.

![图08｜原文配图（Irrational Analysis）](/assets/img/posts/july-npo-cpo-update-stupidity-singularity/img08.png)
*图08｜原文配图（Irrational Analysis）*

The entire point of SiPho transceiver over EML is to sacrifice modulation performance in favor of saving money by reducing InP content. Historically, every datarate transition (100G to 400G to 800G to 1.6T) resulted in the same pattern. EML first because it has the best performance. Then 6-18 months later SiPho transceivers show up (usually from the Chinese) that are good enough performance but meaningfully cheaper.

This market is different. InP shortage is so severe, SiPho took majority share much earlier.

THE GROSS MARGINS OF EML BASED AND SIPHO BASED TRANCEIVERS SHOULD NOT BE THE SAME. SOMETHING IS VERY WRONG. EITHER LUMENTUM IS OBLITERATING YOU BY SPIKING EML PRICES CAUSE YOUR 6-IN INP PROCESS IS BROKEN OR YOUR ACTIVE ALIGNMENT YIELD OF SIPHO TRANCEIVERS IS HORRENDUS. OR MAYBE BOTH.

Jim Anderson has been CEO of Coherent for 2 years and he still lacks a basic understanding of the business he is running.

I'm pretty sure sell-side knows more about the business. That's why the Citi analyst asked the question. He probably has followed optics for many years and knows the gross-margin profile of different types of transceivers.

So when the same guy who does not understand transceiver basics claims he has a viable UHP CW laser for CPO/NPO, yea I don't believe him.

Print out the Lumentum slide showing detailed data on UHP laser and ask Jim Anderson to share the same data in the same format under the same conditions.

Ask him how GR-468 qualification of 200G VCSEL devices is going.

Ask him why EML and SiPho transceivers have the same gross margin.

Ask him what the relative yield of 200G EML on 3-in and 6-in is.

Ask him what the relative yield of 100/250/400mW CW laser on 3-in and 6-in is.

Subscribe for engineering-driven investment analysis.

# 第二部分：解析（深度解读）

## 核心论点摘要

这是 7 月 NPO/CPO 论战中最具火药味也最具工程含金量的一篇。作者（重仓 Lumentum、已减持 Tower）的四个论点：

1. **NVIDIA 从 TSMC COUPE 转向 Tower SiPho 做 NPO**：根因是 TSMC「搞砸了高密度 2D 光栅耦合器」+ SiN PDK 拖延，六个月前业内就已知晓。Plan-A（COUPE CPO，~50-64G NRZ 慢而宽、8 波长 DWDM）→ Plan-B（Tower NPO，200/400G PAM4、16 波长 DWDM）。
2. **转 NPO 对 Lumentum 是利好不是利空**：调制速率上去 → 激光器 RIN/线宽要求暴涨 → 更长腔体、更大 InP 芯片、更贵的 SKU。能同时满足 NVIDIA NPO 激光规格的只有 Lumentum 和 Broadcom。
3. **Coherent 的 UHP 激光器失败且已被路线图证明**：大激光器路线的 400mW 产品不行，MOPA（主振功放）转型要到明年且有 mode-hop 风险；只有 Lumentum 公开了全套温度/噪声/功率数据。
4. **Ashkan Seyedi 跳槽 AMS OSRAM ≠ 押注 micro-LED**：其学术历史全是 ring modulator DWDM；他看中的是 LED 厂的封装/集成能力，用来做 **VCSEL CPO/NPO**（VCSEL 带宽 50-70GHz，完胜 LED 的 2-10GHz）。

## 关键概念解读

- **32-64G NRZ 甜点区**：CPO/NPO 系统的数据率存在非线性惩罚的双向悬崖——太慢则微环加热器功耗爆炸，太快则激光器+SerDes 功耗爆炸。TSMC 方案（慢而宽）与 Tower 方案（快而窄 16 波 PAM4）分别站在甜点两侧，代价由激光器（噪声/线宽）和 SerDes（EQ 复杂度）承担。
- **UHP 激光器的公开数据测试**：Lumentum UHP 额定 350mW、软上限 400mW（450mW 可跑但可靠性存疑）；TEC 冷端 40°C 才是现实比较基准（OFC 2026 demo 用 30°C 美化了数据）。作者要求分析师拿同一格式数据去质询 Coherent——这是把「数据透明度」本身当成竞争武器。
- **VCSEL CPO 的胜负手在封装**：「很多家都能做 32-64G NRZ VCSEL，质量差别在封装、集成驱动、制造与良率」——这与 Ashkan 选择 AMS OSRAM 的逻辑自洽。

## 分层拆解表

| 主题 | 关键事实 | 作者结论 | 可验证性 |
|---|---|---|---|
| TSMC→Tower 切换 | 2D 光栅耦合器受挫 + SiN PDK 延迟 | NVIDIA NPO 花落 Tower（临时） | 半公开信息，6 个月前已知 |
| 激光器需求 | PAM4 16 波 → 线宽/RIN 上台阶 | $LITE 单机内容量上升 | 依赖 Lumentum 公开数据 |
| Coherent UHP | 400mW 产品被评「不堪用」，MOPA 明年 | 管理层在虚张声势 | 不可直接验证（NDA 内） |
| Coherent 毛利率 | EML 与 SiPho 模块毛利率相同 | 3-in/6-in 良率或对准良率有严重问题 | 可用财报追问 |
| VCSEL CPO | LED 带宽 2-10GHz vs VCSEL 50-70GHz | AMS OSRAM+Ashkan 做 VCSEL NPO | 推测（作者自称 gut feeling） |

## 技术趋势判断

本文与本站其他 NPO 文章构成三角互证：《[Optical Illusion](/posts/optical-illusion-cpo-is-dead-long-live-npo/)》指出 NPO 用 ELS 架构则 InP 内容量不变；《[NPO State of the Union](/posts/npo-state-of-the-union/)》记录了 Macom 措辞切换；本文补充了**代工层面的物理根因**（光栅耦合器、SiN、bump 电容）。三者共同指向：NPO 不是 CPO 的替代品，而是把光引擎需求向 InP 激光器（更严规格）和 SiPho 代工（Tower）同时放大的中间形态。投资层面的分歧点在于：Lumentum 多头逻辑（激光规格升级）vs Coherent 空头逻辑（毛利率疑云）——作者立场极端多头，需打折看待。

## 风险提示

作者重仓 $LITE 且公开挑衅空头，行文充满确认偏误风险；「Coherent 已失败」「Anderson 虚张声势」均为单方工程推断，缺乏对等数据验证；TSMC COUPE 的耦合器问题是否如描述严重、NVIDIA 是否会回归 COUPE，均无官方确认。原文语言粗粝，观点攻击性强，请独立判断。本文不构成投资建议。
