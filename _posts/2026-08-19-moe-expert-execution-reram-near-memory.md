---
layout: post
title: "MoE Expert Execution in Disaggregated LLM Serving with a High-Bandwidth ReRAM Near-Memory Architecture — 用高带宽 ReRAM 近内存架构执行分解式 LLM 服务中的 MoE 专家"
date: 2026-08-19 00:00:00 +0800
categories: [人工智能]
tags: [MoE, 存内计算, ReRAM, LLM推理, 近内存计算]
description: 用高带宽 ReRAM 近内存架构执行分解式 LLM 服务中的 MoE 专家 本文附英文原文（arXiv 全文/PDF 提取）与中文深度解读。
image: /assets/img/covers/moe-expert-execution-reram-near-memory.jpg

---

> 原文：[MoE Expert Execution in Disaggregated LLM Serving with a High-Bandwidth ReRAM Near-Memory Architecture](https://arxiv.org/abs/2608.13962)，作者 Kunming Shao, Ming Zeng, et al. (HKUST & Alibaba Cloud)。
> 本页结构：第一部分为英文原文（Original Article），第二部分为中文深度解读（解析）。
> 说明：原文无付费墙，全文完整收录（来自 arXiv HTML 或 PDF 文本提取，公式以 LaTeX 呈现）。

# 第一部分：正文（Original Article）

# MoE Expert Execution in Disaggregated LLM Serving with a High-Bandwidth ReRAM Near-Memory ArchitectureThanks: *Corresponding authors: Kunming Shao and Yangming Zhang.

Kunming Shao1,2,*,
Ming Zeng2,
Xin Yuan2,
Binbin Liao2,
Yangming Zhang2,*

  
Wei Wang2,
Tim Kwang-Ting Cheng1,
and Chi-Ying Tsui1

Affiliation: 1The Hong Kong University of Science and Technology, Hong Kong SAR, China

2Alibaba Cloud Computing, China

Email: kshaoaa@connect.ust.hk, yangming.zym@alibaba-inc.com

Abstract
    

Attention–FFN disaggregation maps LLM modules to specialized pools,
creating an opening to keep Mixture-of-Experts (MoE) weights resident in
a high-bandwidth FFN pool.
Decode SLOs, however, cap the run-batch while sparse routing expands the
activated-expert union, so weight traffic amortizes poorly and routing
skew idles cold-expert resources.
The FFN pool must therefore deliver weight-read bandwidth density under
sparse unions and recover occupancy under skew without a global sharing
fabric.
We present a ReRAM near-memory architecture that keeps expert
weights resident behind high-bandwidth local reads.
The design factors actual MFU into ideal MFU and occupancy, recovers
occupancy with bounded core-local multicast pooling, coactivation-aware
placement, and load-aware fetch, and sizes each communication level from
induced demand.
A measured + modeled study on Qwen3.5-35B-A3B, Qwen3.5-397B-A17B, and
GLM-5.2 shows that side-4 pooling raises occupancy from 

$$
0.328
$$

 to

$$
0.519
$$

 and, at iso-peak compute, lowers per-token FFN-pool latency by

$$
9.5\times
$$

 versus H20 with 

$$
20\times
$$

 lower weight-movement energy; an
H20-attention + ReRAM-FFN system reduces decode TPOT by

$$
1.25
$$

–

$$
4.0\times
$$

, 

$$
2.4
$$

–

$$
10.3\times
$$

, and 

$$
2.5
$$

–

$$
10.4\times
$$

 versus
a homogeneous H20 pool.

  

Index Terms: MoE, ReRAM, near-memory computing, disaggregated serving, load balancing.

## I Introduction

Attention and feed-forward (FFN) layers impose different costs during LLM
decode. Attention repeatedly reads a growing key-value cache and is
bandwidth-bound; an FFN reuses model weights that are constant across tokens.
Attention–FFN disaggregation maps these modules to separate pools specialized
for their bottlenecks [[36], [26]].
For Mixture-of-Experts (MoE) models, this split creates an opportunity to keep
expert weights resident in a high-bandwidth near-memory computing (NMC) pool
and stream activations through them (Fig. [1]).

![Refer to caption]

_Fig. 1: Attention/FFN-disaggregated serving. The attention pool is KV-read
(bandwidth) bound; the FFN pool holds resident MoE expert weights and is the
scope of this paper._

Realizing that opportunity faces a concrete challenge.
A decode service-level objective (SLO) limits how many sequences advance
together, so run-batch is capped rather than freely chosen.
Sparse routing then expands the *union* of activated experts: on measured
Qwen3.5-35B-A3B traces the union grows from 

$$
8
$$

 to 

$$
168.6
$$

 of 

$$
256
$$

 experts
between batch 

$$
1
$$

 and 

$$
64
$$

, so a 

$$
64\times
$$

 batch increase cuts per-token
weight traffic by only 

$$
{\approx}3.0\times
$$

.
Nonuniform routing further lets hot experts set the step latency while cold
experts’ resources sit idle.
Together these effects define the paper’s challenge: after residency removes
off-chip weight delivery, the MoE FFN pool must still (i) provide
*bandwidth density*—weight-read bandwidth per resident capacity—under
sparse unions, and (ii) recover local utilization under skew without paying
for global expert replication or a global sharing fabric.

Prior MoE systems mainly cut weight or activation movement
[[13], [6], [2], [14], [34]]
or balance expert parallelism across GPUs
[[8], [17], [35]].
Once weights are resident, skew appears as two local losses: issued tiles can
be underfilled, and PE groups can wait on a straggler.
In-array compute would couple each PE to its programmed expert; reading a
resident row into adjacent digital PEs instead makes the destination PE a
runtime choice while keeping conventional FP8 datapaths.
ReXpert spends that local bandwidth for reassignability inside a physically
bounded neighborhood.

We present ReXpert, a ReRAM NMC architecture for the MoE FFN pool that combines
bounded core-local multicast pooling, routing-aware placement, and load-aware
fetch, and provisions each communication level from the induced traffic.

- • 

Challenge and bandwidth-density analysis.
SLO-capped batch, sparse expert unions, and routing skew jointly motivate
resident capacity with proportionally high local read bandwidth.

- • 

MFU decomposition and bounded pooling.
Actual MFU 

$$
=
$$

 ideal MFU 

$$
\times
$$

 occupancy; multicast pooling and secondary
placement/fetch raise occupancy 

$$
0.328{\to}0.519
$$

 without global sharing.

- • 

Hierarchy-aware communication provisioning.
Per-level traffic, placement-matched reduction order, and on-die headroom
for the induced demand.

- • 

Hybrid evidence.
Relative to attention-side AFD [[21]], NPU–PIM splits
[[10], [29]], and software MoE schedulers
[[2], [8], [33]], we keep routing
fixed and absorb skew inside a resident ReRAM NMC FFN pool.
At iso-peak compute the pool is 

$$
9.5\times
$$

 faster than H20 with

$$
20\times
$$

 lower weight-movement energy; an H20-attention 

$$
+
$$

 ReXpert-FFN
system lowers decode TPOT by 

$$
1.25
$$

–

$$
4.0\times
$$

, 

$$
2.4
$$

–

$$
10.3\times
$$

,
and 

$$
2.5
$$

–

$$
10.4\times
$$

 on the three models versus a homogeneous H20 pool.

## II Background and Motivation

### II-A Batch-Constrained AF Disaggregation

Attention rereads the key-value (KV) cache for every decoded token, whereas an FFN
reuses weights that are constant across tokens. Disaggregated serving maps these
modules to separate pools provisioned for their resource profiles
[[36], [26], [28]].

Decode SLOs constrain run-batch [[32], [15]], so the FFN pool
must be efficient when latency forbids batching solely for weight amortization.
AFD also pipelines A/F waves and transfers activations between pools.
CHIME’s Disaggregated Roofline develops the corresponding analysis for the
attention side [[21]]; we study only the MoE FFN side.

### II-B Sparse-Expert Weight-Traffic Analysis

For a dense FFN, batching reduces per-token weight traffic as 

$$
1/B
$$

[[31], [27]]. A sparse MoE activates the union

$$
U(B)
$$

 of the top-

$$
r
$$

 choices made by 

$$
B
$$

 tokens, so traffic scales as 

$$
U(B)/B
$$

.
On measured Qwen3.5-35B-A3B routing (default Alpaca trace), 

$$
U(B)
$$

 grows from 

$$
8
$$

experts at 

$$
B{=}1
$$

 to 

$$
168.6
$$

 of 

$$
256
$$

 at 

$$
B{=}64
$$

 (and 

$$
205
$$

 at native

$$
B{=}128
$$

); a 

$$
64\times
$$

 batch
increase therefore reduces
per-token traffic by only 

$$
{\approx}3.0\times
$$

(

$$
U(1)/1
$$

 over 

$$
U(64)/64
$$

).
This makes *bandwidth density*—read
bandwidth per resident weight capacity—the relevant provisioning quantity.

### II-C Technology-Independent Machine Balance

A machine with peak rate 

$$
P
$$

 and weight-read bandwidth 

$$
\beta
$$

 has balance

$$
F=P/\beta
$$

 FLOP/byte. If 

$$
t
$$

 tokens share each weight read, an
input-stationary GEMM performs 

$$
2t
$$

 FLOP/byte and reaches the compute roof only
when

$$
t\;\geq\;F/2
$$

(1)

Because mean expert load is 

$$
Br/R
$$

, the corresponding batch is

$$
B^{\star}=(F/2)(R/r)
$$

.
H20 has 

$$
F=74
$$

 FLOP/byte and needs 37 tokens per read; H100/H800 has 

$$
F=591
$$

and needs 295. For Qwen3.5-397B-A17B these balances correspond to batches 1894
and 

$$
15\,123
$$

 (Table [I]). These machine-balance thresholds are
not claimed service limits; they show why adding FLOPS without proportional
bandwidth worsens low-batch weight delivery.

Figure [2] plots H20 MFU vs FFN batch under that mean-load
model: a dense FFN reaches the roof at 

$$
B^{\star}{=}37
$$

, while sparsity
multiplies the knee by 

$$
R/r
$$

 (1184 for Qwen3.5-35B; 

$$
{\approx}1894
$$

 for
397B-A17B). At 

$$
B{\leq}16
$$

 both MoE curves stay below 

$$
1.4\%
$$

 of peak.
These are first-order utilization knees (uniform routing, 

$$
U{\to}R
$$

), not
measured kernel MFU; they illustrate why sparse MoE, not merely model size,
pushes commodity HBM far from the compute roof under batch-constrained decode.
H100/H800 supplies 

$$
6.7\times
$$

 H20’s dense FP8 peak at slightly less read
bandwidth, so its reuse requirement rises from 37 to 295 tokens/read and the
MoE batches become extreme (Table [I]: Qwen3.5-35B needs 1184/9452
on H20/H100; GLM-5.2 shares the 

$$
R/r{=}32
$$

 knee at 

$$
B^{\star}{=}1184
$$

 on H20).
The thresholds use *mean* load, so under skew they are necessary
machine-balance conditions for HBM-fed execution, not service guarantees.

_Fig. 2: H20 FFN MFU under dense and mean-load MoE routing._

_TABLE I: Commodity-HBM machine balance._

SKU
Read BW
Peak
FLOP/B
Tok./reada

(TB/s)
(TFLOPS)

H20
4.00
296
74
37

H100/H800 SXMb
3.35
1979
591
295

*Batch at the compute roof*

Model

$$
R
$$

$$
r
$$

H20
H100/H800

Qwen3.5-35B-A3B
256
8
1184
9452

Qwen3.5-397B-A17B
512
10
1894

$$
15\,123
$$

GLM-5.2
256
8
1184
9452

- a 

A read shared by 

$$
t
$$

 tokens yields 

$$
2t
$$

 FLOP/byte, so

$$
t\geq F/2
$$

 (Eq. [1]); batch is 

$$
(F/2)(R/r)
$$

.

- b 

H800 shares this memory system and dense FP8 rate, differing in NVLink
bandwidth, which affects EP/TP traffic (§[V]) rather than
per-die weight delivery.

Figure [3] shows the serving conflict. Small batches retain
frequent low-latency pulses but leave the FFN at low MFU and high cost/token;
accumulating toward 

$$
B^{\star}
$$

 amortizes weights and raises MFU but stretches
the gather queue into one long synchronized FFN pulse. Batch is therefore not
the primary efficiency lever for interactive decode.

![Refer to caption]

_Fig. 3: Batch-efficiency versus latency-SLO tension for H20 MoE FFNs. With

$$
B{=}16
$$

 normalized to one SLO interval, the 397B knee
(

$$
B^{\star}{\approx}1894
$$

) sits 

$$
{\sim}118\times
$$

 above the interactive
budget._

### II-D Runtime Flexibility of Near-Memory Compute

Compute-in-memory (CIM) binds a stored weight tile to local arithmetic, shortening
the weight path but limiting reassignment under routing skew
[[30], [1], [22]]. Near-memory computing
(NMC) reads weights into adjacent digital logic, paying local bandwidth to make the
mapping between weights and PE groups a runtime decision.
Heterogeneous NPU–PIM systems exploit a related split by placing bandwidth-heavy
GEMV (often attention) on DRAM-PIM and GEMM on NPUs
[[10], [29]]; hybrid DRAM/SRAM PIM further trades capacity
against latency [[16]]; CXL near-bank PIM can remove the GPU from
the path entirely [[7]].
Resident high-bandwidth NMC for *MoE FFN* weights keeps experts programmed
in ReRAM while digital PEs remain reassignable under skew
(Table [XIII]; §[IV]).
CIM binds compute to programmed weights; NMC steers a local read-out to idle
digital PEs via a multicast/reduction path—the degree of freedom used for MoE
skew.

## III Problem Analysis

Residency delivers weights but not useful compute: sparse routing underfills
tiles and idles PE groups.
We separate those losses on measured Qwen3.5-35B-A3B routing without extrapolating
its statistics to the larger models.
Cross-device EP/TP weight movement [[33]] and expert prefetch
[[20]] are complementary; once weights are resident, first-order
losses are tile fill and occupancy (§[V] bounds EP/TP traffic).

### III-A MFU Factorization

A *PE job* processes up to 

$$
w
$$

 tokens for one expert on one PE group. For

$$
T
$$

 token jobs, 

$$
J
$$

 issued jobs, 

$$
N
$$

 cores, 

$$
G
$$

 groups/core, and 

$$
\rho
$$

critical-path rounds,

$$
\underbrace{\frac{T}{\rho NGw}}_{\text{actual MFU}}\;=\;\underbrace{\frac{T}{Jw}}_{\text{ideal MFU}}\;\times\;\underbrace{\frac{J}{\rho NG}}_{\text{occupancy}}.
$$

(2)

Ideal MFU falls on underfilled tiles; occupancy falls when groups wait for a
straggler.
The two factors are reported as separate diagnostics; scheduling can affect
both.
Reporting only mean load or aggregate PE utilization would conflate the two
causes that Eq. [2] separates.

### III-B Routing Skew and Stability

At native 

$$
B{=}128
$$

, top-8 routing over 256 experts has a mean expert load of
four tokens—exactly the balanced physical tile—but the observed distribution
does not place four tokens on each expert.
On the default Alpaca trace, the hottest expert receives 

$$
39.3
$$

 tokens per step
(

$$
9.83\times
$$

 the global mean); across the campaign the hottest/mean ratio stays
in 

$$
[6.4,9.9]\times
$$

.
The modal hot expert persists on 

$$
40.1\%
$$

 of decode steps
(Table [II]), enough to amortize a placement epoch.
Skew is therefore severe enough to create stragglers and stable enough to
guide placement (Fig. [4], Tables [II]
and [VI]; Qwen3.5-397B and GLM-5.2 serve as larger measured
models that reproduce the same skew structure and pooling knee).
Table [II] reports per-layer, per-step means over 64 decode steps;
parenthesized values are uniform-routing references.

Hot experts overflow into many full jobs while the cold tail issues 1–2-token
jobs, lowering ideal MFU even though the global token count is unchanged.
At the same time, whichever Core contains several co-fired hot experts sets the
critical-path round count, leaving other groups idle and lowering occupancy.
Persistence does not mean static routing: the signal lasts long enough to
guide a placement epoch; short-term deviations are left to queue scheduling.

_Fig. 4: Qwen3.5-35B-A3B at 

$$
B{=}128
$$

: sorted expert load and Lorenz curve.
Routing is skewed (mean per-layer Gini 

$$
0.491
$$

; top-8 slot share 

$$
15.4\%
$$

vs. 

$$
3.13\%
$$

 uniform), creating stragglers, yet persistent enough to guide
placement (§[III-B])._

_TABLE II: Routing-skew statistics for the measured decode traces._

Metric (per-layer, per-step mean)
Qwen3.5-35B
Qwen3.5-397B

Experts 

$$
E
$$

 / top-

$$
k
$$

256 / 8
512 / 10

MoE layers
40
60

Hottest / mean load

$$
6.77\times
$$

a

$$
12.5\times
$$

Global peak hottest / mean

$$
9.83\times
$$

$$
47.3\times
$$

Top-8 slot share (unif.)
15.4% (3.13%)
12.7% (1.56%)

Top-16 slot share (unif.)
25.4% (6.25%)
20.3% (3.13%)

Mean per-layer Gini
0.491
0.534

Hot-set persistenceb
40.1%
49.4%

- a 

Default Alpaca decode traces at the native tile-fill batch
(

$$
B{=}128
$$

 for 35B, 

$$
B{=}205
$$

 for 397B).
Across each five-run campaign (Alpaca

$$
\times
$$

2 seeds, code, independent

$$
B{\in}\{8,64\}
$$

), hottest/mean stays in 

$$
[6.4,9.9]\times
$$

 (35B) and

$$
[12.5,18.2]\times
$$

 (397B); Gini in 

$$
[0.47,0.58]
$$

 and 

$$
[0.53,0.62]
$$

.

- b 

Fraction of decode steps whose per-layer hottest expert is the
modal hot expert of that layer.

### III-C Utilization Requirements

These observations yield four requirements.
(i) Preserve ideal MFU without sacrificing machine balance.
A narrower job helps only if reduced arithmetic does not lower the roofline
faster than fill improves.
(ii) Recover occupancy with bounded sharing.
A hot expert needs access to more PE groups than its owner provides, but global
sharing would move the resident weight stream across the die.
(iii) Control imbalance at the appropriate time scale.
Stable coactivation guides semi-static placement; queued work fills momentary
idle groups; neither changes tile width, so gains appear in occupancy and rounds.
(iv) Provision communication from the mapping.
Core-local weight multicast, Die-NoC dispatch/combining, package reduction, and
node handoff have different physical semantics; their bandwidth and reduction
order must be derived together with placement.

Increasing batch improves mean expert load but neither removes skew nor changes
which groups can consume a resident read-out, and service latency bounds this
form of amortization.
§[IV] implements these requirements;
§[VII] reports the measured pooling knee and mechanism gains.

## IV Architecture

### IV-A Architecture Overview and Design Contract

ReXpert is a resident ReRAM near-memory FFN pool organized as
Unit

$$
\rightarrow
$$

Core

$$
\rightarrow
$$

Die

$$
\rightarrow
$$

4-die 2.5D UCIe Package

$$
\rightarrow
$$

Node
(Fig. [5]).
Each Node connects eight such Packages.
Its contract follows the MFU cascade of Eq. [2].
The Unit IO and PE expose a balanced four-token tile that sets the roofline
within which *ideal MFU* measures issued-tile fill.
The core mesh and scheduler reclaim idle PE-group time, raising
*occupancy*; their product is *actual MFU*.
Thus tile width addresses the ideal-MFU ceiling, whereas bounded pooling,
placement, and token fetch address occupancy.

The interface boundary is deliberately local: Unit IO may redirect a resident
expert’s read-out across its core, but weights do not traverse links above the
core mesh.
This keeps the bandwidth-density advantage of residency while allowing idle PE
groups to serve a hot expert.
Larger sharing domains recover more occupancy but require a wider, longer
multicast/reduction fabric; ReXpert therefore bounds sharing within a core and
uses placement and queue scheduling beyond that boundary.

A Unit is the smallest independently readable weight store and compute endpoint.
A Core groups 16 such endpoints so a resident read-out can be reused by PE
groups that do not own the weight.
The Die NoC connects cores for activation dispatch and partial-sum collection;
package and node links connect tensor- and expert-parallel shards.
Widening the core-local domain lengthens every multicast tree; traffic above
the core carries compact vectors, so the core boundary is both a scheduling
boundary and the only one across which resident weights are observed.

![Refer to caption]

_Fig. 5: ReXpert hierarchy (Unit 

$$
\to
$$

 Core 

$$
\to
$$

 Die 

$$
\to
$$

 Package 

$$
\to
$$

Node): expert weights stay at/below the Core mesh; higher levels carry only
activations and partials._

### IV-B Balanced ReXpert Unit

A ReXpert unit stores 

$$
4
$$

 MiB in 16 

$$
2
$$

 Mib macros
(

$$
16\mathrm{K}\times 128
$$

 b).
The macros operate at 

$$
200
$$

 MHz, providing 

$$
16\times 128
$$

 b per cycle and

$$
51.2
$$

 GB/s of local read bandwidth.
Eight even/odd address groups assemble a 

$$
2048
$$

 b frame.
Unit IO crosses that frame through a dual-clock FIFO into the 

$$
400
$$

 MHz PE
domain and repacks it into MXFP8 rows: 128 E4M3 elements plus four E8M0 scale
bytes.
The same interface selects a local PE destination or injects the read-out into
the core mesh.

The PE is a four-token by 128-lane FP8 array.
It performs 512 MACs per cycle, or approximately 

$$
400
$$

 GFLOPS, while holding
four activation vectors stationary and broadcasting each weight row across them.
Fixed-point accumulators emit BF16 results through an 

$$
8
$$

 KiB partial-sum
buffer, which is also the unit’s core-mesh boundary.

#### Dataflow and balance.

For a four-token job, Unit IO installs four activation rows in the PE and
advances the resident expert shard one 128-element weight row at a time.
Each row is consumed by all four token lanes in the 400 MHz domain while the
200 MHz macros prepare the next frame.
Accumulation remains local across the reduction dimension; only the completed
BF16 partial vector enters the output buffer.
Gate and up-projection shards follow this path, the digital PE applies the
activation, and the down-projection shard produces the vector reduced at the
next hierarchy level.
Ordinary execution therefore spends neither Die-NoC nor package bandwidth on
weights.
Pooling changes only the destination of a frame: Unit IO may inject the same
read-out into the Core mesh so borrowed PE groups apply it to different
four-token jobs.

The unit balance is 

$$
400/51.2=7.81
$$

 FLOP/byte.
A width-

$$
w
$$

 input-stationary tile offers 

$$
2w
$$

 FLOP/byte, so Eq. [1]
requires 

$$
2w\geq 7.81
$$

; 

$$
w{=}4
$$

 is the narrowest integer width that can reach peak
compute.
Every hierarchy level scales compute and local read bandwidth by the same unit
count, preserving 

$$
0.128
$$

 bytes/FLOP.

#### Hierarchy instantiation.

The reference model uses a 

$$
20{\times}20
$$

 mm 12 nm die budgeted as

$$
268
$$

 mm2 ReRAM, 

$$
50
$$

 mm2 NoC/D2D, and 

$$
82
$$

 mm2 logic, using
reported same-node 1T1R macro density [[11]].
A die contains 320 units as 20 side-4 cores (

$$
1.25
$$

 GiB, 

$$
16.4
$$

 TB/s,

$$
128
$$

 TFLOPS FP8).
Four dies form a 

$$
5
$$

 GiB, 

$$
65.5
$$

 TB/s, 

$$
512
$$

 TFLOPS package; the reference
FFN pool uses 25 dies (

$$
31.25
$$

 GiB, 

$$
410
$$

 TB/s, 

$$
3.2
$$

 PFLOPS;
Table [III]), sized to hold the 

$$
30.1
$$

 GiB of Qwen3.5-35B FFN
weights.
Following IANUS-class practice of closing area/power as a first-class result
[[29]], Table [XII] (§[VII-E]) gives
the die area and power budget.
The 320 Units form a 

$$
16{\times}20
$$

 array, so a side-4 Core tiles the die
without remainder and exposes 20 Core routers as a 

$$
4{\times}5
$$

 Die-NoC mesh.

_TABLE III: ReXpert hardware hierarchy._

Level

Resident capacity

Local read BW

Peak FP8

B/FLOP

Unit

$$
4
$$

 MiB

$$
51.2
$$

 GB/s

$$
400
$$

 GFLOPS

$$
0.128
$$

Core

$$
4{\times}4
$$

 units, 

$$
64
$$

 MiB

$$
819.2
$$

 GB/s

$$
6.4
$$

 TFLOPS

$$
0.128
$$

Die

$$
16{\times}20
$$

 units, 

$$
20
$$

 cores, 

$$
1.25
$$

 GiB

$$
16.4
$$

 TB/s

$$
128
$$

 TFLOPS

$$
0.128
$$

Package

$$
4
$$

 dies, 

$$
5
$$

 GiB

$$
65.5
$$

 TB/s

$$
512
$$

 TFLOPS

$$
0.128
$$

Node

$$
8
$$

 chips, 

$$
40
$$

 GiB

$$
524
$$

 TB/s

$$
4.1
$$

 PFLOPS

$$
0.128
$$

- • 

Read bandwidth sums local ReRAM ports and excludes interconnect (Table [IV]).
Unit primitives:

$$
16\times 128
$$

 b @ 

$$
200
$$

 MHz 

$$
=51.2
$$

 GB/s and a 

$$
4
$$

-token 

$$
\times
$$

$$
128
$$

-lane FP8 PE @ 

$$
400
$$

 MHz 

$$
=400
$$

 GFLOPS; upper levels scale by unit
count, holding B/FLOP constant (§[IV-B]).

### IV-C Core-Local Pooling and Broadcast

![Refer to caption]

_Fig. 6: Core-local pooling. (a) Sharing is bounded to the core: idle PE
groups pool for one resident hot expert. (b) Its read-out is multicast to
borrowers holding disjoint tokens; no weight is replicated—the gain is
fewer critical-path rounds._

A core connects 

$$
K=\mathrm{side}^{2}
$$

 units through a multicast/reduction mesh.
Its 

$$
K
$$

 PE groups may execute their local experts independently, or borrow
groups for one resident hot expert.
The selected side-4 core therefore combines 16 units, 

$$
64
$$

 MiB, 16 read ports,
and 16 PE groups.
Pooling changes neither the physical tile nor the jobs it issues; it changes how
many groups can make progress on those jobs concurrently.

#### One routed wave.

The placement table maps each routed 

$$
(\text{token},\text{expert})
$$

 pair to the
Core that stores the corresponding shard.
The Die NoC delivers the activation to that Core; the Core scheduler groups pairs
by expert into width-four jobs and records the owner Unit for each resident
read-out.
Full local jobs begin immediately; underfilled jobs remain valid; overflow from
a hot owner enters broadcast only after the scheduler identifies idle
borrowers.
This ordering keeps the common path point-to-point and invokes the high-rate mesh
only for imbalance.

#### Two-stage broadcast dataflow.

The scheduler first serves resident experts through each owner’s local
input-stationary path.
If one expert has more tiles than its neighbors, a second stage multicasts that
expert’s read-out and assigns remaining tokens to idle groups.
As a worked example matching the measured skew (§[III]),
consider one hot expert with 

$$
40
$$

 queued jobs co-resident with three cold
experts holding one job each at 

$$
w{=}4
$$

: direct execution takes ten
rounds: the three one-token experts each issue one underfilled local job, while
the hot expert serializes ten full jobs, giving occupancy

$$
13/(10{\times}4)=32.5\%
$$

.
Broadcast preserves the same 13 issued jobs (ideal MFU 

$$
83\%
$$

) but schedules them
over four groups in four rounds at 

$$
81.25\%
$$

 occupancy.
Borrowers receive the same weight row but hold disjoint token activations; their
BF16 partials reduce back to the owner before one result leaves the Core.
No expert is copied or reprogrammed—the gain is shorter critical-path rounds
and fewer repeated local reads of the same weights
(Fig. [6]).

#### Bounded pooling degree.

Increasing 

$$
K
$$

 exposes more groups to a hot read-out, but mesh diameter grows
approximately as 

$$
2\sqrt{K}
$$

 and each larger core concentrates multicast demand.
ReXpert fixes side 

$$
=
$$

 4 as the bounded sharing domain: it tiles the

$$
16\times 20
$$

 unit floorplan into 20 cores while keeping weight movement local.
§[V] sizes the corresponding multicast fabric, and
§[VII-C] evaluates the occupancy–network-cost knee.
On the default Qwen3.5-35B-A3B Alpaca trace, side-4 pooling raises occupancy from

$$
0.328
$$

 at side 2 to 

$$
0.519
$$

 and actual MFU from 

$$
0.240
$$

 to 

$$
0.381
$$

 (ideal MFU
stays at 

$$
0.736
$$

—mean load is four tokens/expert, but the cold tail underfills
tiles); larger domains suffer 

$$
1.69
$$

–

$$
2.50\times
$$

 round stretch.
After network cost, side 4 minimizes silicon-per-delivered-occupancy.

### IV-D Tile Width and Cross-Core Balance

Narrowing 

$$
w
$$

 appears to improve ideal MFU because fewer token slots must be
filled, but it simultaneously lowers arithmetic intensity.
On the balanced unit, the attainable peak fraction is capped by

$$
\min(1,2w/7.8125)
$$

: 

$$
0.256
$$

 for 

$$
w{=}1
$$

, 

$$
0.512
$$

 for 

$$
w{=}2
$$

, and one for

$$
w{=}4
$$

.
The relevant quantity is therefore the *roofline-adjusted ideal MFU*;
narrow masks also require more read-outs for the same token set.
Hence 

$$
w{=}4
$$

 remains the balanced physical tile, while pooling recovers
occupancy without sacrificing its reuse.
The measured width sweep is reported in §[VII-C].

Across cores, pooling absorbs skew within a core; placement controls which
experts share that finite budget.
ReXpert estimates expert load and pairwise coactivation from a profiling window,
spreads frequently co-fired hot experts across cores, and pairs hot experts with
colder ones within each core.
Placement is semi-static: it changes metadata rather than rewriting resident
ReRAM weights.
At the selected side-4, 

$$
G{=}16
$$

 point, this policy raises measured occupancy

$$
0.519\to 0.532
$$

 and reduces rounds from 

$$
2.16
$$

 to 

$$
2.07
$$

relative to load-only LPT placement.

Load-aware token fetch is the dynamic complement.
When a core would otherwise be idle, the scheduler may fetch queued tokens
already routed to its resident experts and execute them ahead of FIFO order.
Unlike EARTH’s speculative expert prefetch, which changes what weights move
[[20]], fetch here only reorders tokens already routed to resident
experts inside a bounded continuous-batch queue.
With only 

$$
G{=}2
$$

 PE groups per core, a depth-

$$
16\times
$$

 load-aware queue
raises occupancy 

$$
0.422\to 0.552
$$

; at side-4 with 

$$
G{=}16
$$

, pooling has
already absorbed most of that imbalance.
Fetch is therefore a bounded latency–occupancy exchange for residual queue
variation, not an additional source of peak throughput.

#### Summary.

The balanced 

$$
w{=}4
$$

 tile protects ideal MFU; occupancy is recovered primarily
by bounded multicast, with placement and fetch providing secondary recovery;
weights appear on the Core mesh only as a bounded local exception.
§[V] sizes the fabrics these mechanisms induce.

## V Parallelism and Interconnect Analysis

Residency removes sustained weight traffic above the core mesh; pooling is the
local exception that multicasts hot-expert read-outs inside a core.
We size each level from demand that can overlap the resident array stream:

$$
\displaystyle t_{\mathrm{layer}}
$$

$$
\displaystyle=D_{\mathrm{used}}t_{\mathrm{col}},\quad B_{\ell}^{\mathrm{req}}=V_{\ell}/t_{\mathrm{layer}},
$$

$$
\displaystyle V_{\ell}
$$

$$
\displaystyle=n_{\mathrm{tok}}\bigl(\phi_{\ell}^{\mathrm{act}}d+\phi_{\ell}^{\mathrm{psum}}2d\bigr),
$$

(3)

with 

$$
t_{\mathrm{col}}=2.5
$$

 ns and 

$$
\phi
$$

 counting dispatch/reduction after
in-network combining.
Experts are chunked along the reduction dimension into 

$$
128
$$

-aligned shards; die

$$
j
$$

 stores shard 

$$
j
$$

 of every expert and a core holds 16 partial experts, which
fixes the matched reduction order below (Fig. [7]).

![Refer to caption]

_Fig. 7: Parallel mapping and reduction order.
(a) Intra-expert tensor parallelism: each 128-slice of the reduction dimension
is a self-contained chunk that emits one 

$$
d
$$

-wide BF16 PSUM.
(b) Placement: die 

$$
j
$$

 stores shard 

$$
j
$$

 of every expert and a core holds 16
partial experts, keeping pooling core-local.
(c) Expert-parallel-first reduction matches this placement; the reversed order
inflates package D2D traffic up to 

$$
5.7\times
$$

._

Average demand does not bound bursts, so the Core mesh is checked at p99 and peak.

### V-A Per-Level Semantics

Each level has a distinct physical job; provisioning one aggregate bandwidth
number cannot establish that pooling remains local.

Unit ports.
A four-token wave exchanges 

$$
4d
$$

/

$$
8d
$$

 activation/partial bytes on a private path
that never carries other Units’ weights.

Core mesh.
This is the only weight-carrying fabric: cold experts stay local; hot read-outs
multicast and BF16 partials reduce to one Core endpoint before leaving the Core.

Die NoC.
A 

$$
4{\times}5
$$

 mesh of 20 cores carries activation dispatch and combined
partials; busiest-link demand is a routed quantity after Core-local combining.

Package D2D and node.
These links move activations/partials and the inter-layer residual only—never
steady-state FFN weights.
CHIME provisions the complementary attention pool [[21]]; multi-unit
MoE EP movement is orthogonal once weights are resident [[33]].

### V-B Provisioning Results

_TABLE IV: Per-level communication demand and selected provisioning._

Path

Demand

Selected provision

Evidence scope

Unit external I/O

$$
1.57
$$

 GB/s

$$
51.2
$$

 GB/s

modeled

Core mesh

$$
51.2
$$

 GB/s/stream;

$$
204.8
$$

 p99

$$
64
$$

 GB/s/link;

$$
256
$$

 GB/s/core

Qwen3.5 trace

Die NoC, busiest link

$$
24.68
$$

–

$$
24.81
$$

 GB/sb

$$
64
$$

 GB/s/link

GLM BookSim2

Package D2D, per die

$$
47.0
$$

 GB/s

$$
96
$$

 GB/s

modeled

Node residual

$$
16.7
$$

 GB/s

$$
34
$$

 GB/s

modeled

- a 

Qwen3.5-35B-A3B aggregate core-mesh demand. The selected

$$
256
$$

 GB/s covers p99.

- b 

The two values are expert-parallel-first and
tensor-parallel-first for GLM-5.2. Both on-die links are 

$$
512
$$

 b at 1 GHz.

BookSim2 shows GLM-5.2’s Die-NoC busiest link at 

$$
24.7
$$

–

$$
24.8
$$

 GB/s, so a

$$
512
$$

 b/1 GHz (

$$
64
$$

 GB/s) link is the narrowest viable point.
The Core mesh is sized by an indivisible 

$$
51.2
$$

 GB/s read-out (

$$
\geq
$$

$$
410
$$

 b at
1 GHz; we select 

$$
512
$$

 b).
Qwen3.5-35B concurrent multicast reaches 

$$
204.8
$$

 GB/s p99 and 

$$
307.2
$$

 GB/s
peak; the
selected 

$$
256
$$

 GB/s per-core budget covers p99 (five streams), not the peak.
Unicast replication is infeasible (

$$
15\times
$$

 source port; 

$$
3.6\times
$$

 traffic),
so multicast is a pooling prerequisite.
At this fabric point the joint DSE selects 

$$
4{\times}4
$$

 cores (

$$
44\%
$$

 less
silicon per delivered throughput than the next-best size).
DSENT with 12 nm-scaled device parameters puts the Core-mesh area at

$$
35.6
$$

 mm2, within the 

$$
50
$$

 mm2 NoC/D2D budget.
Off-die modeled demand is 

$$
47.0
$$

 GB/s D2D/die and 

$$
16.7
$$

 GB/s node residual,
provisioned at 

$$
96
$$

 and 

$$
34
$$

 GB/s (Table [IV]).

### V-C Placement-Matched Reduction Order

Expert-parallel-first reduction merges same-index shards on-die before the
tensor-parallel merge crosses dies.
The reverse order inflates GLM-5.2 intra-package D2D from 

$$
37.6
$$

 to

$$
213.1
$$

 GB/s (

$$
5.7\times
$$

) while barely moving Die-NoC load
(

$$
24.68\to 24.81
$$

 GB/s); Qwen3.5-397B and Qwen3.5-35B see 

$$
2.7\times
$$

 and

$$
5.7\times
$$

 D2D penalties.
Favorable provisioning therefore requires matching reduction order to placement:
the hierarchy that stores shards must also be the hierarchy that combines them.

### V-D Array-Depth Design Space

Array depth sets storage density at a fixed column rate, and therefore
the hide time available to communication.
The Unit in §[IV-B] stores 

$$
4
$$

 MiB as 

$$
32
$$

K weight
columns and streams them at 

$$
t_{\mathrm{col}}{=}2.5
$$

 ns
(

$$
51.2
$$

 GB/s).
A shallower array finishes the resident read sooner, emits the BF16
partial sooner, and shortens 

$$
t_{\mathrm{layer}}
$$

, so

$$
B_{\ell}^{\mathrm{req}}{=}V_{\ell}/t_{\mathrm{layer}}
$$

 rises.
A 

$$
128
$$

-aligned chunk costs 

$$
3d
$$

 columns; below that quantum the expert
folds into more tensor-parallel shards and cross-die volume grows as
well.

Fig. [8] sweeps depth at that fixed rate.
On Qwen3.5-35B, 

$$
16
$$

K versus 

$$
32
$$

K halves layer time
(

$$
61.8{\to}31.1\,\mu
$$

s), opens a D2D path the single-shard mapping did
not need (

$$
0{\to}12.7
$$

 GB/s/die), doubles the busiest Die-NoC link, and
grows the pool 

$$
25{\to}49
$$

 dies.
Qwen3.5-397B shows the same 

$$
2.0\times
$$

 time–bandwidth exchange
(D2D 

$$
30.3{\to}59.9
$$

 GB/s/die; TP 

$$
4{\to}8
$$

).
GLM-5.2 cannot map at 

$$
16
$$

K: one chunk is 

$$
18432
$$

 columns.
Deepening to 

$$
48
$$

K reverses the trade—

$$
397
$$

B and GLM stretch the pulse
by 

$$
2.0\times
$$

 and cut D2D roughly in half, reducing die count
(

$$
289{\to}193
$$

, 

$$
543{\to}362
$$

).

$$
24
$$

K is a packing point, not a latency point: 

$$
35
$$

B and 

$$
397
$$

B reach

$$
100\%
$$

 array utilization at the same 

$$
t_{\mathrm{layer}}
$$

 as 

$$
32
$$

K
because occupied columns do not grow.

The 

$$
32
$$

K Unit is a feasible density that keeps modeled D2D under the

$$
96
$$

 GB/s provision of Table [IV] for all three models.
A shallower array is faster only if the hierarchy is resized with it;
§[V-B] reports the 

$$
32
$$

K budget.

_Fig. 8: Array depth at fixed column rate. Top: 

$$
t_{\mathrm{layer}}
$$

shortens at 16K, holds while 

$$
D_{\mathrm{used}}
$$

 is unchanged
(24K–32K), then stretches when TP coarsens (48K). Bottom: D2D demand
is the inverse; the dashed line is the 

$$
96
$$

 GB/s/die provision._

## VI Evaluation Methodology

All quantitative claims in this paper are a
*measured

$$
+
$$

modeled hybrid analysis*:
router-hook MoE traces and GPU grouped-GEMM kernel calibration supply the
measured inputs; a kernel-calibrated roofline, BookSim2

$$
+
$$

DSENT networks, and
an RTL/DSENT/UCIe die cost model project the ReXpert FFN pool and AF system.
We do not claim silicon measurements of ReXpert itself.

#### Workloads and measurement scope.

We evaluate three FP8 MoE models spanning the deployment range:
Qwen3.5-35B-A3B (256 experts, top-8, 40 layers),
Qwen3.5-397B-A17B (512 experts, top-10, 60 layers), and
GLM-5.2 (256 experts, top-8, 75 MoE layers).
Skew, pooling, placement, fetch, and expert-union inputs use router-hook
measurements on all three models: Qwen3.5-35B on eight H20 GPUs, and
Qwen3.5-397B and GLM-5.2 on their serving clusters.
To cover workload diversity and batch effects
[[21], [33], [10]], each campaign captures
Alpaca at the native tile-fill batch with two seeds, a HumanEval/code batch
at the same batch, and *independent* Alpaca runs at

$$
B{\in}\{8,64\}
$$

 (Table [VI] details 35B and 397B; GLM-5.2
uses the same protocol at 

$$
B{=}205
$$

).
The default trace is Alpaca decode at the native tile-fill batch
(

$$
B{=}128
$$

 for 35B; 

$$
B{=}205
$$

 for 397B and GLM-5.2), which sets the mean
tokens/expert to four—matching the 

$$
w{=}4
$$

 physical tile.
Unless a table states otherwise, mechanism numbers (ideal MFU, occupancy,
straggler, fetch) are from these traces; capacity and interconnect sizing
use the corresponding model shapes.
We do not re-implement Tutel/FasterMoE/MoE-Lightning as quantitative
baselines: on decode their throughput is bounded above by the HBM roofline we
already grant the GPU hardware; Table [XIII] positions them
qualitatively.

#### Performance model.

Per-expert latency is

$$
\max(t_{\mathrm{compute}},t_{\mathrm{weight\ read}})+t_{\mathrm{comm}}
$$

[[31], [2]], using
Tables [III] and [IV].
Weight traffic is 

$$
L(U(B)P_{e}+\text{router})
$$

 bytes per step; measured per-layer
unions match the independence model within 

$$
3\%
$$

 on the default trace.
BookSim2+DSENT models the Core mesh and Die NoC; pool latency, energy, and
AF TPOT are therefore projected from measured traces and calibrated
parameters, not from a ReXpert prototype.
The array-depth sweep (§[V-D]) holds the Unit column
rate fixed at 

$$
51.2
$$

 GB/s and varies only resident columns
(

$$
16
$$

K–

$$
48
$$

K), so 

$$
t_{\mathrm{layer}}
$$

 and

$$
B_{\ell}^{\mathrm{req}}
$$

 move together; mapping A and the EP-first
reduction of §[V] are reused.
Both sides use the same straggler-free roofline, and the GPU side is
calibrated: grouped-GEMM decode kernels replaying the captured routing reach

$$
88
$$

–

$$
94\%
$$

 of datasheet HBM stream bandwidth and the roofline
matches measured kernel time within 

$$
7\%
$$

.
Baselines are credited with *full* stream bandwidth and no kernel-launch
or software overhead throughout, so cross-system gaps are architecture-level
bandwidth-density bounds (§[VII-B] reports scheduling from the
same measured traces).
The AF-disaggregated system (§[VII-D]) pairs the same FFN
roofline with an H20 attention stage (proj

$$
+
$$

KV) under iso-compute die counts,
in the spirit of CHIME’s A/F sizing: the AF pipeline overlaps stages
(TPOT 

$$
=\max(t_{\mathrm{attn}},t_{\mathrm{FFN}})
$$

), while the homogeneous-H20
baseline runs both stages on the same dies
(TPOT 

$$
=t_{\mathrm{attn}}+t_{\mathrm{FFN}}
$$

).
Attention shapes for all three models come from the served checkpoint
configurations.
ReRAM bandwidth sensitivity scales the nominal ReXpert read BW at fixed
peak compute.

#### Baselines and normalization.

Table [V] applies the same roofline to H20 and H100/H800 pools
at equal capacity, equal peak compute, and equal read bandwidth
(Table [VIII]); equal peak compute is the headline.
Table [VII] isolates weight-movement energy; system power and
energy per token are modeled end-to-end over the FFN pool
(§[VII-E]).

#### Metrics.

Eq. [2] defines ideal MFU, occupancy, and actual MFU.
Mesh studies also report round stretch and
effective MFU 

$$
=\text{actual MFU}/\text{stretch}
$$

.
Tile-width uses *roofline-adjusted ideal MFU* (fill 

$$
\times
$$

 width cap).
Default: 

$$
N{=}20
$$

 cores/die, 

$$
G{=}16
$$

 PE groups/core, tile width 

$$
w{=}4
$$

,
broadcast at the selected 

$$
4{\times}4
$$

point.

_TABLE V: MoE FFN-pool hardware baselines._

Cap.
Read BW
Peak
Dies to equalizea

System
/die
/die
/die
Cap.
Comp.
BW

(GiB)
(TB/s)
(TF)

H100/H800 SXMb
80
3.35
1979
1
1.6
122

H20b
96
4.00
296
1
10.8
102

ReXpert
1.25
16.4
128
25
25
25

- a 

Dies to match our 25-die pool, sized for the 

$$
30.1
$$

 GiB FFN weights,
on capacity, peak compute (

$$
3200
$$

 TFLOPS), or read bandwidth (

$$
410
$$

 TB/s).
We report all three
because no single one is neutral; Table [VIII] gives the latencies each
implies.

- b 

Dense FP8, not the sparsity-inflated datasheet peaks. H800 shares the
H100 SXM memory system and FP8 rate, differing in NVLink (

$$
400
$$

 vs 

$$
900
$$

 GB/s).

_TABLE VI: Routing-campaign robustness (64 decode steps per run)._

Model
Workload

$$
B
$$

Seed
Gini
Hot/mean

$$
U(B)
$$

35B
Alpaca (default)
128
0
0.491

$$
6.77\times
$$

205.0

Alpaca
128
1
0.471

$$
6.58\times
$$

210.2

Code (HumanEval)
128
0
0.522

$$
9.89\times
$$

202.5

Alpaca (indep.)
8
0
0.583

$$
9.31\times
$$

50.1

Alpaca (indep.)
64
0
0.480

$$
6.43\times
$$

173.1

397B
Alpaca (default)
205
0
0.534

$$
12.5\times
$$

376.2

Alpaca
205
1
0.536

$$
13.3\times
$$

377.6

Code (HumanEval)
205
0
0.554

$$
18.2\times
$$

370.3

Alpaca (indep.)
8
0
0.619

$$
13.7\times
$$

65.1

Alpaca (indep.)
64
0
0.558

$$
13.1\times
$$

250.7

- • 

Default batch is the native tile-fill point (

$$
B^{*}{=}4E/k
$$

: 128 for
35B, 205 for 397B).
The 

$$
B{\in}\{8,64\}
$$

 captures are independent serving runs, not derived
from the default trace; sliced 

$$
U(B)
$$

 from the default trace matches these
natives within 

$$
4\%
$$

 on 35B (

$$
47.9
$$

 vs 

$$
50.1
$$

 at 

$$
B{=}8
$$

) and 

$$
1\%
$$

 on 397B
(

$$
65.4
$$

 vs 

$$
65.1
$$

 at 

$$
B{=}8
$$

).
Code is more skewed than Alpaca at the matched default batch, but 

$$
U(B)
$$

stays within 

$$
4\%
$$

 of the Alpaca union on both models.

## VII Evaluation

We report a measured

$$
+
$$

modeled hybrid analysis
(§[VI]): measured traces drive MFU-cascade mechanisms; calibrated
models project bandwidth-density gains, interconnect headroom, AF serving, and
area/power across the three-model range.

### VII-A RQ1: FFN-Pool Latency and Weight-Movement Energy

At iso-peak-compute (Fig. [9]), ReXpert reduces
FFN-pool latency by 

$$
9.5\times
$$

 vs H20 and 

$$
75.6\times
$$

 vs
H100/H800 on Qwen3.5-35B at 

$$
B{=}8
$$

 (

$$
1.93
$$

 vs 

$$
18.26
$$

/

$$
145.8\,\mu
$$

s/token).
The same resident-pool construction scales to
Qwen3.5-397B-A17B (289 dies, 

$$
1.30\,\mu
$$

s/token) and
GLM-5.2 (543 dies, 

$$
2.07\,\mu
$$

s/token) on their measured traces: because every hierarchy level holds

$$
0.128
$$

 B/FLOP, both sides stay read-bound through 

$$
B{=}64
$$

 on all three
models and the iso-compute ratio remains 

$$
9.5\times
$$

/

$$
75.6\times
$$

independent of model scale.
This constancy follows from both sides being read-bound: the iso-compute gap
equals the read-bandwidth-density ratio of the two memory systems, a property
of weight residency rather than of scheduling.
These are FFN-pool results, not whole-model TPOT
[[7], [21]]; §[VII-D] presents the
system-level comparison.

_Fig. 9: Iso-peak-compute FFN-pool latency per token across the three models. With both pools read-bound, the gaps track
the read-bandwidth-density ratios—

$$
9.5\times
$$

 vs H20, 

$$
75.6\times
$$

 vs
H100/H800._

Both systems move 

$$
331
$$

 MB/token of activated weights at 

$$
B{=}64
$$

; at

$$
4.00
$$

 vs 

$$
0.20
$$

 pJ/byte the store-energy ratio is exactly 

$$
20\times
$$

(Table [VII]).
Under equal-bandwidth normalization (Table [VIII]), matching our
aggregate read bandwidth requires 

$$
{\sim}100
$$

 GPU dies and erases the latency
advantage: the gain arises from bandwidth *density*, not aggregate
bandwidth.
Scaling ReRAM BW by 

$$
0.5
$$

–

$$
2\times
$$

 at fixed peak compute moves the

$$
B{=}8
$$

 H20 gap from 

$$
4.7\times
$$

 to 

$$
18.9\times
$$

, confirming that the
advantage tracks read bandwidth while ReXpert stays read-bound.

_TABLE VII: Capacity and weight-movement energy at 

$$
B{=}64
$$

._

Diesa
Weight
Off-chip
Weight-move
Rel.

System
(30 GiB)
(MB/tok)b
(MB/tok)
energy (

$$
\mu
$$

J/tok)
energy

HBM-GPU (H20)
1
331
331
1326

$$
20\times
$$

ReXpert
25
331
0
66

$$
1\times
$$

ReXpert without broadcast poolingc
420
0
84

$$
1.3\times
$$

- a 

Dies needed to hold the 

$$
30.1
$$

 GiB of FFN expert weights
(Qwen3.5-35B-A3B-FP8).

- b 

$$
L\cdot U(B)\cdot P_{e}/B
$$

 with the measured union 

$$
U(64){=}168.6
$$

 of 

$$
256
$$

experts: each activated expert is fetched once per step, by HBM grouping on the GPU
and by one broadcast ReRAM read-out on ReXpert. Energy counts weight movement only, at

$$
4.00
$$

 (HBM) and 

$$
0.20
$$

 (ReRAM) pJ/byte, so the ratio is exactly 

$$
E_{\text{HBM}}/E_{\text{ReRAM}}
$$

 at every batch.

- c 

One read-out per four-token PE job instead of one per expert:

$$
213.5
$$

 PE jobs vs 

$$
168.6
$$

 union read-outs per layer. Pooling is a weight-traffic
mechanism, not only a latency one.

_TABLE VIII: FFN-pool latency under equal-compute and equal-bandwidth
normalization._

Per-token (

$$
\mu
$$

s)
ReXpert faster by

Held equal
SKU
Dies

$$
B{=}8
$$

$$
B{=}64
$$

$$
B{=}8
$$

$$
B{=}64
$$

Peak compute
H100/H800
1.6
145.8
61.25

$$
75.6\times
$$

$$
75.6\times
$$

H20
10.8
18.26
7.67

$$
9.5\times
$$

$$
9.5\times
$$

Read bandwidth
H100/H800
122
1.93
0.81

$$
1.0\times
$$

$$
1.0\times
$$

H20
102
1.93
0.81

$$
1.0\times
$$

$$
1.0\times
$$

ReXpert
25
1.93
0.81
—
—

- • 

Equal-bandwidth rows match ReXpert at every reported batch because the measured

$$
U(B)
$$

 keeps ReXpert read-bound through 

$$
B{=}64
$$

; reaching our bandwidth takes

$$
102
$$

–

$$
122
$$

 GPU dies against our 

$$
25
$$

 (single-die equal-capacity pools are

$$
102
$$

–

$$
122\times
$$

 slower).

### VII-B RQ2: MFU Cascade Ablations

Table [IX] separates mechanisms under the factorization of
Eq. [2].
Broadcast, coactivation, and fetch move occupancy (and thus actual MFU) at
nearly fixed ideal MFU; gains are not additive across rows because each row
holds a different baseline configuration.
Broadcast is the primary occupancy lever at the side-4 point; placement and
fetch provide secondary recovery once the core mesh is fixed.

_TABLE IX: Per-mechanism ablations at the side-4 operating point._

Mechanism (A

$$
\to
$$

B), config
Ideal MFU
Occupancy
Actual MFU
Rounds/str.

Mask 

$$
w{=}4\to 1
$$

a

(

$$
B{=}8
$$

, 

$$
G{=}16
$$

)

0.346

$$
\to
$$

1.000
0.152

$$
\to
$$

0.199
0.050

$$
\to
$$

0.199
1.00

$$
\to
$$

1.01

Bcast: direct

$$
\to
$$

bcast

(contiguous, 

$$
G{=}16
$$

)

0.736

$$
\to
$$

0.736
0.152

$$
\to
$$

0.510
0.111

$$
\to
$$

0.374
8.89

$$
\to
$$

2.21

Place: LPT

$$
\to
$$

coact

(bcast, 

$$
G{=}16
$$

)

0.736

$$
\to
$$

0.736
0.519

$$
\to
$$

0.532
0.381

$$
\to
$$

0.391
2.16

$$
\to
$$

2.07

Fetch: FIFO

$$
\to
$$

load-awareb

(bcast, 

$$
G{=}2
$$

)

1.000

$$
\to
$$

0.778
0.422

$$
\to
$$

0.552
0.422

$$
\to
$$

0.420
2.45

$$
\to
$$

2.03

- • 

The parenthesized configuration is held fixed while the mechanism is
toggled; actual MFU 

$$
=
$$

 ideal MFU 

$$
\times
$$

 occupancy (Eq. [2]).
Default Qwen3.5-35B Alpaca trace.

- a 

The width row uses roofline-adjusted ideal MFU
(§[IV-D]).

- b 

Load-aware fetch admits narrower jobs to keep borrower PEs busy:
ideal MFU falls while occupancy rises; the net gain is the round-count drop.

### VII-C RQ3: Pooling Knee, Placement, Fetch, and Tile Width

Pooling has a bounded optimum (Table [X]).
Side-

$$
4
$$

 raises Qwen3.5-35B occupancy 

$$
0.328\to 0.519
$$

 and actual MFU

$$
0.240\to 0.381
$$

 (ideal MFU stays at 

$$
0.736
$$

), while larger domains raise
occupancy further but stretch rounds (

$$
1.69
$$

–

$$
2.50\times
$$

) so effective MFU
falls.
After BookSim2+DSENT network area, side 4 also minimizes the network area
spent per unit of delivered occupancy (mm2/occ. in
Table [X]); the measured Qwen3.5-397B trace reproduces the
same knee.

_TABLE X: Core-pooling design-space sweep under measured routing._

Model
Core
Ideal
Occupancy
Actual
Round
Effective
Net
mm2/

MFU
bcast
direct
MFU
stretch
MFU
mm2
occ. 

$$
\downarrow
$$

Qwen3.5

$$
2{\times}2
$$

0.736
0.328
0.158
0.240

$$
1.00\times
$$

0.240
26.0
11.96

$$
\mathbf{4{\times}4}
$$

0.736
0.519
0.154
0.381

$$
\mathbf{1.23\times}
$$

0.310
28.4
7.56

$$
6{\times}6
$$

0.736
0.532
0.155
0.391

$$
1.69\times
$$

0.231
30.6
10.88

$$
8{\times}8
$$

0.736
0.678
0.182
0.499

$$
2.50\times
$$

0.200
25.1
11.27

Qwen3.5-397B

$$
2{\times}2
$$

0.756
0.377
0.174
0.280

$$
1.03\times
$$

0.273
26.0
4.42

$$
\mathbf{4{\times}4}
$$

0.756
0.599
0.176
0.447

$$
\mathbf{1.31\times}
$$

0.341
28.4
3.00

$$
6{\times}6
$$

0.756
0.675
0.172
0.506

$$
1.73\times
$$

0.293
30.6
3.29

$$
8{\times}8
$$

0.756
0.803
0.212
0.603

$$
2.02\times
$$

0.298
25.1
3.28

- • 

Metrics per Eq. [2]; effective MFU

$$
=\text{actual}/\text{stretch}
$$

; mm2/occ. is network area per delivered
occupancy; network area from BookSim2+DSENT.
Each model at its native tile-fill batch (35B: 

$$
B{=}128
$$

; 397B: 

$$
B{=}205
$$

).

Coactivation-aware placement provides secondary recovery
(Table [IX]: occupancy 

$$
0.519\to 0.532
$$

, rounds

$$
2.16\to 2.07
$$

); load-aware fetch helps mainly when few PE groups share a
core (

$$
G{=}2
$$

: 

$$
0.422\to 0.552
$$

 occupancy), since side-4 pooling at

$$
G{=}16
$$

 already absorbs most residual imbalance.
Tile narrowing is a negative result (Table [IX]): at

$$
B{=}8
$$

, 

$$
w{=}4\to 1
$$

 lifts ideal MFU 

$$
0.346\to 1.000
$$

 but the
roofline-adjusted peak falls to 

$$
0.256
$$

, so 

$$
w{=}4
$$

 remains the
resource-balanced choice.
The architecture therefore keeps the balanced tile and recovers occupancy by
sharing a read-out, rather than by shrinking the job.

### VII-D RQ4: AF-Disaggregated Serving with an H20 Attention Pool

We now assemble the AF system the architecture targets: H20 dies execute
attention (projections 

$$
+
$$

 KV reads), ReXpert executes the MoE FFN, and the
two stages pipeline across decode waves—the polarity Raptor argues for MoE
serving [[24]].
Table [XI] compares it against a homogeneous H20 pool of the same
die count serving both stages.
On Qwen3.5-35B the AF split lowers decode TPOT by 

$$
1.25
$$

–

$$
4.0\times
$$

 at

$$
4
$$

K–

$$
32
$$

K context; the gain grows with model scale
(

$$
2.4
$$

–

$$
10.3\times
$$

 on 397B, 

$$
2.5
$$

–

$$
10.4\times
$$

 on
GLM-5.2) because the larger resident pools pair with proportionally larger
attention pools, whose KV reads then dominate less of the serial baseline.
When context grows the AF system itself becomes attention-bound: matching
stage times at 

$$
32
$$

K needs 

$$
{\sim}7.5\times
$$

 more attention dies than FFN dies
at 

$$
B{=}8
$$

 on 35B (only 

$$
1.7\times
$$

 on 397B, whose FFN pool is
larger).
The provisioning quantity is thus the attention/FFN die ratio
[[21]].

_TABLE XI: AF-disaggregated serving (H20 attention 

$$
+
$$

 ReXpert FFN) vs a
homogeneous H20 pool. All three models use measured serving traces._

Model

$$
B
$$

Ctx

$$
t_{\mathrm{attn}}
$$

$$
t_{\mathrm{FFN}}
$$

TPOT (

$$
\mu
$$

s/tok)
AF

(

$$
\mu
$$

s)
(

$$
\mu
$$

s)
AF
H20-only
gain

Qwen3.5-35B
8
4K
6.06
1.93
6.06
24.3

$$
4.0\times
$$

8
32K
33.2
1.93
33.2
51.5

$$
1.55\times
$$

64
4K
4.15
0.81
4.15
11.8

$$
2.85\times
$$

64
32K
31.3
0.81
31.3
39.0

$$
1.25\times
$$

Qwen3.5-397B
8
4K
1.57
1.30
1.57
13.9

$$
8.8\times
$$

8
32K
5.10
1.30
5.10
17.4

$$
3.4\times
$$

64
4K
0.64
0.63
0.64
6.56

$$
10.3\times
$$

64
32K
4.16
0.63
4.16
10.1

$$
2.4\times
$$

GLM-5.2
8
4K
2.30
2.07
2.30
21.9

$$
9.5\times
$$

8
32K
6.99
2.07
6.99
26.6

$$
3.8\times
$$

64
4K
0.87
0.87
0.87
9.11

$$
10.4\times
$$

64
32K
5.56
0.87
5.56
13.8

$$
2.5\times
$$

- • 

Attention pool: iso-compute H20 dies (10.8 / 125 / 235 for the three
models); FFN pool: resident ReXpert dies (25 / 289 / 543).
AF pipelines the stages, TPOT 

$$
=\max(t_{\mathrm{attn}},t_{\mathrm{FFN}})
$$

;
the homogeneous baseline runs both on the attention dies,
TPOT 

$$
=t_{\mathrm{attn}}+t_{\mathrm{FFN,H20}}
$$

.
FFN-only decode TPOT, excluding EP/TP transfer overlap.
Latencies are not comparable across models: the larger models amortize
per-token KV and expert traffic over 

$$
10
$$

–

$$
20\times
$$

 more dies.

As in §[V], the provisioned fabric covers GLM’s busiest Die-NoC
link and Qwen3.5’s p99 multicast demand: the side-4 fabric is a
*provisioning* result—large enough for measured p99 demand, small
enough that further core growth loses to round stretch and mesh silicon.
That budget is the 

$$
32
$$

K-depth budget; §[V-D] shows that
halving depth to 

$$
16
$$

K doubles Die-NoC and D2D demand on the models that
still map, so a shallower array is not a free latency win.

### VII-E RQ5: Area, Power, and Limitations

Table [XII] closes the die budget.
The dominant area is the resident ReRAM array itself; the multicast Core mesh,
the price of bounded sharing, costs 

$$
35.6
$$

 mm2 and 

$$
19
$$

 W under DSENT’s
12 nm-scaled parameters—silicon that buys 

$$
44\%
$$

 more delivered occupancy
per mm2 than the next core size (RQ3).
Modeled end-to-end over the FFN pool (RTL-synthesized PE, DSENT network, and
ReRAM read energy under measured activity, and UCIe-calibrated D2D
[[5], [23]]), a die draws 

$$
\approx
$$

47 W, so
the 25-die Qwen3.5-35B pool draws

$$
\approx
$$

1.2 kW against 

$$
4.3
$$

 kW TDP for the iso-compute 10.8-die H20 pool
[[25]]: 

$$
3.7\times
$$

 lower power at 

$$
9.5\times
$$

 lower latency,
or 

$$
\approx
$$

35

$$
\times
$$

 lower FFN-pool energy per token—consistent with the

$$
20\times
$$

 weight-movement-only bound of Table [VII].

_TABLE XII: ReXpert die area and power budget (

$$
20{\times}20
$$

 mm, 12 nm)._

Component
Area (mm2)
Power (W)
Basis

ReRAM array (1T1R)
268
3.3
macro densitya; 

$$
0.2
$$

 pJ/B read

PE 

$$
+
$$

 scheduler
82
19.5
RTL, 12 nm synthesisc

Core mesh (

$$
512
$$

 b)
35.6b
19.0
BookSim2

$$
+
$$

DSENT, 12 nm

Die NoC (

$$
512
$$

 b)
2.2
1.8
BookSim2

$$
+
$$

DSENT, 12 nm

D2D 

$$
+
$$

 misc IO
12
3.0
UCIe PHY, 12 nm-scaledd [[5]]

Die total
400 (budget)

$$
\approx
$$

47
end-to-end FFN system model

- a 

Same-node reported 1T1R macro density [[11]].

- b 

DSENT router/link models with device parameters scaled to the
12 nm node; the Core mesh fits the 

$$
50
$$

 mm2 NoC/D2D budget.

- c 

From 12 nm RTL synthesis (

$$
0.4
$$

 pJ/FLOP), at FFN MFU 

$$
0.38
$$

.

- d 

Provisioned off-die bandwidth (Table [IV]:

$$
96{+}34{=}130
$$

 GB/s per die, both directions) at the UCIe
standard-package targets of 

$$
0.5
$$

 pJ/b and 

$$
{\sim}66
$$

 GB/s/mm2 at
16 GT/s [[5]], scaled to 12 nm.

Two limitations remain beyond the modeled pool.
First, the design assumes a once-programmed, read-mostly ReRAM weight store
at reported same-node macro density [[11]].
Embedded ReRAM still faces device variation, retention, endurance, and
yield headroom relative to mature logic SRAM/DRAM; closing those gaps—and
the ECC, verify, and refresh policies they imply—is a process and circuit
prerequisite for a production resident FFN pool, not a scheduling detail.
Second, PaCom shows that activation and reduction traffic is small against
the provisioned hierarchy (Table [IV]), but
*when* and *in what order* those messages share the Core mesh,
Die NoC, and D2D links under routing skew is still open:
contention-aware multicast arbitration, token-fetch versus compute
overlap, and cross-die reduction scheduling are left for further study.

## VIII Related Work

_TABLE XIII: Closest systems vs ReXpert (qualitative)._

System
Locus
Skew/AFD handle
Diff. from us

PUMA [[1]]
ReRAM CIM
—
fixed tile–MAC bind

NeuPIMs [[10]]
DRAM-PIM+NPU
attn GEMV on PIM
FFN on NPU

PAPI [[9]]
GPU+hybrid PIM
dynamic FC offload
kernel steering

IANUS [[29]]
NPU–PIM
—
area/power closure

CENT [[7]]
CXL near-bank
e2e LLM
no fill pooling

Raptor [[24]]
3D-DRAM
GPU-attn AFD
DRAM; no pooling

DIAMoND [[19]]
NAND+DRAM
expert select/place
edge, 

$$
B{=}1
$$

CHIME [[21]]
DIMM-PIM+GPU
AFD
attn pool only

EARTH [[20]]
MoE accel.
prefetch/compr.
moves experts

Patterns [[33]]
multi-GPU
EP forecast
absorb in-core

ReXpert
ReRAM NMC
bounded mcast / FFN
—

ReRAM and PIM accelerators.
ISAAC, PRIME, and PUMA establish input-stationary ReRAM CIM; CASCADE,
TIMELY, Ouroboros, and CompAir extend its movement and scaling
[[30], [3], [1], [4], [18], [22], [16]].
NeuPIMs and IANUS pair GEMV PIM with GEMM NPUs
[[10], [29]]; CENT builds CXL near-bank PIM for
end-to-end LLM inference [[7]]; PAPI steers decode kernels
between GPU and hybrid PIM [[9]].
These designs bind compute to programmed weights, target attention-side
GEMV/KV traffic, or schedule kernels between fixed pools; ReXpert instead
uses digital NMC so PE groups remain reassignable under routing skew.

MoE accelerators and traffic.
EARTH predicts and prefetches compressed experts [[20]]; DIAMoND
places and selects experts across in-NAND/near-DRAM compute at the edge
[[19]]; MoE-Lightning schedules GPU memory
hierarchies [[2]]; Patterns forecasts multi-unit expert
traffic [[33]]; Tutel, FasterMoE, Lina, and SmartMoE balance
experts across GPUs
[[12], [8], [17], [35]];
Expert Choice changes routing itself [[37]].
We instead absorb skew inside a resident pool with routing fixed, neither
migrating, compressing, nor reselecting experts.

Disaggregated serving.
DistServe/Splitwise and Orca/vLLM/Mooncake establish disaggregated serving and
continuous batching
[[36], [26], [32], [15], [28]].
CHIME’s AFD

$$
+
$$

DIMM-PIM specializes the attention pool and quantifies
Attention–FC provisioning [[21]]; Raptor’s 3D-DRAM silicon
argues the same GPU-attention/near-memory-FFN polarity, with expert weights
behind stacked bandwidth [[24]].
ReXpert complements both: ReRAM bandwidth density and bounded multicast
pooling on the MoE FFN side, with expert routing fixed
(Table [XIII]).

## IX Conclusion

Disaggregated MoE decode asks the FFN pool for bandwidth density under
SLO-capped batches and sparse expert unions, then for occupancy recovery under
routing skew—without a global sharing fabric.
Residency alone is not enough: it removes off-chip weight delivery but exposes
tile underfill and straggler idle time.
ReXpert answers with a ReRAM near-memory FFN pool that factors actual MFU into
ideal MFU and occupancy, and recovers occupancy through bounded Core-local
broadcast, coactivation-aware placement, and load-aware fetch, while
provisioning each communication level to the induced demand.
Under the same measured

$$
+
$$

modeled hybrid analysis, side-4 pooling raises
occupancy 

$$
0.328{\to}0.519
$$

, iso-peak-compute FFN-pool latency falls by

$$
9.5\times
$$

 versus H20 at 

$$
20\times
$$

 lower weight-movement energy, and an
H20-attention 

$$
+
$$

 ReXpert-FFN system lowers decode TPOT by

$$
1.25
$$

–

$$
4.0\times
$$

, 

$$
2.4
$$

–

$$
10.3\times
$$

, and 

$$
2.5
$$

–

$$
10.4\times
$$

 on the
three models versus a homogeneous H20 pool.
The takeaway is architectural: for disaggregated MoE FFNs, bandwidth
density and bounded locality-preserving sharing matter more than batch
size alone.
ReRAM device maturity and contention-aware communication scheduling remain
open (§[VII-E]).

## References

- [1]
A. Ankit, I. E. Hajj, S. R. Chalamalasetti, G. Ndu, M. Foltin, R. S. Williams, P. Faraboschi, W. W. Hwu, J. P. Strachan, K. Roy, and D. S. Milojicic (2019)

PUMA: a programmable ultra-efficient memristor-based accelerator for machine learning inference.

In Proceedings of the 24th International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

pp. 715–731.

Cited by: [§II-D],
[TABLE XIII],
[§VIII].

- [2]
S. Cao, S. Liu, T. Griggs, P. Schafhalter, X. Liu, Y. Sheng, J. E. Gonzalez, M. Zaharia, and I. Stoica (2025)

MoE-Lightning: high-throughput MoE inference on memory-constrained GPUs.

In Proceedings of the 30th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [4th item],
[§I],
[§VI],
[§VIII].

- [3]
P. Chi, S. Li, C. Xu, T. Zhang, J. Zhao, Y. Liu, Y. Wang, and Y. Xie (2016)

PRIME: a novel processing-in-memory architecture for neural network computation in ReRAM-based main memory.

In 2016 ACM/IEEE 43rd Annual International Symposium on Computer Architecture (ISCA),

pp. 27–39.

Cited by: [§VIII].

- [4]
T. Chou, W. Tang, J. Botimer, and Z. Zhang (2019)

CASCADE: connecting RRAMs to extend analog dataflow in an end-to-end in-memory processing paradigm.

In Proceedings of the 52nd Annual IEEE/ACM International Symposium on Microarchitecture (MICRO),

pp. 114–125.

Cited by: [§VIII].

- [5]
D. Das Sharma, G. Pasdast, Z. Qian, and K. Aygun (2022)

Universal chiplet interconnect express (UCIe): an open industry standard for innovations with chiplets at package level.

IEEE Transactions on Components, Packaging and Manufacturing Technology 12 (9), pp. 1423–1431.

Cited by: [item d],
[§VII-E],
[TABLE XII].

- [6]
Z. Du, S. Li, Y. Wu, X. Jiang, J. Sun, Q. Zheng, Y. Wu, A. Li, H. Li, and Y. Chen (2024)

SiDA-MoE: sparsity-inspired data-aware serving for efficient and scalable large mixture-of-experts models.

In Proceedings of Machine Learning and Systems (MLSys),

Cited by: [§I].

- [7]
Y. Gu, A. Khadem, S. Umesh, N. Liang, X. Servot, O. Mutlu, R. Iyer, and R. Das (2025)

PIM is all you need: a CXL-enabled GPU-free system for large language model inference.

In Proceedings of the 30th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [§II-D],
[§VII-A],
[TABLE XIII],
[§VIII].

- [8]
J. He, J. Zhai, T. Antunes, H. Wang, F. Luo, S. Shi, and Q. Li (2022)

FasterMoE: modeling and optimizing training of large-scale dynamic pre-trained models.

In Proceedings of the 27th ACM SIGPLAN Symposium on Principles and Practice of Parallel Programming (PPoPP),

pp. 120–134.

Cited by: [4th item],
[§I],
[§VIII].

- [9]
Y. He, H. Mao, C. Giannoula, M. Sadrosadati, J. Gómez-Luna, H. Li, X. Li, Y. Wang, and O. Mutlu (2025)

PAPI: exploiting dynamic parallelism in large language model decoding with a processing-in-memory-enabled computing system.

In Proceedings of the 30th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [TABLE XIII],
[§VIII].

- [10]
G. Heo, S. Lee, J. Cho, H. Choi, S. Lee, H. Ham, G. Kim, D. Mahajan, and J. Park (2024)

NeuPIMs: NPU-PIM heterogeneous acceleration for batched LLM inferencing.

In Proceedings of the 29th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [4th item],
[§II-D],
[§VI],
[TABLE XIII],
[§VIII].

- [11]
Y. Huang, S. Liu, H. W. Chen, H. Feng, C. Li, C. T. Yang, W. Chang, C. Yang, C. Wu, Y. Lin, T. Yang, C. Chang, W. Chu, H. Chuang, Y. Wang, Y. Chih, and T. J. Chang (2024)

A 32Mb RRAM in a 12nm FinFET technology with a 0.0249

$$
\mu
$$

m

$$
{}^{2}
$$

 bit-cell, a 3.2GB/s read throughput, a 10Kcycle write endurance and a 10-year retention at 105

$$
{}^{\circ}
$$

c.

In IEEE International Solid-State Circuits Conference (ISSCC),

pp. 288–290.

Cited by: [§IV-B],
[item a],
[§VII-E].

- [12]
C. Hwang, W. Cui, Y. Xiong, Z. Yang, Z. Liu, H. Hu, Z. Wang, R. Salas, J. Jose, P. Ram, J. Chau, P. Cheng, F. Yang, M. Yang, and Y. Xiong (2023)

Tutel: adaptive mixture-of-experts at scale.

In Proceedings of Machine Learning and Systems (MLSys),

Vol. 5, pp. 269–287.

Cited by: [§VIII].

- [13]
R. Hwang, J. Wei, S. Cao, C. Hwang, X. Tang, T. Cao, and M. Yang (2024)

Pre-gated MoE: an algorithm-system co-design for fast and scalable mixture-of-expert inference.

In Proceedings of the 51st Annual International Symposium on Computer Architecture (ISCA),

pp. 1018–1031.

Cited by: [§I].

- [14]
T. Kim, K. Choi, Y. Cho, J. Cho, H. Lee, and J. Sim (2024)

MoNDE: mixture of near-data experts for large-scale sparse models.

In Proceedings of the 61st ACM/IEEE Design Automation Conference (DAC),

Cited by: [§I].

- [15]
W. Kwon, Z. Li, S. Zhuang, Y. Sheng, L. Zheng, C. H. Yu, J. E. Gonzalez, H. Zhang, and I. Stoica (2023)

Efficient memory management for large language model serving with PagedAttention.

In Proceedings of the 29th Symposium on Operating Systems Principles (SOSP),

pp. 611–626.

Cited by: [§II-A],
[§VIII].

- [16]
H. Li, S. Ma, H. Qu, W. Zhang, J. Chen, J. Lin, F. Tu, and R. Zhao (2026)

Bridging efficiency and scalability in LLM system via 3D hybrid PIM with 2D in-transit computation.

In Proceedings of the 53rd Annual International Symposium on Computer Architecture (ISCA),

Cited by: [§II-D],
[§VIII].

- [17]
J. Li, Y. Jiang, Y. Zhu, C. Wang, and H. Xu (2023)

Accelerating distributed MoE training and inference with Lina.

In 2023 USENIX Annual Technical Conference (ATC),

pp. 945–959.

Cited by: [§I],
[§VIII].

- [18]
W. Li, P. Xu, Y. Zhao, H. Li, Y. Xie, and Y. Lin (2020)

TIMELY: pushing data movements and interfaces in PIM accelerators towards local and in time domain.

In 2020 ACM/IEEE 47th Annual International Symposium on Computer Architecture (ISCA),

pp. 832–845.

Cited by: [§VIII].

- [19]
L. Liang, T. Luo, S. Zhong, D. Zhao, Q. Ma, R. Wei, J. Wang, M. Li, G. Sun, Z. Wang, and Y. Cai (2026)

DIAMoND: dynamic inference for adaptive edge MoE with heterogeneous in-NAND and near-DRAM compute architecture.

In Proceedings of the 53rd Annual International Symposium on Computer Architecture (ISCA),

Cited by: [TABLE XIII],
[§VIII].

- [20]
F. Liu, N. Yang, J. Yang, Z. Wang, C. Guan, Y. Feng, L. Jiang, and H. Guan (2026)

EARTH: an efficient MoE accelerator with entropy-aware speculative prefetch and result reuse.

In Proceedings of the 31st ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [§III],
[§IV-D],
[TABLE XIII],
[§VIII].

- [21]
Q. Liu, L. Chen, H. Wang, Y. Yang, D. Du, Z. Mao, N. Jing, Y. Xia, and H. Chen (2026)

CHIME: a case for efficient long-context attention-FC disaggregated inference with DIMM-PIM.

In Proceedings of the 53rd Annual International Symposium on Computer Architecture (ISCA),

Cited by: [4th item],
[§II-A],
[§V-A],
[§VI],
[§VII-A],
[§VII-D],
[TABLE XIII],
[§VIII].

- [22]
Y. Liu, Y. Pan, M. Wang, S. Zhao, H. Zhu, Y. Han, L. Zhang, and Y. Wang (2026)

Ouroboros: wafer-scale SRAM CIM with token-grained pipelining for large language model inference.

In Proceedings of the 31st ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [§II-D],
[§VIII].

- [23]
D. T. Melek, R. Navinkumar, J. Vandersand, P. Sarkar, B. S. Prakash, A. Leuciuc, K. Geary, S. Ma, C. M. Mehta, S. Jain, B. Bothra, P. Sabharwal, R. Vaish, K. Bhanushali, Y. Ding, C. Frost, J. Annunziata, K. Sadhu, D. Kyritsis, J. Bostak, M. Li, S. Williams, and K. Chang (2025)

A 0.29pJ/b 5.27Tb/s/mm UCIe advanced package link in 3nm FinFET with 2.5D CoWoS packaging.

In IEEE International Solid-State Circuits Conference (ISSCC),

pp. 590–592.

Cited by: [§VII-E].

- [24]
P. J. Nair, R. Hadidi, S. Ganesh, S. Kodge, S. Rathore, N. Thanawala, N. Reddy, G. Saharia, V. Patankar, A. Tiruvur, N. Kurella, and S. Bhoja (2026)

Early silicon of Raptor: the first 3D-DRAM accelerator for generative inference.

In Proceedings of the 53rd Annual International Symposium on Computer Architecture (ISCA),

Cited by: [§VII-D],
[TABLE XIII],
[§VIII].

- [25]
NVIDIA Corporation (2023)

NVIDIA H20 Tensor Core GPU product specification.

Note: 96 GB HBM3, 4.0 TB/s, 296 TFLOPS FP8, 400 W

Cited by: [§VII-E].

- [26]
P. Patel, E. Choukse, C. Zhang, A. Shah, Í. Goiri, S. Maleki, and R. Bianchini (2024)

Splitwise: efficient generative LLM inference using phase splitting.

In 2024 ACM/IEEE 51st Annual International Symposium on Computer Architecture (ISCA),

pp. 118–132.

Cited by: [§I],
[§II-A],
[§VIII].

- [27]
R. Pope, S. Douglas, A. Chowdhery, J. Devlin, J. Bradbury, J. Heek, K. Xiao, S. Agrawal, and J. Dean (2023)

Efficiently scaling transformer inference.

In Proceedings of Machine Learning and Systems (MLSys),

Vol. 5.

Cited by: [§II-B].

- [28]
R. Qin, Z. Li, W. He, J. Cui, F. Ren, M. Zhang, Y. Wu, W. Zheng, and X. Xu (2025)

Mooncake: trading more storage for less computation — a KVCache-centric architecture for serving LLM chatbot.

In 23rd USENIX Conference on File and Storage Technologies (FAST),

pp. 155–170.

Cited by: [§II-A],
[§VIII].

- [29]
M. Seo, X. T. Nguyen, S. J. Hwang, Y. Kwon, G. Kim, C. Park, I. Kim, J. Park, J. Kim, W. Shin, J. Won, H. Choi, K. Kim, D. Kwon, C. Jeong, S. Lee, Y. Choi, W. Byun, S. Baek, H. Lee, and J. Kim (2024)

IANUS: integrated accelerator based on NPU-PIM unified memory system.

In Proceedings of the 29th ACM International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS),

