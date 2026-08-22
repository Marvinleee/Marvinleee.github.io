---
layout: post
title: "CPO Test Won't Scale Without Standardization — CPO 测试若缺乏标准化将无法规模化量产"
date: 2026-08-12 20:00:00 +0800
categories: [半导体技术]
tags: [CPO, 光测试, 标准化, 量产, 良率]
description: "整理自 SemiEngineering（Anne Meixner，2026-08-11）：CPO 从实验室仪表走向量产 ATE 卡在标准化缺失——连接器/测试规格/数据格式各自为政，导致交期长、成本高、设备难复用；NPO 12–18 个月、CPO 18–24 个月量产的节奏，呼唤共同制造框架。英文原文 + 中文深度解读。"
image: /assets/img/covers/cpo-test-wont-scale-without-standardization.jpg

---

> 本文整理自 **SemiEngineering**，原文发布于 **2026-08-11**，署名 **Anne Meixner**。
> 标题原文：*CPO Test Won't Scale Without Standardization*。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 说明：该文全文公开，无付费墙；文中 Fig.1（Amkor：CPO 组件拆分）/ Fig.2（Teradyne：硅光从晶圆到系统级测试工序）仅以图注出现、原页面未提供可用图片 src，按规范如实标注「配图未取得」，未强行嵌入。

---

# 第一部分：正文（Original Article）

## CPO Test Won't Scale Without Standardization

Across the CPO ecosystem, profitability will not happen until standardization occurs.

**Key Takeaways:**

- A smaller set of fiber connectors that meet manufacturing test high insertion count will ease the cost burden for all.
- Test specifications and associated standardized test formats will facilitate data analytics and lower test cell costs.
- Traceability across the multiple suppliers will bridge the data silos, which greatly improve yield learning.

---

Co-packaged optics (CPO) is taking off as AI data centers leverage every possible option for improving performance and reducing power, but moving from lab instrumentation to production ATEs on a factory floor is struggling to keep pace with demand.

CPO checks all the boxes for next-gen computing — higher bandwidth, lower power, and reduced latency. But there are so many options for heterogeneous integration, thermal management, serviceability, and manufacturing test — that it's slowing the rollout of this technology.

Nearly every aspect of the physical test cell poses a challenge, from the test specifications to data management. This is made worse by the fact that there are no standards for connectors, product specifications, or test data formats, so every CPO design requires a custom solution. The result is longer time to market, higher cost, and limited reuse of equipment and software.

"Traditionally, optics have been done with pluggables, but they typically tend to have very poor bandwidth density and power consumption relative to the kinds of bandwidths you need," said Vishal Chandrasekar, director of product management at Ayar Labs. "Plus, you need to get the optics closer and closer to the GPU, and you need to do it at low power. For scale-up applications, that's really becoming very bandwidth-sensitive. Scale-up has about 10X the bandwidth requirement of scale-out, and so traditional pluggables don't work. So then people are saying we need to put those two together."

The industry is taking a stepwise approach to optics integration with electronics. "The first step would be an NPO (near package optics), which brings the optical into the board, which is not in volume production yet. I expect that to get into volume production in 12 to 18 months' time. Phase two would be the CPO, which would be on the substrate, and that I expect to get to volume in 18 to 24 months time, at least for the scale-up applications or scale-out," said Chandrasekar. "Nvidia and Broadcom have introduced those solutions, and they are heavily ramping this into volume right now. [For CPO], we have to let the proof-of-concept phase run, and we are in the process of reducing the assembly time. In addition, the test equipment is being developed alongside the product with our partners."

But as with everything related to AI data centers, each new technology has spawned an industry-wide scramble. There are multiple CPO designs and approaches available. The problem is choosing which ones to use. Today, these are predominantly custom test cell solutions, which include everything from ATE instrumentation to robotic handling and software code. This is where standards are sorely needed to reduce the number of test-cell architectures, which in turn would reduce the cost of goods and alleviate the engineering team's burden.

