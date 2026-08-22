---
layout: post
title: "Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs — 现代 SSD 中读干扰对系统级性能影响的实验研究"
date: 2026-08-19 00:00:00 +0800
categories: [计算机体系结构]
tags: [SSD, NAND, 读干扰, 存储可靠性, 系统性能]
description: 现代 SSD 中读干扰对系统级性能影响的实验研究 本文附英文原文（arXiv 全文/PDF 提取）与中文深度解读。

---

> 原文：[Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs](https://arxiv.org/abs/2608.14073)，作者 Yonggon Park, Hyunuk Cho, Onur Mutlu, et al. (POSTECH & ETH Zurich)。
> 本页结构：第一部分为英文原文（Original Article），第二部分为中文深度解读（解析）。
> 说明：原文无付费墙，全文完整收录（来自 arXiv HTML 或 PDF 文本提取，公式以 LaTeX 呈现）。

# 第一部分：正文（Original Article）

Experimental Study on System-Level Performance Impact of
Read Disturbance in Modern SSDs
YONGGON PARK,POSTECH, Republic of Korea
HYUNUK CHO,POSTECH, Republic of Korea
ONUR MUTLU,ETH Zurich, Switzerland
SUNGJIN LEE,POSTECH, Republic of Korea
JISUNG PARK,POSTECH, Republic of Korea
This work investigates the system-level performance impact of read disturbance in modern NAND flash-based
SSDs, aiming to provide new insights that can help develop better storage architectures and optimize system
software. Continuous improvement in storage density over decades has led NAND flash memory to play
a vital role in modern computing systems, but it also comes at a cost of significant reliability degradation.
Among various error sources, read disturbance has gained growing attention as a major reliability concern
due to its rapidly increasing impact, which can significantly affect system I/O performance by exacerbating
SSD-internal reliability-management overheads. Although a large body of prior work has focused on device-
level characterizations and optimizations, the system-level performance impact of read disturbance still
remains largely uninvestigated. To address this gap, this work conducts a rigorous experimental study using 15
modern NVMe SSDs from 10 major vendors in two ways. First, we comprehensively analyze the system-level
performance impact of read disturbance under diverse workloads and operating conditions. Second, to highlight
the importance of efficient read-disturbance management, we showcase a new possible SSD-performance
attack as a case study, demonstrating that an adversary can significantly degrade the I/O performance of
other concurrently running processes by exploiting read disturbance alone in commodity SSDs. Based on our
experimental study, we make 16 new observations and 7 takeaway lessons, which lead to 6 key directions for
future improvements at the host-system and SSD-architecture levels to better cope with read disturbance.
CCS Concepts:•Information systems→Flash memory;•Hardware→External storage.
Additional Key Words and Phrases: solid state drives (SSDs), NAND flash memory, read disturbance, I/O
performance, performance analysis
ACM Reference Format:
Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park. 2026. Experimental Study on System-
Level Performance Impact of Read Disturbance in Modern SSDs.Proc. ACM Meas. Anal. Comput. Syst.10, 1,
Article 10 (March 2026), 32 pages. https://doi.org/10.1145/3788092
1 Introduction
Owing to the continuous and significant improvements in storage density over decades, NAND
flash memory has become the predominant memory technology for modern storage systems.
Since 2014, the storage density of NAND flash memory has almost doubled every two years [1, 2],
which has enabled modern solid-state drives (SSDs) to offer unprecedented single-device capacities
(e.g., 128 TB [3]) at a lower cost per bit. Three key technologies have driven such advancement:
(i) aggressive process scaling, which packs more cells into the same die area, (ii) multi-level cell
(MLC) techniques, which allow each cell to store multiple bits (e.g., triple-level cell (TLC)), and
(iii) 3D stacking, which vertically integrates hundreds of wordline (WL) layers in a NAND flash die.
Unfortunately, the continuous storage-density improvements come at a cost of significant reliabil-
ity degradation in modern NAND flash memory, aggravating the reliability impact of various error
sources, such as read disturbance [4–11], program interference [12–15], and retention loss [16–19].
NAND flash memory stores data based on a cell’s threshold voltage (VTH) level that highly depends
on the amount of charge inside the cell. The unique cell designs and organizations of 3D NAND
arXiv:2608.14073v1  [cs.AR]  14 Aug 2026

10:2 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
flash memory render flash cells more susceptible to charge leakage [16, 19] and circuit-level distur-
bance [6–8]. Storing more bits in a smaller cell reduces the margin between different VTH levels,
drastically increasing the reliability impact of VTH shifts caused by the error sources [20].
Among the various error sources,read disturbancehas gained increasing attention as a major
reliability concern in modern NAND flash memory. To read a page from a target WL, NAND flash
memory needs to apply high pass-through voltage VPASS (e.g., 6 V) toallnon-target WLs in the
same block, which unintentionally programs the WLs slightly. Such disturbance can cause data
corruption (i.e., a permanent data loss) when a block experiences a large number of page reads, e.g.,
400K [6]. The disturbance effect of a single page read significantly increases in modern NAND flash
memory due to two key reasons. First, reading a page from a WL requires more sensing operations
in advanced MLC techniques, exposing non-target cells to high VPASS for a longer time. Second, a
single page read disturbs more pages, as the number of pages per block increases rapidly.
The increasing reliability impact of read disturbance, in turn, can significantly affect the perfor-
mance of modern SSDs, exacerbating the overheads of SSD-internal tasks, such asread retry[21, 22]
andread reclaim[ 4, 5, 23]. When the SSD controller fails to correct all the raw bit errors in a read
page with error-correcting codes (ECC), itretriesreading the page with adjusted read-reference
voltage (VREF) levels until the page’s raw bit-error rate (RBER) decreases below the ECC’s error-
correction capability. Before read retry becomes unable to sufficiently reduce a page’s RBER due
to excessive read disturbance, the SSD controller needs to perform read reclaim that removes the
page’s transient errors by rewriting its data to another free page. Even though both read retry
and read reclaim are essential to ensuring the reliability of stored data, their additional read and
write operations can significantly affect SSD performance [6, 21, 24]. To cope with the increasing
reliability impact of read disturbance, modern SSDs need to invoke read retry and read reclaim
more frequently, aggravating their performance overheads.
Our goalin this work is to provide new insights into the system-level performance impact of read
disturbance in modern NAND flash-based SSDs, which has not yet been thoroughly investigated in
the literature, but can help develop better storage architectures and optimize system software. To
this end, we conduct a rigorous experimental study using 15 modern NVMe SSDs [25–39] from
10 major vendors in two ways. First, we analyze the system-level performance impact of read
disturbance under diverse workloads and operating conditions to (i) evaluate the effectiveness
of existing reliability-management techniques in modern SSDs, (ii) identify their limitations, and
(iii) explore new optimization opportunities. Second, as a case study, we showcase a new possible
SSD-performance attack that can severely degrade the I/O performance of other applications sharing
the same SSD by causing excessive overheads for read-disturbance management, highlighting the
importance of efficient read-disturbance management in modern storage systems.
Based on our experimental study, we make 16 key observations and 7 takeaway lessons, which
lead to 6 key directions for future improvements at the host-system and SSD-architecture levels to
better cope with read disturbance. We highlight four observations that are especially important. First,
read disturbance can significantly degrade SSD performance, e.g., lowering read bandwidth by more
than 79.1% for 32.7 seconds, even under sequential-read workloads that are commonly considered
best for SSD performance in prior work [ 40–42]. Second, severe and consistent performance
fluctuations can occur for a long time (e.g., several hours) in modern SSDs when a number of
blocks trigger read-disturbance management tasks simultaneously. Third, the performance impact
of read disturbance highly depends on SSD-internal management, significantly varying even across
SSDs using the same NAND flash chips. Fourth, an application’s I/O performance can significantly
degrade due to read disturbance caused by other applications sharing the same SSD.
Our case study experimentally demonstrates a new possible performance attack that can cause
significant I/O slowdowns to other concurrent processes by exploiting read disturbance. The attack

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:3
issues only sequential reads within its own exclusive logical-block address (LBA) rangewithout
requiring direct access to the target application’s data, any host-privilege escalation, or more CPU
cores than the target. Our evaluation shows that the attack can (i) burst significant performance
fluctuations within a short time window and/or (ii) sustain long I/O slowdowns, which severely
affect both the I/O bandwidth and read tail latency of other applications that share the same SSD.
This work makes the following key contributions:
• We present the first rigorous study on the system-level performance impact of read disturbance
by testing 15 commodity NVMe SSDs under various operating scenarios, which leads to 16 new
observations that highlight the importance of efficient read-disturbance management.
• We propose a new possible SSD-performance attack that can severely degrade a target applica-
tion’s I/O performance by exacerbating read-disturbance management overheads, experimentally
demonstrating the attack’s feasibility and effectiveness in commodity SSDs.
• Based on our new observations, we present six future improvements to better cope with read
disturbance that becomes more severe as the storage density of NAND flash memory increases.
2 Background
We provide a brief background on modern SSDs necessary to understand the rest of the paper.
2.1 NAND Flash-Based SSDs
Fig. 1(a) shows an organizational overview of modern NAND flash-based SSDs that commonly
consist of three key components: (i) NAND flash array, (ii) SSD controller, and (iii) internal DRAM.
NAND Flash Array.Fig. 1(b) illustrates the hierarchical organization of 3D NAND flash memory.
A group of vertically stacked flash cells are serially connected, which is called aNAND string. Each
NAND string is connected to a bitline (BL), and NAND strings in the same 𝑦-𝑧 plane constitute
asub-block, where a single wordline (WL) connects all flash cells at the same vertical location. A
blockcomprises multiple sub-blocks (e.g., 2 to 8) of which WLs at the same vertical location are
connected and thus share the same WL voltage. Aplaneconsists of hundreds of blocks that share
all BLs in the plane. Adie(or achip) contains several planes (e.g., 4 or 6), and multiple dies can be
packaged together while sharing the package’s command and data bus, i.e., achannel.
Modern SSDs contain a large number of dies that can concurrently operate (e.g., 32 dies [43]),
enabling high internal parallelism. To enhance random-read performance, manufacturers have
recently developed the independent-plane read [44] that allows multiple planes in the same die to
perform page reads independently of each other. Despite the high die- and plane-level parallelisms,
SSD performance is often bottlenecked by the channel transfer rate (e.g., 1.2–2.4 GB/s [43, 45, 46])
due to the limited number of channels (e.g., 8 or 16 [47]) that connect the dies to the SSD controller.
Sub-blockSub-blockSub-blockSub-block(b) NAND flash array
WL1
WL2
WLm…………………
BL1BL2BLn…xyz
(a) NAND flash-based SSD
SSDControllerEmbed.CoreEmbed.CoreEmbed.CoreInt.	DRAML2PMappingsFlash	Translation	LayerFlashControllerReq.	HandlerECC
…FlashCtrl.	1FlashCtrl.	2FlashCtrl.	NChannelNAND	DieNAND	DieNAND	Die NAND	String
Die	1…
Peripheral
Internal	ChannelDie	2Die	NPlane	1Plane	4Block	1Block	2Block	1Block	2………
Fig. 1. Overview of modern NAND flash-based SSD.

10:4 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
SSD Controller.An SSD controller consists of (i) multiple embedded cores and (ii) hardware
flash controllers. The cores run SSD firmware, calledflash translation layer(FTL), which performs
various internal management tasks, such as address translation [48–50], garbage collection [51–59],
reliability management [6, 12, 14, 18, 19, 23], wear leveling [60–62], request scheduling [63–67],
etc. A flash controller is in charge of request handling, data randomization, and error-correcting
codes (ECC) for the associated NAND flash dies. Modern SSDs typically employ 8 to 16per-channel
flash controllers to prevent ECC from delaying data transfer through the channels [68–70].
Internal DRAM.Modern SSDs employ large low-power DRAM (e.g., several GBs [71]) for metadata
store and data buffer. Except for some cost-optimized SSDs [33, 34, 72], it is common to keep all
logical-to-physical (L2P) address mappings in internal DRAM to avoid expensive NAND flash
accesses for address translation. Doing so requires 0.1% of the SSD capacity to support 4-KiB
mapping granularity [48, 73], which consumes most of the internal DRAM capacity. FTL also needs
to maintain various metadata for reliability management, such as the program and erase (P/E)-cycle
count, retention age, and read count for each block. A small fraction of internal DRAM (e.g., tens of
MBs [74]) is used as a write buffer to hide the long write latency of NAND flash memory [75, 76].
2.2 NAND Flash Operations
Three basic operations enable access to NAND flash memory: (i) program, (ii) erase, and (iii) read.
Program and Erase Operations.A flash cell stores data using its threshold voltage (V TH) level
that can change in a nonvolatile manner depending on the amount of charge in the cell’s floating
gate or charge trap. A program operation injects electrons into target cells at a page granularity
(e.g., 16 KiB), increasing their VTH levels. An erase operation ejects electrons from target cells at a
block granularity, which decreases their VTH levels. Injecting/ejecting electrons into/from a large
number of cells requires applying a high voltage (e.g.,>20 V) to the cells for a long time (e.g., 400µs
and 3.5 ms for program and erase operations, respectively), which physically damages target cells.
Read Operation.NAND flash memory reads stored data from target cells at a page granularity by
identifying whether current flows through the corresponding NAND strings [21, 77, 78]. When
applying read-reference voltage VREF to a target WL, the cells connected to the WL operate as
either a resistor (if VTH<VREF) or an open switch (if VTH>VREF). A NAND flash chip also applies
pass voltage VPASS to other WLs in the same block which is high enough (e.g., 6 V) to make all
non-target cells operate as a resistor regardless of their VTH levels. Doing so ensures that only a
target cell’s VTH level dictates the corresponding NAND string’s conductance. If the NAND string
conducts flow, the sensing logic interprets the cell’s data as ‘1’; otherwise, it reads as ‘0’.
2.3 Reliability Issues in Modern SSDs
NAND Flash Reliability.NAND flash memory is error-prone due to a variety of error sources,
such as read disturbance [4, 5, 8–10], program interference [12–15], and retention loss [16–19].
Fig. 2 shows the VTH distribution of a WL, when programmed in (a) single-level cell (SLC) and (b)
triple-level cell (TLC) modes to store one and three bits per cell, respectively. Read and program
operations unintentionally program other non-target WLs in the same block, slightly increasing
the cells’ VTH level (i.e., disturbance and interference). A flash cell leaks its charge over time, which
decreases its VTH level (i.e., retention loss). If a cell’s V TH level shifts beyond VREF, sensing the
cell leads to a different value from the programmed originally, causing a bit error. Two major
factors significantly degrade the reliability of NAND flash memory. First, the multi-level cell (MLC)
technique drastically reduces the VTH margins to pack more VTH states within the limited voltage
window. Second, the high voltage applied to target cells during program and erase operations
physically damage the cells, making it easier for the cells to gain or lose electrons more easily.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:5
Programmed
VTHDesign	Limit
#	of	cells VTH
VREFRetention	lossDisturbance/Interference0VTH	MarginErased	(E)1
#	of	cellsVTH	Margin
(a) SLC NAND flash memory
(b) TLC NAND flash memory
VREF0
111E
VREF1
110P1 101P7
VREF2
100P2
VREF3
000P3
VREF4
010P4
VREF5
011P5
VREF6
001P6
Errors
MSBCSBLSB
Fig. 2. V TH distributions of NAND flash memory cells.
Reliability Management.There are four reliability-management techniques widely adopted to
guarantee the integrity of stored data: (i) ECC, (ii) read retry, (iii) data refresh, and (iv) patrol read.
First, ECC detects and corrects raw bit errors in a read page [79–81]. After reading the data from
the flash memory, the flash controller detects and corrects the errors using the ECC parity that
is stored in the out-of-bound (OOB) area of the same WL [ 79–83]. Second, if a read page’s raw
bit-error rate (RBER) exceeds the ECC capability, the SSD controller performs read retry that reads
the page again with adjusted VREF levels until sufficiently lowering the page’s RBER [21, 22]. Third,
to avoid potential data corruptions due to excessive RBER that even read retry cannot handle,
the SSD controller proactively refreshes stored data. For example, if a block’s read count (i.e., the
number of page reads to the block) exceeds a threshold (e.g., 400K [ 6]), the SSD controller can
eliminate transient errors stemming from read disturbance by copying the block’s valid data to free
pages, which is calledread reclaim. Fourth, to proactively mitigate the overheads of ECC-decoding
and read retry, some SSDs employpatrol reads, which periodically read stored pages to (i) check
their RBER and (ii) identify the near-optimal VREF levels for future reads [84–86].
These reliability-management techniques enable modern SSDs to meet the strict unrecoverable
bit-error ratio (UBER) requirements of <10−15 [87], despite the continuously degrading NAND
flash reliability. In practice, SSD controllers escalate to stronger and more expensive techniques
as RBER increases. For example, an SSD controller first performs hard-decision ECC decoding,
which provides the lowest latency but also the weakest error-correction capability. If hard-decision
ECC decoding fails, the controller invokes more expensive recovery steps, such as read retry and
soft-decision ECC decoding, and ultimately performs the data-refresh operations (e.g., read reclaim)
when necessary. This progressive recovery process allows SSDs to successfully service nearly all
I/O requests even under worst-case operating conditions (e.g., 1-year retention at 1.5K PEC [88, 89])
at the cost of degraded I/O performance. When an error remains uncorrectable even after the whole
recovery process, the SSD reports it to the host as aread failurerather than returning corrupted
data, i.e., a successful read completion implies that no data corruption has been detected.
3 Motivation
Read disturbance has gained growing attention recently due to its increasing reliability impact.
Reading a page causes higher disturbance in modern NAND flash memory for two key reasons.
First, the advanced multi-level cell (MLC) techniques require more sensing steps for a page read, e.g.,
up to four sensing steps in quad-level cell (QLC) NAND flash memory, which significantly increases
the read latency and thus exposes non-target cells to high VPASS for a longer time. Second, a single

10:6 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
read operation disturbs more non-target pages, as the block size in modern NAND flash memory
rapidly increases (e.g., recent QLC NAND flash memory contains 2,816 pages per block [90]).
The increasing reliability impact of read disturbance, in turn, can significantly degrade the I/O
performance of modern SSDs, aggravating reliability-management overheads. As the RBER of a
larger number of pages increases more rapidly, the SSD controller needs to perform read retry
and read reclaim more frequently, which introduces significant performance overhead due to
additional read and copy operations, respectively. Although prior studies have proposed various
techniques to mitigate read retry overhead [21, 22], read reclaim’s copy overhead rather severely
increases in modern NAND flash memory due to the increased block size, i.e., read reclaim needs to
copy a large number of pages in the target block. Such increased overheads can affect application
performance more seriously in modern computing systems, where a variety of data-intensive
applications consistently read massive amounts of data from high-performance SSDs.
Nevertheless, no prior work has yet thoroughly investigated the system-level performance impact
of read disturbance in practice. To our knowledge, only one recent study [5] has demonstrated that
read reclaim can degrade the I/O response time and lifetime of commodity SSDs, which motivates
adaptively delaying read reclaim and relying more on other reliability-management techniques to
mitigate performance degradation. In the prior study, however, most evaluated SSDs are outdated
in terms of storage interface (SATA) and NAND flash technology (2D or early 3D NAND flash
memory) [91–100], and only one workload (16-KiB random reads) is used. With such outdated SSDs
and limited workload, it is difficult to provide sufficient insights for a comprehensive understanding
of the performance impact of read disturbance in modern SSDs that serve diverse I/O patterns with
high-bandwidth interface (e.g., NVMe) and high-density (yet low-reliability) NAND flash memory.
Our goalis to provide new insights into the system-level performance impact of read disturbance
in modern NAND flash-based storage systems, which can help develop better storage architecture
and optimize system software (e.g., operating-systems I/O stack and SSD firmware) to better cope
with ever-increasing I/O-performance demands from data-intensive applications. To this end, we
conduct a comprehensive experimental study that characterizes the performance of modern NVMe
SSDs under different access patterns and operating conditions.
4 Characterization Methodology
This section presents our methodology for characterizing the impact of read disturbance on the
system-level performance in modern NAND flash-based SSDs.
4.1 Testing Infrastructure
Tested SSDs.Table 1 summarizes the key characteristics of the 15 commodity SSDs from 10 vendors
that we test [25–39]. We characterize recent M.2 NVMe SSDs that employ advanced 3D TLC/QLC
NAND flash memory with 96–232 stacked-WL layers. To analyze the impact of SSD firmware, we
test several SSDs that use the same NAND flash chips, i.e., chips from the same NAND manufacturer
with the same number of WL layers and the same MLC technology. All tested SSDs support PCIe
Gen 4 interface (four lanes), offering high sequential-read bandwidth. For rapid characterization, we
select SSD models that provide 500-GB or 512-GB storage capacity. Even though process variation
across NAND flash chips [9, 101–109] may lead to different performance behaviors even across
SSDs of the same model, such within-model differences are not the focus of this work. We expect
any remaining differences to have limited impact on the system-level behaviors investigated in
this study, given that SSD manufacturers generally aim to deliver consistent performance across
devices of the same model (e.g., by using NAND flash chips with similar characteristics or wafer
locations). We leave a systematic investigation of within-model performance variation for future
work.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:7
Table 1. Specifications of 15 commodity SSDs tested.
SSD ID Read Performance Hardware Specification Release YearSeq. [MB/s] Rand. [IOPS] NAND Mfr. WL Layers/MLC Capacity Int. DRAM
SSD-A6,400 800K Mfr. A 128/TLC 500 GB 512 MB 2020
SSD-B7,000 800K Mfr. B 96/TLC 500 GB 512 MB 2020
SSD-C4,125 390K Mfr. C 144/QLC 512 GB DRAM-less 2022
SSD-D6,900 800K Mfr. A 128/TLC 512 GB 512 MB 2020
SSD-E7,300 450K Mfr. D 176/TLC 500 GB 512 MB 2021
SSD-F4,700 N/A Mfr. D 232/TLC 500 GB DRAM-less 2022
SSD-G7,000 960K Mfr. E 176/TLC 500 GB 512 MB 2022
SSD-H7,000 750K Mfr. F 112/TLC 512 GB 512 MB 2022
SSD-I4,200 400K Mfr. D 176/QLC 512 GB DRAM-less 2022
SSD-J7,200 800K Mfr. D 232/TLC 500 GB 512 MB 2023
SSD-K7,000 400K Mfr. D 176/TLC 500 GB 512 MB 2021
SSD-L7,000 540K Mfr. D 176/TLC 512 GB 512 MB 2022
SSD-M7,000 960K Mfr. E 176/TLC 512 GB 512 MB 2022
SSD-N6,300 567K Mfr. G 232/QLC 512 GB DRAM-less 2023
SSD-O6,600 360K Mfr. D 176/TLC 512 GB 1 GB 2021
SSD Testing Setup.We set up our test environment using eight Linux machines, each containing
an Intel i9-14900K CPU [110], four 16-GB DDR4-3200 MHz DRAM modules, and a 4-TB Samsung
990 Pro SSD [71]. We run FIO benchmark tool [111] to issue I/O requests to the tested SSDs while
collecting log data for every 100 ms using the main storage device.1 While running FIO, we (i) enable
a direct I/O option to bypass the host memory buffer when accessing tested SSDs and (ii) use
the libaio I/O engine to saturate SSD performance. To avoid potential interference, we evaluate
only one SSD at a time on each machine. We check S.M.A.R.T. logs [112–114] to obtain internal
information of tested SSDs, such as their remaining lifetime and operating temperature. Each
SSD is installed with a heat sink to minimize thermal throttling, allowing the SSD to operate at a
stable temperature range of 40–75◦C, belowWarning Temperature Threshold(85 ◦C) specified by
the S.M.A.R.T. attribute. We do not observe any temperature-induced throttling when using a heat
sink, which can otherwise occur when running experiments without one.
4.2 Testing Methodology
SSD Preconditioning.We precondition all SSDs for each read-disturbance test in three steps to
avoid potential distortions caused by any factor other than read disturbance. First, we issue TRIM
commands to the entire logical block address (LBA) range to minimize possible variations in data
layout and garbage collection. Second, we fill up 90% of SSD logical capacity, a host-visible LBA
space which excludes over-provisioned area and metadata, by sequentially writing 450 GB of data
starting from LBA 0. Doing so ensures that the read data has been programmed in TLC/QLC blocks
rather than in the SLC buffer [ 115, 116]. Third, we give a 30-minute idle time before each test,
which provides sufficient time for SSDs to perform internal tasks such as garbage collection and
SLC-buffer flush as they need.
Read-Disturbance Test.We analyze the performance impact of read disturbance in the 15 SSDs
while varying access patterns and SSD-lifetime stages. We accumulate read disturbance to SSDs
under sequential- and random-read workloads generated from FIO with the configurations widely
used for SSD-performance specification [117]: (i) queue depths (QD) of 32 and 128, (ii) I/O sizes of
1 MiB and 4 KiB, and (iii) thread counts of 1 and 16, respectively. We expect this configuration to
1We set the logging interval to 100 ms to reduce the log file size, which we verify is sufficient to capture all performance
patterns observed at shorter intervals (e.g., 5 ms).

10:8 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
be sufficient to fully saturate the NAND flash chips, thus minimizing performance impacts from
plane-level load imbalance. We perform tests while varying the consecutive LBA range to be read,
referred to asread range, from 64 MB to 50 GB; we read the middle of the 450-GB preconditioned data
(e.g., 50-GB reads starting at a 200-GB offset) to avoid reading data in the SLC buffer. This is because
we observe that some tested SSDs retain either the oldest or the newest data in the SLC buffer
even after long idle times. Reading such data yields artificially high performance, which hinders
characterizations of common and worst-case scenarios. All read requests complete successfully
without errors in all tests, i.e., no data corruption occurs, as explained in §2.3.
We evaluate SSDs under three lifetime stages, early, middle, and late, each corresponding to 0%,
50%, and 80% of their lifetime usage, respectively. This is motivated by prior findings that read
disturbance becomes more severe with higher program/erase (P/E) cycles [8, 118]. Touniformly
increase P/E-cycle counts (PEC), we repeat sequential writes to the entire LBA range of the SSDs.
We observe that some SSDs occasionally produce variations in test results. We hypothesize that
these are caused by different data layouts across tests, which is challenging to control. For such
SSDs, we repeat the tests five times or more and use the most dominant result.
5 Characterization Results
We present our characterization results on the system-level performance impact of read disturbance
in modern SSDs, introducing eleven new observations and five key takeaways.
5.1 Impact of Access Patterns
We first analyze how read disturbance affects SSD performance under sequential and random reads.
Sequential-Read Pattern.Fig. 3 shows the performance of the 15 SSDs during the sequential-read
test for 30,000 seconds with a read range of 1 GB at early lifetime stages. Each data point indicates
the amount of data read during one second. We also plot (i) the sequential-read performance
specified by the manufacturer and (ii) the average bandwidth actually measured during the test.
We make three key observations from Fig. 3.
Observation 1.A majority of the tested SSDs fail to match their performance specifications.
All SSDs except for SSD-F and SSD-G exhibit significantly lower performance compared to the
specification by 36.74% on average (up to 95.5% in SSD-N). SSD-E/-I/-L/-N fail to achieve half the
specified performance even at the beginning of the tests. The results suggest that (i) the specified
performance could be measured in the best-case scenario, e.g., when reading data stored in the
SLC buffer [115, 116], and (ii) an SSD may not meet its performance specification in practice even
under a sequential-read workload (which is considered best for SSD performance [42, 119–121]).
Observation 2.Most tested SSDs exhibit significant performance fluctuations consistently.
Table 2 summarizes each SSD’s performance-drop patterns, where the drop duration and period
represent the time required for an SSD to recover near-peak bandwidth and the time until the next
performance drop, respectively, since a drop occurs. All tested SSDs except for SSD-F and SSD-H
exhibit a significant gap between the peak and minimum bandwidth values. In particular, SSD-A’s
read bandwidth periodically drops to ~1 MB/s, which means that it can hardly service user reads
for one second, significantly increasing the read tail latency. The 1st-percentile (P1) bandwidth is
close to the minimum bandwidth (<20% differences) in half of the SSDs (SSD-C/-E/-G/-I/-J/-K/-M/
-N), and the 10th-percentile (P10) bandwidth is lower than the peak bandwidth by more than 30%
in SSD-C/-L/-N/-O. The results highlight the consistent performance impact of read disturbance in
modern SSDs. Such performance fluctuations, in turn, considerably degrade the average bandwidth
in most tested SSDs compared to their peak bandwidth by 22.1% on average (up to 83.8% in SSD-N).

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:9
8
04(a) SSD-A (b) SSD-B (c) SSD-C
Bandwidth	[GB/s]
Average	BWPerformance	specificationRead	BW	(per	second)
(g) SSD-G (h) SSD-H (i) SSD-I8
04
(j) SSD-J (k) SSD-K (l) SSD-L8
04
Time	[103	seconds]302010 302010 302010
(m) SSD-M (n) SSD-N (o) SSD-O8
04
8
04(d) SSD-D (e) SSD-E (f) SSD-F
Fig. 3. Sequential-read test results with 1 GB read range.
Table 2. Performance-drop patterns during the sequential read test with a read range of 1 GB.
SSD
ID
Read Bandwidth (Normalized to Peak) [MB/s] Drop Timing [seconds]
Peak Avg. Min. P1. P10. Duration Avg. Period
SSD-A6,026 5,768 (95.7%) 1 (<0.1%) 4,344 (72.1%) 5,145 (85.4%) 775–1.7K 3.9K
SSD-B5,423 5,313 (98%) 1,231 (22.7%) 4,396 (81.1%) 5,153 (95%) 2.2K>10K
SSD-C3,144 2,650 (84.3%) 1,504 (47.8%) 1,586 (50.4%) 1,929 (61.4%) 2.3K–3.5K 2.7K
SSD-D5,695 5,646 (99.1%) 1,099 (19.3%) 5,621 (98.7%) 5,636 (99%) 2–4 2.7K
SSD-E2,118 1,914 (90.4%) 346 (16.3%) 432 (20.4%) 1,883 (88.9%) 1–2 156
SSD-F4,371 4,307 (98.5%) 4,102 (93.8%) 4,286 (98.1%) 4,294 (98.2%) N/A 1 N/A1
SSD-G6,818 6,767 (99.3%) 4,674 (68.6%) 5,073 (74.4%) 6,794 (99.6%) 5–7 331
SSD-H5,761 5,649 (98.1%) 5,546 (96.3%) 5,597 (97.2%) 5,622 (97.6%) N/A 1 N/A1
SSD-I1,786 1,749 (97.9%) 1,172 (65.6%) 1,389 (77.8%) 1,739 (97.4%) 15–65 1.0K
SSD-J6,692 6,427 (96%) 3,011 (45%) 3,200 (47.8%) 6,643 (99.3%) 1–5 13
SSD-K6,531 5,611 (85.9%) 4,529 (69.3%) 4,988 (76.4%) 5,293 (81%) 12–21 672
SSD-L6,638 3,039 (45.8%) 1,456 (21.9%) 2,143 (32.3%) 2,197 (33.1%) 3–4 1.1K
SSD-M6,813 5,388 (79.1%) 3,573 (52.4%) 4,479 (65.7%) 5,207 (76.4%) 5–7 420
SSD-N1,741 282 (16.2%) 58 (3.3%) 59 (3.4%) 59 (3.4%) 1–243 37
SSD-O6,363 4,299 (67.6%) 1,084 (17%) 2,776 (43.6%) 2,821 (44.3%) N/A 2 N/A2
N/A: 1no significant drops or 2too-short drop duration and period. Values in parentheses are percentages of the peak
bandwidth for each SSD.
We observe that SSD-F and SSD-H provide stable performance during the entire test. We hy-
pothesize that those SSDs can hide the performance impact of read disturbance by efficiently
leveraging their over-provisioned internal parallelism. Most tested SSDs, including SSD -F and
SSD-H contain NAND flash chips more than enough to achieve their specified sequential-read

10:10 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
performance. This means that they can perform read-disturbance management tasks using such
extra resources without affecting the average bandwidth. Note that, however, when we extend
the test time to 1,000,000 seconds, performance drops also occur in SSD-F and SSD-H at around
45,000- and 83,000-second periods, respectively, which suggests that it is challenging to completely
eliminate the performance impact of read disturbance in modern SSDs.
Observation 3.There exist distinct performance-drop patterns observed across the tested SSDs.
We categorize the tested SSDs into two groups based on whether they attempt to maintain near-
peak performance (Type-1) or not (Type-2) using their performance-drop patterns as a proxy for
SSD-internal behavior, since analyzing exact SSD-internal behavior is practically infeasible. We
hypothesize that Type-1 SSDs (SSD-A to SSD-J) actively perform read-disturbance management
tasks, such as read reclaim and patrol reads, which cause steep yet short performance drops but
prevent long-term slowdowns. In contrast, Type-2 SSDs (SSD-K to SSD-O) appear to defer read
reclaim as much as possible while relying on other reliability-management techniques, e.g., read
retry [21] and strong ECC [22], to avoid significant increases in read tail latency. We validate our
hypothesis based on the SSD-internal statistics that can be obtained for some SSDs 2 from the
vendor-specific S.M.A.R.T. attribute. Once performance fluctuation occurs in SSD -E and SSD-J
(Type-1), theirdevice lifetime percentageandinternal flash writevalues increase by up to 1% and
516 GB, respectively, even though no user write has been issued, which strongly suggests that
the performance fluctuation is likely to be caused by read reclaim. In contrast, such attributes
never increase in SSD-K to SSD-O (Type-2) during the entire test. Note that, however, detailed
performance-drop patterns significantly vary even across SSDs using the same NAND flash chips,
e.g., SSD-E/-K/-L/-O.
To identify the root cause of the peak-performance degradation in Type -2 SSDs, we further
analyze the performance impact of read disturbance more precisely. To this end, before and after
a sequential-read test with a 1-GB read range, we profile the sequential-read bandwidth of each
32-MB region within the read range. Fig. 4 compares the read bandwidth across the 32-MB regions
before and after the sequential-read test in (a) SSD -J (Type-1) and (b) SSD -M (Type-2) at early
lifetime stages.
Before	testAfter	test249.5 250.5249.5250.5
BW	[GB/s]
8
04
LBA	[GB] LBA	[GB]250(b) SSD-M250(a) SSD-J
8
04
Fig. 4. Read bandwidth breakdown before and after test.
Observation 4.Certain parts of the read range exhibit consistently degraded performance in the
Type-2 SSDs, whereas the Type-1 SSDs maintain their peak performance across the entire read
range after the sequential-read test.
Half of the 32-MB regions in SSD-M incur 49.05% bandwidth degradation on average compared
to other regions within the 1-GB read range. We observe the same trends for all Type-2 SSDs, which
also supports our hypothesis that they rely on read retry or strong ECC rather than read reclaim or
2Most tested SSDs do not disclose their internal statistics.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:11
patrol reads. Prior work has demonstrated that some WLs are more susceptible to error sources
than other WLs [6, 7, 101]. As the RBER of suchweakerWLs increases more rapidly compared
to other WLs with the same number of page reads to the block, read disturbance can lead them
to incur read retry and long ECC decoding more easily [22, 122, 123], increasing the read latency.
As read disturbance accumulates, the fraction of WLs with long read latencies increases, which
continuously degrades read bandwidth. Read reclaim and patrol reads can avoid such bandwidth
degradation by directly reducing the RBER of read data as shown in Fig. 4(a).
Takeaway 1.Read disturbance can significantly degrade SSD performance even under sequential
reads, but its impact varies across SSDs (even those using the same NAND flash chips) depending
on read-disturbance management.
Random-Read Pattern.Fig. 5 shows the performance of the 15 SSDs during the random-read
test for 30,000 seconds with a read range of 1 GB at early lifetime stages. Each data point indicates
the number of read requests serviced during one second (IOPS). We also plot the random-read
performance specified by the manufacturer and average IOPS measured during the entire test.
We make two key observations from Fig. 5.
Average	IOPSPerformance	specificationRead	IOPS	(per	second)1
00.5(a) SSD-A (b) SSD-B (c) SSD-C
IOPS	[×106] (g) SSD-G (h) SSD-H (i) SSD-I1
00.5
(j) SSD-J (k) SSD-K (l) SSD-L1
00.5
Time	[103	seconds]302010 302010 302010
(m) SSD-M (n) SSD-N (o) SSD-O1
00.5
1
00.5(d) SSD-D (e) SSD-E (f) SSD-F
Fig. 5. Random-read test results with 1 GB read range.
Observation 5.All tested SSDs exhibit significantly lower random-read performance than the
specification, showing even larger performance gaps than in the sequential-read test.
The measured IOPS is far lower than the specification by 51.93% on average across all tested SSDs,3
which is much more severe than in the sequential-read test (36.74%). The result further supports our
3We exclude SSD-F due to its lack of random-read performance specification publicly accessible. Note that SSD-F merely
provides similar or lower IOPS compared to other DRAM-less QLC SSDs (SSD-C and SSD-I), which suggests that the actual
performance gap could be even larger with SSD-F.

10:12 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
hypothesis in Observation 1 that most SSD manufacturers determine the performance specification
in the best-case scenario. It is well known that SSDscannotdeal with small random reads as
efficiently as sequential reads due to two reasons. First, the minimum I/O unit of NAND flash
memory is a page (typically 16 KiB), so reading sub-page datacannotincrease throughput (IOPS),
merely decreasing bandwidth. Second, the independent-plane read has been recently introduced
and may not yet be adopted commonly in modern SSDs; until recently, most NAND flash chips could
perform multi-plane operationsonly whentarget pages have the same block or page offsets [ 124],
which is unlikely to hold under random reads, thereby significantly under-utilizing SSD-internal
parallelism compared to sequential reads.
Observation 6.For a majority of the tested SSDs, the performance impact of read disturbance is
less significant under random reads compared to under sequential reads.
We observe two key differences in the performance-drop patterns between the random- and
sequential-read tests. First, no Type-2 SSDs (SSD-K to SSD-O) exhibit long-term peak-performance
degradation during the random-read test, unlike during the sequential-read test. Second, a majority
of the tested SSDs (SSD-A/-B/-D/-E/-F/-H/-J/-K/-L/-O) incur less significant performance fluctuation
during the random-read test, showing smaller gaps between their peak and minimum performance
(46.5% on average) than those in the sequential-read test (59.8%). The results align with our initial
expectation; even a slight decrease in SSD-internal parallelism caused by read disturbance can
significantly affect the peak performance for sequential-read workloads compared to random-read
workloads (where the available parallelism is inherently limited). This highlights the importance of
analyzing the performance impact of read disturbance with various workloads, suggesting that
the performance impact of read disturbance demonstrated in prior work [5] (which has used only
random-read workloads) might be underrated.
Read disturbance-induced performance fluctuations can also be more severe in a few SSDs under
random-read workloads due to two reasons. First, we hypothesize that high address-translation
overhead under random-read pattern can exacerbate performance fluctuations in DRAM-less SSDs
(SSD-C/-I/-N). DRAM-less SSDs store most L2P mappings in NAND flash memory [48, 72], which
frequently incurs additional NAND-flash access for address translation, and, in turn, can amplify
the overheads of internal reliability management that require address-mapping information. Under
sequential reads, high spatial locality across accesses to L2P mappings minimizes the address-
translation overhead, but it would significantly increase under random reads. Second, we assume
that SSD-G and SSD-M heavily rely on locality-sensitive information for reliability management. For
example, several prior works have proposed to reuse near-optimal VREF levels of recently read WLs
for future reads [9, 15, 101, 125–128]. Doing so can potentially mitigate read-retry overheads for
neighboring WLs of the recently read ones that would likely have similar reliability characteristics.
Unfortunately, its effectiveness may degrade significantly under random reads due to the limited
space for tracking recently used VREF levels, thereby requiring more aggressive read-disturbance
management.
Takeaway 2.The performance impact of read disturbance is generally worse under sequential-
read workloads (which are considered best for SSD performance in a large body of work [42, 119–
121]) than under random-read workloads.
From our later analysis, we focus on sequential-read pattern rather than random-read pattern, since
read disturbance has a more significant impact on sequential-read performance.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:13
5.2 Impact of Read Ranges
To better understand the read-disturbance management in modern SSDs, we perform the sequential-
read tests while varying the read range from 64 MB to 50 GB, which would change the number
of WLs and blocks repeatedly read during the test. We assume that all tested SSDs evenly dis-
tribute incoming data across planes, which is common practice to fully leverage SSD-internal
parallelism [65, 129, 130]. If our assumption holds, narrowing the read range to 64 MB or 256 MB
limits the number of WLs repeatedly read within a block for all tested SSDs, whereas expanding
the range to 25 GB or 50 GB leads multiple blocks to be disturbed during our sequential-read tests.
Fig. 6 compares the per-second bandwidth of eight SSDs (SSD -B/-C/-D/-G/-J/-K/-L/-O) at early
lifetime stage using box-and-whisker plots. We select the eight SSDs that represent each SSD group
with the distinct characteristics and exhibit acceptable read-disturbance management overheads.
We also plot the average bandwidth during the test ( ) and outliers (×) in Fig. 6.
We make three key observations from Fig. 6.
64	MB256	MB1	GB25	GB50	GBRead	Range:
Bandwidth	[GB/s]
0
84
(a) SSD-B(b) SSD-C(c) SSD-D(d) SSD-G(e) SSD-J(f) SSD-K(g) SSD-L(h) SSD-O
Fig. 6. Read-bandwidth distribution with different read ranges.
Observation 7.Most tested SSDs show similar performance for read ranges from 64 MB to 1 GB.
Except for SSD-B and SSD-C (which will be discussed later in Observation 9), all SSDs exhibit
largely consistent average bandwidth with variations smaller than 5.08% across the 64-MB, 256-MB,
and 1-GB read ranges. In particular, the performance drop timings of SSD -G/-K/-O also hardly
change with the read range (not directly shown in Fig. 6). The results strongly suggest that these
SSDs perform read-disturbance management at theblocklevel, e.g., reclaiming a block when the
block’s read count exceeds a threshold [131–133].
Observation 8.Most tested SSDs better perform with larger read ranges, e.g., 25 GB and 50 GB.
Except for SSD-C and SSD-G (discussed later in Observation 9), all SSDs exhibit higher average
bandwidth (SSD-B/-J/-K/-L/-O) and/or less performance fluctuations (SSD-B/-D/-J/-K/-L/-O) with
the 25-GB and 50-GB read ranges compared to the small ranges. This result can be readily explained,
as distributing read requests across a larger range would reduce per-block read disturbance over the
same time window, postponing read disturbance-induced performance degradation. Note that, how-
ever, when we extend the test time up to 3,000,000 seconds, all SSDs eventually incur performance
drops even more significant than with the small read ranges, as they need to simultaneously perform
read-disturbance management tasks for more blocks, which clearly shows that read disturbance
and its management are inevitable in modern SSDs.
Observation 9.A few SSDs exhibit distinct behaviors across the read ranges from other SSDs.
Unlike other SSDs, SSD-B and SSD-C exhibit varying performance across the small (64-MB, 256-MB,
and 1-GB) read ranges (opposite to Observation 7), and the average bandwidth of SSD-C and SSD-G
significantly degrades with the larger read ranges (opposite to Observation 8). We further analyze
theseoutlierSSDs with more comprehensive comparisons of performance variations depending on

10:14 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
the read range. Fig. 7 shows the read bandwidth of (a) SSD-B, (b) SSD-C, and (c) SSD-G, during
30,000-second sequential-read tests while varying read ranges from 64 MB to 50 GB.
8
04Bandwidth	[GB/s]
Time	[103	seconds]302010 302010 302010(a) SSD-B (c) SSD-G(b) SSD-C
Read	Range:64	MB256	MB1	GB25	GB50	GB
Time	[103	seconds] Time	[103	seconds]
Fig. 7. Comparisons of sequential-read bandwidth across different read ranges in outlier SSDs.
We observe that the three outlier SSDs operate significantly differently even compared to each
other. First, SSD-B incurs more frequent performance drops with a smaller read range: four, two,
and one drop(s) with 64-MB, 256-MB, and 1-GB read ranges during the test, respectively. The result
implies that SSD-B is aware of the varying reliability impact of read disturbance within a block;
prior studies have demonstrated that reading a WL disturbs its adjacent WLs more significantly
compared to other WLs [6–8]. Repeated reads to only part of each block increase the RBER of the
read WLs more rapidly compared to the others, thereby requiring more frequent management
tasks for the WLs. We hypothesize that other SSDs perform read-disturbance managementmore
conservatively, e.g., reclaiming an entire block even when some WLs can actually endure more read
disturbance, which can minimize performance variations across the small read ranges.
Second, SSD-C performs better with smaller read ranges, stably providing high bandwidth. In
fact, SSD-C exhibitsuniqueperformance-drop patterns during the 1-GB sequential-read test; its
bandwidth graduallyincreases from the beginningof the test until a drop occurs, whereas all other
SSDs provide their peak bandwidth initially. We hypothesize that SSD-C progressively migrates
frequently read pages to MLC/TLC regions, allowing the pages to provide higher read performance
and endure more read disturbance than QLC pages. This would be effective for small read ranges,
but it can cause frequent garbage collections due to migration, providing diminishing returns with
larger read ranges as shown in Fig. 7(b).
Third, like most other SSDs, SSD -G incurs less frequent performance drops with the 25-GB
and 50-GB read ranges compared to the smaller ranges,but only during the first halfof the test;
its performance fluctuation becomes more severe with the large ranges as the test continues.
In particular, with the 50-GB read range, significant and periodic performance drops continue
after around 16,000 seconds until the end of the test, where the read bandwidth fluctuates from
6.8 GB/s (sustained for 4–5 seconds) to 3.2 GB/s (for 5–7 seconds). During each drop period (i.e., 9–
12 seconds), SSD-G reads almost the same amount of data as the read range (i.e., 50 GB), and we
confirm that specific regions consistently exhibit degraded bandwidth, similarly to Observation 4.
We hypothesize that SSD-G periodically performs patrol reads to track the near-optimal VREF levels
of stored pages to avoid read retry for future reads. Unfortunately, it is challenging to store the near-
optimal VREF levels for every page due to the memory constraints, which limits the effectiveness of
patrol reads when a large number of pages are continuously read.
Takeaway 3.Even though various read-disturbance management techniques are employed across
tested SSDs, there is no ultimate technique that operates optimally in all situations.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:15
5.3 Impact of PEC
We analyze how the performance impact of read disturbance changes depending on the SSD-lifetime
stage, i.e., the average PEC across blocks. To this end, we repeat the sequential-read tests with
a 1-GB read range for eight SSDs at their middle ( >50%) and late ( >80%) lifetime stages. Fig. 8
compares the minimum, average, and maximum read-bandwidth values under the three lifetime
stages (early:<20% of SSD lifetime).
MaxAvgMinLifetime	stage:EarlyMiddleLate8
0
4Bandwidth	[GB/s]SSD-BSSD-CSSD-DSSD-GSSD-JSSD-KSSD-LSSD-O
Fig. 8. Read bandwidth at different device lifetime stages.
Observation 10.Read bandwidth generally decreases at later lifetime stages in all tested SSDs,
but the degree of performance degradation varies across the SSDs.
At the middle/late lifetime stages, most tested SSDs exhibit lower (i) average read bandwidth
(by 11.2%/15.5% on average across SSD -C/-G/-J/-K/-L/-O) and/or (ii) minimum bandwidth (by
41.4%/54.5% on average across SSD-B/-C/-G/-K/-L), incurring more severe performance fluctuations
than at the early stage. We also observe that the performance-drop patterns remain largely the
same across the various SSD lifetime stages. Given their consistent peak bandwidth across lifetime
stages, this result clearly shows that the performance impact of read disturbance increases with PEC.
Interestingly, SSD-D and SSD-O provide similar performance regardless of their ages. We assume
that these SSDs may (i) sustain the reliability of stored data by programming an aged block more
precisely (e.g., programming data with wider VTH margins can significantly enhance the data’s
reliability, but at the cost of increased program latency [134–138]), (ii) perform read-disturbance
management conservatively even at early lifetime stages, or (iii) manufacturers conservatively set
the PEC limit (i.e., SSD lifetime) before errors can significantly affect SSD performance.
Takeaway 4.The performance impact of read disturbance increases with PEC in general, but
proactive and conservative reliability management can mitigate such an effect.
5.4 Impact of SSD Idle Time
We analyze how the performance impact of read disturbance changes in the presence of SSD idle
times that can potentially be leveraged for SSD-internal management tasks. To this end, we repeat
the same sequential-read test for all 15 SSDs while providing SSD idle times by issuing no I/O
requests for a certain amount of time. Fig. 9 shows the read bandwidth of (a) SSD-B, (b) SSD-J, (c)
SSD-K, and (d) SSD-L, when 6-hour idle time (vertical dotted lines) is given for every 10,000 seconds
during the sequential-read test for 30,000 seconds with a 1-GB read range.
Observation 11.Most tested SSDs show largely consistent performance-drop patterns even in
the presence of long (six hours) SSD idle times.

10:16 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
Bandwidth	[GB/s]
Time	[103	seconds]
 302010
(b) SSD-J 302010
(c) SSD-K
8
04
(a) SSD-B302010
Idle	Time	(6	hours)
302010
(d) SSD-LTime	[103	seconds]Time	[103	seconds]Time	[103	seconds]
Fig. 9. Sequential-read test results with idle times.
SSD idle times hardly change the performance-drop patterns of SSD-B/-J/-K/-L; all four SSDs fail to
recover or maintain the initial read bandwidth after long idle times. We observe similar trends for
all tested SSDs, which clearly shows that they performnobackground SSD-internal management
tasks for read disturbance. Doing so leaves the SSDs suffering from performance degradation due
to read disturbance, but can avoid other issues potentially caused by background tasks, such as
(i) delaying future user I/Os, (ii) consuming additional energy, and (iii) increasing P/E cycles.
Takeaway 5.Many modern SSDs donotproactively perform read-disturbance management
using idle times, contrary to the common assumption that idle times would be utilized for various
internal tasks [4, 9, 53, 59, 139–141].
6 Case Study: SSD-Performance Attacks
To emphasize the system-level performance impact of read disturbance, we showcase a new possible
SSD-performance attack. Our key idea is to deliberately amplify read-disturbance management
overheads, enabling an adversary to timely degrade the I/O performance of co-running applications
that share the same SSD. We hypothesize that such a performance attack would be highly feasible,
as commodity SSDsequallyschedule the I/O requests from different processes, regardless of the
SSD-internal management overheads for each process [63, 112, 142, 143]; if an adversary maliciously
exacerbates performance overheads, it would also affect the I/O performance of benign applications
sharing the same SSD. There could be other ways simpler and/or more effective to degrade the I/O
performance of co-running applications, e.g., issuing massive I/Os with more processes [144–148]
or incurring garbage collection frequently via consistent writes [63, 148–150], but this work is the
first to experimentally demonstrate that read disturbance can also be exploited for a storage-related
denial-of-service(DoS) attack on commodity SSDs.
6.1 Attack Model
We assume an adversary only with user-level access to the same SSD as target applications, but
no capability to modify SSD firmware or escalate host-system privileges. We also assume that the
host system limits the adversary’s SSD access in three aspects. First, to ensure data privacy, the
host dedicates an exclusive LBA range of the shared SSD to each user, e.g., mounting multiple file
systems on the SSD, which can avoid the adversary’s direct access to any data of target applications.
Second, for performance isolation, the host limits the number of CPU cores available for each user,
preventing the adversary from issuing excessive I/Os than other users. Third, to avoid premature
SSD wear-out, the host restricts each user’s write traffic, hindering write-based SSD-performance
attacks. For example, when an SSD supports 14,016 TBW (terabytes written) in total with a 5-year
warranty [151], the maximum write rate to the SSD is limited to 91 MB/s.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:17
We assume that the adversary can meet the following two key requirements for successfully
performing our proposed attack. First, the attacker can accurately measure the performance of I/O
requests in their LBA space, which is necessary to prepare the attack. Second, the attacker can
detect the execution of the target application to timely trigger the attack.
6.2 Attack Patterns
Based on our observations in §5, we devise two attack patterns, both of which consist of two
phases: (i)preparationand (ii)degradation. In general, both attacks accumulate read-disturbance
to NAND flash blocks during the preparation phase to exaggerate the performance overheads
of read-disturbance management techniques inside the SSD during the degradation phase. We
aim to maximize performance degradation during the degradation phase while minimizing the
time required for the preparation phase. Fig. 10 presents the high-level overview of the two attack
patterns, called (a)Charge-and-Burst(CAB) and (b)Weak-Spot Focus(WSF), respectively.
LBA	Range	of	Adversary
(a) Charge-and-BurstTime
C1MCC2MC…Cn……READ	C1C2Cn C2CnC11 2 ……READ	RW1 3RW
(b) Weak-Spot FocusTimeIdentify	WLBA	Range	of	Adversary
READ	W2……
Fig. 10. Overview of two attack patterns.
Charge-and-Burst Pattern.The key idea of CAB is toconcentratethe periodic performance drops
observed in our sequential-read test into a short time window. To this end, we 1 first accumulate
(i.e.,charge up) read disturbance to multiple chunks (e.g., C 𝑘 in Fig. 10(a)) during the preparation
phase, by repeating sequential reads on each chunk (one after the other) untilright beforea
performance drop occurs. During the degradation phase, we 2 again repeat per-chunk sequential
reads until a significant performance drop occurs and move to the next chunk immediately once
the drop is over, whichburstsperformance drops with short intervals.
For CAB-based attacks, it is crucial to timely terminate the preparation phase for each chunk; early
termination defers a performance drop during the degradation phase, whereas late termination can
cause a premature drop during the preparation phase. To address this, we employ two termination
policies for the preparation phase; (i) if an SSD exhibits long drop durations (e.g., SSD-A and SSD
-B), we stop the preparation phase of each chunk upon aslightperformance drop; (ii) otherwise,
we limit the preparation-phase time to the minimum drop period observed in our profiling. To
further reduce premature drops, we also reserve a margin after each chunk (e.g., MC in Fig. 10(a)),
which is large enough to prevent different chunks from being stored in the same NAND flash block.
Doing so ensures that reading a WL disturbs only one chunk’s data, thereby avoiding unintended
performance drops at C𝑘 while reading C𝑘+1 during the preparation phase.
Weak-Spot Focus Pattern.The key idea of Weak-Spot Focus (WSF) is tosustainsignificant
performance drop by reading only aweak spot, i.e., a data region that causes higher reliability-
management overhead than other regions (as in Observation 4). To this end, during the preparation
phase, we 1 accumulate read disturbance by sequentially reading a large range of data (e.g., R in
Fig. 10(b)) until identifying a weak spot that incurs performance drops (e.g., W in Fig. 10(b)). We
then 2 concentrate sequential reads on the weak spot to accelerate read-disturbance accumulation.
Once the read bandwidth degrades sufficiently, we 3 repeat sequential reads only to the weak spot
during the degradation phase.

10:18 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
6.3 Evaluation
Methodology.Fig. 11 shows the high-level overview of our methodology to evaluate the effec-
tiveness of the proposed attacks when two processes, attacker and victim, share the same SSD.
Each of the two processes has access only to a contiguous and non-overlapping LBA range of the
SSD (e.g., LA and LV in Fig. 11). To avoid unintended read disturbance to the victim’s data due to
reading of the attacker’s data, we set a margin (e.g., ML in Fig. 11) between the two LBA ranges.
The attacker first 1 enters the preparation phase, accumulating read disturbance by repeating
sequential reads throughout its LBA range. Once the attacker detects 2 the victim’s execution, it
3 triggers the degradation phase.
2Victim	Execution3Degradation	Phase
1Preparation	Phase…LA ML L	V …
AttackerDetect
Fig. 11. Overview of proposed SSD-performance attack.
We adaptively use the CAB and WSF patterns depending on the target SSD’s performance-drop
characteristics as in Observation 3. We use the CAB pattern for SSDs that exhibit steep and periodic
performance drops (SSD-A/-B/-D/-G/-J/-M) and the WSF pattern for SSDs that show consistent
performance degradation over time in certain regions (SSD-G/-K/-L/-M). We identify that SSD-G
and SSD-M meet both conditions, which allows us to use acombinedpattern; we first profile weak
spots throughout a large LBA region and use them as candidate data chunks for a CAB-based attack.
Table 3 summarizes the sizes of data chunks and ranges used in our evaluation of SSD-performance
attacks. Note that the parameters used in our evaluation maynotbe optimal, as our goal in this case
study is to emphasize the importance of better read-disturbance management in modern storage
systems, butnotto develop or optimize the attacks themselves for practical deployment.
Table 3. Summary of the parameters for the proposed SSD-performance attacks.
Terminology Definition Size
LA/LV LBA ranges of attacker/victim 150 GiB
ML Margin between LA/LV 50 GiB
C1–C5 Five data chunks used for CAB 32 MiB
MC Margin between C𝑘 and C𝑘+1 5 GiB
R Large data range used for WSF 50 GiB
W Weak spot used for WSF 32 MiB
Evaluation Results.To evaluate the effectiveness of our SSD-performance attacks, we compare
the victim’s read bandwidth under two execution scenarios: co-running with (i) the attacker and
(ii) another benign process. Both the victim and benign processes sequentially read their exclusive
LBA range (150 GiB) at the pristine state, i.e., no read disturbance accumulated. To assess the
proposed attack’s timeliness, we separate its preparation and degradation phases with an SSD idle
time (> 1 hour). Fig. 12 shows the most representative results for (a) CAB-based attack (SSD-D),
(b) WSF-based attack (SSD-L), and (c) combined attack (SSD-G) from our evaluation of all 15 tested
SSDs at their late lifetime stages. We repeat each experiment three times and confirm that the

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:19
proposed performance attacks successfully and considerably degrade the victim’s read bandwidth
in most tested SSDs: SSD -A/-B/-D/-G/-J/-M (CAB), SSD-G/-K/-L/-M/-O (WSF), and SSD -G/-M
(combined).
90Time	[seconds]3060
Bandwidth	[GB/s]
4
02
(a) SSD-D 1,2003,600Time	[seconds] SSD-L
BenignVictim	(w/	Attacker)AttackerVictim	(w/	Benign)
306090Time	[seconds]
CAB
(c) SSD-G
WSF
1202,400
Fig. 12. Read bandwidth depending on co-running processes.
Observation 12.Both our CAB- and WSF-based attacks can significantly degrade the I/O perfor-
mance of the victim process, requiring neither reading the victim’s data nor issuing writes.
As shown in Fig. 12(a), the CAB-based attack on SSD-D causes significant performance drops five
times (i.e., at all chunks C1 to C5) within 90 seconds, each degrading the victim’s read bandwidth
by 74.8% for 3 seconds on average. Given that the average drop period observed during our entire
sequential-read tests on SSD-D is >2,000 seconds, the result clearly demonstrates the CAB-based
attack’s capability to burst performance drops. It is possible to induce more performance drops by
using more chunks, but this comes at the cost of longer preparation phase.
The WSF-based attack also significantly affects the victim’s I/O performance, but in a different
way from the CAB-based attack. As shown in Fig. 12(b), the attack on SSD-L consistentlydegrades
the read bandwidth of the victim process by 54.2% on average during the entire degradation phase
that we limit to 3,600 seconds. We expect that the WSF-based attack can affect the victim’s I/O
performance even for several hours regardless of idle time, given that all Type -2 SSDs cannot
recover the read bandwidth of weak spots during the sequential-read test for 30,000 seconds.
Observation 13.The CAB and WSF patterns can be synergistically combined to devise a more
severe SSD-performance attack that further degrades the victim’s I/O performance.
As shown in Fig. 12(c), using the weak spots prepared by the WSF pattern enables the attacker
process to limit the victim’s read bandwidth to around 2 GB/s (40.9% lower than the no-attack
baseline) during the degradation phase. In the meantime, the attacker also successfully causes
further performance drops by 70.4% at all five weak spots with the CAB pattern. Note that the
attacker can skip the WSF pattern’s preparation phase for future combined attacks as long as the
used weak spots remain degraded (≥30,000 seconds in our sequential-read test).
Observation 14.Two concurrent processes show almostidenticalperformance in all three SSDs.
As shown in Fig. 12, the victim’s read bandwidth closely tracks that of the concurrently running
process (attacker or benign) with minimal deviation. We observe the same trend in all 15 tested
SSDs, which validates our hypothesis; the common I/O-scheduling policy in modern SSDs makes
our proposed performance attacks highly feasible byunfairlyforcing the victim process to suffer
half of the attacker-induced slowdown.

10:20 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
Takeaway 6.Under the common I/O-scheduling policy in modern SSDs, an application’s I/O
performance can degrade when it shares the same SSD with other read-intensive applications,
much more significantly than expected.
7 Macro-Benchmark Evaluation
Although our primary goal in this work is to analyze the system-level performance impact of read
disturbancewhen it is substantial(e.g., under heavily read-dominant workloads), we also evaluate
read–write mixed macro-benchmarks to understand the impact in more general cases.
7.1 Methodology
Workloads.We use theweb serverandvideo serverworkloads from the FileBench benchmark
tool [152] with the direct I/O option, both maintaining separate file sets for read and write operations.
Theweb serverworkload consists of multiple threads, each of which randomly reads several files
from the data-file set and then appends data to a single shared log file. Thevideo serverworkload
comprises two types of threads: (i) multiple reader threads, which randomly read files from the
active file set, and (ii) a single writer thread, which periodically deletes a file from the passive file
set and writes a new file to it.
Table 4 summarizes the key characteristics of the workloads used in our evaluation. We adjust
each workload to vary the read-write ratio by configuring (i) the number of files read per log update
to five (write-heavy) and ten (read-heavy) forweb serverand (ii) the file-replacement interval to
one second (write-heavy) and ten seconds (read-heavy) forvideo server. The defaultweb server
workload monotonically increases the log file’s size, quickly exhausting the entire SSD capacity
and thus preventing long-term evaluation. To address this, we introduce a log-backup process that
truncates the entire log file after copying it to another storage device periodically (every 15 and 20
minutes for write-heavy and read-heavy workloads, respectively).
Table 4. FileBench workload characteristics.
Workload File
set type
Average
file size
Number
of files
I/O sizes Number of
threads
Read/Write
ratioRead Write
Web Server Data 16 KB 65,536 16 KB – 100 WH1: 5:1
RH2: 10:1Log 1 – 16 KB
Video Server Active 1 GB 10 1 MB – 33 WH: 4.6–40:1
RH: 33–44:1Passive 432 – 1 MB 1
1WH: Write-heavy, 2RH: Read-heavy.
Preconditioning.We precondition both the file system and SSD before each FileBench experiment
in three steps to reduce potential distortions caused by previous device and file system states. First,
we delete all files under the target mount point to reset the file-system namespace. Second, we
issue a TRIM command to the mount point to inform the SSD of invalidated LBAs via the fstrim
command. Third, we disable address space layout randomization (ASLR), as some SSDs do not
operate reliably under randomized memory layouts during FileBench test. All experiments run on
the ext4 file system, and we monitor SSD performance using the Linuxiostattool.
7.2 Evaluation Results
Fig. 13 shows the read and write bandwidth of (a) SSD-B, (b) SSD-C, (c) SSD-J, (d) SSD-L, and (e) SSD
-M during FileBench test for 30,000 seconds. For thevideo serverworkloads, we denote the actual

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:21
read-write ratio (R/W), which varies depending on the SSD’s request scheduling policy; unlike in
web serverwhere each thread performs both read and write operations, threads invideo server
perform either read or write operations only, so the amounts of reads and writes actually performed
highly depend on how the SSD schedules I/Os from different threads. Note that most tested SSDs
exhibit periodic read-bandwidth spike inweb server, which occurs during the log-backup process,
i.e., sequential reading of the entire log filewithoutread disturbance or write-induced interference.
Video Server (RH, R/W: 44.7)5
02.5
Video Server (WH, R/W: 27.2)5
02.5
Web Server (RH)5
02.5
Web Server (WH)5
02.5Bandwidth		[GB/s]Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30(a) SSD-B
 Video Server (RH, R/W: 45.5)5
02.5
Video Server (WH, R/W: 39.8)5
02.5
Web Server (RH)5
02.5
Web Server (WH)5
02.5Bandwidth		[GB/s]Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30(b) SSD-C
 Video Server (RH, R/W: 39.6)5
02.5
Video Server (WH, R/W: 29.4)5
02.5
Web Server (RH)5
02.5
Web Server (WH)5
02.5Bandwidth		[GB/s]Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30(c) SSD-J
 Video Server (RH, R/W: 42.4)5
02.5
Video Server (WH, R/W: 30)5
02.5
Web Server (RH)5
02.5
Web Server (WH)5
02.5Bandwidth		[GB/s]Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30(d) SSD-L
 Video Server (RH, R/W: 30.6)5
02.5
Video Server (WH, R/W: 4.6)5
02.5
Web Server (RH)5
02.5
Web Server (WH)5
02.5Bandwidth		[GB/s]Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30Time	[103	seconds]2010 30(e) SSD-M
Write	BandwidthRead	Bandwidth
Fig. 13. FileBench test results.
Observation 15.In many cases, the performance impact of read disturbance becomes less severe
under read-write mixed workloads compared to read-only workloads.
SSD-B exhibits only a single severe performance drop that we suspect is caused by read disturbance,
i.e., near-zero read-bandwidth lasting 2 seconds at 21,236 seconds under the read-heavyweb server
workload, which is too infrequent to be attributed to garbage collection. Under all FileBench
workloads, SSD-J does not exhibit the significant performance fluctuations observed under the read-
only workloads. Similarly, under theweb serverworkloads issuing a number of small random reads,

10:22 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
SSD-L and SSD-M do not experience the performance fluctuations observed under the random-read
tests (cf. Figs. 5(l) and 5(m)).
The results are largely expected and can be readily explained by the fact that writes are well
known to affect SSD performance more severely than reads, due to the long program latency of
NAND flash memory and various write-related FTL tasks, such as garbage collections and wear
leveling. Write-induced degradation of overall I/O bandwidth can decrease the performance impact
of read disturbance in two ways. First, the substantial performance impact of writes dominates
overall SSD performance, thereby making the relative impact of read disturbance less pronounced.
Second, it slows down the accumulation of read disturbance, which, in turn, reduces the frequency
of read-disturbance-induced reliability management tasks.
Observation 16.In some SSDs, read disturbance can have a non-trivial impact on I/O performance
under read-write mixed workloads.
We observe that SSD-C exhibits consistent peak-performance degradation under all FileBench
workloads, unlike the behavior we observe under read-only workloads, where it can periodically
recover its peak bandwidth (cf. Figs. 3(c) and 5(c)). In particular, significant performance fluctuations
occur after 20,000 seconds under thevideo serverworkloads, which are also not observed under any
read-only workloads. As explained in §5.2 (Observation 9), we hypothesize that SSD-C proactively
migrates read-hot data to other physical blocks; unfortunately, such migration becomes difficult
in the presence of user writes, causing accumulated read disturbance to consistently affect SSD
performance. We also observe continuous performance drops over time in SSD-L and SSD-M under
thevideo serverworkloads, similarly under sequential read workloads (cf. Figs. 3(l) and 3(m)).
Under the read-heavy (write-heavy)video serverworkload, SSD -L and SSD-M exhibit considerable
read-bandwidth reductions of 55.9% (57.8%) and 22.5% (19.8%), respectively, when comparing the
last five minutes to the first five minutes. Note that the performance drops in SSD-L and SSD-M
undervideo serverdiffer from those observed in SSD -B/-J/-L/-M underweb server. We attribute
the performance drops underweb serverto SLC-buffer flushes, as the workloads initially write
only a limited amount of data (≈1 GB). In contrast, thevideo serverworkloads rapidly exhaust the
SLC buffer at the beginning by sequentially writing the large passive file set, making it plausible
that read disturbance is the root cause of the continuous performance drops.
Takeaway 7.The performance impact of read disturbance is generally reduced in the presence
of write requests, but read disturbance can still introduce non-trivial performance degradation in
some operating scenarios (SSDs and workloads).
8 Implications
Our observations made in §5 and §6 can guide host- and SSD-side future improvements for modern
storage systems to enhance I/O performance for read-intensive applications. We leave the develop-
ment of new techniques for such improvements to future work, which can benefit from not only
our guidance but also observations that we make on the behavior of read-disturbance management
techniques applied in commodity SSDs (e.g., for developing a more accurate SSD simulator that
can model more realistic SSD performance).
8.1 Host-Side Improvements
Our characterization study can help system designers and application developers improve the I/O
performance of their systems and applications, respectively, in two ways.
Better Understanding of System I/O Performance.Observations 1 to 5 demonstrate that
theactualSSD performance under read disturbance varies across SSDs and differs from vendor

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:23
specifications. A deeper understanding of such actual performance characteristics can allow more
efficient system and application design in two ways. First, system designers can better provision
storage resources to meet their performance requirements at minimal cost, selecting the appropriate
SSD model and quantity to ensure that storage systems offer the desired performance under the
expected read patterns of critical applications. Second, application developers can better coordinate
tightly coupled compute and data-access tasks. For example, a large language model (LLM) inference
framework that relies on timely I/O prefetching [119, 153, 154] can achieve higher effectiveness
through precise pipelining based on more accurate performance estimation.
Host-SSD Interaction for Better Read-Disturbance Management.Observations 4, 11, and 12
show that read disturbance-induced I/O slowdown may remain indefinitely even with sufficient
SSD idle times. To recover I/O performance for critical data, an application itself needs to rewrite
the data (after reading it) to the SSD. Even though the application can accurately determine the
timing and target data for read reclaim, such application-managed read-disturbance management
can cause non-trivial inefficiencies due to costly host-SSD data movements. Such inefficiencies can
be addressed by introducing anew storage interfacethat enables the host to proactively trigger
read reclaim on target data, similarly to NVMe I/O determinism (IOD) [155]. Currently, IOD allows
the host to temporarily forbid SSD-internal management tasks, but it offers no mechanism for the
host to proactively trigger those tasks or specify their target data. We expect that the development
of such an interface can accurately inform SSDs of when read reclaim is needed and be further
extended to allow the host to specify data to be stored in a more reliable region which is less
susceptible to read disturbance (e.g., SLC/MLC blocks or robust WLs that provide better reliability).
8.2 SSD-Side Improvements
Our characterization study can be used in four ways for developing efficient FTL algorithms to
better manage read disturbance inside SSDs.
Proactive Read-Disturbance Management.Observations 3, 9, and 10 highlight the importance
of proactive read-disturbance management. As observed, excessive delay of read reclaim can rather
cause significant long-term performance degradation or severe performance fluctuation when
multiple blocks require read reclaim simultaneously, contrary to common practice of deferring
read reclaim until truly necessary to minimize its high impact on application performance [ 5].
In particular, the effectiveness of proactive management can be further improved by taking into
account the lifetime of blocks; increasing proactivity for aged blocks can effectively mitigate
read-retry and ECC overheads that worsen at high PEC.
Mitigating Performance Fluctuation due to Read-Disturbance Management.Observa-
tions 3, 11, and 12 suggest three directions to avoid severe performance drops due to proactive
read-disturbance management. First, we can minimize the performance impact of proactive man-
agement by efficiently utilizing over-provisioned parallelism while prioritizing user I/Os. Second,
leveraging SSD idle time can possibly eliminate user-experienced performance drops. Third, read-
disturbance management should be performed in aprogressivemanner, i.e., reclaiming a few blocks
preemptively rather than reclaiming a number of blocks at once.
Adaptive Read-Disturbance Management.Observations 6 and 9 suggest that read-disturbance
management should take workload I/O patterns into account in two aspects. First, read reclaim
should be prioritized for data accessed sequentially over data referenced randomly since read
disturbance has less impact under random reads compared to sequential reads. Second, promoting
read-intensive datato SLC or MLC regions, which are less susceptible to read disturbance, can
effectively mitigate the performance overhead of read-disturbance management. Such promotion
must be performed carefully, as it involves substantial data movements across different regions,
which can negatively affect SSD performance as shown in Fig. 7 (b).

10:24 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
Read Disturbance-Aware Internal I/O Scheduling.Observations 12 to 14 suggest that the SSD
controller should isolate internal I/O traffic related to read-disturbance management to minimize
their interference with other processes. Most SSDs prioritize fairness by equally scheduling I/O
requests from concurrently running processes, without distinguishing read disturbance-related
reads and writes. As a result, I/O requests from other users are often delayed, leading to significant
performance degradation. For better performance isolation, the FTL should be able to track the
processes that trigger read-disturbance management and impose such overheads only on the
corresponding processes.
9 Related Work
To our knowledge, this work is the first to rigorously characterize the system-level performance
impact of read disturbance in modern SSDs under various operating conditions, which introduces
new observations and takeaways related to read-disturbance management techniques, e.g., their
impact depending on workloads, idle times, and co-running processes. We provide a brief review
of prior studies on read-disturbance characterization and mitigation.
Read-Disturbance Characterization.In addition to the prior work [ 5] that we already discussed
in §3, many other previous studies have also investigated the reliability impact of read disturbance in
NAND flash memory under various multi-leveling techniques, including MLC [9], TLC [8, 10, 156],
and QLC [157]. Although these studies conduct extensive analyses of read disturbance, their scope
is limited to the device level rather than the system level. In contrast, our work characterizes the
system-level performance impact of read disturbance, providing deeper insights for designing both
host systems and SSD architectures to develop more effective read-disturbance management.
Read-Disturbance Mitigation.Prior studies [ 4, 9] have proposed device-level techniques to
mitigate the reliability impact of read disturbance. Cai et al. [9] propose a new page-read mechanism
of NAND flash memory that uses a lower V PASS level to reduce the V TH shift caused by read
disturbance. Even though the lower VPASS level slightly increases RBER for the highest VTH state
(e.g., P7 in TLC NAND flash memory), its benefit (i.e., reducing read disturbance) outweighs the cost,
thereby leading to an overall RBER improvement. Ha et al. [4] propose to narrow the VTH window
of a block via more precise programming, allowing the use of a lower VPASS level without RBER
increases for the highest VTH state. They minimize the performance penalty of precise programming
by selectively storing only read-intensive data to more robust blocks with a narrower VTH window.
Read-Reclaim Optimization.Several prior studies [ 4, 6, 23, 133, 158] have proposed various
firmware-level techniques to mitigate the overheads of read reclaim, the reliability-management
task directly related to read disturbance. Ha et al. [4] propose a new data-placement technique that
places read-intensive data to pages that require fewer sensing operations (e.g., LSB/MSB pages in
Fig. 2), which effectively mitigates read disturbance per page read, thereby reducing read-reclaim
invocations. Zhang et al. [23] also introduce another data-placement scheme that mixes read-hot
and read-cold data within the same block to avoid concentrating reads on the specific blocks and
thus reduces read reclaims triggered by the same number of page reads. Han et al. [133] employ
different read-count thresholds for read reclaim depending on the page types, which enables a
block to service more page reads before migrating the block’s disturbed data. Two recent studies
aim to minimize data migration via more fine-grained read reclaim at low cost; Chun et al. [ 6]
leverage the Space-Saving algorithm to efficiently estimate the read disturbance accumulated to
each WL, and Lee et al. [158] optimize the patrol-read mechanism to accurately monitor the RBER
of WLs with minimal performance overheads.
Other Optimizations for Reliability-Management Techniques.A large body of prior work
has proposed various techniques to optimize read retry and ECC, which can also mitigate the

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:25
performance impact of read disturbance. First, many studies have extensively optimized the read-
retry mechanism. Shim et al. [101] propose a new read mechanism that reuses VREF levels recently
used for neighboring WLs to reduce the number of read retries, which we assume are used in
SSD-G and SSD-M. Park et al. [21] develop a new read-retry mechanism that reduces the latency
of a read-retry operation by leveraging the large ECC margin and the cache-read feature. Chun
et al. [ 22] introduce an on-die read-retry mechanism that performs read retry inside the chip
without ECC decoding, thereby significantly improving effective utilization of internal-channel
bandwidth. Ye et al. [24] try to predict optimal VREF value based on (i) page type, (ii) P/E cycles,
and (iii) retention time. Second, some studies [159–161] have proposed various ECC algorithms
and hardware decoder designs to enhance error-correction capability and decoding throughput.
Our work is aligned with these efforts but goes a step further in three key aspects. First, although
prior studies have achieved substantial improvements in mitigating the performance impact of read
disturbance, our experimental studies using commodity SSDs demonstrate that read disturbance is
a fundamental problem that is difficult to completely eliminate. Second, we identify the potential
risk of DoS attacks that exploit read disturbance as a vulnerability and experimentally demonstrate
their impact on modern SSDs, which highlights the need to develop new techniques to mitigate
performance interference caused by read disturbance in multi-tenant scenarios. Third, based on our
characterization results, we present new optimization directions at the host and interface levels.
10 Conclusion
In this study, we investigate the system-level performance impact of read disturbance in modern
SSDs, which remains largely uninvestigated by prior studies. Through extensive experiments on
15 NVMe SSDs, we demonstrate how significantly read disturbance can degrade I/O performance
and even be exploited for potential DoS attacks. Our 16 observations and 7 takeaway lessons lead
to six key directions for improving host-system and SSD-architecture design, emphasizing the
need for more integrated and proactive read-disturbance management. We hope that the novel
experimental results and insights of our study will inspire and aid future work to develop more
effective read-disturbance management techniques.
Acknowledgments
We thank our anonymous reviewers of SIGMETRICS 2026 for their valuable feedback and com-
ments. This work was supported by the National Research Foundation of Korea (RS-2023-00283799,
RS-2024-00396850, RS-2024-00415602, and RS-2025-00519994), Institute for Information & Com-
munications Technology Planning & Evaluation (RS-2024-00347394 and RS-2024-00437866), and
Samsung Electronics Co., Ltd (IO230411-05858-01). Jisung Park is the corresponding author.
References
[1] Sungdae Choi, Duckju Kim, Sungwook Choi, Byungryul Kim, Sunghyun Jung, Kichang Chun, Namkyeong Kim,
Wanseob Lee, Taisik Shin, Hyunjong Jin, Hyunchul Cho, Sunghoon Ahn, Yonghwan Hong, Ingon Yang, Byoungyoung
Kim, Pilseon Yoo, Youngdon Jung, Jinwoo Lee, Jaehyeon Shin, Taeyun Kim, Kunwoo Park, and Jinwoong Kim. A
93.4mm2 64Gb MLC NAND-Flash Memory with 16nm CMOS Technology. InProceedings of the 2014 IEEE International
Solid-State Circuits Conference (ISSCC), 2014.
[2] Wontaeck Jung, Hyunggon Kim, Do-Bin Kim, Tae-Hyun Kim, Namhee Lee, Dongjin Shin, Minyoung Kim, Youngsik
Rho, Hun-Jong Lee, Yujin Hyun, Jaeyoung Park, Taekyung Kim, Hwiwon Kim, Gyeongwon Lee, Jisang Lee, Joonsuc
Jang, Jungmin Park, Sion Kim, Su Chang Jeon, Suyong Kim, Jung-Ho Song, Min-Seok Kim, Taesung Lee, Byung-
Kwan Chun, Tongsung Kim, Young Gyu Lee, Hokil Lee, Soowoong Lee, Hwaseok Lee, Dooho Cho, Sang-Wan Nam,
Yeomyung Kim, Kunyong Yoon, Yoonjae Lee, Sunghoon Kim, Jungseok Hwang, Raehyun Song, Hyunsik Jang, Jaeick
Son, Hongsoo Jeon, Myunghun Lee, Mookyung Lee, Kisung Kim, Eungsuk Lee, Myeongwoo Lee, Sungkyu Jo, Chan Ho
Kim, Jong Chul Park, Kyunghwa Yun, Soonock Seol, Ji-Ho Cho, Seungjae Lee, Jin-Yub Lee, and Sung-Hoi Hur. A

10:26 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
280-Layer 1Tb 4b/cell 3D-NAND Flash Memory with a 28.5Gb/mm2 Areal Density and a 3.2GB/s High-Speed IO Rate.
InProceedings of the 2024 IEEE International Solid-State Circuits Conference (ISSCC), 2024.
[3] Samsung. Samsung BM1743, 2024. https://semiconductor.samsung.com/news-events/tech-blog/samsung-ushers-in-
the-ai-revolution-with-memory-and-storage-solutions-for-ultra-high-capacity-and-performance-at-fms-2024/.
[4] Keonsoo Ha, Jaeyong Jeong, and Jihong Kim. An Integrated Approach for Managing Read Disturbs in High-Density
NAND Flash Memory.IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems (TCAD), 2016.
[5] Chun-Yi Liu, Yunju Lee, Myoungsoo Jung, Mahmut Taylan Kandemir, and Wonil Choi. Prolonging 3D NAND SSD
Lifetime via Read Latency Relaxation. InProceedings of the 26th ACM International Conference on Architectural Support
for Programming Languages and Operating Systems (ASPLOS), 2021.
[6] Myoungjun Chun, Jaeyong Lee, Inhyuk Choi, Jisung Park, Myungsuk Kim, and Jihong Kim. STRAW: A Stress-Aware
WL-Based Read Disturbance Management for High-Density NAND Flash Memory. InProceedings of the 31st ACM
International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS), 2026.
[7] Qin Xiong, Fei Wu, Zhonghai Lu, Yue Zhu, You Zhou, Yibing Chu, Changsheng Xie, and Ping Huang. Characterizing
3D Floating Gate NAND Flash: Observations, Analyses, and Implications.ACM Transactions on Storage (ToS), 2018.
[8] Tiayu Ren, Qiao Li, Min Ye, and Chun Jason Xue. Read Disturb and Reliability: The Complete Story for 3D CT NAND
Flash. InProceedings of the 2023 IEEE 12th Non-Volatile Memory Systems and Applications Symposium (NVMSA), 2023.
[9] Yu Cai, Yixin Luo, Saugata Ghose, and Onur Mutlu. Read Disturb Errors in MLC NAND Flash Memory: Characteriza-
tion, Mitigation, and Recovery. InProceedings of the 45th Annual IEEE/IFIP International Conference on Dependable
Systems and Networks (DSN), 2015.
[10] Cristian Zambelli, Piero Olivo, Luca Crippa, Alessia Marelli, and Rino Micheloni. Uniform and Concentrated Read
Disturb Effects in Mid-1X TLC NAND Flash Memories for Enterprise Solid State Drives.Proceedings of the 2017 IEEE
International Reliability Physics Symposium (IRPS), 2017.
[11] Meng, Qingru. Read Disturb Management Improvement in SSDs, 2019. https://files.futurememorystorage.com/proce
edings/2019/08-07-Wednesday/20190807_TEST-202A-1_Meng.pdf.
[12] Jisung Park, Jaeyong Jeong, Sungjin Lee, Youngsun Song, and Jihong Kim. Improving Performance and Lifetime
of NAND Storage Systems Using Relaxed Program Sequence. InProceedings of the 53rd ACM/EDAC/IEEE Design
Automation Conference (DAC), 2016.
[13] Myungsuk Kim, Jaehoon Lee, Sungjin Lee, Jisung Park, and Jihong Kim. Improving Performance and Lifetime of
Large-Page NAND Storages Using Erase-Free Subpage Programming. InProceedings of the 54th ACM/EDAC/IEEE
Design Automation Conference (DAC), 2017.
[14] Yu Cai, Saugata Ghose, Yixin Luo, Ken Mai, Onur Mutlu, and Erich F. Haratsch. Vulnerabilities in MLC NAND Flash
Memory Programming: Experimental Analysis, Exploits, and Mitigation Techniques. InProceedings of the 2017 IEEE
International Symposium on High Performance Computer Architecture (HPCA), 2017.
[15] Yu Cai, Onur Mutlu, Erich F. Haratsch, and Ken Mai. Program Interference in MLC NAND Flash Memory: Characteri-
zation, Modeling, and Mitigation. InProceedings of the IEEE 31st International Conference on Computer Design (ICCD),
2013.
[16] Kyoji Mizoguchi, Tomonori Takahashi, Seiichi Aritome, and Ken Takeuchi. Data-Retention Characteristics Comparison
of 2D and 3D TLC NAND Flash Memories. In2017 IEEE International Memory Workshop (IMW). IEEE, 2017.
[17] Shaoqi Yang, Meng Zhang, Xuepeng Zhan, Peng Guo, Xiaohuan Zhao, Guangkuo Yang, Xinyi Guo, Jixuan Wu, Fei
Wu, and Jiezhi Chen. Retention accelerated testing for 3d qlc nand flash memory: Characterization, analysis, and
modeling.IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems (TCAD), 2025.
[18] Ren-Shuo Liu, Chia-Lin Yang, and Wei Wu. Optimizing NAND flash-based SSDs via retention relaxation.Target, 2012.
[19] Yixin Luo, Saugata Ghose, Yu Cai, Erich F. Haratsch, and Onur Mutlu. Improving 3D NAND Flash Memory Lifetime
by Tolerating Early Retention Loss and Process Variation.Proceedings of the ACM on Measurement and Analysis of
Computing Systems (POMACS), 2018.
[20] Robert Frickey, Joseph Doller, Robert Norton, Roman Sancho, Rakhshanda Sayyad, Dmitry Ustinov, Raymond Wang,
and Harvey Xu. Comparing the Reliability of Solid-State Drives Based on TLC and QLC NAND Flash Memories. In
Proceedings of the 2024 IEEE International Reliability Physics Symposium (IRPS). IEEE, 2024.
[21] Jisung Park, Myungsuk Kim, Myoungjun Chun, Lois Orosa, Jihong Kim, and Onur Mutlu. Reducing solid-state drive
read latency by optimizing read-retry. InProceedings of the 26th ACM International Conference on Architectural Support
for Programming Languages and Operating Systems (ASPLOS), 2021.
[22] Myoungjun Chun, Jaeyong Lee, Myungsuk Kim, Jisung Park, and Jihong Kim. RiF: Improving Read Performance
of Modern SSDs Using an On-Die Early-Retry Engine. InProceedings of the 2024 IEEE International Symposium on
High-Performance Computer Architecture (HPCA), 2024.
[23] Genxiong Zhang, Yuhui Deng, Yi Zhou, Shujie Pang, Jianhui Yue, and Yifeng Zhu. Cocktail: Mixing Data with
Different Characteristics to Reduce Read Reclaims for NAND Flash Memory.IEEE Transactions on Computer-Aided
Design of Integrated Circuits and Systems (TCAD), 2022.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:27
[24] Min Ye, Qiao Li, Yina Lv, Jie Zhang, Tianyu Ren, Daniel Wen, Tei-Wei Kuo, and Chun Jason Xue. Achieving Near-Zero
Read Retry for 3D NAND Flash Memory. InProceedings of the 29th ACM International Conference on Architectural
Support for Programming Languages and Operating Systems (ASPLOS), 2024.
[25] Samsung. Samsung 980 Pro, 500 GB, 2020. https://www.samsung.com/us/computing/memory-storage/solid-state-
drives/980-pro-pcie-4-0-nvme-ssd-500gb-mz-v8p500b-am/.
[26] Samsung. Samsung PM9A1, 512 GB, 2020. https://semiconductor.samsung.com/ssd/pc-ssd/pm9a1/.
[27] Western Digital. WD Black SN850, 500 GB, 2020. https://documents.westerndigital.com/content/dam/doc-library/en_u
s/assets/public/western-digital/product/internal-drives/wd-black-ssd/data-sheet-wd-black-sn850-nvme-ssd.pdf.
[28] Seagate. Seagate FireCuda 530, 500 GB, 2021. https://www.seagate.com/www-content/datasheets/pdfs/firecuda-530-
ssd-DS2059-1-2106US-en_US.pdf.
[29] Micron. Micron 3400, 512 GB, 2021. https://assets.micron.com/adobe/assets/urn:aaid:aem:b1ec169c-b345-4593-a2da-
3a3b2a94eca0/renditions/original/as/micron-3400-ssd-product-brief.pdf.
[30] Kingston. Kingston FURY Renegade, 512 GB, 2021. https://www.kingston.com/unitedkingdom/en/ssd/gaming/kings
ton-fury-renegade-nvme-m2-ssd.
[31] Hynix. SK Hynix Platinum P41, 500 GB, 2022. https://ssd.skhynix.com/platinum_p41/.
[32] Crucial. Crucial P3 Plus, 500 GB, 2022. https://uk.crucial.com/products/ssd/crucial-p3-plus-ssd.
[33] Micron. Micron 2400, 512 GB, 2022. https://assets.micron.com/adobe/assets/urn:aaid:aem:2573ba72-0b2a-4aa6-9a93-
c75035939bc8/renditions/original/as/2400-ssd-product-brief.pdf.
[34] Solidigm. Solidigm P41 Plus, 512 GB, 2023. https://www.solidigm.com/products/client/plus-series/p41.html#form=M
.2%202280&cap=512%20GB.
[35] HP. HP FX900 Pro, 512 GB, 2021. https://hp.biwintech.com/u_file/photo/20230822/FX900%20Pro%20Specifications.pdf.
[36] Solidigm. Solidigm P44 Pro, 512 GB, 2023. https://www.solidigm.com/products/client/pro-series/p44.html.
[37] Kioxia. Kioxia XG8, 512 GB, 2022. https://europe.kioxia.com/content/dam/kioxia/shared/business/ssd/client-
ssd/asset/productbrief/cSSD-XG8-product-brief.pdf.
[38] Crucial. Crucial T500, 500 GB, 2023. https://www.crucial.com/ssd/t500/ct500t500ssd8.
[39] HP. HP FX700, 512 GB, 2023. https://hp.biwintech.com/products/hpfx700pciem.2ssd/.
[40] Yang Hu, Hong Jiang, Dan Feng, and Lei Tian. Exploring and Exploiting the Multilevel Parallelism Inside SSDs for
Improved Performance and Endurance.IEEE Transactions on Computers (TC), 2013.
[41] Bo Mao, Suzhen Wu, and Lide Duan. Improving the SSD Performance by Exploiting Request Characteristics and
Internal Parallelism.IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems (TCAD), 2018.
[42] Nika Mansouri Ghiasi, Jisung Park, Harun Mustafa, Jeremie Kim, Ataberk Olgun, Arvid Gollwitzer, Damla Senol
Cali, Can Firtina, Haiyu Mao, Nour Almadhoun, Rachata Ausavarungnirun, Nandita Vijaykumar, Mohammed Alser,
and Onur Mutlu. GenStore: A High-Performance In-Storage Processing System for Genome Sequence Analysis.
InProceedings of the 27th ACM International Conference on Architectural Support for Programming Languages and
Operating Systems (ASPLOS), 2022.
[43] Dongku Kang, Minsu Kim, Su Chang Jeon, Wontaeck Jung, Jooyong Park, Gyosoo Choo, Dong kyo Shim, Anil Kavala,
Seung-Bum Kim, Kyung-Min Kang, Jiyoung Lee, Kuihan Ko, Hyun-Wook Park, Byung-Jun Min, Changyeon Yu,
Sewon Yun, Nahyun Kim, Yeonwook Jung, Sungwhan Seo, Sunghoon Kim, Moo Kyung Lee, Joo-Yong Park, James C.
Kim, Young San Cha, Kwangwon Kim, Youngmin Jo, Hyunjin Kim, Youngdon Choi, Jindo Byun, Ji hyun Park, Kiwon
Kim, Tae-Hong Kwon, Youngsun Min, Chiweon Yoon, Youngcho Kim, Dong-Hun Kwak, Eungsuk Lee, Wook ghee
Hahn, Ki sung Kim, Kyungmin Kim, Euisang Yoon, Won-Tae Kim, Inryoul Lee, Seung hyun Moon, Jeongdon Ihm,
Dae Seok Byeon, Ki-Whan Song, Sangjoon Hwang, and Kye Hyun Kyung. 512gb 3-bit/cell 3d 6th-generation v-nand
flash memory with 82mb/s write throughput and 1.2 gb/s interface. InProceedings of the 2019 IEEE International
Solid-State Circuits Conference (ISSCC), 2019.
[44] Tsutomu Higuchi, Takuyo Kodama, Koji Kato, Ryo Fukuda, Naoya Tokiwa, Mitsuhiro Abe, Teruo Takagiwa, Yuki
Shimizu, Junji Musha, Katsuaki Sakurai, Jumpei Sato, Tetsuaki Utsumi, Kazuhide Yoneya, Yasuhiro Suematsu, Toshi-
fumi Hashimoto, Takeshi Hioka, Kosuke Yanagidaira, Masatsugu Kojima, Junya Matsuno, Kei Shiraishi, Kensuke
Yamamoto, Shintaro Hayashi, Tomoharu Hashiguchi, Kazuko Inuzuka, Akio Sugahara, Mitsuaki Honma, Keiji Tsun-
oda, Kazumasa Yamamoto, Takahiro Sugimoto, Tomofumi Fujimura, Mizuki Kaneko, Hiroki Date, Osamu Kobayashi,
Takatoshi Minamoto, Ryoichi Tachibana, Itaru Yamaguchi, Juan Lee, Venky Ramachandra, Srinivas Rajendra, Tianyu
Tang, Siddhesh Darne, Jiwang Lee, Jason Li, Toru Miwa, Ryuji Yamashita, Hiroshi Sugawara, Naoki Ookuma, Masahiro
Kano, Hiroyuki Mizukoshi, Yuki Kuniyoshi, Mitsuyuki Watanabe, Kei Akiyama, Hirotoshi Mori, Akira Arimizu,
Yoshito Katano, Masakazu Ehama, Hiroshi Maejima, Koji Hosono, and Masahiro Yoshihara. A 1Tb 3b/cell 3D-Flash
Memory in a 170+ Word-Line-Layer Technology. InProceedings of the 2021 IEEE International Solid-State Circuits
Conference (ISSCC), 2021.
[45] Moosung Kim, Sung Won Yun, Jungjune Park, Hyun Kook Park, Jungyu Lee, Yeong Seon Kim, Daehoon Na, Sara
Choi, Youngsun Song, Jonghoon Lee, Hyunjun Yoon, Kangbin Lee, Byunghoon Jeong, Sanglok Kim, Junhong Park,

