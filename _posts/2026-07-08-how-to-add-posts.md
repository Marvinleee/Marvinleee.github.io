---
layout: post
title: 如何写新文章与插入图片/视频
date: 2026-07-11
tags: [教程, 媒体]
description: "本站写作与媒体指南：文件命名规则、Front Matter 写法，如何插入图片（含点击放大 lightbox）、自托管与 B 站/YouTube 嵌入视频，以及推送上线流程。"
---
写新文章很简单，只需在 `_posts/` 目录下新建一个 Markdown 文件。本指南把「写文章」和「放图片 / 视频」合在一起讲，照着做就能发出一篇带图带视频的帖子。

### 文件命名
格式为 `年-月-日-标题英文.slug.md`，例如：

    2026-07-08-my-new-post.md

### 头部信息（Front Matter）
文件最上方写：

    ---
    layout: post
    title: 文章标题
    date: 2026-07-08
    tags: [标签1, 标签2]
    ---

正文用普通 Markdown 书写即可。保存并推送到 GitHub，几分钟后文章就会自动出现在首页和归档里。

## 一、添加图片

### 1. 存放位置
把图片文件放进 `assets/img/` 目录（没有就新建）。例如 `assets/img/cat.jpg`。

### 2. 插入图片（Markdown）
在正文中写：

    ![一只猫](/assets/img/sample.svg)

`!` 后面方括号是替代文字（无障碍/加载失败时显示），圆括号是路径。图片会按原始尺寸显示，并自动适配手机宽度。

### 3. 控制大小与居中（HTML）
想固定宽度、居中，可用 HTML：

    <p style="text-align:center">
      <img src="/assets/img/sample.svg" alt="一只猫" width="400">
    </p>

把 `width="400"` 改成你想要的像素宽度即可；也可用百分比，如 `width="80%"`。

### 4. 点击放大（lightbox）
**已全局开启，无需任何配置。** 文章里的任意图片，鼠标单击即可全屏放大查看，再次点击或按 `Esc` 关闭。试试下面的示例图：

![示例图片](/assets/img/sample.svg)

> 提示：lightbox 用的是图片原图地址，矢量图（`.svg`）放大也不会糊；位图（`.jpg/.png`）放大后清晰度取决于原图分辨率。

## 二、添加视频

**方式一：自托管视频（推荐，国内可用）**
把 `.mp4` 文件放进 `assets/video/` 目录，再用 HTML5 标签插入：

    <video controls style="max-width:100%" src="/assets/video/sample.mp4"></video>

- `controls`：显示播放/暂停/进度条
- `style="max-width:100%"`：自适应手机宽度
- 可加 `autoplay muted loop` 做背景循环（自动播放必须 `muted`）

下面是一个真实可播放的示例（文件就在本站的 `assets/video/sample.mp4`）：

<video controls style="max-width:100%" src="/assets/video/sample.mp4">
  你的浏览器不支持 video 标签，请换用现代浏览器。
</video>

**方式二：嵌入平台视频（Bilibili / YouTube）**
直接粘贴平台提供的 `<iframe>` 嵌入代码。

**Bilibili**（国内推荐）：视频页点「分享 → 嵌入代码」，复制类似内容粘进文章：

    <iframe src="//player.bilibili.com/player.html?bvid=你的BV号" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="640" height="360"></iframe>

**YouTube**（境外/科学上网环境可用）：

    <iframe width="640" height="360" src="https://www.youtube.com/embed/视频ID" frameborder="0" allowfullscreen></iframe>

## 三、注意事项
- 路径以 `/` 开头表示从网站根目录算起：`assets/img/x.jpg` 对应网址 `https://marvinlee.cn/assets/img/x.jpg`。
- 图片/视频都是静态文件，Jekyll 会原样拷贝，不会二次处理，注意文件别太大（建议单视频 < 20MB，以免影响加载）。
- 推荐格式：图片用 `.jpg`/`.png`/`.svg`，视频用 `.mp4`（H.264 编码兼容性最好）。

## 四、写完别忘了推送
保存文件后，在 `my-website` 目录执行：

    git add -A
    git commit -m "新增文章：xxx"
    git push

几分钟后刷新网站，就能看到新文章以及里面的图片/视频了。
