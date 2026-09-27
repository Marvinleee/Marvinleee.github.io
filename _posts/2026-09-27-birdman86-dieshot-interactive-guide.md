---
layout: post
title: "芯片内部长什么样？Birdman86 Die Shot 图鉴的交互式导航指南"
date: 2026-09-27 20:00:00 +0800
categories: [半导体技术]
tags: [Die Shot, 芯片架构, 微处理器, DSP, MCU, Wikimedia Commons]
description: "通过可搜索、可筛选的芯片家族地图，快速进入 Birdman86 在 Wikimedia Commons 整理的 CPU、DSP、MCU、图形与控制芯片裸片照片。"
toc: true
---

把芯片封装打开、去除保护层，再把裸片放到显微镜下，会看到一座由存储阵列、数据通路、控制逻辑和互连组成的城市。Die shot（芯片裸片照片）的价值不只是“好看”：它让处理器架构从框图变成真实的物理对象。

芬兰收藏者与摄影者 Pauli Rautakorpi（Wikimedia 用户名 **Birdman86**）长期拍摄 CPU 和其他芯片的裸片，并把结果按家族整理在一个页面中：

> [打开 Birdman86 的完整 die shot 主页](https://commons.wikimedia.org/wiki/User:Birdman86#About_this_page){:target="_blank" rel="noopener external"}

问题是，这个页面很长。它从 8086、MIPS、SPARC 一直排到 DSP、MCU、RAMDAC、网络控制器和 EPROM；如果不知道芯片属于哪个家族，很容易在目录中迷路。

这篇文章把原页面重新组织成一张中文导航地图。你可以在下面输入型号、架构或厂商，先找到正确的家族入口，再进入 Wikimedia Commons 查看原始高分辨率文件。

> **数据范围说明**：下面的路线索引对应 Birdman86 分类主页中可见的内容结构，不等同于他的全部上传记录。原分类主页最后编辑于 2019 年；寻找新增或未分类图片时，请使用“搜索作者全部上传”。

## 30 秒找到一张 die shot

1. 已知芯片型号：直接在搜索框输入，例如 **R4000**、**68040**、**TMS320C30**。
2. 只知道架构或用途：选择 x86、其他 CPU、DSP、MCU、图形或系统芯片。
3. 点击“打开家族目录”，进入 Birdman86 已整理的对应章节。
4. 如果没有匹配路线，点击“搜索作者全部上传”；它会按文件名搜索 Birdman86 的上传记录。
5. 仍未找到时，再使用 Commons 全站图片搜索。

<section id="ds-nav" class="ds-nav" aria-label="Birdman86 die shot 交互式导航">
  <div class="ds-hero">
    <div>
      <span class="ds-kicker">INTERACTIVE CHIP MAP</span>
      <h2>Die Shot 快速导航</h2>
      <p>输入型号、厂商、架构或芯片用途。搜索在本页完成，不需要等待 Wikimedia API。</p>
    </div>
    <a class="ds-source" href="https://commons.wikimedia.org/wiki/User:Birdman86" target="_blank" rel="noopener external">打开原始图鉴 ↗</a>
  </div>

  <div class="ds-search-row">
    <label class="ds-search-label" for="ds-query">搜索芯片</label>
    <div class="ds-search-box">
      <input id="ds-query" type="search" inputmode="search" autocomplete="off" placeholder="例如：R4000、68040、TMS320、网络控制器">
      <button id="ds-clear" type="button">清除</button>
    </div>
    <p class="ds-hint">支持中英文、型号片段和厂商名；按 <kbd>/</kbd> 可快速聚焦搜索框。</p>
  </div>

  <div class="ds-filters" role="group" aria-label="按芯片类别筛选">
    <button type="button" data-group="all" aria-pressed="true">全部</button>
    <button type="button" data-group="x86" aria-pressed="false">x86</button>
    <button type="button" data-group="other-cpu" aria-pressed="false">其他 CPU</button>
    <button type="button" data-group="elements" aria-pressed="false">运算部件</button>
    <button type="button" data-group="dsp" aria-pressed="false">DSP</button>
    <button type="button" data-group="mcu" aria-pressed="false">MCU</button>
    <button type="button" data-group="graphics" aria-pressed="false">图形 / 视频</button>
    <button type="button" data-group="support" aria-pressed="false">系统芯片</button>
  </div>

  <div class="ds-direct" aria-live="polite">
    <div>
      <strong>没有出现在路线卡片中？</strong>
      <span id="ds-direct-copy">输入任意型号，可直接查询 Birdman86 的全部上传文件。</span>
    </div>
    <div class="ds-direct-actions">
      <a id="ds-upload-search" href="https://commons.wikimedia.org/wiki/Special:ListFiles/Birdman86?ilshowall=1" target="_blank" rel="noopener external">浏览作者全部上传 ↗</a>
      <a id="ds-global-search" href="https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=die%20shot" target="_blank" rel="noopener external">Commons 全站搜索 ↗</a>
    </div>
  </div>

  <div class="ds-result-head">
    <p id="ds-count" aria-live="polite"></p>
    <button id="ds-reset" type="button">恢复全部路线</button>
  </div>
  <div id="ds-results" class="ds-results"></div>
  <div id="ds-empty" class="ds-empty" hidden>
    <strong>本地路线中没有匹配项。</strong>
    <p>这不代表作者没有上传该芯片。请使用上方“搜索作者全部上传”，或缩短型号后重试。</p>
  </div>
  <noscript>此导航需要 JavaScript。你仍可使用文末的七个固定分类入口。</noscript>
</section>

## 这套图鉴是怎样组织的

Birdman86 的主页不是按照片上传时间排列，而是按**芯片在计算系统中的角色**组织。理解这七个入口，比记住几百个文件名更有用。

| 原始入口 | 适合查找 | 典型关键词 |
|---|---|---|
| [x86 CPUs and FPUs](https://commons.wikimedia.org/wiki/User:Birdman86#x86_CPUs_and_FPUs) | PC 处理器与浮点协处理器 | 8086、286、386、486、Pentium、K5、6x86 |
| [Other CPUs and FPUs](https://commons.wikimedia.org/wiki/User:Birdman86#Other_CPUs_and_FPUs) | 非 x86 处理器 | MIPS、SPARC、68k、Alpha、PA-RISC、PowerPC |
| [Processor elements](https://commons.wikimedia.org/wiki/User:Birdman86#Processor_elements) | 位片、FPU、乘法器 | Am2901、Am9511、Weitek、ADSP 乘法器 |
| [Digital signal processors](https://commons.wikimedia.org/wiki/User:Birdman86#Digital_signal_processors) | DSP | TMS320、ADSP、DSP56000、DSP32 |
| [Microcontrollers](https://commons.wikimedia.org/wiki/User:Birdman86#Microcontrollers) | MCU | 8048、8051、PIC、6805、TMS1000 |
| [Graphics chips](https://commons.wikimedia.org/wiki/User:Birdman86#Graphics_chips) | 图形、视频与显示接口 | 82786、C-Cube、RAMDAC、Trident |
| [Other chips](https://commons.wikimedia.org/wiki/User:Birdman86#Other_chips) | 系统支持芯片 | Cache、MMU、DMA、Ethernet、EPROM |

### 三种最有效的浏览方式

**按架构找**：适合研究 CPU 演进。例如把 8086、386、486 和 Pentium 放在一起看，可以观察缓存、浮点单元和执行流水线在硅片上逐渐占据更大面积。

**按功能找**：适合硬件工程师。DSP、RAMDAC、DMA、网络控制器、EPROM 的版图往往比通用 CPU 更容易辨认，因为数据通路或存储阵列具有明显重复结构。

**按厂商找**：如果关注 Intel、AMD、Motorola、DEC、TI 或 NEC，可以从 [Microprocessor dies 总分类](https://commons.wikimedia.org/wiki/Category:Microprocessor_dies) 进入厂商子分类。这个入口包含整个 Commons 社区的内容，不只属于 Birdman86。

## 两个例子，先学会如何阅读文件页

<div class="ds-example-grid">
  <article class="ds-example">
    <span>x86 · 3355 × 3253 · 10.55 MB</span>
    <h3>Mitsubishi M5L8086</h3>
    <p>8086 兼容微处理器的裸片照片。文件页提供原始尺寸、拍摄信息、来源、作者和许可证。</p>
    <small>作者：Pauli Rautakorpi · CC BY 3.0</small>
    <a href="https://commons.wikimedia.org/wiki/File:Mitsubishi_M5L8086_die.jpg" target="_blank" rel="noopener external">查看图片与完整文件信息 ↗</a>
  </article>
  <article class="ds-example">
    <span>MIPS · 4134 × 3162 · 11.61 MB</span>
    <h3>MIPS R4000</h3>
    <p>64 位 MIPS 微处理器的裸片照片。高分辨率原图适合观察规则阵列、逻辑区和边缘 I/O。</p>
    <small>作者：Pauli Rautakorpi · CC BY 3.0</small>
    <a href="https://commons.wikimedia.org/wiki/File:MIPS_R4000_die.JPG" target="_blank" rel="noopener external">查看图片与完整文件信息 ↗</a>
  </article>
</div>

进入一个 Commons 文件页后，优先检查四个位置：

1. **Original file**：打开真正的高分辨率图片，而不是页面预览图；
2. **Summary**：确认芯片型号、照片说明、作者和来源；
3. **Licensing**：确认许可证及署名要求，不要假设所有图片都相同；
4. **Metadata / Categories**：相机信息通常不是重点，但分类链接常能带你找到同家族的更多图片。

MIPS R4000 的原图为 4134 × 3162 像素、约 11.6 MB。放大后，规则阵列、较密集的逻辑区域和芯片边缘的 I/O 结构会比网页缩略图清楚得多。

## 可以带着哪些问题去看

### 1. 同一架构，不同厂商会一样吗？

不会。8086、Z80、8051 等架构有许多授权、兼容或克隆实现。即使执行相近的指令集，不同工艺、存储器结构、外围集成度和版图工具都会改变裸片外观。

### 2. 为什么存储器一眼就能认出来？

缓存、ROM 和微码阵列由大量重复单元组成，通常呈现非常规整的矩形。随机逻辑和控制逻辑更不规则，数据通路则可能出现成排的相似结构。

### 3. 为什么老芯片反而更适合入门？

较早芯片晶体管数量少、功能分区大，光学照片能直接显示较多结构。现代 CPU/GPU 的晶体管密度极高，顶层照片更多反映宏观功能块，而不是单个逻辑门。

### 4. Die shot 能告诉我们全部架构吗？

不能。照片可以帮助提出假设，却不能替代芯片手册、显微层析、网表提取或电路分析。不同金属层会遮挡下层结构；颜色还会受到照明、偏振、蚀刻和拼接处理影响。

## 使用与署名边界

Wikimedia Commons 的每个文件都有独立的说明和许可证。本文展示的两张代表图片在各自文件页标注为 **CC BY 3.0**，作者为 Pauli Rautakorpi；转载时应保留作者、原文件页和许可证链接，并说明是否修改。

不要把“来自 Commons”理解成“无需署名”。如果未来增加更多图片，需要逐张查看文件页，而不能把一张图片的许可证自动套用到整个图鉴。

## 固定入口

- [Birdman86 分类主页](https://commons.wikimedia.org/wiki/User:Birdman86)
- [Birdman86 全部上传](https://commons.wikimedia.org/wiki/Special:ListFiles/Birdman86?ilshowall=1)
- [Microprocessor dies 分类](https://commons.wikimedia.org/wiki/Category:Microprocessor_dies)
- [Integrated circuit dies 分类](https://commons.wikimedia.org/wiki/Category:Integrated_circuit_dies)
- [Wikimedia Commons 图片搜索](https://commons.wikimedia.org/wiki/Special:MediaSearch)
- [Commons 内容复用与署名指南](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)

<style>
#ds-nav{--ds-bg:#0b1120;--ds-panel:#111b2f;--ds-line:#2a3a57;--ds-text:#e8eef8;--ds-muted:#9db0ca;--ds-cyan:#54d2d2;--ds-pink:#ff7aa2;--ds-gold:#f5c96a;margin:2rem 0;padding:1.2rem;border:1px solid var(--ds-line);border-radius:20px;background:radial-gradient(circle at 85% 0,rgba(84,210,210,.13),transparent 30%),linear-gradient(145deg,#0a1020,#11192b);color:var(--ds-text);box-shadow:0 18px 55px rgba(3,8,20,.22)}
#ds-nav *{box-sizing:border-box}.ds-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:.35rem .25rem 1.15rem}.ds-kicker{display:block;margin-bottom:.35rem;color:var(--ds-cyan);font:700 .72rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em}.ds-hero h2{margin:0;color:#fff;font-size:1.55rem}.ds-hero p{max-width:48rem;margin:.5rem 0 0;color:var(--ds-muted)}.ds-source,.ds-direct a{display:inline-flex;min-height:44px;align-items:center;justify-content:center;border:1px solid var(--ds-line);border-radius:12px;padding:.55rem .8rem;color:var(--ds-text)!important;text-decoration:none!important;background:rgba(255,255,255,.035);white-space:nowrap}.ds-source:hover,.ds-direct a:hover{border-color:var(--ds-cyan);color:#fff!important}
.ds-search-row{padding:1rem;border:1px solid var(--ds-line);border-radius:16px;background:rgba(4,10,22,.55)}.ds-search-label{display:block;margin-bottom:.45rem;font-weight:700;color:#fff}.ds-search-box{display:grid;grid-template-columns:1fr auto;gap:.55rem}.ds-search-box input{width:100%;min-height:48px;border:1px solid #3a4a68;border-radius:12px;padding:0 .9rem;background:#070d19;color:#fff;font-size:1rem;outline:none}.ds-search-box input:focus{border-color:var(--ds-cyan);box-shadow:0 0 0 3px rgba(84,210,210,.15)}.ds-search-box button,#ds-reset{min-height:44px;border:1px solid var(--ds-line);border-radius:11px;padding:.45rem .8rem;background:#18243a;color:var(--ds-text);cursor:pointer}.ds-search-box button:hover,#ds-reset:hover{border-color:var(--ds-cyan)}.ds-hint{margin:.45rem 0 0;color:var(--ds-muted);font-size:.84rem}.ds-hint kbd{border:1px solid var(--ds-line);border-bottom-width:2px;border-radius:5px;padding:.05rem .35rem;background:#18243a;color:#fff}
.ds-filters{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}.ds-filters button{min-height:44px;border:1px solid var(--ds-line);border-radius:999px;padding:.45rem .8rem;background:rgba(255,255,255,.035);color:var(--ds-muted);cursor:pointer}.ds-filters button[aria-pressed="true"]{border-color:var(--ds-cyan);background:rgba(84,210,210,.14);color:#fff}.ds-direct{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:0 0 1rem;padding:.9rem 1rem;border-left:4px solid var(--ds-gold);border-radius:12px;background:rgba(245,201,106,.08)}.ds-direct strong{display:block;color:#fff}.ds-direct span{display:block;margin-top:.2rem;color:var(--ds-muted);font-size:.86rem}.ds-direct-actions{display:flex;flex-wrap:wrap;gap:.5rem}.ds-direct a{font-size:.84rem}.ds-result-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.7rem .1rem}.ds-result-head p{margin:0;color:var(--ds-muted)}
.ds-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.ds-card{display:flex;min-width:0;flex-direction:column;padding:1rem;border:1px solid var(--ds-line);border-radius:15px;background:rgba(17,27,47,.82)}.ds-card-top{display:flex;flex-wrap:wrap;gap:.35rem}.ds-badge{display:inline-flex;border-radius:999px;padding:.22rem .52rem;background:rgba(84,210,210,.11);color:var(--ds-cyan);font-size:.72rem;font-weight:700}.ds-badge.ds-type{background:rgba(255,122,162,.1);color:#ff9bb9}.ds-card h3{margin:.65rem 0 .35rem;color:#fff;font-size:1.05rem}.ds-card p{margin:0 0 .7rem;color:var(--ds-muted);font-size:.88rem}.ds-keywords{margin-top:auto;color:#b9c8dd;font:500 .76rem/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}.ds-card-actions{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.75rem}.ds-card-actions a{display:inline-flex;min-height:40px;align-items:center;border:1px solid var(--ds-line);border-radius:9px;padding:.38rem .6rem;color:var(--ds-text)!important;text-decoration:none!important;font-size:.8rem}.ds-card-actions a:first-child{border-color:rgba(84,210,210,.55)}.ds-card-actions a:hover{background:rgba(84,210,210,.1);color:#fff!important}.ds-empty{padding:1.25rem;border:1px dashed var(--ds-line);border-radius:14px;text-align:center;color:var(--ds-muted)}.ds-empty strong{color:#fff}.ds-empty p{margin:.35rem 0 0}.ds-match{color:var(--ds-gold)}
.ds-example-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:1rem 0}.ds-example{display:flex;flex-direction:column;min-width:0;padding:1rem;border:1px solid var(--ds-line,#d4d9e2);border-radius:14px;background:linear-gradient(145deg,rgba(84,210,210,.07),transparent 55%),var(--card-bg,#fff)}.ds-example span{color:#168b8b;font:700 .72rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em}.ds-example h3{margin:.45rem 0 .35rem}.ds-example p{margin:0 0 .75rem;color:var(--text-muted-color,#666)}.ds-example small{display:block;margin-top:auto;color:var(--text-muted-color,#666)}.ds-example a{display:inline-flex;min-height:44px;align-items:center;margin-top:.7rem;font-weight:700;text-decoration:none}
@media(max-width:720px){#ds-nav{padding:.85rem;border-radius:15px}.ds-hero,.ds-direct{align-items:stretch;flex-direction:column}.ds-source{width:100%}.ds-search-box{grid-template-columns:1fr}.ds-search-box button{width:100%}.ds-results,.ds-example-grid{grid-template-columns:1fr}.ds-direct-actions{display:grid;grid-template-columns:1fr}.ds-result-head{align-items:flex-start;flex-direction:column}.ds-card-actions{display:grid;grid-template-columns:1fr}.ds-card-actions a{justify-content:center;min-height:44px}}
</style>

<script>
(() => {
  const root = document.getElementById('ds-nav');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const raw = [["x86","CPU / FPU","8086、8088 与 8087","8086/8088/8087","8086 8088 8087 M5L8086 SAB8086 Am8088 MBL8088 NEC OKI M80C88","最早期 PC 处理器及其兼容版本。","8086"],["x86","CPU","80186 与 80188","80186/80188","80186 80188 80C186 80C188 80186EB","带更多片上外设的 x86 分支。","80186"],["x86","CPU","NEC V 系列","NEC_V-series","NEC V20 V30 V50 V53 x86 compatible","NEC 的 x86 兼容与扩展处理器。","NEC V30"],["x86","CPU","80286","80286","Intel 80286 Am286 Harris 80C286 protected mode","从实模式走向保护模式。","80286"],["x86","FPU","80287 与兼容协处理器","80287_and_compatible","80287 80287XL IIT 2C87 numeric coprocessor","286 时代的独立浮点协处理器。","80287"],["x86","CPU","80386","80386","80386 DX SX Am386 386DX 386SX","32 位 x86 的关键一代。","80386"],["x86","FPU","80387 与兼容协处理器","80387_and_compatible","80387 Cyrix FasMath IIT 3C87 ULSI US83C87","386 平台上的浮点单元。","80387"],["x86","CPU","80486：Intel","Intel","80486 DX2 DX4 SX SX2 P24 P24S Intel 486","缓存与 FPU 逐渐进入 CPU 本体。","Intel 80486"],["x86","CPU","80486：AMD","AMD","Am486 DX2 DX4 Am5x86 AMD 486","AMD 的 486 与 5x86 演进。","Am486"],["x86","CPU","80486：Cyrix、TI 与其他厂商","80486","Cyrix Cx486 DLC DRx2 FasCache Texas Instruments TX486 TI486 ST486 UMC U5S","486 时代丰富的兼容处理器生态。","Cyrix 486"],["x86","CPU","第五代：Pentium、K5、6x86","5th_generation","Pentium P54C P55C MMX OverDrive AMD K5 5k86 Cyrix 5x86 6x86 MediaGX","超标量与厂商竞争开始显著反映在版图结构上。","Pentium die"],["x86","CPU","IDT WinChip","IDT_WinChip","IDT WinChip C6 WinChip 2A","面向低成本市场的第五代 x86。","WinChip"],["x86","CPU","AMD Athlon","AMD_Athlon","Athlon XP Thoroughbred Barton K7","更晚期 x86 中缓存和执行单元的尺度变化。","Athlon XP"],["other-cpu","CPU","AMD Am29k","AMD_Am29k","Am29000 Am29030 Am29040 Am29050 29k RISC","AMD 的 32 位 RISC 处理器家族。","Am29000"],["other-cpu","CPU","Intel i860","Intel_i860","80860XR 80860XP i860 RISC vector","Intel 的高性能 RISC/向量尝试。","Intel i860"],["other-cpu","CPU","Intel i960","Intel_i960","80960MX KA SA CA CF JA HD i960 embedded RISC","广泛用于嵌入式系统的 Intel RISC 家族。","Intel i960"],["other-cpu","CPU / FPU","DEC PDP-11 与兼容芯片","DEC_PDP-11","LSI-11 F-11 T-11 J-11 FPA K1801VM Soviet PDP11","从多芯片 CPU 到单芯片实现的过渡。","DEC J-11"],["other-cpu","CPU","DEC VAX","DEC_VAX","MicroVAX CVAX Rigel NVAX VAX FPU","DEC 32 位 CISC 架构的多个世代。","DEC CVAX"],["other-cpu","CPU","DEC Alpha","DEC_Alpha","Alpha 21064 EV4 EV45 21164 EV5 EV56 Samsung","高频 64 位 RISC 设计。","DEC Alpha 21064"],["other-cpu","CPU / FPU","HP PA-RISC","Hewlett-Packard_PA-RISC","PA-7000 PA-7100LC PA-7150 PA-7200 PA-7300LC PCX HP TI FPC","HP 工作站处理器及配套浮点单元。","PA-RISC"],["other-cpu","CPU","Motorola 6800/6809","Motorola_680x","6800 6802 6809 8-bit Motorola","经典 8 位微处理器。","Motorola 6800"],["other-cpu","CPU / FPU","Motorola 68k","Motorola_68k","68000 68HC000 68012 68020 68030 68040 68060 68881 68882 68302 68332 68340 68EN360","从 68000 到 68060，以及独立 FPU 和嵌入式变体。","Motorola 68000"],["other-cpu","CPU","Motorola 88k","Motorola_88k","88100 88110 88k RISC Motorola","Motorola 的 32 位 RISC 家族。","Motorola 88100"],["other-cpu","CPU","PowerPC","PowerPC","PowerPC 603 603e Motorola PPC","PowerPC 早期低功耗处理器。","PowerPC 603"],["other-cpu","CPU / FPU","MIPS R3k","R3k","R3000A R3010 PR2000A PR3400 PIPER LR33000 IDT","MIPS 第三代处理器、FPU 与兼容实现。","MIPS R3000A"],["other-cpu","CPU","MIPS R4k","R4k","R4000 VR4400 R4600 R4650 R4700 MIPS64","64 位 MIPS 的重要起点。","MIPS R4000"],["other-cpu","CPU","MIPS R5k 到 R12k","MIPS","VR5000 RM52X1 RM7000 R8000 R8010 R10000 R12000 QED Toshiba NEC","工作站与高性能 MIPS 家族。","MIPS R10000"],["other-cpu","CPU / FPU","SPARC","SPARC","SPARC V7 V8 CY7C601 MB86901 MB86931 TMS390C602 Weitek 3170 8601 microSPARC SuperSPARC hyperSPARC","SPARC 的整数单元、FPU 和集成处理器。","SPARC die"],["other-cpu","CPU","ARM","ARM","ARM610 GPS ARM6 RISC Acorn","页面中较早期的 ARM610。","ARM610"],["other-cpu","CPU","MOS 6502 与 8080/8085","MOS_Technology","MOS 6502 8080 8085 Am9080 NEC D8085 classic 8-bit","经典 8 位 CPU 的版图入口。","MOS 6502"],["other-cpu","CPU / FPU","National Semiconductor NS32k","National_Semiconductor_NS32k","NS16032 NS32032 NS32C016 NS32332 NS32532 NS16081 NS32081 NS32381","NS32k CPU、FPU 与相关实现。","NS32032"],["other-cpu","CPU","Zilog","Zilog","Z80 MK3880 Z80A Z8002 Signetics 2650 8X300","Z80、Z8002 等经典处理器。","Zilog Z80"],["elements","运算部件","位片处理器","Bit-slice_processors","Am2901 Am2903 Am29203 Am29116 SN74ACT29116 U8032C bit slice","用多个小位宽运算片拼成处理器。","Am2901"],["elements","FPU","通用 FPU","General_purpose_FPUs","Am9511A L64132 SN74ACT8847 floating point coprocessor","不专属于某个 CPU 家族的浮点部件。","Am9511A"],["elements","乘法器 / ALU","高速乘法器与浮点 ALU","Floating_point_ALUs_and_multipliers","ADSP-3220 ADSP-3210 BIT B2120 B8045 B2110 ADSP-1009 ADSP-1010B Weitek 1516","适合观察规则乘法阵列和数据通路。","ADSP-3210"],["dsp","DSP","Analog Devices DSP","Analog_Devices","ADSP-2100A ADSP-2111 ADSP-21msp59 ADSP-21020","Analog Devices 的定点与浮点 DSP。","ADSP-21020"],["dsp","DSP","AT&T / Western Electric DSP","AT&T_/_Western_Electric","DSP16A DSP1604 DSP1616 DSP32 DSP32C Lucent","贝尔实验室体系的 DSP 芯片。","DSP32C"],["dsp","DSP","Motorola DSP","Motorola","DSP56001 DSP56002 DSP96002","Motorola 56k 与 96k DSP。","DSP56001"],["dsp","DSP","Texas Instruments TMS320","Texas_Instruments_TMS320","TMS32010 C15 C20 C25 C28 C30 C31 C40 C50 C51 C52 C53 C511 C209","从早期定点到浮点 TMS320 的长系列。","TMS320C30"],["mcu","MCU","MCS-48","MCS-48","Intel 8748 8742 Fujitsu MBL8742 NEC D8749","Intel 早期单片机家族。","Intel 8748"],["mcu","MCU","MCS-51","MCS-51","8051 8751H 87C51FC Intel AMD","影响深远的 8051 单片机家族。","Intel 8751"],["mcu","MCU","MCS-96 与 PIC","MCS-96","83C196KB PIC16C74A Microchip","16 位控制器与 PIC 单片机入口。","PIC16C74A"],["mcu","MCU","Motorola MCU","Microcontrollers","MC6803 MC68701 MC68705 MC146805 6805","Motorola 8 位 MCU 的多种 ROM/EPROM 版本。","MC68705"],["mcu","MCU","Fairchild F8 与 TI TMS1000","Fairchild_F8","MK3850 MK38P70 F8 TMS1000C calculator MCU","早期单片机和计算器芯片。","TMS1000"],["graphics","图形芯片","早期图形处理器","Graphics_chips","AMD Am95C60 DEC DC510 DC526 DC502 DC323 HP Topcat Intel 82786 SGI GE25A Trident TGUI9400CXi","在 GPU 一词普及前的图形、几何和显示处理芯片。","Intel 82786"],["graphics","视频芯片","视频编解码器","Video_en/decoders","C-Cube CL550 CL950 CL4000 IIT VPU VP2000 VCP Lucent AV4400A JPEG MPEG codec","JPEG、MPEG 与视频处理专用芯片。","C-Cube CL550"],["graphics","显示接口","RAMDAC","RAMDAC","Brooktree Bt457 Bt459 Bt462 Inmos IMSG171 color lookup table","帧缓冲与模拟显示器之间的关键接口。","Brooktree Bt459"],["support","控制器","缓存、内存与 MMU","Cache_controllers","82385 82395 Motorola 88410 RT625A SuperSPARC cache DEC CMCTL Ghidra 68451 68851 88200 NS32082 PMMU MMU","观察处理器之外的存储层级和地址转换芯片。","Intel 82385"],["support","控制器","DMA、总线与中断控制器","Direct_memory_access","8089 82258 68440 68450 NS32203 DMA Am85C80 SCSI Apple PIC HP-IB 68230 Multibus interrupt","系统数据搬运、外设和总线管理芯片。","Intel 8089"],["support","网络芯片","网络控制器","Network_controllers","Am7990 LANCE Am79C930 WLAN DEC SGEC 82586 82596DX X25 token bus TMS380C26 Ethernet","Ethernet、WLAN、X.25 和令牌网络芯片。","Intel 82586"],["support","存储器","EPROM 与微码 ROM","Memory_chips","27256 TMS27C512 M27C4002 EPROM WD LSI-11 microcode ROM","适合观察规则存储阵列。","Intel 27256 die"],["support","安全芯片","密码与系统支持芯片","Crypto_chips","WE 229G crypto processor DEC SSC system support","数量不多但很少见的密码与系统支持芯片。","WE 229G"]];
  const groupNames = {x86:'x86', 'other-cpu':'其他 CPU', elements:'运算部件', dsp:'DSP', mcu:'MCU', graphics:'图形 / 视频', support:'系统芯片'};
  const base = 'https://commons.wikimedia.org/wiki/User:Birdman86#';
  const uploadBase = 'https://commons.wikimedia.org/wiki/Special:ListFiles/Birdman86?ilshowall=1&ilsearch=';
  const globalBase = 'https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=';
  const routes = raw.map(([group,type,name,anchor,keywords,summary,search]) => ({group,type,name,anchor,keywords,summary,search}));
  const query = root.querySelector('#ds-query');
  const results = root.querySelector('#ds-results');
  const count = root.querySelector('#ds-count');
  const empty = root.querySelector('#ds-empty');
  const uploadSearch = root.querySelector('#ds-upload-search');
  const globalSearch = root.querySelector('#ds-global-search');
  const directCopy = root.querySelector('#ds-direct-copy');
  let activeGroup = 'all';
  const normalize = value => value.toLowerCase().normalize('NFKC').replace(/[\s_/.\-]+/g,'');
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const makeCard = route => {
    const article = document.createElement('article');
    article.className = 'ds-card';
    const modelQuery = encodeURIComponent(route.search);
    article.innerHTML = '<div class="ds-card-top"><span class="ds-badge">'+escapeHtml(groupNames[route.group])+'</span><span class="ds-badge ds-type">'+escapeHtml(route.type)+'</span></div>'+
      '<h3>'+escapeHtml(route.name)+'</h3><p>'+escapeHtml(route.summary)+'</p><div class="ds-keywords">'+escapeHtml(route.keywords)+'</div>'+
      '<div class="ds-card-actions"><a href="'+base+encodeURIComponent(route.anchor).replace(/%2F/g,'/')+'" target="_blank" rel="noopener external">打开家族目录 ↗</a><a href="'+uploadBase+modelQuery+'" target="_blank" rel="noopener external">搜索相关上传 ↗</a></div>';
    return article;
  };
  const render = () => {
    const value = query.value.trim();
    const needle = normalize(value);
    const visible = routes.filter(route => {
      const groupMatch = activeGroup === 'all' || route.group === activeGroup;
      const text = normalize([route.name,route.type,route.keywords,route.summary,groupNames[route.group]].join(' '));
      return groupMatch && (!needle || text.includes(needle));
    });
    results.replaceChildren(...visible.map(makeCard));
    count.textContent = '显示 '+visible.length+' / '+routes.length+' 条路线'+(value ? ' · 搜索「'+value+'」' : '');
    empty.hidden = visible.length !== 0;
    const externalQuery = value || 'die shot';
    uploadSearch.href = uploadBase + encodeURIComponent(value);
    uploadSearch.textContent = value ? '搜索作者上传「'+value+'」↗' : '浏览作者全部上传 ↗';
    globalSearch.href = globalBase + encodeURIComponent(externalQuery+' die');
    directCopy.textContent = value ? '继续在作者全部上传或 Commons 全站中查找「'+value+'」。' : '输入任意型号，可直接查询 Birdman86 的全部上传文件。';
  };
  root.querySelectorAll('[data-group]').forEach(button => button.addEventListener('click', () => {
    activeGroup = button.dataset.group;
    root.querySelectorAll('[data-group]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
  query.addEventListener('input', render);
  root.querySelector('#ds-clear').addEventListener('click', () => {query.value='';query.focus();render();});
  root.querySelector('#ds-reset').addEventListener('click', () => {
    activeGroup='all';query.value='';
    root.querySelectorAll('[data-group]').forEach(item => item.setAttribute('aria-pressed',String(item.dataset.group==='all')));
    render();query.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key==='/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) {event.preventDefault();query.focus();}
  });
  render();
})();
</script>
