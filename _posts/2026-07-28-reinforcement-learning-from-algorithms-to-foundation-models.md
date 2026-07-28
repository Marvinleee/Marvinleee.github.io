---
layout: post
title: "Reinforcement Learning: From Algorithms to Foundation Models — 强化学习：从算法到基础模型（Princeton 博士论文解读）"
date: 2026-07-28 21:00:00 +0800
categories: [技术]
tags: [机器学习, 论文研究, 强化学习, 基础模型, 多智能体, 扩散模型]
description: "深度解读 Zihan Ding (Princeton, Chi Jin 组) 2026 年博士论文：从博弈论多智能体 RL（Nash-DQN / FightLadder / 网络负载均衡）到基础模型中的 RL（扩散世界模型 / Consistency Policy / DOLLAR 视频生成 / 视频世界模型 / 记忆增强世界模型），十大章节完整梳理。"
---

> 本文整理自 **Zihan Ding** 的 Princeton 博士论文，导师 **Chi Jin**，2026 年 5 月答辩，全文 319 页。
> 论文标题：*Reinforcement Learning: From Algorithms to Foundation Models*
> 格式为 **结构化英文总结（DeepSeek 辅助梳理） + 中文深度解读**，方便对照阅读。论文 arXiv: 2607.17560。

---

# 第一部分：Structured Summary（结构化英文总结）

*The following is a comprehensive structured summary of the thesis, generated with DeepSeek API assistance from the extracted thesis content.*

## 1. Thesis Overview

This thesis presents a unified investigation of reinforcement learning (RL) across two complementary frontiers: strategic multi-agent interaction in games, and the integration of RL with modern foundation models for complex sequential decision-making. The central thesis is that RL provides a general framework for objective-driven adaptation, and that its principles extend naturally from classical game-theoretic settings to the emerging paradigm of generative world models and foundation-model-based agents.

The first part of the thesis (Chapters 3-5) addresses multi-agent RL in competitive and general-sum games, developing algorithms that achieve non-exploitable strategies, establishing rigorous benchmarks for competitive MARL, and demonstrating practical applications in distributed systems. The second part (Chapters 6-10) explores how generative models—particularly diffusion models and consistency models—can serve as powerful world models and policy representations, enabling long-horizon planning, efficient video generation, and memory-augmented sequential reasoning. Together, these contributions advance both the theoretical foundations and practical capabilities of RL systems, bridging classical algorithmic development with the emerging capabilities of large-scale generative models.

## 2. Part I: Preliminaries (Chapters 1-2)

Chapter 1 establishes the mathematical foundations of reinforcement learning, beginning with the Markov Decision Process (MDP) formalism. The chapter defines the core components: state space S, action space A, transition probability P, reward function R, and discount factor γ. It introduces the fundamental concepts of policy functions (both Markovian and history-dependent), value functions V^π(s) and Q-functions Q^π(s,a), and the objective of maximizing expected discounted cumulative return. The chapter covers value iteration methods, establishing the Bellman optimality equations that underpin value-based RL algorithms.

Chapter 2 extends the framework to multi-agent settings, introducing Markov Games as the natural generalization of MDPs to environments with multiple interacting agents. The chapter covers game-theoretic equilibrium concepts, particularly Nash Equilibrium in zero-sum and general-sum games, and discusses the additional challenges of non-stationarity and strategic adaptation that distinguish multi-agent RL from single-agent settings. Policy gradient methods are introduced as a foundation for the algorithmic contributions in subsequent chapters.

## 3. Part II: Reinforcement Learning in Games (Chapters 3-5)

### 3.1 Chapter 3: Two-Player Zero-Sum Games — Nash-DQN

**Core Problem:** Existing deep RL methods for two-player zero-sum games often produce policies that are vulnerable to adversarial exploitation. While these methods perform well against fixed opponents, they lack guarantees of non-exploitability—a property that is essential for robust multi-agent systems.

**Proposed Method:** This chapter introduces Nash Deep Q-Network (Nash-DQN) and its variant Nash-DQN-Exploiter, two end-to-end deep RL algorithms that combine recent theoretical advances in learning Nash equilibria for tabular Markov games with the function approximation capabilities of DQN. Nash-DQN integrates a minimax Q-learning update that explicitly accounts for adversarial opponents, while Nash-DQN-Exploiter additionally trains an exploiting opponent to stimulate exploration during learning. Both algorithms are practical implementations of theoretically grounded methods with guaranteed convergence to Nash equilibria in tabular settings.

