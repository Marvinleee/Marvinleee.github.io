---
layout: post
title: "推理系统 02：从 Unicode、聊天模板到 Token 与嵌入张量"
date: 2026-09-06 23:02:00 +0800
categories: [人工智能, 推理系统]
tags: [Qwen, Tokenizer, Unicode, BPE, Transformer]
description: "用固定修订 Qwen3-8B 分词器的真实结果，追踪字节、NFC 规范化、BPE、聊天模板、Token ID 和嵌入查表，并提供可复现脚本。"
math: true
toc: true
---

[系列目录](/posts/inference-series/) · [上一章：请求全链路](/posts/inference-01-request-to-hardware/) · [下一章：Transformer 层](/posts/inference-03-transformer-layer/)

在把“文字变向量”当作一个简单步骤之前，先看两个容易混淆的例子：`hello` 与 ` hello` 只差一个空格，但在本章固定的 Qwen 分词器中，它们分别得到 ID 14990 与 23811；`café` 与用字母 e 加组合重音构成的 `café` 字节不同，却得到同样的 ID 序列 [924,58858]。

前一个现象来自分词边界与词表，后一个来自规范化。理解这两个现象，比记住“一个 Token 大约等于多少字”更有用。它能解释为什么模板、空格、语言和预处理都会改变模型实际输入。

## 1. 用真实样本检查直觉

<iframe src="/assets/interactive/inference-atlas/#tokens" title="真实 Qwen 分词与字节实验" loading="lazy" style="width:100%;height:980px;border:1px solid #344858;border-radius:8px" data-proofer-ignore></iframe>

