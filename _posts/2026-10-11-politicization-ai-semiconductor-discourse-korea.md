---
layout: post
title: "AI 半导体话语的政治化：韩国媒体覆盖的纵向分析（2023–2025）—— 计算传播学论文摘要层解读"
date: 2026-10-11 09:00:00 +0800
categories: [AI 半导体, 论文解读]
tags: [AI半导体, 媒体话语, 议程设置, LDA, 主题建模, 关键词共现网络, 情感分析, 计算传播学, 韩国媒体]
description: "一篇对 49,117 篇韩国新闻报道的纵向计算分析：AI 半导体话语在 2023–2025 年经历了「稳定 → 期待 → 政治化」三阶段，政策类目占比从 7.61% 翻倍到 17.49%；而情感下滑的 82.5% 来自「同一话题内政治词汇的渗入」，而非话题结构被替换。方法论层面的贡献比结论本身更值得读。全文在 Elsevier 付费墙后，本页只含可得的摘要层。"
toc: true
---

> **来源**：JongHwi Song（延世大学 AI 融合科学研究所）、SooYeun Yoo（延世大学软件学部）、Urtnasan Erdenebayar（延世大学 AI 半导体学部），*The politicization of AI semiconductor discourse: A longitudinal analysis of Korean media coverage (2023–2025)*，*Technological Forecasting and Social Change*（Elsevier），Volume 234，Article 124903，预计 2027 年 1 月号（in press）。
> **原文链接**：<https://www.sciencedirect.com/science/article/pii/S004016252600380X>
> **⚠️ 全文未含提示**：该文位于 Elsevier 付费墙之后。本页只能取得并转载 Highlights、Abstract、Keywords、Data availability 与作者简介；正文的 Introduction、Literature review、Data and methods、Results、Discussion、Conclusion 全部无法取得，也未能找到任何开放获取版本。因此第二部分是**基于摘要与亮点的解读**——凡涉及方法实现细节的推断，文中均已显式标注为推断，请勿当作论文原文。
> **转载说明**：第一部分为可得的英文原文逐字转载，版权归原作者与 Elsevier 所有；本站仅调整排版与标题层级、不改动任何文字表述。第二部分为本站独立撰写的中文结构化解读，其中的质疑与判断属解读者观点，不代表原作者立场。

# 第一部分：英文原文（可得部分）

> 以下为 ScienceDirect 页面上公开可见的全部英文原文内容，逐字转载。

## Highlights

- Korean AI-semiconductor news discourse politicized sharply in a narrow 2025 window.
- Four computational methods (thematic, LDA, network, sentiment) on 49,117 articles
- Empirically derived three-phase model: aspiration → euphoria → contestation
- Sentiment fell via within-topic infiltration of political vocabulary, not topic mix.
- Validated by shift-share, cross-method (r = 0.86), and KR-FinBert-SC transformer checks

## Abstract

This study examines the evolution of AI semiconductor media discourse in South Korea from January 2023 to June 2025, analyzing 49,117 news articles collected from the BigKinds database. Integrating four complementary computational methods—thematic categorization, Latent Dirichlet Allocation (LDA) topic modeling, keyword co-occurrence network analysis with Louvain community detection, and lexicon-based sentiment analysis—we identify a three-phase transformation in discourse structure. In the first phase (Stability, January 2023–July 2024), coverage centered on technological development and manufacturing competition, with US, technology, firm, and investment occupying the most central positions in the keyword network. The second phase (Anticipation, August–December 2024) was characterized by financial euphoria driven by NVIDIA's market surge and HBM demand, during which market-oriented narratives dominated and sentiment, having peaked in July 2024, began to decline. The third phase (Politicization, January–June 2025) marked a decisive shift toward political contestation: the Policy thematic category more than doubled from 7.61% to 17.49% across these empirically derived phases (\|z\| = 39.40, p < 0.001), the presidential-election topic grew nearly fourfold, and political keywords displaced technology keywords from central network positions. This politicization was accompanied by a sentiment decline that a formal shift-share decomposition attributes predominantly to within-topic change (82.5% of the decline) rather than to shifts in topic composition: political vocabulary infiltrated otherwise non-political coverage and depressed its tone, while market-focused articles remained affectively stable—evidence of lexical infiltration rather than simple topic substitution. These findings extend agenda-setting theory by demonstrating that the agenda setters for technology-intensive issues shift rapidly in response to geopolitical shocks, and offer a forward-looking framework for anticipating how AI semiconductor discourse may evolve as techno-geopolitical uncertainty intensifies. While the corpus is limited to mainstream institutional Korean news media—so that the lexical-infiltration mechanism is established for institutional news discourse rather than for the full public sphere—the study contributes, to our knowledge, the first longitudinal evidence that the politicization of a technology discourse can operate as a sub-topical, vocabulary-level process rather than as topic substitution.

