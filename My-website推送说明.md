# My-website 推送说明

> 本说明用于把本地 `my-website` 文件夹里的网站内容，推送到 GitHub 并让 `https://marvinlee.cn` 上线。
> 适用对象：不熟悉 git 的同学，照着抄命令即可。

---

## 当前状态（已配置好，无需重做）

| 项目 | 值 |
| --- | --- |
| 本地目录 | `/Users/leemarvin/my-website` |
| 远程仓库 | `git@github.com:Marvinleee/Marvinleee.github.io.git`（SSH 方式） |
| 使用分支 | `master` |
| 部署平台 | GitHub Pages |
| 自定义域名 | `marvinlee.cn`（仓库根目录已有 `CNAME` 文件） |
| 认证方式 | SSH 密钥（已生成并加入 GitHub，免令牌） |

> 如果你的电脑还没配 SSH（换电脑/重装系统后），见文末「附录：重新配置 SSH」。

---

## 一、日常推送流程（每次改完内容都这样）

打开 Mac 的「终端」App（Spotlight 搜「终端」），逐行执行：

```bash
cd /Users/leemarvin/my-website
git add -A
git commit -m "写这次改了什么，例如：新增一篇旅行文章"
git push
```

- 第一次推送成功后，之后直接 `git push` 即可，不用再写 `-u origin master`。
- `git push` 后等 **1–2 分钟**，浏览器用 `Cmd + Shift + R` 强制刷新就能看到更新。

### 提交信息怎么写
`"..."` 里用中文或英文简短说明本次改动，例如：
- `"修正文章日期"`
- `"新增媒体使用指南"`
- `"更新关于页简介"`

---

## 二、写新文章的日期注意事项（重要）

Jekyll 显示的日期**不是上传日期**，而是每篇文章文件头里的 `date:` 字段。

**文件名和 `date:` 都要写当天**，例如今天写文章：

- 文件名：`2026-07-11-我的新文章.md`
- 文件头：
  ```markdown
  ---
  layout: post
  title: 我的新文章
  date: 2026-07-11
  tags: [随笔]
  ---
  ```

如果只改了文件名没改 `date:`，文章会按 `date:` 里的旧日期显示（这就是之前显示 07-08 的原因）。

---

## 三、确认 GitHub Pages 设置（一般不用动）

如果线上突然打不开或显示旧内容，去仓库检查：

1. 进 `Marvinleee.github.io` 仓库 → 顶部 **Settings** → 左侧 **Pages**
2. **Build and deployment → Source** 选 `Deploy from a branch`
3. **Branch** 选 **`master`**，目录选 `/ (root)`，点 **Save**
4. **Custom domain** 填 `marvinlee.cn`，并勾选 **Enforce HTTPS**

> 只要保持从 `master` 分支构建，本地推 `master` 就会即时更新。

---

## 四、常见排错

### 1. `git push` 报权限错误 / 要密码
说明 SSH 没配好或远程地址不是 SSH 格式。检查：
```bash
git remote -v
```
应显示 `git@github.com:Marvinleee/Marvinleee.github.io.git`。若显示 `https://...`，执行：
```bash
git remote set-url origin git@github.com:Marvinleee/Marvinleee.github.io.git
```

### 2. 推送成功但网站没刷新
多半是 GitHub Pages 在吃 `main` 分支而非 `master`。回到「第三节」把源分支改成 `master`。

### 3. 测试 SSH 连通性
```bash
ssh -T git@github.com
```
看到 `Hi Marvinleee! You've successfully authenticated` 即为成功（后面的 `does not provide shell access` 是正常的，不是报错）。

### 4. 提示 `Host key verification failed`
执行下面两行后重新测试：
```bash
ssh-keygen -R github.com
ssh -T git@github.com
```
问 `Are you sure...` 时输入 `yes`。

---

## 五、更省事：一键部署脚本（已生成）

仓库里已经放好 `deploy.sh`（已设为可执行），它把「暂存 → 提交 → 推送」三步合成一条命令。脚本内容如下（无需手动创建）：

```bash
#!/bin/bash
# 一键部署脚本：把本地改动提交并推送到 GitHub Pages
# 用法：./deploy.sh "这次改了什么"
# 不写说明时，自动用当天日期作为提交信息。

set -e

# 无论在哪里运行，都切到脚本所在目录（即 my-website）
cd "$(dirname "$0")"

# 取提交信息：命令行参数优先，否则用日期
msg="$1"
if [ -z "$msg" ]; then
  msg="更新站点 $(date +%Y-%m-%d)"
fi

# 确认当前在 master 分支
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")
if [ "$branch" != "master" ]; then
  echo "⚠️  当前分支是 $branch，不是 master。请先切回 master 再部署。"
  exit 1
fi

echo "→ 暂存所有改动..."
git add -A

echo "→ 提交：$msg"
git commit -m "$msg"

echo "→ 推送到 GitHub..."
git push

echo ""
echo "✅ 已推送。稍等 1-2 分钟，浏览器用 Cmd+Shift+R 强刷即可看到更新。"
```

### 用法
```bash
cd /Users/leemarvin/my-website
./deploy.sh "这次改了啥"
```
- 不写说明也行，直接 `./deploy.sh` 会用当天日期当提交信息。
- 脚本会自动切到 `my-website` 目录，所以在任何位置运行都可以。
- 脚本会先检查当前是否为 `master` 分支，避免误推到别的分支。

> 注意：`deploy.sh` 是新增文件，第一次需要你 `git add -A && git commit && git push` 把它也推上 GitHub（之后它就在仓库里了）。

---

## 附录：重新配置 SSH（换电脑/重装后）

1. 生成密钥（连续按 3 次回车）：
   ```bash
   ssh-keygen -t ed25519 -C "marvin@example.com"
   ```
2. 复制公钥：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   把输出的一整行复制下来。
3. 登录 github.com → 头像 → **Settings → SSH and GPG keys → New SSH key**，粘贴保存。
4. 测试：
   ```bash
   ssh -T git@github.com
   ```

---

_最后更新：2026-07-11_