"Standards can help the industry by reducing unnecessary variation in how co-packaged optics are accessed, stimulated, measured, and reported during test," said Abram Detofsky, manufacturing test architect at Intel Foundry. "Today, many optical test solutions are highly customized because package formats, optical interfaces, calibration methods, handling schemes, and data definitions can vary significantly. Standardization can create common expectations around test access, reference conditions, terminology, calibration practices, and result reporting. This helps equipment suppliers, OSATs, foundries, and customers build interoperable solutions instead of one-off engineering setups."

Others agree. "Standards are expected to play a vital role in helping all the customers, suppliers, and OSATs converge," explained Vineet Pancholi, manufacturing test technologist at Amkor. "Suppliers will converge toward production test simplification by designing test equipment that services a specific functionality and performance envelope. Customers will begin defining and architecting products that meet a certain specific standard — data rate(s), failure rate specifications, test limits, guard-bands, etc. OSATs will be able to help define the production test cell definitions with pre-defined success criteria and the overall production test workflow."

*Fig. 1: Components of co-packaged optics, split between electronic chiplets, photonic chiplets, and an external laser. Source: Amkor*

However, the chip industry has yet to settle on a data model for optical test content. "The hardware challenges get most of the attention, but the least-appreciated one is a data problem," said Dieter Rathei, CEO of DR Yield. "STDF was built for electrical parametric and functional results. It was never designed to carry a wavelength sweep or a polarization-dependent loss curve as a first-class object. So optical measurements end up flattened into scalar limits or parked in vendor-specific files, and the richness needed for real yield learning is lost before analysis even starts."

**Standards**
Standards begin with device design, which is used to create a common understanding from that point all the way to test measurements. In a March press release [1], Lightmatter announced a partnership with other Open Compute Project members to develop an open reference design at the rack level. The reference design and the associated specifications and standardization will enable the ecosystem to scale up to 10 million units/year, and test specifications will be included.

Multiple industry experts highlighted the large variance in test specifications, test data formats, and fiber connectors. Those need to be addressed because standardizing manufacturing tests, along with key components, will drive down the cost in a number of ways. For example, limiting the number of fiber connector types in a test cell would greatly benefit test equipment suppliers.

"Today, CPO packages vary widely from test program to test program," said Matt Griffin, senior product manager for the silicon photonics test group at Teradyne. "Current designs integrate anywhere from 4 to 36 optical engines across two to four sides of a compute die, and the industry still lacks a common approach to fiber connectors, alignment schemes, and laser delivery. This lack of connector standardization complicates automation, requiring test systems to support a variety of connector types, and practically means every new customer design can require a custom implementation."

When to implement standards has always included an element of guesswork. Because CPO is closely tied to AI data center build-up and build-out, it is being rolled out rapidly. Consequently, it may be up to the marketplace to reduce the number of optical connector choices because the technology is moving so quickly.

"The challenge is that the CPO market is evolving faster than traditional standards bodies can typically respond," said Ira Leventhal, vice president of research and venture at Advantest America. "As a result, industry leaders are increasingly driving de facto standards through their own market adoption, industry consortia, and multi-source agreements (MSAs). In some areas, such as optical connectivity, the market is already beginning to converge based on the evaluation and deployment decisions of leading customers and system providers as opposed to formal industry standards."

Nevertheless, a handful of assertions is needed over the connector's lifecycle. For manufacturing, there may be tens of thousands of insertions. If the connector design cannot survive that gauntlet, it can't be used in a production environment.

Many of the priorities here are shared with mainstream semiconductor assembly. "You have to maintain the thermals, you have to maintain the manufacturability, yields, and have field replaceability," said Ayar Labs' Chandrasekar. "These are all the different tradeoffs that people make. For instance, one example of CPO is to have external lasers because the laser is the high-risk part from a reliability perspective."

