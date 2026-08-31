---
layout: post
title: "抽象泄漏定律（The Law of Leaky Abstractions）— Joel Spolsky 2002 年经典，2026 年依然锋利"
date: 2026-08-31 20:00:00 +0800
categories: [软件工程, 技术随笔]
tags: [抽象泄漏, Joel Spolsky, 软件工程, TCP/IP, 编程哲学, 经典好文, AI编程]
description: "Joel Spolsky 2002 年的经典长文：所有非平凡的抽象在某种程度上都是泄漏的。从 TCP over IP 讲到 SQL、C++ string、NFS，最终落在「抽象节省的是干活的时间，不是学习的时间」。附 2026 年视角的深度解读：AI 编程助手、XLA/ROCm、AI 设计芯片中的泄漏。"
---

> **来源**：[Joel on Software](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/) — *The Law of Leaky Abstractions*
> **原文链接**：<https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/>
> **原文发布日**：2002-11-11 ｜ **作者**：Joel Spolsky
> **说明**：本文为英文原文全文转载，附中文深度解读。解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

There’s a key piece of magic in the engineering of the Internet which you rely on every single day. It happens in the TCP protocol, one of the fundamental building blocks of the Internet.

TCP is a way to transmit data that is _reliable_. By this I mean: if you send a message over a network using TCP, it will arrive, and it won’t be garbled or corrupted.

We use TCP for many things like fetching web pages and sending email. The reliability of TCP is why every email arrives in letter-perfect condition. Even if it’s just some dumb spam.

By comparison, there is another method of transmitting data called IP which is _unreliable_. Nobody promises that your data will arrive, and it might get messed up before it arrives. If you send a bunch of messages with IP, don’t be surprised if only half of them arrive, and some of those are in a different order than the order in which they were sent, and some of them have been replaced by alternate messages, perhaps containing pictures of adorable baby orangutans, or more likely just a lot of unreadable garbage that looks like that spam you get in a foreign language.

Here’s the magic part: TCP is built on top of IP. In other words, TCP is obliged to somehow send data reliably _using only an unreliable tool_.

To illustrate why this is magic, consider the following morally equivalent, though somewhat ludicrous, scenario from the real world.

Imagine that we had a way of sending actors from Broadway to Hollywood that involved putting them in cars and driving them across the country. Some of these cars crashed, killing the poor actors. Sometimes the actors got drunk on the way and shaved their heads or got nasal tattoos, thus becoming too ugly to work in Hollywood, and frequently the actors arrived in a different order than they had set out, because they all took different routes. Now imagine a new service called Hollywood Express, which delivered actors to Hollywood, guaranteeing that they would (a) arrive (b) in order (c) in perfect condition. The magic part is that Hollywood Express doesn’t have any method of delivering the actors, other than the unreliable method of putting them in cars and driving them across the country. Hollywood Express works by checking that each actor arrives in perfect condition, and, if he doesn’t, calling up the home office and requesting that the actor’s identical twin be sent instead. If the actors arrive in the wrong order Hollywood Express rearranges them. If a large UFO on its way to Area 51 crashes on the highway in Nevada, rendering it impassable, all the actors that went that way are rerouted via Arizona and Hollywood Express doesn’t even tell the movie directors in California what happened. To them, it just looks like the actors are arriving a little bit more slowly than usual, and they never even _hear_ about the UFO crash.

That is, approximately, the magic of TCP. It is what computer scientists like to call an _abstraction_: a simplification of something much more complicated that is going on under the covers. As it turns out, a lot of computer programming consists of building abstractions. What is a string library? It’s a way to pretend that computers can manipulate strings just as easily as they can manipulate numbers. What is a file system? It’s a way to pretend that a hard drive isn’t really a bunch of spinning magnetic platters that can store bits at certain locations, but rather a hierarchical system of folders-within-folders containing individual files that in turn consist of one or more strings of bytes.

