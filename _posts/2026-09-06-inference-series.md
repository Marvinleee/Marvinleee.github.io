---
layout: post
title: "从一个 Token 到 AI Factory：LLM 推理从数学到硬件的完整链路"
date: 2026-09-06 23:00:00 +0800
permalink: /posts/inference-series/
categories: [人工智能, 推理系统]
tags: [Transformer, DeepSeek, AI Factory, NVIDIA, 华为, 光互联]
description: "从 Attention、MLA 与 MoE 的数学和字节账，追踪一枚 Token 如何穿过 HBM、Scale-up Fabric、Vera Rubin NVL72、Atlas 950，最终抵达 NPO/CPO。"
math: true
toc: true
---

**MATHEMATICS → SILICON → FABRIC → OPTICS**

“输出下一个词”看似只是一次概率采样。沿着数据向下追踪，它会变成矩阵乘法、HBM 读写、专家路由、机架内互联、跨机柜光链路，最后进入电力与每 Token 成本的账本。

- **阅读时间**　约 28 分钟
- **交互原型**　3 个
- **核心问题**　数据去了哪里？

<div class="t2f-chain" aria-label="全文因果链"><span>Math</span><i></i><span>Tensor</span><i></i><span>Bytes</span><i></i><span>HBM</span><i></i><span>Fabric</span><i></i><span>Optics</span><i></i><span>Cost / Token</span></div>

## 从概率到矩阵：一枚 Token 的数学路径

语言模型做的事情可以压缩成一句话：在已经出现的 Token 条件下，为下一个 Token 建立概率分布。

$$P(x_t\mid x_{<t})$$

这条式子很短，却掩盖了物理实现的全部复杂性。文本先被 tokenizer 映射为离散 ID；查表得到 embedding 后，每个 ID 变成一个高维向量。位置编码把顺序写入向量，线性投影再生成 Query、Key、Value。对单个 attention head，可以写成：

$$Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V$$

$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

如果只看符号，attention 像一次优雅的相似度查询；落到机器上，它是成批 GEMM、归一化、指数运算与归约。序列长度从 `N` 增长到 `2N`，显式 attention score 的元素数从 `N²` 增至 `4N²`。数学结构没有改变，数据搬运量却改变了硬件瓶颈的位置。

> **关键转折**　公式描述依赖关系；系统性能取决于这些关系被切成多少次内存与网络传输。

这也是 FlashAttention 的意义。它没有修改 $\operatorname{softmax}(QK^\top)V$，而是改变中间状态在 HBM 与片上 SRAM 之间的旅行方式。通过 tiling、在线 softmax 和片上重用，巨大的 `N×N` 矩阵不必完整落到 HBM。结果不是“少算一点”，而是少搬很多次。

<div class="t2f">
<div class="prototype" id="transformer-explorer">
  <div class="prototype-head">
    <div><p class="prototype-label">INTERACTIVE / 01</p><p class="prototype-title">Transformer Math Explorer</p></div>
    <p>一个可操作的极简单头 attention。向量只有 4 维，数值由 Token 稳定生成，用来观察关系，不代表真实模型权重。</p>
  </div>
  <div class="explorer-layout">
    <div class="control-stack">
      <label for="transformer-input">输入一句短文本</label>
      <textarea id="transformer-input" rows="3" maxlength="48">光进入交换芯片</textarea>
      <div class="token-strip" id="token-strip" aria-label="选择查询 Token"></div>
      <div class="control-row">
        <label for="temperature">Softmax 温度 <output id="temperature-value">1.0</output></label>
        <input id="temperature" type="range" min="0.35" max="2" step="0.05" value="1">
      </div>
    </div>
    <div class="math-console">
      <div class="console-top"><span id="query-label">QUERY</span><span>4-D TOY MODEL</span></div>
      <div class="vector-grid" id="vector-grid"></div>
      <div class="attention-bars" id="attention-bars"></div>
      <div class="console-result" id="attention-result"></div>
    </div>
  </div>
</div>
</div>

## 从参数到字节：DeepSeek 的推理账

模型参数量首先是一个数学规模，进入推理系统后却立即变成容量、带宽和通信问题。

