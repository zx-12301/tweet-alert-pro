# 🚀 Tweet Alert Pro - 一键上传到 GitHub

## 自动上传脚本

打开 **PowerShell**，执行以下命令：

```powershell
# 1. 刷新 PATH（让 gh 命令可用）
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 2. 登录 GitHub（会打开浏览器）
gh auth login

# 3. 进入项目目录
cd C:\Users\17816\Desktop\tweet-alert-pro

# 4. 创建并推送仓库
gh repo create tweet-alert-pro --public --source=. --remote=origin --push
```

---

## 详细步骤

### 步骤 1: 登录 GitHub
```powershell
gh auth login
```
执行后会：
1. 自动打开浏览器
2. 登录你的 GitHub 账号
3. 授权 GitHub CLI
4. 返回 PowerShell 继续

### 步骤 2: 创建仓库
```powershell
gh repo create tweet-alert-pro --public --source=. --remote=origin --push
```

**选项说明**:
- `--public`: 公开仓库（任何人都可以看到）
- `--private`: 私有仓库（只有你可以看到）
- `--source=.`: 使用当前目录作为源码
- `--remote=origin`: 设置远程仓库名为 origin
- `--push`: 自动推送代码

---

## 手动方式（如果自动方式失败）

### 1. 在 GitHub 创建仓库
1. 访问 https://github.com/new
2. Repository name: `tweet-alert-pro`
3. Description: `Twitter 监控通知系统 - 实时监控 Twitter 账号，多渠道自动通知`
4. 选择 Public 或 Private
5. **不要** 勾选 "Add a README file"
6. 点击 **Create repository**

### 2. 关联并推送
```powershell
# 刷新 PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 进入项目
cd C:\Users\17816\Desktop\tweet-alert-pro

# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/tweet-alert-pro.git

# 推送
git branch -M main
git push -u origin main
```

---

## 验证上传

访问：https://github.com/YOUR_USERNAME/tweet-alert-pro

应该能看到：
- ✅ 所有源代码文件
- ✅ README.md
- ✅ 项目文档

---

## 常见问题

### Q: gh auth login 后没有反应？
A: 手动访问 https://github.com/login/device
输入终端显示的 8 位代码

### Q: 提示仓库已存在？
A: 使用不同的仓库名称，或者：
```powershell
gh repo delete YOUR_USERNAME/tweet-alert-pro
gh repo create tweet-alert-pro --public --source=. --remote=origin --push
```

### Q: 推送失败？
A: 检查网络连接，或者使用手动方式

---

## 仓库信息建议

| 项目 | 值 |
|------|-----|
| **名称** | `tweet-alert-pro` |
| **描述** | Twitter 监控通知系统 - 实时监控 Twitter 账号动态，支持语音电话、邮件、微信等多种通知方式 |
| **可见性** | Public 或 Private |
| **标签** | twitter, monitoring, nestjs, nextjs, typescript, notifications |

---

**准备好了吗？复制上面的命令开始上传！** 🚀
