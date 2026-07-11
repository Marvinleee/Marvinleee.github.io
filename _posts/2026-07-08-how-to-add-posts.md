---
layout: post
title: 如何在这个站点写新文章
date: 2026-07-08
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
