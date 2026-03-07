# Tweet Alert Pro - 微信小程序

推文哨兵微信小程序版本，与 Web 版共享后端 API 服务。

## 📁 项目结构

```
apps/miniprogram/
├── pages/
│   ├── index/           # 首页
│   ├── tasks/           # 任务管理
│   │   ├── list.js      # 任务列表
│   │   └── create.js    # 创建任务
│   ├── subscription/    # 订阅管理
│   └── settings/        # 设置
├── components/          # 自定义组件
├── utils/              # 工具函数
├── images/             # 图片资源
├── app.js              # 小程序入口
├── app.json            # 小程序配置
├── app.wxss            # 全局样式
└── project.config.json # 项目配置
```

## 🚀 快速开始

### 1. 安装微信开发者工具

下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 项目目录：`C:\Users\17816\Desktop\tweet-alert-pro\apps\miniprogram`
4. 填写 AppID（测试可选"测试号"）
5. 点击"导入"

### 3. 配置后端 API

在 `app.js` 中修改 API 地址：

```javascript
globalData: {
  apiBaseUrl: 'http://localhost:3001/api',  // 开发环境
  // 生产环境改为实际域名
  // apiBaseUrl: 'https://your-domain.com/api'
}
```

### 4. 配置后端 CORS

确保后端 API 允许小程序跨域访问，在 NestJS 中添加：

```typescript
// main.ts
app.enableCors({
  origin: true,  // 允许所有来源（生产环境应指定具体域名）
  credentials: true,
});
```

## 📱 功能特性

### 首页
- ✅ 统计卡片（任务数、通知数）
- ✅ 快捷操作入口
- ✅ 最近通知列表

### 任务管理
- ✅ 任务列表展示
- ✅ 创建监控任务
- ✅ 删除任务
- ✅ 任务状态显示

### 订阅管理
- ✅ 当前计划展示
- ✅ 用量统计
- ✅ 升级/取消订阅

### 设置
- ✅ API 地址配置
- ✅ 用户信息
- ✅ 关于页面

## 🔗 与 Web 版对比

| 功能 | Web 版 | 小程序版 |
|------|--------|----------|
| 任务管理 | ✅ | ✅ |
| 订阅管理 | ✅ | ✅ |
| 功能配置 | ✅ | ⏳ 简化版 |
| 通知历史 | ✅ | ⏳ 开发中 |
| 支付功能 | ✅ | ⏳ 待接入 |

## 🎨 UI 设计

- 采用蓝色主题（#2563eb）
- 卡片式布局
- 渐变效果
- 响应式设计

## 📝 注意事项

### 开发环境
1. 小程序要求 HTTPS，开发时可关闭校验
2. 本地调试需关闭"不校验合法域名"
3. 真机调试需使用实际 IP 地址

### 生产环境
1. 必须使用 HTTPS
2. 配置合法域名白名单
3. 使用正式 AppID
4. 提交代码审核

## 🔧 后端共享

小程序与 Web 版共享同一后端服务：

- **API 地址**: `http://localhost:3001/api`
- **用户认证**: 使用 `x-user-id` 请求头
- **数据同步**: 实时同步

## 📦 扩展开发

### 添加新页面

1. 在 `pages/` 下创建新文件夹
2. 创建 `.wxml`, `.js`, `.wxss` 文件
3. 在 `app.json` 的 `pages` 数组中添加路径
4. 如需要添加到 tabBar，在 `tabBar.list` 中添加

### 调用 API

使用全局 request 方法：

```javascript
const app = getApp();

// GET 请求
const data = await app.request({
  url: '/tasks'
});

// POST 请求
const result = await app.request({
  url: '/tasks',
  method: 'POST',
  data: { /* ... */ }
});
```

## 🐛 常见问题

### Q: 真机调试无法连接本地 API？
A: 使用电脑 IP 地址替代 localhost，如 `http://192.168.1.100:3001/api`

### Q: 如何测试支付功能？
A: 小程序支付需要企业认证，开发阶段可模拟或使用 Web 版

### Q: 如何获取用户信息？
A: 使用 `wx.getUserProfile` API（需要用户授权）

## 📄 License

MIT

---

*推文哨兵小程序 · 2026*
