# 📦 部署指南

本文档提供详细的部署步骤,帮助您快速将书签导航系统部署到Cloudflare Workers。

## 📋 前置要求

- Node.js 16+
- npm 或 yarn
- Cloudflare账号(免费即可)
- Git(可选)

## 🚀 一键部署(推荐)

### Linux/macOS

```bash
# 给脚本添加执行权限
chmod +x scripts/deploy.sh

# 运行一键部署脚本
./scripts/deploy.sh
```

### Windows

双击运行 `scripts\deploy.bat` 或在命令行执行:

```batch
scripts\deploy.bat
```

### 一键部署会自动完成

1. ✅ 检查Node.js和npm环境
2. ✅ 安装项目依赖
3. ✅ 登录Cloudflare账号(浏览器授权)
4. ✅ 创建KV命名空间
5. ✅ 自动更新配置文件
6. ✅ 部署到Cloudflare Workers
7. ✅ 显示访问地址和下一步提示

**注意**: Windows版本需要手动输入KV命名空间ID,请按照脚本提示操作。

---

## 🔧 手动部署步骤

### 步骤 1: 克隆或下载项目

```bash
# 使用Git克隆
git clone <repository-url>
cd bookmark-navigator

# 或直接下载ZIP并解压
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 登录Cloudflare

```bash
npx wrangler login
```

这将打开浏览器,要求您授权Wrangler访问您的Cloudflare账号。

### 步骤 4: 创建KV命名空间

```bash
# 创建生产环境KV命名空间
npx wrangler kv:namespace create "BOOKMARKS"

# 创建预览环境KV命名空间(可选)
npx wrangler kv:namespace create "BOOKMARKS" --preview
```

**重要**: 记录命令输出中的命名空间ID,例如:

```
🌀 Creating namespace with title "bookmark-navigator-BOOKMARKS"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "BOOKMARKS", id = "abc123def456" }
```

### 步骤 5: 配置wrangler.toml

打开 `wrangler.toml` 文件,将KV命名空间ID替换为上一步获取的实际ID:

```toml
[[kv_namespaces]]
binding = "BOOKMARKS"
id = "abc123def456"  # 替换为您的命名空间ID
```

### 步骤 6: 部署到Cloudflare Workers

```bash
npm run deploy
```

部署成功后,您会看到类似输出:

```
✨ Success! Uploaded 1 files (x.xx sec)
Published bookmark-navigator (x.xx sec)
  https://bookmark-navigator.your-subdomain.workers.dev
```

### 步骤 7: 访问您的导航站

- 前台导航: `https://bookmark-navigator.your-subdomain.workers.dev`
- 后台管理: `https://bookmark-navigator.your-subdomain.workers.dev/admin`

默认管理员密码: `admin`

## 🎯 首次使用配置

### 1. 登录后台

访问后台管理页面: `https://your-worker-url.workers.dev/admin`

输入默认密码: `admin`

### 2. 修改管理员密码(强烈建议)

```bash
# 生成新密码的SHA-256哈希
echo -n "your-new-password" | openssl dgst -sha256

# 使用输出的哈希值更新KV
npx wrangler kv:key put --binding=BOOKMARKS "admin_password" "哈希值"
```

或者使用在线SHA-256工具生成哈希值。

### 3. 添加分类

1. 登录后台
2. 切换到"分类管理"标签
3. 点击"➕ 添加分类"
4. 输入分类名称和图标(Emoji)
5. 点击"保存"

### 4. 导入书签(可选)

**方法一: 批量导入**
1. 从浏览器导出HTML书签文件
2. 在后台切换到"批量导入"标签
3. 拖拽或点击上传HTML文件

**方法二: 手动添加**
1. 在后台"书签管理"标签
2. 点击"➕ 添加书签"
3. 填写书签信息
4. 选择分类
5. 点击"保存"

## 🌐 配置自定义域名(可选)

### 使用Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages
3. 选择您的Worker
4. 点击 "Triggers" 标签
5. 在 "Custom Domains" 部分点击 "Add Custom Domain"
6. 输入您的域名,如 `bookmarks.yourdomain.com`
7. 等待DNS记录自动配置(通常几分钟)

### 使用Wrangler CLI

```bash
npx wrangler domains add bookmarks.yourdomain.com
```

## 🔧 本地开发

如果您想在本地测试或开发:

```bash
# 启动本地开发服务器
npm run dev

# 访问本地环境
# 前台: http://localhost:8787
# 后台: http://localhost:8787/admin
```

## 📊 验证部署

### 1. 检查前台页面

访问前台URL,您应该看到:
- 搜索引擎选择器(Google、Bing、百度)
- 搜索框
- "暂无书签"提示(如果还没有添加数据)

### 2. 检查后台登录

访问 `/admin`,输入密码后应该能:
- 看到书签管理界面
- 看到三个标签页: 书签管理、分类管理、批量导入

### 3. 测试API

```bash
# 测试获取书签API
curl https://your-worker-url.workers.dev/api/bookmarks
```

应该返回JSON格式数据:
```json
{
  "categories": [],
  "bookmarks": []
}
```

## 🐛 故障排除

### 问题: 部署失败 "KV namespace not found"

**解决方案**: 
- 确认已创建KV命名空间
- 检查 `wrangler.toml` 中的命名空间ID是否正确
- 重新运行 `npm run kv:create`

### 问题: 登录后台失败

**解决方案**:
- 检查是否使用了正确的密码(默认: `admin`)
- 清除浏览器缓存和localStorage
- 使用无痕模式尝试

### 问题: 无法访问Worker URL

**解决方案**:
- 检查Worker是否部署成功
- 确认Cloudflare账号已激活
- 等待几分钟让DNS生效

### 问题: 导入书签失败

**解决方案**:
- 确认HTML文件格式正确
- 先创建至少一个分类
- 检查浏览器控制台的错误信息

## 📝 常用命令

```bash
# 查看Worker日志
npx wrangler tail

# 查看KV中的所有键
npx wrangler kv:key list --binding=BOOKMARKS

# 获取特定键的值
npx wrangler kv:key get --binding=BOOKMARKS "bookmarks_data"

# 删除特定键
npx wrangler kv:key delete --binding=BOOKMARKS "auth_tokens"

# 重新部署
npm run deploy

# 删除Worker(谨慎使用)
npx wrangler delete
```

## 🔒 安全建议

1. **立即修改默认密码**: 部署后第一件事就是修改默认密码
2. **定期备份数据**: 使用KV导出功能定期备份
3. **使用HTTPS**: Cloudflare Workers自动提供HTTPS
4. **限制访问**: 考虑使用Cloudflare Access进行额外保护
5. **监控日志**: 定期检查Worker日志,发现异常访问

## 📈 性能优化

### 缓存策略

Cloudflare Workers会自动缓存静态资源(HTML、CSS、JS),无需额外配置。

### KV读取优化

- KV读取非常快(通常<10ms)
- 数据已在全球边缘节点分发
- 无需额外优化

### 成本控制

免费套餐限制:
- 每天100,000次请求
- 1GB KV存储
- 足够个人和小团队使用

## 🆘 获取帮助

- 查看 [README.md](README.md) 了解功能说明
- 查看 [ARCHITECTURE.md](ARCHITECTURE.md) 了解架构设计
- 提交Issue到项目仓库
- 访问 [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)

---

**祝您部署顺利!** 🎉