10:28 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
Cheon An Lee, Jaeyun Lee, Jisang Lee, Jin Young Chun, Joonsuc Jang, Younghwi Yang, Seung Hyun Moon, Myunghoon
Choi, Wontae Kim, Jungsoo Kim, Seokmin Yoon, Pansuk Kwak, Myunghun Lee, Raehyun Song, Sunghoon Kim,
Chiweon Yoon, Dongku Kang, Jin-Yub Lee, and Jaihyuk Song. A 1Tb 3b/Cell 8th-Generation 3D-NAND Flash Memory
with 164MB/s Write Throughput and a 2.4 Gb/s Interface. InProceedings of the 2022 IEEE International Solid-State
Circuits Conference (ISSCC), 2022.
[46] ONFI Workgroup. ONFI 5.0 Specification Sheets, 2021. https://onfi.org/files/onfi_5_0_gold.pdf.
[47] Samsung. Samsung SSD PM1743 White Paper, 2024. https://download.semiconductor.samsung.com/resources/white-
paper/PM1743_White_Paper_240510.pdf.
[48] Aayush Gupta, Youngjae Kim, and Bhuvan Urgaonkar. DFTL: A Flash Translation Layer Employing Demand-Based
Selective Caching of Page-Level Address Mappings. InProceedings of the 14th ACM International Conference on
Architectural Support for Programming Languages and Operating Systems (ASPLOS), 2009.
[49] Song Jiang, Lei Zhang, XinHao Yuan, Hao Hu, and Yu Chen. S-ftl: An efficient address translation for flash memory
by exploiting spatial locality. InProceedings of the IEEE 27th Symposium on Mass Storage Systems and Technologies
(MSST), 2011.
[50] Jinghan Sun, Shaobo Li, Yunxin Sun, Chao Sun, Dejan Vucinic, and Jian Huang. Leaftl: A Learning-Based Flash
Translation Layer for Solid-State Drives. InProceedings of the 28th ACM International Conference on Architectural
Support for Programming Languages and Operating Systems (ASPLOS), 2023.
[51] Junghee Lee, Youngjae Kim, Galen M. Shipman, Sarp Oral, and Jongman Kim. Preemptible I/O Scheduling of Garbage
Collection for Solid State Drives.IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems
(TCAD), 2013.
[52] Pan Yang, Ni Xue, Yuqi Zhang, Yangxu Zhou, Li Sun, Wenwen Chen, Zhonggang Chen, Wei Xia, Junke Li, and
Kihyoun Kwon. Reducing Garbage Collection Overhead in SSD Based on Workload Prediction. InProceedings of the
11th USENIX Workshop on Hot Topics in Storage and File Systems (HotStorage), 2019.
[53] Wonkyung Kang, Dongkun Shin, and Sungjoo Yoo. Reinforcement Learning-Assisted Garbage Collection to Mitigate
Long-Tail Latency in SSD.ACM Transactions on Embedded Computing Systems (TECS), 2017.
[54] Jiayang Guo, Yiming Hu, Bo Mao, and Suzhen Wu. Parallelism and Garbage Collection Aware I/O Scheduler with
Improved SSD Performance. InProceedings of the 2017 IEEE International Parallel and Distributed Processing Symposium
(IPDPS), 2017.
[55] Wonil Choi, Myoungsoo Jung, Mahmut Kandemir, and Chita Das. Parallelizing Garbage Collection with I/O to
Improve Flash Resource Utilization. InProceedings of the 27th International Symposium on High-Performance Parallel
and Distributed Computing (HPDC), 2018.
[56] Narges Shahidi, Mahmut T. Kandemir, Mohammad Arjomand, Chita R. Das, Myoungsoo Jung, and Anand Siva-
subramaniam. Exploring the Potentials of Parallel Garbage Collection in SSDs for Enterprise Storage Systems. In
Proceedings of the 2016 International Conference for High Performance Computing, Networking, Storage and Analysis
(SC), 2016.
[57] Wonkyung Kang and Sungjoo Yoo. Dynamic Management of Key States for Reinforcement Learning-Assisted Garbage
Collection to Reduce Long Tail Latency in SSD. InProceedings of the 55th Annual Design Automation Conference
(DAC), 2018.
[58] Jinhua Cui, Youtao Zhang, Jianhang Huang, Weiguo Wu, and Jun Yang. ShadowGC: Cooperative Garbage Collection
with Multi-level Buffer for Performance Improvement in NAND Flash-Based SSDs. InProceedings of the 2018 Design,
Automation & Test in Europe Conference & Exhibition (DATE), 2018.
[59] Junghee Lee, Youngjae Kim, Galen M. Shipman, Sarp Oral, Feiyi Wang, and Jongman Kim. A Semi-Preemptive
Garbage Collector for Solid State Drives. InProceedings of the IEEE International Symposium on Performance Analysis
of Systems and Software (ISPASS), 2011.
[60] Dharamjeet, Yi-Shen Chen, Tseng-Yi Chen, Yuan-Hung Kuan, and Yuan-Hao Chang. LLSM: A Lifetime-Aware
Wear-Leveling for LSM-Tree on NAND Flash Memory.IEEE Transactions on Computer-Aided Design of Integrated
Circuits and Systems (TCAD), 2022.
[61] Jun Li, Xiaofei Xu, Xiaoning Peng, and Jianwei Liao. Pattern-Based Write Scheduling and Read Balance-Oriented
Wear-Leveling for Solid State Drivers. InProceedings of the 2019 35th Symposium on Mass Storage Systems and
Technologies (MSST), 2019.
[62] Muthukumar Murugan and David.H.C. Du. Rejuvenator: A Static Wear Leveling Algorithm for NAND Flash Memory
with Minimized Overhead. InProceedings of the 2011 27th Symposium on Mass Storage Systems and Technologies
(MSST), 2011.
[63] Arash Tavakkol, Mohammad Sadrosadati, Saugata Ghose, Jeremie Kim, Yixin Luo, Yaohua Wang, Nika Mansouri
Ghiasi, Lois Orosa, Juan Gómez-Luna, and Onur Mutlu. FLIN: Enabling Fairness and Enhancing Performance in
Modern NVMe Solid State Drives. InProceedings of the 45th Annual International Symposium on Computer Architecture
(ISCA), 2018.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:29
[64] Byunghei Jun and Dongkun Shin. Workload-aware budget compensation scheduling for nvme solid state drives. In
Proceedings of the 2015 4th IEEE Non-Volatile Memory System and Applications Symposium (NVMSA), 2015.
[65] Myoungsoo Jung and Mahmut T. Kandemir. Sprinkler: Maximizing Resource Utilization in Many-Chip Solid State
Disks. InProceedings of the 2014 IEEE International Symposium on High-Performance Computer Architecture (HPCA),
2014.
[66] Nima Elyasi, Mohammad Arjomand, Anand Sivasubramaniam, Mahmut T Kandemir, Chita R Das, and Myoungsoo
Jung. Exploiting intra-request slack to improve ssd performance. InProceedings of the 22nd ACM International
Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS), 2017.
[67] Guanying Wu and Xubin He. Reducing SSD Read Latency via NAND Flash Program and Erase Suspension. In
Proceedings of the 10th USENIX Conference on File and Storage Technologies (FAST), 2012.
[68] Rino Micheloni, Alessia Marelli, and Kam Eshghi.Inside Solid State Drives (SSDs). 2018.
[69] Jin Xue, Renhai Chen, and Zili Shao. Softssd: Software-defined ssd development platform for rapid flash firmware
prototyping. InProceedings of the 40th IEEE International Conference on Computer Design (ICCD), 2022.
[70] Arash Tavakkol, Juan G’omez-Luna, Mohammad Sadrosadati, Saugata Ghose, and Onur Mutlu. MQSim: A framework
for enabling realistic studies of modern multi-queue SSD devices. InProceedings of the 16th USENIX Conference on
File and Storage Technologies (FAST), 2018.
[71] Samsung. Samsung V-NAND SSD 990 Pro Data Sheet, 2023. https://download.semiconductor.samsung.com/resourc
es/data-sheet/samsung_nvme_ssd_990_pro_datasheet_rev.2.0.pdf.
[72] Mingwei Zhang, Zheng Zhang, and Ravi Sahita. Checkpointing for DRAM-Less SSD, 2020. US Patent 10,754,785.
[73] Yiying Zhang, Leo Prasath Arulraj, Andrea C Arpaci-Dusseau, and Remzi H Arpaci-Dusseau. De-Indirection for
Flash-Based SSDs with Nameless Writes. InProceedings of the 10th USENIX Conference on File and Storage Technologies
(FAST), 2012.
[74] Joo-Young Hwang, Seokhwan Kim, Daejun Park, Yong-Gil Song, Junyoung Han, Seunghyun Choi, Sangyeun Cho,
and Youjip Won. ZMS: Zone abstraction for mobile flash storage. InProceedings of the 2024 USENIX Annual Technical
Conference (ATC), 2024.
[75] Hyojun Kim and Seongjun Ahn. BPLRU: A Buffer Management Scheme for Improving Random Writes in Flash
Storage. InProceedings of the 8th USENIX Conference on File and Storage Technologies (FAST), 2008.
[76] Hyeon Gyu Lee, Juwon Lee, Minwook Kim, Donghwa Shin, Sungjin Lee, Bryan S Kim, Eunji Lee, and Sang Lyul Min.
Spartanssd: A reliable ssd under capacitance constraints. InProceedings of the IEEE/ACM International Symposium on
Low Power Electronics and Design (ISLPED), 2021.
[77] Rino Micheloni, Luca Crippa, and Alessia Marelli.Inside NAND Flash Memories. 2010.
[78] Jisung Park, Roknoddin Azizi, Geraldo F. Oliveira, Mohammad Sadrosadati, Rakesh Nadig, David Novo, Juan Gómez-
Luna, Myungsuk Kim, and Onur Mutlu. Flash-Cosmos: In-Flash Bulk Bitwise Operations Using Inherent Computation
Capability of NAND Flash Memory. InProceedings of the 2022 55th IEEE/ACM International Symposium on Microarchi-
tecture (MICRO), 2022.
[79] Kai Zhao, Wenzhe Zhao, Hongbin Sun, Xiaodong Zhang, Nanning Zheng, and Tong Zhang. LDPC-in-SSD: Making
Advanced Error Correction Codes Work Effectively in Solid State Drives. In11th USENIX Conference on File and
Storage Technologies (FAST), 2013.
[80] Osso Vahabzadeh. LDPC codes: Principles and implementation aspects. InFlash Memory Summit (FMS), 2016.
[81] David Declercq. Improving Waterfall Performance of Low Cost FAID LDPC Decoders. InFlash Memory Summit
(FMS), 2019.
[82] Robert Gallager. Low-Density Parity-Check Codes.IRE Transactions on Information Theory, 1962.
[83] Micron. Product Flyer: Micron 3D NAND Flash Memory, 2016. https://www.micron.com/-/media/client/global/doc
uments/products/product-flyer/3d_nand_flyer.pdf.
[84] Zhenming Zhou, Murong Lang, and Li-Te Chang. Read disturb management, 2024. US Patent 12,051,471.
[85] Hiroaki Tanaka. Memory System and Method of Controlling Memory System, 2016. US Patent App. 14/824,402.
[86] Abdel Hakim Alhussien, Ludovic Danjean, Sundararajan Sankaranarayanan, and Erich Franz Haratsch. Read disturb
detection based on dynamic bit error rate estimation, 2019. US Patent 10,482,983.
[87] JEDEC. JESD218B.01: Solid-State Drive (SSD) Requirements and Endurance Test Method, 2016.
[88] Cox, Alvin. JEDEC SSD Endurance Workloads, 2011. https://www.jedec.org/sites/default/files/Alvin_Cox%20%5BCo
mpatibility%20Mode%5D_0.pdf.
[89] Micron. Product Flyer: Micron 3D NAND Flash Memory, 2016. https://www.micron.com/-/media/client/global/doc
uments/products/productflyer/3d_nand_flyer.pdf?la=en.
[90] Micron. NAND Flash Die - Media 1Tb Die: x8 300mm QLC, 2022. https://static6.arrow.com/aropdfconversion/7fe70
6dfbdcc308f78d998e13cfe12b7146703a1/n48r-media-die-nand-datasheet.pdf.
[91] ADATA. ADATA Premier SP550 SSD, 2019. https://www.adata.com/upload/downloadfile/Datasheet_SP550_EN_201
60401.pdf.

