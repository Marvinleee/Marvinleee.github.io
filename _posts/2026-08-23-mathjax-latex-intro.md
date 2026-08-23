---
layout: post
title: "MathJax 与 LaTeX 公式简介"
date: 2026-08-23 08:00:00 +0800
categories: [LaTeX, 工具]
tags: [MathJax, LaTeX, 公式渲染, 科学空间]
math: true
description: "转载自科学空间（苏剑林）：MathJax 简介、行内与块级公式写法、LaTeX 资源导航，以及常用希腊字母、关系符、数学结构与数学函数的命令速查表。"
---

> **转载声明**：本文转载自 [科学空间（Spaces Ac.cn）](https://spaces.ac.cn/latex.html)，原作者为 **苏剑林**。
> 原文链接：<https://spaces.ac.cn/latex.html>
> 版权归原作者所有，此处仅供学习与交流之用。

## MathJax 简介

科学空间使用 [MathJax](https://www.mathjax.org/) 来解析数学公式。

MathJax 是一款运行在浏览器中的开源的数学符号渲染引擎，使用 MathJax 可以方便地在浏览器中显示数学公式，不需要使用图片。目前，MathJax 可以解析 LaTeX、MathML 和 ASCIIMathML 的标记语言。

简单来说，MathJax 是目前显示效果最接近标准 LaTeX 的渲染引擎。

## 即时编辑器

在下方输入需要预览的代码（文字公式混排），就可以即时显示结果。

> 注：行内公式使用 `\(...\)` 或 `$...$`；单行公式使用 `\[...\]` 或 `$$...$$`。

**渲染结果示例：**

当 $a\neq 0$ 时，方程 $ax^2+bx+c=0$ 的根为 $x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$。

$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$$

## LaTeX 资源

- 截图转 LaTeX：[mathpix](https://mathpix.com/)
- 手写转 LaTeX：[MyScript Webdemo](https://webdemo.myscript.com/views/math/index.html)
- 强大的在线编辑器：[Mathcha Editor](https://www.mathcha.io/editor)

## LaTeX 入门

这里有一份细致的 LaTeX 介绍：[LATEX 入门与提高（emath 论坛）](https://bbs.emath.ac.cn/thread-5237-1-1.html)，还有一份可下载的 [《MathJax 支持的命令列表》](http://www.emath.ac.cn/download/doc/mathTeX.pdf)，供大家在书写 LaTeX 时参考。期待大家都使用 LaTeX 语言来写出漂亮的数学公式来交流～

下面摘录一小部分。

### 小写希腊字母

| 命令 | 符号 | 命令 | 符号 |
|------|------|------|------|
| `\alpha` | $\alpha$ | `\beta` | $\beta$ |
| `\gamma` | $\gamma$ | `\delta` | $\delta$ |
| `\epsilon` | $\epsilon$ | `\zeta` | $\zeta$ |
| `\eta` | $\eta$ | `\theta` | $\theta$ |
| `\iota` | $\iota$ | `\kappa` | $\kappa$ |
| `\lambda` | $\lambda$ | `\mu` | $\mu$ |
| `\nu` | $\nu$ | `\xi` | $\xi$ |
| `\omicron` | $\omicron$ | `\pi` | $\pi$ |
| `\rho` | $\rho$ | `\sigma` | $\sigma$ |
| `\tau` | $\tau$ | `\upsilon` | $\upsilon$ |
| `\phi` | $\phi$ | `\chi` | $\chi$ |
| `\psi` | $\psi$ | `\omega` | $\omega$ |
| `\varepsilon` | $\varepsilon$ | `\vartheta` | $\vartheta$ |
| `\varkappa` | $\varkappa$ | `\varpi` | $\varpi$ |
| `\varrho` | $\varrho$ | `\varsigma` | $\varsigma$ |
| `\varphi` | $\varphi$ | `\digamma` | $\digamma$ |

### 常用二元关系符

| 命令 | 符号 | 命令 | 符号 |
|------|------|------|------|
| `<` 或 `\lt` | $<$ | `\le` 或 `\leq` | $\le$ |
| `\leqslant` | $\leqslant$ | `>` 或 `\gt` | $>$ |
| `\ge` 或 `\geq` | $\ge$ | `\geqslant` | $\geqslant$ |
| `=` | $=$ | `\neq` 或 `\ne` | $\neq$ |
| `\equiv` | $\equiv$ | `\mid` | $\mid$ |
| `\nmid` | $\nmid$ | `\approx` | $\approx$ |
| `\sim` | $\sim$ | `\cong` | $\cong$ |
| `\in` | $\in$ | `\notin` | $\notin$ |
| `\ni` | $\ni$ | `\subset` | $\subset$ |
| `\supset` | $\supset$ | `\subseteq` | $\subseteq$ |
| `\supseteq` | $\supseteq$ |  |  |

你可以在上述命令的前面加上 `\not` 来得到其否定形式，如：`\not\equiv` 显示为 $\not\equiv$。

### 常用数学结构

| 命令 | 效果 | 命令 | 效果 |
|------|------|------|------|
| `\frac{abc}{xyz}` | $\frac{abc}{xyz}$ | `\overline{abc}` | $\overline{abc}$ |
| `\overrightarrow{abc}` | $\overrightarrow{abc}$ | `\underline{abc}` | $\underline{abc}$ |
| `\overleftarrow{abc}` | $\overleftarrow{abc}$ | `\sqrt{abc}` | $\sqrt{abc}$ |
| `\widehat{abc}` | $\widehat{abc}$ | `\overbrace{abc}` | $\overbrace{abc}$ |
| `\sqrt[n]{abc}` | $\sqrt[n]{abc}$ | `\widetilde{abc}` | $\widetilde{abc}$ |
| `\underbrace{abc}` | $\underbrace{abc}$ |  |  |

> **注意**：撇 `'` 由右单引号键打出（台式机键盘在分号右面，必须要在纯英文状态下输入），二阶就打两撇，而不是打双引号，三阶就三撇，如此类推。

### 标准数学函数

| 函数 | 命令 | 函数 | 命令 |
|------|------|------|------|
| arccos | $\arccos$ | arcsin | $\arcsin$ |
| arctan | $\arctan$ | arg | $\arg$ |
| cos | $\cos$ | cosh | $\cosh$ |
| cot | $\cot$ | coth | $\coth$ |
| csc | $\csc$ | deg | $\deg$ |
| det | $\det$ | dim | $\dim$ |
| exp | $\exp$ | gcd | $\gcd$ |
| hom | $\hom$ | inf | $\inf$ |
| ker | $\ker$ | lg | $\lg$ |
| lim | $\lim$ | lim inf | $\liminf$ |
| lim sup | $\limsup$ | ln | $\ln$ |
| log | $\log$ | max | $\max$ |
| min | $\min$ | Pr | $\Pr$ |
| sec | $\sec$ | sin | $\sin$ |
| sinh | $\sinh$ | sup | $\sup$ |
| tan | $\tan$ | tanh | $\tanh$ |

数学函数一般用直立的 Roman 体排印，而普通字母一般用 Italic 字体（上表中左边是函数名，右边是命令代码），所以，需在其对应函数名（注意区分大小写）前加上 `\`，否则渲染成就如同右侧的斜体效果（这是不正确的！）；

---

*原文结束。再次声明：本文转载自 [科学空间](https://spaces.ac.cn/latex.html)，作者 苏剑林。*