Cited by: [4th item],
[§II-D],
[§IV-B],
[TABLE XIII],
[§VIII].

- [30]
A. Shafiee, A. Nag, N. Muralimanohar, R. Balasubramonian, J. P. Strachan, M. Hu, R. S. Williams, and V. Srikumar (2016)

ISAAC: a convolutional neural network accelerator with in-situ analog arithmetic in crossbars.

In 2016 ACM/IEEE 43rd Annual International Symposium on Computer Architecture (ISCA),

pp. 14–26.

Cited by: [§II-D],
[§VIII].

- [31]
S. Williams, A. Waterman, and D. Patterson (2009)

Roofline: an insightful visual performance model for multicore architectures.

Communications of the ACM 52 (4), pp. 65–76.

Cited by: [§II-B],
[§VI].

- [32]
G. Yu, J. S. Jeong, G. Kim, S. Kim, and B. Chun (2022)

Orca: a distributed serving system for transformer-based generative models.

In 16th USENIX Symposium on Operating Systems Design and Implementation (OSDI),

pp. 521–538.

Cited by: [§II-A],
[§VIII].

- [33]
Z. Yu, Y. Guan, Z. Yu, C. Zhou, Z. Hu, S. Pei, Y. Kang, Y. Ding, and P. Tsai (2026)

