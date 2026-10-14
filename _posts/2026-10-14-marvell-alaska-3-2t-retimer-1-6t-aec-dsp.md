---
layout: post
title: "Marvell 补上 224G 电互连的另一半：3.2T 协议感知重定时器与第二代 1.6T AEC DSP —— 官方新闻稿精读"
date: 2026-10-14 10:00:00 +0800
categories: [AI硬件, 半导体产业]
tags: [Marvell, Alaska, Retimer, AEC, DSP, 224G, PAM4, UALink, ESUN, 铜缆互连, scale-up, 先进封装, OCP, LightCounting]
description: "Marvell 一次性发布两款 3nm 互连器件：16 通道 224G 的 Alaska E 3.2T 协议感知重定时器，以及把 1.6T AEC DSP 推进到 3nm 的第二代 Alaska A。前者面向板内与背板，后者把有源铜缆（AEC）的实达距离推过 6 米、功耗压到 12.8W。本文转载新闻稿全文，并逐项拆开标称数字：16 通道为何标称 3.2T 而不是 3.6T、45dB 与 6 米是否自洽、8W 节电的基准是谁、以及 Marvell 同时押注 UALink 与 ESUN 的协议对冲逻辑。"
toc: true
---

> **来源**：Marvell Technology, Inc.（NASDAQ: MRVL）官方新闻稿，2026 年 10 月 13 日发布。经三个渠道核对：Businesswire 发布版、Marvell 投资者关系页、marvell.com 新闻室。三者文字表述一致，仅在数据行格式（wire 体例 vs. 常规体例）与多媒体声明的位置上有排版差异。本页正文采用官方常规体例，并保留 Businesswire 版的多媒体声明行。
> **原文**：*Marvell Bolsters Connectivity Portfolio with New 3.2T Protocol-aware Retimer and Second-generation 1.6T AEC DSP* — <https://www.businesswire.com/news/home/20261013849856/en/Marvell-Bolsters-Connectivity-Portfolio-with-New-3.2T-Protocol-aware-Retimer-and-Second-generation-1.6T-AEC-DSP>
> **体例**：企业官方新闻稿。结构为标准四段式——要点摘要、产品定义、生态伙伴引述、供货状态，另附 About Marvell 样板文与前瞻性声明。全文纯文字，仅随附一张产品图（新闻稿标注为 multimedia 素材），无技术图表、无对比数据。
> **转载说明**：第一部分为英文原文完整转载（含全部引述、样板文与前瞻性声明），版权归 Marvell Technology, Inc. 所有；本站仅调整排版与标题层级，不改动任何文字表述；原文中的内嵌超链接在本页转为纯文本。第二部分为本站独立撰写的中文解读，其中的折算、估算与判断属解读者观点，不构成投资建议。

# 第一部分：英文原文（Original Article）

## Marvell Bolsters Connectivity Portfolio with New 3.2T Protocol-aware Retimer and Second-generation 1.6T AEC DSP

- **Scaling connectivity to 3.2T:** Marvell® Alaska® E 3.2T protocol-aware Ethernet, UALink™ and ESUN retimer delivers 16 lanes of 224G PAM4 connectivity for high-bandwidth XPU-to-XPU and XPU-to-switch scale-up architectures.
- **Advancing 200G/lane AECs:** Second-generation Alaska A 1.6T AEC DSP moves to the 3nm node, delivering higher performance and improved power efficiency for 1.6T active electrical cables used across AI racks.
- **Built for next-generation AI infrastructure:** Designed to meet the increasing bandwidth, reach and power-efficiency demands of advanced AI scale-up infrastructure at 224G/lane.
- **Availability:** Alaska E 3.2T protocol-aware retimer and second-generation Alaska A 1.6T are now sampling to customers.

**SANTA CLARA, Calif. – October 13, 2026** – Marvell Technology, Inc. (NASDAQ: MRVL), a leader in data infrastructure semiconductor solutions, today announced two additions to its advanced connectivity portfolio designed to meet the rapidly increasing bandwidth, reach and power-efficiency requirements of AI scale-up infrastructure. The new Alaska E 3.2T protocol-aware retimer and second-generation Alaska A 1.6T AEC DSP extend 200G/lane connectivity across on-board, backplane and active electrical cable (AEC) applications.

