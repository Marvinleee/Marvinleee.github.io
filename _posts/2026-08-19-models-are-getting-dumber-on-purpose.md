---
layout: post
title: "Models Are Getting Dumber on Purpose — 模型正被刻意「变笨」"
date: 2026-08-19 00:00:00 +0800
categories: [人工智能]
tags: [大模型, 模型效率, 幻觉, 推理能力, 知识检索, 参数效率]
description: 为什么前沿模型在推理基准上越来越强、却在事实问答上越来越「笨」？本文逐字翻译并深度解读 Walter van der Giessen 关于「用世界知识换取推理能力」这一刻意权衡的论点。

---

> 原文：[Models Are Getting Dumber on Purpose](https://w4g1.dev/blog/models-are-getting-dumber-on-purpose)，作者 Walter van der Giessen，发布于 2026-08-17。
> 本页结构：第一部分为英文原文（Original Article），第二部分为中文深度解读（解析）。
> 说明：原文无付费墙，全文完整收录。

# 第一部分：正文（Original Article）

# Models Are Getting Dumber on Purpose

Reasoning scores keep climbing while per-token compute keeps dropping. GLM-5.2 scores 99.2% on AIME 2026 with about 40 billion parameters active per token. Qwen3.5 scores 91.3% with 17 billion active. DeepSeek V4-Flash runs 13 billion active. For scale, GPT-4 was rumored to run around 280 billion active parameters in 2023, and it could barely solve an AIME problem. At the small end, Qwen3.5 9B fits in 6GB of VRAM quantized and roughly doubles the score of the next best model under 10B parameters on Artificial Analysis's intelligence index. If you only looked at math and code benchmarks, you'd conclude that models are getting smarter per parameter at an absurd rate.

They are, on those benchmarks. Ask the same models a plain factual question and the picture flips. On SimpleQA, a benchmark of factual recall with no tools allowed, the current leader is Gemini 2.5 Pro at 53%, so the best recall money can buy still misses half the questions. The small models barely register. Artificial Analysis measures Qwen3.5 4B and 9B at hallucination rates of 80 to 82% on its knowledge benchmark, which means that when they don't know a fact, which is most of the time, they make one up. Ask the 9B for the birth year of a minor 19th-century mathematician and you get a confident, plausible, wrong answer. The parameter count didn't drop for free. Labs are trading world knowledge for reasoning skill, and the trade is deliberate.

## What the parameters were for

Facts take space. Research on knowledge capacity (the "Physics of Language Models" series has the cleanest measurements) puts it on the order of two bits of factual knowledge per parameter. If you want a model that knows the birth year of every minor Wikipedia figure, the population of every Dutch municipality, and the argument order of every function in every npm package, you pay for that in weights, and it's a big part of why frontier models grew to trillions of parameters.

Reasoning compresses much better than facts do, because it's a relatively small set of procedures applied over and over: break the problem into parts, track intermediate state, check your own work, backtrack when a step fails. Distillation and reinforcement learning on verifiable tasks turn out to transfer those procedures into small models remarkably well. Phi-4 is 14 billion parameters, trained heavily on synthetic textbook-style data, and it's good at math and bad at trivia, which tells you exactly what its training data contained. That mix used to look like a limitation of the synthetic-data approach. It now looks like the design goal.

The knowledge that survives the trade has a shape. These models are generalists: they know a little about nearly everything and almost nothing in depth. Ask one about PostgreSQL and it knows what it is, what it's good at, and roughly how MVCC works, but ask which version added a specific planner feature and you're back to invented facts. That's the right layer to keep in weights, because breadth is what lets a model understand what a question is about, know what to look up, and judge whether a source is plausible. The depth is cheap to retrieve and expensive to store, so it's the part that goes.

## Facts rot, procedures don't

A frontier training run takes months and costs hundreds of millions of dollars, and the moment it finishes, the facts inside it start going stale. Library APIs change, prices change, people change jobs, and half of what a 2024 model believed about the JavaScript ecosystem was outdated before the model shipped. Every fact you bake into weights has a shelf life, and the only way to refresh it is another training run.

The procedures don't rot. Algebra worked the same way in 1970 as it does now, and so does breaking a problem down or spotting a contradiction between two sources. A model that's mostly procedure and only lightly loaded with facts doesn't age the way a knowledge-heavy model does. Its training cutoff matters much less, because the current state of the world was never supposed to live in the weights in the first place. I think this is the best argument for the whole approach: it decouples the expensive, slow artifact (the trained model) from the thing that changes daily (what's true).

## The harness carries the knowledge

If the model doesn't know things, something else has to, and that something is the harness: retrieval over a knowledge base, tool calls, web search, a filesystem full of docs. I wrote earlier that Rust is a harness for agents, a source of cheap machine-checkable feedback. This is the same shape from the other side. The model contributes reasoning, and everything it reasons about gets supplied at runtime.

You can already watch agents work this way. A coding agent doesn't need to have memorized your dependency's API surface, because it greps `node_modules` or reads the docs before calling anything, and its answer is grounded in the version you actually have installed rather than whichever version dominated the training data. The recall that used to be a fixed cost in every forward pass became an on-demand lookup.

## A frontier model on your GPU

Follow the trend a couple of years out and I think we get a model with frontier-quality reasoning, Fable-quality, that runs on a single consumer GPU. The compute half is nearly there. DeepSeek V4-Flash reasons with about 13 billion active parameters per token, well within consumer-GPU range. What doesn't fit is the other 271 billion parameters sitting in its experts, and expert layers are mostly fact storage. That's the part this whole trade makes optional. Strip the knowledge out and total size shrinks toward active size, and a 20 to 40B model at 4-bit quantization fits on the 24GB card that's been sitting in gaming PCs since 2022.