Patterns behind chaos: forecasting data movement for efficient large-scale MoE LLM inference.

In Proceedings of the 53rd Annual International Symposium on Computer Architecture (ISCA),

Cited by: [4th item],
[§III],
[§V-A],
[§VI],
[TABLE XIII],
[§VIII].

- [34]
S. Yun, K. Kyung, J. Cho, J. Choi, J. Kim, B. Kim, S. Lee, K. Sohn, and J. H. Ahn (2024)

Duplex: a device for large language models with mixture of experts, grouped query attention, and continuous batching.

In Proceedings of the 57th IEEE/ACM International Symposium on Microarchitecture (MICRO),

pp. 1429–1443.

Cited by: [§I].

- [35]
M. Zhai, J. He, Z. Ma, Z. Zong, R. Zhang, and J. Zhai (2023)

SmartMoE: efficiently training sparsely-activated models through combining offline and online parallelization.

In 2023 USENIX Annual Technical Conference (ATC),

pp. 961–975.

Cited by: [§I],
[§VIII].

- [36]
Y. Zhong, S. Liu, J. Chen, J. Hu, Y. Zhu, X. Liu, X. Jin, and H. Zhang (2024)

DistServe: disaggregating prefill and decoding for goodput-optimized large language model serving.

In 18th USENIX Symposium on Operating Systems Design and Implementation (OSDI),

