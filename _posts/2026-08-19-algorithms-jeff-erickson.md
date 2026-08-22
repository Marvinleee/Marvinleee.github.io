---
layout: post
title: "Algorithms (Jeff Erickson) — 算法（伊利诺伊大学开源教材）"
date: 2026-08-19 00:00:00 +0800
categories: [算法]
tags: [算法, 递归, 动态规划, 图算法, NP完全, 计算理论]
description: Jeff Erickson 的免费算法教材（472 页）。按「超过 40 页的 PDF 只做结构化解读」规则，此处仅做结构化解读，不发布原文。

---

> 来源：[Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf)，作者 Jeff Erickson（University of Illinois Urbana-Champaign）。
> 说明：原书 472 页 > 40 页，按规则仅做结构化解读，不发布原文全文。

# 结构化解读

## 书籍概况

Jeff Erickson 的《Algorithms》是一本长期在开源社区享有口碑的免费算法教材，源自其在 UIUC 的授课讲义。它覆盖从基础递归到计算理论的主干内容，以清晰、直给的证明与大量习题著称，是 CLRS 之外最常被推荐的自学/参考书之一。

## 内容结构（主题范畴）

按教材一贯结构，主体包含（具体章名以原书目录为准）：

- **递归与回溯（Recursion / Backtracking）**：分治、递归树、剪枝搜索。
- **动态规划（Dynamic Programming）**：最优子结构、状态设计、经典序列/背包/区间问题。
- **贪心算法（Greedy）**：贪心选择性质、交换论证。
- **图遍历与最短路（Graph Traversal / Shortest Paths）**：BFS/DFS、Dijkstra、Bellman-Ford、Floyd-Warshall。
- **最小生成树 / 网络流（MST / Flows & Cuts）**：Prim/Kruskal、最大流最小割、匹配。
- **NP 难与可计算性（NP-hardness / Computability）**：归约、 undecidability。
- **下界与哈希等**：问题下界、基础数据结构。

## 核心主题与看点

- **证明优先**：每个算法都配形式化正确性与复杂度证明，训练「为什么对」而非「怎么写」。
- **递归思想贯穿**：从分治到 DP 到回溯，统一在「子问题」视角下。
- **从算法到计算理论**：不回避 NP 难与不可判定性，给出完整的复杂度世界观。

## 适合谁读

- 准备算法面试或系统学习算法的人；
- 需要扎实证明训练的研究生/高年级本科生；
- 想补齐「图算法 + 计算理论」版图的工程师。

## 与本站连接

- 与本站 **算法 / 系统 / AI 硬件** 主线间接相关：高效算法是压榨硬件算力的前提；图算法、流网络也是编译器与加速器的常用原语。
- 其「问题下界 / 计算理论」部分，可与本站关于模型效率、可计算边界的讨论相互参照。

## 获取方式

原书 PDF 免费下载：<https://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf>
