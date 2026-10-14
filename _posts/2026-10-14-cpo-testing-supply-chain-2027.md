---
layout: post
title: "CPO 量产的闸门从对准精度转向测试速度：TrendForce 拆解光测试供应链七个环节 —— 研究稿精读"
date: 2026-10-14 09:00:00 +0800
categories: [光互联, 半导体产业]
tags: [CPO, 光测试, 硅光, 测试设备, ATE, 探针卡, 光纤对准, 仪器共享, 供应链, TrendForce, Teradyne, Advantest, ficonTEC, ASE, 先进封装]
description: "TrendForce 的判断很直接：光耦合的对准时间已经压到秒级甚至亚秒级，但单个光子芯片的完整测试仍要 100 秒以上，于是 CPO 量产的真瓶颈从对准精度转移到了测试速度。这篇研究把光测试供应链切成七个环节，并指出竞争焦点正从单台仪器的性能转向完整生产测试平台的整合能力。本文转载原文全文、转录其唯一的供应链图，并补做一次测试吞吐量的量级推演。"
toc: true
---

> **来源**：TrendForce（集邦咨询）研究稿，2026 年 10 月 13 日发布，栏目 Semiconductors。原文标题 *Integrated Optical-Electrical Testing Platforms Become Key to CPO Mass Production, Reshaping the Test Equipment Supply Chain, Says TrendForce*。
> **原文链接**：<https://www.trendforce.com/presscenter/news/20261013-13267.html>
> **体例**：市场研究机构的研究摘要（press release 形态）。全文为结论性陈述，无参考文献、无脚注，随附一张自制的供应链分类图（即本文图 1）。文末的「For more information」为报告导流样板文。
> **转载说明**：第一部分为英文原文完整转载，版权归 TrendForce 所有；本站仅调整排版与标题层级，不改动任何文字表述；原文中的内嵌超链接在本页转为纯文本，文末的上一篇/下一篇导航已略去。第二部分为本站独立撰写的中文解读，其中的折算、估算与质疑属解读者观点，不构成投资建议。

# 第一部分：英文原文（Original Article）

## Integrated Optical-Electrical Testing Platforms Become Key to CPO Mass Production, Reshaping the Test Equipment Supply Chain, Says TrendForce

13 October 2026 · Semiconductors · TrendForce

TrendForce’s latest research on AI interconnect technologies reveals that growing demand for high-speed transmission in AI data centers is accelerating the transition of co-packaged optics (CPO) toward mass production, making shorter test times and lower costs increasingly important. Furthermore, demand for integrated test equipment and software is rising as CPO requires coordinated electrical and optical measurements.

TrendForce expects 2027 to be a pivotal year for the convergence of CPO testing architectures. While established automated test equipment (ATE) suppliers are expanding their presence in this market, new manufacturing processes and technical challenges are also creating opportunities for equipment, test interface, and semiconductor assembly and test service providers.

CPO combines optical engines with switching or computing chips in a single package. One key challenge in mass production is ensuring precise optical coupling, which depends on alignment module suppliers equipped with multi-axis control. When combined with position feedback and optical search algorithms, these tools enable optical coupling and testing equipment to achieve faster and more stable alignment.

Although optical alignment times have already decreased to the second or even sub-second level, a complete test of a single photonic integrated circuit (PIC) can still take over 100 seconds. Consequently, the bottleneck in mass production is now shifting from alignment accuracy to testing speed.

CPO testing currently requires multiple instruments, including laser sources, optical switches, optical power meters, and optical spectrum analyzers. Coordinating instrument control, calibration, and test procedures therefore becomes more complex with functions and suppliers spread across different equipment categories. Additionally, each instrument is used for a different length of time during testing.

Equipping every test station with a complete set of instruments can leave some expensive equipment underutilized, driving up costs. The key to optical-electrical test integration lies in using unified software to coordinate electrical and optical measurements, supported by optical path switching and instrument sharing across multiple test stations to improve equipment utilization.

As CPO moves toward mass production, the ability to integrate different instruments effectively on a single platform will be critical to reducing costs and increasing throughput.

