# 🐦 Twitter API 配置指南

**更新时间**: 2026-03-06 21:05

---

## ✅ 已完成的更新

### 1. 监控服务升级
- ✅ 集成真实的 Twitter API v2
- ✅ 每 5 分钟自动检查新推文
- ✅ 支持关键词过滤
- ✅ 支持点赞数/转发数过滤
- ✅ 自动发送通知（语音/邮件/Webhook）

### 2. 依赖安装
- ✅ 安装 `twitter-api-v2` 包
- ✅ 支持 Twitter API v2 所有功能

---

## ⚠️ 当前状态

**监控服务现在是真实的**，但需要配置 Twitter API 才能正常工作。

### 未配置时的行为
```
⚠️ 未配置 Twitter API，跳过 @username 的检查
💡 请在 功能配置 页面配置 Twitter API，或在 .env 文件中设置环境变量
```

### 已配置时的行为
```
🔍 开始检查所有监控任务...
📊 共有 6 个活跃任务
📝 检查 @elonmusk 的新推文...
🎉 @elonmusk 有 3 条新推文
📬 创建通知：xxx
✅ 推文 xxx 处理完成
```

---

## 🔑 获取 Twitter API 凭证

### 步骤 1: 申请 Twitter 开发者账号

1. 访问 https://developer.twitter.com/
2. 点击 **Apply for a developer account**
3. 选择账户类型：
   - **Hobby** - 个人使用（免费，有限制）
   - **Pro** - 专业使用（付费）
   - **Enterprise** - 企业使用

### 步骤 2: 创建项目和应用

1. 登录后访问 https://developer.twitter.com/en/portal/dashboard
2. 点击 **Create a project**
3. 填写项目信息：
   - **Project name**: Tweet Alert Pro
   - **Description**: Twitter 监控通知系统
   - **Use case**: 监控特定用户的推文并发送通知

### 步骤 3: 获取 API 凭证

1. 进入项目页面
2. 点击 **Keys, tokens, and OAuth 2.0 Bearer Token**
3. 生成以下凭证：
   - **API Key** (Consumer Key)
   - **API Key Secret** (Consumer Secret)
   - **Access Token**
   - **Access Token Secret**

### 步骤 4: 配置权限

确保你的应用有读取权限：
- **App permissions**: Read and Write
- **Type of App**: Web App, Automated App or Bot

---

## 🔧 配置方法

### 方法 1: 在功能配置页面配置（推荐）

1. 访问 http://localhost:3000/settings
2. 点击 **Twitter API** 选项卡
3. 填写以下信息：
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret
4. 点击 **保存配置**

### 方法 2: 在 .env 文件配置

编辑 `apps/api/.env` 文件：

```env
# Twitter API v2
TWITTER_API_KEY=你的 API_Key
TWITTER_API_SECRET=你的 API_Secret
TWITTER_ACCESS_TOKEN=你的 Access_Token
TWITTER_ACCESS_SECRET=你的 Access_Secret
```

---

## 📊 Twitter API 限制

### 免费版（Hobby）
- **发推**: 1 条/天
- **读推**: 1,500 条/月
- **用户时间线**: 300 请求/15 分钟

### 专业版（Pro）
- **发推**: 无限制
- **读推**: 2,000,000 条/月
- **用户时间线**: 900 请求/15 分钟

### 企业版（Enterprise）
- 联系 Twitter 获取定制方案

---

## 🧪 测试监控

### 1. 配置 Twitter API 后

访问 http://localhost:3000/dashboard 查看控制台日志

### 2. 查看日志输出

```bash
# 后端日志会显示：
🔍 开始检查所有监控任务...
📊 共有 2 个活跃任务
📝 检查 @elonmusk 的新推文...
✅ @elonmusk 没有新推文
```

### 3. 创建测试任务

1. 访问 http://localhost:3000/tasks/create
2. 输入一个活跃的 Twitter 账号（如 @elonmusk）
3. 等待 5 分钟
4. 查看通知历史

---

## 🔍 故障排查

### 问题 1: 提示未配置 Twitter API
**解决**: 确保已在设置页面配置或 .env 文件中有值

### 问题 2: Twitter API 调用失败
**解决**: 
- 检查 API 凭证是否正确
- 确认应用权限是 Read and Write
- 查看是否超出 API 限额

### 问题 3: 监控任务不更新
**解决**:
- 检查任务是否激活（isActive: true）
- 查看后端日志是否有错误
- 确认 Cron 任务正常运行

---

## 💡 替代方案

如果无法获取 Twitter API，可以考虑：

### 1. 使用 RSS 订阅
某些 Twitter 账号支持 RSS（已停用）

### 2. 使用第三方服务
- IFTTT
- Zapier
- Make (Integromat)

### 3. 使用 Nitter
https://nitter.net/ 的 RSS 订阅（无需 API）

---

## 📝 监控逻辑说明

### 检查流程
```
每 5 分钟触发
    ↓
获取活跃任务列表
    ↓
对每个任务：
    - 检查 API 配置
    - 调用 Twitter API 获取新推文
    - 应用过滤规则
    - 创建通知记录
    - 发送通知
    - 更新任务状态
```

### 过滤规则
1. **关键词** - 只通知包含特定词的推文
2. **最小点赞数** - 只通知点赞数达到阈值的推文
3. **最小转发数** - 只通知转发数达到阈值的推文

---

**现在监控是真实的了！配置 Twitter API 后即可开始监控！** 🎉