This press release features multimedia. View the full release here: <https://www.businesswire.com/news/home/20261013849856/en/>

![图 1｜Marvell Alaska 系列产品图（新闻稿随附多媒体素材）](/assets/img/posts/marvell-alaska-3-2t-retimer-1-6t-aec-dsp/fig01-marvell-alaska-product.jpg)

*图 1｜原文对此图无文字说明，其图像标题标注为 Marvell™ Alaska®。这是新闻稿随附的唯一图片。*

As AI systems scale to more accelerators per rack and switch bandwidth advances to 102.4T, scale-up networks are transitioning to 224G/lane signaling to deliver the bandwidth required between XPUs, NICs and switches. At these speeds, signal integrity and copper reach become increasingly challenging, making advanced DSP-based retiming essential to maintaining high-bandwidth, low-latency connectivity inside AI racks.

The expanded Alaska A portfolio addresses these challenges across multiple copper interconnect architectures. The Alaska E 3.2T retimer provides high-density 224G connectivity for on-board and backplane applications, while the second-generation Alaska A 1.6T DSP brings Marvell 3nm technology to AECs for longer copper reaches between AI servers and switches. Together, the new 3nm devices expand the Marvell portfolio of retimer and DSP solutions for scale-up infrastructure, giving data center operators greater flexibility to optimize their infrastructure to maximize bandwidth, reach and power efficiency.

In addition, Alaska A and E devices are integrated into the Marvell® RELIANT™ interconnect telemetry platform, which provides real-time visibility, predictive insight and automated optimization across the Marvell connectivity portfolio.

“AI scale-up networks are moving rapidly to 224G signaling, making signal integrity, low latency and power efficiency critical to connecting increasingly dense infrastructure,” said Xi Wang, senior vice president and general manager, Connectivity Business Group at Marvell. “With the expanded Alaska portfolio, Marvell is delivering optimized 200G/lane retimer solutions across boards, backplanes and active electrical cables, giving hyperscalers the connectivity flexibility required to scale next-generation AI infrastructure.”

“The AI scale-up networking market will exceed $50 billion by 2030, driven by the transition to rack-scale and multi-rack architectures and the move to 224G signaling,” said Vladimir Kozlov, founder and CEO of LightCounting. “As accelerator density increases, multi-protocol-capable retimers will be essential for delivering the bandwidth, reach and power efficiency required.”

### Alaska E 3.2T: 224G Retiming for AI Scale-up Fabrics

Delivering industry-leading channel reach at greater than 45dB, the Alaska E 3.2T protocol-aware Ethernet / UALink / ESUN retimer is designed to address the challenging electrical budgets of 224G links used in rack-scale AI architectures, enabling more flexible placement of compute and switching elements while maintaining performance and efficiency. Key features include:

- 3.2 Tbps aggregate bandwidth via 16 224G PAM4 SerDes lanes
- 45dB+ insertion loss compensation
- Broad protocol support: Ethernet, UALink and ESUN
- Reduced latency for latency-sensitive scale-up applications
- DSP-based signal processing and equalization
- Power-efficient design optimized for high-density AI deployments

### Second-generation Alaska A 1.6T: 3nm DSP for AEC

As AI clusters scale to 102.4T switches and GPU-to-GPU connectivity advances to 200G per lane, data center architects need reliable, low-latency copper interconnects that can span server racks and GPU trays without compromising signal integrity. The Alaska A 1.6T AEC DSP addresses this need by enabling AI fabric connectivity at 1.6T throughput over longer copper reaches exceeding six meters, doubling the reach of the first-generation product. Key features include:

- Industry-leading DSP performance with eight lanes of 224G PAM4 connectivity
- Power-efficient 12.8W, compact 12mm x 14mm package with addition of known good die format for dense AEC assemblies
- Eight-watt power savings compared to 5nm designs with ILT support
- Extensive range of retimer modes, including data rate gear boxing: 1.6T / 800G / 400G / 200G / 100G / 50G
- Broad protocol support: Ethernet, UALink and ESUN
- 45dB+ insertion loss compensation to support the longest AEC cable reach
- Alaska A DSP supports straight, Y and multiple break-out cable configurations
- Includes full suite of diagnostic capabilities

Marvell is showcasing the expanded Alaska portfolio at OCP Global Summit 2026.

### Industry Ecosystem Support

“Industry-leading connectivity providers like Marvell are increasingly adding UALink support to their portfolios due to its high-bandwidth, ultra-low latency and massive scalability,” said Kurtis Bowman, UALink board chair and AMD Director of Architecture and Strategy. “Support for UALink in the Marvell second-generation retimer helps expand the open ecosystem for scale-up AI infrastructure, allowing data center customers to build out their next-generation infrastructure to meet the massive performance and scalability demands of tomorrow’s AI workloads.”

“Amphenol is committed to providing customers with the latest and greatest technologies that overcome the limits of copper to drive broad connectivity across racks and clusters,” said Greg Walz, director of product marketing at ACS Highspeed Products. “Leveraging Marvell high-performance, low-latency AEC DSPs, we’re enabling the next generation of accelerated infrastructure with optimized, high-bandwidth interconnects.”

“Molex backplanes and AECs are designed to address the rapidly increasing network bandwidth demands and the enormous processing capacity of today’s powerful AI servers,” said Clay Miller, senior manager, New Product Development, at Molex. “Marvell retimers offer ultra-high bandwidth, ultra-low latency and optimal signal integrity, and we look forward to continuing to work with Marvell to provide new levels of performance and functionality to hyperscale and cloud data center customers.”

### Availability

The Marvell Alaska E 3.2T protocol-aware retimer and Alaska A 1.6T second-generation AEC DSP are currently sampling to customers.

### About Marvell

To deliver the data infrastructure technology that connects the world, we’re building solutions on the most powerful foundation: our partnerships with our customers. Trusted by the world’s leading technology companies for over 30 years, we move, store, process and secure the world’s data with semiconductor solutions designed for our customers’ current needs and future ambitions. Through a process of deep collaboration and transparency, we’re ultimately changing the way tomorrow’s enterprise, cloud and carrier architectures transform—for the better.

**###**

Marvell and the M logo are trademarks of Marvell or its affiliates. Please visit www.marvell.com for a complete list of Marvell trademarks. Other names and brands may be claimed as the property of others.

This press release contains forward-looking statements within the meaning of the federal securities laws that involve risks and uncertainties. Forward-looking statements include, without limitation, any statement that may predict, forecast, indicate or imply future events, results or achievements. Actual events, results or achievements may differ materially from those contemplated in this press release. Forward-looking statements are only predictions and are subject to risks, uncertainties and assumptions that are difficult to predict, including those described in the “Risk Factors” section of our Annual Reports on Form 10-K, Quarterly Reports on Form 10-Q and other documents filed by us from time to time with the SEC. Forward-looking statements speak only as of the date they are made. Readers are cautioned not to put undue reliance on forward-looking statements, and no person assumes any obligation to update or revise any such forward-looking statements, whether as a result of new information, future events or otherwise.

**Media Contact:** George Millington, pr@marvell.com

**Source:** Marvell Technology, Inc. — Released October 13, 2026

# 第二部分：中文解读

## 一句话结论

这不是一颗孤立的芯片发布，而是 Marvell 在 AI scale-up 互连中**「电」这一侧的补位动作**：用两款同代 3nm 器件，把 224G/lane 的有源铜缆与背板链路从「能跑」推向「能铺开」——同时用协议兼容性对冲标准之争，用遥测平台把互连变成可运维资产。真正的信息量不在「3.2T」这个数字，而在**距离（6 米）、功耗（12.8W）、协议（UALink + ESUN 双押）与封装形态（KGD）**这四个同样被写进第一段的约束。

## 一、发布了什么：两款器件 + 一个平台