However, there is a rather surprising lack of standardization across the wide range of test methods and their associated specifications, which are often customized for each design. Reducing the variety of manufacturing test methods enables cost-effective and efficient test solutions. This can be approached by understanding the primary defect mechanisms.

"A comprehensive list of fabrication defect types in Si-optical structures is being identified from a half-dozen fab houses. This data is expected to drive the test priority and test limits," said Amkor's Pancholi. "For instance, customers have optical engines and optical switches that operate in the O-band and the C-band. Their performance attributes can vary widely. The OSATs will be successful when the deployed test equipment can cater to a larger range of products being fabricated. This will allow for maximum CapEx re-use."

Most of the standardization efforts so far have focused on physical and electrical interfaces. "But there's a parallel gap that gets far less attention — test-data standardization," said DR Yield's Rathei. "Interoperable modules aren't enough if every supplier reports optical parameters in a different schema, because cross-vendor yield learning then becomes a manual reconciliation exercise. The industry would benefit enormously from a common way to represent optical test content and unit genealogy so that data from a foundry, an OSAT, and a system integrator can be correlated without custom glue each time. That's the layer we work at, and it's where standardization would most directly reduce cost of test."

Others also point to the need for test data format standardization. "STDF was never really designed with optical measurements in mind — wavelength sweeps, far-field profiles, OSA traces, LIV curves — so every vendor invents something," said Aftkar Aslam, CEO of yieldWerx. "If we got an STDF extension (or a parallel format with the same discipline) that handled the optical side cleanly, downstream analytics would move much faster."

**Lack of standardization affects analytics**
In discussing the need for standardization for cost-effective and efficient test solutions, many industry experts pointed to data formats, device identifiers, and breaking down the silos between the different test insertions to support a robust data analytic platform. For purely electrical devices, such platforms have become an essential tool for yield learning, process optimization, and quality management. For CPO to reach desired production volumes, engineering teams will need this type of platform.

*Fig. 2: Test insertions for silicon photonics from wafer to system-level test. Source: Teradyne*

But currently the lack of standards/standardization impedes most aspects of setting up and maintaining a robust data analytics solution. Meg O'Brien, director of product engineering at Lightmatter, highlighted three areas that need attention:

- **Universal Optical Test Formats**: Optical testing currently lacks the standardized output common in electrical testing across ATE providers. Implementing consistent formats would remove the heavy engineering burden of developing bespoke data integrations, creating a plug-and-play testing environment.
- **Uniform Identifier Protocols**: Creating industry standards for die identification among PIC and EIC vendors, and defining how OSATs manage these IDs, is essential for seamless end-to-end traceability and streamlined quality assurance.
- **Standardized Test Metadata**: Aligning fields for environmental conditions, recipe versions, and hardware status would enable analytics platforms to operate across various suppliers without the need for manual data mapping, dramatically speeding up time-to-market.

**Traceability**
Analytics starts with device traceability. Engineers need two components for traceability. The first component is a readable physical ID, or a virtual ID (a.k.a. digital binding), for any component used in the CPO's final assembly. This encompasses EICs, PICs, lasers, fiber connectors, splitters, combiners, substrates, and heatsinks.

The second component is a data platform that stitches together the data available via these IDs, which necessitates sharing the IDs across the platform. But IDs are easily dropped during the transfer from one factory to the next. "This isn't a technology problem," said Aslam. "It's a contract problem. Anyone serious about CPO yield learning needs to write ID-propagation requirements directly into their OSAT statements of work and check them at incoming. From our side, we'll take whatever the factory gives us and make every linked ID a join key. But we can't manufacture data that nobody captured."

That data needs to be analyzed, as well. "As CPO manufacturing matures and moves toward high-volume production, data analytics will play an increasingly important role in correlating results across the entire test flow," said Advantest's Leventhal. "The ability to trace failures, identify process excursions, optimize test coverage, and predict yield impacts across multiple insertions will be essential for improving product quality while controlling manufacturing and test costs."

