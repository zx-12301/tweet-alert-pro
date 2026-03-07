@echo off
echo ========================================
echo Tweet Alert Pro - 服务启动脚本
echo ========================================
echo.

echo [1/3] 停止所有 Node 进程...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo [2/3] 生成 Prisma 客户端...
cd /d "%~dp0packages\database"
npx prisma generate
if errorlevel 1 (
    echo ❌ Prisma 生成失败
    pause
    exit /b 1
)

echo [3/3] 启动后端服务...
cd /d "%~dp0apps\api"
start "Tweet Alert API" npm run dev

echo.
echo ========================================
echo ✅ 后端服务已启动！
echo API 地址：http://localhost:3001
echo ========================================
echo.
echo 现在启动前端服务...
cd /d "%~dp0apps\web"
start "Tweet Alert Web" npm run dev

echo.
echo ========================================
echo ✅ 所有服务已启动！
echo 前端地址：http://localhost:3000
echo API 地址：http://localhost:3001
echo ========================================
echo.
pause