## Keywords

AI semiconductor ; Media discourse ; Agenda-setting ; Topic modeling ; Network analysis ; Sentiment analysis ; South Korea

## Data availability

The data used in this study were collected from the BigKinds database (www.bigkinds.or.kr), which is publicly accessible. The processed datasets and analysis code are available from the corresponding author upon reasonable request.

## Author biographies

**JongHwi Song** is a Research Professor at the Institute of AI Convergence Science, Yonsei University, South Korea. He received his Ph.D. from Yonsei University in 2023. His research interests include text mining, AI semiconductors, large language models, and web crawling.

**SooYeun Yoo** is a Ph.D. candidate in the Division of Software at Yonsei University, South Korea. Her research interests include text mining and natural language processing.

**Urtnasan Erdenebayar** is an Assistant Professor in the Division of AI Semiconductor at Yonsei University, South Korea. He received his Ph.D. from Yonsei University in 2018. His research interests include AI systems, biomedical AI, and signal processing.

> **—— 付费墙分割线 ——**
>
> 以上是本页可取得的全部原文内容。论文正文（Introduction / Literature review / Data and methods / Results / Discussion / Conclusion、全部图表与参考文献）位于付费墙之后，本页未含。

# 第二部分：中文深度解读

## 一句话结论

这篇论文真正的贡献不在「AI 半导体舆论被政治化了」这个结论——那几乎可以靠直觉猜到；而在于它给出了一个**可证伪的机制描述**：情感下滑是「词汇渗入」造成的，不是「话题被替换」造成的。它用 shift-share 分解把这两种解释拆开、并测得 82.5% 归于前者，这是一个方法论上的干净动作。

## 研究问题与数据

论文处理的问题是：一个技术议题的媒体话语，在三年里如何从「技术与制造竞争」转向「政治争议」。

- **语料**：韩国 BigKinds 新闻数据库，49,117 篇报道。
- **时间窗**：2023 年 1 月 – 2025 年 6 月，共 30 个月。
- **语料性质**：韩国主流机构媒体的新闻报道（作者在摘要末尾主动承认了这一边界，见下文）。

值得先指出的是这个语料选择的两个后果。第一，**机构媒体 ≠ 公共舆论**，作者自己也写了这一限制：词汇渗入机制是「在机构新闻话语中成立」，而非在整个公共领域中成立。第二，BigKinds 是按关键词检索建立的语料，也就是说「什么算 AI 半导体报道」这个边界由检索式决定，而检索式的定义会直接影响后续所有占比数字——这一点摘要没有交代，属于无法核对的项。

## 四方法互补的分析设计

论文用四种方法互证，这是整篇设计里最讲究的部分：

| 方法 | 回答什么问题 | 输出形态 |
|---|---|---|
| 主题归类（thematic categorization） | 报道在讲哪一类事（如政策、市场、技术） | 类目占比随时间变化 |
| LDA 主题建模 | 不预设类目的情况下，语料自然聚成哪些主题 | 概率主题分布 |
| 关键词共现网络 + Louvain 社区检测 | 哪些词处于话语结构的中心，中心词如何迁移 | 网络中心性与社区划分 |
| 词典情感分析（lexicon-based） | 整体语调如何变化 | 情感极性时间序列 |