Implementing such a solution requires due diligence across all factories, and it often falls to the manufacturer to implement the tracking of physical IDs to feed into their data management and analytics system. Many point to challenges that make it so, including narrowing down data analytics methodologies across CPO customers, mature physical IDs for optical components, and auditing the links between factories.

"Supporting traceability in a CPO environment is primarily a challenge of data modeling," said Lightmatter's O'Brien. "The lifecycle of a single module involves tracking EIC and PIC dies, laser components, the final assembly, every test insertion, and potential rework cycles. Our centralized data platform facilitates this by stitching together identifiers across the entire value chain. By maintaining auditable links from raw data through to the integrated layers, we ensure that every component remains traceable back to its origin without compromising the intellectual property of individual suppliers."

Others agree that with traceability comes the acknowledgment that suppliers' IP needs to be protected while supporting the common good of CPO yield learning. "The goal is not to expose proprietary process details, but to preserve enough structured context (identity, lot history, test conditions, calibration state, and performance results) to support yield learning and quality management across both the advanced assembly flow and the supply chain," said Intel Foundry's Detofsky.

**Yield learning and more**
With an effective data management solution in place, engineering teams can decipher the relationships and measurements that can identify the source of a yield issue and propose a solution. That, in turn, enables them to apply adaptive test algorithms that improve product quality and use data-feedforward methods to assist with test optimization.

It starts with a robust data platform that checks all the boxes related to big data management — volume, velocity, variety, and veracity.

"Improving yield for co-packaged photonics necessitates expertise spanning EIC and PIC fabrication, assembly, and both optical and system-level testing—a breadth of knowledge rarely found in a single engineering discipline," O'Brien said. "To bridge these silos, we utilize a centralized hardware data platform to manage complex operational and analytical requirements. Key attributes of this infrastructure include a seamless data pipeline, unified truth, comprehensive genealogy, scalable architecture, and access and IP control."

With such a system in place, product engineering teams can merge data between electrical and photonic test measurements and ask salient yield learning questions.

"CPO test is where data analytics stops being optional," Rathei said. "The core problem is that electrical and optical results live in different worlds — parametric bins and functional pass/fail on one side, spectral sweeps, insertion loss, return loss, wavelength and polarization data on the other. Yield learning only happens when you can correlate across both on the same unit. We built our platform around cross-flow correlation for exactly this reason — pulling assembly, unit-level and system-level data into one model so an engineer can ask, 'Does this optical margin loss track a specific bond process, a specific EIC lot, or a specific test site without exporting three datasets and reconciling them by hand?' The teams moving fastest on CPO are the ones treating multi-domain correlation as a first-class capability rather than a post-mortem activity."

Others observe that their customers see similar value in merging data across test insertions.

"We've worked with photonic manufacturers running flows that look a lot like what CPO is becoming — bar test, tile test, far-field, SPC, inline inspection — and the analytics value lands in three pretty consistent places. The biggest one is just getting the streams onto one canvas," said yieldWerx's Aslam. "If you can correlate bar-test electricals with far-field optical metrics in a single analysis, you start spotting things like, 'Units with marginal threshold current are the ones losing far-field power two insertions later.' Second is the basic unit-level commonality and outlier work, such as PAT and MV-PAT, which catches systematic problems an engineer scanning a spreadsheet won't see in time. Third is having executives, process owners, and the test team all looking at the same Power BI report so the discussions actually start from the same numbers. The hard part is almost never the math. It's getting the data merged in the first place."

**Conclusion**
While test challenges in CPO are understood well enough, the need to standardize is only now gaining attention. To scale to 10 million units per year, standardization is essential. Without it, the entire ecosystem is left struggling with the heavy engineering burden of supporting manufacturing test.