### Competition shifts toward platform integration as suppliers expand their CPO testing capabilities

TrendForce identifies seven major segments in the CPO testing supply chain: ATE, probing and test interfaces, optical and high-speed measurement instruments, test integration and automation, core optical coupling and alignment modules, third-party testing and analysis, and packaging and production testing. Responsibilities across these segments continue to overlap.

Leading traditional ATE suppliers have increased investment in response to customer demand. Teradyne acquired Quantifi Photonics in 2025 to strengthen its optical measurement capabilities. Advantest is integrating optical instruments through its existing test platforms and software. In September 2026, the company announced a collaboration with VIAVI and SENKO to combine automated testing, optical measurement, and detachable optical interfaces. The partners subsequently demonstrated a simulated production testing workflow for CPO modules at ECOC 2026.

These developments indicate that industry value is gradually shifting from individual instrument performance to the ability to integrate complete production testing platforms. Further advances in instrument sharing across test stations and parallel testing of multiple devices could help reduce testing costs per unit.

TrendForce observes that Taiwanese suppliers have established a presence across several segments of the CPO testing supply chain. GMT Global provides multi-axis optical coupling and alignment modules, while MPI offers probing equipment and optical alignment solutions. WinWay specializes in test interfaces, and Chroma has capabilities in automated testing and burn-in testing.

Third-party testing providers, including MSS, MA-tek, and iST, are helping customers accelerate product development through optical-electrical measurements, materials analysis, failure analysis, and reliability verification. Packaging and testing providers such as ASE can further bridge the gap between packaging processes and production testing, extending the potential benefits across both equipment and service suppliers.

Chinese suppliers are leveraging their existing experience in optical communications manufacturing and testing to accelerate the localization of test equipment. For example, Semight Instruments has introduced a 65 GHz sampling oscilloscope and begun volume shipments, indicating progress in certain high-speed measurement technologies.

Nevertheless, China still relies heavily on imports for high-end measurement instruments overall. It also remains to be seen whether experience in optical module testing can be extended to complete CPO mass production platforms. Customer adoption, testing efficiency, and long-term stability will be key factors to monitor.

RoboTechnik completed its full acquisition of Germany-based ficonTEC in 2025, gaining a foothold in the global optoelectronic packaging and test equipment supply chain. Whether this ownership change will influence procurement decisions among European and U.S. customers will be another important development to watch.

TrendForce expects 2027 to be a pivotal year for the convergence of CPO testing architectures and equipment investment strategies, while 2028 will serve as a critical period for validating readiness for large-scale mass production. Suppliers that can integrate different test equipment and provide production-scale services are expected to strengthen their strategic positions in the supply chain as customers place greater emphasis on testing efficiency, quality, and cost.

For more information on TrendForce’s semiconductor reports and market data, please visit the Report Page, leave a Message, or Email (SR_MI@trendforce.com) the Sales Department. For more on the latest technology industry news and trends, please visit News.

# 第二部分：中文解读

## 一句话结论

TrendForce 这次给出的不是市场规模预测，而是一次**瓶颈迁移的判定**：CPO 量产卡点已经从「能不能对准」变成「测得多快」。由此推导出的结论更值得注意——**产业价值正从单台仪器的性能，转移到把多台仪器整合成一个生产测试平台的能力**。全文只有 100 秒这一个硬数字，但足以重构整条设备供应链的排序。

## 一、原文的论证链，三句话

1. **CPO = 光引擎 + 交换/计算芯片同封装**，量产的第一道关是精确光耦合，依赖具备多轴控制能力的对准模块，再叠加位置反馈与光搜索算法。
2. **对准已经不是瓶颈**：光对准时间已降到秒级甚至亚秒级，但**单个 PIC 的完整测试仍要 100 秒以上**。于是瓶颈从对准精度转向测试速度——这是全文的枢纽判断。
3. **测试的经济性问题在于仪器利用率**：激光源、光开关、光功率计、光谱仪分属不同品类、不同供应商，且在测试中各自占用不同的时长。若每个测试站都配齐一整套，昂贵设备必然大量闲置。出路是**统一软件协调光电测量 + 光路切换 + 跨站仪器共享**。

