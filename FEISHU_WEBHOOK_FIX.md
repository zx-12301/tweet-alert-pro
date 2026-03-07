# 🔧 飞书 Webhook 测试修复说明

**更新时间**: 2026-03-06 22:45

---

## ✅ 已完成的修复

### 1. 后端代码优化
- ✅ 添加详细的日志输出
- ✅ 改进错误处理
- ✅ 自动检测 Webhook 类型（飞书/钉钉/企业微信）
- ✅ 使用正确的消息格式
- ✅ 添加超时设置（10 秒）
- ✅ 提供更详细的错误信息

### 2. 飞书 Webhook 格式
飞书机器人使用的消息格式：
```json
{
  "msg_type": "text",
  "content": {
    "text": "🔔 Tweet Alert Pro 测试消息\n\n如果您收到这条消息，说明 Webhook 配置正确！\n\n测试时间：2026/3/6 22:45:00"
  }
}
```

---

## 🔍 飞书 Webhook 测试步骤

### 方法 1: 在功能配置页面测试

1. 访问 http://localhost:3000/settings
2. 点击 **消息通知** 选项卡
3. 填写 **默认 Webhook URL**（飞书地址）
4. 点击 **测试 Webhook** 按钮
5. 查看测试结果

### 方法 2: 使用 curl 命令测试

```bash
curl -X POST "https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_WEBHOOK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "msg_type": "text",
    "content": {
      "text": "🔔 测试消息\n\n如果您收到这条消息，说明 Webhook 配置正确！"
    }
  }'
```

### 方法 3: 使用 PowerShell 测试

```powershell
$body = @{
    msg_type = "text"
    content = @{
        text = "🔔 测试消息"
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_TOKEN" -Method Post -ContentType "application/json" -Body $body
```

---

## ⚠️ 常见问题排查

### 问题 1: "Failed to fetch"
**原因**: 后端服务未启动或 Prisma 未初始化

**解决**:
```bash
# 1. 停止所有 node 进程
taskkill /F /IM node.exe

# 2. 重新生成 Prisma
cd C:\Users\17816\Desktop\tweet-alert-pro
npx prisma generate --schema=./packages/database/schema.prisma

# 3. 重启后端
cd apps/api
npm run dev
```

### 问题 2: Webhook URL 不正确
**检查**:
- URL 格式：`https://open.feishu.cn/open-apis/bot/v2/hook/xxxxx`
- 确保包含完整的 token
- 没有多余的空格或字符

### 问题 3: 飞书机器人未启用
**解决**:
1. 打开飞书群聊
2. 点击右上角 ... → 添加机器人
3. 确保机器人已启用
4. 重新复制 Webhook URL

### 问题 4: 网络问题
**检查**:
- 确保能访问 open.feishu.cn
- 检查防火墙设置
- 尝试使用手机热点测试

---

## 📊 飞书 Webhook 响应码

| StatusCode | 说明 |
|-----------|------|
| 0 | 成功 |
| 19001 | 无效的 token |
| 19002 | 消息格式错误 |
| 19003 | 机器人已禁用 |
| 19020 | 发送频率超限 |

---

## 🎯 正确的配置示例

### 飞书 Webhook URL
```
https://open.feishu.cn/open-apis/bot/v2/hook/7b5e11ae-3a84-4097-85a3-65aa4fcb2f84
```

### 测试消息内容
```
🔔 Tweet Alert Pro 测试消息

如果您收到这条消息，说明 Webhook 配置正确！

测试时间：2026/3/6 22:45:00
```

---

## 🔄 后端服务重启步骤

如果测试失败显示 "Failed to fetch"，请重启后端：

```powershell
# 1. 停止所有 node 进程
taskkill /F /IM node.exe

# 2. 进入项目目录
cd C:\Users\17816\Desktop\tweet-alert-pro

# 3. 重新生成 Prisma 客户端
npx prisma generate --schema=./packages/database/schema.prisma

# 4. 重启后端服务
cd apps/api
npm run dev

# 5. 等待编译完成
# 看到 "🚀 API 服务运行在 http://localhost:3001" 表示成功
```

---

## ✅ 验证修复

重启后端后，再次测试：

1. 访问 http://localhost:3000/settings
2. 点击 **消息通知** 选项卡
3. 点击 **测试 Webhook** 按钮
4. 查看飞书群聊是否收到测试消息

**成功响应**:
```
✅ 飞书 Webhook 测试成功！消息已发送到群聊
```

---

**修复完成后，飞书 Webhook 测试应该可以正常工作！** 🎉
