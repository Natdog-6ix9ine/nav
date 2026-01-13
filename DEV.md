# 🛠️ 本地开发指南

本文档说明如何在本地开发和调试书签导航项目，避免每次都需要部署到Cloudflare。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动本地开发服务器

```bash
npm run dev
```

或使用完全本地模式（不需要Cloudflare账号）:

```bash
npm start
```

服务器会在 `http://localhost:8787` 启动

- 前台: `http://localhost:8787`
- 后台: `http://localhost:8787/admin`

## 💡 开发模式说明

### npm run dev (推荐)

```bash
npm run dev
```

- **连接到Cloudflare**: 需要登录Cloudflare账号
- **使用真实KV**: 可以测试KV存储功能
- **热重载**: 修改代码自动重启
- **适合**: 需要测试完整功能时使用

### npm start (快速调试)

```bash
npm start
```

- **完全本地**: 不需要Cloudflare账号
- **模拟KV**: 使用内存存储模拟KV
- **快速启动**: 启动更快，适合快速调试
- **适合**: 前端页面调试和快速测试

## 🔧 开发工作流

### 推荐的开发流程

```bash
# 1. 启动本地开发服务器
npm start

# 2. 在浏览器中打开
# 前台: http://localhost:8787
# 后台: http://localhost:8787/admin

# 3. 修改代码，浏览器刷新即可看到效果

# 4. 测试完成后，提交代码
git add .
git commit -m "feat: 你的修改说明"
git push

# 5. 需要部署时，访问Deploy按钮重新部署
# https://deploy.workers.cloudflare.com/?url=https://github.com/Natdog-6ix9ine/nav
```

## 📝 开发技巧

### 1. 前端页面调试

修改 `index.html` 或 `admin.html` 后：
- 保存文件
- 刷新浏览器
- 立即看到效果

### 2. Worker API调试

修改 `src/worker.js` 后：
- 保存文件
- Wrangler会自动重启
- 刷新浏览器测试API

### 3. 查看日志

终端会显示所有请求日志，包括：
- HTTP请求路径
- 响应状态码
- 错误信息

### 4. 使用浏览器开发者工具

按 `F12` 打开开发者工具：
- **Console**: 查看JavaScript错误
- **Network**: 查看API请求
- **Application**: 查看localStorage数据

## 🔑 本地KV数据说明

### npm run dev 模式

使用真实的Cloudflare KV，数据会持久化保存。

### npm start 模式

使用内存模拟KV，特点：
- 数据仅在进程运行期间存在
- 重启服务器数据会丢失
- 适合快速测试，不需要担心数据污染

## 📦 部署流程

开发完成后的部署流程：

```bash
# 1. 确保所有修改已提交
git status

# 2. 提交代码到GitHub
git add .
git commit -m "你的提交信息"
git push

# 3. 访问Deploy按钮重新部署
# https://deploy.workers.cloudflare.com/?url=https://github.com/Natdog-6ix9ine/nav
```

## ⚡ 快捷命令

```bash
# 启动本地开发（需要Cloudflare账号）
npm run dev

# 启动本地开发（完全本地，无需账号）
npm start

# 部署到生产环境（需要Wrangler CLI配置）
npm run deploy

# 创建KV命名空间
npm run kv:create

# 查看Wrangler帮助
npx wrangler --help
```

## 🐛 常见问题

**Q: 本地开发时后台登录失败？**
A: 本地模式使用默认密码 `admin`，如果修改过需要重置。

**Q: 修改代码后没有效果？**
A: 
1. 确保保存了文件
2. 检查终端是否有错误
3. 刷新浏览器（Ctrl+F5强制刷新）
4. 重启开发服务器

**Q: 端口8787被占用？**
A: 修改 `wrangler.toml` 中的端口配置，或关闭占用8787端口的程序。

**Q: npm start 和 npm run dev 有什么区别？**
A:
- `npm start`: 完全本地，不需要Cloudflare账号，数据存在内存
- `npm run dev`: 连接Cloudflare，使用真实KV，需要登录账号

## 💻 编辑器配置推荐

### VS Code扩展

- **ES7+ React/Redux/React-Native snippets**: JavaScript代码片段
- **Path Intellisense**: 路径自动补全
- **GitLens**: Git增强
- **Prettier**: 代码格式化

### 自动保存

在VS Code设置中启用自动保存：
1. 文件 → 首选项 → 设置
2. 搜索 "auto save"
3. 设置为 "afterDelay"

## 🎯 最佳实践

1. **频繁保存**: 养成随时保存的习惯（Ctrl+S）
2. **增量开发**: 一次只改一个功能，测试通过再继续
3. **使用Git**: 每完成一个功能就提交一次
4. **查看日志**: 遇到问题先看终端和浏览器控制台的错误
5. **本地测试**: 在本地充分测试后再部署到生产环境

---

**祝您开发顺利！** 🎉