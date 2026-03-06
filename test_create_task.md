# 测试创建监控任务 API

**测试时间**: 2026-03-06 15:59

## 测试结果

### ✅ 后端 API 正常
```
POST http://localhost:3001/api/tasks
Headers: x-user-id: 4c590dec-2c16-44b9-8291-8855cecc824f
Body: {
  "twitterHandle": "test123",
  "keywords": [],
  "notifyChannels": {"phone":false,"wechat":false,"email":false}
}

响应：✅ 创建成功
ID: 6b69a6f7-df87-4374-8fc5-b5a99dac8b83
```

### ✅ 服务状态
```
后端 API: http://localhost:3001 🟢 运行中
前端 Web: http://localhost:3000 🟢 运行中
```

## 创建任务步骤

1. 访问 http://localhost:3000/tasks/create
2. 输入 Twitter 账号（必需）
   - 格式：@username 或 username
3. 可选配置：
   - 关键词过滤（逗号分隔）
   - 最小点赞数
   - 最小转发数
4. 展开"高级选项"配置通知：
   - 语音电话：输入手机号
   - 邮件通知：输入邮箱
   - 微信/钉钉：输入 Webhook URL
5. 点击"创建监控任务"

## 注意事项

1. **Twitter 账号必填** - 不支持空值
2. **号码格式** - 手机号用 +86 开头
3. **多个值** - 用逗号分隔（如：AI, Tesla, SpaceX）
4. **通知配置** - 需要先在 /settings 配置对应服务

## 常见问题

### 问题 1: 点击创建没反应
**原因**: 后端未启动  
**解决**: 确保后端 API 在运行 (http://localhost:3001)

### 问题 2: 创建失败提示错误
**原因**: 数据格式不对  
**解决**: 检查 Twitter 账号是否填写

### 问题 3: 创建后仪表盘没显示
**原因**: 页面未刷新  
**解决**: 点击仪表盘的"刷新"按钮或等待自动刷新
