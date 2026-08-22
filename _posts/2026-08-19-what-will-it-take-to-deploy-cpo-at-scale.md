---
layout: post
title: "What Will It Take To Deploy CPO At Scale? — CPO 规模部署的最后一公里：制造、测试与运营"
date: 2026-08-19 20:00:00 +0800
categories: [光互联]
tags: [CPO, 共封装光学, 硅光, 光互联, AI基础设施, 规模部署, 先进封装]
description: "SemiEngineering 对 CPO 从 PoC 走向可量产拐点的讨论——基于 Alchip / Astera Labs / Ayar Labs 三位先驱的对谈，拆解 scale-out→scale-up→extended memory 三阶段路线图，以及标准化、制造、可靠性、光互连独特失效模式等规模化门槛。"

---

> 原文来源：SemiEngineering｜作者 James Nguyen｜原文发布于 2026-08-13
> 本文为「英文原文 + 中文深度解读」两层结构，配图取自原文（Ayar Labs 提供）。
> 原文无付费墙，全文已取得。

# 第一部分：正文（Original Article）

## What Will It Take To Deploy CPO At Scale?

The path to widespread deployment of co-packaged optics depends on solving challenges in manufacturing, testing, and operations.

Co-packaged optics (CPO) is at an inflection point. We see it rapidly transitioning from proof-of-concept prototypes to manufacturable systems. Today, we're already starting to see the technology embedded in scale-out switch ASIC packages, where copper can no longer handle the bandwidth-distance requirements.

While the technology shows promise for AI infrastructure by offering multi-generational scaling potential through wavelength multiplication, higher modulation rates, and increased port density, the path to widespread deployment depends on solving challenges in manufacturing, testing, and operations.

A recent conversation among CPO pioneers from Alchip, Astera Labs, and Ayar Labs focused on a range of real-world implementation questions. How do we build reliable supply chains? What standards will emerge? How do we ensure these systems can be manufactured, tested, and operated at scale?

The experts agree that while the technology enables impressive performance, success depends on commercializing every aspect of the ecosystem, from foundry processes to rack-scale operations. Their discussion reveals how the industry is navigating these challenges.

## How will CPO evolve over the next few years?

The conversation begins with scale-out networks, where separate compute clusters are interconnected within a data center. Scale-out typically uses standard networking technologies like InfiniBand or Ethernet. Scale-out networks are well-suited for serving data center-wide communications, providing connectivity between distinct compute clusters. CPO deployment is already underway for scale-out networks, but more needs to be done to make it to the next step.

The next step is scale-up networks, an architecture used within an AI compute cluster that maximizes intra-cluster communication bandwidth and minimizes latency. Scale-up networks envision thousands of XPUs working together as one, which introduces a new set of technical challenges. The experts describe what they see as a realistic timeline for this transition from switches to compute engines.

Adit Narasimha, VP/GM of emerging technologies at Astera Labs, says, "Scale-out had the advantage that it demands optics because of the bandwidth and distance involved. There's just no doubt that you need optics so that, in confluence with customers able to provide very high volumes, it has resulted in very good cost performance and availability. That is a mature commoditized space."

Narasimha emphasizes the complexity: "In scale-up, we're talking about many, many, many lanes, which means customized PHYs, new modulator technologies, new coupling technologies, and new tightly co-packaged technologies…There's a huge interaction of that packaging and test flow with its eventual integration into the switch or CPU, as well as its eventual integration into the rack."

![Fig.1 面向 AI 计算架构的硅光三阶段路线图：scale-out → scale-up → extended memory。这一演进为分析师预期的 2028 年 CPO 广泛采用设定了经济与性能里程碑。](/assets/img/posts/what-will-it-take-to-deploy-cpo-at-scale/fig1.webp)

## Why do we need CPO on CPUs and XPUs?

Discussion around incorporating CPO into compute engines revolves around the need for a shift in technology to support AI systems. The experts agree that continuing to evolve existing technologies will not be sufficient, and the time is right for a major change.

Here is how Vladimir Stojanovic, CTO and co-founder of Ayar Labs, puts it: "You need technology that has multi-generational potential. That was copper for the last 25 years, but we need a technology for AI systems that has that potential now. And the answer is CPO."

Stojanovic elaborates on CPO's scaling potential: "If you look at the technology, how much can we scale the number of wavelengths, modulation rate, number of ports per chiplet, meaning the connector density, polarization states, etc.? You have a lot of generations you can do once you're coupling a technology that has a density potential, like microrings with advanced transistors."

Erez Shaizaf, CTO at Alchip, adds: "Instead of doing evolution, we are trying something new. We are trying to bring optics, which is a much better channel natively, to the scale-up network. This is the time for CPO."

Stojanovic summarizes: "It needs to be in a form factor that has at least two decades' worth of potential. Otherwise, that investment will never get recovered."

