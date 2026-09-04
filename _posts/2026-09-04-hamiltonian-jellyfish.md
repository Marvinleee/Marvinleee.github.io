---
layout: post
title: "哈密顿水母：用辛积分器把 H = p²/2m + aq⁴ − bq² 画成一只水母"
date: 2026-09-04 09:10:00 +0800
categories: [创意编程, 生成艺术]
tags: [Three.js, WebGL, 哈密顿力学, 辛积分器, 相空间, 数学可视化, 生成艺术]
description: "双势阱哈密顿量的交互式 WebGL 可视化：leapfrog 辛积分器积分相轨迹，能量面构成半透明伞体，粒子历史形成长拖尾，并实时显示能量漂移。"
math: true
toc: true
---

一个四次势能里的单位质量粒子：

$$
H(q,p)=\frac{p^{2}}{2m}+aq^{4}-bq^{2}
$$

它的运动完全由两条 Hamilton 方程决定：

$$
\dot q=\frac{\partial H}{\partial p}=\frac{p}{m}
$$

$$
\dot p=-\frac{\partial H}{\partial q}=2bq-4aq^{3}
$$

这本来是分析力学课本里的标准例题。但当把能量面 $H(q,p)$ 画成半透明曲面、把相轨迹画成发光流线、把粒子走过的路留成拖尾之后，它就长成了一只水母：两个势阱是伞体的两片垂坠，相轨迹是伞缘的流苏，拖尾是触手。

<div style="position:relative;width:100%;height:min(72vh,680px);min-height:460px;margin:1.5rem 0;border-radius:16px;overflow:hidden;background:#02040a;box-shadow:0 18px 60px rgba(0,0,0,.28);">
  <iframe data-proofer-ignore
    src="/assets/hamiltonian-jellyfish/"
    title="哈密顿水母交互可视化"
    loading="eager"
    allowfullscreen
    style="width:100%;height:100%;border:0;"
  ></iframe>
</div>

<p style="text-align:center;margin-top:-.5rem;">
  <a href="/assets/hamiltonian-jellyfish/" target="_blank" rel="noopener">在独立页面中全屏体验 →</a>
</p>

> 把 **b** 从 0.5 推到 4，势阱会明显加深，粒子从"跨阱乱窜"变成"各自守着一个阱"；右上角读数里的 $\Delta H/H_0$ 是能量守恒的实时检验。按 **H** 键隐藏所有 UI。

## 一、为什么必须用辛积分器

这个系统没有任何耗散，能量必须严格守恒。如果用朴素的显式欧拉法，轨迹会一圈圈向外螺旋，几秒之后粒子就飞走了——那是数值误差在伪装成物理。

这里用的是速度 Verlet / leapfrog，二阶精度、辛（保持相空间体积）、时间可逆：

$$
p_{n+1/2}=p_n+\frac{h}{2}F(q_n)
$$

$$
q_{n+1}=q_n+h\,\frac{p_{n+1/2}}{m}
$$

$$
p_{n+1}=p_{n+\frac12}+\frac{h}{2}F(q_{n+1}),\qquad F(q)=2bq-4aq^{3}
$$

写成代码只有三行：

```javascript
function leapfrog(state, h) {
  const p05 = state.p + 0.5 * h * force(state.q);
  state.q = state.q + h * p05 / params.m;
  state.p = p05 + 0.5 * h * force(state.q);
  return state;
}
```

辛积分器的特征不是"误差为零"，而是**误差长期有界、只振荡不累积**。实测：从 $q=1.2,\ p=0.3$ 出发、步长 $h=0.004$，连续积分 25 万步（约一千个振荡周期）后，最大能量偏差为

$$
\max\,\lvert H-H_0\rvert  \approx 6.9\times 10^{-6}
$$

页面上那个 $\Delta H/H_0$ 读数就是这个量——它会在 $10^{-6}$ 量级上下抖动，但永远不会单调增长。这正是"看到的是物理，而不是数值 artifacts"的证据。

## 二、数学对象与视觉的对应关系