10:30 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
[92] ADATA. ADATA Ultimate SU800 SSD, 2024. https://www.adata.com/us/support/product/410/.
[93] ADATA. ADATA Ultimate SU630 SSD, 2023. https://www.adata.com/us/support/product/591/.
[94] Seagate. Seagate BarraCuda SSD, 2023. https://www.seagate.com/products/hard-drives/barracuda-qlc-ssd/.
[95] Western Digital. WD Blue SSD, 2023. https://www.westerndigital.com/en-sg/products/internal-drives/wd-blue-sata-
ssd.
[96] Hynix. SK Hynix Gold S31 SSD, 2023. https://ssd.skhynix.com/gold_p31/.
[97] Samsung. Samsung 860 EVO SSD, 2018. https://download.semiconductor.samsung.com/resources/data-
sheet/Samsung_SSD_860_EVO_Data_Sheet_Rev1.pdf.
[98] Samsung. Samsung 860 QVO SSD, 2018. https://download.semiconductor.samsung.com/resources/data-
sheet/Samsung_SSD_860_QVO_Data_Sheet_Rev1.pdf.
[99] Toshiba. Toshiba TR200 SSD, 2017. https://gzhls.at/blob/ldb/3/d/4/c/32616ebe4e85c4c3530c782df3ca466ae6e6.pdf.
[100] Crucial. Crucial BX500 3D NAND TLC SSD, 2019. https://www.crucial.com/ssd/bx500/ct1000bx500ssd1.
[101] Youngseop Shim, Myungsuk Kim, Myoungjun Chun, Jisung Park, Yoona Kim, and Jihong Kim. Exploiting Process
Similarity of 3D Flash Memory for High Performance SSDs. InProceedings of the 2019 52nd IEEE/ACM International
Symposium on Microarchitecture (MICRO), 2019.
[102] Yixin Luo, Saugata Ghose, Yu Cai, Erich F. Haratsch, and Onur Mutlu. Improving 3D NAND Flash Memory Lifetime
by Tolerating Early Retention Loss and Process Variation.Proceedings of the ACM on Measurement and Analysis of
Computing Systems (POMACS), 2018.
[103] Yi Wang, Lisha Dong, and Rui Mao. P-Alloc: Process-Variation Tolerant Reliability Management for 3D Charge-
Trapping Flash Memory.ACM Transactions on Embedded Computing Systems (TECS), 2017.
[104] Shuo-Han Chen, Yen-Ting Chen, Hsin-Wen Wei, and Wei-Kuan Shih. Boosting the Performance of 3D Charge Trap
NAND Flash with Asymmetric Feature Process Size Characteristic. InProceedings of the 2017 54th ACM/EDAC/IEEE
Design Automation Conference (DAC), 2017.
[105] Chun-Hsiung Hung, Meng-Fan Chang, Yih-Shan Yang, Yao-Jen Kuo, Tzu-Neng Lai, Shin-Jang Shen, Jo-Yu Hsu,
Shuo-Nan Hung, Hang-Ting Lue, Yen-Hao Shih, Shih-Lin Huang, Ti-Wen Chen, Tzung Shen Chen, Chung Kuang
Chen, Chi-Yu Hung, and Chih-Yuan Lu. Layer-Aware Program-and-Read Schemes for 3D Stackable Vertical-Gate
BE-SONOS NAND Flash Against Cross-Layer Process Variations.IEEE Journal of Solid-State Circuits (JSSC), 2015.
[106] Jui-Nan Yen, Yao-Ching Hsieh, Cheng-Yu Chen, Tseng-Yi Chen, Chia-Lin Yang, Hsiang-Yun Cheng, and Yixin Luo.
Efficient Bad Block Management with Cluster Similarity. InProceedings of the 2022 IEEE International Symposium on
High-Performance Computer Architecture (HPCA), 2022.
[107] Qiao Li, Min Ye, Yufei Cui, Liang Shi, Xiaoqiang Li, Tei-Wei Kuo, and Chun Jason Xue. Shaving Retries with Sentinels
for Fast Read over High-Density 3D Flash. InProceedings of the 2020 53rd Annual IEEE/ACM International Symposium
on Microarchitecture (MICRO), 2020.
[108] Yu Cai, Erich F. Haratsch, Onur Mutlu, and Ken Mai. Threshold Voltage Distribution in MLC NAND Flash Memory:
Characterization, Analysis, and Modeling. InProceedings of the 2013 Design, Automation & Test in Europe Conference
& Exhibition (DATE), 2013.
[109] Sungjun Cho, Beomjun Kim, Hyunuk Cho, Gyeongseob Seo, Onur Mutlu, Myungsuk Kim, and Jisung Park. AERO:
Adaptive Erase Operation for Improving Lifetime and Performance of Modern NAND Flash-Based SSDs. InProceedings
of the 29th ACM International Conference on Architectural Support for Programming Languages and Operating Systems
(ASPLOS), 2024.
[110] Intel. Intel Core i9 Processor 14900K, 2023. https://www.intel.com/content/www/us/en/products/sku/236773/intel-
core-i9-processor-14900k-36m-cache-up-to-6-00-ghz/specifications.html.
[111] Jens Axboe. Flexible I/O Tester, 2025. https://github.com/axboe/fio.
[112] NVM Express Workgroup. NVM Express® Base Specification, 2025. https://nvmexpress.org/wp-content/uploads/NV
M-Express-Base-Specification-Revision-2.2-2025.03.11-Ratified.pdf.
[113] Bruce Allen. Smartmontools, 2025. https://www.smartmontools.org/.
[114] Micron Technology, Inc. Storage Executive Software, 2025. https://www.micron.com/sales-support/downloads/soft
ware-drivers/storage-executive-software.
[115] Sangjin Yoo and Dongkun Shin. Reinforcement Learning-Based SLC Cache Technique for Enhancing SSD Write
Performance. InProceedings of the 12th USENIX Workshop on Hot Topics in Storage and File Systems (HotStorage), 2020.
[116] Kulachet Tanpairoj, Sebastien Andre Jean, Kishore Kumar Muchherla, Ashutosh Malshe, and Jianmin Huang. SLC
Cache Management, 2022. US Patent 11,237,737.
[117] Phison. Pinnacle of Gen4 Power and Value, 2023. https://www.phison.com/images/products_datasheet/ProductBroc
hure_Consumer_PS5027-E27T.pdf.
[118] Weihua Liu, Fei Wu, Xiang Chen, Meng Zhang, Yu Wang, Xiangfeng Lu, and Changsheng Xie. Characterization
Summary of Performance, Reliability, and Threshold Voltage Distribution of 3D Charge-Trap NAND Flash Memory.
ACM Transactions on Storage (TOS), 2022.

