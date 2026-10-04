---
layout: post
title: "光子学迫使 Chiplet 重新设计：光进封装为何是多物理场协同设计问题 —— Semiconductor Engineering 精读"
date: 2026-10-04 18:00:00 +0800
categories: [光互联, 先进封装]
tags: [CPO, NPO, 硅光, PIC, EIC, 混合键合, 热管理, 微环调制器, UCIe, 协同设计, 形式化验证]
description: "光器件离计算硅越近，带宽与能耗越好，热漂移与验证缺口也越大。这篇综述汇集八家厂商的陈述，把「热是功能正确性问题」和「电侧可验证、光侧不可验证」两条判断讲透。"
toc: true
---
> **来源**：Semiconductor Engineering（semiengineering.com），栏目 Systems & Design，作者 Ann Mutschler，2026 年 8 月 31 日。
> **原文**：Photonics Forces A Chiplet Rethink — <https://semiengineering.com/photonics-forces-a-chiplet-rethink/>
> **体例**：编辑综述，汇集 Cadence、Axiomise、Siemens EDA、Arteris、ChipAgents、Synopsys、Baya Systems、Keysight EDA 共八方的陈述。原文正文无配图。
> **转载说明**：第一部分为英文原文完整转载，版权归 Semiconductor Engineering 所有；本站仅调整排版与标题层级（原文以小标题粗体行分节，本站转为二级标题），不改动任何文字表述。原文中有一段被重复刊出，本站按原样保留、并在解读部分标注。第二部分为本站独立撰写的中文结构化解读，其中的质疑与推算属解读者观点，不构成投资建议。

# 第一部分：英文原文（Original Article）

## Key Takeaways

- Photonics changes chiplet design from a placement problem into a multi-physics co-design problem because thermal, mechanical, electromagnetic, and optical effects interact bidirectionally.

- The closer optical chiplets move to compute silicon, the more bandwidth and power improve — but the harder it becomes to manage heat, stress, alignment, and reliability.

- Chip architects should start with traffic patterns, system architecture, and verifiable interface contracts before deciding where optics belongs.

---

Optical chiplets promise a way out of the bandwidth, power, and reach limits of copper interconnects, but bringing photonics into advanced packages is proving more difficult than just swapping one signaling medium for another.

As optical devices move closer to silicon, they become part of a tightly coupled physical system where heat, stress, electromagnetic effects, alignment, and verification all interact. As a result, photonics becomes less of a component-level choice than a system-level architecture problem that includes the die, package, interconnect, and system stack.

Currently, semiconductor companies are moving photonic integrated circuits (PICs) into the same package as high-performance processors, switches, and memory dies to replace traditional copper interconnects in co-packaged optics (CPO) approaches. At the same time, commercial design-ins are picking up, with hyperscalers and major hardware developers adopting optical chiplet architectures into initial production and deployment phases for AI data centers. Dozens of specialized patents and active prototypes confirm that optical engines are shifting from research concepts to product readiness.

To speed adoption, TSMC introduced Compact Universal Photonic Engine (COUPE), an open infrastructure for mass-producing optical chiplets. Instead of placing the electronic integrated circuit (EIC) and the PIC side-by-side on a substrate, TSMC stacks them vertically. The electronic control chip is stacked directly on top of the optical chiplet, connected using hybrid bonding that replaces traditional solder balls with copper-to-copper connections. TSMC says stacking the chips vertically reduces the distance signals must travel, shrinks electrical parasitic resistance to near zero, cuts data transmission power consumption by up to 85%, and optimizes server space for high-density AI clusters.

The challenge is no longer whether photonics belongs in chiplet systems, but where it belongs, how close it should sit to logic, and how much of the package must be co-designed around it. The closer optics is to the processing elements, the lower the latency and the amount of energy required to move signals. But it also exposes the optical signals to thermal drift, mechanical stress, electromagnetic coupling, and verification gaps that cannot be solved one chiplet at a time.