| 数学对象 | 视觉元素 |
|---|---|
| 能量面 $H(q,p)$ | 半透明水母伞体（softclip 后） |
| 双势阱 $q=\pm\sqrt{b/2a}$ | 伞体的两处垂坠 |
| 势阱深度 $\dfrac{b^{2}}{4a}$ | 面板实时读数 |
| 相轨迹（辛积分出的轨道） | 伞体上的发光流线 |
| 粒子当前相点 | 彩色小球 |
| $N$ 步历史位置 | 长拖尾（触手） |
| 周期表面形变 | 水母呼吸 |
| 能量 $E<0$ | 在单个阱内振荡 |
| 能量 $E>0$ | 跨越势垒、在两个阱之间往返 |

伞体高度函数同样分成"真数学"与"纯视觉"两层：

$$
h(x,y,t)=\underbrace{s\cdot\tanh\!\big(k\,(H(q,p)+c)\big)}_{\text{真正的能量面，softclip}}
\;+\;
\underbrace{A e^{-r^{2}/\sigma^{2}}\sin(kr-\omega t)}_{\text{呼吸}}
$$

其中 $q=x/S,\ p=y/S$。第一项保证形状完全由哈密顿量决定，第二项只负责让它看起来在呼吸，**不参与任何动力学计算**。

## 三、相轨迹流线：不是装饰，是积分出来的

画面上那些淡蓝色流线，是从不同初值出发、用**同一个** `leapfrog` 积分出来的真实轨道：

```javascript
for (let s = 0; s < STEPS; s++) {
  leapfrog(st, STREAM_H);
  pts.push({ q: st.q, p: st.p });
}
```

初值均匀铺在相空间中不同半径的圆上，因此会同时覆盖：

- 势阱内部的小闭合环（$E<0$，粒子被困在一个阱里）；
- 跨越势垒的大环（$E>0$，粒子在两阱之间来回穿梭）；
- 靠近分界线（separatrix）的轨道，形状最敏感、也最好看。

拖动 **a / b / m** 会立刻重算这些流线——因为势能形状变了，轨道本来就该跟着变。

## 四、粒子与拖尾

32 个粒子（移动端 18 个）的初值不是随机的，而是**撒在指定能量等值面上**：第 $i$ 个粒子先取一个目标能量 $E_i$，再解出满足 $E_i-V(q)\ge 0$ 的 $q$，然后令

$$
p=\pm\sqrt{2m\,(E_i-V(q))}
$$

这样能量从阱底一路铺到势垒之上，一眼就能看出"能量决定轨道拓扑"这件事。每个粒子保留 430 个历史点（移动端 180），投影到能量面上形成拖尾；粒子一旦因极端参数跑飞，会就地重新播种。

积分步长是**固定**的（$h=0.004$），每帧按真实耗时决定推进多少步（上限 14 步）。这样积分精度不随帧率变化——60Hz 和 120Hz 屏幕上看到的是同一条轨道。

## 五、交互

- **a**（四次项）：越大势阱越窄越陡；
- **b**（二次项）：越大势阱越深，$q=\pm\sqrt{b/2a}$ 分得越开；
- **m**（质量）：影响动能项，改变相同能量下的速度；
- **breathing**：呼吸层振幅；
- **speed**：时间流速；
- 鼠标拖动旋转、滚轮缩放（OrbitControls）；**H** 隐藏 UI；右上角全屏 / 重置。

想快速看到"相变"：把 **b** 调到 0.6 左右，势阱极浅，几乎所有粒子都在两阱之间穿梭、流线连成一片；再推到 3.5，粒子立刻被分成两簇，各自绕着一个阱打转。

## 六、实现

单文件 HTML + Three.js（ES Module + importmap 从 jsDelivr 加载），无构建步骤，静态挂在 `/assets/hamiltonian-jellyfish/`。移动端自动降配：网格 130 → 72、粒子 32 → 18、拖尾 430 → 180、流线 12 条 → 6 条，`pixelRatio` 上限锁 2。

---

同一系列的另一件作品把**复几何级数**的 partial sums 画成了触手，同样可以连续观察收敛、临界与发散三种状态：[复几何级数水母：当 a + ar + ar² + … 长成一只会呼吸的水母](/posts/complex-geometric-series-jellyfish/)。
