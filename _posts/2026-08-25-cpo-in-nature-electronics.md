---
layout: post
title: "SK hynix's technology roadmap for co-packaged optics features in 'Nature Electronics,' as AI competition shifts from chips to systems — 中文解读"
date: 2026-08-25 08:00:00 +0800
categories: [光互联]
tags: [CPO, 共封装光学, SK海力士, Nature Electronics, 带宽墙, 光子中介层, AI基础设施]
description: "SK hynix 联合全球研究者于《Nature Electronics》发表 CPO 路线图，提出以光互连突破 AI 带宽墙、从芯片级走向系统级的协同设计架构。"
---

> **来源**：[SK hynix Newsroom](https://news.skhynix.com/en/cpo-in-nature-electronics/) — *SK hynix's technology roadmap for co-packaged optics features in 'Nature Electronics,' as AI competition shifts from chips to systems*
> **原文链接**：<https://news.skhynix.com/en/cpo-in-nature-electronics/>
> **原文发布日**：2026-08-20 ｜ **作者**：SK hynix（Seunghoon Hong、Prof. Kyusang Lee 等）
> **说明**：本文为英文原文全文转载，附中文结构化解读。原文以英文写就，未作翻译；解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

▪ SK hynix has collaborated with leading global researchers to publish a roadmap for co-packaged optics (CPO), a key technology for next-generation AI infrastructure, in the prestigious scientific journal “Nature Electronics.”

▪ Extending beyond HBM innovation, the paper presents a blueprint for optical interconnects that address data bottlenecks at the rack and pod levels.

▪ The research proposes how an optics-centric co-design architecture, which connects memory and processors through optical links, can improve the scalability of large-scale AI systems.

[Read the paper](https://www.nature.com/articles/s41928-026-01681-6)
· Title: Co-packaged optics for high-performance computing and artificial intelligence
· Published in: Nature Electronics, 2026
· Authors: Seunghoon Hong (AI Infra Team Lead, SK hynix); Professor Kyusang Lee, Department of Electrical and Computer Engineering, University of Virginia (UVA); and researchers from the University of Illinois Urbana-Champaign (UIUC), Nanyang Technological University (NTU), the Massachusetts Institute of Technology (MIT) and Yonsei University

**High Bandwidth Memory (HBM)** has played a key role in enabling generative AI, significantly improving performance by overcoming memory bottlenecks within AI accelerator packages. However, as hyperscale AI clusters increasingly combine thousands of GPUs and HBM stacks, a new bottleneck has emerged: the bandwidth wall, which limits data movement between systems.

Against this backdrop, SK hynix and a team of global researchers have published **“[Co-packaged optics for high-performance computing and artificial intelligence](https://www.nature.com/articles/s41928-026-01681-6)”** in *Nature Electronics*. The paper examines the development of CPO for HPC and AI, identifies the key technical challenges, and outlines a trajectory for the next-generation optical interconnect technology.

*Interconnect technology: The physical and logical circuits and networking technologies that enable data and signal transmission within semiconductor chips, between chips or between systems.*

Seunghoon Hong, SK hynix AI Infra Team Lead, and Professor Kyusang Lee of the Department of Electrical and Computer Engineering at the University of Virginia (UVA) served as corresponding authors, leading a collaborative study with researchers from the University of Illinois Urbana-Champaign (UIUC), Nanyang Technological University (NTU), Massachusetts Institute of Technology (MIT), and Yonsei University.

*Corresponding author: Principal authors who oversee and take full responsibility for the entire research process, from study planning and journal submission to peer review response and post-publication inquiries.*

On a wider level, the paper presents a comprehensive technology roadmap for how memory, advanced packaging, and optical compute interconnects (OCIs) should co-evolve to support next-generation AI systems. Crucially, it also demonstrates how SK hynix is moving beyond HBM innovation to help define the architecture of next-generation AI infrastructure at the system level.

### From chips to systems: CPO is the key to scaling HBM innovation at the system level

Hyperscale AI models are no longer trained on a single chip or server. Instead, they run across massive networks organized into racks and pods. In these architectures, overall system performance depends not only on the connections between processors, memory, and AI accelerators, but also on how efficiently data moves between racks.

*Rack: A standardized frame used to mount and house hardware such as servers and AI accelerators. It is the fundamental physical building block of data center infrastructure.*
*Pod: A higher-level infrastructure unit that groups multiple racks together, enabling the integrated management of networking, power, and cooling.*

▲ Compute throughput has typically tripled every two years, while interconnect bandwidth has advanced only about 1.4-fold, creating a “bandwidth wall.”


![图01｜原文配图（SK hynix）](/assets/img/posts/cpo-in-nature-electronics/img01.jpg)
*图01｜原文配图（SK hynix）*


In practice, compute throughput has tripled every two years, while interconnect bandwidth has only advanced 1.4-fold over the same period, making the **bandwidth wall** an increasingly significant challenge. Conventional copper-based electrical interconnects, which carry data beyond the chip package and between racks, suffer from rapidly increasing signal loss and power consumption as transmission distances grow. As a result, they are increasingly viewed as a limiting factor for next-generation AI data centers.

“Even if computing chips become more powerful, overall system performance cannot improve unless data movement between chips keeps pace,” said Professor Kyusang Lee. “Replacing copper interconnects, which face inherent physical limitations, with optical links is the most promising path toward future scalability.”

▲ CPO integrates optical engines ever closer to the processor. As the distance traveled by electrical signals is minimized, both bandwidth and energy efficiency improve.


![图02｜原文配图（SK hynix）](/assets/img/posts/cpo-in-nature-electronics/img02.jpg)
*图02｜原文配图（SK hynix）*


With the bandwidth wall becoming an increasingly fundamental constraint on AI infrastructure, the paper positions CPO as central to overcoming this challenge. Seunghoon Hong, AI Infra Team Lead at SK hynix, describes the technology like this: “CPO integrates optical transceivers (TRx) into the same package as the processor, enabling chips to exchange data using light instead of long electrical interconnects. This fundamentally changes how data moves through AI systems, removing one of the biggest barriers to scaling compute.”

Conventional copper interconnects remain a cost-effective solution over short distances. As transmission speeds increase and communication distances grow, however, they require increasingly complex compensation circuitry, resulting in higher power consumption and greater data transmission latency. By integrating optical engines within the package, CPO minimizes the distance that high-speed electrical signals must travel and uses optical links for the remaining path. This extends high-speed communication across chips, racks, and pods while maintaining high bandwidth density, superior energy efficiency, and strong signal integrity with greater immunity to electromagnetic interference.

Based on this architecture, the researchers define clear technical targets for next-generation AI infrastructure, including more than 100 Tb/s of bandwidth per node, energy consumption below 1 pJ/bit, and chip-to-chip latency of less than 10 nanoseconds. The paper also presents a comprehensive technology roadmap outlining the evolution from 2D and 2.5D interposer-based configuration, as well as 3D heterogeneous stacking, together with the key technical challenges that must be addressed for commercial deployment.

### Extending optical interconnects to memory for optimized data movement

▲ Conceptual illustration of an optics-centric architecture in which a photonic interposer directly connects compute resources in the XPU pool with memory resources in the memory pool through optical links.


![图03｜原文配图（SK hynix）](/assets/img/posts/cpo-in-nature-electronics/img03.jpg)
*图03｜原文配图（SK hynix）*


In the long term, the evolution of CPO is expected to extend optical interconnects all the way to the memory interface. Moving beyond the physical constraints of conventional packaging, the proposed **optics-centric** architecture uses a photonic interposer to directly connect memory and processors, maximizing the efficiency of data movement across the system.

With this architecture, multiple AI accelerators can share a large memory pool, which enables more flexible system-level data movement while allowing AI infrastructure to scale more efficiently as models continue to grow.

“Optical interconnects are likely to become a foundational connectivity technology for future AI infrastructure,” said Professor Lee. “The technology has already moved beyond the laboratory and entered the early stages of commercialization. Significant challenges remain, from integrating low-power photonic devices to developing coherence protocols and improving system reliability. Ultimately, however, the key lies in co-designing memory devices and controllers, photonic components and packaging as a single integrated system. This is precisely where collaboration with SK hynix is especially meaningful.”

Hong added, “This collaboration is particularly significant because it brings together academic expertise and industry experience to present a shared vision for the future of AI infrastructure. We will continue to expand open collaboration that delivers tangible value to our customers and the broader AI ecosystem.”

### INTERVIEW

**Q1. Could you briefly introduce yourselves, including your primary research areas?**

**Professor Lee:** I am a professor in the Department of Electrical and Computer Engineering at the University of Virginia (UVA). My research focuses on heterogeneous integration technologies, particularly the integration of ultrathin photonic and electronic devices within a single package for next-generation computing systems. Building on this research, I led the review presented in this paper, which provides a comprehensive overview of optical interconnects and CPO technologies for AI and HPC.

**Hong:** I began my career as a semiconductor engineer and have since gained experience across multiple areas of the memory business, including strategy and human resources. I currently lead long-term strategy for the memory industry in the AI era. My focus is on viewing memory not as a standalone component, but as part of the broader system architecture that drives our customers’ AI competitiveness. Through collaboration with partners across the industry, I work to create new value from a system-level perspective.

**Q2. How do you feel about having your paper published in “Nature Electronics,” a prestigious scientific journal?**

**Professor Lee:** It is especially meaningful to have achieved this milestone together with SK hynix, one of the world’s leading semiconductor companies. Rather than presenting the advancement of a single device, this paper offers a roadmap for the future of AI infrastructure. It is deeply rewarding to see the work resonate with both academia and industry. I hope it helps bring broader attention to the importance of this technology, and I would like to express my sincere gratitude to all of the researchers from the collaborating institutions who made this work possible.

**Hong:** We are very encouraged to have achieved this milestone through collaboration with leading researchers from around the world. The paper demonstrates the value of combining academic expertise with industry experience to present a shared vision for the future of AI infrastructure. SK hynix will continue working to deliver meaningful value to our customers and the broader industry ecosystem.

**Q3. How did the collaboration between academia and industry strengthen this research?**

**Professor Lee:** We gained a shared understanding of what it takes to transform a technology from something that is technically feasible into something that is commercially deployable. Academia excels at pushing the boundaries of performance, while industry understands the practical requirements for deploying technology at scale, including manufacturing yield, cost, cooling, and supply chain considerations. Bringing these perspectives together enabled us to develop a practical roadmap for the future of AI infrastructure.

**Hong:** When academia’s pursuit of next-generation technologies is combined with industry’s real-world experience, it enhances not only technical excellence but also the potential for commercialization. This collaboration reinforced our shared belief that industry-academia partnerships are a critical foundation for enabling customer success and driving innovation across the AI ecosystem.

**Q4. The paper argues that optical connectivity should eventually extend to the memory interface. What advantages would this bring?**

**Professor Lee:** Extending optical interconnects to the memory interface would overcome the physical constraints surrounding compute chips, removing limitations on both memory capacity and the number of electrical connections. It would also allow multiple AI accelerators to share a large memory pool, which would make AI infrastructure far more adaptable as AI models continue to grow in scale.

**Hong:** The greatest advantage is that it enables AI systems to scale more flexibly by improving data movement efficiency. Ultimately, this provides customers with a stronger foundation for operating AI infrastructure more efficiently.

**Q5. What will make CPO a key technology for future AI infrastructure, and where is your research headed next?**

**Professor Lee:** CPO has the potential to become a foundational standard for future AI infrastructure because it offers four key advantages: high bandwidth density, excellent energy-distance efficiency, scalable parallel connectivity, and robust signal integrity with strong immunity to electromagnetic interference. We will continue working with industry partners to demonstrate pathways toward even greater energy efficiency through technologies such as ultrathin photonic material integration and massively parallel optical interconnects based on microLED (µLED) technology.

**Hong:** As customers continue to build larger AI systems, the importance of optical interconnects will only increase. Memory companies are evolving beyond the role of supplying individual components to becoming partners that help strengthen the competitiveness of customers’ entire systems through technologies such as CPO. Going forward, we will continue to expand open collaboration with customers and ecosystem partners to accelerate innovation across the AI infrastructure landscape.

# 第二部分：解析（深度解读）

> 以下为基于原文的结构化中文解读，仅供学习交流，不代表原作者观点。

## 一、这篇文章在讲什么

SK hynix 联合 UVA、UIUC、NTU、MIT、延世大学等机构，在《Nature Electronics》发表了一篇 CPO（共封装光学）路线图综述。文章的核心判断是：AI 竞争的战场正在从「单芯片」转向「系统」——当几千颗 GPU 通过机架（rack）、舱（pod）组网时，系统瓶颈不再是单颗芯片算力，而是芯片之间、机架之间的数据搬运效率。论文把 HBM、先进封装、光计算互连（OCI）放在同一张路线图里，给出下一代 AI 基础设施的技术靶标（单节点 >100 Tb/s 带宽、<1 pJ/bit、片间延迟 <10 ns），并指出 SK hynix 正从「卖内存颗粒」走向「定义系统级 AI 基础设施」。

## 二、关键概念拆解

- **带宽墙（Bandwidth Wall）**：算力每两年翻约 3 倍，互连带宽只涨约 1.4 倍，剪刀差持续扩大；铜互连随距离信号损耗与功耗激增，成为下一代数据中心的硬约束。
- **CPO（共封装光学）**：把光收发器（TRx）与处理器封在同一封装内，用电信号只走极短距离、剩余路径走光，从而在高带宽密度的同时拿到优能效与强抗干扰。
- **从芯片到系统（Chips → Systems）**：rack/pod 成为物理基本单元，系统性能取决于处理器/内存/加速器之间的「数据如何高效移动」。
- **光中心架构（Optics-centric architecture）**：长期路径是把光互连一直延伸到内存接口，用光子中介层（photonic interposer）直接连接 XPU 池与内存池，让多颗加速器共享大内存池。
- **四大优势**：高带宽密度、优能耗-距离效率、可扩展并行连接、强信号完整性/抗 EMI。

## 三、与本站其他文章的衔接

- **CPO / 光互联系列**：本文是 SK hynix 官方对 CPO 路线图的「系统级」表态，与本站已发的 CPO 系列（why-cpo、带宽墙、光连接是否是 AI 下一瓶颈、PhotonCap 等）直接呼应；文中「>100 Tb/s、<1 pJ/bit、<10 ns」是量化的技术靶标，可作为系列文章的统一参照系。
- **先进封装系列**：光子中介层、2D/2.5D interposer、3D 异质堆叠正是 CoWoS/EMIB 一类方案的延伸。
- **SerDes / 信号完整性**：光互连要替代的正是「封装外、机架间」那段最吃力、最耗能的电 SerDes 链路。

## 四、趋势与投资映射

- 投资主线从「哪颗 GPU/哪颗交换芯片赢」上移到「系统级带宽墙的解决方案」：CPO、硅光、先进封装、低功耗光子器件、coherence 协议与系统可靠性。
- SK hynix 的叙事转变值得跟踪：存储厂不再只卖 HBM 颗粒，而是以「光互连 + 内存池化」切入系统定义权。这对 HBM 竞争格局（SK hynix / 三星 / 美光）与 CPO 供应链（光引擎、硅光代工、封装）都有重估含义。
- 风险：CPO 商用仍需跨过光子器件功耗、coherence 协议、可靠性三道坎；任何「纯 CPO 股」判断都应回到「系统级协同设计」视角。
