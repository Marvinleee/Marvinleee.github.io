---
layout: post
title: "Meta MTIA 300 内部框图详解（日文逐译）"
date: 2026-08-22 09:30:00 +0800
categories: [人工智能]
tags: [Meta, MTIA300, AI芯片, chiplet, 先进封装, Broadcom]
description: "逐译 Vengineer 对 Meta MTIA 300 内部框图（ISCA 2026）的解读，并附中文结构化解读：chiplet 构成、MAX2 互连、SRAM 层级、内置 NIC 与集合卸载、RISC-V 控制核，及与本站 CPO/先进封装系列的衔接。"
image: /assets/img/posts/meta-mtia-300-internal-block-diagram/img03.png

---

> **原文**：Vengineer《Meta MTIA 300 の内部ブロック図》（はてなブログ，2026-08-18）｜ 日文逐译 + 中文结构化解读。
> **原文链接**：<https://vengineer.hatenablog.com/entry/2026/08/18/080000>
> 本文为「中文翻译（保留原文结构与配图位置）+ 中文结构化解读」两层结构。

# 第一部分：中文翻译（日文原文逐译）

# 引言

关于 Meta MTIA 300，我在下面的文章中写过。

vengineer.hatenablog.com

另外，关于 MTIA 300 的内部 SRAM，我也在下面的文章中进行了妄想。

vengineer.hatenablog.com

这次，我想基于 MTIA 300 的论文，对上述内容进行回顾。

# Meta MTIA 300

- [MTIA 300: Meta’s First Training Chip Featuring Built-in NICs and Collective Offloading Engines](https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf)

MTIA Team∗
Meta Platforms

如上所示，但论文最后两页密密麻麻地写满了名字。到底有多少人呢？

这篇论文中刊登了 MTIA 300 的内部框图。下面为了说明而引用。

![图1｜MTIA 300 整体内部框图（论文引用）](/assets/img/posts/meta-mtia-300-internal-block-diagram/img01.png)

*图1｜MTIA 300 整体内部框图（论文引用）*

MTIA 300 的构成是：

- 1 x Compute chiplet
- 2 x Network chiplet

Compute chiplet 和 Network chiplet 之间通过名为 MAX2 的通道连接。总共通过 19 个 MAX2 连接。

这个 MAX2 到底是什么呢？我怀着这个疑问四处调查后发现，