Back to TCP. Earlier for the sake of simplicity I told a little fib, and some of you have steam coming out of your ears by now because this fib is driving you crazy. I said that TCP guarantees that your message will arrive. It doesn’t, actually. If your pet snake has chewed through the network cable leading to your computer, and _no_ IP packets can get through, then TCP can’t do anything about it and your message doesn’t arrive. If you were curt with the system administrators in your company and they punished you by plugging you into an overloaded hub, only some of your IP packets will get through, and TCP will work, but everything will be really slow.

This is what I call a _leaky abstraction_. TCP attempts to provide a complete abstraction of an underlying unreliable network, but sometimes, the network leaks through the abstraction and you feel the things that the abstraction can’t quite protect you from. This is but one example of what I’ve dubbed the Law of Leaky Abstractions:

> **All non-trivial abstractions, to some degree, are leaky.**

Abstractions fail. Sometimes a little, sometimes a lot. There’s leakage. Things go wrong. It happens all over the place when you have abstractions. Here are some examples.

- Something as simple as iterating over a large two-dimensional array can have radically different performance if you do it horizontally rather than vertically, depending on the “grain of the wood” — one direction may result in vastly more page faults than the other direction, and page faults are slow. Even assembly programmers are supposed to be allowed to pretend that they have a big flat address space, but virtual memory means it’s really just an abstraction, which leaks when there’s a page fault and certain memory fetches take way more nanoseconds than other memory fetches.
- The SQL language is meant to abstract away the procedural steps that are needed to query a database, instead allowing you to define merely what you want and let the database figure out the procedural steps to query it. But in some cases, certain SQL queries are thousands of times slower than other logically equivalent queries. A famous example of this is that some SQL servers are dramatically faster if you specify “where a=b and b=c and a=c” than if you only specify “where a=b and b=c” even though the result set is the same. You’re not supposed to have to care about the procedure, only the specification. But sometimes the abstraction leaks and causes horrible performance and you have to break out the query plan analyzer and study what it did wrong, and figure out how to make your query run faster.
- Even though network libraries like NFS and SMB let you treat files on remote machines “as if” they were local, sometimes the connection becomes very slow or goes down, and the file stops acting like it was local, and as a programmer you have to write code to deal with this. The abstraction of “remote file is the same as local file” [leaks](https://www.joelonsoftware.com/articles/fog0000000041.html). Here’s a concrete example for Unix sysadmins. If you put users’ home directories on NFS-mounted drives (one abstraction), and your users create .forward files to forward all their email somewhere else (another abstraction), and the NFS server goes down while new email is arriving, the messages will not be forwarded because the .forward file will not be found. The leak in the abstraction actually caused a few messages to be dropped on the floor.
- C++ string classes are supposed to let you pretend that strings are first-class data. They try to abstract away the fact that [strings are hard](https://www.joelonsoftware.com/articles/fog0000000319.html) and let you act as if they were as easy as integers. Almost all C++ string classes overload the + operator so you can write **s + “bar”** to concatenate. But you know what? No matter how hard they try, there is no C++ string class on Earth that will let you type **“foo” + “bar”**, because string literals in C++ are always char*’s, never strings. The abstraction has sprung a leak that the language doesn’t let you plug. (Amusingly, the history of the evolution of C++ over time can be described as a history of trying to plug the leaks in the string abstraction. Why they couldn’t just add a native string class to the language itself eludes me at the moment.)
- And you can’t drive as fast when it’s raining, even though your car has windshield wipers and headlights and a roof and a heater, all of which protect you from caring about the fact that it’s raining (they abstract away the weather), but lo, you have to worry about hydroplaning (or aquaplaning in England) and sometimes the rain is so strong you can’t see very far ahead so you go slower in the rain, because the weather can never be completely abstracted away, because of the law of leaky abstractions.

One reason the law of leaky abstractions is problematic is that it means that abstractions do not really simplify our lives as much as they were meant to. When I’m training someone to be a C++ programmer, it would be nice if I never had to teach them about char*’s and pointer arithmetic. It would be nice if I could go straight to STL strings. But one day they’ll write the code **“foo” + “bar”**, and truly bizarre things will happen, and then I’ll have to stop and teach them all about char*’s anyway. Or one day they’ll be trying to call a Windows API function that is documented as having an OUT LPTSTR argument and they won’t be able to understand how to call it until they learn about char*’s, and pointers, and Unicode, and wchar_t’s, and the TCHAR header files, and all that stuff that leaks up.

In teaching someone about COM programming, it would be nice if I could just teach them how to use the Visual Studio wizards and all the code generation features, but if anything goes wrong, they will not have the vaguest idea what happened or how to debug it and recover from it. I’m going to have to teach them all about IUnknown and CLSIDs and ProgIDS and ... oh, the humanity!

In teaching someone about ASP.NET programming, it would be nice if I could just teach them that they can double-click on things and then write code that runs on the server when the user clicks on those things. Indeed ASP.NET abstracts away the difference between writing the HTML code to handle clicking on a hyperlink (**<a>**) and the code to handle clicking on a button. Problem: the ASP.NET designers needed to hide the fact that in HTML, there’s no way to submit a form from a hyperlink. They do this by generating a few lines of JavaScript and attaching an onclick handler to the hyperlink. The abstraction leaks, though. If the end-user has JavaScript disabled, the ASP.NET application doesn’t work correctly, and if the programmer doesn’t understand what ASP.NET was abstracting away, they simply won’t have any clue what is wrong.

The law of leaky abstractions means that whenever somebody comes up with a wizzy new code-generation tool that is supposed to make us all ever-so-efficient, you hear a lot of people saying “learn how to do it manually first, then use the wizzy tool to save time.” Code generation tools which pretend to abstract out something, like all abstractions, leak, and the only way to deal with the leaks competently is to learn about how the abstractions work and what they are abstracting. So the abstractions save us time working, but they don’t save us time learning.

And all this means that paradoxically, even as we have higher and higher level programming tools with better and better abstractions, becoming a proficient programmer is getting harder and harder.

During my first Microsoft internship, I wrote string libraries to run on the Macintosh. A typical assignment: write a version of **strcat** that returns a pointer to the end of the new string. A few lines of C code. Everything I did was right from K&R — one thin book about the C programming language.

Today, to work on CityDesk, I need to know Visual Basic, COM, ATL, C++, InnoSetup, Internet Explorer internals, regular expressions, DOM, HTML, CSS, and XML. All high level tools compared to the old K&R stuff, but I still have to know the K&R stuff or I’m toast.

Ten years ago, we might have imagined that new programming paradigms would have made programming easier by now. Indeed, the abstractions we’ve created over the years _do_ allow us to deal with new orders of complexity in software development that we didn’t have to deal with ten or fifteen years ago, like GUI programming and network programming. And while these great tools, like modern OO forms-based languages, let us get a lot of work done incredibly quickly, suddenly one day we need to figure out a problem where the abstraction leaked, and it takes 2 weeks. And when you need to hire a programmer to do mostly VB programming, it’s not good enough to hire a VB programmer, because they will get completely stuck in tar every time the VB abstraction leaks.

The Law of Leaky Abstractions is dragging us down.

# 第二部分：中文深度解读（Deep Dive）

> **解读声明**：以下为基于原文的整理、归纳与延伸分析，不代表 Joel Spolsky 的观点。原文首发于 2002 年，解读部分会把它放进 2026 年的语境重新审视。

## 一、核心论点

> **All non-trivial abstractions, to some degree, are leaky.**
> 所有非平凡的抽象，在某种程度上都是泄漏的。

Joel 的论证从一个所有人每天都在用的例子切入：**TCP 建立在 IP 之上**。IP 是不可靠的——不保证到达、不保证顺序、不保证不被串改。TCP 则承诺可靠、有序、无损。可 TCP 手里的唯一工具就是那个不可靠的 IP。它能做的是检查、重传、重排、绕路——把不可靠的地基包装成可靠的服务。

然后 Joel 拆掉这个魔法：**如果你的宠物蛇咬断了网线，一个 IP 包都过不去，TCP 什么都做不了。**

这就是「泄漏」：抽象承诺了一件事，但底层的某些现实**穿透**了这层封装，让你不得不面对抽象本该替你挡掉的东西。

那句著名的「百老汇演员运到好莱坞」的比喻，是全文最精彩的一段： Hollywood Express 保证演员（a）到达（b）按序（c）完好无损，但它唯一能做的还是把演员塞进车里开过去。车会翻、演员会喝醉剃光头、顺序会乱。如果内华达高速公路上有一艘飞往 51 区的外星飞船坠毁，所有走那条路的演员改道亚利桑那——而加州导演看到的只是「演员到得比平常慢了些」，**他们永远不会听说 UFO 坠毁这件事**。

## 二、五个泄漏的例子（原文的清单）

| 抽象 | 承诺 | 泄漏点 |
|---|---|---|
| 虚拟内存 / 大数组 | 一块大而平的地址空间 | 按行还是按列遍历二维数组，page fault 次数天差地别，性能可以差出数量级 |
| SQL | 只说「要什么」，不说「怎么做」 | 逻辑等价的查询可能差几千倍；`where a=b and b=c and a=c` 比 `where a=b and b=c` 快得多。你被迫去读查询计划 |
| NFS / SMB | 远程文件「就像」本地文件 | 连接一慢或一断，它就不像本地文件了。Joel 给了个狠例子：home 目录挂 NFS + 用户用 `.forward` 转邮件 + NFS 挂了 = 邮件被静默丢弃 |
| C++ string | 字符串是一等公民，像整数一样好用 | `s + "bar"` 可以，`"foo" + "bar"` 永远不行——因为字符串字面量是 `char*`。**这个漏是语言层面的，你没法补** |
| 汽车（雨刷/车灯/车顶/暖风） | 抽象掉「天气」这件事实 | 下雨你还是得开慢点——会水漂、会看不清。天气永远无法被完全抽象掉 |

## 三、最关键的那个推论

这是全文我认为最锋利的一句：

> **The abstractions save us time working, but they don't save us time learning.**
> 抽象节省的是我们「干活」的时间，不是「学习」的时间。

Joel 用它解释了一个悖论：**工具越高级、抽象越好，成为熟练程序员反而越难。**

他自己的例子：第一次在微软实习时，写 Macintosh 上的字符串库，一个典型任务是写个返回新字符串尾指针的 `strcat`——几行 C，K&R 那本薄薄的册子就够了。而今天（2002 年）他要维护 CityDesk，得懂 Visual Basic、COM、ATL、C++、InnoSetup、IE 内部机制、正则、DOM、HTML、CSS、XML——**全是比 K&R 高级得多的工具，但他依然必须懂 K&R 那套，否则就完蛋。**

由此得出那条被引用了二十多年的实践建议：每当出现一个号称能让你效率翻倍的新代码生成工具，总会有一群人说「**先学会手动怎么做，再用这个工具省时间**」。原因不是守旧，而是：**处理泄漏的唯一办法，就是理解这层抽象在抽象什么、它是怎么工作的。**

## 四、放到 2026 年还成立吗？——三个切面

**1. AI 辅助编程是最新、也最强的一层抽象，它泄漏得同样厉害。**

Copilot / Cursor / Claude Code 这一代工具，把「写代码」这件事抽象成了「描述意图」。这是有史以来最高级的编程抽象——也完全符合 Joel 的定律。

泄漏点极其明显：AI 生成的代码**看起来对**和**真的对**是两回事；当它出错时，你如果没有底层知识，连「哪里错了」都判断不了，更别说修。Joel 那句「先学手动，再用工具」在这里不是建议，而是**必要条件**——你审查 AI 输出的能力上限，等于你自己的知识上限。而抽象泄漏的代价，恰好由「你不懂的那一层」决定。

更微妙的是：AI 工具把「**上手**」的门槛降到趋近于零，却没有降低「**精通**」的门槛。于是 Joel 说的那个悖论在今天被放大到了极致——**入门更容易了，成为熟练工程师更难了。**

**2. 硬件世界有完全同构的版本。**

本站此前发布的《[AI 芯片架构全景](/posts/ai-chip-architectures/)》里，处处是抽象泄漏的硬件版：

- **CUDA vs XLA**：Google TPU 的 XLA 是「编译器即系统」，抽象掉了调度、cache、数据搬运。它「不手调就能逼近理论上限」——但原文那句补充才是重点：**「补上最后那点差距更难」**。Pallas 这个逃生舱的存在，本身就是泄漏的证据。
- **ROCm / HIP 试图抽象掉 CUDA**：`hipify` 能把 HPC 代码 80–95% 自动转译，但凡触及 Hopper/Blackwell 专属原语（TMA 描述符、`wgmma`、`tcgen05.mma`）的 kernel 就**没有干净的对应物，必须手重写**。这是教科书级的泄漏。
- **AMD 的 Triton 策略**正是对泄漏的正面回应：既然 CUDA 抽象层漏，那就用 Triton 这个跨厂商 DSL 做新的 lingua franca，绕开而不是修补。

**3. 连「AI 设计芯片」这件事自己也在漏。**

本站同期发布的 [Redwood 报道](/posts/redwood-ai-designed-ai-chip/)是个漂亮的闭环例子：Architect Labs 用 AI 从规格直接生成 RTL，这是芯片设计领域最新的一层抽象。但它同样泄漏——原文明确承认，覆盖率闭合与签核**仍然依赖商业 EDA 工具链**，AI 提高的是设计与验证的产出效率，而没有取代 EDA 的权威。

换句话说：**AI 设计芯片这层抽象，漏到了 EDA 那一层。**

## 五、为什么这篇 2002 年的文章值得在 2026 年重读

因为它给出的不是一条经验法则，而是一个**判断框架**：任何一层新抽象出现时，你都可以问三个问题——

1. **它在抽象什么？**（底层现实是什么）
2. **它会从哪里漏？**（什么情况下底层会穿透上来）
3. **漏的时候，我需不需要懂底层才能修？**（如果需要，那学习成本就没被省掉）

这三个问题对 TCP、对 SQL、对 C++ string 有效，对 2026 年的 AI 编程助手、对 XLA、对 AI 设计芯片同样有效。

Joel 在结尾说「抽象泄漏定律正在拖累我们」（*The Law of Leaky Abstractions is dragging us down*）。二十多年后看，这句话与其说是抱怨，不如说是一个**关于复杂性的守恒律**：复杂度不会消失，只会被搬家——而每一次抽象，都只是把它从「你日常要处理的地方」搬到「你出事时才要去翻的地方」。

**理解泄漏点在哪，是工程师真正的护城河。**

---

### 原文信息
- **作者**：Joel Spolsky（Joel on Software；Stack Overflow / Trello 联合创始人，曾任 Microsoft Excel 团队 Program Manager）
- **首发**：2002-11-11
- **原文链接**：<https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/>

### 关联阅读（本站）
- [AI 芯片架构全景：从 NVIDIA GPU 到 Cerebras 晶圆引擎与 Groq LPU](/posts/ai-chip-architectures/) —— 抽象泄漏定律在硬件世界的完整映射：CUDA / XLA / ROCm-HIP 三层抽象的漏点。
- [Architect Labs 发布 Redwood](/posts/redwood-ai-designed-ai-chip/) —— 「AI 设计芯片」这层新抽象，漏到了 EDA 签核层。