Experimental Study on System-Level Performance Impact of Read Disturbance in Modern SSDs 10:31
[119] Keivan Alizadeh, Iman Mirzadeh, Dmitry Belenko, Karen Khatamifard, Minsik Cho, Carlo C Del Mundo, Mohammad
Rastegari, and Mehrdad Farajtabar. LLM in a Flash: Efficient Large Language Model Inference with Limited Memory.
InarXiv, 2023.
[120] Yuyue Wang, Xiurui Pan, Yuda An, Jie Zhang, and Glenn Reinman. BeaconGNN: Large-Scale GNN Acceleration
with Out-of-Order Streaming In-Storage Computing. InProceedings of the 2024 IEEE International Symposium on
High-Performance Computer Architecture (HPCA), 2024.
[121] Nika Mansouri Ghiasi, Mohammad Sadrosadati, Harun Mustafa, Arvid Gollwitzer, Can Firtina, Eudine Julien, Haiyu
Mao, Joël Lindegger, Meryem Banu Cavlak, Mohammed Alser, Jisung Park, and Onur Mutlu. MegIS: High-Performance,
Energy-Efficient, and Low-Cost Metagenomic Analysis with In-Storage Processing. InProceedings of the 51st Annual
International Symposium on Computer Architecture (ISCA).
[122] Guiqiang Dong, Ningde Xie, and Tong Zhang. Enabling NAND Flash Memory Use Soft-Decision Error Correction
Codes at Minimal Read Latency Overhead.IEEE Transactions on Circuits and Systems I: Regular Papers, 2013.
[123] Yishan Zhang, Chun Zhang, Zhiyuan Yan, Shuang Chen, and Hanjun Jiang. A High-Throughput Multi-Rate LDPC
Decoder for Error Correction of Solid-State Drives. InIEEE Workshop on Signal Processing Systems (SiPS), 2015.
[124] ONFI Workgroup. ONFI 3.0 Specification Sheets, 2011. https://onfi.org/files/onfi_3_0_gold.pdf.
[125] Yixin Luo, Saugata Ghose, Yu Cai, Erich F. Haratsch, and Onur Mutlu. Enabling Accurate and Practical Online Flash
Channel Modeling for Modern MLC NAND Flash Memory.IEEE Journal on Selected Areas in Communications (JSAC),
2016.
[126] Yixin Luo, Saugata Ghose, Yu Cai, Erich F. Haratsch, and Onur Mutlu. HeatWatch: Improving 3D NAND Flash
Memory Device Reliability by Exploiting Self-Recovery and Temperature Awareness. InProceedings of the 2018 IEEE
International Symposium on High Performance Computer Architecture (HPCA), 2018.
[127] Yixin Luo, Saugata Ghose, Yu Cai, Erich F. Haratsch, and Onur Mutlu. Improving 3D NAND Flash Memory Lifetime by
Tolerating Early Retention Loss and Process Variation. InProceedings of the 2018 ACM on Measurement and Analysis
of Computing Systems (SIGMETRICS), 2018.
[128] Shiqiang Nie, Youtao Zhang, Weiguo Wu, and Jun Yang. Layer RBER Variation Aware Read Performance Optimization
for 3D Flash Memories. InProceedings of the 53rd ACM/EDAC/IEEE Design Automation Conference (DAC), 2020.
[129] Feng Chen, Rubao Lee, and Xiaodong Zhang. Essential Roles of Exploiting Internal Parallelism of Flash Memory
Based Solid State Drives in High-Speed Data Processing. InProceedings of the 2011 IEEE International Symposium on
High-Performance Computer Architecture (HPCA), 2011.
[130] Hyukjoong Kim, Dongkun Shin, Yunho Jeong, and Kyunghom Kim. SHRD: Improving Spatial Locality in Flash
Storage Accesses by Sequentializing in Host and Randomizing in Device. InProceedings of the 15th USENIX Conference
on File and Storage Technologies (FAST), 2017.
[131] Charles J. Camp and H. Frost Holloway. Reduction of read disturb errors in nand flash memory, 2010. US Patent
8,189,379.
[132] Richard A. Mataya, Rancho Santo, Po-len Hsueh, and Mark Moshayedi. Flash Storage Device with Read Disturb
Mitigation, 2014. US Patent 8,719,652.
[133] Junghee Lee, Youngjae Kim, Galen M. Shipman, Sarp Oral, and Jongman Kim. Page Type-Aware Data Migration
Technique for Read Disturb Management of NAND Flash Memory.IEEE Transactions on Very Large Scale Integration
(VLSI) Systems, 2023.
[134] Jaeyong Jeong, Sangwook Shane Hahn, Sungjin Lee, and Jihong Kim. Lifetime Improvement of NAND Flash-Based
Storage Systems Using Dynamic Program and Erase Scaling. InProceedings of the 12th USENIX Conference on File and
Storage Technologies (FAST), 2014.
[135] Myungsuk Kim, Youngsun Song, Myoungsoo Jung, and Jihong Kim. SARO: A State-Aware Reliability Optimization
Technique for High Density NAND Flash Memory. InProceedings of the Great Lakes Symposium on VLSI (GLSVLSI),
2018.
[136] Yazhi Feng, Dan Feng, Wei Tong, Yu Jiang, and Chuanqi Liu. Using Disturbance Compensation and Data Clustering
(DC)2 to Improve Reliability and Performance of 3D MLC Flash Memory. In35th International Conference on Computer
Design (ICCD), 2017.
[137] Haobo Wang, Nathan Wong, Tsung-Yi Chen, and Richard D. Wesel. Using Dynamic Allocation of Write Voltage to
Extend Flash Memory Lifetime.IEEE Transactions on Communications, 2016.
[138] Dong Guiqiang, Li Shu, and Zhang Tong. Using Data Postcompensation and Predistortion to Tolerate Cell-to-Cell
Interference in MLC NAND Flash Memory.IEEE Transactions on Circuits and Systems I, 2010.
[139] Da-Wei Chang, Wei-Cheng Lin, and Hsin-Hung Chen. FastRead: Improving Read Performance for Multi-Level-Cell
Flash Memory.IEEE Transactions on Very Large Scale Integration (VLSI) Systems, 2016.
[140] Jun Li, Bowen Huang, Zhibing Sha, Zhigang Cai, Jianwei Liao, Balazs Gerofi, and Yutaka Ishikawa. Mitigating
Negative Impacts of Read Disturb in SSDs.ACM Transactions on Design Automation of Electronic Systems (TODAES),
2020.