All industry experts point to the need for test-related standards, both formal (e.g. extending STDF for optical measurements) and informal (e.g. data management agreements). However, several of them also noted that equipment vendors and OSATs often follow their lead customers.

"CPO test will not scale if every product, supplier, package, optical interface, and test cell is treated as a custom engineering project. The industry must move toward a shared manufacturing framework — common optical test-access concepts, repeatable package-level mechanical interfaces, standardized traceability practices, consistent data structures, and DFT features that make optical engines observable and controllable across the test flow and across multiple suppliers," noted Intel Foundry's Detofsky. "This does not mean every company has to expose proprietary design or process details. The goal is to standardize the optical, mechanical, test methods, calibration, and data boundaries that allow foundries, OSATs, equipment suppliers, component suppliers, and system companies to be interoperable and make consistent quality decisions. Interoperability at boundaries is key."

**References:**

---

# 第二部分：解析（深度解读）

## 核心论点摘要

SemiEngineering 这篇把 CPO 产业化里最被低估的一环摆上台面：**测试与良率管理**。硬件能造出来，不代表能在工厂里低成本、可复用地测出来——而「能不能规模化测试」直接决定 CPO 能否盈利。

- **三大痛点（Key Takeaways）**：① 光纤连接器种类收敛 → 全行业降本；② 统一测试规格与数据格式 → 数据分析和测试工站降本；③ 跨多供应商的可追溯性 → 打通数据孤岛、加速良率学习。
- **节奏锚点（Ayar Labs 的 Chandrasekar）**：NPO 量产 **12–18 个月**、CPO（基板级，至少 scale-up/scale-out）量产 **18–24 个月**；NVIDIA 与 Broadcom 已在猛推量产，但 PoC 阶段仍在压缩组装时间、与伙伴同步开发测试设备。
- **「缺标准」的具体代价**：连接器、产品规格、测试数据格式全无标准 → 每个 CPO 设计都是定制测试工站（ATE 仪表 + 机械手 + 软件），交期更长、成本更高、设备软件难复用。
- **STDF 的盲区（DR Yield / yieldWerx）**：老牌电气测试数据格式 STDF 从没为光测量设计——波长扫描、远场轮廓、OSA 轨迹、LIV 曲线无处安放，光参数被压成标量或塞进厂商私有文件，真正的良率学习在分析的起点前就丢了。
- **可追溯性是「合同问题不是技术问题」（yieldWerx 的 Aslam）**：EIC/PIC/激光器/连接器/基板/散热片的 ID 在工厂间流转极易丢失，必须写进 OSAT 的 SOW 并在来料端校验。
- **量级目标**：Lightmatter 联合 OCP 推机柜级开放参考设计，目标生态可扩到 **1000 万颗/年**，且把测试规格纳入标准化——没有标准化，这个数根本到不了。

## 关键概念解读

**1. 测试工站（test cell）为什么是 CPO 的隐性瓶颈**
本文与本站 [《CPO 最大的瓶颈：高良率测试》](/posts/cpo-biggest-bottleneck-high-volume-testing/) 是同一命题的两面：那篇从微观（FAU 良率、外部光源可靠性）切入，本篇从宏观（标准化缺失导致每个设计都要定制工站）切入。两者合起来才构成「CPO 量产的测试墙」全貌。

**2. NPO 先于 CPO 的量产节奏再次被印证**
Ayar 给的 12–18 个月（NPO）/ 18–24 个月（CPO）时间表，与 [Third Bridge 视角](/posts/is-optical-connectivity-ai-next-bottleneck/)（2027 起量、2028 渗透 20–30%、GPU 侧 2028–2029 拐点）以及 [《为什么 CPO 正变得不可避免》](/posts/why-cpo-is-becoming-inevitable-cpo/) 的演进判断相互印证——NPO 是过渡、CPO 是方向，但都还没到「插上就能用」的阶段。

