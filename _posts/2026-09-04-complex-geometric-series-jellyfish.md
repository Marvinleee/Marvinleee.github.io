---
layout: post
title: "复几何级数水母：当 a + ar + ar² + … 长成一只会呼吸的水母"
date: 2026-09-04 09:00:00 +0800
categories: [创意编程, 生成艺术]
tags: [Three.js, WebGL, 复数, 几何级数, 数学可视化, 生成艺术, 交互设计]
description: "用复几何级数的 partial sums 生成触手、用 |a/(1−z)| 的模长曲面生成伞体，一个可以连续观察收敛、临界与发散三种数学状态的 WebGL 交互可视化。"
math: true
toc: true
---

几何级数大概是教科书里最安静的公式：

$$
a+ar+ar^2+\cdots=\frac{a}{1-r},\qquad \lvert r\rvert <1
$$

但只要把公比 $r$ 放进复平面，它就活了。令 $r=\rho e^{i\theta}$，则每一项

$$
ar^n=\lvert a\rvert \rho^n e^{i(\arg a+n\theta)}
$$

**每一次乘以 $r$，都同时完成一次旋转和一次缩放**——这正是螺旋的定义。而 partial sum

$$
S_n=a+ar+\cdots+ar^n=a\frac{1-r^{n+1}}{1-r}
$$

则是一串被螺旋逐段牵引的点，天然像一条正在摆动的触手。

下面这个作品就是把上面三件事直接画出来：模长曲面当伞体，partial sums 当触手，极限点当收缩目标。没有任何一帧是手工关键帧。

<div style="position:relative;width:100%;height:min(72vh,680px);min-height:460px;margin:1.5rem 0;border-radius:16px;overflow:hidden;background:#020306;box-shadow:0 18px 60px rgba(0,0,0,.28);">
  <iframe data-proofer-ignore
    src="/assets/complex-series-jellyfish/"
    title="复几何级数水母交互可视化"
    loading="eager"
    allowfullscreen
    style="width:100%;height:100%;border:0;"
  ></iframe>
</div>

<p style="text-align:center;margin-top:-.5rem;">
  <a href="/assets/complex-series-jellyfish/" target="_blank" rel="noopener">在独立页面中全屏体验 →</a>
</p>

> 拖动 **$\lvert r\rvert$** 滑块从 0.10 一路推到 1.18，你会连续穿过三种数学状态，而不是切换三个动画。按 **H** 键可以隐藏所有 UI，只看画面。

## 一、数学对象与视觉的对应关系

| 数学对象 | 视觉元素 |
|---|---|
| $\lvert f(z)\rvert=\dfrac{\lvert a\rvert}{\sqrt{(1-x)^2+y^2}}$ | 半透明水母伞体 |
| $z=1$ 处的奇点 | 橙色发光尖峰（能量核心） |
| $ar^n$ | 内部旋转的光粒子 |
| $S_n=\sum_{k=0}^{n}ar^k$ | 一条触手 |
| $L=\dfrac{a}{1-r}$ | 收敛目标点（仅收敛模式可见） |
| $\lvert r\rvert=1$ | 绿色收敛边界圆环 |
| $\rho=\lvert r\rvert$ | 收缩速度 |
| $\theta=\arg r$ | 旋转角速度 |

伞体的高度函数只有一项是真的数学，另一项纯粹是“让它看起来在呼吸”：

$$
h(x,y,t)=\underbrace{s\cdot\tanh\!\left(\frac{\lvert a\rvert }{\sqrt{(1-x)^2+y^2+\epsilon}}\right)}_{\text{真正的 }\lvert f(z)\rvert \text{ 曲面}}
\;+\;
\underbrace{A e^{-r^2/\sigma^2}\sin(kr-\omega t)}_{\text{视觉呼吸层}}
$$

$\epsilon$ 的存在只有一个目的：防止 $z\to1$ 时数值爆炸；$\tanh$ 则是 softclip，把无界的模长压进有限高度。

## 二、为什么复级数天生像水母

实数几何级数只会单调地趋近一个点，很无聊。复数版本不同，因为乘法自带旋转：

$$
ar^n = \lvert a\rvert \rho^n \cdot e^{i(\arg a + n\theta)}
$$

- 模长 $\lvert a\rvert \rho^n$ 指数衰减 → **向内收缩**；
- 相位 $\arg a+n\theta$ 线性推进 → **同步旋转**。

两者叠加就是一条向内盘旋的对数螺线。而 partial sum $S_n$ 把这条螺线的每一步累加起来，于是所有 $S_n$ 会沿着螺线一边转、一边收敛到

$$
S_\infty=\frac{a}{1-r}
$$

这正是触手“甩出去又收回来”的观感来源。更关键的是：让 $\rho$ 和 $\theta$ 随时间缓慢振荡

