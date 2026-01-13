# 📚 GitHub部署指南

本文档说明如何将项目上传到GitHub并使用"Deploy to Cloudflare Workers"按钮一键部署。

## 🔧 前置准备

- GitHub账号
- Git已安装
- 已完成本地项目开发

## 📤 上传到GitHub

### 1. 初始化Git仓库(如果还没有)

```bash
git init
git add .
git commit -m "Initial commit: Bookmark Navigator v2.0"
```

### 2. 添加远程仓库

```bash
# 使用SSH方式(推荐)
git remote add origin git@github.com:Natdog-6ix9ine/nav.git

# 或使用HTTPS方式
git remote add origin https://github.com/Natdog-6ix9ine/nav.git
```

### 3. 推送到GitHub

```bash
git branch -M main
git push -u origin main
```

## 🚀 Deploy to Workers按钮

### 配置文件说明

项目已包含以下配置文件:

1. **deploy-button.json** - Deploy按钮的配置文件
   - 定义项目名称和描述
   - 配置KV命名空间
   - 指定部署参数

2. **.github/workflows/deploy.yml** - GitHub Actions自动部署
   - 监听main分支的push事件
   - 自动安装依赖并部署

### 使用Deploy按钮

访问者可以通过以下链接一键部署:

```
https://deploy.workers.cloudflare.com/?url=https://github.com/Natdog-6ix9ine/nav
```

或在README.md中添加按钮:

```markdown
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Natdog-6ix9ine/nav)
```

### 部署流程

1. 点击Deploy按钮
2. 授权GitHub访问
3. 授权Cloudflare账号
4. 系统自动:
   - Fork仓库(可选)
   - 创建KV命名空间
   - 部署Worker
   - 配置环境变量
5. 获得访问地址

## 🔐 配置GitHub Secrets(用于CI/CD)

如果要启用GitHub Actions自动部署,需要配置Secrets:

1. 访问仓库的 `Settings` → `Secrets and variables` → `Actions`
2. 添加以下Secrets:

### CLOUDFLARE_API_TOKEN

获取API Token:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击右上角头像 → `My Profile`
3. 选择 `API Tokens`
4. 点击 `Create Token`
5. 使用 "Edit Cloudflare Workers" 模板
6. 复制生成的Token

### CLOUDFLARE_ACCOUNT_ID

获取Account ID:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择任意域名
3. 在右侧边栏找到 `Account ID`
4. 复制Account ID

## 📝 更新项目

### 本地修改后推送

```bash
git add .
git commit -m "Update: 描述你的修改"
git push
```

GitHub Actions会自动触发部署。

### 查看部署状态

访问仓库的 `Actions` 标签页,查看最新的工作流运行状态。

## 🎯 最佳实践

### 1. 保护主分支

在仓库设置中启用分支保护:
- `Settings` → `Branches` → `Add rule`
- 勾选 "Require pull request reviews before merging"

### 2. 使用Issues和Projects

利用GitHub的项目管理功能:
- Issues: 跟踪Bug和功能请求
- Projects: 管理开发进度
- Discussions: 社区讨论

### 3. 添加许可证

在仓库中添加LICENSE文件,推荐使用MIT License。

### 4. 完善README

确保README.md包含:
- ✅ 项目简介
- ✅ Deploy按钮
- ✅ 功能特性
- ✅ 使用说明
- ✅ 部署指南
- ✅ 贡献指南

## 🔄 同步Fork的仓库

如果用户通过Deploy按钮Fork了你的仓库,他们可以这样同步更新:

```bash
# 添加上游仓库
git remote add upstream git@github.com:Natdog-6ix9ine/nav.git

# 获取上游更新
git fetch upstream

# 合并更新
git merge upstream/main

# 推送到自己的仓库
git push origin main
```

## 📊 监控部署

### Cloudflare Workers Analytics

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 `Workers & Pages`
3. 选择你的Worker
4. 查看 `Analytics` 标签

### GitHub Actions日志

1. 访问仓库的 `Actions` 标签
2. 点击具体的工作流运行
3. 查看详细日志

## ⚠️ 注意事项

1. **私有仓库**: Deploy按钮通常需要公开仓库
2. **敏感信息**: 不要在代码中包含API密钥等敏感信息
3. **KV数据**: KV命名空间的数据不会随代码更新而改变
4. **环境变量**: 使用GitHub Secrets管理敏感配置

## 🆘 常见问题

**Q: Deploy按钮点击后没反应?**
A: 检查仓库是否公开,deploy-button.json配置是否正确。

**Q: GitHub Actions部署失败?**
A: 检查Secrets是否正确配置,Token权限是否足够。

**Q: 如何回滚到旧版本?**
A: 在Cloudflare Dashboard中可以查看和回滚Worker的历史版本。

**Q: 可以自定义Deploy按钮的域名吗?**
A: 不可以,Deploy按钮会分配workers.dev子域名,需要在部署后手动添加自定义域名。

## 📚 相关文档

- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Wrangler CLI文档](https://developers.cloudflare.com/workers/wrangler/)

---

**祝您使用愉快!** 🎉