**3. scale-up 带宽是 scale-out 的 10 倍**
Ayar 这句话（scale-up 带宽需求约为 scale-out 的 10 倍）直接解释了为什么传统可插拔在 scale-up 失效、必须上光 I/O——这也是 [《AI 瓶颈正移向先进封装》](/posts/the-ai-bottleneck-is-moving-to-advanced/) 反复强调「赛点从交换机移向 XPU-HBM 封装内光 I/O」的工程根源。

**4. 谁在定义「事实标准」：MSA 与头部客户**
Advantest 的 Leventhal 点出关键：CPO 市场演进快过传统标准组织，于是行业领袖通过**市场采用、产业联盟、多源协议（MSA）**驱动事实标准。这对投资的含义是——押注「被头部客户/系统厂选中的接口与测试方案」比押注「某个 formal 标准」更靠谱。

## 分层拆解表

| 维度 | 关键判断（文中专家共识） | 受益/风险方 |
|---|---|---|
| 量产节奏 | NPO 12–18 月、CPO 18–24 月（scale-up/scale-out） | NVIDIA/Broadcom 先发，但 PoC 仍在压组装+测设备 |
| 连接器 | 缺乏统一 → 工站需支持多种，几乎每单定制 | 连接器标准化收敛利好头部连接器厂 |
| 数据格式 | STDF 不适配光测量，需扩展/并行格式 | 良率软件（DR Yield、yieldWerx）直接受益 |
| 可追溯性 | ID 跨厂丢失是「合同问题」，须写入 OSAT SOW | 有端到端数据平台者（Lightmatter）占优 |
| 标准路径 | 正式标准慢，事实标准靠 MSA/头部客户采纳 | 被选中的接口/测试方案确定性更高 |
| 规模目标 | 1000 万颗/年须标准化，否则工程负担压垮生态 | 未标准化 = 全行业定制成本 |

## 产业链映射与投资含义

- **测试设备双雄**：Teradyne、Advantest 是被点名的硅光测试组主力；CPO 量产放量直接拉动其光学 ATE 需求。
- **OSAT 整合者**：Amkor 被多次引用为「定义量产测试工站」的角色，是先进封装测试一体化的关键承接方。
- **良率/数据软件层**：DR Yield、yieldWerx 这类跨域（电+光）相关性分析平台，正是文中「测试数据标准化」缺口的填补者——轻资产、高粘性。
- **与第三方研究的衔接**：[TrendForce 的 CPO 测试市场机会](/posts/trendforce-cpo-testing-market-opportunities/) 给的是市场规模视角，本文给的是「为什么市场还没起来（标准化缺位）」的机理视角，两者互补；[Semianalysis 的 CPO 书级 scaling 分析](/posts/semianalysis-co-packaged-optics-cpo-book-scaling/) 则可补上系统设计侧的约束。

## 风险提示

1. **标准化时间不确定**：正式标准慢、事实标准靠 MSA，若头部客户路线分裂，测试工站定制化的高成本状态可能比预期更久。
2. **连接器可靠性门槛**：制造端单连接器可能要承受数万次插拔，过不了这道关就不能进产线——材料/结构验证有不确定性。
3. **数据孤岛是组织问题**：可追溯性依赖跨厂合同与 SOW 约束，供应链协作意愿与执行力会拖慢良率学习曲线。
4. **量级目标依赖标准化**：「1000 万颗/年」的目标是条件句，前提是把连接器/规格/数据三件套标准化；未达成前，相关设备与软件的需求斜率可能低于预期。

> 注：本文为 SemiEngineering 公开全文的整理与解读，所有专家观点与图示版权归 SemiEngineering 及受访者所在机构（Ayar Labs、Intel Foundry、Amkor、Teradyne、Advantest、DR Yield、yieldWerx、Lightmatter 等）所有；文中 Fig.1/Fig.2 因原页面未提供可用图片 src 未嵌入，以上分析仅作产业研究参考，不构成投资建议。
