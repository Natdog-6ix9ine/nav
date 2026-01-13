#!/bin/bash

# 书签导航一键部署脚本
# 适用于 Linux/macOS 系统

set -e

echo "🚀 书签导航一键部署脚本"
echo "========================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
npm install
echo "✅ 依赖安装完成"
echo ""

# 登录 Cloudflare
echo "🔐 登录 Cloudflare..."
echo "浏览器将打开以完成授权..."
npx wrangler login
echo "✅ Cloudflare 登录成功"
echo ""

# 创建 KV 命名空间
echo "💾 创建 KV 命名空间..."
KV_OUTPUT=$(npx wrangler kv:namespace create "BOOKMARKS" 2>&1)
echo "$KV_OUTPUT"

# 提取 KV 命名空间 ID
KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | grep -o '"[^"]*"' | tr -d '"')

if [ -z "$KV_ID" ]; then
    echo "❌ 错误: 无法获取 KV 命名空间 ID"
    echo "请手动运行: npx wrangler kv:namespace create BOOKMARKS"
    exit 1
fi

echo "✅ KV 命名空间 ID: $KV_ID"
echo ""

# 更新 wrangler.toml
echo "📝 更新配置文件..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/id = \"your-kv-namespace-id\"/id = \"$KV_ID\"/" wrangler.toml
else
    # Linux
    sed -i "s/id = \"your-kv-namespace-id\"/id = \"$KV_ID\"/" wrangler.toml
fi
echo "✅ 配置文件已更新"
echo ""

# 部署到 Cloudflare Workers
echo "🚀 部署到 Cloudflare Workers..."
DEPLOY_OUTPUT=$(npm run deploy 2>&1)
echo "$DEPLOY_OUTPUT"

# 提取 Worker URL
WORKER_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*workers.dev' | head -1)

echo ""
echo "========================"
echo "🎉 部署成功!"
echo "========================"
echo ""
echo "📍 访问地址:"
echo "   前台导航: $WORKER_URL"
echo "   后台管理: $WORKER_URL/admin"
echo ""
echo "🔐 默认密码: admin"
echo ""
echo "⚠️  重要提醒:"
echo "   1. 请立即登录后台修改默认密码"
echo "   2. 首次使用需要在后台添加分类和书签"
echo "   3. 可以从浏览器导入HTML书签文件"
echo ""
echo "📖 更多信息请查看:"
echo "   - README.md: 完整使用指南"
echo "   - DEPLOYMENT.md: 详细部署说明"
echo ""