![Fig.2 与 Alchip Technologies 合作的 CPO 方案：八颗 Ayar Labs TeraPHY 光引擎 + 两颗 AI 加速器。](/assets/img/posts/what-will-it-take-to-deploy-cpo-at-scale/fig2.webp)

## Will standards emerge for CPO, or will each vendor create their own?

The panelists discussed a range of questions, including: Can we have different optical engines from different suppliers? And different optical engines created by the compute engine makers and the switch makers? Can we make this all work together? Or is it going to be a little crazy for a while? The experts agree that some level of standardization will emerge, but that major customers may not follow them (and could drag parts of the industry along with them). Ayar Labs believes that an ecosystem approach is better for all parties involved, as explained in this blog post: Building the Future of AI Infrastructure: The Power of a Robust ASIC Ecosystem. Stojanovic believes that testing and the supply chain will be more important than meeting more detailed technical specifications.

"As long as everything else in the form factor and in the supply chain is shared, it's going to be less of an issue if you can leverage the downstream assembly test and supply chain. These big deployments will look for uniformity. Aside from a few big companies, nobody has the pull to set up hundreds or thousands of testers and the connector assembly machines necessary."

Looking at the practical implementation, Stojanovic predicts: "I think the foundry ecosystem will provide a type of certified OSAT ecosystem that will be preferred. Being in that ecosystem, following that process, and having a solution with the right form factor to follow that process is going to be key. I think deviations will be allowed, but you have to follow that process with that form factor. Otherwise, too much investment would be required to stand that up as a separate solution and integrate it into the compute package."

## What needs to happen for extended memory to become more widely adopted?

Extended memory is an approach in system architecture that decouples memory resources from individual compute units. This technique allows for more flexible and efficient resource utilization and addresses the limitations of traditional memory architectures for data-intensive AI workloads. The experts agree that this is farther in the future than scale-up architectures and first requires the widespread use of optics. The progress is clear: switches first (already happening), then compute engines (next 2-3 years), then extended (optically attached) memory systems.

Stojanovic explains it like this: "I view extended memory as an additional optimization you put on top, because doing extended memory without optical scale-up is not going to get you where you need to be in terms of performance. It's step two, but it's very important because it decouples the capacity-versus-bandwidth trade-off that is a problem in high-bandwidth memory. It allows you to do that very effectively, but it must be on top of a technology that natively has very low latency."

Shaizaf agrees that the inflection point will be "once the scale-up network is fully deployed over optics and the memory stalls. People will already have trust in CPO and the optical network. Then they will start to innovate around memory solutions as well."

## What about manufacturability, affordability, reliability, and serviceability?

According to Shaizaf, all are equally important. "We cannot address one over the other. Hyperscalers are running huge fleets of AI servers and racks. New racks will only be joined to these fleets when all of these aspects are ready. If one of them is not ready, the new system cannot join the fleet because the hyperscalers are not talking about innovation. At the end of the day, they have a business to run. We will see CPO adoption when all of these aspects are mature."

## What are the unique failure modes for optical interconnects, and how do systems detect and respond to them?

All the experts agree that this is an important area to solve.

Narasimha points out, "There is a tremendous amount of scale-out data for optical failure modes now, both in terms of startup and reliability. That has to be properly projected forward, while accounting for the fact that we are going to have lots of fibers in a rack and lots of connections."

Stojanovic is more pointed, saying, "We're talking about telemetry down to every link, every lane, every laser diode that's in the module. You have software configurability and telemetry feeding the firmware and system software to expose these things. The software can be configured flexibly to inspect, detect, diagnose, and take appropriate actions. We're building these as software-configurable entities that you can manage, and that's the only way to be flexible for different rack infrastructures and different deployments."

## Looking ahead: A multi-decade platform shift

This conversation reinforces that CPO represents not just an incremental improvement, but a platform technology with at least two decades of scaling potential. Success requires thinking beyond individual components to entire ecosystems, from foundry partnerships and testing infrastructure to operational software. To learn more, watch the full on-demand webinar, Next-Gen AI Architecture Through Co-Packaged Optics.

---

# 第二部分：解析（深度解读）

## 一、核心论点：CPO 的拐点已到，但「规模部署」卡在生态商业化，不在技术

这篇文章是 SemiEngineering 对 **Alchip（Erez Shaizaf）、Astera Labs（Adit Narasimha）、Ayar Labs（Vladimir Stojanovic）** 三位 CPO 先驱的对谈整理。它的核心判断很克制也很关键：**CPO 已经从 PoC 原型快速过渡到「可制造系统」，今天已经在 scale-out 交换机 ASIC 封装里落地；但「广泛部署」的真正门槛不是性能，而是制造、测试、运营整个生态的商业化（commercializing every aspect of the ecosystem）**。

换句话说：技术 demo 早已不是问题，**foundry 工艺 → OSAT 组装测试 → 机架级运营软件**这条全链路，任何一环没成熟，hyperscaler 就不会把新机架接进它那支「庞大舰队（fleet）」。

