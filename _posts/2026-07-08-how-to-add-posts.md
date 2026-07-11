---
layout: post
title: 如何在这个站点写新文章
date: 2026-07-11
tags: [教程]
---
写新文章很简单，只需在 `_posts/` 目录下新建一个 Markdown 文件。

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

### 添加图片

1. 把图片文件放进 `assets/img/` 目录（没有就新建）。例如 `assets/img/cat.jpg`。
2. 在文章里用 Markdown 插入：

       ![一只猫](/assets/img/cat.jpg)

   图片会按原始尺寸显示。

3. 想控制大小、居中，可用 HTML：

       <p style="text-align:center">
         <img src="/assets/img/cat.jpg" alt="一只猫" width="400">
       </p>

   把 `width="400"` 改成你想要的像素宽度即可。

> 提示：图片路径以 `/` 开头表示从网站根目录算起，`assets/img/cat.jpg` 对应网址 `https://marvinlee.cn/assets/img/cat.jpg`。

### 添加视频

**方式一：本地视频文件（自托管，不依赖第三方）**
1. 把视频（如 `.mp4`）放进 `assets/video/` 目录。
2. 用 HTML5 视频标签插入：

       <video controls width="640" src="/assets/video/clip.mp4"></video>

   `controls` 让用户能播放/暂停；想自适应手机宽度，可写成
   `<video controls style="max-width:100%" src="/assets/video/clip.mp4"></video>`。

**方式二：嵌入 YouTube / Bilibili 等平台视频**
直接粘贴平台提供的嵌入代码（`<iframe>`）。以 YouTube 为例：

       <iframe width="640" height="360" src="https://www.youtube.com/embed/视频ID" frameborder="0" allowfullscreen></iframe>

Bilibili 在视频页点「分享 → 嵌入代码」复制类似内容粘进来即可。

### 真实示例

下面放了一个真实可播放的示例（图片点击可放大，视频可直接播放），推上线后你就能看到实际效果：

![示例图片](/assets/img/sample.svg)

<video controls style="max-width:100%" src="/assets/video/sample.mp4">
  你的浏览器不支持 video 标签，请换用现代浏览器。
</video>

> 说明：示例图是 `assets/img/sample.svg`（矢量图，可无限放大不糊）；示例视频 `sample.mp4` 是自托管文件，放在 `assets/video/` 下，完全不依赖 YouTube 等被墙平台，在国内也能正常播放。换成你自己的素材时，把文件替换掉、路径保持一致即可。

### 写完别忘了推送

保存文件后，在 `my-website` 目录执行：

       git add -A
       git commit -m "新增文章：xxx"
       git push

几分钟后刷新网站，就能看到新文章以及里面的图片/视频了。