## 二、七段供应链（据原文唯一配图转录）

原文随附一张自制分类图，是全文唯一的量化/结构化信息。以下为逐格转录（图注：Suppliers are categorized by their core capabilities; some operate across multiple segments. Source: compiled by TrendForce, Oct. 2026）。

![图 1｜CPO 测试供应链的七个环节、对应功能、代表性供应商与产业趋势](/assets/img/posts/cpo-testing-supply-chain-2027/fig01-cpo-testing-supply-chain.jpg)

*图 1｜CPO Testing Supply Chain: Key Segments。TrendForce 自制分类图，本文原样转载并转录为下表。*

| 环节 | 核心功能 | 代表性供应商 | 产业趋势（原文判断） |
|---|---|---|---|
| ATE | 电性与高速信号测试、自动化测试控制 | Advantest、Teradyne、Chroma | 从电测试扩展到光电整合平台 |
| 探测与测试接口 | 晶圆级与裸片级探测、光接口、探针卡、测试插座、可拆卸光测试接口 | ficonTEC、AstraCore Systems、SENKO、MPI、WinWay、HTSI | 多点位测试、双面探测；光接口在反复插拔下的可靠性成为竞争关键 |
| 光学与高速测量仪器 | 光功率、光谱、波长、BER、PAM4、眼图测量 | Yokogawa、Anritsu、Keysight、VIAVI、Santec（含原 JGR Optics） | 从台式独立仪器走向光学机架整合 |
| 测试整合与自动化 | 整合 ATE、探针、对准系统与光学机架 | Advantest、Teradyne、ficonTEC | 系统整合的价值上升，竞争焦点转向测试单元控制 |
| 核心光耦合与对准模块 | 多轴精密定位、视觉与位置反馈、主动光对准、耦合优化、稳定控制 | SURUGA SEIKI、PI、GMT Global | 自动光对准、闭环控制与多通道对准的组合，提升效率与稳定性 |
| 第三方测试与分析 | SiPh 光电测量、失效分析、材料分析、可靠性验证 | MSS、MA-tek、iST | SiPh 与 CPO 客户对验证服务的需求增长 |
| 封装与生产测试 | 光引擎/CPO 封装、生产测试与可靠性验证 | ASE、Amkor、JCET、通富微电（Tongfu Microelectronics） | 从工程验证走向量产级测试与可靠性保证 |

**两点观察**：

- **中国大陆供应商只在最后一格出现**（通富微电），而正文重点提到的 Semight Instruments（65 GHz 采样示波器已量产出货）**并未进入图中任何一格**。正文与配图的口径不一致——图标注自己「按核心能力分类，部分厂商跨多个环节」，但这更像是分类粒度问题，而非彻底的遗漏。引用这张表时不宜把它当成完整的供应商地图。
- **「测试整合与自动化」这一格只有三家，且全是 ATE/对准设备商**，没有软件公司、没有仪器商。这恰好印证了原文的核心论断：**整合能力目前被 ATE 阵营视作自己的地盘**，而仪器公司与软件公司还没进入这一格的竞争。

## 三、关键数字与已发生事实清单

| 事项 | 内容 | 出处层级 |
|---|---|---|
| 光对准时间 | 已降至秒级甚至亚秒级 | TrendForce 口径，无测量条件 |
| PIC 完整测试时间 | 超过 100 秒 | TrendForce 口径，**未说明通道数、波长数、测试项** |
| 2027 | CPO 测试架构收敛的关键年 | 预测 |
| 2028 | 验证大规模量产就绪度的关键期 | 预测 |
| Teradyne 收购 Quantifi Photonics | 2025 年，补强光学测量能力 | 已发生，可核实 |
| Advantest × VIAVI × SENKO | 2026 年 9 月宣布合作，结合自动化测试、光测量与可拆卸光接口；随后在 ECOC 2026 演示 CPO 模块模拟量产测试流程 | 已发生，可核实 |
| RoboTechnik 全资收购 ficonTEC | 2025 年完成，切入全球光电封装与测试设备供应链 | 已发生，可核实 |
| Semight Instruments | 推出 65 GHz 采样示波器并开始量产出货 | 具体产品事实，单一来源 |