| 维度 | Alaska E 3.2T 协议感知重定时器 | 第二代 Alaska A 1.6T AEC DSP |
|---|---|---|
| 定位 | 板内（on-board）与背板（backplane） | 有源电缆（AEC） |
| 工艺 | 3nm（原文以「new 3nm devices」与 1.6T 器件并列陈述） | 3nm（明确写出） |
| 通道 / 速率 | 16 × 224G PAM4 SerDes | 8 × 224G PAM4 |
| 标称聚合带宽 | 3.2 Tbps | 1.6 Tbps |
| 插入损耗补偿 | 45 dB+ | 45 dB+ |
| 功耗 | 未披露 | 12.8 W |
| 封装 | 未披露 | 12 mm × 14 mm，新增 KGD（known good die）形态 |
| 铜缆实达距离 | 未披露（面向 rack-scale 电气预算） | 超过 6 米，为第一代的两倍 |
| 协议支持 | Ethernet / UALink / ESUN | Ethernet / UALink / ESUN |
| 速率档位（gear boxing） | 未披露 | 1.6T / 800G / 400G / 200G / 100G / 50G |
| 线缆形态 | 不适用 | straight、Y 型、多种 breakout |
| 诊断能力 | 未披露 | 全套诊断能力 |
| 状态 | 已向客户送样 | 已向客户送样 |

两款器件同时接入 **Marvell RELIANT 互连遥测平台**。供货状态是「sampling」——即尚未量产，这决定了本文所有数字都属**厂商自述的工程目标**，而非可采购规格书。

## 二、把标称数字拆开看

### 2.1 16 通道 × 224G 为什么标称 3.2T，而不是 3.6T

最容易误读的一处：16 × 224 Gb/s = 3,584 Gb/s ≈ 3.6T，但原文写的是 **3.2 Tbps**。这不是笔误，而是命名口径的差异。

「224G SerDes」是**通道等级名**（源自 OIF CEI-224G 这一代接口命名，物理层为约 212.5 GBd PAM4），而 3.2 Tbps 是按 **200G/lane 的有效载荷**计的：16 × 200G = 3.2T。同理，1.6T AEC DSP 的 8 × 224G 对应 8 × 200G = 1.6T，与「1.6T」命名自洽。原文中「200G/lane connectivity」与「224G/lane signaling」交替出现，正是同一件事的两种叫法：**224G 说的是信号速率等级，200G 说的是这一等级下每通道交付的业务带宽**。读这类新闻稿时，先做这一步换算，才能避免把厂商的通道数当成带宽。

### 2.2 45 dB 与 6 米是否自洽

45 dB 是**整条信道的插入损耗预算**，不等于线缆自身的损耗。做一次量级估算（以下为本站估算，非原文数据）：224G PAM4 的奈奎斯特频率约 53 GHz；此频点上双轴铜缆的衰减大致落在 4–6 dB/米量级，则 6 米线缆本身消耗约 24–36 dB，余下约 9–21 dB 留给连接器、breakout 与封装过孔——**在数量级上是自洽的**，且解释了为什么厂商必须强调「45dB+」而不是单纯强调「6 米」。

同一指标落在 Alaska E 这一侧含义更重：PCB 走线在 53 GHz 的单位损耗通常比同长度双轴缆高一个量级，因此背板场景下的 45 dB 大致对应**二十到三十英寸量级**的走线（视板材与过孔设计而定，仍属本站估算）。这正是原文说它服务「rack-scale AI architectures」并允许「more flexible placement of compute and switching elements」的物理基础——**45dB 换来的其实是机柜内的布线自由度**。

### 2.3 12.8 W 与「省 8 W」：基准是谁

把功耗归一化才有比较意义：12.8 W / 1.6 Tbps = **8 mW/Gbps，即 8 pJ/bit**。这个数字放在 224G/lane 这一代属于偏优区间——但原文的「Eight-watt power savings compared to 5nm designs with ILT support」有一处**指代不清**：省下的 8 W 是相对竞争对手的 5nm 方案，还是相对 Marvell 自家上一代 5nm 方案？「with ILT support」修饰的是被比较的 5nm 设计，还是本品？