“The chip architect cannot think of it as an independent chiplet,” noted Gilles Lamant, distinguished engineer and Virtuoso platform architect at [Cadence](https://semiengineering.com/entities/cadence-design-systems/). “And that’s even worse now that everybody is going with hybrid bonding. With hybrid bonding, you decrease the separation between the electrical chip and the photonic chip. There’s nothing in between. So the photonic chiplet is both an aggressor and a victim in that new system, and there are plenty of thermal considerations. The interposer acts as an insulator. Mechanically, solder balls had to go on these things. All of this is gone, so now you cannot really look at those two chips in isolation from a thermal perspective. That interaction is bidirectional, which many people overlook. The photonic chip generates significant heat, and heat creates problems for electronics, including faster aging. In that sense, the photonic chip can act as an aggressor toward the electronic chip. Stress also develops at the boundary between the two. Photonic devices are typically very sensitive to temperature, and designers often use thermal tuning to adjust waveguide properties. But that also means any temperature variation on the photonic side can become a problem. It’s literally bidirectional, which is why you need to design those two together.”

In addition to TSMC, Intel Foundry, GlobalFoundries, STMicroelectronics, and Tower Semiconductor are manufacturing photonics chips today. In Europe, Lamant noted that ST is pursuing a hybrid bond strategy, with an EIC on top of a PIC.

“The hardest issues are the ones at the system level,” Lamant noted. “It’s not magic. It’s just that the amount of data is significant and processing that data is hard.”

Photonics chiplets already are shipping alongside traditional silicon chiplets. “[These are being implemented as] a heterogeneous assembly — a compute die, an EIC for SerDes, drivers and control, and a PIC for modulation and detection, co-packaged with standard interconnect,” observed Ashish Darbari, CEO of [Axiomise](https://semiengineering.com/entities/axiomise/). “Ayar Labs’ TeraPHY offers a UCIe-compliant electrical interface and 8 Tbps of bidirectional optical bandwidth. The Alchip and Ayar Labs demonstration on TSMC’s COUPE platform delivers up to 100 Tb/s per accelerator behind a standard UCIe interface, and the UCIe Consortium, over 120 members strong, treats optical interconnect as a core vertical.”

As a result, this has become a chiplet specification explosion problem with a twist for verification purposes. “One die boundary is now a physical-domain conversion,” Darbari explained. “The digital side is tractable. We formally verify chiplet protocols, and a UCIe adapter is exactly where formal methods exhaustively prove the absence of deadlock and protocol violations. The optical side behind it has no comparable discipline yet. That asymmetry, a formally verified electrical contract wrapped around an informally specified optical subsystem, should worry system architects.”

So how exactly do photonics chips fit into chiplets alongside traditional silicon chips? John Ferguson, product management director for Calibre nmDRC applications at [Siemens EDA](https://semiengineering.com/entities/mentor-a-siemens-business/), explained that, in general, a photonic chip can be placed in the same way as any other chip within a 3D-IC assembly. “However, there does need to be careful consideration about how to convert optical signals to electrical, and vice versa, and there may be more careful planning for placement of the photonic chip to avoid signal distortion due to thermal and mechanical stresses.”

According to Guillaume Boillet, vice president of strategic marketing at [Arteris](https://semiengineering.com/entities/arterisip/), a photonic chiplet is best understood as another die in the package that happens to communicate with light instead of electrons, and in practice that link stays largely transparent to the network-on-chip as long as the die-to-die controllers on the other side speak protocols the fabric already supports. “The interesting shift for chiplet architects comes when optical is used to span longer distances than electrical signaling allows, extending the practical reach of a system and pushing multi-die designs toward larger, more distributed topologies. Further out, on-chip optical interconnect is an emerging technology worth watching, since it will require industry-wide NoC architectures to interface with it natively without degrading the latency the rest of the system depends on.”

Further, in a 2.5D architecture, the compute, memory, electronic-interface, and photonic chiplets are placed side by side on a silicon interposer, organic substrate, or advanced redistribution layer. “This is the more mature, lower-risk approach as it reuses standard interposer/RDL processes, and it also allows the photonic chiplet to be reused with different compute dies,” noted photonics physicist and researcher John Bowers, a board member and advisor to [ChipAgents](https://semiengineering.com/entities/alpha-design-ai-chipagents/). “But the EIC-to-PIC electrical trace length adds parasitic capacitance and inductance that caps how fast you can drive the modulators. In a 3D implementation, the electronic interface die can be bonded directly above or below the photonic die using micro bumps, copper-to-copper hybrid bonding, or another fine-pitch interconnect technology. This shortens the electrical link between driver circuits and modulators/photodetectors to microns instead of millimeters, which is what lets designs push to higher baud rates with lower drive voltage and power per bit. This is the direction most co-packaged-optics roadmaps (Intel, TSMC COUPE, Ayar Labs, Broadcom) are heading.”

Further, in a 2.5D architecture, the compute, memory, electronic-interface, and photonic chiplets are placed side by side on a silicon interposer, organic substrate, or advanced redistribution layer. “This is the more mature, lower-risk approach as it reuses standard interposer/RDL processes, and it also allows the photonic chiplet to be reused with different compute dies,” noted Bowers. “But the EIC-to-PIC electrical trace length adds parasitic capacitance and inductance that caps how fast you can drive the modulators. In a 3D implementation, the electronic interface die can be bonded directly above or below the photonic die using micro bumps, copper-to-copper hybrid bonding, or another fine-pitch interconnect technology. This shortens the electrical link between driver circuits and modulators/photodetectors to microns instead of millimeters, which is what lets designs push to higher baud rates with lower drive voltage and power per bit. This is the direction most co-packaged-optics roadmaps (Intel, TSMC COUPE, Ayar Labs, Broadcom) are heading.”

This is evolving from the first generation of photonics, where the optics came in a pluggable module.

“That is where electro-optical conversion happened,” said Priyank Shukla, senior director of product management at [Synopsys](https://semiengineering.com/entities/synopsys-inc/). “From the side view, you’d have a host chip, or it could be a switch, and there is an electrical signal through a PCB going through a pluggable module. This is what we see in deployment. However, you can implement pluggability another way without re-timing the electrical IC, since the electrical signal drives the optics directly. It’s still pluggable, but the optical drive is linear. That’s one way to save power because you don’t have additional timing delay. So from a form-factor point of view, these are still pluggable. Electrical and optical chips live far apart.”

What is happening now are two stages of integration for near-packaged optics and co-packaged optics. “In near-packaged optics, an optical component comes in and is soldered on a board so your electrical domain will go through a board and drive the optics here,” Shukla explained. “Now the laser of that optical chain could still be in a pluggable module, the modulator could be near, and the driver could be in the near-packaged optics. This is the second stage of integration we are seeing. We also see some deployment clusters that value near-packaged optics. In terms of pros and cons, it’s more serviceable, but it also has design challenges, such as thermal drift. One group of engineers is interested in this deployment, and another group is considering co-packaged optics, where the laser will still be in the external small-form-factor pluggable, but other components can be co-integrated here. Then, when you co-package the optics, there are different streams. How do you integrate electrical and optical together? Do you place it on top of the edge, and do you have one versus another?”

Another consideration here is that the photonic die becomes another chiplet in the package, but a distinctive one, according to Kent Orthner, vice president of products at [Baya Systems](https://semiengineering.com/entities/baya-systems/). “Where compute and memory dies process data, an optical chiplet is mostly an I/O element whose job is getting enormous bandwidth on and off the package. It attaches through standard die-to-die interfaces and PHYs like UCIe and BoW, and to the on-die network it looks like a very high-bandwidth endpoint that needs to be fed. As the industry starts to integrate optics into compute silicon, this story largely stays the same: optical devices look like bandwidth-hungry endpoints in the system, and keeping them fed becomes the challenge.”

Ultimately, that heterogeneity should be invisible. “Whether an endpoint is a compute die, a memory die, or an optical I/O tile, the fabric must deliver data to it as a first-class citizen. A modular, tile-able fabric lets architects place those optical on ramps wherever the system needs them, instead of forcing the whole design around them,” Orthner said.

## Thermal challenges

Thermal issues with photonics chips make chiplet design more challenging. “The device-level thermal behavior, especially in silicon photonic components like ring modulators, whose resonance drifts with temperature and needs active tuning, is the domain of photonics and packaging teams, more than the design team, and what this creates for the design side is a system tension since optical-control silicon, such as the modulation circuitry, wants to sit somewhere cool and thermally stable, while the hottest thing in the package is usually the compute logic right next to it,” Orthner said. “Thermal turns interconnect placement into a co-optimization problem — high-activity switching generates heat, and you don’t want that concentrated next to thermally-sensitive silicon. A software-defined fabric helps because you can model where the fabric’s hotspots land and explore placement tradeoffs early, before you’ve committed silicon, rather than discovering a thermal conflict at the floorplan stage. We don’t tune the optics, but we can make thermal a first-class variable in the architecture exploration.”

Given these challenges, does that mean optical chips might not be appropriate to include in a chiplet system? Not necessarily. “Even in an electronic circuit, thermal effects will often be the limiting factor of the system. This is why we see new packaging technologies such as glass substrates,” said Niels Faché, senior vice president at [Keysight EDA](https://semiengineering.com/entities/keysight-technologies/). “If you can’t exceed 85 degrees Celsius, you may only be able to generate a few watts in your power amplifiers unless you remove heat. You can’t rely on natural convection alone. If you use fluids to remove heat, you can move that limit up by an order of magnitude and effectively remove thermal effects as the system’s limiting factor. In electro-optical systems, it’s the same. Thermal management is critical because you’re going to such high data rates and such dense integration that thermal effects become the limiting factor. You don’t just have to model it. You also must develop packaging technologies that remove heat in a way that lets you handle the power levels required in those systems.”

ChipAgents’ Bowers explained that thermal issues with photonics chips make chiplet design more challenging for several reasons. “Silicon’s refractive index varies with temperature. As a result, temperature changes can alter optical phase and shift the center wavelength of resonant devices. A photonic circuit can remain electrically connected and fully operational yet lose optical performance because its resonances are no longer aligned with the laser wavelengths.”

In a vertical stack, where an EIC is bonded directly onto the PIC, the driver/SerDes circuits dissipating watts of heat are microns away from ring resonators that must stay within a fraction of a degree of their operating point. “That’s the opposite of what you want thermally, even though it’s exactly what you want electrically (short link, low parasitics),” Bowers said.

Lasers add another layer of thermal complexity. “Their efficiency, output power, wavelength, and lifetime depend on temperature. Placing lasers next to a high-power processor can increase cooling requirements and create feedback between laser wavelength and photonic-filter alignment. Temperature changes also cause the package materials to expand at different rates. Silicon, organic substrates, glass, underfill, copper, adhesives, optical fibers, and III–V materials have different coefficients of thermal expansion,” Bowers noted. “Liquid cooling may produce steep gradients or place cooling hardware near sensitive optical interfaces. The cooling solution must avoid applying excessive mechanical load to the photonic die or fiber assembly while still removing heat from the processor and laser sources. Fiber coupling and optical connector coupling depend on alignment with the photonic waveguide, and are typically temperature-dependent. But the coupling must be high across all operating states. The thermal design must therefore include the complete system — die stack, interposer, substrate, lid, thermal-interface material, cold plate, optical connector, fiber routing, and airflow or liquid-cooling environment.”

Heat can have a bigger impact on an optical signal than on a traditional electric signal, Siemens’ Ferguson said. “This is not necessarily a bad thing, as it means heat can also be used to help in generating the desired signal behavior. Heaters are often inserted into the photonic chips, along with sensors. The sensors detect whether temperature may cause unwanted signal distortions and, if so, provide feedback to the heaters to adjust accordingly.”

Axiomise’s Darbari agreed. “In an electronic stack, heat is a performance and reliability problem. In a photonic chiplet, heat is a functional-correctness problem: silicon micro-rings shift roughly 70 to 80 pm/°C, and a recent Advanced Photonics Nexus review notes that modest temperature variation across a WDM array causes enough drift and crosstalk that active thermal control is standard practice. The worst heat source is usually the neighboring compute ASIC, not the photonic die, so CPO architectures need thermal isolation, active stabilization, and sometimes package-level micro-coolers.”

Three considerations follow — thermal, electromagnetic, and mechanical domains must be co-simulated because the loop is bidirectional. “Chiplet placement becomes a functional specification parameter, and cooling choice moves up to architecture definition,” Darbari said. “For verification, we can view correctness as an assume-guarantee contract. The package guarantees a temperature envelope. The tuning loop guarantees lock within it. That compensation logic in the EIC is digital, safety-critical, and provable with formal tools today, and it should be, because a corner-case bug in a tuning servo looks identical in the field to a physics failure.”

Those same thermal and verification constraints shape the next architectural question, where optical devices should physically sit relative to electrical compute, memory, and control logic.

## Optical chips within systems

Data rates are driving the need for photonics. The industry is moving to terahertz frequencies; electrical connections can’t be relied on, forcing that transition. “This is why photonics in data centers and AI infrastructure is a critical enabling technology as we deal with those high data rates,” Keysight’s Faché noted. “We’ll do a lot of the signal processing with electrical signals in electrical integrated circuits, but as we start to look at communication between one system and another system, there is a transition from electric to optical, and the transmission is an optical signal. It has lower power consumption, less heat, and, of course, you can manage very high data rates as well, along with the overall bandwidth you need, so it’s an enabling technology. That’s why it gets so much emphasis from all the hyperscalers and that whole ecosystem.”

However, because optical waveguides don’t benefit from shrinkage, optical chips tend to be large. So, in many cases, designers will keep this low in the stack. “In addition to the heaters and sensors, logic devices can often be inserted without significant impact on the optical behaviors due to the distances involved,” said Siemens’ Ferguson. “These can convert signals, or even serve as interposers to pass signals from the substrate to upper-level chiplets. Careful consideration is needed for upper-level chiplet placement, as mechanical stresses can also significantly affect optical behavior.”

In the near-term, optical lives at the edge of the package. “Co-packaged optics displacing pluggable modules for scale-up and scale-out links — while electrical handles compute and short-reach,” Orthner said. “Over time that boundary moves inward: optical creeps closer to compute, and links that used to be electrical become optical. The endgame is disaggregation, with optical making a rack, or several, behave like one very large system with pooled memory and larger coherent or semi-coherent domains. The constant across all of that is the fabric: a hop might be electrical on-die, electrical die-to-die, or optical off-package, but the system still must present one coherent view. Optical doesn’t replace the fabric; it extends its reach, and the fabrics that win will be the ones designed from the start to scale seamlessly from a single die out across many — because that’s exactly the transition optics forces.”

Jensen Huang said it well at Computex 2026: “You use optics wherever you must. You use copper wherever you can.” The pattern is proximity-driven coexistence, not replacement.

“NVIDIA’s Rubin platform still uses copper for in-rack NVLink,” Darbari said. “Co-packaged optical NVLink arrives around 2028 with Feynman. Intra-package reach stays electrical indefinitely. Package-to-package and rack-scale reach is where the shift to optics is real, and rack-to-rack was always optical. What’s new is that this is no longer a networking decision made after the silicon is designed. Optical proximity to the ASIC is now the dominant lever for power and latency, so compute die, package, and interconnect must be co-designed from the start, and every boundary in that co-design is a contract that should be specified precisely enough to verify.”

## Architecting optical in

Finally, for chip architects looking to work optical into projects, there are a few places to begin.

Darbari recommends starting from the traffic pattern, not the technology. “If your bottleneck is at package reach, look at CPO or NPO chiplets. Rack-to-rack is already optical-native. Treat the interconnect as a standards decision. Architecting against a UCIe electrical-to-optical boundary lets you source the photonic engine as qualified chiplet IP rather than building optics expertise in-house. Then, budget verification and thermal effort as architecture work, not sign-off. Specify the electrical-to-optical boundary as rigorously as any protocol contract — what the engine guarantees, under what thermal conditions, with what error bounds. In our formal verification work on chiplet interfaces, the worst bugs sit at boundaries where two teams each assumed the other had specified the behavior. An electrical-optical boundary crossing company lines is that risk squared. Meanwhile, verify what is verifiable now. The EIC control logic, UCIe interface, and tuning state machines are digital and provable with today’s formal tools. Don’t wait for photonic verification to reach digital-grade maturity. Engage early and shape supplier requirements with the specification discipline of formal verification, years before the tooling makes it easy.”

Meanwhile, Orthner says to start at the system level, not the device level. “Model your data flows first — bandwidth, latency, and energy budgets — and identify which links genuinely need to leave the package. Those are your optical candidates. Then, classify the traffic. What’s cache-coherent and ordering-sensitive, what’s bulk streaming? Only after that does it make sense to think about specific photonic components. Treat the interconnect as a first-class design object from day one and let it tell you where optical earns its place. Don’t start by asking, ‘Where do I put optics?’ Start by mapping how data actually moves, then optimize end-to-end throughput so the fabric can feed an optical link at line rate instead of starving it. Software-driven exploration lets you try those tradeoffs in hours — port counts, topology, where the optical I/O attaches. And validate that the interconnect is correct by construction before you commit to a floorplan.”

To Bowers, the prospect of silicon photonics being used for every high-capacity switching chip, every high-speed GPU, TPU, or processor, and for high-bandwidth memory is exciting. “Before touching PIC design, nail down why you need optics. Is it bandwidth density at the package edge (die-to-die scale-up), reach beyond the board (rack-scale), or power efficiency at a given data rate? The answer determines which tier you’re building for. And those are very different design problems with different partners and timelines.”

# 第二部分：中文结构化解读

## 零、速览

| 项目 | 内容 |
|---|---|
| 来源 | Semiconductor Engineering（semiengineering.com） |
| 栏目 | Systems & Design |
| 作者 | Ann Mutschler |
| 原文标题 | Photonics Forces A Chiplet Rethink |
| 发布 | 2026 年 8 月 31 日 |
| 原文链接 | <https://semiengineering.com/photonics-forces-a-chiplet-rethink/> |
| 体裁 | 编辑综述（汇集 Cadence、Axiomise、Siemens EDA、Arteris、ChipAgents、Synopsys、Baya Systems、Keysight EDA 八方的陈述） |
| 一句话主题 | 光子进入封装，不是一个「换个介质」的替换问题，而是把 placement 问题升级成了热、力、电磁、光四个物理域的双向协同设计问题 |

## 一、文章的骨架

原文的论证顺序本身就是它的结论：**越早把光当成物理系统的一部分，越晚付代价。**

1. **尺度决定难度。** 光器件离计算硅越近，带宽与能耗越好；但热漂移、机械应力、电磁耦合、对准与验证的缺口也同步放大。TSMC 的 COUPE 用混合键合把 EIC 直接堆在 PIC 上，宣称传输功耗最多降 85%、寄生电阻趋近于零——收益和代价来自同一个几何变化。
2. **热是最硬的约束，而且它是双向的。** 光子芯片自身发热，反过来加速电子器件老化；边界处还产生应力。微环谐振器约 70–80 pm/°C 的漂移率，使主动热控成为标准做法。
3. **验证出现了结构性不对称。** 电侧可以形式化证明（UCIe 适配器就是典型），光侧没有同等学科。原文称其为「被正式验证的电契约包裹着非正式规格的光子系统」——这是全文最锋利的一句技术判断。
4. **分工建议是「从流量模式出发」，而不是「从器件出发」。** 先把带宽、延迟、能耗预算建模清楚，判断哪些链路真的必须出封装，再谈光子器件。
5. **共存而非替代。** 「该用光的地方用光，能用铜的地方用铜」；封装内互连永远保持电，光真正胜出的是封装到封装与机架级。

## 二、核心机制拆解

| 主张 | 原文给出的证据 | 我的判断 |
|---|---|---|
| 混合键合同时带来收益与代价，二者同源 | Cadence 的 Gilles Lamant：混合键合后 EIC 与 PIC 之间「什么都没有」；光子 chiplet 同时是 aggressor 和 victim；interposer 变成绝缘体；焊球消失 | **这是全文最扎实的一条物理判断**。3D 堆叠把电链路从毫米缩到微米（收益），同时把瓦级热源放到离微环几微米处（代价）。纯逻辑堆叠只有收益，光电堆叠是收益与代价同源——这解释了为什么它在光电子里更难。 |
| 热在光 chiplet 里是「功能正确性」问题，而非性能问题 | Darbari：硅微环约 70–80 pm/°C，WDM 阵列内的轻微温差即可造成漂移与串扰；最热源通常是相邻的 compute ASIC | **成立且是本文最有操作价值的一句**。它把「光器件对温度敏感」从常识升级为一条设计约束：热预算必须进入功能规格。 |
| 电侧可验证、光侧不可验证，是 CPO 的结构性风险 | Darbari：UCIe 适配器可以用形式化方法穷举证明无死锁；光侧没有对应学科；补偿逻辑在 EIC 中是数字的、安全关键的，今天就能证明 | **这是我认为全文最有价值、却被放在末段的判断**。它把「CPO 的瓶颈在测试与验证」具体化为一个可执行议程：与其等光侧成熟，不如先把 EIC 侧的调谐与补偿逻辑做成形式化可证明。 |
| COUPE 把传输功耗降低最多 85% | 转述 TSMC 的说法（堆叠缩短距离、寄生电阻趋近零） | **口径存疑**。这是厂商自报，且未说明是「EIC–PIC 那一段链路」还是「模块对模块」。按本站此前整理的同类数据，CPO 相对可插拔的整链路改善通常在 2–5 倍（约 50–75%），85% 更像是特定链路段或理想条件下的数字。 |
| CPO 光互连 NVLink 约 2028 年随 Feynman 到来；封装内互连永远保持电 | Darbari 的陈述 | **属路线图传闻级别**。年份与「永远」这类绝对表述都没有在原文中给出依据。方向上与业界共识一致：光先赢在封装间与机架级。 |
| 光纤与连接器耦合依赖对准、且通常随温度变化，因此热设计必须覆盖整机 | Bowers 列举 CTE 不匹配材料清单（硅、有机基板、玻璃、underfill、铜、胶、光纤、III-V），并指出液冷可能产生陡梯度或把冷却硬件放到敏感光接口附近 | **成立且常被低估**。这一段是全文工程密度最高的地方：它说明热设计对象不是芯片而是「die stack–interposer–基板–lid–TIM–冷板–光连接器–光纤路由–冷却环境」的整条链。 |
| 光学在封装内的位置分两阶段推进（NPO 与 CPO） | Synopsys 的 Priyank Shukla 描述：近封装光学把光器件焊在板上、激光仍可在可插拔模块中；共封装光学进一步把更多部件并进来 | **描述准确，但没有回答关键取舍**：近封装的可维护性（能换光模块）在多大程度上值回它的热漂移代价？这恰好是本站多篇 CPO/NPO 文章争论的主线。 |

## 三、关键数字清单

- **70–80 pm/°C**：硅微环谐振波长的温度漂移率（主动热控因此成为标准做法）。
- **85%**：TSMC 自报的 COUPE 传输功耗降幅（口径未明，见上）。
- **8 Tbps**：Ayar Labs TeraPHY 的双向光带宽，配套 UCIe 兼容电接口。
- **100 Tb/s / 加速器**：Alchip 与 Ayar Labs 在 TSMC COUPE 平台上的演示值。
- **120+**：UCIe 联盟成员数，光互连被列为核心 vertical。
- **±2σ / 微米 vs 毫米**：2.5D 中 EIC–PIC 走线是毫米级并带来寄生电容电感；3D 把它压到微米级。
- **85 °C**：Keysight EDA 引用的常见结温上限；在此限制下若不液冷，功放只能产生几瓦。
- **约 2028 年**：Darbari 给出的 CPO 版 NVLink 时间点（随 Feynman）。
- **8 家**：原文汇集的厂商/机构陈述数量。

## 四、我的评述（原文没有的判断）

1. **全文真正的技术议程藏在最后一段，而不是标题里。** 标题说的是「光子迫使 chiplet 重新思考」，但可执行的结论只有一条：**把电–光边界当成协议契约来规定，并把 EIC 侧的补偿逻辑做成可形式化证明的数字模块。** 这比「热很难」有用得多，因为前者今天就能做，后者只是约束条件。

2. **「热与电的收益同源」意味着 CPO 不存在「等工艺成熟就变简单」的阶段。** 混合键合带来的电学收益（缩短链路）与热学代价（热源贴近微环）由同一几何决定，所以哪怕工艺再成熟，这个取舍也不会消失，只能被工程手段（分区供电、热隔离、微冷却器、调谐伺服）持续补偿。任何把 CPO 的困难归因于「早期工艺不成熟」的叙述，都低估了问题的结构性。

3. **原文列出的四个失效面（热、应力、电磁、对准）里，只有「对准」是纯机械问题。** 另外三个都会通过电学或光学性能表现出来，这带来一个验证上的陷阱：**它们在人眼里看起来都像「光学性能退化」**。这正是 Darbari 说「调谐伺服里的边角 bug 在现场看起来和物理失效一模一样」的含义——这条判断对测试方法学的含义，比文中任何数字都重要。

4. **原文对成本、良率与可维护性的沉默值得注意。** 十四家厂商的陈述里，几乎全部在讨论「能不能做出来」，没有人讨论「做出来之后谁来修」。NPO 的可维护性优势与 CPO 的能效优势之间的取舍，是这类系统真正落地时的决定性变量，原文只在描述阶段时一笔带过。

5. **「封装内互连永远保持电」这句需要加限定。** 它成立的前提是「封装内的距离收益被电链路的寄生限制锁住」。一旦出现片上光互连（原文自己也提到这是值得关注的新技术），这个前提就会被打破。把它读成「封装内不可能用光」是过度延伸。

## 五、可采信度分层

- **高（物理机制或公开事实）**：硅折射率随温度变化、微环 70–80 pm/°C；材料 CTE 不匹配清单；UCIe/BoW 作为 D2D 接口；Ayar Labs TeraPHY 的 8 Tbps 与 UCIe 兼容接口；2.5D 与 3D 的电链路尺度差异；TSMC COUPE 采用 EIC 堆叠在 PIC 之上并采用混合键合。
- **中（方向可信、数字待核）**：85% 的功耗降幅；100 Tb/s/加速器；热预算必须覆盖整机链路的表述；「替代 vs 共存」的行业共识。
- **低（路线图与内部判断）**：2028 年 CPO NVLink 时间点；「封装内互连永远保持电」；各家内部对「最棘手的问题在系统层」的定性表述。

## 六、原文没有回答的问题

1. 电–光边界契约的具体内容应该包含哪些条目（温度包络、误码界、调谐锁定时间、失效模式）？原文只给了方法论，没给清单。
2. 热隔离、主动稳定、封装级微冷却器这三项手段的成本与面积代价分别是多少？
3. 近封装光学的可维护性溢价，是否足以覆盖它的热漂移代价？原文没有做这个对比。
4. 光纤耦合在全工作温度范围内的对准保持，目前实测的耦合损耗变化幅度是多少？
5. 谁负责提供光侧的验证方法学——EDA 厂商、测试设备厂商，还是标准化组织？

## 七、原文内部值得注意的几处

1. **原文有一整段被重复了两次。** 以「Further, in a 2.5D architecture…」开头的那段（首次出现时带有 John Bowers 的完整机构身份，第二次压缩为「Bowers」）在原文中出现两遍。**这不是本站抽取造成的**——已核对 semiengineering.com 线上原版，同样重复两次。按「逐字转载」的原则，第一部分保留了这个重复；读者读到第二遍时可跳过。
2. **小标题「Architecting optical in」是一个未写完的短语**（原文如此），推测本意是 Architecting optical in（systems）。按原样保留。
3. **开头的 Key Takeaways 与正文的重复度较高**，第三条基本是正文前两段的浓缩。

## 八、与本站其他文章的连接

- **硅光代工层**：<https://marvinlee.cn/posts/silicon-photonics-foundry-layer/> —— 本文讲「怎么设计」，那篇讲「谁能造出来」，是同一问题的两面。
- **CPO 在《自然·电子学》上的综述**：<https://marvinlee.cn/posts/cpo-in-nature-electronics/> —— 学术界对同一组物理约束的表述。
- **NVIDIA CPO 背后的 100 秒瓶颈**：<https://marvinlee.cn/posts/the-100-second-bottleneck-behind-nvidia-cpo/> —— 为什么必须把光推进封装。
- **Vera Rubin Pod**：<https://marvinlee.cn/posts/nvidia-vera-rubin-pod/> —— 与文中「机架级才是光真正胜出处」的判断对照。
- **Chiplet 架构与测试插入**：<https://marvinlee.cn/posts/ai-chiplet-architectures-redefining-test-insertions/> —— 直接对应文中「电侧可验证、光侧不可验证」的不对称。
- **CPO 最大的瓶颈是高量产测试**：<https://marvinlee.cn/posts/cpo-biggest-bottleneck-high-volume-testing/> —— 验证缺口的产业化后果。
- **NPO 光电链路实验台**：<https://marvinlee.cn/posts/npo-optical-electrical-link-lab/> —— 近封装光学在实验层面的取舍。
- **CPO 已死，NPO 万岁**：<https://marvinlee.cn/posts/optical-illusion-cpo-is-dead-long-live-npo/> —— 对「光学该离计算多近」这一问题的对立回答。
- **224/448 Gbps SerDes**：<https://marvinlee.cn/posts/pushing-the-speed-limit-serdes-transceivers-224-448gbps/> —— 文中 EIC 侧驱动电路的速率背景。
- **tsmc-ahead-in-cpo-samsung-third-chip**：<https://marvinlee.cn/posts/tsmc-ahead-in-cpo-samsung-third-chip/> —— COUPE 在代工竞争中的位置。
- **先进封装通识**：<https://marvinlee.cn/posts/a-masterclass-on-advanced-packaging/> —— 2.5D/3D、混合键合的基础。

## 九、一句话结论

**光进入封装之后，最难的既不是光源也不是调制器，而是这样一件工程事实：让光跑得更快的那个几何变化，同时也让热离光更近——而这一对矛盾无法通过等工艺成熟来消除，只能通过把电–光边界写成一份可验证的契约来管理。**