**Key Results:** Experiments on six two-player video games (including five Atari games and Slime Volleyball) demonstrate that Nash-DQN significantly outperforms prior methods including Neural Fictitious Self-Play (NFSP) and Policy Space Response Oracle (PSRO) in terms of robustness against adversarial exploitation.

**Publication:** Ding et al., 2022, "A Deep Reinforcement Learning Approach for Finding Non-Exploitable Strategies in Two-Player Atari Games"

### 3.2 Chapter 4: Zero-Sum Video Game — FightLadder Benchmark

**Core Problem:** The field of competitive multi-agent RL lacks standardized benchmarks that balance complexity, computational efficiency, and generality. Existing platforms are either too simple (board games with tabular representations) or too resource-intensive (Starcraft II, DOTA).

**Proposed Method:** This chapter presents FightLadder, a comprehensive benchmark platform for competitive two-player zero-sum games based on classic fighting video games. The platform supports five games (Street Fighter II, Street Fighter III, Fatal Fury 2, Mortal Kombat, The King of Fighters '97) with rendered image observations, rich strategy spaces, and diverse character move-sets. The benchmark includes implementations of state-of-the-art MARL algorithms and a unified evaluation framework with Elo rating and exploitability metrics.

**Key Results:** Experimental results reveal that existing MARL methods remain limited in solving competitive two-player zero-sum games when faced with visual inputs, rich strategy spaces, and limited human demonstrations. The benchmark establishes baseline performances and identifies key challenges for future research.

**Publication:** Li et al., 2024, "FightLadder: A Benchmark for Competitive Multi-Agent Reinforcement Learning," ICML 2024

### 3.3 Chapter 5: Multi-Player General-Sum Game — Network Load Balancing

**Core Problem:** Network load balancing in cloud data centers involves multiple load balancers operating with partial observations, heterogeneous server capacities, and strict latency constraints. Traditional heuristic approaches are not adaptive and require error-prone manual configuration.

**Proposed Method:** This chapter formulates network load balancing as a Markov potential game by designing a variance-based fairness reward function. The proposed distributed MARL mechanism enables load balancers to learn fair workload distribution policies using only local observations and asynchronous actions, without requiring centralized training or communication overhead.

**Key Results:** Evaluations on both event-based simulations and real-world experiments demonstrate that the MARL approach achieves significant performance gains over traditional methods (ECMP, WCMP, LSQ, SED) in terms of load balancing fairness and quality of service.

**Publication:** Yao and Ding, 2022, "Learning Distributed and Fair Policies for Network Load Balancing as Markov Potential Game," NeurIPS 2022

## 4. Part III: Reinforcement Learning in Foundation Models (Chapters 6-10)

### 4.1 Chapter 6: Diffusion World Model (DWM)

**Core Problem:** Traditional one-step dynamics models in model-based RL suffer from compounding errors when rolled out over multiple time steps, severely limiting their effectiveness for long-horizon planning.

**Proposed Method:** This chapter introduces the Diffusion World Model (DWM), which directly predicts multiple future states and rewards simultaneously using a diffusion model conditioned on current state, action, and expected return. Unlike one-step models that require H recursive calls for H-step planning, DWM generates the entire trajectory in a single forward pass, dramatically reducing compounding errors. The method is integrated into a Dyna-style offline RL framework with Diffusion Model Based Value Expansion (Diffusion-MVE) for improved value estimation.

**Key Results:** On 9 D4RL locomotion tasks, DWM achieves a **44% performance gain** over one-step dynamics models and a **37.5% gain** over Transformer-based sequence models. The method maintains robust performance even with simulation horizons of 31 steps, where one-step models collapse. DWM-based MBRL achieves performance comparable to or slightly exceeding model-free counterparts.

**Publication:** Ding et al., 2024, "Diffusion World Model: Future Modeling Beyond Step-by-Step Rollout for Offline Reinforcement Learning," ICLR 2024 GenAI4DM Workshop

### 4.2 Chapter 7: Consistency Models as RL Policy

**Core Problem:** Diffusion models offer powerful expressiveness for multi-modal action distributions in RL but suffer from slow sampling due to iterative denoising. This creates a critical bottleneck for online RL.

**Proposed Method:** This chapter takes the first step in adapting consistency models—an expressive yet efficient generative model based on probability flow ODEs—as policy representations for deep RL. The consistency policy enables few-step generation while maintaining the expressiveness of diffusion models. Two algorithms are proposed: Consistency-BC for behavioral cloning and Consistency-AC for actor-critic learning.

**Key Results:** Experiments across offline, offline-to-online, and online RL settings demonstrate that consistency policies achieve comparable or superior performance to diffusion policies while **reducing training time by 43%** for offline BC and significantly accelerating online interaction.

**Publication:** Ding and Jin, 2023, "Consistency Models as a Rich and Efficient Policy Class for Reinforcement Learning," ICLR 2024

### 4.3 Chapter 8: Few-Step Video Generation (DOLLAR)

**Core Problem:** Text-to-video diffusion models produce high-quality results but require numerous iterative sampling steps, making them computationally expensive. Post-training adjustments for specific quality requirements are also costly.

**Proposed Method:** This chapter introduces DOLLAR, a framework that combines variational score distillation and consistency distillation to achieve few-step video generation, with latent reward fine-tuning for quality optimization. The method distills a pre-trained teacher diffusion model into a student model that generates high-quality videos in as few as 4 inference steps, while RL-based fine-tuning optimizes for specific reward objectives.

**Key Results:** DOLLAR achieves a **15.6× acceleration** compared to the teacher model while maintaining or improving generation quality. The method demonstrates superior diversity and fidelity compared to prior distillation approaches (DMD, LCM).

**Publication:** Ding and Jin, 2024, "DOLLAR: Few-Step Video Generation via Distillation and Latent Reward Optimization," ICCV 2025

### 4.4 Chapter 9: Video World Model

**Core Problem:** World models for video domains must predict high-dimensional, temporally coherent future observations while supporting action-conditioned generation.

**Proposed Method:** This chapter develops a video world model that leverages diffusion-based generative modeling to produce action-conditional future video frames. The model learns the joint distribution of observation sequences conditioned on action sequences, enabling both planning and policy optimization within the learned video space.

**Key Results:** The video world model demonstrates effective long-horizon prediction capabilities, maintaining visual quality and temporal consistency over extended prediction horizons. The model supports downstream RL tasks by enabling policy optimization within the learned video simulator.

**Publication:** Chen et al., 2025, "Learning World Models for Interactive Video Generation," NeurIPS 2025

### 4.5 Chapter 10: World Model With Memory

**Core Problem:** Standard world models lack mechanisms for maintaining and utilizing long-term context, limiting their ability to reason over extended temporal horizons.

**Proposed Method:** This chapter extends world modeling with explicit memory architectures that enable the model to maintain and query long-term state information. The memory-augmented world model integrates retrieval mechanisms that allow the model to access relevant past experiences when predicting future states.

**Key Results:** The memory-augmented world model demonstrates improved prediction accuracy and planning performance on tasks requiring long-term temporal reasoning, addressing a fundamental limitation of standard world models.

## 5. Key Contributions Summary

| Chapter | Contribution | Method | Publication |
|---------|-------------|--------|-------------|
| 3 | Non-exploitable strategies in zero-sum games | Nash-DQN, Nash-DQN-Exploiter | Ding et al., 2022 |
| 4 | Competitive MARL benchmark | FightLadder platform | Li et al., ICML 2024 |
| 5 | Distributed fair load balancing | MARL as Markov potential game | Yao & Ding, NeurIPS 2022 |
| 6 | Multi-step future prediction | Diffusion World Model (DWM) | Ding et al., ICLR 2024 Workshop |
| 7 | Efficient expressive policy | Consistency-BC, Consistency-AC | Ding & Jin, ICLR 2024 |
| 8 | Few-step video generation | DOLLAR | Ding & Jin, ICCV 2025 |
| 9 | Action-conditional video world model | Video diffusion world model | Chen et al., NeurIPS 2025 |
| 10 | Memory-augmented world modeling | World model with retrieval | In thesis |

## 6. Broader Impact and Future Directions

This thesis advances a unified vision of reinforcement learning as the study of objective-driven adaptation, demonstrating that RL principles apply across a remarkable spectrum—from strategic game-playing to generative world modeling. The work bridges classical algorithmic development with the emerging capabilities of foundation models.

**Future Directions:** Key open challenges include: (1) scaling world models to more complex, open-ended environments; (2) developing theoretical guarantees for generative-model-based RL; (3) integrating memory and reasoning more deeply into world models; (4) extending the game-theoretic framework to mixed cooperative-competitive settings with foundation model agents; and (5) developing unified architectures that combine the strategic reasoning of game-theoretic RL with the representational power of generative models.

---

# 第二部分：解析（深度解读）

## 一、这篇论文为什么值得读

这是一篇"承上启下"的博士论文。所谓"承上"——它回顾了 RL 从单智能体 MDP 到多智能体博弈的经典路径；所谓"启下"——它把 RL 跟 Diffusion Model、World Model、Consistency Model 这些 2023-2025 年最热的基础模型技术深度绑定，展示了 RL 在"基础模型时代"的生命力。

Zihan Ding 在 Princeton Chi Jin 组，这个组以 RL 理论和算法研究著称。整篇论文的 8 项核心贡献（对应 8 篇论文）分布在 NeurIPS、ICML、ICLR、ICCV 等顶会，质量毋庸质疑。

## 二、两大支柱的结构逻辑

论文分为两大块，对应 RL 的两个核心问题：

**Part II — RL in Games（Ch 3-5）："决策的鲁棒性"**
- 核心追问：在多智能体博弈中，如何找到不会被对手利用的策略？
- 三章递进：两人零和 → 竞技格斗基准 → 多人一般和（网络负载均衡）

**Part III — RL in Foundation Models（Ch 6-10）："世界的建模"**
- 核心追问：如何用生成模型来建模环境，从而减少对真实交互的依赖？
- 五章递进：扩散世界模型 → 一致性策略 → 少步视频生成 → 视频世界模型 → 记忆增强世界模型

这两块看似独立，实则共享同一个哲学——**RL 的本质是用激励驱动的适应（incentive-driven adaptation）**。在博弈中，激励是"不被对手利用"；在世界建模中，激励是"预测未来状态的准确性"。

## 三、最值得关注的三项贡献

### 3.1 Diffusion World Model（Ch 6）——一次生成多步，终结滚动误差

传统 model-based RL 的最大痛点：一步模型递归调用 H 次 → 误差指数级放大。DWM 的思路很直接——用扩散模型一次性生成 H 步轨迹，中间不需要递归。结果：模拟 31 步仍不掉性能，一步模型在 5 步后就开始崩。

**投资视角**：这意味着 model-based RL 开始真正追上 model-free 的性能。如果世界模型能准确推演，结合样本效率优势，对机器人、自动驾驶等无法大量试错的场景意义巨大。

### 3.2 Consistency Policy（Ch 7）——扩散策略"加速版"

Diffusion Policy 是 2023-2024 年的热门方向，它能表达多峰分布、适合模仿学习和 offline RL。但慢是致命伤——用扩散模型做一次动作推理要几十步去噪，不适合在线交互。

Consistency Policy 的思路是用一致性模型替代扩散模型，保持表达能力的同时，采样速度提升 40%+。这降低了 diffusion policy 进入在线 RL 的门槛。

### 3.3 DOLLAR（Ch 8）——用 RL "微调"视频生成

这是论文最跨界的贡献。DOLLAR 做了一件很巧妙的事——把 RL fine-tuning 用在视频生成上。先蒸馏快速模型（4 步推理），再用 latent reward model 做 RL 微调，在 latent space 里直接用梯度优化生成质量。

**为什么这很聪明？** 传统 diffusion model 蒸馏只是让速度变快，但质量被 teacher model 上限卡住。DOLLAR 用 reward gradient 做 fine-tuning 可以超越 teacher。这种 "RL as post-training" 的思路和 RLHF 对齐语言模型异曲同工。

## 四、两点启发

**第一，RL 正在从"学做什么"转向"学怎么想"。** 论文后半部分的世界模型、memory 机制，本质上是让 agent 学会"在脑子里推演未来"，而不是"在环境里反复试错"。这和 Yann LeCun 的 World Model 愿景、DeepMind 的 Genie 项目方向一致。

**第二，博弈论和生成模型的交汇是大趋势。** 论文两块内容看似割裂，但未来一定会融合——当多个 foundation-model-based agent 在一个环境里交互时，博弈论的分析框架（Nash equilibrium、非可剥削性）将直接适用。这篇论文已经在为这个方向铺路。

## 五、局限性

- 论文的实验环境（Atari 游戏、D4RL locomotion、Minecraft）相对受控，与现实世界的复杂性有距离
- DWM 和 consistency policy 都依赖离线数据质量，在数据稀疏场景下的鲁棒性未充分验证
- 博弈论部分的算法主要针对两人零和，多人一般和的扩展主要在特定应用场景（网络负载均衡）上验证，通用性有待进一步检验

---

*以上解读基于原文内容整理，英文总结部分经 DeepSeek API 辅助生成并人工校对。论文版权归原作者所有，本发布仅作学术交流用途。*