四种方法的分工是清晰的：前两种管「话题」，第三种管「结构」，第四种管「语调」。而论文的关键动作发生在最后一步——它没有停在「语调下降了」这个观测上，而是追问**下降来自哪里**。

## 三阶段模型

| 阶段 | 时间 | 作者命名 | 话语特征 |
|---|---|---|---|
| 一 | 2023-01 – 2024-07 | Stability（稳定） | 中心词为 US、technology、firm、investment，聚焦技术开发与制造竞争 |
| 二 | 2024-08 – 2024-12 | Anticipation（期待） | 由 NVIDIA 市值飙升与 HBM 需求驱动的金融亢奋；市场叙事主导，情感在 2024 年 7 月见顶后开始下滑 |
| 三 | 2025-01 – 2025-06 | Politicization（政治化） | 政策类目占比翻倍，选举主题增长近 4 倍，政治关键词挤占技术关键词的网络中心位置 |

三个阶段是**从数据中经验导出**的（empirically derived），而非先验设定——这是摘要里一个容易被忽略但对可信度很关键的措辞。

## 核心量化发现

1. **政策类目占比：7.61% → 17.49%**，统计量 \|z\| = 39.40，p < 0.001。翻了一倍多，且显著性极高。
2. **选举相关主题增长近 4 倍**（fourfold）。
3. **网络中心词的迁移**：政治关键词取代技术关键词占据了网络中心位置——这是结构性变化，不只是数量变化。
4. **情感下滑的来源分解：82.5% 来自话题内变化（within-topic），而非话题构成变化（composition）**。
5. **跨方法一致性 r = 0.86**，并用 KR-FinBert-SC transformer 模型做了情感复核。
6. **市场类报道的情感保持稳定**——政治词汇并不仅仅是把市场话题挤掉，而是渗进了原本非政治的报道内部，压低了它们的语调。

第 4 与第 6 条合起来构成了论文的理论主张：**政治化可以发生在「子话题层面 / 词汇层面」，而不必表现为话题被替换**。这是对议程设置理论的一个补充——它把「议程」的粒度从「议题」下沉到了「词表」。

## 方法学评述：三个我认为最有价值的点

**第一，shift-share 分解是这篇文章的枢纽，也是最容易被读者跳过的一段。** 「情感下降了」这个观测至少有两种解释：(a) 语料构成变了——大量政治类报道涌入，而政治报道本来就偏负面；(b) 语料构成没怎么变，但同一批话题内部的措辞变负面了。这两者对应完全不同的机制，也对应完全不同的政策含义。作者用 shift-share 把总变化拆成「构成效应」与「组内效应」，测得 82.5% 归于组内效应，从而排除了解释 (a)。**这是一个把「直觉叙事」变成「可检验主张」的标准动作，值得在任何话语分析里复用。**

**第二，多方法互证不是装饰，它承担了「排除替代假说」的功能。** 主题归类、LDA、网络分析三条路径分别从类目占比、概率主题、结构中心性三个角度探测同一件事。作者报告跨方法一致性 r = 0.86，这是把「结论稳健性」变成可量化数字的做法。需要注意的是，r = 0.86 是「方法之间」的一致性，它证明的是**测量工具彼此收敛**，并不等于结论与真实舆论一致——这两件事常被混为一谈。

**第三，用金融领域的情感模型（KR-FinBert-SC）来复核词典法的结果，是个聪明的外审。** 词典法最大的弱点是词表固定、不理解上下文，而 transformer 情感模型能捕捉语境反转。两者结论一致时，词典法「语境盲」的批评就被削弱了。不过这里有一个无法核对的点：如果 transformer 与词典法的结论**不一致**，作者会怎么处理？摘要只报告了一致的情形。

## 可采信度分层

