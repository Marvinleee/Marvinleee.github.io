---
layout: post
title: "推进光互连以满足 AI 计算需求：近封装光学 — 华为推动 OIF NPO 标准化与首个 7.2T NPO 模块"
date: 2026-09-15 09:35:00 +0800
categories: [光互联]
tags: [NPO, CPO, DPO, 光互联, 华为, OIF, 标准化, 7.2T, Linear Direct Drive, AI基础设施]
description: "华为视角的 NPO 路线文：三条路线 DPO/NPO/CPO 的三角权衡、为什么标准化才是 NPO 的瓶颈、OIF 2026Q2 批准 12.8Tb/s NPO 项目（40+ 厂商支持），以及行业首个 7.2T NPO 模块（Linear Direct Drive，去 retimer，功耗降约 60%、延迟降 90%）。含立场与时间线张力标注。"
toc: true
---

> **来源**：[The Fast Mode](https://www.thefastmode.com/technology-solutions/50518-advancing-optical-interconnect-to-meet-the-demands-of-ai-computing-with-near-package-optics) — *Advancing Optical Interconnect to Meet the Demands of AI Computing with Near-Package Optics*
> **原文链接**：<https://www.thefastmode.com/technology-solutions/50518-advancing-optical-interconnect-to-meet-the-demands-of-ai-computing-with-near-package-optics>
> **原文发布日**：2026-09-09 ｜ **署名作者**：Ariana Lynn（The Fast Mode）
> **本页内容**：Part 1 英文原文全文 + Part 2 中文深度解读
> ⚠️ **立场提示**：本文实质是**华为视角的供稿**（经 The Fast Mode 刊发）。文中的标准化进程叙述、「40+ 厂商支持」、7.2T 模块的「行业首个」主张与全部性能数字均出自华为自述，未给出第三方验证或支持厂商名单。Part 2 会把这些与可交叉核对的部分分开。

---

# 第一部分：正文（Original Article / 英文原文）

## Advancing Optical Interconnect to Meet the Demands of AI Computing with Near-Package Optics

The rapid surge in the use of artificial intelligence (AI) is transforming data centers into massive engines of compute. AI architectures continue to scale, both in size and complexity – AI training cluster sizes have grown over 20x from 2016 to 2024, and the amount of compute used to train frontier language models is growing 5x every year [1]. As AI clusters push toward ten-thousand-card and even hundred-thousand-card architectures, the number of interconnections spanning racks, cards and chips is rising exponentially – placing unprecedented pressure on the underlying interconnect fabric.

![华为 NPO 光互连示意图，图片版权归 The Fast Mode / 华为所有](/assets/img/posts/huawei-oif-npo-standardization-7-2t-module/tf-npo-hero.jpg)

*图1｜原文题图（The Fast Mode 刊载图片）。原文正文本身无插图，此为题图*

### Optical interconnect

Inter-rack distances are getting longer – from 2 meters to 100 meters and even 200 meters – while the need for speed continues to climb. Traditional electrical interconnects struggle to meet these demands as they approach their physical limits in transmission distance.

Optical interconnects overcome these constraints, relying on optical modules to convert electrical signals into light for high-speed, long-distance transmission, extending reach and relieving interconnect bottlenecks.

### DPO vs NPO vs CPO

Three main approaches currently define the optical interconnect landscape.

Traditional pluggable optical modules, referred to as Digital Pluggable Optics (DPO), are fully enclosed, pluggable modules that insert straight into front panel. While technologically mature, they include retimer chips, which have relatively high energy consumption and latency, thus quickly nearing physical limits.

On the other end of the spectrum, there are Co-Packaged Optics (CPO), where the optical engine is within the same substrate as the switching chip. While this boasts the lowest power consumption and latency, its advanced chip-level packaging and costly maintenance requirements have pushed predicted production timelines to at least 2028.

Near-Package Optics (NPO) occupies the practical middle ground, where the optical engine is placed on the edge of the chip package substrate, with about 5cm of the ASIC (Application-Specific Integrated Circuit). Eliminating the need for a retimer chip as well as co-packaging with an ASIC, NPO avoids major changes in manufacturing processes, enabling scale in production.

NPO captures much of CPO’s performance advantage while retaining DPO-like maintainability. With standardized interfaces, the supply chain remains decoupled and fully pluggable, reducing the risk of vendor lock-in that can accompany tightly integrated CPO solutions. This positions NPO as the most optimal choice for the industry at this stage.

### Achieving industry-wide adoption

Despite its merits, industry-wide adoption of NPO faces significant hurdles, the most critical being standardization. Before May 2026, multiple Multi-Source Agreement (MSA) organizations addressed different aspects of NPO, yet none were formal international standards bodies.

The lack of clear standards results in inconsistency in interfaces, form factors and protocols, hindering product compatibility and supply-chain coordination.

Huawei recognized both the significant opportunities for growth in the optical interconnect industry and the challenges that must be overcome. For example, upstream players are working on their own standards, while downstream players are moving in their own direction – almostas if different segments of the value chain are speaking different languages. This lack of synergy is a challenge that the industry must resolve for NPO to succeed.

### Huawei’s role in advancing OIF standardization

Huawei has actively advocated for NPO standardization and identified the Optical Internetworking Forum (OIF) – the leading international optical communications standards body – as the most appropriate venue.

At the OIF 2026Q2 plenary meeting in May this year, the standard proposal 12.8Tb/s NPO Module Project was officially approved. Huawei initiated and strongly advocated for the standard proposal, engaging with key ecosystem players across the United States, Japan, China, Canada – including carriers, cloud operators and hyperscalers, equipment vendors, optical module, connector, chip, test and measurement vendors, and research institutes.

The process comprised extensive pre-meeting consultations, plenary sessions and post-meeting follow-ups. After rounds of discussions among the industry players, many chips and system vendors have turned to support the NPO standards, a significant jump from earlier this year when the idea was put forward at the OIF’s first plenary session. More than 40 leading vendors worldwide now back the project, many contributing technical propositions to the monthly OIF NPO meetings.

Dr. Man Jiangwei, Director of Huawei’s Advanced Opto-Electronics Laboratory, reflects on this success, “This brings us back to why we started this project. In the beginning, the NPO landscape was highly fragmented. Through our efforts, vendors from various groups – including smaller camps and other standards bodies – are now actively contributing to NPO standardization at the OIF. I firmly believe that with the guidance of an organization like the OIF, the entire industry will become more unified and open.”

### The industry's first 7.2T NPO module

Huawei recently introduced the industry's first 7.2T high-capacity NPO module. While most of the market remains at 3.2T, and 6.4T is still under discussion, the 7.2T module advances single-module capacity by a full generation. Leveraging Huawei's deep-rooted expertise in optics, the module achieves an industry-leading level of monolithic high-density integration, significantly reducing component count and enhancing reliability from the ground up. Powered by a Linear Direct Drive architecture, the module eliminates the retimer chip found in DPOs, delivering approximately 60% less power consumption and 90% lower latency, providing a critical foundation for the energy efficiency and convergence speed of AI training clusters.

The 7.2T NPO module will be presented for the first time at the China International Optoelectronic Expo (CIOE) taking place at the Shenzhen World Exhibition & Convention Center on Wednesday, where live demonstrations based on 200G-per-lane operation across 36 channels will be shown.

### Conclusion

As AI computing demands continue to escalate, interconnect technology must evolve in lockstep. NPO offers a balanced path that combines performance, power efficiency, maintainability, and supply-chain openness. Through sustained technical innovation and collaborative standardization efforts at the OIF, organizations such as Huawei are helping to unify the industry and accelerate the practical deployment of next-generation optical interconnects for the AI era.

Sources:

[1] Epoch AI - <https://epoch.ai/trends>

---

# 第二部分：解析（中文深度解读）

## 一、核心论点摘要

| 维度 | 内容 |
|---|---|
| **文章性质** | 华为视角的路线主张文，两条主线：① 推动 OIF 把 NPO 标准化；② 发布行业首个 7.2T NPO 模块 |
| **产业判断** | DPO 成熟但含 retimer、功耗延迟逼近极限；CPO 功耗延迟最低但封装与维护成本高、量产时间**至少 2028**；**NPO 是现阶段的中间最优解** |
| **NPO 的定义** | 光引擎置于芯片封装基板边缘、距 ASIC 约 **5cm**；去 retimer、不与 ASIC 共封装、不改变主要制造工艺 |
| **瓶颈定位** | 不是技术，而是**标准化**——2026 年 5 月之前，多个 MSA 各管一块，却没有正式国际标准组织 |
| **关键进展** | OIF 2026Q2 全会（5 月）正式批准 **12.8Tb/s NPO Module Project**；华为发起，**40+ 全球厂商**支持 |
| **产品** | 行业首个 **7.2T NPO 模块**：市场主流仍在 3.2T、6.4T 尚在讨论；Linear Direct Drive 架构去 retimer，**功耗降约 60%、延迟降 90%** |

一句话概括：这篇文章的核心信息不是「华为又出了一个模块」，而是**「NPO 从厂商私有约定（MSA）走进了国际标准组织（OIF）」**——标准化的拐点，才是这条路线能否规模化的真正分水岭。

## 二、关键概念解读

### 1. 「5cm」：NPO 的量化定义

原文给 NPO 的定义里，最有信息量的就是那个数字：

> the optical engine is placed on the edge of the chip package substrate, with about 5cm of the ASIC

（按语义应为 within about 5cm of the ASIC，即「距 ASIC 约 5cm 以内」——原文此处漏了介词，见下文「原文笔误」一节。）

这个「5cm」之所以重要，是因为它把三条路线的差异量化了：

- **DPO（前面板可插拔）**：光电转换点在前面板，电信号要跨过整块 PCB 加连接器，路径在**几十厘米**量级；
- **NPO**：光引擎在封装基板边缘，电通道缩短到**约 5cm** 量级，且仍保留可插拔／可维护形态；
- **CPO**：光引擎与交换芯片同基板，电通道接近**零**，但代价是不可维护与封装复杂度。

换句话说，NPO 的工程主张是：**把电通道从「几十厘米」砍到「几厘米」，就已经能吃到绝大部分靠近 ASIC 的收益，而不必支付「完全集成」的代价。**

### 2. DPO / NPO / CPO 三角权衡

原文第三节的对照是本篇最有长期价值的部分，做成表更清楚：

| 维度 | DPO（数字可插拔光模块） | NPO（近封装光学） | CPO（共封装光学） |
|---|---|---|---|
| **光引擎位置** | 前面板，独立模块 | 芯片封装基板边缘，距 ASIC 约 5cm | 与交换芯片同基板 |
| **功耗／延迟** | 含 retimer，功耗与延迟相对最高，逼近物理极限 | 去掉 retimer；功耗延迟接近 CPO | 最低功耗、最低延迟 |
| **可维护性** | 热插拔更换，最成熟 | 保留 DPO 式的可维护性，接口标准化、供应链解耦 | 维护成本高、封装复杂度高（早期设计缺乏模块化） |
| **制造改动** | — | 不需与 ASIC 共封装，**不改变主要制造工艺**，易于扩产 | 先进芯片级封装，工艺门槛最高 |
| **供应链风险** | 低 | 低（标准接口 → 多源供应，降低 vendor lock-in） | 高（紧耦合易导致供应商锁定） |
| **量产时间** | 已成熟 | 现阶段的「最优解」 | 原文判断**至少 2028** |

这张表暗含了一个重要逻辑：**NPO 的竞争力不只在性能，还在「不改变制造工艺」这五个字。** 对已经建成的产能来说，「不改变工艺」意味着可以更快放量；而 CPO 的先进封装产能与良率爬坡，恰恰是最慢的一环。

### 3. 标准化才是 NPO 的真正瓶颈：从 MSA 到 OIF

这是全文最实质的论点。原文把 NPO 的落地障碍明确定位为标准化，并给出了一段清晰的时间线：

| 时间 | 事件 | 状态 |
|---|---|---|
| 2026 年 5 月**之前** | 多个 MSA 组织分别覆盖 NPO 的不同方面 | **均非正式国际标准组织**，接口／形态／协议不一致，妨碍兼容与供应链协同 |
| 2026Q2（5 月） | OIF 全会上 **12.8Tb/s NPO Module Project** 正式获批 | 华为发起并推动，跨美、日、中、加的多方参与 |
| 之后 | 月度 OIF NPO 会议持续收到技术提案 | 原文称 **40+ 领先厂商**支持，多家芯片与系统厂商转向支持 |

理解这段的关键，是区分 **MSA 与正式标准组织**的效力差异：

- **MSA（Multi-Source Agreement）**是厂商联盟的**自愿约定**。它可以是事实标准，但约束力来自市场份额，不来自程序；参与者和覆盖面都受限。
- **OIF 这类国际标准组织**产出的是**正式标准**。它的价值在于：让下游客户可以放心地把某一种接口写进采购规格，让上游可以按同一份文档设计器件，从而解锁真正的**多源供应**。

原文那句「almostas if different segments of the value chain are speaking different languages（几乎是价值链上各段在说不同的语言）」是对 MSA 阶段碎片化的准确描述。而 NPO 之所以特别需要标准，是因为它的价值主张之一就是「接口标准化 → 供应链解耦 → 避免 vendor lock-in」——**如果接口没有标准，这个主张就不成立**，NPO 相对 CPO 的结构性优势也就消失了。

### 4. 7.2T：跳过 6.4T 的一代跃升，以及 Linear Direct Drive 的代价

产品段有三个可量化的点：

- **容量代际**：市场主流仍在 **3.2T**，**6.4T 尚在讨论**，直接上 **7.2T**——原文称这是「advances single-module capacity by a full generation」。
- **通道配置**：CIOE 现场演示的是 **200G/lane × 36 通道**。核对一下：36 × 200Gbps = 7.2Tbps ✓，与标称容量自洽。
- **架构与收益**：**Linear Direct Drive（线性直驱）**去掉 DPO 中的 retimer 芯片，宣称**功耗降低约 60%、延迟降低 90%**。

这里必须点明基准问题：**60% 和 90% 是相对 DPO 而言，不是相对 CPO。** 原文的表述是「the module eliminates the retimer chip found in DPOs, delivering approximately 60% less power consumption and 90% lower latency」——参照物是含 retimer 的 DPO。相对 CPO，NPO 仍有约 5cm 电通道的额外代价。这两个数字不能跨基准引用。

另外「monolithic high-density integration（单片高密度集成）」与「significantly reducing component count（显著降低元件数）」是可靠性论证的关键：元件数下降通常直接对应故障率下降与组装良率上升。这一点比容量数字更值得关注。

### 5. 时间线张力：CPO「至少 2028」 vs ECOC 2026 的测试进展

原文对 CPO 的时间判断是：

> its advanced chip-level packaging and costly maintenance requirements have pushed predicted production timelines to at least 2028

这是**华为的立场判断**，而且恰好与本站最近收录的另一条线索形成了有意思的张力：2026 年 9 月的 ECOC 上，SENKO、Advantest 与 VIAVI 已经联合演示了**面向 HVM（高量产）的 CPO 模块级测试环境**——碳化钨可拆卸测试连接器、200Gbps/lane 的可拆卸接口 BER 测试、40 UPH 对应每月 2.8 万台（见 [SENKO/Advantest/VIAVI CPO 模块级测试](/posts/senko-advantest-viavi-cpo-module-level-testing/)）。

两者并不矛盾，但合起来读更有信息量：

- **CPO 的制造与测试基础设施正在被补上**（ECOC 2026 演示的是「模拟产线环境」，尚非量产交付）；
- **NPO 阵营则在用「不改工艺、可维护、标准接口」争夺同一时间窗内的部署份额**。

所以「CPO 至少 2028」这个判断更准确的读法是：**CPO 大规模量产的时间点有争议，而 NPO 想要吃掉的正是这段窗口期。** 谁是这段窗口期的赢家，取决于 OIF 标准推进的速度与 NPO 模块的成本曲线。

## 三、原文笔误与逐字保留说明

原文（含 The Fast Mode 排版）存在两处明显笔误，Part 1 已按**原文逐字**保留，此处标注以便对照：

| 原文 | 应为 | 说明 |
|---|---|---|
| `with about 5cm of the ASIC` | `within about 5cm of the ASIC` | 漏介词，语义应为「距 ASIC 约 5cm 以内」 |
| `almostas if different segments` | `almost as if different segments` | 漏空格 |

此外原文括注的引用 `[1] Epoch AI` 指向 <https://epoch.ai/trends>，是 AI 训练算力增长数据的常见公开来源，可作为独立交叉核对入口。

## 四、技术趋势判断

1. **NPO 的竞争焦点已从「做不做得出来」转向「接口能不能统一」。** 本文把标准化放在与技术同等甚至更高的位置，这个排序本身是成熟的产业信号——一个技术路线只有在接近可部署时，标准之争才会成为主要矛盾。

2. **OIF 成为 NPO 标准化的主场，是华为的一次有效卡位。** 主动选择既有国际标准组织（而非自建联盟），意味着华为在这一议题上采用了「融入并主导」而非「另立体系」的路径。若能取得标准文本的主导权，其影响力将远大于单个模块产品的份额。

3. **「不改工艺 + 标准接口 + 可维护」构成了 NPO 的三重护城河叙事。** 这三条都对 CPO 形成压力：CPO 的先进封装产能是硬约束，可维护性是其早期软肋，供应商锁定则是客户的采购顾虑。

4. **容量竞赛的节奏在加快。** 3.2T → （跳过 6.4T）→ 7.2T 的节奏，说明单模块容量的推进速度快于标准讨论的速度。这与 OIF 项目命名为 **12.8Tb/s** NPO Module Project 形成对照——标准瞄准的是下一代容量，产业需要在「现在就能卖」与「标准定义的上限」之间并行推进。

5. **与本站在 NPO 议题上的其他线索可以连读**：[NPO State of the Union](/posts/npo-state-of-the-union/)（产业格局与五个 W）、[Optical Illusion: CPO is Dead, Long Live NPO](/posts/optical-illusion-cpo-is-dead-long-live-npo/)（NPO 与 CPO 的内容量之辨）、[从 SerDes 到光纤：可交互的 NPO 光电链路实验室](/posts/npo-optical-electrical-link-lab/)（亲手调参看链路损伤）。

## 五、风险提示（阅读时必须保留的边界）

- **本文是华为视角的供稿，经 The Fast Mode 刊发，不是中立第三方报道。** 标准化进程的叙述、40+ 厂商支持的说法、以及全部性能数字均来自华为自述。
- **「40+ 领先厂商支持」未附名单。** 支持的具体厂商、各自贡献的技术提案，都需要以 OIF 公开文档核对，不能按本文的概括采信。
- **「the industry's first 7.2T NPO module」是厂商自称的「行业首个」。** 这类首创声明需要第三方或时间检验；同时「首个」往往是单模块容量口径，不等于商用最成熟。
- **60% 功耗下降 / 90% 延迟下降的基准是 DPO，不是 CPO。** 原文表述清晰，但传播时极易被误读为对 CPO 的优势，引用时务必带基准。
- **对 CPO「至少 2028」的时间判断是立场性预测。** 与之对照，ECOC 2026 上已有面向 HVM 的 CPO 测试环境演示，说明制造侧的推进未必慢于此判断。
- **「NPO 是现阶段最优解」是路线主张，不是结论。** 不同客户在 scale-up / scale-out、可维护性权重、既有产能约束上的差异，会导向不同的路线选择。
- **CIOE 现场演示（200G/lane × 36 通道）是演示，不是量产交付数据。** 原文未给出良率、成本或客户部署信息。

---

> **小结**：这篇文章真正值得收录的信息有两条——**其一，NPO 的瓶颈被明确指认为标准化**，并给出了「MSA 碎片化 → OIF 正式项目」的具体时间线（2026 年 5 月批准 12.8Tb/s NPO Module Project）；**其二，7.2T 模块跳过 6.4T 直接上量**，配套的 Linear Direct Drive 去 retimer，相对 DPO 宣称功耗降约 60%、延迟降 90%（注意基准是 DPO）。把它与 ECOC 2026 的 CPO 测试进展并置阅读，可以看清 NPO 与 CPO 正在争夺的其实是同一段窗口期。
