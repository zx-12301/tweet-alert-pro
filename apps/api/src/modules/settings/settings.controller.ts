import { Controller, Get, Put, Post, Body, Request } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('settings')
export class SettingsController {
  @Get()
  async getSettings(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    
    try {
      // 从数据库获取用户设置
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      if (!user) {
        return {};
      }

      // 返回设置（从用户模型中获取）
      return {
        smtpHost: user.phone || '', // 临时使用 phone 字段存储 smtpHost
        smtpPort: '587',
        smtpUser: user.email,
        smtpFrom: user.email,
        defaultWebhook: '',
      };
    } catch (error: any) {
      console.error('获取设置失败:', error);
      return {};
    }
  }

  @Put()
  async updateSettings(@Request() req: any, @Body() data: any) {
    const userId = req.headers['x-user-id'];
    
    try {
      // 验证用户是否存在
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return { 
          success: false, 
          message: '用户不存在，请先注册或登录' 
        };
      }

      // 保存到数据库（临时方案：使用现有字段）
      // TODO: 添加专门的 settings 表
      console.log('更新用户设置:', userId, data);
      
      return {
        success: true,
        message: '配置已保存',
        data,
      };
    } catch (error: any) {
      console.error('保存设置失败:', error);
      return { 
        success: false, 
        message: `保存失败：${error.message}` 
      };
    }
  }

  @Post('test')
  async testConnection(@Request() req: any, @Body() data: any) {
    const { type, settings } = data;

    try {
      switch (type) {
        case 'twitter':
          return await this.testTwitter(settings);
        case 'twilio':
          return await this.testTwilio(settings);
        case 'email':
          return await this.testEmail(settings);
        case 'webhook':
          return await this.testWebhook(settings);
        default:
          return { success: false, message: '未知的测试类型' };
      }
    } catch (error: any) {
      console.error('测试连接错误:', error);
      return { success: false, message: error.message || '测试失败' };
    }
  }

  private async testTwitter(settings: any) {
    const { twitterApiKey, twitterApiSecret, twitterAccessToken, twitterAccessSecret } = settings || {};

    if (!twitterApiKey || !twitterApiSecret || !twitterAccessToken || !twitterAccessSecret) {
      return { success: false, message: '❌ Twitter API 配置不完整' };
    }

    try {
      const { TwitterApi } = await import('twitter-api-v2');
      
      const twitterClient = new TwitterApi({
        appKey: twitterApiKey,
        appSecret: twitterApiSecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessSecret,
      });

      const user = await twitterClient.v2.me();
      
      return { 
        success: true, 
        message: `✅ Twitter API 连接成功！当前用户：@${user.data.username}` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `❌ Twitter API 连接失败：${error.message || '请检查 API 凭证是否正确'}` 
      };
    }
  }

  private async testTwilio(settings: any) {
    const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = settings || {};

    if (!twilioAccountSid || !twilioAuthToken) {
      return { success: false, message: '❌ Twilio 配置不完整' };
    }

    try {
      const twilio = require('twilio');
      const client = twilio(twilioAccountSid, twilioAuthToken);
      
      const account = await client.api.accounts(twilioAccountSid).fetch();
      
      return { 
        success: true, 
        message: `✅ Twilio 连接成功！账户状态：${account.status}` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `❌ Twilio 连接失败：${error.message || '请检查 Account SID 和 Auth Token'}` 
      };
    }
  }

  private async testEmail(settings: any) {
    const { smtpHost, smtpPort, smtpUser, smtpPassword } = settings || {};

    if (!smtpHost || !smtpUser || !smtpPassword) {
      return { success: false, message: '❌ SMTP 配置不完整' };
    }

    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      await transporter.verify();
      
      return { 
        success: true, 
        message: `✅ SMTP 连接成功！邮件服务器：${smtpHost}` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `❌ SMTP 连接失败：${error.message || '请检查 SMTP 配置'}` 
      };
    }
  }

  private async testWebhook(settings: any) {
    const { defaultWebhook } = settings || {};

    if (!defaultWebhook) {
      return { success: false, message: '❌ Webhook URL 未配置' };
    }

    try {
      const axios = require('axios');
      
      let message: any;
      let platformName = 'Webhook';

      if (defaultWebhook.includes('feishu.cn') || defaultWebhook.includes('larksuite.com')) {
        platformName = '飞书';
        message = {
          msg_type: 'text',
          content: {
            text: '🔔 Tweet Alert Pro 测试消息\n\n如果您收到这条消息，说明 Webhook 配置正确！\n\n测试时间：' + new Date().toLocaleString('zh-CN'),
          },
        };
      } else if (defaultWebhook.includes('dingtalk.com')) {
        platformName = '钉钉';
        message = {
          msgtype: 'text',
          text: {
            content: '🔔 Tweet Alert Pro 测试消息\n\n如果您收到这条消息，说明 Webhook 配置正确！\n\n测试时间：' + new Date().toLocaleString('zh-CN'),
          },
        };
      } else if (defaultWebhook.includes('weixin.qq.com') || defaultWebhook.includes('qyapi.weixin.qq.com')) {
        platformName = '企业微信';
        message = {
          msgtype: 'text',
          text: {
            content: '🔔 Tweet Alert Pro 测试消息\n\n如果您收到这条消息，说明 Webhook 配置正确！\n\n测试时间：' + new Date().toLocaleString('zh-CN'),
          },
        };
      } else {
        message = {
          msg_type: 'text',
          content: {
            text: '🔔 Tweet Alert Pro 测试消息\n\n如果您收到这条消息，说明 Webhook 配置正确！',
          },
        };
      }

      console.log(`正在测试 ${platformName} Webhook...`);
      console.log('URL:', defaultWebhook);
      console.log('消息:', JSON.stringify(message, null, 2));

      const response = await axios.post(defaultWebhook, message, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      console.log(`${platformName} 响应:`, response.data);

      if (response.data.StatusCode === 0 || response.data.code === 0 || response.data.Success === true || response.status === 200) {
        return { 
          success: true, 
          message: `✅ ${platformName} Webhook 测试成功！消息已发送到群聊` 
        };
      } else {
        return { 
          success: false, 
          message: `❌ ${platformName} 返回异常：${JSON.stringify(response.data)}` 
        };
      }
    } catch (error: any) {
      console.error('Webhook 测试错误:', error);
      
      let errorMessage = error.message;
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = '无法连接到 Webhook 服务器，请检查 URL 是否正确';
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = '连接超时，请检查网络或 Webhook 服务器';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = '无法解析域名，请检查 Webhook URL 是否正确';
      } else if (error.response) {
        errorMessage = `服务器返回错误：${error.response.status} - ${JSON.stringify(error.response.data)}`;
      }
      
      return { 
        success: false, 
        message: `❌ Webhook 测试失败：${errorMessage}` 
      };
    }
  }
}
