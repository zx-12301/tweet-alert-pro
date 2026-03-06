# Tweet Alert Pro - 推文哨兵

Twitter 监控通知系统 - 当关注的用户发推时自动通知你

## 功能特性

- 🔔 **实时通知** - 每 5 分钟检测一次，不错过任何重要推文
- 📱 **多渠道通知** - 支持语音电话、微信、钉钉、邮件
- 🎯 **智能过滤** - 关键词、点赞数、转发数多维度过滤
- 💳 **订阅系统** - 免费版/专业版/企业版

## 技术栈

- **前端**: Next.js 14 + Tailwind CSS
- **后端**: NestJS + TypeScript
- **数据库**: PostgreSQL (Prisma ORM)
- **任务调度**: NestJS Schedule (Cron)
- **Twitter API**: twitter-api-v2

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写配置：

```bash
cd apps/api
cp .env.example .env
```

编辑 `.env` 文件，填写：
- 数据库连接字符串
- Twitter API 凭证
- Twilio 配置（用于语音通知）

### 3. 初始化数据库

```bash
cd packages/database
npx prisma migrate dev
npx prisma generate
```

### 4. 启动开发服务

```bash
# 根目录运行
npm run dev
```

这将同时启动：
- 前端：http://localhost:3000
- 后端：http://localhost:3001

## 项目结构

```
tweet-alert-pro/
├── apps/
│   ├── web/          # Next.js 前端
│   └── api/          # NestJS 后端
├── packages/
│   └── database/     # Prisma 数据库
└── package.json
```

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户

### 任务管理
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `GET /api/tasks/:id` - 获取任务详情
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 订阅
- `GET /api/billing/subscription` - 获取订阅
- `POST /api/billing/subscribe` - 订阅计划

## 部署

### Docker 部署

```bash
docker-compose up -d
```

### Vercel + Railway

1. 前端部署到 Vercel
2. 后端部署到 Railway
3. 数据库使用 Supabase

## 开发路线图

- [ ] 用户认证系统
- [ ] Twitter OAuth 登录
- [ ] 实时 Streaming API
- [ ] 支付集成（Stripe/支付宝）
- [ ] 数据可视化仪表盘
- [ ] 移动端适配

## License

MIT
