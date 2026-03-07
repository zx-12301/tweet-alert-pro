# 📋 功能配置清单 - 让所有功能真实可用

**创建时间**: 2026-03-06 21:15  
**重要级别**: 🔴 必须配置

---

## 🎯 配置目标

确保所有功能**真实可行**，不是"假操作"：

- ✅ Twitter 监控 - 真实调用 Twitter API
- ✅ 语音电话通知 - 真实拨打电话
- ✅ 邮件通知 - 真实发送邮件
- ✅ 飞书消息 - 真实发送消息
- ✅ 钉钉消息 - 真实发送消息
- ✅ 企业微信 - 真实发送消息

---

## 📊 当前状态

| 功能 | 代码实现 | 需要配置 | 状态 |
|------|---------|---------|------|
| Twitter 监控 | ✅ 完成 | 🔴 Twitter API | 待配置 |
| 语音电话 | ✅ 完成 | 🔴 Twilio | 待配置 |
| 邮件通知 | ✅ 完成 | 🔴 SMTP | 待配置 |
| 飞书消息 | ✅ 完成 | 🔵 飞书 Webhook | 待配置 |
| 钉钉消息 | ✅ 完成 | 🔵 钉钉 Webhook | 待配置 |
| 企业微信 | ✅ 完成 | 🔵 企业微信 Webhook | 待配置 |

**图例**:
- 🔴 必须配置（核心功能）
- 🔵 可选配置（按需配置）

---

## 🔧 配置步骤

### 第一步：配置 Twitter API（必须）

**用途**: 监控 Twitter 用户推文

#### 1. 申请开发者账号
1. 访问 https://developer.twitter.com/
2. 点击 **Apply for a developer account**
3. 选择 **Hobby**（免费，每月 1500 条推文）
4. 填写申请信息（英文）

#### 2. 创建项目和应用
1. 登录后访问 https://developer.twitter.com/en/portal/dashboard
2. 点击 **Create a project**
3. 填写：
   - **Project name**: Tweet Alert Pro
   - **Description**: Twitter monitoring and notification system
   - **Use case**: Monitor specific users and send notifications

#### 3. 获取 API 凭证
1. 进入项目 → **Keys, tokens, and OAuth 2.0 Bearer Token**
2. 生成以下 4 个凭证：
   - **API Key** (Consumer Key)
   - **API Key Secret** (Consumer Secret)
   - **Access Token**
   - **Access Token Secret**

#### 4. 配置到系统
访问 http://localhost:3000/settings
- 点击 **Twitter API** 选项卡
- 填写 4 个凭证
- 点击 **保存配置**

**预计时间**: 15-30 分钟（包括审批）

---

### 第二步：配置 Twilio 电话通知（必须）

**用途**: 拨打语音电话通知新推文

#### 1. 注册 Twilio
1. 访问 https://www.twilio.com/try-twilio
2. 注册账号（免费试用 $15 额度）
3. 验证邮箱和手机号

#### 2. 获取凭证
1. 登录 https://console.twilio.com/
2. 在 Dashboard 找到：
   - **Account SID**: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - **Auth Token**: 点击 "Show" 查看

#### 3. 获取电话号码
1. 访问 https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. 点击 **Get a trial number**
3. 选择一个号码（免费）
4. 记录号码格式：+1234567890

#### 4. 配置到系统
访问 http://localhost:3000/settings
- 点击 **语音电话** 选项卡
- 填写：
  - Account SID
  - Auth Token
  - 电话号码
- 点击 **保存配置**

**预计时间**: 10 分钟

**测试**: 创建监控任务，等待新推文，会接到语音电话

---

### 第三步：配置邮件通知（必须）

**用途**: 发送邮件通知新推文

#### 方案 A: 使用 Gmail（推荐）

1. **启用 SMTP**
   - 登录 Gmail
   - 访问 https://myaccount.google.com/apppasswords
   - 生成应用专用密码
   - 记录密码

2. **配置参数**
   ```
   SMTP 服务器：smtp.gmail.com
   端口：587
   用户名：your-email@gmail.com
   密码：应用专用密码
   发件人：your-email@gmail.com
   ```

#### 方案 B: 使用 163 邮箱

1. **启用 SMTP**
   - 登录 163 邮箱
   - 设置 → POP3/SMTP/IMAP
   - 开启 SMTP 服务
   - 获取授权码

2. **配置参数**
   ```
   SMTP 服务器：smtp.163.com
   端口：587
   用户名：your-email@163.com
   密码：授权码
   发件人：your-email@163.com
   ```

#### 方案 C: 使用 SendGrid（专业）

