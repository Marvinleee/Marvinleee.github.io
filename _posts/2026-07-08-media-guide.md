---
layout: post
title: 媒体使用指南：图片与视频
date: 2026-07-11
tags: [教程, 媒体]
description: "媒体专用指南：图片存放与插入、点击放大（lightbox），以及自托管视频与 B 站/YouTube 嵌入的玩法。"
---
本篇是与「如何写新文章」分开的**媒体专用指南**，集中讲清楚怎么在文章里放图片和视频，以及图片点击放大的效果。

## 一、图片

### 1. 存放位置
把图片文件放进 `assets/img/` 目录（没有就新建）。例如：

    assets/img/cat.jpg

### 2. 插入图片（Markdown）
在正文中写：

    ![一只猫](/assets/img/sample.svg)

`!` 后面方括号是替代文字（无障碍/加载失败时显示），圆括号是路径。图片会按原始尺寸显示，并自动适配手机宽度。

### 3. 控制大小与居中（HTML）
想固定宽度、居中，可用 HTML：

    <p style="text-align:center">
      <img src="/assets/img/sample.svg" alt="一只猫" width="400">
    </p>

把 `width="400"` 改成你想要的像素宽度即可。`width` 也可用百分比，如 `width="80%"`。

### 4. 点击放大（lightbox）
**已全局开启，无需任何配置。** 文章里的任意图片，鼠标单击即可全屏放大查看，再次点击或按 `Esc` 关闭。试试下面的示例图：

![示例图片](/assets/img/sample.svg)

> 提示：lightbox 用的是图片原图地址，矢量图（`.svg`）放大也不会糊；位图（`.jpg/.png`）放大后清晰度取决于原图分辨率。

## 二、视频

### 方式一：自托管视频（推荐，国内可用）
把 `.mp4` 文件放进 `assets/video/` 目录，再用 HTML5 标签插入：

    <video controls style="max-width:100%" src="/assets/video/sample.mp4"></video>

- `controls`：显示播放/暂停/进度条
- `style="max-width:100%"`：自适应手机宽度
- 可加 `autoplay muted loop` 做背景循环（自动播放必须 `muted`）

下面是一个真实可播放的示例（文件就在本站的 `assets/video/sample.mp4`）：

<video controls style="max-width:100%" src="/assets/video/sample.mp4">
  你的浏览器不支持 video 标签，请换用现代浏览器。
</video>

### 方式二：嵌入平台视频（Bilibili / YouTube）
直接粘贴平台提供的 `<iframe>` 嵌入代码。

**Bilibili**（国内推荐）：视频页点「分享 → 嵌入代码」，复制类似内容粘进文章：

    <iframe src="//player.bilibili.com/player.html?bvid=你的BV号" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="640" height="360"></iframe>

**YouTube**（境外/科学上网环境可用）：

    <iframe width="640" height="360" src="https://www.youtube.com/embed/视频ID" frameborder="0" allowfullscreen></iframe>

## 三、注意事项
- 路径以 `/` 开头表示从网站根目录算起：`assets/img/x.jpg` 对应网址 `https://marvinlee.cn/assets/img/x.jpg`。
- 图片/视频都是静态文件，Jekyll 会原样拷贝，不会二次处理，注意文件别太大（建议单视频 < 20MB，以免影响加载）。
- 推荐格式：图片用 `.jpg`/`.png`/`.svg`，视频用 `.mp4`（H.264 编码兼容性最好）。

## 四、放完记得推送
在 `my-website` 目录执行：

    git add -A
    git commit -m "添加媒体示例"
    git push

几分钟后刷新网站即可看到效果。
