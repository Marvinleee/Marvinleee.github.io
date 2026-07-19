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
echo "✅ 已推送。GitHub Actions 将自动构建并部署（约 1-3 分钟）。"
echo "   浏览器用 Cmd+Shift+R 强刷即可看到更新。"
echo ""
echo "⚠️ 首次部署前，请到 GitHub 仓库 Settings → Pages → Source"
echo "   改为 'GitHub Actions'（不再是 Deploy from a branch）。"
