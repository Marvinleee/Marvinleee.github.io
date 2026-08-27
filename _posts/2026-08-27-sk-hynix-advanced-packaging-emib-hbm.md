---
layout: post
title: "SK Hynix Unpacks Advanced Packaging for Next-Gen HBM — 先进封装通往 3D 时代的路线图"
date: 2026-08-27 20:00:00 +0800
categories: [先进封装]
tags: [SK hynix, HBM, 先进封装, EMIB, 混合键合, Hot Chips 2026, 英特尔]
description: "SK hynix 在 Hot Chips 2026 上系统拆解 HBM 先进封装：TC+NCF 对阵 MR-MUF、混合键合超越 16-Hi、I-HBM 热点散热，并罕见地展示了与 Intel EMIB 的合作可能。"
---

> **来源**：[Wccftech](https://wccftech.com/sk-hynix-advanced-packaging-technologies-intel-emib-next-gen-hbm-memory/) — *SK Hynix Unpacks Advanced Packaging Technologies, Including Intel EMIB, For Its Next-Gen HBM Memory As It Eyes 3D Structures For The Future*
> **原文链接**：<https://wccftech.com/sk-hynix-advanced-packaging-technologies-intel-emib-next-gen-hbm-memory/>
> **原文发布日**：2026-08-23 ｜ **作者**：Hassan Mujtaba（Wccftech 高级编辑）
> **说明**：本文为英文原文全文转载，附中文深度解读。原文配图（Hot Chips 2026 演讲幻灯片）因源站图片接口在本机网络环境不可达，未能本地化转载，如需查看原图请访问原文链接；解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

SK Hynix is leveraging advanced packaging technologies such as Intel's EMIB for its next-gen HBM solutions, which will eventually enter the 3D packaging stage.

## Scaling HBM Comes With Big Challenges & SK Hynix Is Leveraging Advanced Packaging Solutions To Address Them As It Ventures Into The 3D Era

At Hot Chips 2026, [Jaesik Lee](https://www.linkedin.com/in/jaesik-lee-44306521/) (VP Package Engineering at SK Hynix) presented the "Advanced Packaging for High-Bandwidth Memory" brief, which talks about how the company plans to leverage advanced packaging tech to accelerate its HBM roadmap.

The company started by presenting how HBM is currently built. The HBM structure consists of a 3D stacked structure that connects multiple core dies (DRAM ICs) to a base die using TSVs. HBM can currently reach a maximum height of 16 slices, or a 16-Hi stack.

There are four slices per rank, & a 16-Hi stack includes 4-ranks. There are four channels per slice, and these incorporate a total of 16 banks. The HBM and GPU are separate chips but are mounted on the same silicon interposer using 2.5D packaging. Each HBM module also contains 1024 IOs with 16-channels through the Si interposer. These connect the HBM stack to the XPU through a PHY.

HBM is important as a DRAM solution because it saves space, power, and operating cost. A typical GDDR6 solution will carry 24 GB and 768 GB/s bandwidth, while an HBM3E solution with four stacks saves up to half the space while offering up to 144 GB capacity and 4 TB/s bandwidth.

SK Hynix's current roadmap includes [HBM4 as the top-of-the-line product](https://wccftech.com/sk-hynix-samples-hbm4e-memory-48-gb-capacity-16-gbps-speeds/) with up to 24 Gb DRAM densities, leading up to 36 GB capacities, a total of 2048 IO bits, up to 8 Gbps IO speeds, and 2048 GB/s bandwidth.

HBM4 comes with increased package height and size. It also integrates more TSVs & micro bumps than HBM3E. The result is:

- >2 TB/s bandwidth
- 40+% Lower Power Efficiency
- 14+% improvement in thermal resistance than HBM3E
- Up to 48 GB capacity (12-Hi in production, 16-Hi under qualification)
- 775um Z-Height, 12.8x11mm2
- 16,148 Base Micro-Bumps
- >20K TSVs

Currently, there are two main HBM packaging technologies: Thermo-Compression + Non-Conductive Film (TC+NCF), and Mass Reflow + Molded Underfill (MR+MUF). TC+NCF allows better resistance to die warpage issues but has higher thermal resistivity and lower productivity. MR+MUF offers higher productivity and low thermal resistivity but is more susceptible to chip warpage and also has gap fill drawbacks.

SK Hynix also highlights its HBM Process Flow, which includes six key stages from Fab to customer systems:

There are four key technologies that SK Hynix integrates within its HBM package; these include:

- Via (TSV) Formation
- Wafer Thining
- u-Bump Formation
- Chip Stack/Underfill

Advanced MR-MUF is already being leveraged by SK Hynix for its [16-Hi HBM3E solution](https://wccftech.com/sk-hynix-unveils-industrys-first-16-hi-hbm3e-memory-up-to-48-gb-per-stack-pcie-6-0-ssds-also-in-the-works/) with two new technologies: Warpage Control and Fine Pitch Int'n & Narrow Gap-fill. The total package height is increased to 775 microns while chip thickness is shrunk to 0.9x, gap height is reduced to 0.5x, and bump pitch is reduced to 0.9x.

However, moving forward, there are some key challenges that need to be addressed. First is the increase in HBM Power as bandwidth demand swells, and the second is the thermal issue along with the TSV Area. As the number of TSVs grows, the area continues to increase despite the TSV Pitch size shrinking. Furthermore, a near doubling of bandwidth every two generations puts a 2.2x thermal burden on existing processes and packaging technologies.

So SK Hynix is looking into future methodologies such as Hybrid Bonding to go beyond 16-Hi stacks, offering more performance through a narrower pitch, & offering better thermal efficiency through higher conductivity.

SK Hynix shows that Hybrid Bonding achieves a 24% thicker core die and a TSV pitch size of <18 microns versus MR-MUF processes. And even with an increased number of stack layers, Hybrid Bonding has 35% lower thermal resistance.

Like Samsung's HPB (Heat Path Block), SK Hynix is working on its own localized hotspot mitigation tech called I-HBM, which embeds a high-thermal-conductivity and electrically insulating cooling component within the HBM D2D PHY area (near the hotspot), creating a dedicated heat path that offers an additional >30% reduction in thermal resistance.

Looking ahead, SK Hynix is looking to increase bandwidth through doubling of TSVs and higher IO speed with logic process integration, while power/PDN challenges will be addressed using the latest and optimized logic foundry processes with power TSVs spreading "everywhere" to greatly improve PDN.

The relentless push for higher power density, bandwidth, and stack heights in HBM technology brings significant thermal, mechanical, and packaging challenges, driven by thicker oxide layers, denser TSVs, and rising pin speeds.

Innovations such as MLMO, optimized micro-bumps, emerging hybrid bonding (for improved thermal conductivity, process margins, and finer pitches), and hotspot solutions like IHBM are actively addressing these issues. Yet as stacks move toward 16–20 high and architectures evolve toward closer 3D integration with logic, success will demand even tighter co-optimization of design, materials, customer processes, and interposer technologies. Continued collaboration across the industry remains essential to meet future workload demands for both capacity and bandwidth.

The company also teased [Intel EMIB packaging technology](https://wccftech.com/intel-emib-t-breaks-past-existing-ai-hpc-scaling-limits-enabling-ultra-large-die-complexes/) in its 2.5D HBM solution slide alongside CoWoS-L, CoWoS-R, & CoWoS-S. Do note that Intel and SK Hynix are rumored to be involved in a [JV on the memory front](https://wccftech.com/intel-references-sk-hynixs-ex-ceo-when-discussing-its-memory-plans-fueling-the-28-billion-ohio-fab-jv-rumors/).

SK Hynix also showcased how different advanced packaging technologies stress on HBM/Interposer in different ways. And finally, SK Hynix is looking ahead with 3D integration in mind, which would allow them to stack HBM on top of accelerators, a move that everyone wants to make once advanced logic and advanced packaging technologies mature.

# 第二部分：解析（深度解读）

## 核心论点摘要

SK hynix 这场 Hot Chips 2026 演讲（Jaesik Lee，封装工程副总裁）本质上是一份「HBM 封装技术全景路线图」：从当下 16-Hi MR-MUF 的物理极限，到混合键合（Hybrid Bonding）打开 20-Hi 时代的大门，再到最终把 HBM 直接摞到加速器顶上的 3D 集成。三个关键信号值得投资者与工程师注意：

1. **MR-MUF 的护城河有时限**。SK hynix 靠 MR-MUF 在 HBM3E 世代建立了对三星（TCB）的良率与散热优势，但演讲自己承认：一旦行业切换到混合键合，各家回到同一起跑线，竞争将回到执行层面。
2. **热问题取代密度问题成为主矛盾**。带宽每两代翻一倍，热负载是 2.2 倍增长；TSV 数量增长挤占面积；I-HBM（在 D2D PHY 热点区嵌入导热绝缘组件）是对三星 HPB 的对位回应——>30% 热阻削减。
3. **Intel EMIB 出现在 SK hynix 的 2.5D 解决方案幻灯片上**，与 CoWoS-L/R/S 并列。结合两家 280 亿美元俄亥俄合资厂传闻，这是「存储一哥 × 封装产能多元化」叙事的又一块拼图。

## 关键概念解读

- **TC+NCF vs MR-MUF**：两条 HBM 堆叠工艺路线的核心权衡是「抗翘曲 vs 低热阻/高产能」。三星用 TCB+NGF（非导电膜），SK hynix 用批量回流+塑封底填。16-Hi 时代 MR-MUF 需把封装高度放宽到 775μm（JEDEC 已为此修订标准），芯片减薄至 0.9x、间隙高度压到 0.5x——工艺窗口越来越窄。
- **混合键合的量化优势**：核心die可增厚 24%（更多硅=更好散热与容量），TSV pitch <18μm，即使堆叠层数增加热阻仍低 35%。这是超越 16-Hi 的必经之路，也是 SK hynix 自己「护城河失效」的时点。
- **逻辑工艺基die**：演讲提到 PDN 挑战要用「最新优化的代工逻辑工艺+power TSV 到处铺」来解决——印证了行业趋势：HBM base die 正从 DRAM 工艺转向逻辑工艺（台积电 N4/N5 或 Intel 代工），这与本站《[Hot Chips 2026 存储三巨头](/posts/hot-chips-2026-memory-vibes/)》中三星的论述形成呼应。
- **3D 集成终局**：HBM 堆在加速器正上方（类三星 zHBM 概念），距离缩短到毫米级，带宽从「海岸线」扩展到「整个芯片面积」。

## 分层拆解表

| 层面 | 现状（HBM4 世代） | 演讲给出的下一步 | 受益/受损方 |
|---|---|---|---|
| 堆叠工艺 | MR-MUF 12-Hi 量产、16-Hi 认证中 | 混合键合（<18μm pitch） | 键合设备商（BESI/AMAT）；MR-MUF 材料链承压 |
| 散热 | 封装级解热，热阻改善 14%+ | I-HBM 嵌入式热点导热（>30%） | 与三星 HPB 对位；金刚石/石墨导热材料商 |
| 互连密度 | >20K TSV、16,148 微凸点 | TSV 翻倍 + IO 提速 + 逻辑工艺 base die | 代工厂（台积电/Intel）承接 base die 订单 |
| 2.5D 集成 | CoWoS-S/L/R 为主 | EMIB 与 CoWoS 并列出现 | Intel 先进封装获得存储大客户背书 |
| 终局 | XPU+HBM 同 interposer | HBM 3D 堆叠于加速器之上 | 依赖混合键合成熟度与成本曲线 |

## 技术趋势判断

「带宽每两代翻倍 → 2.2x 热负载」这条公式是整篇演讲的物理约束主线。它解释了为什么三大原厂同时在推：①更厚核心die（硅即散热器）；②嵌入式导热路径（HPB/I-HBM/ICE）；③逻辑工艺 base die（更小 PHY 面积=更低热密度）。同时也暗示了一个投资层面的反直觉结论：**HBM 的竞争焦点正从「谁能堆得高」转向「谁能把热带走」**——散热与键合设备的资本开支弹性可能大于 DRAM 本身。

## 与本站其他文章的连接

- 三星 zHBM 与 base die 逻辑化：《[The Battle for the Next AI Memory Architecture](/posts/the-battle-for-the-next-ai-memory/)》
- Hot Chips 2026 三大原厂同台对比（含 MR-MUF vs TCB 热阻幻灯片）：《[Hot Chips 2026: Tuning into Memory Vibes](/posts/hot-chips-2026-memory-vibes/)》
- Intel EMIB 突破 AI/HPC 扩展极限的技术背景：参见原文内链

## 风险提示

EMIB 合作与俄亥俄合资厂目前仍属传闻范畴（Wccftech 明确标注 rumor）；混合键合量产良率与成本尚无公开数据；3D 堆叠 HBM 依赖客户（NVIDIA/AMD）架构配合，落地时点存在不确定性。本文不构成投资建议。
