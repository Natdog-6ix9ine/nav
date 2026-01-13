@echo off
REM 书签导航一键部署脚本 - Windows版本

setlocal enabledelayedexpansion

echo.
echo 🚀 书签导航一键部署脚本
echo ========================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未安装 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未安装 npm
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo ✅ npm 已安装
echo.

REM 安装依赖
echo 📦 安装项目依赖...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

REM 登录 Cloudflare
echo 🔐 登录 Cloudflare...
echo 浏览器将打开以完成授权...
call npx wrangler login
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Cloudflare 登录失败
    pause
    exit /b 1
)
echo ✅ Cloudflare 登录成功
echo.

REM 创建 KV 命名空间
echo 💾 创建 KV 命名空间...
call npx wrangler kv:namespace create "BOOKMARKS" > kv_output.txt 2>&1
type kv_output.txt

REM 提取 KV ID (简化版本，可能需要手动)
echo.
echo ⚠️  请记录上面输出的 KV 命名空间 ID
echo.
set /p KV_ID="请输入 KV 命名空间 ID: "

if "%KV_ID%"=="" (
    echo ❌ 错误: 未输入 KV ID
    del kv_output.txt
    pause
    exit /b 1
)

REM 更新 wrangler.toml
echo 📝 更新配置文件...
powershell -Command "(Get-Content wrangler.toml) -replace 'id = \"your-kv-namespace-id\"', 'id = \"%KV_ID%\"' | Set-Content wrangler.toml"
echo ✅ 配置文件已更新
echo.

REM 部署到 Cloudflare Workers
echo 🚀 部署到 Cloudflare Workers...
call npm run deploy > deploy_output.txt 2>&1
type deploy_output.txt

REM 提取 Worker URL (简化版本)
for /f "tokens=*" %%a in ('findstr /r "https://.*workers.dev" deploy_output.txt') do (
    set WORKER_URL=%%a
    goto :found
)
:found

echo.
echo ========================
echo 🎉 部署成功!
echo ========================
echo.
echo 📍 访问地址:
if not "%WORKER_URL%"=="" (
    echo    前台导航: %WORKER_URL%
    echo    后台管理: %WORKER_URL%/admin
) else (
    echo    请检查上面的部署输出获取访问地址
)
echo.
echo 🔐 默认密码: admin
echo.
echo ⚠️  重要提醒:
echo    1. 请立即登录后台修改默认密码
echo    2. 首次使用需要在后台添加分类和书签
echo    3. 可以从浏览器导入HTML书签文件
echo.
echo 📖 更多信息请查看:
echo    - README.md: 完整使用指南
echo    - DEPLOYMENT.md: 详细部署说明
echo.

REM 清理临时文件
del kv_output.txt deploy_output.txt 2>nul

pause