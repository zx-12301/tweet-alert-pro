# Git 自动提交脚本
# 用法：.\auto-commit.ps1 "提交信息"

param(
    [string]$message = "自动提交：代码更新"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$fullMessage = "$message ($timestamp)"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Tweet Alert Pro - Git 自动提交" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在 git 仓库中
if (-not (Test-Path ".git")) {
    Write-Host "❌ 错误：当前目录不是 Git 仓库" -ForegroundColor Red
    exit 1
}

# 添加所有变更
Write-Host "📦 添加文件变更..." -ForegroundColor Yellow
git add -A

# 检查是否有变更
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ 没有文件变更，跳过提交" -ForegroundColor Green
    exit 0
}

# 提交变更
Write-Host "💾 提交变更..." -ForegroundColor Yellow
git commit -m "$fullMessage"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ 提交成功！" -ForegroundColor Green
    Write-Host "   提交信息：$fullMessage" -ForegroundColor Gray
    
    # 询问是否推送
    Write-Host ""
    Write-Host "📤 推送到远程仓库..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 推送成功！" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 推送失败，请检查网络连接" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ 提交失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