若按字面反推（本站推断）：被比较的 5nm 设计约为 12.8 + 8 = 20.8 W，折合约 13 pJ/bit，则 3nm 带来约 **38% 的功耗下降**。这是一个很漂亮的数字，但因为它依赖对模糊表述的解读，**不宜直接引用**。原文没有给出比较对象的产品名、也没有说明 ILT 的确切含义与是否在两代设计中都开启——这是解读时必须标出的不确定点。

## 三、协议对冲：UALink 与 ESUN 同时支持意味着什么

这是全文最具战略含义的一行：两款器件都同时支持 **Ethernet、UALink 与 ESUN**。

- **UALink** 是由 AMD 主导、面向 accelerator 之间 scale-up 的开放互连标准，新闻稿中由 UALink 董事会主席（兼 AMD 架构与战略总监）Kurtis Bowman 亲自背书。
- **ESUN**（Ethernet for Scale-Up Networking）走的是以太网路线，是 802.3dj 体系内向 scale-up 场景的延伸。
- 两者在 scale-up 这一层是**竞争关系**（分别代表「专用开放互连」与「以太网延伸」两条路线），而 Marvell 选择在同两颗器件上同时支持。

对一家器件供应商，这是标准的**标准之战对冲**：下游客户尚未形成统一选择时，先让硅片不成为选型的约束条件。这与新闻稿把 UALink 背书放在生态支持段第一位、而非与 Ethernet 并列的写法，形成有趣的张力——**排序暗示了当前的关注重心，但产品定义又刻意保持中立**。

真正需要观察的是：重定时器与 AEC DSP 位于物理层，协议兼容意味着同一颗芯片可被配置进不同生态的机柜，**它降低了标准分叉对客户的切换成本，也因此降低了标准分叉对 Marvell 的营收风险**。这是这类器件公司最容易低估、也最难被替代的护城河。

## 四、KGD 与 12 mm × 14 mm：为什么 AEC 需要裸片形态

「compact 12mm x 14mm package with addition of known good die format for dense AEC assemblies」这一句，在采购清单里比 12.8W 更值得注意。

AEC 的 DSP 通常直接贴装在有源铜缆的 PCB 端头（chip-on-board），空间与高度都极其受限。提供 **KGD（已知良好裸片）形态**意味着客户可以省掉一级封装：既压缩 Z 高度，又省下封装成本与一次热阻，同时把组装良率的责任前移到「裸片级筛选」。原文称其服务于「dense AEC assemblies」——**在高密度 AEC 组件中，节省的不只是钱，更是毫米**。

这也是半导体产业里常见的一个规律：**当系统形态逼近物理极限时，价值会从「芯片性能」转移到「交付形态」**。同一颗 DSP，做成标准封装与做成 KGD，对客户的工程意义完全不同。

## 五、RELIANT 遥测：把互连变成可运维资产

原文用一句话把两款器件接入 **Marvell RELIANT 互连遥测平台**，提供「real-time visibility、predictive insight and automated optimization」。这句话在新闻稿里不显眼，却是把「卖器件」升级为「卖可运维链路」的伏笔：

- 224G 链路对温度、通道损耗、连接器老化极其敏感，链路层遥测数据是运维侧提前发现退化、避免整机柜停机的主要手段；
- 一旦遥测数据回流到厂商侧，厂商就同时握有**性能调优与故障诊断的接口**，这对客户形成的是流程级而非器件级的依赖。

需要指出的是，原文**没有给出任何遥测的采样粒度、上报机制、数据归属或与客户的接口形态**。把它理解为「一个已被写入产品定义的平台化方向」是合理的，把它理解为「已可交付的能力」则缺乏依据。

## 六、厂商主张 vs 可采信部分

