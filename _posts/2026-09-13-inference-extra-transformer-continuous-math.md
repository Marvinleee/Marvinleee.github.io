---
layout: post
title: "推理系统番外篇：从 22 步矩阵计算到一条连续方程"
date: 2026-09-13 09:00:00 +0800
categories: [人工智能, 推理系统]
tags: [Transformer, 数学, Attention, 算子拆分, 连续模型, 可视化]
description: "换一个连续数学视角理解 Transformer：Token 是空间位置，特征是另一条坐标轴，网络深度是时间；Attention 是非局部积分，归一化是约束投影，一层网络是一次算子拆分。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [离散视角：逐项算清一个 Qwen3 Transformer 层](/posts/inference-03-transformer-layer/) · [全屏打开双视角实验](/assets/interactive/transformer-layer/#view-continuous)

第 3 章把一个 Qwen3 Transformer 层拆成了 22 个可核对的矩阵步骤：RMSNorm、Q/K/V 投影、RoPE、GQA、因果掩码、两次残差和门控 MLP。那条路线回答的是：**一个现代大模型层究竟算了什么？**

这篇番外换一个问题：**为什么 Attention、归一化、前馈网络和残差会以这样的顺序组成一层？**

2026 年 4 月修订的论文 [A Mathematical Explanation of Transformers](https://arxiv.org/abs/2510.03989) 提供了一种很有启发性的回答：把 Transformer 看成一条连续积分—微分方程的离散化结果。它不是推翻矩阵公式，而是像把一张逐帧动画还原成“运动规律”——离散计算告诉我们每一帧是什么，连续模型试图解释帧与帧为何这样连接。

> 本文介绍的是一种数学解释，不是 Transformer 唯一的“本质”。论文严格对应的主要是 2017 年经典 Transformer encoder；Qwen3 等现代因果语言模型还包含 RMSNorm、RoPE、GQA、SwiGLU 与因果掩码等结构，需要回到离散公式和真实实现分别核对。

## 先动手：一个层，两种视角

<iframe src="/assets/interactive/transformer-layer/#view-continuous" title="Transformer 连续数学视角交互实验" loading="lazy" style="width:100%;height:1180px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

[全屏打开实验](/assets/interactive/transformer-layer/#view-continuous)

这不是一段预制动画。连续视角直接读取第 3 章玩具模型的实际计算结果，并提供三组可以相互印证的观察：

- 拖动“深度时间”，看隐藏状态经过归一化、Attention 与 FFN 后如何改变；
- 选择一个 Query Token，看它从哪些 Value Token 读取信息；
- 用同一个向量比较经典 LayerNorm 与 Qwen3 所用 RMSNorm。

滑块中间的平滑状态只是为了帮助观察离散步骤之间的变化，不代表芯片真的在求解一条连续曲线。

## 1. 把一张矩阵看成一个函数

通常我们把一段长度为 $N_x$、隐藏维度为 $N_y$ 的序列写成矩阵：

$$
U\in\mathbb{R}^{N_x\times N_y}.
$$

第 $i$ 行是第 $i$ 个 Token 的隐藏向量，第 $j$ 列是第 $j$ 个特征。论文把这张离散网格推广成函数：

$$
u(x,y,t).
$$

三个变量分别扮演不同角色：

| 变量 | 离散模型中的含义 | 连续视角中的含义 |
|:--|:--|:--|
| $x$ | Token 下标 $i$ | Token 域上的位置 |
| $y$ | 特征下标 $j$ | 特征域上的位置 |
| $t$ | 层号或子步骤 | 隐藏状态演化的“深度时间” |

因此，矩阵 $U_{ij}$ 可以看成 $u(x,y,t)$ 在 Token—特征网格上的采样值。网络越深，不是句子在现实世界里流逝了更久，而是隐藏状态经历了更多次离散更新。

这个替换最重要的价值，是让“层”获得了时间步的含义：一个 Transformer block 对应一次从 $u^n$ 到 $u^{n+1}$ 的演化，多个 block 就是多个时间步的复合。不同层的权重仍然可以不同，因为连续模型中的可学习参数也可以随 $t$ 变化。

## 2. Attention：一次跨位置的非局部积分

先回到熟悉的离散公式。对第 $i$ 个 Query，Attention 输出是所有 Value 的加权和：

$$
o_i=\sum_j \alpha_{ij}v_j,
\qquad
\alpha_{ij}=\operatorname{softmax}_j\left(\frac{q_i k_j^{\mathsf T}}{\sqrt{d_h}}\right).
$$

权重 $\alpha_{ij}$ 表示位置 $i$ 从位置 $j$ 读取多少信息。把离散 Token 下标推广为连续变量，就得到：

$$
\mathcal A[u](x,y,t)
=\int_{\Omega_x}\gamma(x,\tilde x,t;u)\,
V(\tilde x,y,t;u)\,d\tilde x.
$$

这里 $\gamma$ 是连续版注意力权重，$\tilde x$ 遍历可读取的 Token 位置。它之所以被称为**非局部算子**，是因为 $x$ 位置的新状态不只取决于自己，还取决于远处的 $\tilde x$。

Q、K、V 投影也可以写成沿特征域的积分。例如：

$$
Q(x,y,t;u)=\int_{\Omega_y}
W^Q(\xi,y,t)u(x,\xi,t)\,d\xi.
$$

离散化 $y$ 后，这个积分就退回我们熟悉的矩阵乘法 $Q=UW^Q$；离散化 $x$ 后，Attention 积分也退回对 Value 的加权求和。因此“积分”不是另一套神秘算法，而是矩阵乘法与求和在连续域中的对应物。

### 因果语言模型要多一条边界

论文的主要对应对象是经典 Transformer encoder，其中一个 Token 可以关注整个序列。自回归 LLM 还要加入因果约束：位置 $x$ 不能读取未来的 $\tilde x>x$。连续写法可以把积分域限制为过去：

$$
\mathcal A_{\text{causal}}[u](x,y,t)
=\int_{\tilde x\le x}\gamma(x,\tilde x,t;u)V(\tilde x,y,t;u)\,d\tilde x.
$$

这是从论文框架向因果模型做的自然延伸，不应误写成论文已经完整证明的现代 decoder 结果。交互实验保留了离散因果掩码：修改最后一个 Token 时，较早位置不应随之改变。

## 3. FFN：只在每个位置内部改造特征

Attention 沿 Token 轴读取远处信息，FFN 则对每个 Token 独立工作。对固定的 $x$，它只变换特征变量 $y$：

$$
u(x,\cdot,t)\longmapsto
\operatorname{FFN}\bigl(u(x,\cdot,t)\bigr).
$$

这形成一个非常有用的对照：

- Attention 是跨 Token 的非局部通信；
- FFN 是逐 Token 的局部特征变换。

“局部”不表示 FFN 不重要，也不表示它只看一个标量。它可以在一个 Token 的整个隐藏维度内混合特征，只是不在这一步直接读取其他 Token。前面的 Attention 已经把上下文送进当前位置，FFN 再对这些信息进行非线性重组。

论文用带 ReLU 的经典前馈网络建立对应关系；Qwen3 实际使用带 SiLU 的门控 MLP（SwiGLU 结构）。所以“沿特征维度做位置独立变换”这一结构洞见可以保留，但具体连续算子的严格形式不能直接照搬。

## 4. LayerNorm：投到一个满足统计约束的集合

经典 LayerNorm 对每个 Token 的特征向量减去均值、除以标准差，再应用可学习的缩放和平移。暂时忽略可学习参数，它把向量变成均值为 0、方差为 1 的向量。

论文给出一个几何解释：定义满足指定均值 $\sigma_1$ 与方差 $\sigma_2^2$ 的集合 $S$，归一化可以看成把当前状态投影到这个约束集合：

$$
u^*=\arg\min_{u\in S}\frac12\lVert u-v\rVert^2.
$$

这句话的直觉是：在所有满足统计约束的候选向量中，选择离原向量 $v$ 最近的一个。于是归一化不再只是“机械地套公式”，而成为演化过程中的一次约束校正。

但第 3 章的主线模型 Qwen3 使用的是 RMSNorm：

$$
\operatorname{RMSNorm}(v)
=\gamma\odot\frac{v}
{\sqrt{\frac1d\sum_jv_j^2+\epsilon}}.
$$

RMSNorm 不减均值，因此一般不会落到“均值为 0”的集合。交互实验并排显示两者的均值、标准差与 RMS，正是为了提醒：**论文的投影解释针对经典 LayerNorm，不能不加说明地套到 RMSNorm。**

## 5. 算子拆分：为什么复杂的一层被拆成几个模块

假设隐藏状态同时受到 Attention、归一化和 FFN 三种机制影响，可以把连续演化示意地写成：

$$
\frac{\partial u}{\partial t}
=\mathcal A[u]+\mathcal N[u]+\mathcal F[u].
$$

直接同时处理三个复杂算子很困难。数值分析中的**算子拆分**会把一个时间步拆成多个更容易求解的子步骤：先处理 $\mathcal A$，再处理 $\mathcal N$，然后处理 $\mathcal F$。就像不把洗、切、炒压成一个动作，而是让每个阶段只解决一种问题。

论文证明，在选择相应的显式、隐式与松弛步骤并对 Token、特征两个空间变量离散化后，这组子步骤可以恢复经典 Transformer encoder 的 Attention、残差、LayerNorm 与前馈网络。一个时间步对应一个 block，$N_t$ 个时间步对应 $N_t$ 个 block。

这也给残差连接一个新的读法。熟悉的

$$
u^{n+1}=u^n+\Delta t\,\mathcal A[u^n]
$$

很像微分方程的一次显式时间更新：保留旧状态，再加上当前算子带来的增量。它不证明残差网络“本质上就是”某条 ODE，但解释了为什么“原状态 + 小变化”与时间离散天然相容。

## 6. 训练也可以看成控制问题

在连续框架中，$W^Q$、$W^K$、$W^V$ 和 FFN 权重不再只是矩阵表，而是随深度时间变化的控制变量。训练就是寻找一组控制，使终点状态 $u(T)$ 在任务损失上尽可能好。

这个视角把几个通常分开的概念连了起来：

| 深度学习语言 | 连续模型语言 |
|:--|:--|
| 隐藏状态 | 随时间演化的状态 $u(t)$ |
| 每层参数 | 随时间变化的控制变量 |
| 多层堆叠 | 多个时间步复合 |
| 前向传播 | 给定控制后的状态演化 |
| 训练 | 寻找使终点损失最小的控制 |

它最有潜力的用途不只是解释已有结构，还包括借用数值分析中的稳定性、收敛性与不同离散格式去设计新架构。不过“可能启发”不等于“已经带来更强模型”；这仍需要理论与实验共同验证。

## 7. 这套视角能解释什么，不能解释什么

它擅长解释结构关系：

- 为什么网络深度可以类比时间；
- 为什么 Attention 是跨位置的非局部作用；
- 为什么 FFN 是逐位置的特征变换；
- 为什么归一化可以理解为约束校正；
- 为什么一个复杂演化会被拆成连续的模块化子步骤。

它暂时不能替代现代 LLM 的工程说明：

- 论文集中于 2017 年经典 Transformer block 和 ReLU；
- 位置编码的连续形式、底层方程的适定性与正则性仍被作者列为后续方向；
- Qwen3 的 Pre-Norm、RMSNorm、RoPE、GQA、SwiGLU 和因果掩码并未被同一推导逐项覆盖；
- 它不解释 KV Cache、Prefill/Decode、量化、内核融合或 GPU/NPU 调度；
- 它也不自动回答规模扩展、涌现能力或模型为何学到特定知识。

所以两种视角不是竞争关系，而是分工：第 3 章的离散路线负责“算对、核对实现”，这篇番外负责“建立结构直觉、连接数学工具”。

## 8. 推荐的阅读顺序

如果第一次接触 Transformer，按下面顺序会更稳：

1. 先读[第 2 章：文本到张量](/posts/inference-02-text-to-tensor/)，知道 $[T,d]$ 从哪里来；
2. 再用[第 3 章的 22 步实验](/posts/inference-03-transformer-layer/)走完一次真实结构；
3. 回到本文，把矩阵、求和、层号分别提升为函数、积分与深度时间；
4. 在交互实验中切换两种视角，用同一组数值检查概念；
5. 最后阅读原论文的连续模型、算子拆分和局限部分。

真正理解的检验不是能否复述“Attention 是积分”，而是能否在两套语言间来回翻译：看到 $\sum_j\alpha_{ij}v_j$，知道它为何是非局部算子的离散版；看到 $u(x,y,t)$，也知道实际程序最终仍要落回有限矩阵、离散层和设备算子。

## 来源与延伸阅读

- Xue-Cheng Tai, Hao Liu, Lingfeng Li, Raymond H. Chan, [A Mathematical Explanation of Transformers（arXiv v2，2026-04-12）](https://arxiv.org/abs/2510.03989)
- [论文 HTML 全文](https://arxiv.org/html/2510.03989v2)
- Vaswani 等，[Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [推理系统 03：逐项算清一个真实 Qwen3 Transformer 层](/posts/inference-03-transformer-layer/)

本文中的连续曲线是教学插值；离散矩阵来自站内玩具模型的 JavaScript 双精度计算，不是 Qwen3 权重输出或硬件性能实测。