[全屏打开分词实验](/assets/interactive/inference-atlas/#tokens)

先选择“开头有空格”与“开头没有空格”，比较 ID；再切换两种 é，比较输入字节与结果。最后打开“加入单轮聊天模板”，观察 Token 数为何增加。

上方样本是真实分词器离线编码的结果；下方自由输入框只进行 Unicode 与 UTF-8 检查，不声称执行 Qwen 分词。嵌入矩阵玩具使用人为设定的 4×4 数值。真实模型权重没有下载到网页。

## 2. 屏幕上的一个“字”有几种计数

字符串至少存在四种常见粒度：用户感知字符、Unicode 码点、编码字节和模型 Token。

Unicode 码点标识抽象字符。例如“你”为 U+4F60，UTF-8 编码是三个字节 E4 BD A0。英文 A 的码点是 U+0041，UTF-8 只需要一个字节 41。UTF-8 是变长编码，这已经足以说明字符数不能直接当作字节数。

用户感知字符又可能由多个码点组成。例如组合重音、肤色修饰和零宽连接符可以参与形成一个视觉单元。实验中 JavaScript 的 `[...text]` 按码点遍历；它并不完成 Unicode 字素簇分割。直接用 `text.length` 则统计 UTF-16 代码单元，遇到一些 Emoji 还会得到另一种计数。

Token 是分词器定义的离散符号。它可以覆盖多个码点，也可以对应某个码点编码的一部分。不存在通用且精确的“中文字符数乘某个常数等于 Token 数”。

这一区分的工程含义很直接：HTTP 大小限制以字节为单位，文本 UI 可能以字符为单位，模型上下文限制则通常以 Token 位置为单位。这三个限制不能互换。

## 3. 规范化可能改变原始字节

本章固定修订的 tokenizer.json 声明 normalizer 为 NFC。NFC 会把某些规范等价的码点组合转换为规范组合形式。

例如：

```text
预组合形式：c a f é       → 63 61 66 C3 A9
分解形式：  c a f e ◌́    → 63 61 66 65 CC 81
NFC 后：   c a f é       → 63 61 66 C3 A9
```

因此，两种输入虽然字节不同，经过该分词器后都可以得到 [924,58858]。解码得到的是规范化后的文本，不必逐字节等于最初的输入。

对这个分词器，合理的往返校验是：

$$
\operatorname{decode}(\operatorname{encode}(s))
=\operatorname{NFC}(s),
$$

并在校验时保留特殊 Token。本章脚本对所有样本执行这个断言。这不是所有 tokenizer 的通用定理：其他分词器可能采用不同规范化、清理或解码行为。原理依据可参阅 [Unicode Normalization 标准](https://www.unicode.org/reports/tr15/)，具体行为则以本章下载的配置为准。

## 4. BPE 不是遇到文本就重新学习词表

Byte Pair Encoding 的思想可以通过一个玩具说明。设初始符号是 a、b、c，训练产生的合并优先级先包含 (a,b)→ab，再包含 (ab,c)→abc，那么输入 abc 可以逐步成为一个符号。真实训练会在语料中建立合并规则，而推理时使用已经固定的规则。

这里必须区分训练与编码：训练阶段统计并建立词表；编码阶段不会因为某个用户重复输入一句话就更新合并规则。模型训练时 Token ID 与嵌入行已经建立对应关系，任意改词表却保留原权重会破坏这个对应。

真实 Qwen 分词也不等于把整段文本直接丢给一个无限范围的字符合并器。该配置包含预切分与 ByteLevel 处理，再结合 BPE 合并及 added tokens。预切分会约束哪些片段参与后续合并；ByteLevel 把字节映射到可表示的内部符号。特殊标记又有额外的识别规则。

所以词表中的内部表示可能看起来像乱码或包含不熟悉的字符。这不一定是编码错误，而可能是内部字节映射的显示形式。实验点选 Token 后同时显示内部 token 字符串与单 Token 解码文本，帮助区分这两层。

本章不在浏览器重新实现这套分词算法，而直接使用 [Hugging Face Tokenizers](https://huggingface.co/docs/tokenizers/components) 读取官方 tokenizer.json 执行，减少实现偏差。

## 5. 真实样本能告诉我们什么

下表均为原始文本编码，未加入聊天模板：

| 输入 | Token IDs | 可以观察到的事实 |
|:--|:--|:--|
| 你好，GPU！ | 108386, 3837, 49891, 6313 | “你好”在这个样本中是一个 Token |
| Hello, GPU! | 9707, 11, 22670, 0 | 带前导空格的 GPU 与前例编码不同 |
| hello | 14990 | 一个词可对应一个 Token |
| ␠hello（␠代表一个空格） | 23811 | 空格可以参与 Token 的表示 |
| café | 924, 58858 | 一个词也可以由多个 Token 组成 |

这些 ID 只属于固定词表，没有跨模型的通用含义。14990 比 23811 小，并不表示对应词更简单、更常见或语义更接近原点。ID 是索引，语义关系存在于学习到的向量及其上下文计算中。

数字样本 `2026 3.1415926` 得到多个 Token，也说明分词边界不应根据人类对数字或单词的直觉推断。任何估算上下文的工具，都应该最终回到实际 tokenizer。

## 6. 聊天消息怎样被序列化

用户接口可以提交：

```json
{"messages": [{"role": "user", "content": "你好，GPU！"}]}
```

模型却通常不直接执行 JSON 解析。应用先将 messages 套入聊天模板，再编码。本章采用官方模板、单轮 user 消息、`add_generation_prompt=True`、`enable_thinking=False`，得到如下结构：

```text
<|im_start|>user
你好，GPU！<|im_end|>
<|im_start|>assistant
<think>

</think>

```

assistant 起始段提示模型接下来延续哪种角色。空 think 区段是这个模板关闭思考模式时加入的具体内容，不是所有模型共同遵守的协议。启用工具、多轮对话、改变思考设置都会改变最终序列。

模板中的特殊标记有固定 ID，例如 `<|im_start|>` 为 151644，`<|im_end|>` 为 151645。实验打开模板后会把这些 Token 一起显示。模型真正接受的长度包含它们，不能只统计用户 content。

一个常见错误是先应用模板生成字符串，再用会自动追加特殊符号的路径重复处理。另一个错误是把不同模型的模板交叉使用。正确复现要同时固定 tokenizer、模板、调用参数和模型，而不只是模型名称。模板使用背景见 [Transformers 聊天模板文档](https://huggingface.co/docs/transformers/chat_templating)。

## 7. ID 怎样成为一个浮点向量

设嵌入表 E 有 V 行、d 列：

$$
E\in\mathbb{R}^{V\times d},\quad i_t\in\{0,\ldots,V-1\},\quad x_t=E[i_t,:].
$$

对主线模型，V=151936、d=4096。一次查表读取 4096 个元素。若以 BF16 存储，单行理论上为 8192 字节，即 8 KiB。长度 128 的单序列隐藏状态有 128×4096 个元素，以 BF16 紧凑存储时为 1 MiB；这只是该张量的字节数，不是整次推理的显存占用。

整个嵌入表有 622329856 个元素。BF16 理论容量为 1244659712 字节，约 1.159 GiB。这个量来自表形状，而不是泛泛的“8B×2 字节”；后者估计的是整个模型权重数量级。

模型配置的 `tie_word_embeddings=false` 还说明输入嵌入与输出头不共享同一组权重。输出时，隐藏向量要再次投影到词表空间，这部分不能在参数核算中直接当作免费复用。

从数学上可以把查表写成：

$$
x_t=e_{i_t}^{\mathsf T}E,
$$

其中 e 是 one-hot 向量。但实际实现通常按索引读取，不需要创建 151936 维的稀疏中间向量。一次模型操作究竟分配什么，应查看实现，不能仅从等价公式推断。

## 8. 嵌入不是词义字典中的一条解释

同一个 Token ID 的初始嵌入相同，但经过不同上下文的注意力与 MLP 后，隐藏状态会不同。初始查表并没有完成理解，它只是给后续计算提供一个学习到的数值起点。

也不能拿向量的某一个坐标直接解释为“数学程度”或“情绪程度”。学习到的表示一般分布在多个维度，且后续层会继续变换它。网页中的四维玩具矩阵只用于理解索引与行选择，不给真实语义维度作虚构标注。

位置也不编码在 Token ID 的大小里。Qwen3 的 RoPE 在后续注意力路径作用于 Q/K，因此同一个词处于不同位置时，位置影响通过模型计算进入，而不是简单改变词表 ID。

## 9. 为什么流式输出会出现“不完整字符”问题

字节级处理允许一个 Token 只覆盖某个字符的一部分编码。单独解码这个 Token 时，若它不是完整 UTF-8 序列，显示器可能出现替换字符。把后续 Token 一起解码后，整个序列又可以恢复有效文字。

实验 Emoji 样本可以观察这个差异。不要把每个 Token 单独解码后拼起来，认定它必然等于整段解码。流式解码器需要维护增量状态或合适的缓冲，最终网络 chunk 也未必与单个 Token 对齐。

这条细节直接连接第 1 章的输出链路：模型产生的是离散 ID，服务把它们转换成可显示文本，客户端再接收网络事件。三者计数不一定相同。

## 10. 如何复现本章

模型修订：`b968826d9c46dd6066d109eabc6255188de91218`。样本由 `tokenizers==0.20.3`、`jinja2==3.1.5` 生成，只需要三个文件：tokenizer.json、tokenizer_config.json 和 config.json。无需 GPU、PyTorch 或模型权重。

从[固定修订仓库](https://huggingface.co/Qwen/Qwen3-8B/tree/b968826d9c46dd6066d109eabc6255188de91218)下载文件，在隔离 Python 环境安装上述两个包，然后运行[复现脚本](/assets/interactive/inference-atlas/generate_samples.py)：

```text
python generate_samples.py tokenizer.json tokenizer_config.json config.json
```

脚本从官方配置读取 Jinja 模板，仅执行本章的单轮纯文本分支；不把这一小脚本当作完整的 Transformers 聊天预处理替代品。它会检查：所有 ID 小于嵌入表行数；整段解码等于 NFC 规范化后的文本；模板输出与本章指定模式一致。

输出 JSON 包含文件 SHA-256、库版本、配置、原始字符串、规范化字符串、Token ID、内部表示与单 Token 解码。[本站样本文件](/assets/interactive/inference-atlas/samples.json)可直接下载比较。下载曾通过镜像传输，引用仍指向原始模型仓库；固定修订与摘要用于核对文件一致性。

## 11. 检查理解

**问题一：**两个 ID 相邻，是否代表对应 Token 的语义接近？

<details><summary>展开答案</summary><p>没有这种保证。ID 是离散标签。即使讨论向量相似性，也要说明使用的是输入嵌入还是某层上下文表示，以及采取何种相似度。</p></details>

**问题二：**`café` 与分解形式 `café` 得到同样的 ID，是否意味着原始字节相同？

<details><summary>展开答案</summary><p>不是。两者在 NFC 后一致；输入字节可以不同。这个例子说明编码与解码可能只保留规范化后的文本。</p></details>

**问题三：**T=256、d=4096 的 BF16 嵌入输出有多大？

<details><summary>展开答案</summary><p>256×4096×2=2097152 字节，即 2 MiB。它不是 36 层的全部中间张量，也不是请求的总内存预算。</p></details>

**问题四：**用户 content 的 Token 数等于模型 Prefill 长度吗？

<details><summary>展开答案</summary><p>不一定。聊天模板、系统提示、多轮历史和其他输入都会贡献位置。前缀命中和分块调度还会让“完整逻辑输入长度”与“本轮实际计算 Token 数”不同。</p></details>

下一章将从这里得到的 [T,4096] 张量出发，逐步推导一个真实 Qwen3 Transformer 层中的归一化、Q/K/V、位置旋转、GQA、残差和门控 MLP。