The catch is that it won't know much. Ask it a bare factual question with no tools attached and the right behavior is to say it doesn't know and go look it up. Paired with a decent harness, that's most of what I use a frontier model for today, running locally with no per-token bill and no data leaving the machine.

## This mostly solves hallucination

The part I find most promising is what this does to hallucination. When a fact lives in weights, a wrong fact is unfindable and unfixable. You can't grep the weights, you can't diff them against last month, and correcting one error means a fine-tune that might break who knows what else. The model states the wrong fact with the same fluent confidence as a right one, and there's no artifact to check it against.

When the fact lives outside the model, a wrong answer has an address. The model cites a document, so you can open the document. If the document is wrong, you edit the document, and every future query gets the correction, which beats waiting for the next training run by roughly a year. Retrieval doesn't get you to zero, since a model can still misread a source or stitch two of them together wrong, but a claim with a source is checkable and a claim from weights isn't. A wrong fact in a knowledge base is an ordinary data bug, the kind we already know how to trace, fix, and write a regression test for.

There's a version of this future where the model card stops listing a knowledge cutoff at all, because what's left in the weights goes stale on a scale of years instead of weeks. The model just gets handed the world's current state at runtime, the same way a CPU gets handed a program.

# 第二部分：解析（深度解读）

## 核心论点

作者 Walter van der Giessen 提出一个反直觉但逻辑清晰的观点：大模型并没有在「变笨」，而是**实验室在刻意用世界知识换取推理能力**。证据是两方面的背离——

- **推理侧**：GLM-5.2 用约 400 亿激活参数在 AIME 2026 上达到 99.2%，DeepSeek V4-Flash 仅 130 亿激活参数就能推理；同等参数规模下推理分数仍在飙升。
- **事实侧**：在 SimpleQA 这种「不允许用工具」的事实回忆基准上，即便是 Gemini 2.5 Pro 也只答对 53%；小模型幻觉率高达 80–82%，遇到不会的事实就「编一个」。

参数规模不是凭空降下来的。每减少一份权重，省掉的往往正是「世界知识」。

## 关键概念

1. **知识的参数成本**：「Physics of Language Models」系列测得，每参数大约只能承载 2 bit 事实知识。要让模型记住每一个维基人物、每一个荷兰市镇人口、每一个 npm 包的每一个函数签名，都得用权重买单——这正是前沿模型膨胀到万亿参数的主因。
2. **推理的可压缩性**：推理是一小组被反复套用的程序（分解问题、跟踪中间状态、自查、回溯）。蒸馏 + 可验证任务的强化学习能把这些程序高效地「灌」进小模型。Phi-4（140 亿参数）数学强、常识弱，恰好说明其训练数据就是按这个方向设计的。
3. **幸存知识的形状**：模型成了「万金油」——广度够、深度缺。知道 PostgreSQL 是什么、MVCC 大致怎么工作，但问「哪个版本加了某个 planner 特性」就会胡编。广度留在权重里（用于理解问题、判断信源是否靠谱），深度交给检索（便宜可更新，但存储贵）。

## 技术趋势与判断

- **事实会腐坏，程序不会**：一次前沿训练要数月、数亿美元，训练一结束权重里的「事实」就开始过时。而代数、归约、矛盾检测这些「程序」几十年不变。把模型做成「以程序为主、事实为辅」，就等于把昂贵的慢 artifact（训练好的模型）与每日变化的东西（真相）解耦。
- **Harness 承载知识**：模型不记事，就由外挂的 harness 来记——知识库检索、工具调用、联网、文件系统。编码 agent 不再死记依赖的 API，而是先 `grep node_modules` 或读文档，答案落在你真实安装的版本上。原来的「每次前向传播固定开销」变成了「按需查找」。
- **单卡跑前沿推理**：按趋势外推一两年，能在消费级 GPU 上跑「前沿级推理」的模型会出现。DeepSeek V4-Flash 的 130 亿激活参数已在消费级区间；剩下的 2710 亿参数主要是「专家层里的知识存储」——而这正是这笔交易让它变得可选的部分。剥掉知识，20–40B 模型 4-bit 量化后就能塞进 2022 年起就普遍存在的 24GB 显卡。代价是它「懂得少」，正确行为是「我不会，我去查」。
- **幻觉问题的解法**：事实在权重里时，错误事实「搜不到、改不了」；事实在模型之外时，错误答案「有地址」——模型引用文档，你就能打开文档改，下次查询自动修正。带出处的主张可核查，来自权重的主张不可核查。知识库里的一条错事实，只是一个我们早已知道怎么定位、修复、写回归测试的数据 bug。

## 与本站其他文章的连接

- 这与本站「AI 硬件 / 推理芯片」主线直接相关：参数效率的提升（更少激活参数、更多专家存储被外置）直接影响推理芯片的显存与带宽需求，也解释了为什么本地化推理（无按 token 计费、数据不出机）正变得可行。
- 「harness 承载知识」的范式，呼应了 agent / 工具调用架构的演进——模型从「百科全书」转向「推理引擎 + 运行时取数」。

## 风险提示

- 作者观点偏乐观：检索并不能把幻觉降到零（模型仍可能误读信源或错误拼接），且「知识外置」依赖 harness 的质量，弱 harness 下反而更危险。
- 文章中的基准数字（AIME 2026、GLM-5.2、Qwen3.5 等）属于未来设定，引用时需注意其时效性与可复现性。
