# 书签导航 - Bookmark Navigator v2.0

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Natdog-6ix9ine/nav)

一个现代化的书签导航系统,支持前后台分离管理,使用Cloudflare Workers + KV存储。

## ✨ 功能特性

### 前台导航页面
- 🎨 **现代化设计** - 渐变背景、卡片式布局、流畅动画
- 🔍 **实时搜索** - 快速搜索书签标题和网址
- 🌐 **快捷搜索** - 集成Google、Bing、百度搜索入口
- 📊 **分类展示** - 自动按分类组织书签
- 🎯 **图标展示** - 自动获取网站Favicon
- 📱 **响应式设计** - 完美支持移动端和桌面端

### 后台管理系统
- 🔐 **密码保护** - 简单密码认证(默认密码: admin)
- ➕ **书签管理** - 增删改查书签
- 📁 **分类管理** - 创建和管理书签分类
- 📥 **批量导入** - 支持导入Edge/Chrome导出的HTML书签
- 💾 **云端存储** - 使用Cloudflare KV持久化数据

## 📦 项目结构

```
bookmark-navigator/
├── index.html          # 前台导航页面
├── admin.html          # 后台管理页面
├── src/
│   └── worker.js       # Cloudflare Workers API
├── wrangler.toml       # Cloudflare配置文件
├── package.json        # 项目配置
├── ARCHITECTURE.md     # 架构设计文档
└── README.md          # 使用说明
```

## 🚀 快速开始

### 方式一: Deploy to Cloudflare Workers(最简单)

点击上方的 **"Deploy to Cloudflare Workers"** 按钮,通过可视化界面一键部署:

1. 点击部署按钮
2. 授权GitHub访问
3. 授权Cloudflare账号
4. 自动创建KV命名空间
5. 自动部署Worker
6. 获得访问地址

**优点**: 无需安装任何工具,全程可视化操作,最适合新手

### 方式二: 本地一键部署脚本(推荐)

**Linux/macOS**:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Windows**:
```batch
scripts\deploy.bat
```

一键部署脚本会自动完成:
- ✅ 安装项目依赖
- ✅ 登录Cloudflare账号
- ✅ 创建KV命名空间
- ✅ 更新配置文件
- ✅ 部署到Cloudflare Workers
- ✅ 显示访问地址

### 方式三: 手动部署(高级用户)

#### 1. 安装依赖

```bash
npm install
```

#### 2. 创建KV命名空间

```bash
# 创建生产环境KV命名空间
npm run kv:create

# 创建开发环境KV命名空间(可选)
npm run kv:create-dev
```

复制输出的命名空间ID,更新 `wrangler.toml` 文件中的 `id` 字段。

#### 3. 本地开发(可选)

```bash
npm run dev
```

访问 `http://localhost:8787` 查看前台页面
访问 `http://localhost:8787/admin` 访问后台管理

#### 4. 部署到Cloudflare Workers

```bash
# 登录Cloudflare(首次部署)
npx wrangler login

# 部署到生产环境
npm run deploy
```

## 🔐 后台管理

### 默认密码

- 默认管理员密码: `admin`
- 首次登录后建议修改密码

### 修改管理员密码

使用Wrangler CLI修改密码:

```bash
# 生成新密码的SHA-256哈希
echo -n "your-new-password" | openssl dgst -sha256

# 使用KV命令更新密码哈希
wrangler kv:key put --binding=BOOKMARKS "admin_password" "新密码的哈希值"
```

## 📖 使用指南

### 前台导航使用

1. **访问导航页面**: 打开部署后的网址
2. **搜索网站**: 在搜索框中输入关键词
   - 使用上方搜索引擎按钮切换搜索引擎
   - 点击搜索按钮或回车键进行网络搜索
3. **搜索书签**: 在下方搜索框中输入关键词实时过滤书签
4. **访问书签**: 点击书签卡片直接跳转

### 后台管理使用

1. **登录后台**: 访问 `/admin` 页面,输入密码登录
2. **管理书签**:
   - 点击"添加书签"创建新书签
   - 点击书签列表中的编辑/删除按钮进行操作
3. **管理分类**:
   - 切换到"分类管理"标签
   - 添加、编辑或删除分类
4. **批量导入**:
   - 切换到"批量导入"标签
   - 拖拽或点击上传Edge/Chrome导出的HTML书签文件
   - 系统会自动解析并导入

### 导出浏览器书签

**Edge浏览器**:
1. 按 `Ctrl + Shift + O` 打开收藏夹管理器
2. 点击右上角 `...` 菜单
3. 选择 `导出收藏夹`
4. 保存为HTML文件

