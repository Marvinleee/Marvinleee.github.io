#!/bin/bash
# 一键部署脚本：把本地改动提交并推送到 GitHub Pages（仅 main 分支）
# 用法：./deploy.sh "这次改了什么"
# 不写说明时，自动用当天日期作为提交信息。
#
# 安全设计（吸取误提交 SSH 私钥 y/y.pub 的教训）：
#   - 仅白名单暂存 _posts/ 与 assets/，杜绝 git add -A 误提交密钥
#   - 提交前扫描暂存区，命中密钥/敏感文件模式即拒绝
#   - 大文件（>5MB）告警
#   - 无改动时正常退出（不再因 set -e + git commit 失败而中断）
#   - 推送前检查远端 main 是否有本地没有的新提交（避免覆盖/冲突）

set -euo pipefail

# 无论在哪里运行，都切到脚本所在目录（即 my-website）
cd "$(dirname "$0")"

# ---------- 确认当前在 main 分支 ----------
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
if [ "$branch" != "main" ]; then
  echo "⚠️  当前分支是 $branch，不是 main。请先切到 main 再部署：git checkout main"
  exit 1
fi

# ---------- 仅白名单暂存文章与资源（放弃 git add -A）----------
echo "→ 仅暂存文章与资源（白名单：_posts/ assets/）..."
git add _posts/ assets/ 2>/dev/null || true
# 如需纳入其他约定目录，按需在此补充，例如：
# git add _data/ pages/ 2>/dev/null || true

# 取出即将进入提交的文件清单（自检用）
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  CANDIDATE_FILES=$(git diff --cached --name-only --diff-filter=ACMR)
else
  CANDIDATE_FILES=$(git ls-files)
fi

# ---------- 安全守卫 1：密钥 / 敏感文件黑名单 ----------
# 命中即拒绝提交（即便被手动 git add 过）
FORBIDDEN_PATTERNS=(
  "y" "y.pub"            # 历史泄露过的遗留私钥，绝不再入仓
  "*.pem" "*.key" "*.p12" "*.pfx" "*.keystore" "*.jks"
  "id_rsa" "id_ed25519" "id_dsa" "id_ecdsa" "id_ecdsa_sk" "id_ed25519_sk"
  ".env" ".env.*" "*.secret" "credentials" "credentials.*"
)
BAD=""
for f in $CANDIDATE_FILES; do
  for pat in "${FORBIDDEN_PATTERNS[@]}"; do
    case "$f" in
      $pat) BAD="${BAD}
  - ${f}  (匹配: ${pat})";;
    esac
  done
done
if [ -n "$BAD" ]; then
  echo "❌ 检测到疑似密钥/敏感文件，已中止提交："
  printf "%s\n" "$BAD"
  echo "    请先将其移出仓库或用 'git rm --cached <文件>' 从暂存区移除，再重试。"
  exit 1
fi

# ---------- 安全守卫 2：大文件告警（>5MB）----------
human() {
  local b=$1
  if [ "$b" -ge 1048576 ]; then printf "%sMB" "$((b/1048576))"
  elif [ "$b" -ge 1024 ]; then printf "%sKB" "$((b/1024))"
  else printf "%sB" "$b"; fi
}
MAX_BYTES=$((5*1024*1024))
for f in $CANDIDATE_FILES; do
  if [ -f "$f" ]; then
    sz=$(wc -c < "$f" 2>/dev/null || echo 0)
    if [ "$sz" -gt "$MAX_BYTES" ]; then
      echo "⚠️  大文件告警：${f} ($(human "$sz"))，请确认是否确需入仓。"
    fi
  fi
done

# ---------- 无改动时正常退出（修复 set -e 中断陷阱）----------
if git diff --cached --quiet; then
  echo "ℹ️  没有需要提交的改动，已正常退出。"
  exit 0
fi

# ---------- 提交信息 ----------
msg="$1"
if [ -z "$msg" ]; then
  msg="更新站点 $(date +%Y-%m-%d)"
fi

echo "→ 提交：$msg"
git commit -m "$msg"

# ---------- 推送前检查远端 main 是否有本地没有的新提交 ----------
echo "→ 检查远端 main 是否有新提交..."
git fetch origin main --quiet 2>/dev/null || true
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "")
if [ -n "$REMOTE" ] && [ "$REMOTE" != "$(git rev-parse HEAD)" ]; then
  if git merge-base --is-ancestor "$(git rev-parse HEAD)" "$REMOTE" 2>/dev/null; then
    echo "⚠️  远端 main 有你本地没有的新提交（本地落后）。请先 'git pull origin main' 再部署，避免覆盖。"
    exit 1
  fi
fi

echo "→ 推送到 GitHub (main)..."
git push origin main

echo ""
echo "✅ 已推送。GitHub Actions 将自动构建并部署（约 1-3 分钟）。"
echo "   浏览器用 Cmd+Shift+R 强刷即可看到更新。"
echo ""
echo "⚠️  GitHub Pages 的 Source 应设为 'GitHub Actions'（Settings → Pages）。"
