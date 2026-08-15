#!/bin/bash
# 一键部署脚本：把本地改动提交并推送到 GitHub Pages（仅 main 分支）
# 用法：./deploy.sh "这次改了什么"
# 不写说明时，自动用当天日期作为提交信息。
#
# 安全设计（吸取误提交 SSH 私钥 y/y.pub 的教训）：
#   - 仅白名单暂存 _posts/ 与 assets/，杜绝 git add -A 误提交密钥
#   - git add 任一步失败（索引锁/权限等）立即中止，不再用 2>/dev/null 隐藏导致“暂存失败却提示没有改动”
#   - 提交前校验暂存区：凡 _posts/ assets/ 之外的已暂存文件（含“删除”操作）一律拒绝（即便手动 git add 过）
#   - 提交前扫描暂存区：密钥文件名（完整路径 + basename，覆盖子目录无扩展名密钥）及私钥内容签名命中即拒绝；
#     内容签名读取“暂存区 blob”(git cat-file :<file>) 而非工作区文件，避免“暂存后改工作区”绕过
#   - 大文件（>5MB）告警
#   - 无改动时正常退出（不再因 set -e + git commit 失败而中断）
#   - 提交前可选本地构建/链接检查（Ruby >= 3.4 时启用，与 CI 一致）
#   - 推送前检查远端 main 是否有本地没有的新提交（fetch 失败则中止，除非 SKIP_REMOTE_CHECK=1）
#   - 遍历暂存文件用 while read 逐行读取（正确处理含空格文件名；本站文件名不含换行，换行分隔足够；NUL 需 bash>=4）

set -euo pipefail

# 无论在哪里运行，都切到脚本所在目录（即 my-website）
cd "$(dirname "$0")"

# ---------- 确认当前在 main 分支 ----------
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
if [ "$branch" != "main" ]; then
  echo "⚠️  当前分支是 ${branch}，不是 main。请先切到 main 再部署：git checkout main"
  exit 1
fi

# ---------- 仅白名单暂存文章与资源（放弃 git add -A）----------
echo "→ 仅暂存文章与资源（白名单：_posts/ assets/）..."
# 只 add 真实存在的目录；任一步 git add 失败（索引锁、权限等）立即中止，
# 不再用 2>/dev/null || true 隐藏，以免“暂存失败却提示没有改动”。
for d in _posts assets; do
  if [ -d "$d" ]; then
    if ! git add -- "$d"; then
      echo "❌ git add $d 失败，已中止。" >&2
      exit 1
    fi
  fi
done
# 如需纳入其他约定目录，按需在此补充，例如：
#   [ -d _data ] && git add -- _data
#   [ -d pages ] && git add -- pages

# 取出即将进入提交的文件清单（自检用），换行分隔写入临时文件；
# 遍历时用 while read 逐行读取，可正确处理含空格的文件名（NUL 需 bash>=4，本站文件名不含换行，换行足够）。
# 注意：不再使用 --diff-filter=ACMR，以纳入“删除(D)”操作，避免删除非白名单文件绕过白名单检查。
STAGE_LIST=$(mktemp)
trap 'rm -f "$STAGE_LIST" 2>/dev/null' EXIT
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  git diff --cached --name-only > "$STAGE_LIST"
else
  git ls-files > "$STAGE_LIST"
fi