10:32 Yonggon Park, Hyunuk Cho, Onur Mutlu, Sungjin Lee, and Jisung Park
[141] Jianwei Liao, Jun Li, Mingwang Zhao, Zhibing Sha, and Zhigang Cai. Read Refresh Scheduling and Data Reallocation
against Read Disturb in SSDs.ACM Transactions on Embedded Computing Systems (TECS), 2022.
[142] Kanchan Joshi, Praval Choudhary, and Kaushal Yadav. Enabling NVMe WRR Support in Linux Block Layer. In
Proceedings of the 9th USENIX Workshop on Hot Topics in Storage and File Systems (HotStorage), 2017.
[143] Mohammad Hedayati, Kai Shen, Michael L. Scott, and Mike Marty. Multi-Queue Fair Queuing. InProceedings of the
2019 USENIX Annual Technical Conference (ATC), 2019.
[144] Suli Yang, Tyler Harter, Nishant Agrawal, Salini Selvaraj Kowsalya, Anand Krishnamurthy, Samer Al-Kiswany, Rini T.
Kaushik, Andrea C. Arpaci-Dusseau, and Remzi H. Arpaci-Dusseau. Split-Level I/O Scheduling. InProceedings of the
25th Symposium on Operating Systems Principles (SOSP), 2015.
[145] David Shue, Michael J. Freedman, and Anees Shaikh. Performance Isolation and Fairness for Multi-Tenant Cloud
Storage. InProceedings of the 10th USENIX Conference on Operating Systems Design and Implementation (OSDI), 2012.
[146] Jiwon Woo, Minwoo Ahn, Gyusun Lee, and Jinkyu Jeong. Device-Direct Fair Queueing for NVMe SSDs. InProceedings
of the 19th USENIX Conference on File and Storage Technologies (FAST), 2021.
[147] Miryeong Kwon, Donghyun Gouk, Changrim Lee, Byounggeun Kim, Jooyoung Hwang, and Myoungsoo Jung. DC-
Store: Eliminating Noisy Neighbor Containers Using Deterministic I/O Performance and Resource Isolation. In
Proceedings of the 18th USENIX Conference on File and Storage Technologies (FAST), 2020.
[148] Jian Huang, Anirudh Badam, Laura Caulfield, Suman Nath, Sudipta Sengupta, Bikash Sharma, and Moinuddin K.
Qureshi. FlashBlox: Achieving Both Performance Isolation and Uniform Lifetime for Virtualized SSDs. InProceedings
of the 15th USENIX Conference on File and Storage Technologies (FAST), 2017.
[149] Shiqin Yan, Huaicheng Li, Mingzhe Hao, Michael Hao Tong, Swaminathan Sundararaman, Andrew A. Chien, and
Haryadi S. Gunawi. Tiny-Tail Flash: Near-Perfect Elimination of Garbage Collection Tail Latencies in NAND SSDs.
InProceedings of the 15th USENIX Conference on File and Storage Technologies (FAST), 2017.
[150] Jaeho Kim, Donghee Lee, and Sam H. Noh. Towards SLO Complying SSDs Through OPS Isolation. InProceedings of
the 13th USENIX Conference on File and Storage Technologies (FAST), 2015.
[151] Micron. Micron 9400 SSD Series Technical Product Specification, 2025. https://assets.micron.com/adobe/assets/urn:
aaid:aem:83accf2c-00af-4223-ab00-c40fb224ce6c/renditions/original/as/9400-nvme-ssd-tech-prod-spec.pdf.
[152] Vasily Tarasov, Erez Zadok, and Spencer Shepler. Filebench: A flexible framework for file system benchmarking.
USENIX ;login:, 2016.
[153] Ying Sheng, Lianmin Zheng, Binhang Yuan, Zhuohan Li, Max Ryabinin, Beidi Chen, Percy Liang, Christopher Ré, Ion
Stoica, and Ce Zhang. FlexGen: High-Throughput Generative Inference of Large Language Models with a Single
GPU. InProceedings of the 40th International Conference on Machine Learning (ICML), 2023.
[154] Reza Yazdani Aminabadi, Samyam Rajbhandari, Minjia Zhang, Ammar Ahmad Awan, Du Li, Cheng Li, Elton Zheng,
Jeff Rasley, Shaden Smith, Olatunji Ruwase, and Yuxiong He. DeepSpeed Inference: Enabling Efficient Inference of
Transformer Models at Unprecedented Scale. InarXiv presents, 2022.
[155] NVM Express Workgroup. NVM Express® Base Specification, 2021. https://nvmexpress.org/wp-content/uploads/NV
Me-NVM-Express-2.0a-2021.07.26-Ratified.pdf.
[156] Myoungjun Chun, Myungsuk Kim, Dusol Lee, Jisung Park, and Jihong Kim. ReadGuard: Integrated SSD Management
for Priority-Aware Read Performance Differentiation.ACM Transactions on Storage (TOS), 2024.
[157] Shaoqi Yang, Xiaohuan Zhao, Peng Guo, Qianwen Wang, Guangkuo Yang, Xinyi Guo, Pengpeng Sang, Jixuan Wu,
Xuepeng Zhan, and Jiezhi Chen. Comprehensive Characterizations on Read Disturbs in QLC Charge-Trap (CT) 3D
NAND Flash. InProceedings of the IEEE 17th International Conference on Solid-State & Integrated Circuit Technology
(ICSICT), 2024.
[158] Jaeyong Lee, Beomjun Kim, Myoungjun Chun, Myungsuk Kim, and Jihong Kim. DEAR: Improving Performance
and Lifetime of SSDs Using Dynamic Error-Aware Refresh. InProceedings of the 2025 58th IEEE/ACM International
Symposium on Microarchitecture (MICRO), 2025.
[159] Qiao Li, Yu Chen, Guanyu Wu, Yajuan Du, Min Ye, Xinbiao Gan, Jie Zhang, Zhirong Shen, Jiwu Shu, and Chun Xue.
Characterizing and Optimizing LDPC Performance on 3D NAND Flash Memories.ACM Transactions on Architecture
and Code Optimization (TACO), 2024.
[160] Lanlan Cui, Xiaojian Liu, Fei Wu, and Changsheng Xie. Improving LDPC Decoding Performance for 3D TLC NAND
Flash by LLR Optimization Scheme for Hard and Soft Decision.ACM Transactions on Design Automation of Electronic
Systems, 2022.
[161] Li Wei Liu, Yen Chin Liao, and Hsie-Chia Chang. UP-GDBF: A 19.3 Gbps Error Floor Free 4KB LDPC Decoder for
NAND Flash Applications.IEEE Open Journal of Circuits and Systems (OJCAS), 2022.