值得注意的是原文引述的三条时间线**全部落在 2025–2026 年**：两起并购、一次三方合作加一次演示。**并购补齐能力、联盟替代并购、集成商开始演示生产流程**——这三种动作同时出现，是产业尚未定型的典型特征。

## 四、本站推演：100 秒意味着多少台设备

原文只给了「100 秒」和「仪器共享」两个点，没有给吞吐量算术。这里补一次量级推演（**以下假设均为本站设定，非原文数据**）：

- 单站、单次 PIC 全测 100 秒 → 满载日产能 86,400 / 100 = **864 测次/天**。
- 现实中测试站很难满载运行，按 **50% 利用率**计，约 432 测次/天、约 **15.8 万测次/年**。
- 若某一年目标生产 100 万只 CPO 模块，且每只需经历**一次** PIC 全测，则需约 **6–7 台并行测试站**；若每只模块要经过**两到三道**光电测试插入点（耦合后、封装后、老化前后），则需 **13–19 台**。

这组数字的意义不在精度，而在**对比**：光对准设备是「每个工位一台、单次亚秒级」的量级，而光电全测是「每站每天几百次」的量级。**对准设备的数量由工位数决定，测试设备的数量由测试时间乘以产量决定**——后者的产能弹性远小，也就解释了为什么 TrendForce 会说「卡点从精度转向速度」，以及为什么「跨站仪器共享」会被当成降本关键：**它本质上是在把昂贵仪器从「按站配置」改成「按需调度」**。

## 五、竞争迁移：「整合能力」为什么比「单机性能」更值钱

原文的三条证据指向同一个方向：

- **Teradyne** 用**并购**补齐光学测量（买 Quantifi Photonics）——缺什么买什么。
- **Advantest** 用**联盟**补齐（与 VIAVI 做光测量、与 SENKO 做可拆卸光接口），并复用自家测试平台与软件——缺什么联什么。注意它带上了「可拆卸光接口」这一环，说明它把**反复插拔的可靠性**当作量产落地的必要件。
- 两家都强调**软件**：Teradyne 叙事里的整合、Advantest 叙事里的现有平台软件。

**我的评述（属解读者判断）**：这是经典的「集成商叙事」，但它有一个原文没有追问的前提——**客户是否愿意从单一供应商买下整条生产测试平台？** 光测量仪器与 ATE 属于完全不同的采购链条、不同的技术文化，客户（尤其是光模块厂与传统封测厂）长期习惯按环节分别选型。整合商要拿走整合溢价，必须先说服客户放弃「单机最优」的组合自由，把锁定风险换成调度效率。

另一个被原文轻轻带过的信号是：**「Responsibility across these segments continue to overlap」（各环节职责持续重叠）**。这句话其实是「现在还没有人拿下端到端」的委婉说法。因此更准确的理解是：**整合能力目前仍是稀缺资源，而不是已经形成的护城河**。

## 六、台湾与中国大陆供应商的位置

**台湾**——原文的观察是「已在多个环节建立存在感」，并给出四条具体映射：GMT Global（多轴光耦合与对准模块）、MPI（探测设备与光对准方案）、WinWay（测试接口）、Chroma（自动化测试与老化测试）；加上第三方验证的 MSS / MA-tek / iST 与封测端的 ASE，构成了一条**从对准到验证的完整中段**。这套配置的特点是：**偏向「接口、对准、验证」这些 CPO 新增的环节**，而非传统 ATE 主设备。

**中国大陆**——两条线并行：

1. **单点突破**：Semight Instruments 的 65 GHz 采样示波器已量产出货，说明高速测量这一品类出现了可交付的国产方案。
2. **整体依赖仍在**：原文明确写「China still relies heavily on imports for high-end measurement instruments overall」，并给出两个待观察项——光模块测试经验能否迁移到完整的 CPO 量产平台（客户采纳、测试效率、长期稳定性），以及 RoboTechnik 全资控股 ficonTEC 后，**欧美客户的采购决策是否会因此改变**。

