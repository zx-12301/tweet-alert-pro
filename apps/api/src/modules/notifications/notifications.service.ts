import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendNotification(job: {
    notificationId: string;
    channels: any;
    phoneNumbers: string[];
    webhooks: string[];
    tweet: any;
  }) {
    const { notificationId, channels, phoneNumbers, webhooks, tweet } = job;

    if (channels?.phone && phoneNumbers?.length > 0) {
      for (const phone of phoneNumbers) {
        await this.sendVoiceCall(phone, tweet);
      }
    }

    if (channels?.wechat && webhooks?.length > 0) {
      for (const webhook of webhooks) {
        await this.sendWebhook(webhook, tweet);
      }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'sent' },
    });

    this.logger.log(`通知已发送：${notificationId}`);
  }

  private async sendVoiceCall(phoneNumber: string, tweet: any) {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioAccountSid || !twilioAuthToken) {
      this.logger.warn('Twilio 未配置，跳过语音通知');
      return;
    }

    const ttsMessage = `您关注的用户 ${tweet.author} 发布了新推文：${tweet.text.substring(0, 50)}。详情请点击链接查看。`;

    try {
      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`,
        new URLSearchParams({
          To: phoneNumber,
          From: twilioPhone || '+1234567890',
          Twiml: `<Response><Say voice="alice" language="zh-CN">${ttsMessage}</Say></Response>`,
        }),
        {
          auth: { username: twilioAccountSid, password: twilioAuthToken },
        },
      );
      this.logger.log(`语音电话已发送到 ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`发送语音电话失败：${error.message}`);
    }
  }

  private async sendWebhook(webhookUrl: string, tweet: any) {
    const message = {
      msgtype: 'text',
      text: {
        content: `🔔 新推文提醒\n\n作者：${tweet.author}\n内容：${tweet.text}\n\n查看详情：${tweet.url}`,
      },
    };

    try {
      await axios.post(webhookUrl, message);
      this.logger.log(`Webhook 已发送到 ${webhookUrl}`);
    } catch (error) {
      this.logger.error(`发送 Webhook 失败：${error.message}`);
    }
  }
}
