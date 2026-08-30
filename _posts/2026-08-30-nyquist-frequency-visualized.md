---
layout: post
title: "奈奎斯特频率是什么？用一个倒转的轮子看懂采样与混叠"
date: 2026-08-30 14:00:00 +0800
categories: [信号处理, 交互可视化]
tags: [奈奎斯特频率, 采样定理, 混叠, DSP, Canvas, JavaScript]
description: "拖动信号频率与采样频率，观察一个真实正转的轮子为何会在数字画面中变慢、倒转或静止。"
toc: true
---

在电影里，高速行驶的汽车轮胎有时会“倒转”。那不是车真的在倒车，而是摄影机的帧率不够高，把快速正转误读成了慢速反转。

下面这个交互实验把同一个现象做成了一个可以亲手操纵的模型：一个持续正转的圆盘，一台每秒只“闪光”若干次的“相机”，以及它们共同产生的错觉。

<div class="nyquist-embed" style="position:relative;width:100%;height:min(78vh,760px);min-height:560px;margin:1.5rem 0;border-radius:18px;overflow:hidden;background:#05070d;box-shadow:0 18px 60px rgba(0,0,0,.32);">
  <iframe data-proofer-ignore
    src="/assets/nyquist/"
    title="奈奎斯特频率与混叠交互实验"
    loading="eager"
    allowfullscreen
    style="width:100%;height:100%;border:0;"
  ></iframe>
</div>

<p style="text-align:center;margin-top:-.5rem;">
  <a href="/assets/nyquist/" target="_blank" rel="noopener">打开全屏实验 →</a>
</p>

> 提示：上方 iframe 会加载一个完整交互页面；若遇到页面被浏览器策略拦截脚本，可直接点击“打开全屏实验”。实验不依赖外部脚本，也不播放声音。

## 从连续到离散

真实世界是连续的，但数字设备只能在一个个离散时刻记录它。每个记录点就是一个**样本**。问题是：如果这些样本太稀疏，多个不同的连续运动可能会穿过完全相同的离散点，而数字系统通常会选择“可表示范围内最慢、最温和”的那一种解释——这就是**混叠（aliasing）**。

实验中的圆盘以真实频率 `f` 持续正转。采样频率 `f_s` 决定每秒记录多少次。当：

```text
f_s > 2 f
```

时，采样足够密集，能唯一识别真实运动；这个可表示的最高频率边界 `f_N = f_s / 2` 就是**奈奎斯特频率**。

当 `f` 越过 `f_N`，高频就会“折返”成低频。你可以把采样频率拖到低于真实频率的两倍，看看圆盘怎样从正转变慢、倒转，甚至完全静止。

## 折叠公式

单频信号的混叠频率可以用下面的公式算出来：

```text
f_alias = |f − round(f / f_s) × f_s|
f_signed = f − round(f / f_s) × f_s
```

- `f_signed > 0`：表观继续正转；
- `f_signed < 0`：表观反向旋转；
- `f_signed ≈ 0`：表观静止。

页面下方面板里的洋红色虚线，就是只用这些采样点做有限窗 sinc 插值后“自认为”看到的信号——它和真实信号完全不同，却完美地穿过每一个样本。

## 奈奎斯特频率 vs. 奈奎斯特采样率

这两个词常被混为一谈：

- **奈奎斯特频率**：给定采样率后，可无歧义表示的最高频率，`f_N = f_s / 2`。
- **奈奎斯特采样率**：给定信号带宽后，所需采样率边界，约为 `2B`。

页面状态卡里把“恰好等于两倍”标成**临界**而不是安全，因为临界时采样结果仍可能依赖相位，工程上通常要求 `f_s > 2B` 并留出抗混叠滤波器余量。

## 三个常见场景

同一个采样问题在音频、视频和图像里反复出现：

- **车轮倒转**：赛车电影里轮胎“反转”就是视频帧率低于轮辐运动频率的两倍。
- **音频折返**：CD 采用 44.1 kHz 采样率，对应 22.05 kHz 的奈奎斯特频率；超过该频率的声音如果不在采样前滤除，就会折回可听频段。
- **摩尔纹**：细密条纹在数码相机采样时也会产生低频“重影”。

## 实验操作速查

| 按键 | 功能 |
|---|---|
| Space | 暂停 / 继续 |
| ← / → | 调整真实频率 |
| ↑ / ↓ | 调整采样频率 |
| 1–5 | 切换五个预设 |
| A | 开关自动讲解 |
| R | 恢复默认 |
| 在波形上左右拖动 | 改变相位 |

## 参考资料

- MIT OpenCourseWare, [Lecture 16: Sampling](https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-16-sampling/)
- MIT OpenCourseWare, [Sampling and the Discrete Fourier Transform](https://ocw.mit.edu/courses/2-161-signal-processing-continuous-and-discrete-fall-2008/resources/samplingdft/)
- Claude Shannon, *A Mathematical Theory of Communication*, [Theorem 13 (PDF)](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)
