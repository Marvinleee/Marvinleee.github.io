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
需要 **Ruby 3.4**（与 CI 一致，见 `.ruby-version`）。macOS 系统自带的 Ruby 2.6 无法构建当前 Chirpy；本站使用 Homebrew 的 `ruby@3.4`：

```bash
brew install ruby@3.4
tools/bootstrap.sh
bundle exec jekyll serve
```
然后访问 http://localhost:4000

`tools/bootstrap.sh` 会自动接入 Homebrew `ruby@3.4`、锁定依赖并准备本地环境。若 macOS Command Line Tools 缺少 C++ 标准库头文件，它会校验并使用固定版本的 LLVM 官方头文件完成原生依赖编译；这些本地文件保存在已忽略的 `vendor/` 中。

`deploy.sh` 会先调用上述引导脚本，再强制完成 Jekyll 构建与站内链接检查，不再跳过本地验证。

## 部署到 GitHub Pages
本站通过 **GitHub Actions** 自动构建并部署（`Build and Deploy` 工作流，仅监听 `main` 分支）。
**不要**在仓库 `Settings → Pages` 把 Source 设为某个分支，而应设为 **GitHub Actions**（由 `deploy-pages` 部署）。

发布新文章 / 资源：

```bash
cd my-website
git checkout main
./deploy.sh "这次改了什么"     # 不写说明会自动用当天日期
```

`deploy.sh` 只提交 `_posts/` 与 `assets/` 下的改动，并自动：
- 校验暂存区不含白名单之外的文件（即便你手动 `git add` 过也会被拦截）
- 扫描密钥 / 敏感文件（文件名完整路径 + basename，以及私钥内容签名 `-----BEGIN ... PRIVATE KEY-----`）
- 推送前检查远端 `main` 是否有你本地没有的新提交（避免覆盖；fetch 失败则中止，除非 `SKIP_REMOTE_CHECK=1`）
- 推送后由 Actions 构建并部署（约 1–3 分钟）

> 自定义域名 `marvinlee.cn` 由仓库内 `CNAME` 文件指定，记得在 `Settings → Pages` 勾选 **Enforce HTTPS**。

## 写新文章
在 `_posts/` 目录新建 `年-月-日-标题.md`，头部写 `layout/post/title/date/tags`，正文用 Markdown 书写，推送即发布。

## 想继续完善可以做
- 在 `_config.yml` 改 `title` / `description`。
- 在 `about.md` 填真实的邮箱和 GitHub 用户名。
- 加评论系统（如 Giscus / Disqus）、站内搜索、标签页面。
- 换主题色（改 `assets/css/style.css` 里的 `--accent`）。