**Chrome浏览器**:
1. 打开书签管理器 (`chrome://bookmarks/`)
2. 点击右上角 `⋮` 菜单
3. 选择 `导出书签`
4. 保存为HTML文件

## 🎨 自定义配置

### 修改配色方案

编辑 `index.html` 或 `admin.html` 中的CSS变量:

```css
:root {
    --primary-color: #667eea;      /* 主色调 */
    --secondary-color: #764ba2;    /* 次色调 */
    --bg-color: #f7fafc;           /* 背景色 */
    --card-bg: #ffffff;            /* 卡片背景 */
}
```

### 添加更多搜索引擎

编辑 `index.html` 中的 `searchEngines` 对象:

```javascript
searchEngines: {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    duckduckgo: 'https://duckduckgo.com/?q='  // 添加新搜索引擎
}
```

## 🔧 技术架构

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **后端**: Cloudflare Workers
- **数据库**: Cloudflare KV
- **认证**: JWT Token (SHA-256)
- **API**: RESTful API

### API端点

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/bookmarks` | 获取所有书签 | ❌ |
| POST | `/api/bookmarks` | 创建书签 | ✅ |
| PUT | `/api/bookmarks/:id` | 更新书签 | ✅ |
| DELETE | `/api/bookmarks/:id` | 删除书签 | ✅ |
| POST | `/api/bookmarks/import` | 批量导入 | ✅ |
| POST | `/api/categories` | 创建分类 | ✅ |
| PUT | `/api/categories/:id` | 更新分类 | ✅ |
| DELETE | `/api/categories/:id` | 删除分类 | ✅ |
| POST | `/api/auth/login` | 登录 | ❌ |
| POST | `/api/auth/verify` | 验证Token | ❌ |

## 📝 注意事项

1. **数据存储**: 所有数据存储在Cloudflare KV中,永久保存
2. **访问权限**: 前台公开访问,后台需要密码认证
3. **Token有效期**: 登录Token有效期24小时
4. **浏览器兼容**: 支持所有现代浏览器(Chrome、Edge、Firefox、Safari)
5. **安全建议**:
   - 首次部署后立即修改默认密码
   - 定期导出数据备份
   - 不要在公共网络下登录后台

## 🆘 常见问题

**Q: 忘记管理员密码怎么办?**
A: 使用Wrangler CLI重置密码,参考上方"修改管理员密码"部分。

**Q: KV命名空间ID在哪里找?**
A: 运行 `npm run kv:create` 后,输出中会显示命名空间ID。

**Q: 为什么有些网站图标不显示?**
A: 部分网站可能没有favicon或加载失败,会显示首字母占位符。

**Q: 可以同时管理多个导航站吗?**
A: 可以!部署多个Worker实例,每个使用不同的KV命名空间。

**Q: Cloudflare Workers免费吗?**
A: 是的!免费套餐每天提供100,000次请求,KV提供1GB存储空间。

**Q: 数据会丢失吗?**
A: 不会。数据永久存储在Cloudflare KV中,建议定期导出备份。

## 🛠️ 开发指南

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问本地环境
# 前台: http://localhost:8787
# 后台: http://localhost:8787/admin
```

### 调试KV数据

```bash
# 查看所有键
wrangler kv:key list --binding=BOOKMARKS

# 获取特定键的值
wrangler kv:key get --binding=BOOKMARKS "bookmarks_data"

# 删除特定键
wrangler kv:key delete --binding=BOOKMARKS "auth_tokens"
```

### 项目结构说明

- `index.html` - 前台单页应用
- `admin.html` - 后台管理单页应用
- `src/worker.js` - Cloudflare Workers主文件,处理所有API请求
- `wrangler.toml` - Cloudflare配置文件
- `ARCHITECTURE.md` - 详细架构设计文档

## 📄 更新日志

### v2.0.0 (2024-01-13)
- ✨ 新增后台管理系统
- ✨ 新增Cloudflare KV数据存储
- ✨ 新增密码认证功能
- ✨ 新增RESTful API
- ✨ 新增快捷搜索引擎入口(Google、Bing、百度)
- 🎨 重构前台导航页面
- 📦 前后台完全分离

### v1.0.0
- ✨ 基础书签导航功能
- ✨ 支持导入HTML书签文件
- ✨ 本地文件处理,无服务器

## 📄 许可证

MIT License - 随意使用和修改!

## 🤝 贡献

欢迎提交Issue和Pull Request!

---

**享受你的书签导航之旅!** 🎉