最后这一句是全文政治经济含义最重的一句，但它只被写成「important development to watch」，没有展开。**设备的所有权归属会直接进入客户的供应链风险评估**，这在光测试设备领域并不新鲜，但 ficonTEC 处于「对准与封装」这一 CPO 必经环节，敏感度高于普通仪器。

## 七、可采信度分层

| 内容 | 可采信度 | 理由 |
|---|---|---|
| Teradyne–Quantifi（2025）、Advantest–VIAVI–SENKO（2026-09）、ECOC 2026 演示、RoboTechnik–ficonTEC（2025） | **强** | 均为公开可核实的交易与公告 |
| 「对准已是秒级/亚秒级」「PIC 全测超 100 秒」 | **中** | 行业口径，无测量条件、无测试项清单；但量级与业界共识一致 |
| 七段供应链分类与供应商映射 | **中** | TrendForce 自有分类框架，非行业标准；且与正文提到的厂商存在口径不一致（见第二节） |
| 「价值从单机性能转向平台整合」 | **中偏弱** | 由三条已发生事实归纳，方向合理，但属于研究机构的判断而非可验证结论 |
| 2027 收敛 / 2028 量产就绪 | **弱** | 纯预测，无触发条件、无客户节点 |
| 「整合能力决定战略地位」 | **弱** | 结论性表述，缺成本与客户意愿的证据 |

## 八、这篇文章没有回答什么

1. **100 秒到底测了什么**：多少通道、多少波长、多少测试项、是否为全温全参数。没有这个口径，100 秒既无法与上一代比较，也无法推算产能。
2. **成本与价格**：全文零成本数字。而「缩短测试时间」如果代价是更贵的整合平台，净收益未必为正。
3. **良率与复测率**：量产经济性里测试成本与良率强耦合，原文完全未涉及。
4. **仪器共享怎么做**：光路切换矩阵的规模、时间分片还是空间分片、共享带来的串扰与校准漂移如何控制——这才是工程落地最难的部分。
5. **CPO 的产能目标**：没有分母，就无法判断 100 秒到底是「可以接受」还是「必须砍掉一半」。
6. **Chiplet 与可拆卸光接口的关系**：Advantest 与 SENKO 的合作指向「可拆卸光接口」，而可拆卸化对测试经济性的影响（插拔寿命、重复对准、接口损耗）值得单独展开，原文只给了名词。
7. **中国大陆市场规模**：只定性说依赖进口，无任何量化。

## 九、与本站其他文章的联系

- **[光学测试如何卡住 CPO 的大规模部署](https://marvinlee.cn/posts/why-optical-high-volume-test-is-10x/)** —— 与本文构成**互补的上下位关系**：那篇是设备与工艺视角的深度精读（四道插入点、双面探测、0.5 µm 级光纤定位公差、64–128 路 CW 激光），本文是研究机构视角的供应链分类与趋势判断。两篇的 100 秒 / 亚秒级数字应互相对照阅读。
- **[Marvell 补上 224G 电互连的另一半](https://marvinlee.cn/posts/marvell-alaska-3-2t-retimer-1-6t-aec-dsp/)** —— 同批发布的另一篇，恰好回答「光之外那一半」：铜在 6 米以内的成本与功耗优势，决定了 CPO 必须解决的正是本文所述的测试经济性，而不是性能。
- **[一块基板不再通吃](https://marvinlee.cn/posts/one-substrate-no-longer-rules-them-all/)** —— CPO 的封装与生产测试环节，最终回到基板材料、TGV 与面板级封装这些上游约束。
- **[中国超节点供应链](https://marvinlee.cn/posts/china-supernode-supply-chain/)** —— 设备所有权的供应链风险（ficonTEC 一例）在超节点这类系统级采购里会被放大到另一个层级。

## 十、一句话总结

**CPO 的对准问题基本解决了，测试问题才刚开始——100 秒这个数字决定了测试站的数量、进而决定了设备投资的重心，而「把不同仪器整合成一个可调度平台」正成为供应链里最稀缺、也最容易被高估的能力。** 在看见成本数字与良率数字之前，把 2027/2028 当作**观察窗口**而非**投资锚点**，是更稳妥的读法。