DeepSeek-V3 是一个适合算账的样本：主模型约 671B 参数，每个 Token 激活约 37B；61 层 Transformer，hidden dimension 为 7168，并使用 MLA 与稀疏 MoE。公开技术报告给出的这些数字，使“算法选择如何改写硬件需求”可以落到数量级上，而不是停留在形容词。[[1]](#ref-deepseek)

### MLA：多做投影，少存状态

标准 MHA 的 KV cache 随层数、序列长度与 head 数增长。MLA 不长期保存每个 head 的完整 K/V，而是缓存低维 latent representation，在使用时重建所需分量。以 V3 的 512 维 KV latent 与 64 维 RoPE 分量做近似，BF16 下每层、每 Token 的缓存约为 `(512 + 64) × 2 B`；乘以 61 层得到约 68.6 KiB/Token。

$$KV_{token}\approx L\,(d_c+d_r)\,b_{kv}=61\times(512+64)\times2\ \mathrm{bytes}$$

这不是免费午餐。重建 K/V 增加了一些计算，却大幅降低长上下文下的驻留状态与读取流量。现代 AI 系统里，*多算一点有时比多搬一点更便宜*。

### MoE：减少激活计算，同时制造路由流量

稀疏 MoE 让每个 Token 只访问少量专家。671B 是模型容纳的总知识容量，37B 更接近单 Token 的活跃计算规模。收益是 FLOPs 下降；代价是 Token activation 需要被 dispatch 到专家所在设备，计算后再返回。如果专家跨 accelerator 分布，数学上的 Top-K 会直接变成 All-to-All。

$$E[T_{comm}]=\sum_i P_iT_i,\qquad T_{local}<T_{board}<T_{rack}<T_{cluster}$$

优化并不能让跨机柜访问等同本地访问。它能做的是降低各级 $T_i$，并通过 expert placement、批处理与拓扑感知调度，让更多流量落在较低成本的 $P_i$ 上。

<div class="t2f">
<div class="prototype" id="deepseek-calculator">
  <div class="prototype-head">
    <div><p class="prototype-label">INTERACTIVE / 02</p><p class="prototype-title">DeepSeek Inference Calculator</p></div>
    <p>基于公开 V3 架构的数量级估算。它不是性能预测器，而是一张可以拨动的资源账。</p>
  </div>
  <div class="calculator-grid">
    <form class="calc-controls" id="calc-form">
      <label>上下文长度 <output id="context-out">32K</output><input id="context" type="range" min="4096" max="131072" step="4096" value="32768"></label>
      <label>并发 Batch <output id="batch-out">32</output><input id="batch" type="range" min="1" max="256" step="1" value="32"></label>
      <label>权重精度<select id="weight-precision"><option value="1">FP8 / INT8 · 1 B</option><option value="2">BF16 · 2 B</option><option value="0.5">INT4 · 0.5 B</option></select></label>
      <label>KV 精度<select id="kv-precision"><option value="2">BF16 · 2 B</option><option value="1">FP8 · 1 B</option></select></label>
      <label>Expert Parallel<select id="expert-parallel"><option>1</option><option>2</option><option>4</option><option selected>8</option><option>16</option><option>32</option></select></label>
      <label>Accelerator 数量 <output id="accelerators-out">72</output><input id="accelerators" type="range" min="8" max="1024" step="8" value="72"></label>
    </form>
    <div class="calc-results" aria-live="polite">
      <div class="metric primary"><span>Model Weight</span><strong id="metric-model-weight">—</strong><small>全量权重容量</small></div>
      <div class="metric"><span>Active Weight / token</span><strong id="metric-active-weight">—</strong><small>未计缓存复用</small></div>
      <div class="metric"><span>KV Cache / request</span><strong id="metric-kv">—</strong><small>当前上下文长度</small></div>
      <div class="metric"><span>Approx. FLOPs / token</span><strong id="metric-flops">—</strong><small>仅 2× 活跃参数</small></div>
      <div class="metric"><span>HBM Bytes / token</span><strong id="metric-hbm">—</strong><small>权重按 batch 摊销 + KV 扫描</small></div>
      <div class="metric"><span>MoE network payload</span><strong id="metric-moe">—</strong><small>极简远端占比模型</small></div>
      <div class="calc-reading" id="calc-reading">—</div>
    </div>
  </div>
  <p class="fineprint">假设：671B 总参数、37B 激活参数、61 层、MLA 缓存维度 512+64、58 个 MoE 层、Top-8、BF16 activation。实际部署会受量化元数据、MTP、分组 GEMM、缓存命中、并行策略、通信重叠与 kernel 效率影响。</p>
</div>
</div>

## 从 GPU 到 AI Factory：网络进入执行路径

单芯片的 roofline 只在边界之内成立。一旦模型被切到多颗 accelerator 上，网络就不再是外设，而是 Transformer layer 的组成部分。

$$T_{step}=f(T_{compute},T_{memory},T_{communication},T_{synchronization},T_{software})$$

Tensor Parallel 产生 AllReduce、AllGather 或 ReduceScatter；Expert Parallel 产生 All-to-All。好的实现会重叠计算与通信，所以这些项不能机械相加。但只要同步或拥塞进入关键路径，更多峰值 FLOPs 就无法自动变成更多 Token。

在低 batch decode 中，权重复用率低。若每 Token 激活 37B 参数，FP8 仅活跃权重就对应约 37 GB。把 batch 提高到 32，理论上的单位 Token 权重读取可以显著摊薄；与此同时，队列等待、KV 容量和 tail latency 又可能上升。推理优化因此不是单一指标竞赛，而是吞吐、首 Token 延迟、Token 间延迟和能耗的多目标问题。

> AI Factory 不是“数据中心里放了很多 GPU”的新名字。它是一台空间尺度扩展到机架、Pod 乃至整座建筑的计算机；网络负责让分散在不同硅片上的模型状态，尽量表现得像一个系统。

<div class="t2f">
<div class="prototype map-prototype" id="factory-map">
  <div class="prototype-head">
    <div><p class="prototype-label">INTERACTIVE / 03</p><p class="prototype-title">Token-to-AI-Factory Map</p></div>
    <p>拖动尺度，观察同一枚 Token 从片上计算到跨机柜网络时，主导资源如何改变。数据为工程数量级示意。</p>
  </div>
  <div class="map-toolbar">
    <button id="map-prev" type="button" aria-label="上一个尺度">←</button>
    <input id="map-scale" type="range" min="0" max="6" step="1" value="2" aria-label="系统尺度">
    <button id="map-next" type="button" aria-label="下一个尺度">→</button>
  </div>
  <div class="map-stage">
    <div class="map-orbits" aria-hidden="true">
      <span class="orbit o7"></span><span class="orbit o6"></span><span class="orbit o5"></span><span class="orbit o4"></span><span class="orbit o3"></span><span class="orbit o2"></span><span class="orbit o1"></span>
      <span class="map-pulse"></span>
    </div>
    <div class="map-copy">
      <span id="map-step">03 / 07</span>
      <div class="map-title" id="map-title">GPU + HBM</div>
      <p id="map-description">—</p>
    </div>
    <dl class="map-stats">
      <div><dt>DATA OBJECT</dt><dd id="map-object">—</dd></div>
      <div><dt>BANDWIDTH</dt><dd id="map-bandwidth">—</dd></div>
      <div><dt>LATENCY</dt><dd id="map-latency">—</dd></div>
      <div><dt>ENERGY / BIT</dt><dd id="map-energy">—</dd></div>
    </dl>
  </div>
  <div class="map-labels" id="map-labels" aria-hidden="true"></div>
</div>
</div>

## 两种系统边界：Vera Rubin NVL72 与 Atlas 950

两条路线都在缩短 Token 的端到端时间。真正的差异，不是 72 与 1024 两个数字，而是系统边界划在哪里。

### Vera Rubin NVL72

NVL72 把 72 颗 Rubin GPU 与 36 颗 Vera CPU 组织成一个机架级系统。NVLink 6 提供 GPU 间 scale-up：官方公开数据为每 GPU 3.6 TB/s，整机架 260 TB/s；再由 ConnectX、InfiniBand 或 Spectrum-X 向更大的 AI Factory scale-out。[[2]](#ref-nvidia)

### Atlas 950 SuperPoD

Atlas 950 选择继续扩大逻辑上的单一计算域。华为在 WAIC 2026 展示的 1024 卡系统具有 256 TB 全局统一内存编址空间、TB 级 NPU 互联与约 3 μs RTT；产品路线描述的上限为 8192 NPU。[[3]](#ref-huawei)

|  | NVIDIA / RACK-SCALE | HUAWEI / SUPERPOD |
|:--|:--|:--|
| 基本计算域 | 72-GPU rack | 多机柜 SuperPoD |
| 紧耦合互联 | NVLink 6 / NVSwitch | UnifiedBus / 灵衢 |
| 继续扩展 | InfiniBand / Spectrum-X | 统一内存语义 + 光互联 |

NVL72 的路径很清楚：先把 rack 做成高性能、可维护的 scale-up 单元，再用 scale-out 网络组合更多 rack。Atlas 950 更强调把跨物理节点统一编址、对等互联与资源调度放进同一个 SuperPoD 语义，尝试扩大“逻辑上一台计算机”的范围。统一地址空间当然不会消除物理距离；它改变的是软件看到资源、放置任务和组织通信的方式。

### 韬（τ）定律：系统究竟应该缩放什么

何庭波在 2026 年发表的 *A Time Scaling Theory for Multi-Layer Electronic Systems* 把“特征时间” $\tau$ 作为跨层统一目标：从晶体管开关、电路关键路径、芯片内存访问，一直到数据中心 workload，优化对象不再只是几何尺寸，而是完成一次有意义操作所需的时间。论文把这一视角跨越约十二个数量级，并将 Unified Bus、near-packaged optical I/O 与 3D Folding 放入同一系统级缩放框架。[[4]](#ref-tau)

$$T_{token}\approx T_{compute}+T_{memory}+T_{communication}+T_{synchronization}+T_{software}$$

各项实际上可以重叠，因此上式是结构图，不是精确求和。它的重要性在于：如果晶体管继续变快，而 HBM、跨芯片通信或 barrier 没有同步缩短，用户观察到的 $T_{token}$ 不会按比例改善。MLA、FlashAttention、UnifiedBus 与光 I/O 工作在不同物理尺度，却都可以解释为让有效 $\tau$ 下降。

### Nested Parallel von Neumann Architecture：怎样组织百万处理器

廖恒 2026 年 9 月的预印本把经典 BSP 扩展为 Nested BSP，并提出与之对应的 Nested Parallel von Neumann Architecture。经典 BSP 反复执行本地计算、交换与 barrier；当系统本身由芯片、板、机架、SuperPoD、集群等多层并行域构成时，一个平面的 BSP 已经不能表达不同距离上的成本。

- **OUTER**　Cluster / Data Parallel
  - **MIDDLE**　SuperPoD / Expert Parallel
    - **INNER**　Accelerator / Tensor Parallel

Nested BSP 让计算—交换—同步在每一级递归出现；Nested Parallel von Neumann Architecture 则把处理器、内存、存储和网络看作能够逐层嵌套成更大“计算机”的资源，并强调 memory-semantic bus 与 peer equality。[[5]](#ref-nested) 这为 Atlas 950 的三个关键词提供了理论位置：统一内存编址解决资源如何被同一系统语义访问；UnifiedBus 解决物理互联；SuperPoD 扩大紧耦合域；Nested BSP 描述不同尺度的并行怎样组织。

$$\boxed{T_{token}\;\sim\;\sum_i P_i\tau_i}$$

这是本文把两套思想映射到 Token 数据流后的简化模型，并非两篇论文直接给出的公式。$\tau_i$ 是第 $i$ 个物理层级的特征时间，$P_i$ 是工作落在该层级的比例。τ scaling 试图降低每一级的时间；nested architecture 则重新组织边界与 locality，让更多工作留在较低 $\tau$ 的区域。

## 为什么这条链最终走向 NPO 与 CPO

扩大逻辑计算域，会把高速互联推向更长的物理距离。光不是叙事终点，而是电通道预算开始失去经济性后的结构性结果。

以 PAM4 为例，忽略编码开销，200 Gb/s 每 lane 对应约 100 GBaud，Nyquist frequency 已在 50 GHz 量级。继续走向 400 Gb/s/lane，符号率与通道损耗、反射、串扰的压力一起上升。FFE、CTLE、DFE、retimer 与 DSP 可以延伸电通道，但每一项都消耗功率、面积和时延。

- **PLUGGABLE**　`ASIC → package → PCB → connector → module → fiber`
- **NPO**　`ASIC → short electrical → optical engine → fiber`
- **CPO**　`ASIC → package interconnect → optical engine → fiber`

NPO/CPO 的核心价值不是“把光模块放得更近”这句空间描述，而是缩短最难处理的高速 electrical channel。Broadcom 的 Tomahawk 6 Davisson 把 16 个 6.4 Tb/s optical engine 与 102.4 Tb/s switch 组合在一起，以 200 Gb/s/channel 工作；NVIDIA Spectrum-X Ethernet Photonics 的 SN6800 则公开了 409.6 Tb/s 总带宽、512×800G 或 2048×200G 的端口尺度。[[6]](#ref-broadcom)[[7]](#ref-spectrum)

$$\text{Transformer}\rightarrow\text{Parallelism}\rightarrow\text{Communication}\rightarrow\text{SerDes}\rightarrow\text{Channel Loss}\rightarrow\text{Optical I/O}$$

这条链也解释了为什么不能把“AI 带动光模块”理解为简单的采购量增长。MoE 与 Tensor Parallel 改变通信模式；通信模式决定 fabric；fabric 推高 lane rate 和 I/O density；电通道的 reach 与 energy/bit 再决定 E/O 转换点向哪里移动。光互联是模型结构经由系统工程传导后的结果。

## 从 FLOPs/W 到 Tokens/W：最后是一张经济账

用户不购买 FLOPs。在线推理真正出售的是有延迟约束的 Token；数据中心真正受限的是功率、冷却与可用资本。

因此评估尺度会从峰值 PFLOPS，逐渐移动到 Tokens/s、Time to First Token、Inter-Token Latency，再进入 Tokens/J、Tokens/s/MW 与 Cost/Token。一次互联改进只有 1 pJ/bit，看似微不足道；在持续搬运 `10¹⁸ bit` 的系统里，它对应 `10⁶ J`。当这种差异被成千上万条链路、全年负载和冷却系统再次放大，物理层就会进入商业模型。

<div class="t2f-ledger-wrap">
<div class="t2f-ledger">
  <div><span>MODEL</span><b>激活多少参数</b></div><i>×</i>
  <div><span>MEMORY</span><b>搬运多少字节</b></div><i>×</i>
  <div><span>FABRIC</span><b>跨越多少距离</b></div><i>×</i>
  <div><span>POWER</span><b>每 bit / FLOP 能耗</b></div><i>=</i>
  <div class="accent"><span>ECONOMICS</span><b>Cost / Token</b></div>
</div>
</div>

重新回到开头：用户输入文本，tokenizer 产生 ID；embedding 与 RoPE 写入语义和位置；attention 与 MoE 生成新的 hidden state。公式被编译成 kernel，tensor 在 register、SRAM、HBM 之间移动；跨设备的 activation 进入 scale-up fabric，跨机架流量进入 scale-out network，必要时从 electrical 转为 optical。几十层之后，LM head 产生 vocabulary logits，采样得到下一枚 Token，然后整个过程再次开始。

$$\boxed{\text{Token}\rightarrow\text{Tensor}\rightarrow\text{GEMM}\rightarrow\text{HBM}\rightarrow\text{Fabric}\rightarrow\text{Optics}\rightarrow\text{Token}}$$

Transformer、DeepSeek、HBM、Scale-up、AI Factory、NPO 与 CPO 并不是恰好同时热门的名词。它们是同一个计算问题沿不同空间尺度展开后，留下的一串工程截面。

## 口径与资料

文中互动计算器用于解释变量之间的关系；除特别标明的公开规格外，结果均为简化上界或数量级估算，不构成真实性能承诺。硬件规格会随产品版本、精度口径、双向/单向带宽定义和系统配置而变化。

1. <span id="ref-deepseek">[1]</span> [DeepSeek-AI, DeepSeek-V3 Technical Report / official repository](https://github.com/deepseek-ai/DeepSeek-V3)
2. <span id="ref-nvidia">[2]</span> [NVIDIA, Inside the Vera Rubin Platform](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/)
3. <span id="ref-huawei">[3]</span> [华为，昇腾 950 超节点真机亮相 2026 世界人工智能大会](https://www.huawei.com/cn/news/2026/7/atlas-950-superpod)
4. <span id="ref-tau">[4]</span> [Tingbo He, A Time Scaling Theory for Multi-Layer Electronic Systems](https://link.springer.com/article/10.1007/s11432-026-5028-5)
5. <span id="ref-nested">[5]</span> [Heng Liao, Nested Parallel von Neumann Architecture and Nested BSP](https://arxiv.org/abs/2609.16787)
6. <span id="ref-broadcom">[6]</span> [Broadcom, Tomahawk 6 — Davisson CPO](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024)
7. <span id="ref-spectrum">[7]</span> [NVIDIA, Spectrum-X Ethernet Photonics](https://developer.nvidia.com/blog/scaling-power-efficient-ai-factories-with-nvidia-spectrum-x-ethernet-photonics)

<style>
:root{--t2f-acid:#c9ff32;--t2f-sunken:#171a16;--t2f-card:#0c0e0b;--t2f-line:#353831;--t2f-fg:#fbfaf5;--t2f-mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace}
.t2f-chain{display:flex;align-items:center;gap:10px;margin:1.6rem 0 2rem;padding-top:14px;border-top:1px solid currentColor;font:650 10px/1 var(--t2f-mono);text-transform:uppercase;letter-spacing:.06em;overflow-x:auto}
.t2f-chain i{flex:1;min-width:22px;height:1px;background:currentColor;opacity:.25}
.t2f-ledger-wrap{container-type:inline-size;display:block}
.t2f-ledger{display:grid;grid-template-columns:repeat(4,minmax(0,1fr) auto) minmax(0,1fr);margin:2.2rem 0;border:1px solid currentColor;border-radius:6px;overflow:hidden}
.t2f-ledger div{padding:16px 14px;display:flex;flex-direction:column;gap:10px;justify-content:space-between;min-width:0}
.t2f-ledger i{align-self:center;font-style:normal;font:500 16px/1 var(--t2f-mono);opacity:.75}
.t2f-ledger span{font:700 8px/1 var(--t2f-mono);opacity:.6;letter-spacing:.08em}
.t2f-ledger b{font-size:11px;line-height:1.5}
.t2f-ledger .accent{background:rgba(141,189,0,.18)}
@container (max-width:820px){
  .t2f-ledger{grid-template-columns:minmax(0,1fr);margin:1.8rem 0}
  .t2f-ledger i{transform:rotate(90deg);padding:6px 0}
}
</style>

<script>
(function () {
  'use strict';
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---- Transformer Math Explorer ---- */
  var explorerInput = document.querySelector('#transformer-input');
  if (explorerInput) {
    var tokenStrip = document.querySelector('#token-strip');
    var temperature = document.querySelector('#temperature');
    var selectedToken = 0;
    var segment = function (text) {
      var clean = text.trim();
      if (!clean) return ['Token'];
      if (window.Intl && Intl.Segmenter) {
        var seg = new Intl.Segmenter('zh-CN', { granularity: 'word' });
        var parts = Array.from(seg.segment(clean)).map(function (item) { return item.segment; }).filter(function (part) { return part.trim(); });
        if (parts.length > 1 && parts.length <= 12) return parts;
      }
      return clean.replace(/\s+/g, '').split('').slice(0, 12);
    };
    var hash = function (value) {
      var h = 2166136261;
      for (var i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
      return h >>> 0;
    };
    var vector = function (token, channel) {
      var seed = hash(token + ':' + channel);
      var out = [];
      for (var i = 0; i < 4; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; out.push((seed / 4294967295) * 2 - 1); }
      return out;
    };
    var fmtVec = function (vec) { return '[' + vec.map(function (v) { return v.toFixed(2); }).join(', ') + ']'; };
    var softmax = function (values, temp) {
      var scaled = values.map(function (v) { return v / temp; });
      var max = Math.max.apply(null, scaled);
      var exps = scaled.map(function (v) { return Math.exp(v - max); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      return exps.map(function (v) { return v / sum; });
    };
    var renderExplorer = function () {
      var tokens = segment(explorerInput.value);
      selectedToken = Math.min(selectedToken, tokens.length - 1);
      tokenStrip.replaceChildren.apply(tokenStrip, tokens.map(function (token, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = token;
        if (index === selectedToken) button.className = 'active';
        button.addEventListener('click', function () { selectedToken = index; renderExplorer(); });
        return button;
      }));
      var q = vector(tokens[selectedToken], 'q');
      var k = tokens.map(function (token) { return vector(token, 'k'); });
      var v = tokens.map(function (token) { return vector(token, 'v'); });
      var scores = k.map(function (key) { return q.reduce(function (sum, n, i) { return sum + n * key[i]; }, 0) / 2; });
      var weights = softmax(scores, Number(temperature.value));
      var output = [0, 0, 0, 0];
      weights.forEach(function (weight, tokenIndex) { v[tokenIndex].forEach(function (n, i) { output[i] += weight * n; }); });

      document.querySelector('#temperature-value').textContent = Number(temperature.value).toFixed(2);
      document.querySelector('#query-label').textContent = 'QUERY / ' + tokens[selectedToken];
      document.querySelector('#vector-grid').innerHTML = [['Q', q], ['K', k[selectedToken]], ['V', v[selectedToken]]]
        .map(function (pair) { return '<div class="vector"><span>' + pair[0] + '</span><code>' + fmtVec(pair[1]) + '</code></div>'; }).join('');
      document.querySelector('#attention-bars').innerHTML = tokens.map(function (token, i) {
        return '<div class="attn-row"><span>' + token + '</span><div class="bar-track"><div class="bar-fill" style="width:' + (weights[i] * 100).toFixed(1) + '%"></div></div><b>' + (weights[i] * 100).toFixed(1) + '%</b></div>';
      }).join('');
      document.querySelector('#attention-result').innerHTML = '加权输出 <strong>O</strong> = ' + fmtVec(output) + '<br>最高注意力：<strong>' + tokens[weights.indexOf(Math.max.apply(null, weights))] + '</strong>';
    };
    explorerInput.addEventListener('input', function () { selectedToken = 0; renderExplorer(); });
    temperature.addEventListener('input', renderExplorer);
    renderExplorer();
  }

  /* ---- DeepSeek resource calculator ---- */
  var calcForm = document.querySelector('#calc-form');
  if (calcForm) {
    var formatBytes = function (bytes) {
      var units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
      var value = bytes, unit = 0;
      while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
      return (value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2)) + ' ' + units[unit];
    };
    var compact = function (value) { return value >= 1e12 ? (value / 1e12).toFixed(1) + ' T' : value >= 1e9 ? (value / 1e9).toFixed(1) + ' G' : value.toFixed(0); };
    var updateCalculator = function () {
      var context = Number(document.querySelector('#context').value);
      var batch = Number(document.querySelector('#batch').value);
      var weightBytes = Number(document.querySelector('#weight-precision').value);
      var kvBytes = Number(document.querySelector('#kv-precision').value);
      var ep = Number(document.querySelector('#expert-parallel').value);
      var accelerators = Number(document.querySelector('#accelerators').value);

      var modelWeight = 671e9 * weightBytes;
      var activeWeight = 37e9 * weightBytes;
      var kvPerToken = 61 * (512 + 64) * kvBytes;
      var kvPerRequest = context * kvPerToken;
      var flopsPerToken = 2 * 37e9;
      var hbmPerToken = activeWeight / batch + kvPerRequest;
      var maxMoePayload = 58 * 7168 * 2 * 2 * 8;
      var remoteFraction = ep === 1 ? 0 : (ep - 1) / ep;
      var moePayload = maxMoePayload * remoteFraction;
      var capacityPerAccelerator = modelWeight / accelerators;

      document.querySelector('#context-out').textContent = Math.round(context / 1024) + 'K';
      document.querySelector('#batch-out').textContent = String(batch);
      document.querySelector('#accelerators-out').textContent = String(accelerators);
      document.querySelector('#metric-model-weight').textContent = formatBytes(modelWeight);
      document.querySelector('#metric-active-weight').textContent = formatBytes(activeWeight);
      document.querySelector('#metric-kv').textContent = formatBytes(kvPerRequest);
      document.querySelector('#metric-flops').textContent = compact(flopsPerToken) + 'F';
      document.querySelector('#metric-hbm').textContent = formatBytes(hbmPerToken);
      document.querySelector('#metric-moe').textContent = formatBytes(moePayload);

      var dominant = activeWeight / batch > kvPerRequest ? '权重读取仍占主导' : 'KV 扫描已超过摊销后的权重读取';
      document.querySelector('#calc-reading').innerHTML = '每颗 accelerator 平均承载 <strong>' + formatBytes(capacityPerAccelerator) + '</strong> 权重；当前设置下，' + dominant + '。EP=' + ep + ' 的极简均匀放置假设给出约 <strong>' + (remoteFraction * 100).toFixed(0) + '%</strong> 的远端专家比例。';
    };
    $$('#calc-form input, #calc-form select').forEach(function (control) { control.addEventListener('input', updateCalculator); });
    updateCalculator();
  }

  /* ---- Scale map ---- */
  var mapScale = document.querySelector('#map-scale');
  if (mapScale) {
    var mapData = [
      { title: 'Tensor Core', object: 'MMA tile', bandwidth: 'Register-class', latency: 'ns 以内', energy: '最低', description: '矩阵被切成 tile；数据尽量驻留寄存器与片上数据通路。此时主要问题是数据复用、占用率和流水线。' },
      { title: 'GPU Die', object: 'Activation tile', bandwidth: 'TB/s 级片上', latency: 'ns 级', energy: '低', description: '多个 SM/Tensor Core 通过片上网络协作。L2 与 SRAM 的命中决定 HBM 往返次数。' },
      { title: 'GPU + HBM', object: 'Weights / KV', bandwidth: 'TB/s 级 HBM', latency: '100ns 量级', energy: '中', description: 'Decode 常在这里暴露 memory wall。FlashAttention 与 MLA 都在减少跨过这一边界的数据量。' },
      { title: 'Scale-up Domain', object: 'Collective / MoE', bandwidth: 'TB/s 级 / GPU', latency: 'μs 级', energy: '中高', description: 'Tensor Parallel 的 collective 与 Expert Parallel 的 dispatch 进入执行关键路径；拓扑和拥塞开始决定有效算力。' },
      { title: 'Rack', object: 'Batched tokens', bandwidth: '百 TB/s 聚合', latency: '数 μs', energy: '高', description: '计算、供电、液冷与 NVSwitch/UnifiedBus 被当作一个系统共同设计。容量已不是唯一问题，资源利用率成为核心。' },
      { title: 'Pod / SuperPoD', object: 'Expert traffic', bandwidth: '多机柜聚合', latency: 'μs—十 μs', energy: '更高', description: '系统边界开始分叉：以 rack 为 scale-up 单元继续 scale-out，或扩大统一内存语义的超节点范围。' },
      { title: 'AI Factory', object: 'Token streams', bandwidth: 'Pb/s 级 fabric', latency: '拓扑相关', energy: '系统级', description: '网络、电力、冷却、调度与故障域共同决定 Tokens/s/MW 和 Cost/Token。光互联承担更长距离的高带宽传输。' }
    ];
    var shortLabels = ['TENSOR', 'DIE', 'HBM', 'SCALE-UP', 'RACK', 'SUPERPOD', 'FACTORY'];
    document.querySelector('#map-labels').innerHTML = shortLabels.map(function (label) { return '<span>' + label + '</span>'; }).join('');
    var renderMap = function () {
      var index = Number(mapScale.value);
      var item = mapData[index];
      document.querySelector('#map-step').textContent = String(index + 1).padStart(2, '0') + ' / 07';
      document.querySelector('#map-title').textContent = item.title;
      document.querySelector('#map-description').textContent = item.description;
      document.querySelector('#map-object').textContent = item.object;
      document.querySelector('#map-bandwidth').textContent = item.bandwidth;
      document.querySelector('#map-latency').textContent = item.latency;
      document.querySelector('#map-energy').textContent = item.energy;
      $$('.orbit').forEach(function (orbit, orbitIndex) { orbit.classList.toggle('active', orbitIndex === 6 - index); });
      $$('#map-labels span').forEach(function (label, labelIndex) { label.classList.toggle('active', labelIndex === index); });
    };
    mapScale.addEventListener('input', renderMap);
    document.querySelector('#map-prev').addEventListener('click', function () { mapScale.value = Math.max(0, Number(mapScale.value) - 1); renderMap(); });
    document.querySelector('#map-next').addEventListener('click', function () { mapScale.value = Math.min(6, Number(mapScale.value) + 1); renderMap(); });
    renderMap();
  }
})();
</script>

<style>
.t2f *{box-sizing:border-box}
.t2f .prototype{margin:2.4rem 0;background:var(--t2f-card);color:var(--t2f-fg);border-radius:8px;overflow:hidden;box-shadow:0 16px 42px rgba(0,0,0,.16)}
.t2f .prototype-head{padding:26px 30px;border-bottom:1px solid var(--t2f-line);display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px;align-items:end}
.t2f .prototype-title{margin:6px 0 0;font-size:22px;font-weight:700;line-height:1.2;color:var(--t2f-fg)}
.t2f .prototype-head>p{margin:0;color:#aeb2a8;font-size:12px;line-height:1.7;justify-self:end;max-width:420px}
.t2f .prototype-label{margin:0;font:700 9px/1 var(--t2f-mono);letter-spacing:.13em;color:var(--t2f-acid)}
.t2f .explorer-layout{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.4fr)}
.t2f .control-stack{padding:26px;border-right:1px solid var(--t2f-line);display:flex;flex-direction:column;gap:14px;min-height:430px}
.t2f .control-stack label{font:650 10px/1.4 var(--t2f-mono);letter-spacing:.05em;text-transform:uppercase;color:var(--t2f-fg)}
.t2f textarea{resize:vertical;width:100%;background:#161914;color:var(--t2f-fg);border:1px solid #464a41;padding:12px;line-height:1.6;outline:none;font:inherit;font-size:13px}
.t2f textarea:focus,.t2f select:focus,.t2f input:focus{outline:2px solid var(--t2f-acid);outline-offset:2px}
.t2f .token-strip{display:flex;flex-wrap:wrap;gap:6px}
.t2f .token-strip button{border:1px solid #4b4e47;background:transparent;color:var(--t2f-fg);padding:7px 9px;cursor:pointer;font-family:var(--t2f-mono);font-size:12px;border-radius:0}
.t2f .token-strip button.active{background:var(--t2f-acid);color:#11120f;border-color:var(--t2f-acid)}
.t2f .control-row{margin-top:auto;display:grid;gap:10px}
.t2f .control-row label{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.t2f input[type=range]{accent-color:var(--t2f-acid);width:100%;margin:0}
.t2f .math-console{padding:22px 26px;min-width:0}
.t2f .console-top{display:flex;justify-content:space-between;gap:12px;color:#7d8276;font:650 9px/1 var(--t2f-mono);letter-spacing:.12em;padding-bottom:14px;border-bottom:1px solid #2f322d}
.t2f .vector-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:18px 0 24px}
.t2f .vector{background:var(--t2f-sunken);padding:12px;min-width:0}
.t2f .vector span{color:var(--t2f-acid);font:700 9px/1 var(--t2f-mono)}
.t2f .vector code{display:block;margin-top:8px;color:#daddd4;font:11px/1.7 var(--t2f-mono);background:none;border:0;padding:0;overflow-wrap:anywhere}
.t2f .attention-bars{display:grid;gap:8px}
.t2f .attn-row{display:grid;grid-template-columns:55px minmax(0,1fr) 45px;align-items:center;gap:9px;font:10px/1 var(--t2f-mono)}
.t2f .attn-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.t2f .bar-track{height:18px;background:#1c201a}
.t2f .bar-fill{height:100%;background:var(--t2f-acid);transition:width .3s}
.t2f .attn-row b{font-weight:500;text-align:right;color:#b6baaf}
.t2f .console-result{margin-top:22px;padding-top:16px;border-top:1px solid #2f322d;color:#d6d9d1;font:11px/1.7 var(--t2f-mono)}
.t2f .console-result strong{color:var(--t2f-acid)}
.t2f .calculator-grid{display:grid;grid-template-columns:minmax(0,250px) minmax(0,1fr)}
.t2f .calc-controls{padding:26px;border-right:1px solid var(--t2f-line);display:grid;gap:18px;align-content:start;margin:0}
.t2f .calc-controls label{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;font:650 10px/1.4 var(--t2f-mono);letter-spacing:.04em;color:var(--t2f-fg);text-transform:none}
.t2f .calc-controls input,.t2f .calc-controls select{grid-column:1/-1}
.t2f .calc-controls output{color:var(--t2f-acid)}
.t2f select{width:100%;border:1px solid #464a41;background:var(--t2f-sunken);color:var(--t2f-fg);padding:9px;font:inherit;font-size:12px;border-radius:0}
.t2f .calc-results{padding:26px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#33372f}
.t2f .metric{background:var(--t2f-card);padding:18px;min-height:108px;display:flex;flex-direction:column}
.t2f .metric.primary{background:var(--t2f-acid);color:#11120f}
.t2f .metric span{color:#92978b;font:650 8.5px/1.2 var(--t2f-mono);letter-spacing:.07em;text-transform:uppercase}
.t2f .metric.primary span{color:#394400}
.t2f .metric strong{margin-top:auto;font:650 22px/1 var(--t2f-mono);letter-spacing:-.04em}
.t2f .metric small{margin-top:7px;color:#767b70;font-size:9px;line-height:1.4}
.t2f .metric.primary small{color:#4f5b14}
.t2f .calc-reading{grid-column:1/-1;background:var(--t2f-sunken);padding:16px 18px;color:#c8ccc1;font-size:11px;line-height:1.7}
.t2f .calc-reading strong{color:var(--t2f-acid)}
.t2f .fineprint{margin:0;padding:16px 26px;border-top:1px solid var(--t2f-line);color:#777d71;font-size:10px;line-height:1.7}
.t2f .map-prototype{background:#0f110e}
.t2f .map-toolbar{display:grid;grid-template-columns:44px minmax(0,1fr) 44px;gap:12px;align-items:center;padding:16px 26px;border-bottom:1px solid var(--t2f-line)}
.t2f .map-toolbar button{width:100%;height:32px;background:none;border:1px solid #4b5047;color:var(--t2f-fg);cursor:pointer;border-radius:0;font-size:14px}
.t2f .map-stage{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:18px;align-items:center;padding:30px 26px;min-height:430px}
.t2f .map-orbits{position:absolute;left:28%;top:50%;width:610px;height:610px;transform:translate(-50%,-50%) scale(.74)}
.t2f .orbit{position:absolute;border:1px solid #34382f;border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);transition:border-color .35s,background .35s,opacity .35s}
.t2f .o7{width:600px;height:600px}
.t2f .o6{width:500px;height:500px}
.t2f .o5{width:405px;height:405px}
.t2f .o4{width:320px;height:320px}
.t2f .o3{width:240px;height:240px}
.t2f .o2{width:165px;height:165px}
.t2f .o1{width:90px;height:90px}
.t2f .orbit.active{border-color:var(--t2f-acid);background:rgba(201,255,50,.05);box-shadow:0 0 40px rgba(201,255,50,.07) inset}
.t2f .map-pulse{position:absolute;left:50%;top:50%;width:9px;height:9px;background:var(--t2f-acid);border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 8px rgba(201,255,50,.08)}
.t2f .map-copy{position:relative;z-index:2}
.t2f .map-copy>span{color:var(--t2f-acid);font:700 10px/1 var(--t2f-mono);letter-spacing:.1em}
.t2f .map-title{margin:12px 0;font-size:34px;line-height:1;letter-spacing:-.03em;font-weight:700;color:var(--t2f-fg)}
.t2f .map-copy p{margin:0;color:#b6baaf;font-size:13px;line-height:1.75}
.t2f .map-stats{position:relative;z-index:2;margin:0;display:grid;grid-template-columns:minmax(0,1fr)}
.t2f .map-stats div{border-top:1px solid #3c4038;padding:11px 0}
.t2f .map-stats dt{color:#70766a;font:650 8px/1 var(--t2f-mono);letter-spacing:.12em}
.t2f .map-stats dd{margin:7px 0 0;font:600 12.5px/1.3 var(--t2f-mono);color:#e3e6de}
.t2f .map-labels{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-top:1px solid var(--t2f-line)}
.t2f .map-labels span{min-height:58px;padding:11px 6px;display:grid;place-items:center;text-align:center;color:#6f7569;border-right:1px solid #292c27;font:600 8px/1.4 var(--t2f-mono)}
.t2f .map-labels span.active{background:var(--t2f-acid);color:#11120f}
@container (max-width:760px){
  .t2f .prototype-head{grid-template-columns:minmax(0,1fr);gap:12px;padding:22px 20px}
  .t2f .prototype-head>p{justify-self:start;max-width:none}
  .t2f .explorer-layout{grid-template-columns:minmax(0,1fr)}
  .t2f .control-stack{border-right:0;border-bottom:1px solid var(--t2f-line);min-height:0}
  .t2f .calculator-grid{grid-template-columns:minmax(0,1fr)}
  .t2f .calc-controls{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 18px;border-right:0;border-bottom:1px solid var(--t2f-line);padding:22px 20px}
  .t2f .calc-results{padding:20px}
  .t2f .map-stage{grid-template-columns:minmax(0,1fr);gap:0;padding:24px 20px;min-height:0}
  .t2f .map-orbits{left:50%;top:150px;transform:translate(-50%,-50%) scale(.6)}
  .t2f .map-copy{margin-top:200px}
  .t2f .map-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 16px;margin-top:18px}
  .t2f .map-labels{overflow-x:auto;grid-template-columns:repeat(7,92px)}
  .t2f .map-toolbar{padding:14px 20px}
}
@container (max-width:460px){
  .t2f .calc-controls{grid-template-columns:minmax(0,1fr)}
  .t2f .calc-results{grid-template-columns:minmax(0,1fr)}
  .t2f .calc-reading{grid-column:auto}
  .t2f .vector-grid{grid-template-columns:minmax(0,1fr)}
  .t2f .map-title{font-size:28px}
  .t2f .metric strong{font-size:20px}
}
</style>