pp. 193–210.

Cited by: [§I],
[§II-A],
[§VIII].

- [37]
Y. Zhou, T. Lei, H. Liu, N. Du, Y. Huang, V. Zhao, A. M. Dai, Z. Chen, Q. V. Le, and J. Laudon (2022)

Mixture-of-experts with expert choice routing.

In Advances in Neural Information Processing Systems (NeurIPS),

Vol. 35, pp. 7103–7114.

Cited by: [§VIII].

# 第二部分：解析（深度解读）
## 核心论点

在「注意力–FFN 分离」的分解式 LLM 服务（prefill/decode 分离、attention 与 FFN 各自成池）中，MoE 权重可以常驻高带宽 FFN 池。但解码 SLO 限制了批大小，而稀疏路由会扩大「被激活专家的并集」，导致权重流量难以摊销、路由倾斜使冷门专家的计算资源闲置。本文提出 **ReXpert**——一种基于高带宽 ReRAM 近内存计算（near-memory compute）的 MoE 专家执行架构，在内存墙附近平衡「权重读取」与「专家计算」。

## 关键概念

1. **分解式服务（disaggregation）**：把 LLM 模块映射到专门的计算池，为 MoE 权重常驻 FFN 池创造机会。
2. **稀疏专家权重流量**：激活专家集合随路由扩大，权重搬运成为瓶颈。
3. **近内存计算（PIM）/ ReRAM**：用阻变存储器在内存侧做计算，减少权重搬运。
4. **路由倾斜与 MFU 分解**：把模型算力利用率拆解为可分析因子，定位冷专家闲置与负载不均。

## 技术趋势与判断

- 把「存」与「算」在内存墙附近融合，专攻 MoE 的「专家权重搬运」瓶颈——这是继算力之后的第二大系统瓶颈。
- 与光互联/CPO 主线直接相关：专家权重的跨节点、跨池搬运正是高速互连（含光）要解决的问题；近内存计算通过「就地算」减少搬运量，反过来降低对互连带宽的绝对需求。

## 与本站其他文章的连接

- 呼应本站 NVIDIA MoE 一文（专家=事实/权重存储）与「模型正被刻意变笨」（专家存储外置/可选化）的主线。
- 与 CPO/光通信主线形成闭环：权重流量的带宽需求是 CPO 规模化的现实驱动力之一。

## 风险提示

- 学术原型阶段；ReRAM 的良率、模拟精度、编程开销仍是工程挑战。
- 结论依赖特定负载与路由假设，距真实生产部署有距离。