| 层级 | 内容 | 理由 |
|---|---|---|
| **强** | 三阶段的经验导出；政策类目 7.61% → 17.49% 与 \|z\| = 39.40；情感下滑的 shift-share 分解归因（82.5% 组内）；跨方法 r = 0.86 | 有明确统计量、显著性与方法互证；分解方法本身是标准工具 |
| **中** | 「政治关键词挤占网络中心位置」的具体判定；选举主题「近 4 倍」增长；市场类报道情感稳定的程度 | 结论方向可信，但阈值设定、主题数 K、社区检测参数、词典版本等实现细节均在付费墙后，无法核对 |
| **弱** | 「议程设置者会随地缘政治冲击快速切换」的理论推广；「向前看的预测框架」的有效性 | 这是作者从单一国家、单一语料外推的一般性论断，论文自己也承认语料边界 |
| **未含** | 正文全部内容；图表；参考文献；LDA 主题数与标签；检索式定义；任何稳健性检验的细节 | Elsevier 付费墙，且未找到开放获取版本 |

## 这篇论文没有回答什么

1. **「什么算 AI 半导体报道」的边界未交代**——BigKinds 检索式决定了整个语料的构成，而它不在摘要里。占比类结论对这一条高度敏感。
2. **没有区分媒体机构之间的差异**。49,117 篇被当作一个整体，但不同媒体（保守/进步、财经/综合）的政治化节奏很可能不同；摘要未提及任何分组分析。
3. **没有讨论因果方向**。是报道政治化反映了现实政治事件，还是媒体框架主动把技术议题政治化了？摘要的措辞（discourse politicized）偏向后者，但摘要无法证明。
4. **没有给出与「公众舆论」的桥接证据**。作者自己明确承认了这一限制，属于诚实但也是真实的空白。
5. **市场类报道情感「保持稳定」这一发现缺少解释**。为什么政治词汇渗入会影响技术类报道的语调，却不影响市场类报道？这是一个有意思的、摘要没回答的问题。
6. **没有成本/收益评估**——「政治化」对产业或政策效率是好是坏，论文不做价值判断，这本身合理，但读者容易自行填补。

## 对产业观察者的参考价值

抛开政治类目本身，这篇论文对一个关心 AI 半导体产业的人有三条可迁移的观察：

- **技术议题的「情绪基调」可以独立于「话题构成」而漂移。** 只要政治词汇渗入，同一批技术报道的语气就会变差，而不需要话题本身被替换。这意味着用「话题占比」监测舆情是不够的，必须同时监测**同一话题内部的措辞变化**。
- **网络中心词的迁移是比数量占比更早的信号。** 论文报告政治关键词挤占中心位置，这类结构指标通常比占比指标更早反映话语转向。
- **多方法互证应成为舆情判断的常规要求。** 单一方法的结论 r = 0.86 这个数字提示：不同计算路径会给出不完全相同的答案，把差异量化出来比断言「一致」更有意义。

## 与站内文章的联系

- [SEMICON Taiwan 2026 CPO 全记录](/posts/semicon-taiwan-cpo/)——站内对产业会议话语的记录，与本篇的「话语结构」观察形成互补：一个看技术叙事的内容，一个看技术叙事的语调与结构。
- [中国超节点供应链](/posts/china-supernode-supply-chain/) 与 [一块衬底不再通吃](/posts/one-substrate-no-longer-rules-them-all/)——这两篇涉及 AI 半导体的地缘与供应链变量，正是论文所说「地缘政治冲击」的产业背景。
- [光子学倒逼 chiplet 重构](/posts/photonics-forces-a-chiplet-rethink/)——技术议题如何在产业层面被重新框定，可以与本篇的「话语框架迁移」对照阅读。
- [光学测试如何卡住 CPO 的大规模部署](/posts/why-optical-high-volume-test-is-10x/)——同批发布，属「话语之外的硬约束」一类：产业叙事的走向最终要受物理与产能约束检验。

## 一句话总结

这篇论文的价值在于把「技术议题被政治化了」从一句观察，变成了一条**可证伪的机制**：不是政治话题挤掉了技术话题，而是政治词汇渗进了技术话题内部、压低了它的语调（82.5% vs 17.5%）。方法是干净的，边界作者自己也交代得清楚；但由于全文在付费墙之后，所有实现细节（检索式、主题数、词典版本、阈值设定）都无法核对——**这是一篇摘要可采信、细节待验证的论文**。