[Broadcom 的这份幻灯片](https://investors.broadcom.com/static-files/4378d14e-a52f-409f-9ae4-03d810bc7a6c)的第 87 页上有下面这张图。为了说明而引用。在这张图中，芯片间连接的部分标注为 MAX。由于 Meta MTIA 300 是与 Broadcom 联合开发的，所以使用了这个，并且我妄想着是不是从 MAX 进化到了 MAX 2？

![图2｜Broadcom 幻灯片中芯片间互连的 MAX 标注（论文引用）](/assets/img/posts/meta-mtia-300-internal-block-diagram/img02.png)

*图2｜Broadcom 幻灯片中芯片间互连的 MAX 标注（论文引用）*

关于 SRAM，我妄想的是大约有 394MB 吧？但实际上是 96MB x 2 = 192MB。

论文中还刊登了更详细的框图。为了说明而引用。这张框图中没有包含 Network chiplet，只画到了 MAX 2 部分。

![图3｜更详细的 SRAM / 计算框图（仅画至 MAX2，不含 Network chiplet）](/assets/img/posts/meta-mtia-300-internal-block-diagram/img03.png)

*图3｜更详细的 SRAM / 计算框图（仅画至 MAX2，不含 Network chiplet）*

SRAM 分别分为 12 个块。每个块是 8MB。仔细看的话，一个块似乎又分成了 4 个部分。
也就是说，看起来像是分成了 12 x 4 = 48 个块。

下面是从底部截取出来的 CCP_SS 和 HOSTIF_SS 部分。为了说明而引用。它们各自连接到 MAX2_MB。MB 大概是 Memory Bridge 的缩写吧。HOSTIF_SS 的 Root DBG SS 和 CCP_SS 的 CCP DBG 是相连的。

![图4｜CCP_SS 与 HOSTIF_SS 局部放大（各自连接至 MAX2_MB）](/assets/img/posts/meta-mtia-300-internal-block-diagram/img04.png)

*图4｜CCP_SS 与 HOSTIF_SS 局部放大（各自连接至 MAX2_MB）*

[Meta MTIA 2i (200) 的 Hotchips 幻灯片](https://hc2024.hotchips.org/assets/program/conference/day2/82_HC2024.Meta.MadduryKansal.final.pdf)的第 11 页中，有如下关于 Host Interface & Control Core 的记载。为了说明而引用。

![图5｜MTIA 2i HotChips 幻灯片中的 Host Interface & Control Core](/assets/img/posts/meta-mtia-300-internal-block-diagram/img05.png)

*图5｜MTIA 2i HotChips 幻灯片中的 Host Interface & Control Core*

- Host Interface

Gen5 x8 - 32GB/s
4MB PCIe Descriptor SRAM，用于快速描述符获取

- Control Core Subsystem

四核标量 RISC-V
8MB L2 缓存。
4MB Context SRAM，用于快速工作负载分配

如上所述。MTIA 300 也是类似的结构呢。

# 结语

Meta 公开了相当详细的 MTIA 300 内部框图，这让我很高兴。

如果以此为基础开发 MTIA 400 的话，内部结构应该也几乎相同吧。

另外，重新设计一个拥有 6 个 800G（112G x 8）端口的 Network chiplet 是很难想象的，所以应该是直接沿用这个 Network chiplet，然后开发 Compute chiplet x 2 + SoC chiplet 吧。

顺便说一下，MTIA 400 的构成是：

- 2x Medha + 1x Hamsa + 2x Owl chiplets per module (CoWoS-L)

对吧。Medha 是 Compute chiplet，Hamsa 是 SoC chiplet，Owl 是 Network chiplet。

Meta 的 MTIA 400 采用 chiplet 架构
- 2x Medha + 1x Hamsa + 2x Owl chiplets per module (CoWoS-L)

并且，
Medha0、Medha1、Hamsa 中似乎各自都有 FW[https://t.co/myABQ30EPf](https://t.co/myABQ30EPf) [pic.twitter.com/McRvZ85gNW](https://t.co/McRvZ85gNW)— Vengineer的妄想 (@Vengineer) [2026年8月16日](https://x.com/Vengineer/status/2088913680864047439?ref_src=twsrc%5Etfw)

如上述推文所述，在 MTIA 400 中，Compute chiplet 和 SoC chiplet 似乎都需要 Firmware。


# 第二部分：中文结构化解读

> 以下为基于原文（及所引 ISCA 2026 论文、HotChips 2024 幻灯片）的梳理与延伸判断；原文作者自陈多处为「妄想」（推测），关键结论请以 Meta 官方论文为准。

## 一、背景：Meta 的自研芯片路线

MTIA（Meta Training and Inference Accelerator）是 Meta 面向推荐/排序与生成式 AI 负载自研的 ASIC。MTIA 300 是 Meta **首款训练芯片**，论文发表于 ISCA 2026，最大亮点在于把 **NIC（网络接口）与集合通信卸载引擎（Collective Offloading Engines）做进 die 内**——互联能力不再完全依赖外部网卡/交换机。这与本站此前 CPO / 光互联系列判断的方向一致：当算力 scale-out 成为瓶颈，把网络能力下沉到 chiplet 层面是必然趋势。

## 二、核心架构拆解

- **整体构成**：`1 × Compute chiplet + 2 × Network chiplet`。Compute die 负责计算，Network die 负责片间/节点间互联。
- **互连通道 MAX2**：Compute 与 Network chiplet 之间由 **19 个 MAX2 通道**连接。作者推测 MAX2 源自 Broadcom 的 MAX（芯片间互连 IP）——因 MTIA 为 Meta 与 Broadcom 联合开发，从 MAX 演进到 MAX2。这体现「云厂商 + 传统 ASIC 厂联合定制互连 IP」的产业分工。
- **SRAM 层级**：
  - 总量 **96MB × 2 = 192MB**（作者原猜测约 394MB，论文实测 192MB）。
  - 详细框图显示 SRAM 分为 **12 个 block，每 block 8MB**；细看每个 block 又分 4 个子块，看似 **48 个 micro-block**。这是典型的片上 SRAM bank 化/分区化设计，利于并行访问与功耗域隔离。
  - 底部 **CCP_SS / HOSTIF_SS** 各自接 **MAX2_MB**（推测 MB = Memory Bridge）；HOSTIF_SS 的 Root DBG SS 与 CCP_SS 的 CCP DBG 相连——调试/控制子系统经互连打通。
- **Host Interface & Control Core**（借 MTIA 2i / HotChips 2024 幻灯片佐证 MTIA 300 同构）：
  - Host Interface：PCIe **Gen5 ×8，32GB/s**，配 **4MB PCIe Descriptor SRAM**（快速描述符预取）。
  - Control Core Subsystem：**四核标量 RISC-V**，8MB L2，4MB Context SRAM（快速任务分配）。

## 三、关键技术判断

1. **内置 NIC + 集合卸载**：训练集群的 AllReduce / AllGather 在 chiplet 内就近完成，减少主机侧 PCIe 与 NIC 往返，是 scale-up / scale-out 收敛的关键。
2. **RISC-V 控制核**：以标量 RISC-V 做控制面（而非 Arm / x86），符合去授权化、可定制趋势。
3. **chiplet + CoWoS-L**：计算/网络/SoC 解耦，各自独立迭代，封装层面用先进封装整合。

## 四、与本站系列的衔接

- **光互联 / CPO**：Network chiplet 承载 800G 级端口（MTIA 400 为 6 × 800G），其电→光转换与 CPO 测试正是本站反复讨论的拐点（参见 CPO / 光互联系列）。
- **先进封装**：CoWoS-L、chiplet 拆分（Medha / Hamsa / Owl）与本站「先进封装」主线呼应。
- **AI 硬件格局**：Meta 自研 + Broadcom 定制 ASIC 代工，映射「云厂商自研硅 + 传统 ASIC 厂」的分工格局。

## 五、MTIA 400 的延伸（作者推测）

- 构成：**2 × Medha（Compute）+ 1 × Hamsa（SoC）+ 2 × Owl（Network）per module（CoWoS-L）**。
- 沿用 MTIA 300 的 Network chiplet（重做 6 × 800G 网络 die 不经济），新增 SoC chiplet 做系统控制；**Compute / SoC chiplet 需固件（FW）**。
- 含义：固化「网络 die 复用 + 计算/控制 die 迭代」的演进范式。

## 六、局限与提醒

- 原文多处为非官方推导（MAX2 来源、MB 含义、SRAM 子块划分），应以 Meta ISCA 2026 论文为准。
- 配图为论文框图引用，分辨率有限，细部以官方论文 PDF 为准（见上方原文链接）。
