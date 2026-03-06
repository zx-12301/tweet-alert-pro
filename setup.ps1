# Tweet Alert Pro - 快速启动脚本

Write-Host "🚀 正在安装依赖..." -ForegroundColor Green

# 安装根依赖
npm install

Write-Host "`n📦 正在安装 API 依赖..." -ForegroundColor Green
Set-Location apps/api
npm install

Write-Host "`n🎨 正在安装 Web 依赖..." -ForegroundColor Green
Set-Location ../web
npm install

Write-Host "`n🗄️ 正在初始化数据库..." -ForegroundColor Green
Set-Location ../../packages/database
npx prisma generate

Write-Host "`n✅ 安装完成！" -ForegroundColor Green
Write-Host "`n运行以下命令启动开发服务器:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host "`n或者分别启动:" -ForegroundColor Yellow
Write-Host "  cd apps/api && npm run dev  # 后端 (3001)" -ForegroundColor Cyan
Write-Host "  cd apps/web && npm run dev   # 前端 (3000)" -ForegroundColor Cyan