| 陈述 | 类型 | 本站判断 |
|---|---|---|
| 16 × 224G PAM4，聚合 3.2 Tbps | 产品定义 | 可采信。口径已可在内部自洽（见 2.1） |
| 45 dB+ 插损补偿 | 产品定义 | 可采信为设计目标，但**未给出测量频率与测试条件** |
| AEC 铜缆实达超过 6 米、为第一代两倍 | 性能主张 | 方向可采信；「两倍」的基准是第一代自家产品，非第三方 |
| 12.8 W、12 mm × 14 mm、KGD | 产品定义 | 可采信为规格目标（送样阶段） |
| 「省 8 W」 | 营销数字 | **基准不明**，不可直接引用（见 2.3） |
| Ethernet / UALink / ESUN 同时支持 | 产品定义 | 可采信；这是本次发布最具战略含义的一条 |
| 接入 RELIANT 遥测平台 | 平台声明 | 方向可信，**细节全部缺失** |
| AI scale-up 网络市场 2030 年超 500 亿美元 | 第三方分析师引述 | 来自 LightCounting 创始人，属可核实的机构口径；但分析师预测本身有其假设与商业利益 |
| 三家生态伙伴（AMD/UALink、Amphenol、Molex）背书 | 客户/伙伴证言 | 均为组件与连接器厂商，**与 Marvell 存在商业关系**；背书内容是「愿意一起做」，不是「已量产采用」 |
| 「Industry-leading」「industry-first」类表述 | 营销用语 | 无第三方验证，按惯例略过 |
| 全部器件「currently sampling to customers」 | 供货状态 | 关键约束：**尚无量产、无报价、无客户名单、无第三方实测** |

## 七、这则新闻没有回答什么

1. **延迟数字**：原文两处提到「reduced latency」「ultra-low latency」，但**一个纳秒数字都没有**。而延迟恰恰是重定时器相对光互连的核心卖点，也是 scale-up 场景最在意的指标。
2. **45dB 的测试条件**：测量频率、参考通道模型、是否含连接器与线缆，均未说明。没有这些，45dB 无法与竞品横向比较。
3. **功耗比较的对手**：见 2.3，基准不明。
4. **第一代 Alaska A 的实达距离**：既然第二代是「两倍」，第一代应为约 3 米——但原文没有写出来，读者需要自行反推。
5. **成本与价格**：全文零成本信息。而 AEC 与光互连的替代临界点，本质上由**每米成本 × 距离**决定，不是由技术指标决定。
6. **采样客户与量产节点**：仅「sampling」，无 DSP 流片节奏、无 2027 年量产指引。
7. **竞争对照**：Broadcom、Credo、Astera Labs 在同一代有可比产品，原文未作任何横向比较——这是新闻稿的常态，但意味着读者必须自己做这件事。

## 八、与本站其他文章的联系

- **[光学测试如何卡住 CPO 的大规模部署](https://marvinlee.cn/posts/why-optical-high-volume-test-is-10x/)** —— 本文讲的是「电」在 6 米以内守住阵地，那篇讲的是「光」要跨过量产闸门时遭遇的测试经济学。两篇合起来才是 224G 时代互连分工的完整图景：**铜的成本优势在距离内，光的成本劣势在测试里**。
- **[CPO 测试供应链：量产闸门从对准精度转向测试速度](https://marvinlee.cn/posts/cpo-testing-supply-chain-2027/)** —— 本批发布的另一篇，正好从供应侧补上「光那一半」的设备生态。
- **[一块基板不再通吃：先进封装基板为何走向应用专用化](https://marvinlee.cn/posts/one-substrate-no-longer-rules-them-all/)** —— AEC 的 DSP 贴装、KGD 交付形态与背板材料选择，最终都会落到基板与封装这一层。
- **[中国超节点供应链](https://marvinlee.cn/posts/china-supernode-supply-chain/)** —— UALink / ESUN 的路线分歧，在中国市场的落地节奏与本地互连方案选择上会呈现不同形态。

## 九、一句话总结

**Marvell 这次真正交付的不是 3.2T，而是三个「可被铺开」的许可：6 米以内的铜可以不退场、12.8W 的功耗可以进机柜、协议未定之前硅片不站队。** 而在送样阶段，所有这些都还是工程承诺——**买之前请先要到延迟数字和 45dB 的测试条件**。