# ---------- 安全守卫 0：暂存区必须只含白名单目录 ----------
# 即便用户手动 git add 了 _config.yml / 脚本等，也必须拦截，
# 否则后面的无路径限定 git commit 会把它们一并提交（“仅白名单提交”才名副其实）。
NON_WHITELIST=""
while IFS= read -r f; do
  case "$f" in
    _posts/*|assets/*) ;;          # 允许
    *) NON_WHITELIST="${NON_WHITELIST}
  - ${f}";;
  esac
done < "$STAGE_LIST"
if [ -n "$NON_WHITELIST" ]; then
  echo "❌ 暂存区含有白名单之外的文件，已中止提交："
  printf "%s\n" "$NON_WHITELIST"
  echo "    本次部署只接受 _posts/ 与 assets/ 下的改动。"
  echo "    请先用 'git restore --staged <文件>' 取消暂存这些文件，再重试。"
  exit 1
fi

# ---------- 安全守卫 1：密钥 / 敏感文件黑名单 ----------
# 命中即拒绝提交（即便被手动 git add 过）。
# 三重匹配：完整路径模式 + basename（覆盖子目录里的无扩展名/标准密钥名）+ 私钥内容签名。
FORBIDDEN_BASENAMES=(
  "y" "y.pub"            # 历史泄露过的遗留私钥，绝不再入仓
  "id_rsa" "id_ed25519" "id_dsa" "id_ecdsa" "id_ecdsa_sk" "id_ed25519_sk"
  "credentials"
)
PATH_PATTERNS="*.pem *.key *.p12 *.pfx *.keystore *.jks .env .env.* *.secret credentials.* y y.pub id_rsa id_ed25519 id_dsa id_ecdsa id_ecdsa_sk id_ed25519_sk"
BAD=""
while IFS= read -r f; do
  bname=$(basename "$f")
  # 1) 完整路径模式匹配
  for pat in $PATH_PATTERNS; do
    case "$f" in
      $pat) BAD="${BAD}
  - ${f}  (路径匹配: ${pat})";;
    esac
  done
  # 2) basename 匹配（assets/id_ed25519、assets/y 等子目录场景）
  for nb in "${FORBIDDEN_BASENAMES[@]}"; do
    if [ "$bname" = "$nb" ]; then
      BAD="${BAD}
  - ${f}  (basename 匹配: ${nb})"
    fi
  done
  # 3) 私钥内容签名扫描：读取“暂存区 blob”(git cat-file :<file>) 而非工作区文件，
  #    避免“先暂存含密钥文件、再把工作区替换为安全内容”绕过检测。
  if git cat-file -p ":$f" 2>/dev/null | head -c 4096 | grep -E -q -e '-----BEGIN [A-Z ]+PRIVATE KEY-----'; then
    BAD="${BAD}
  - ${f}  (检测到私钥内容签名)"
  fi
done < "$STAGE_LIST"
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
while IFS= read -r f; do
  if [ -f "$f" ]; then
    sz=$(wc -c < "$f" 2>/dev/null || echo 0)
    if [ "$sz" -gt "$MAX_BYTES" ]; then
      echo "⚠️  大文件告警：${f} ($(human "$sz"))，请确认是否确需入仓。"
    fi
  fi
done < "$STAGE_LIST"

# ---------- 无改动时正常退出（修复 set -e 中断陷阱）----------
if git diff --cached --quiet; then
  echo "ℹ️  没有需要提交的改动，已正常退出。"
  exit 0
fi

# ---------- 可选：提交前本地构建与链接检查（需 Ruby >= 3.4）----------
# 本机 Ruby 多为 2.6（无法构建 Chirpy），此时跳过，正确性由 GitHub Actions 兜底。
# 一旦升级到 Ruby 3.4+，本步会自动启用；构建/检查失败则中止提交，错误不会进入远端。
if command -v ruby >/dev/null 2>&1; then
  RV=$(ruby -e 'print RUBY_VERSION' 2>/dev/null || echo "unknown")
  if ruby -e 'require "rubygems"; exit(Gem::Version.new(RUBY_VERSION) >= Gem::Version.new("3.4") ? 0 : 1)' 2>/dev/null; then
    if [ -x tools/test.sh ]; then
      echo "→ 运行本地构建与链接检查 (tools/test.sh)..."
      if ! tools/test.sh; then
        echo "❌ 本地构建/链接检查未通过，已中止提交。请修复后再部署。"
        exit 1
      fi
    fi
  else
    echo "ℹ️  本地 Ruby 为 ${RV}（CI 使用 3.4），跳过本地构建检查；正确性由 GitHub Actions 兜底。"
  fi
fi

# ---------- 提交信息 ----------
msg="${1:-}"
if [ -z "$msg" ]; then
  msg="更新站点 $(date +%Y-%m-%d)"
fi

echo "→ 提交：${msg}"
git commit -m "$msg"

# ---------- 推送前检查远端 main 是否有本地没有的新提交 ----------
echo "→ 检查远端 main 是否有新提交..."
if ! git fetch origin main --quiet 2>/dev/null; then
  echo "⚠️  无法连接远端 main（断网 / 认证失败 / 仓库不可达）。"
  echo "    远端新提交检查已失效，盲目推送可能覆盖他人改动。"
  if [ -z "${SKIP_REMOTE_CHECK:-}" ]; then
    echo "    已中止。若确认要离线部署，可设置 SKIP_REMOTE_CHECK=1 后重试。"
    exit 1
  fi
  echo "    SKIP_REMOTE_CHECK=1 已设置，跳过远端检查继续推送。"
fi
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
