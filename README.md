# marvinlee.cn 个人博客

基于 **Jekyll + GitHub Pages** 搭建的个人博客，部署在自定义域名 `marvinlee.cn`。

## 目录结构
```
marvinlee-blog/
├── _config.yml          # 站点配置（标题、描述、链接格式等）
├── CNAME                # 自定义域名（marvinlee.cn）
├── index.html           # 首页（文章列表）
├── about.md             # 关于页  → /about/
├── archives.md          # 归档页  → /archives/
├── feed.xml             # RSS 订阅
├── 404.html             # 404 页面
├── _layouts/            # 页面模板
│   ├── default.html
│   └── post.html
├── assets/css/style.css # 样式
└── _posts/              # 博客文章（Markdown）
```

## 本地预览（可选）
```bash
gem install jekyll bundler
bundle init
echo 'gem "github-pages", group: :jekyll_plugins' >> Gemfile
bundle install
bundle exec jekyll serve
```
然后访问 http://localhost:4000

## 部署到 GitHub Pages
1. 把本目录所有文件推送到你绑定 `marvinlee.cn` 的那个 GitHub 仓库。
2. 仓库 **Settings → Pages → Source** 选择 `main` 分支、`/(root)`。
3. **Custom domain** 已通过 `CNAME` 文件设为 `marvinlee.cn`，记得勾选 **Enforce HTTPS**。
4. 推送后等 1–2 分钟，访问 https://marvinlee.cn 即可看到新站点。

## 写新文章
在 `_posts/` 目录新建 `年-月-日-标题.md`，头部写 `layout/post/title/date/tags`，正文用 Markdown 书写，推送即发布。

## 想继续完善可以做
- 在 `_config.yml` 改 `title` / `description`。
- 在 `about.md` 填真实的邮箱和 GitHub 用户名。
- 加评论系统（如 Giscus / Disqus）、站内搜索、标签页面。
- 换主题色（改 `assets/css/style.css` 里的 `--accent`）。