## 二、最该记住的框架：硅光三阶段路线图

文章给出一张清晰的演进图（Fig.1），也是理解全文的钥匙：

1. **Scale-out（横向扩展网络）**：数据中心内不同计算集群之间的互联，用 InfiniBand / Ethernet。因带宽与距离诉求，**必须用光**——已是成熟、商品化、量大的空间。CPO 部署已在进行。
2. **Scale-up（纵向扩展网络）**：AI 集群**内部**、把数千颗 XPU 当「一个」来用的架构，追求最大 intracluster 带宽、最低延迟。技术挑战陡增（海量 lane、定制 PHY、新调制器、新耦合、紧耦合共封装），时间线约 **未来 2–3 年**从交换机走向计算引擎。
3. **Extended memory（扩展内存）**：把内存资源从单个计算单元解耦的光附加内存系统——**更远**，且前提是 optical scale-up 先普及。Stojanovic 把它定位为「叠在 optical scale-up 之上的第二步优化」，用来解开 HBM 的「容量 vs 带宽」权衡。

分析师预期 **2028 年** CPO 广泛采用，正是建立在这条「交换机先、计算引擎次之、扩展内存最后」的递进之上。

## 三、关键引述与判断

- **Stojanovic（Ayar）的「二十年潜力」论**：CPO 必须是一个「至少具备二十年缩放潜力」的 form factor，否则巨额投资无法回收。他列举缩放维度——波长数、调制率、每 chiplet 端口数（连接器密度）、偏振态——一旦耦合上 microring + 先进晶体管这类有密度潜力的技术，就能吃下很多代。
- **Shaizaf（Alchip）的「四个ability 同等重要」**：manufacturability / affordability / reliability / serviceability 缺一不可。**hyperscaler 跑的是生意不是创新秀**——只要有一项没就绪，新系统就进不了 fleet。这是来自「买方视角」最实在的冷水。
- **Narasimha（Astera）点出 scale-up 的复杂度**：海量 lane 意味着定制 PHY、新调制/耦合/紧耦合共封装技术，且「封装与测试流程」会与其最终集成进 switch/CPU、再进机架产生巨大交互——这恰好和本站同日《AI Chiplet 架构重定义测试插入点》形成互文：CPO 光引擎必须作为 known-good optical engine 先验证。

## 四、标准化：会出现，但大客户可能不跟

三位共识是**会有某种程度的标准化，但大客户（hyperscaler）未必遵从，反而可能拖着产业走**。Stojanovic 的务实判断更值得玩味：**测试与供应链比更细的技术规范更重要**——只要 form factor 与供应链共享，就能借力下游组装测试与供应链；少数大公司才有能力自建成百上千台 tester 与连接器装配机。他预测 **foundry 会提供「certified OSAT 生态」并成首选**，偏离该流程的定制方案需额外巨大投资，难以独立立住。

这对投资的含义很直接：**OSAT / 测试设备 / 光引擎供应链的「认证生态位」比单点技术规格更有护城河**。

## 五、光互连的独特失效模式：链路级 telemetry 是唯一解法

这是文章里技术味最浓的一段。光互连的失效与电互连不同——启动期与可靠性的失效数据虽已在 scale-out 积累，但机架内光纤与连接数会暴增。Stojanovic 的回答是：**telemetry 要下探到每 link、每 lane、每颗激光二极管**，用软件可配置性把遥测喂给固件与系统软件，灵活 inspect / detect / diagnose / 采取行动。CPO 模块必须被建成「软件可管理的实体」，才能适配不同机架基础设施与不同部署。

这也呼应了本站长期主题：CPO 不是把光「塞进封装」就完事，**可观测性（observability）+ 运营软件**才是规模化放行的门票。

## 六、与本站其他文章的衔接与风险提示

- **互补**：与同日 chiplet 测试篇共同拼出 CPO 规模化的「测试底座」；与本站 CPO 系列（如 why-cpo-is-becoming-inevitable、photoncap 台湾 GTC/Computex 2026 CPO、the-photonics-era-is-coming 等）构成「技术拐点 → 测试/制造门槛 → 投资映射」的闭环。
- **时间线风险**：scale-up 才是真难点（2–3 年），extended memory 更远；2028 广泛采用是「预期」非「承诺」。
- **生态风险**：标准化可能被 hyperscaler 架空；certified OSAT 生态若被少数 foundry 把持，二三线光引擎厂会被挤压。
- **可靠性风险**：光链路失效模式的链路级 telemetry 若做不扎实，规模部署的运维成本会反噬 TCO。

> 一句话总结：CPO 的技术拐点已过，**真正的「最后一公里」是制造—测试—运营的生态商业化**；谁先卡住 certified OSAT 与链路级可观测性，谁就拿到scale-up 时代的门票。