$$
\rho(t)=\rho_0+\Delta\rho\sin(\omega_\rho t+\phi),\qquad
\theta(t)=\theta_0+\Delta\theta\sin(\omega_\theta t)
$$

只要始终限制 $\rho(t)<1$，系统就永远保持收敛——**触手的舒展与收缩不是关键帧，而是参数在收敛域内部游走的自然结果。**

## 三、三种模式：收敛、临界、发散

这不是三个视觉主题，而是几何级数自身的三段性质。判据只有 $\lvert r\rvert $ 与 1 的关系：

| 区域 | 数学事实 | 视觉表现 |
|---|---|---|
| $\lvert r\rvert<1$（CONVERGENT） | $r^n\to 0$，$S_n\to \dfrac{a}{1-r}$ | 蓝青色、稳定螺旋、触手有界、极限点可见 |
| $\lvert r\rvert\approx 1$（CRITICAL） | $\lvert r^n\rvert=1$，项不再衰减 | 白橙色、拖尾变长、伞体振幅放大 1.65 倍、极限点消失 |
| $\lvert r\rvert>1$（DIVERGENT） | $\lvert r\rvert^n\to\infty$ | 橙红色、快速外扩、伞体振幅放大 2.4 倍、无收敛点 |

实现上有个真实的浮点坑：临界判断若写成 `Math.abs(rho - 1) <= eps`，那么滑到 $\lvert r\rvert=0.985$ 时，JS 会算出 `0.015000000000000013 > 0.015`，把**明显收敛**的状态误标成 DIVERGENT。所以判据写成单调三段：

```javascript
function getSeriesMode(rho) {
  const eps = 0.015;
  if (rho < 1 - eps) return "convergent";
  if (rho <= 1 + eps) return "critical";
  return "divergent";
}
```

## 四、发散之后：数学照算，只压缩显示

$\lvert r\rvert>1$ 时 $1.1^{100}$ 已经是天文数字，直接喂给 GPU 会浮点溢出、相机裁剪、几何体炸开。这里的原则是：

> **数学状态保持真实，渲染空间做有限映射。**

$$
\text{visualCompress}(v)=\tanh\!\left(\frac{v}{\ell}\right)\cdot \ell,\qquad \ell=4.6
$$

内部累加的 $S_n$ 是真实复数运算的结果，只在写进顶点坐标的那一刻过一次 $\tanh$。这样触手的"指数级外扩"在视觉上依然成立，但坐标永远落在 $(-4.6, 4.6)$ 内。级数项上还加了一道 `|term| > 1e7` 的熔断——它不改变动力学，只是在数值早已跑出可视范围后停止绘制。

## 五、极限点

只有 $\lvert r\rvert<1$ 时，$\frac{a}{1-r}$ 才代表级数的真实极限，所以极限点用复数除法实时算出来，并在非收敛模式下直接隐藏：

```javascript
const oneMinusR = { re: 1 - r.re, im: -r.im };
const L = cdiv({ re: params.a, im: 0 }, oneMinusR);
```

滑到 $\lvert r\rvert=0.98$ 附近时最值得看：$r^n$ 衰减极慢，触手会变得很长、很亮，却仍然一圈一圈地收进那个白色小球里。这就是"收敛变慢"这件事的直观形态。

## 六、交互与实现

- **$\lvert a\rvert$**：整体尺度，同时抬高伞体；
- **$\lvert r\rvert$**：0.10 – 1.18，横跨三种模式（步长 0.005）；
- **arg(r)**：旋转角速度，决定螺旋的疏密；
- **breathing**：呼吸层振幅，被模式倍率放大；
- **speed**：时间流速；
- 鼠标拖动旋转、滚轮缩放（OrbitControls）；**H** 隐藏 UI；右上角全屏 / 重置。

移动端会自动降配：网格 110 → 64、触手 18 → 8 条、每条级数项 85 → 45，`pixelRatio` 上限锁 2。

技术栈是单文件 HTML + Three.js（ES Module + importmap 从 jsDelivr 加载），没有构建步骤，因此可以直接作为静态页挂在站点下：`/assets/complex-series-jellyfish/`。

## 七、它真正在表达什么

$$
\text{复数乘法}\to\text{旋转+缩放}\to\text{几何级数}\to\text{Partial Sums}\to\text{收敛}\to\text{有机运动}
$$

拖动 **$\lvert r\rvert$** 这个动作，改变的不是某个动画参数，而是一个数学系统本身的状态。看起来像水母，只是这套动力学恰好长这样。

---

同一系列的另一件作品用**辛积分器**积分双势阱哈密顿量，同样由数学直接生成运动：[哈密顿水母：用辛积分器把 H = p²/2m + aq⁴ − bq² 画成一只水母](/posts/hamiltonian-jellyfish/)。此前还有一篇由索引与时间驱动的粒子版本：[用 20,000 个点画一只会呼吸的水母](/posts/jellyfish-generative-art/)。