# 第二部分：解析（深度解读）
## 核心论点

随存储密度数十年提升，NAND 闪存在现代计算中举足轻重，但可靠性随之下降。**读干扰（read disturbance）**因影响加剧而成为主要可靠性隐患。以往研究多关注比特错误率，本文首次**系统量化**读干扰对「系统级 I/O 性能」的影响——例如读刷新（read reclaim）引发的尾延迟（tail latency）与吞吐下降，而非仅数据完整性。

## 关键概念

1. **读干扰 / 读刷新（read reclaim）**：频繁读某一页会干扰同块其他页，需触发刷新，带来性能开销。
2. **尾延迟**：少数请求的极端延迟，对服务等级（SLO）影响大。
3. **可靠性–性能权衡**：密度↑ ⇒ 可靠性↓，读干扰成为系统性能的关键约束。

## 技术趋势与判断

- 存储密度提升使读干扰从「数据完整性」问题升级为「系统性能」问题，对云存储与 AI 训练数据管线有意义。
- 与 AI 基础设施主线相关：数据搬运与存储带宽/延迟直接影响训练与推理效率。

## 与本站其他文章的连接

- 计算机体系结构/存储子系统，与 AI 硬件（HBM/互连/数据通路）主线互补。

## 风险提示

- 实验基于特定 NAND 代际与控制器策略，结论随工艺与固件演进需重新测量。