1. 注册 https://sendgrid.com/
2. 创建 API Key
3. 配置参数：
   ```
   SMTP 服务器：smtp.sendgrid.net
   端口：587
   用户名：apikey
   密码：你的 API Key
   ```

#### 配置到系统
访问 http://localhost:3000/settings
- 点击 **邮件服务** 选项卡
- 填写 SMTP 配置
- 点击 **测试邮件发送**
- 点击 **保存配置**

**预计时间**: 5-10 分钟

---

### 第四步：配置飞书机器人（可选）

**用途**: 发送消息到飞书群聊

#### 1. 创建机器人
1. 打开飞书群聊
2. 点击右上角 **...**
3. 选择 **添加机器人**
4. 点击 **自定义机器人**
5. 填写：
   - **名称**: Tweet Alert
   - **描述**: Twitter 监控通知

#### 2. 获取 Webhook URL
1. 创建后复制 Webhook URL
2. 格式：`https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx`

#### 3. 配置到系统
访问 http://localhost:3000/tasks/create
- 展开 **高级选项**
- 勾选 **微信/钉钉通知**
- 填写飞书 Webhook URL
- 创建任务

**预计时间**: 2 分钟

**测试**: 新推文会发送到飞书群

---

### 第五步：配置钉钉机器人（可选）

**用途**: 发送消息到钉钉群聊

#### 1. 创建机器人
1. 打开钉钉群聊
2. 点击右上角 **...**
3. 选择 **智能群助手** → **添加机器人**
4. 选择 **自定义**
5. 填写：
   - **机器人名字**: Tweet Alert
   - 勾选 **加签**（记住密钥）

#### 2. 获取 Webhook URL
1. 复制 Webhook URL
2. 格式：`https://oapi.dingtalk.com/robot/send?access_token=xxx`

#### 3. 配置到系统
访问 http://localhost:3000/tasks/create
- 展开 **高级选项**
- 勾选 **微信/钉钉通知**
- 填写钉钉 Webhook URL
- 创建任务

**预计时间**: 3 分钟

---

### 第六步：配置企业微信机器人（可选）

**用途**: 发送消息到企业微信群

#### 1. 创建机器人
1. 打开企业微信群
2. 点击右上角 **...**
3. 选择 **添加群机器人**
4. 点击 **新建**
5. 填写：
   - **机器人名称**: Tweet Alert

#### 2. 获取 Webhook URL
1. 复制 Webhook URL
2. 格式：`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx`

#### 3. 配置到系统
同飞书/钉钉配置方式

**预计时间**: 2 分钟

---

## ✅ 配置完成检查清单

完成配置后，检查以下项目：

### 基础配置（必须）
- [ ] Twitter API 已配置
- [ ] Twilio 已配置
- [ ] SMTP 邮件已配置

### 通知渠道（可选）
- [ ] 飞书 Webhook 已配置
- [ ] 钉钉 Webhook 已配置
- [ ] 企业微信 Webhook 已配置

### 功能测试
- [ ] 创建监控任务成功
- [ ] 收到语音电话通知
- [ ] 收到邮件通知
- [ ] 收到飞书/钉钉消息

---

## 🧪 完整测试流程

### 1. 创建测试任务
1. 访问 http://localhost:3000/tasks/create
2. 填写：
   - Twitter 账号：@elonmusk
   - 关键词：留空（监控所有）
   - 勾选所有通知方式
   - 填写手机号、邮箱、Webhook
3. 点击 **创建监控任务**

### 2. 等待监控
- 系统每 5 分钟检查一次
- 等待 @elonmusk 发新推文

### 3. 验证通知
检查是否收到：
- 📞 语音电话
- 📧 邮件
- 💬 飞书/钉钉消息

### 4. 查看记录
访问 http://localhost:3000/notifications
- 查看通知历史
- 检查发送状态

---

## ⚠️ 常见问题

### Q1: Twitter API 申请被拒？
**A**: 重新申请，详细描述用途。或使用免费额度。

### Q2: Twilio 电话打不通？
**A**: 试用账号只能拨打验证过的号码。在 Twilio 控制台验证你的手机号。

### Q3: 邮件发送失败？
**A**: 检查 SMTP 配置，确保开启了 SMTP 服务。Gmail 需要使用应用专用密码。

### Q4: 飞书/钉钉收不到消息？
**A**: 检查 Webhook URL 是否正确，机器人是否启用了。

---

## 📞 需要帮助？

配置过程中遇到问题：
1. 查看后端日志（终端输出）
2. 查看浏览器控制台（F12）
3. 检查配置是否正确
4. 确认 API 额度是否用完

---

**完成以上配置后，所有功能都将真实可用！** 🎉
