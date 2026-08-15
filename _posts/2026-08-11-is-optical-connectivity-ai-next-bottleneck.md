---
layout: post
title: "Is Optical Connectivity the Next Bottleneck in AI Data Centers? — 光互联会是 AI 数据中心的下一个瓶颈吗？"
date: 2026-08-11 20:00:00 +0800
categories: [半导体投资]
tags: [半导体, CPO, 光通信, 先进封装, NVIDIA, 供应链]
description: "整理自 Third Bridge（桥知集团）TMT Perspectives：基于多位全球光通信专家访谈，拆解从可插拔光模块到 CPO 的演进节奏、NPO 过渡定位、NVIDIA 与 Broadcom 的生态卡位，以及 200G EML / 高功率 CW 激光器短缺下的中国替代窗口。英文原文 + 中文深度解读。"
---

> 本文整理自 Third Bridge（桥知集团）官方 Perspectives 栏目：[Is optical connectivity the next bottleneck in AI data centers?](https://www.thirdbridge.com/en-us/about-us/media/perspectives/is-optical-connectivity-ais-next-bottleneck)，原文发布于 **2026-06-17**，署名 **Venis Zhu, Analyst（TMT）**。
> 标题原文：*Is optical connectivity the next bottleneck in AI data centers?*。
> 结构为 **正文（英文原文）+ 解析（中文深度解读）**，方便中英对照阅读。
> 说明：该文为公开 Perspectives 内容（无付费墙），全文基于 Third Bridge 专家访谈整理；文中引述的专家观点均来自其访谈库（forum.thirdbridge.com），本站仅作整理与解读，不构成投资建议。

---

# 第一部分：正文（Original Article）

## Is optical connectivity the next bottleneck in AI data centers?

### The shift from pluggable transceivers to CPO

US, Global, APAC, China

GPUs have long been seen as a necessary building block and critical bottleneck for AI, however, attention appears to be shifting to a new challenge: data transmission. As AI infrastructure expands, traditional electrical interconnects based on copper cabling are facing growing physical limitations, including signal degradation, rising power consumption, and thermal management challenges. These constraints are emerging as major obstacles to further scaling of AI systems.

As a result, optical interconnects are increasingly viewed as the key technology for overcoming networking bottlenecks in an era of massive AI clusters. Among the most closely watched innovations is Co-Packaged Optics (CPO), which integrates optical engines directly with switching or compute chips. The technology is widely regarded as a critical component for next-generation AI data centers and is entering a pivotal phase of commercial deployment.

Third Bridge recently interviewed a number of leading experts across the global optical communications industry to examine CPO and the broader trends in the optical networking ecosystem.

### 1. Can pluggable optical modules be completely replaced by CPO?

According to our experts, the primary advantage of traditional optical modules lies in their pluggable design. When a component fails, operators can replace the module through hot-swapping, which minimises maintenance costs and operational disruption.

By contrast, CPO still faces reliability challenges. Because optical engines and high-value switching or processing chips are integrated within the same package, a failure in the optical subsystem could require replacing an entire CPO board rather than a single component, significantly increasing maintenance costs.

> "In a CPO architecture, all components are integrated within a single switch. If any part of that switch fails, the entire switch may need to be replaced, creating substantial maintenance costs. This is one reason many companies are choosing Near-Packaged Optics (NPO) as an intermediate solution rather than jumping directly from pluggable optics to CPO." —— Former AI Architect at a global tech firm, 2026/04/17 (*AI Interconnects – Hyperscaler Assessment – Networking Evolution & CPO Adoption Drivers*)

According to a Third Bridge expert, despite enthusiasm for CPOs, a stable commercial inflection point is unlikely to arrive before the second half of 2027. Throughout 2026, traditional pluggable optical modules are expected to remain the dominant industry standard.

A key reason lies in the changing nature of AI workloads. As AI agents become increasingly deployed across enterprises and consumer applications, inference demand is expected to accelerate significantly over the next two years.

Unlike training workloads, which require high bandwidth and low latency and therefore benefit more from CPO architectures, inference workloads are generally deterministic in nature and can be adequately supported by traditional optical modules.

As a result, Third Bridge experts expect CPO and pluggable optics to coexist for at least the next three to five years. Rather than replacing the existing ecosystem, CPO is likely to create incremental market opportunities.

> "Over the next two years, traditional optical modules will continue to enjoy a significant cost advantage. Cloud providers delivering external services will still primarily rely on 400G, 800G and 1.6T optical modules because they offer flexibility, scalability and ease of maintenance."
>
> "The fundamental challenge facing CPO today is not hardware acquisition cost, but the cost of training time. Large-scale AI training jobs often run continuously for two or three weeks. If a network port failure interrupts training, the entire process may need to restart. The resulting time loss and cost escalation are far more significant than the hardware cost itself."
>
> "Within rapidly growing inference clusters, 400G and 800G optical modules remain the mainstream solution. CPO represents an incremental opportunity. It is unlikely to displace existing deployments until network speeds reach 1.6T, 3.2T and beyond." —— Former senior director of a major technology company in China, 2026/03/10 (*AI Data Centre Industry 2026 Series – Communication Architecture – Optical Communication Transformation in Focus*)

As AI agents continue to proliferate, inference workloads are expected to become one of the most important drivers of future data centre expansion. According to an expert we spoke with, "Training workloads require extreme bandwidth and transmission performance, which supports the adoption of CPO. Inference workloads, however, operate on a deterministic architecture and provide greater networking flexibility. As a result, most organisations will continue to deploy traditional optical modules for inference rather than CPO." —— Former AI Architect at a global tech firm, 2026/04/17 (*AI Interconnects – Hyperscaler Assessment – Networking Evolution & CPO Adoption Drivers*)

### 2. How far is CPO from large-scale commercial adoption?

In June 2026, Nvidia announced that its next generation AI networking platform based on CPO technology, Nvidia Spectrum-X, had entered full scale production. However, our experts suggest that Nvidia's early deployment is not sufficient enough to signal that CPO is ready for industry-wide adoption.

Third Bridge experts remain cautious on the pace of adoption for Nvidia's Spectrum-X CPO switches. They believe the industry continues to face significant challenges related to manufacturing yields, packaging complexity and long term reliability, while North America's largest cloud providers may not become major adopters over the near term.

> "Although Nvidia has successfully brought Spectrum-X CPO switches into production, widespread adoption remains at least one to two years away from a supply chain perspective. The biggest technical bottlenecks remain advanced packaging and FAU (Fiber Array Unit) yields. Given the highly integrated nature of CPO architectures, yield issues at any stage of production can be amplified significantly."
>
> "Reliability challenges linked to external light sources have not yet been fully resolved. In the case of Nvidia Spectrum-X, laser power exceeds 300 milliwatts. If dust or organic contaminants are present on the fiber end face, prolonged exposure to high power lasers can generate heat buildup, potentially causing burning or melting at the optical interface. These remain critical technical hurdles for the commercialization of CPO."
>
> "We expect the initial customers for Nvidia's CPO switches to be AI cloud startups rather than North American hyperscalers. Major cloud providers including Google, Meta, AWS, Microsoft and Oracle have largely developed their own chip and networking strategies, making them more likely to pursue customized solutions rather than purchase Nvidia's complete CPO switch platforms." —— Former Account Manager at a major materials technology company in China, 2026/04/13 (*CPO Passive Optical Interconnect – Architecture Evolution, Volume Usage & Competitive Landscape*)

This view is echoed by another expert: "When comparing pluggable and non-pluggable architectures such as CPO, the biggest concern is vendor lock in. With pluggable modules, customers can combine a Broadcom switch with optical modules from Innolight or other vendors, giving them considerable flexibility. Large cloud providers do not want to be tied to a single chip architecture, optical stack and packaging ecosystem, yet that is effectively what CPO represents today." —— Former AI Architect at a global tech firm, 2026/04/17 (*AI Interconnects – Hyperscaler Assessment – Networking Evolution & CPO Adoption Drivers*)

Experts expect pluggable optical modules to remain the dominant solution for cloud giants such as Microsoft and Amazon throughout 2026. CPO adoption is expected to begin in earnest during 2027, reaching approximately 20% to 30% penetration by 2028. Because maintenance challenges continue to slow deployment, Near Packaged Optics (NPO) is likely to gain traction as an intermediate solution that preserves architectural flexibility.

Another expert believes CPO is likely to see early adoption in scale-out networking environments with transmission distances below 500 meters. These deployments will primarily connect large numbers of switches, GPUs and CPUs.

By contrast, scale-up architectures within racks and chip level systems, as well as long distance scale-across deployments between data center clusters, are expected to adopt CPO much later. These segments must first overcome the physical limitations of 400Gb signal transmission and the technical complexity associated with multi wavelength optical networking. As a result, large-scale adoption in these markets may not occur until 2030 to 2032.

Following its deployment in networking switches, the next phase of CPO development is expected to extend into GPUs themselves.

> "CPO has already established a foothold in networking switches, but the real technology gap remains on the GPU side. Large scale deployment is still several years away because of the engineering challenges associated with system stability and reliability. We expect a major inflection point around 2028 to 2029 as GPUs and other XPU architectures become increasingly integrated with optical interconnect technologies. Nvidia, AMD and other leading vendors are likely to accelerate adoption at that stage." —— Former Director at a major global semiconductor company, 2026/04/07 (*US Optical Module Market Update – From LPO to CPO in 800V DC Data Centres*)

### 3. The battle between open and closed ecosystems

Although Nvidia has taken the lead in commercializing Spectrum-X CPO switches, another critical player in the market is Broadcom.

According to Third Bridge experts, Nvidia and Broadcom could collectively control approximately 70% of the global CPO market by 2028. Nvidia is expected to capture around 50% market share through its leadership in AI infrastructure, while Broadcom could secure roughly 20% through continued expansion of its deployment footprint. The remaining 30% is likely to be divided among customized solutions developed by cloud providers.

> "Between 2027 and 2028, Nvidia is likely to remain the dominant force in the CPO market, while Broadcom's shipment volumes will remain comparatively smaller. Broadcom's current CPO solutions are less integrated and support lower bandwidth scale. Although Broadcom introduced CPO products earlier, its solutions are primarily based on switch chips and do not offer the same strategic advantages as Nvidia. Nvidia's goal is to support and expand its GPU ecosystem. From GPU chips and CPO technology to optical modules, the company is attempting to control the entire value chain. Once technology integration and supply chain execution mature, Nvidia will be in a position to shape the ecosystem from design through manufacturing." —— Former Senior Marketing Manager at a China-based optical communications company, 2026/04/01 (*CPO & FAU Industries*)

To strengthen its position, Nvidia invested $2 billion into both Coherent and Lumentum, committing a combined $4 billion to secure access to critical optical technologies.

While Nvidia has publicly described these partnerships as non-exclusive, an expert argued that the practical outcome may be far more restrictive:

> "US antitrust regulations require Nvidia to characterize these investments as non-exclusive. However, because the solutions incorporate key technologies such as NVLink and InfiniBand, the products being developed with Lumentum will primarily be optimized for Nvidia's ecosystem. Even if other customers can theoretically access the technology, they cannot fully utilize it without access to NVLink and InfiniBand. In practice, the result is a form of effective exclusivity." —— Former senior director of a major technology company in China, 2026/03/10 (*AI Data Centre Industry 2026 Series – Communication Architecture – Optical Communication Transformation in Focus*)

### 4. Global supply chains and China's opportunity

Following Nvidia's investments in Coherent and Lumentum, and the resulting allocation of key production capacity to Nvidia-related programs, shortages of advanced 200G EML lasers and high power CW lasers have become more pronounced across the industry.

Experts believe that while Chinese suppliers cannot yet fully replace overseas leaders in the highest end-segments, the resulting supply constraints are creating a valuable window of opportunity for domestic alternatives.

> "Because Nvidia has effectively secured much of the supply from Lumentum and Coherent, other customers have struggled to obtain high end laser products. To ensure continuity of supply, the industry has gradually lowered some of its traditional qualification barriers. This has created a historic opportunity for Chinese companies such as Source Photonics, Focuslight Technologies and other vendors with in-house laser chip capabilities."
>
> "The long term winners will be companies capable of solving challenges related to optical coupling, thermal management, passive integration and optical engine manufacturing. In the silicon photonics and CPO era, passive component suppliers are becoming more important, not less. By contrast, companies whose capabilities are limited to assembling traditional pluggable optical modules could face significant long term risks." —— Former Business Director at a leading optical communications firm in China, 2026/05/21 (*Optical Communication Industry 2026 Series – Optical Chip Supply & Demand Landscape & Import Substitution Progress*)

Beyond China's emerging suppliers, Japanese companies including Mitsubishi, Sumitomo, Furukawa and Fujikura are also expected to play an indispensable role in the future CPO ecosystem, particularly in advanced materials, optical components and fiber infrastructure.

### Conclusion

Despite growing investor enthusiasm for optical communication technologies, CPO is unlikely to replace the existing optical interconnect ecosystem overnight or even over the nearer term. Instead, it should be viewed as an incremental market opportunity, as challenges around reliability, manufacturing and system integration still need to be addressed.

For the next several years, CPO and pluggable optics are expected to coexist, with NPO acting as a transition technology. Adoption is also likely to happen in stages, with scale-out networking using CPO first, while scale-up GPU interconnects are unlikely to see broad deployment until around 2030 to 2032.

While Chinese optical component suppliers may not yet be able to fully replace overseas leaders in the highest-end segments, supply constraints could create opportunities for global companies seeking alternative suppliers.

*All insights in this article are based on information provided by Third Bridge experts.*

---

# 第二部分：解析（深度解读）

## 核心论点摘要

Third Bridge 这篇 Perspectives 没有押注「CPO 马上颠覆一切」，而是用一组专家访谈把节奏、风险、生态与供应链拆开讲——结论偏审慎：

- **光互联是「下一个瓶颈」，但 CPO 不是明天就赢。** 铜互连在信号衰减、功耗、散热上触及物理极限，光互连是必答题；但 CPO 的真正放量要等到 **2027 年才认真开始，2028 年渗透约 20%–30%**。
- **可插拔与 CPO 将长期共存（3–5 年），NPO 是过渡形态。** 可插拔的最大优势是热插拔、可单件更换、运维成本低；CPO 把光引擎和高价值交换/计算芯片封在同一包里，一旦光子系统失效要换整板——这是大厂先选 NPO 的原因。
- **工作负载决定采用节奏：训练吃带宽、利好 CPO；推理是确定性流量，可插拔够用。** AI Agent 带来的推理爆发，反而延长了可插拔模块的生命周期。
- **NVIDIA + Broadcom 到 2028 年可能吃掉全球 CPO 约 70% 市场**（NVIDIA ~50%、Broadcom ~20%），其余被云厂自研瓜分；NVIDIA 对 Coherent / Lumentum 各投 20 亿美元（合计 40 亿）锁定关键光技术，实际形成「有效排他」。
- **供应链卡点是 200G EML 与高功率 CW 激光器短缺**，反而给中国（Source Photonics、Focuslight 等自有激光器芯片厂商）和日本（Mitsubishi、Sumitomo、Furukawa、Fujikura）材料/器件/光纤厂商打开了替代窗口。

## 关键概念解读

**1. 可插拔（Pluggable）→ NPO → CPO 的三级跳**
不是「插拔 vs CPO」的二元对立，而是一条可靠性/集成度递增的曲线：
- 可插拔：故障换模块，运维最省，但功耗和密度到顶；
- NPO（Near-Packaged Optics）：把光引擎挪到靠近 ASIC 的位置但仍可维护，折中方案；
- CPO（Co-Packaged Optics）：光引擎与交换/计算芯片共封装，能效与密度最优，但「一损俱损」。

本站此前在 [《CPO 幻觉 / CPO 特别篇终章》](/posts/the-illusion-of-cpo-cpo-special-final/) 与 [《为什么 CPO 正变得不可避免》](/posts/why-cpo-is-becoming-inevitable-cpo/) 中已从物理与产业视角论证过这条路径，本文的增量价值在于用一线专家访谈给出了**具体时间表**。

**2. Scale-out 先于 Scale-up，GPU 侧是真正的鸿沟**
Third Bridge 专家的判断与本站 [《AI 瓶颈正移向先进封装》](/posts/the-ai-bottleneck-is-moving-to-advanced/) 高度一致：CPO 先在 **<500m 的 scale-out 交换网络**落地，而机柜内 / 芯片级 scale-up、以及跨集群长距 scale-across 要等到 **2030–2032**。GPU 侧的光 I/O 才是真正的工程鸿沟——这也呼应了 [《TSMC 领先 CPO，三星把第三颗芯片贴到 HBM 旁》](/posts/tsmc-ahead-in-cpo-samsung-third-chip/) 里「赛点从交换机移向 XPU-HBM 封装内光 I/O」的判断。

**3. 外部光源 >300mW 的可靠性隐患**
Spectrum-X 激光功率超 300mW，光纤端面若有灰尘/有机物污染，长时间高功率照射会局部积热、烧熔光接口。这解释了为什么 [《CPO 最大的瓶颈：高良率测试》](/posts/cpo-biggest-bottleneck-high-volume-testing/) 把测试与良率视为产业化命门——FAU（光纤阵列单元）良率 + 外部光源可靠性，是比「能不能做出来」更难的量产问题。

**4. 生态开放 vs 封闭：NVLink / InfiniBand 筑起的「有效排他」**
NVIDIA 嘴上说对 Coherent / Lumentum 的投资「非独占」，但产品围绕 NVLink 与 InfiniBand 优化，没有这两张网就「理论可用、实际用不全」。这与 [《根本不存在所谓的 CPO 股票》](/posts/there-is-no-such-thing-as-a-cpo-stock/) 反复强调的「买 CPO 不能脱离整条 NVIDIA 价值栈」互为注脚。

## 分层拆解表

| 维度 | 关键判断（Third Bridge 专家共识） | 时间锚点 | 投资含义 |
|---|---|---|---|
| 采用节奏 | 可插拔 2026 仍主导；CPO 2027 起量，2028 渗透 20%–30% | 拐点 H2 2027 | 别用「CPO 已爆发」给 2026 估值 |
| 形态演进 | 可插拔 → NPO（过渡）→ CPO 长期共存 | 3–5 年共存 | NPO 相关器件厂有阶段性机会 |
| 落地场景 | scale-out（<500m）先跑；scale-up / 长距 2030–2032 | GPU 侧 2028–2029 拐点 | GPU 光 I/O 是更远期、更高弹性的赛道 |
| 市场格局 | NVIDIA ~50% + Broadcom ~20% = 约 70%（2028） | 2027–2028 | 二供 + 云厂自研分剩余 30% |
| 供应链 | 200G EML / 高功率 CW 激光器短缺 | 当下已紧张 | 国产激光器芯片替代窗口打开 |
| 风险点 | 可靠性（整板更换）、良率（FAU/封装）、Vendor lock-in | 贯穿产业化 | 单一 CPO 标的波动大 |

## 技术趋势与产业链映射

- **先进封装是 CPO 的物理底座**：本文点名的 FAU 良率、先进封装复杂度，与本站 [《先进封装：Intel EMIB vs CoWoS》](/posts/advanced-packaging-intels-emib-vs/) 的 2.5D/3D 封装竞争直接相关——CPO 的良率天花板本质上是封装良率。
- **SerDes 是 CPO 前面的「100 秒瓶颈」**：在光引擎集成之前，电侧 [SerDes（见入门篇）](/posts/serdes-part-1-the-technology-you-should-know-before-cpo/) 与 [224/448Gbps 收发器](/posts/pushing-the-speed-limit-serdes-transceivers-224-448gbps/) 仍决定带宽上限，是理解 CPO 前置条件的钥匙。
- **激光器是当下的硬瓶颈**：200G EML 与高功率 CW 激光器短缺，利好具备自有激光器芯片能力的厂商；[《Lumentum 的技术与护城河》（激光器 Part 2）](/posts/lasers-for-cponpo-part-2-lumentums-tech-and-moat/) 已专门拆解这一环节。
- **系统视角**：CPO 不是单点器件，而是「GPU + 光引擎 + 封装 + 网络协议」的系统工程，建议结合 [《AI 硬件入门》](/posts/the-ai-hardware-primer/) 与 [《AI 内存入门》](/posts/the-ai-memory-primer/) 建立完整坐标系。

## 风险提示

1. **时间错配风险**：市场常把「NVIDIA 已量产 Spectrum-X」误读为「CPO 全面就绪」。本文与多数专家的判断是 **2027 才认真起量、2028 才 20%–30% 渗透**——叙事跑在基本面前面时，估值回撤风险高。
2. **可靠性 / 运维风险**：CPO 共封装导致「一损俱损」，整板更换成本显著高于可插拔热插拔；在可靠性数据积累足够前，大云厂更可能先用 NPO 过渡。
3. **生态锁定风险**：NVIDIA 通过 NVLink / InfiniBand + 对关键光器件厂的资本绑定形成「有效排他」，非 NVIDIA 栈的 CPO 方案商业兑现存在不确定性。
4. **供应链集中度风险**：Coherent / Lumentum 产能被 NVIDIA 锁定，反而压迫其他客户；国产替代是机会，但高端 EML / CW 激光器仍受认证壁垒制约，替代是「窗口」而非「立刻填满」。

> 注：本文为 Third Bridge 公开 Perspectives 内容的整理与解读，所有专家观点归 Third Bridge 及其访谈对象所有；以上分析仅作产业研究参考，不构成任何投资建议。
