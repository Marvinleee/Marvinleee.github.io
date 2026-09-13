---
layout: post
title: "Recurrent Looped Transformer 图解：让状态跨 Token 继续思考"
date: 2026-09-13 17:30:00 +0800
categories: [人工智能, 模型架构]
tags: [Transformer, RLT, 循环模型, KV Cache, 强化学习, 可视化]
description: "拆解 Recurrent Looped Transformer：连续隐藏状态、Encoder 全局记忆、Decoder 滑窗 KV、可扩展时间深度与当前策略回放；同时说明这个新项目目前能证明什么、不能证明什么。"
math: true
toc: true
---

[全屏打开状态回路实验室](/assets/interactive/rlt-lab/) · [回顾 Prefill / Decode](/posts/inference-05-prefill-decode/) · [回顾 KV Cache](/posts/inference-06-memory/)

最近发布的 [Recurrent Looped Transformer（RLT）项目](https://github.com/yifanzhang-pro/recurrent-looped-tranformer/tree/1bee93a9b01c21bea0c7a50ce3f6619f24731e19)提出了一个很适合可视化的问题：**如果 Transformer 不在每个 Token 上“从同样的起点重新算”，而是把上一 Token 的完整 Decoder 状态继续交给下一 Token，会发生什么？**

结论先说：这个项目**值得做架构可视化，但现在还不适合做性能可视化**。截至本文核对的固定修订 `1bee93a`，仓库包含中英文技术报告、项目页与一张架构图，没有训练/推理代码、配置、模型权重、测试、数据集或基准日志，也没有看到许可证。因此本文只独立重绘计算关系，不复制原项目图像；论文提出的推理能力、硬件效率与 RL 扩展性，都按“研究目标”而不是“已验证结果”表述。

> **阅读标签**：本文把内容分成四类——论文定义、从公式直接得到的解析计数、作者提出但仍待验证的研究目标，以及本站原创教学模拟。不要把它们混成同一种证据。

## 先动手：沿 Token 追踪状态

<iframe src="/assets/interactive/rlt-lab/" title="Recurrent Looped Transformer 状态回路实验室" loading="lazy" style="width:100%;height:1120px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

[全屏打开实验](/assets/interactive/rlt-lab/)

建议先做三个动作：

1. 把 Prompt 结束位置左右移动，观察橙色状态链并不会在边界重置；
2. 调整 SWA 窗口，比较全局 Encoder Memory 与局部 Decoder KV 的不同增长方式；
3. 切到“为什么必须回放”，看参数更新后哪些缓存会过期。

实验中的格子、动画与数值均为公式驱动的概念图，不运行 RLT，不代表真实模型输出、显存或延迟。

## 1. RLT 真正“循环”的是什么

普通 Decoder-only Transformer 也会让后面的 Token 读取前面的 KV，但 RLT 又显式携带了一份完整 Decoder 状态：

$$
H_t=(s_t,C_t^D).
$$

其中 $s_t$ 是最后一层的隐藏向量，$C_t^D$ 是每一层 Decoder 滑窗注意力保留的 KV。对每个已观察或已生成 Token，都执行同一个转移：

$$
u_t=\operatorname{Merge}(e_t,s_{t-1}),
$$

$$
H_t=D_\phi(u_t;M_{\le t},C_{t-1}^D,t).
$$

$e_t$ 来自因果 Encoder，$M_{\le t}$ 是由 Encoder 表征构造的前缀记忆。Merge 把当前 Token 的 Encoder 表征与上一 Token 的循环输出接起来；Decoder 再同时读取全局 Encoder Memory 和局部 Decoder SWA KV，产生新的 $s_t$ 与缓存。

这不是简单地把同一个 activation 多用一次。参考的 tied 配置令 $L_E=L_D=L$，在 Encoder 自注意力与 Decoder SWA 之间共享兼容的 Q/K/V/O 投影和 FFN 参数；但两次逻辑执行的注意力连线不同，而且 Decoder 还多出 cross-attention。**共享权重不等于复制激活，也不等于两次执行 FLOPs 完全相同。**

## 2. Prompt / Response 边界不再改变模型

RLT 最清晰的设计点，是 Prompt 和 Response 都走同一个状态转移。设 Prompt 到 $x_T$ 结束，则第一枚 Response Token 的预测状态来自：

$$
H_T=F_T\circ F_{T-1}\circ\cdots\circ F_1(H_0).
$$

生成后续 Token 时继续从 $H_T$ 往前走，而不是重置 $s_T$ 或 Decoder KV。用户消息、工具返回、角色分隔符和助手 Token 也都要更新状态。

论文给出的命题是：在参数、Token、位置、初始状态、窗口规则和确定性算子都一致时，移动“Prompt 到哪里结束”的服务边界，不改变固定 Token 历史下的条件分布。这个结论是**给定假设下的数学等价**；不同 kernel、精度、随机操作、Token 化或错误的缓存恢复仍会造成差异。

## 3. 三种记忆，不是一只 KV Cache

RLT 的内存结构最容易被一句“它也有 KV Cache”掩盖。实际上至少要区分三条通道：

| 通道 | 保存什么 | 随序列如何增长 | Decoder 如何使用 |
|:--|:--|:--|:--|
| Encoder Memory $M_{\le t}$ | Encoder 表征投影出的 K/V | 随前缀增长 | cross-attention 读取全局上下文 |
| Decoder Cache $C_t^D$ | 每层最近的 Decoder K/V | 受 SWA 窗口 $W$ 限制 | 局部 self-attention 读取 |
| 循环输出 $s_t$ | 一个宽度为 $d$ 的隐藏向量 | 尺寸固定、内容持续更新 | 下一 Token 的 Merge 输入 |

按报告的记号，推理缓存阶数近似为：

$$
O\left((L_E+G)t\,d_{KV}+L_D\min(t,W-1)d^D_{KV}+d\right).
$$

第一项是 Encoder 侧缓存与记忆，随 $t$ 增长；第二项是每层 Decoder 滑窗 KV，最多保留 $W-1$ 个历史位置；最后一项是当前循环输出。SWA 把旧 KV 逐出，并不等于过去信息完全消失——旧位置可能已经通过早先的转移影响了后续状态。

反过来也不能说 $s_t$ 是无限容量的历史仓库。门控、投影和收缩都可能削弱长距离路径，固定宽度向量也会形成信息瓶颈。架构提供了一条通路，不保证训练一定学会有效利用它。

## 4. “无限深度”不是无限计算

报告中的 infinite depth 指的是**时间路径没有固定架构上限**：处理到第 $t$ 个 Token 时，从序列起点到当前状态的路径穿过

$$
tL_D
$$

个 Decoder block。若 $L_E=L_D=48$，第 8 个 Token 的状态路径是 $8\times48=384$ 个 Decoder block；但每个 Token 仍只执行 $48+48=96$ 个 Encoder/Decoder 逻辑 block，再加 Merge、memory projection 与 readout。

这三个量必须分开：

- **路径深度**随 Token 数线性增加；
- **每 Token block 数**固定；
- **实际计算与延迟**仍受全局 attention、序列长度、批处理、内存流量和串行依赖影响。

因此“时间深度可扩展”不等于“免费 test-time compute”，更不等于“推理能力已被证明提高”。论文自己也明确指出，结构深度只是可用路径，不是推理质量保证。

## 5. 硬件视角：平行工作包围一个串行核心

对已知的 Prompt 或训练序列，因果 Encoder 可以用 Token 并行 kernel 计算表征与记忆；但 Decoder 的 $H_1,H_2,\dots,H_T$ 仍有严格前后依赖，不能直接替换成普通的全并行 SWA Decoder pass。

可利用的平行性转移到了另一个轴：多个独立序列可以把各自“下一次已就绪的 Decoder 转移”合在一个 batch 中，共享更大的矩阵 kernel 和驻留权重。这让 RLT 的系统问题变得很具体：

- Prompt 越长，必须顺序回放的 Decoder 转移越多；
- 小 batch 或参差的序列长度可能降低利用率；
- 权重共享可能减少参数存储并帮助权重驻留，但不会消除第二次逻辑执行；
- 融合 Merge、Norm、Gate 与 residual 是工程机会，不是已经实现的加速。

所以当前能画的是**执行依赖图**，不能画“比标准 Transformer 快多少”的柱状图。后者至少需要可运行实现、相同质量点、相同硬件、批量与上下文长度控制，以及端到端 Prefill/Decode 数据。

## 6. RL 视角：参数一变，旧状态就不再属于当前策略

RLT 的状态和缓存都依赖参数。采样器用行为策略 $\mu$ 生成 Response 后，应记录实际采样分布下的 Token log-probability；训练器在当前参数 $\Theta$ 下评估这条轨迹时，则要从相同序列起点重建 Encoder 表征、$s_t$ 和每层 Decoder KV：

$$
r_i(\Theta)=\exp\bigl(\log p_\Theta(y_i\mid c,y_{<i})-\log\mu(y_i\mid c,y_{<i})\bigr).
$$

为什么不能直接复用 rollout 时的隐藏状态？因为优化器更新后，旧状态一般不再等于当前参数沿同一 Token 历史计算出的状态。旧的行为概率仍应保留为比率分母，但当前策略概率必须在当前参数下重新算。

这解决的是“状态是否与当前策略一致”的问题，不自动保证任意 off-policy 损失无偏，也不消除 sampler/trainer 的 kernel 精度差异。若行为采样使用 top-k 或 top-p，支持集与原始 softmax 目标还可能不一致；只记录被采 Token 的一个概率，无法补回被截断的动作支持集。

## 7. 这个项目现在处于什么证据阶段

我会把它归为：**定义较完整、实验尚缺位的架构技术报告**。

| 维度 | 当前可确认 | 仍然缺少 |
|:--|:--|:--|
| 架构 | 状态、Memory、SWA、Merge、tied 配置写得具体 | 可执行参考实现与单元测试 |
| 因果/一致性 | 给出服务边界不变性与因果性命题 | 不同 kernel / 精度的数值验证 |
| 复杂度 | 给出工作量、缓存与路径深度解析式 | 实测延迟、吞吐、显存、训练成本 |
| 学习效果 | 描述预训练、SFT、RL 完整转移 | loss 曲线、消融、标准 benchmark、规模实验 |
| 可复现性 | PDF 与项目页公开 | 代码、权重、配置、数据和实验日志 |
| 复用许可 | 可在线阅读 | 仓库未见 LICENSE，不能默认允许复制改编 |

项目发布时间距离本文很近，也未看到 arXiv 标识或同行评审信息。对这样的工作，最稳妥的表述不是“RLT 实现了无限推理”，而是：**作者提出了一种让完整 Decoder 状态跨 Token 演化的架构，并给出了计算与训练语义；其质量和效率收益有待实现与实验验证。**

## 8. 如果未来开放代码，应该补哪些可视化

当前页面已经覆盖架构层；一旦有可运行实现，下一阶段最值得加入四组数据：

1. **时间剖面**：Encoder prefill、顺序 Decoder replay、增量生成分别占多少时间；
2. **状态有效性**：打断或门控 $s_t$ 后，长上下文任务与推理任务如何变化；
3. **缓存剖面**：Encoder Memory、Decoder SWA KV、activation checkpoint 的真实显存占比；
4. **质量—成本前沿**：与同参数量、同训练 FLOPs、同输出质量的 baseline 比较，而不是只比理论层数。

还应加入三个反例开关：在 Prompt 边界重置状态、复用旧参数缓存、把顺序 Decoder replay 错换成并行 pass。让读者看到“为什么不等价”，比再画一张漂亮流程图更有教育价值。

## 来源与使用说明

- Yifan Zhang, [Recurrent Looped Transformer 项目仓库（固定修订 1bee93a）](https://github.com/yifanzhang-pro/recurrent-looped-tranformer/tree/1bee93a9b01c21bea0c7a50ce3f6619f24731e19), 2026-09-12
- [英文技术报告 PDF（固定修订）](https://github.com/yifanzhang-pro/recurrent-looped-tranformer/blob/1bee93a9b01c21bea0c7a50ce3f6619f24731e19/Recurrent_Looped_Transformer.pdf)
- [中文技术报告 PDF（固定修订）](https://github.com/yifanzhang-pro/recurrent-looped-tranformer/blob/1bee93a9b01c21bea0c7a50ce3f6619f24731e19/Recurrent_Looped_Transformer_ZH.pdf)
- Dehghani 等，[Universal Transformers](https://arxiv.org/abs/1807.03819)
- Fan 等，[Addressing Some Limitations of Transformers with Feedback Memory](https://arxiv.org/abs/2002.09402)
- Sun 等，[You Only Cache Once](https://arxiv.org/abs/2405.05254)
- Geiping 等，[Scaling up Test-Time Compute with Latent Reasoning](https://arxiv.org/abs/2502.05171)

本文公式与架构描述以固定修订的英文报告为准。因原仓库截至核对时未见许可证，本文未复制 `figure1.png`、PDF 图表、网页样式或源码；交互页面、图形、中文解释与实现均为本站独立创作。对原报告的归纳不构成作者背书，项目后续若补充代码、许可证或实验，应以新版本为准。
