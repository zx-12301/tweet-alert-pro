import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  /**
   * 发送通知
   */
  async sendNotification(job: {
    notificationId: string;
    channels: any;
    phoneNumbers: string[];
    webhooks: string[];
    tweet: any;
  }) {
    const { notificationId, channels, phoneNumbers, webhooks, tweet } = job;

    const promises: Promise<void>[] = [];

    // 语音电话通知
    if (channels?.phone && phoneNumbers?.length > 0) {
      for (const phone of phoneNumbers) {
        promises.push(this.sendVoiceCall(phone, tweet, notificationId));
      }
    }

    // 邮件通知
    if (channels?.email) {
      promises.push(this.sendEmail(tweet, notificationId));
    }

    // Webhook 通知（钉钉/企业微信/飞书）
    if (channels?.wechat && webhooks?.length > 0) {
      for (const webhook of webhooks) {
        promises.push(this.sendWebhook(webhook, tweet, notificationId));
      }
    }

    // 等待所有通知完成
    await Promise.allSettled(promises);

    this.logger.log(`📬 通知 ${notificationId} 处理完成`);
  }

  /**
   * 发送语音电话（Twilio）
   */
  private async sendVoiceCall(
    phoneNumber: string,
    tweet: any,
    notificationId: string
  ): Promise<void> {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioAccountSid || !twilioAuthToken) {
      this.logger.warn('⚠️ Twilio 未配置，跳过语音电话通知');
      await this.updateNotificationStatus(notificationId, 'phone', 'failed', 'Twilio 未配置');
      return;
    }

    // 生成 TTS 文本（中文）
    const ttsMessage = `您关注的用户 ${tweet.author} 发布了新推文：${tweet.text.substring(0, 100)}。详情请点击链接查看。`;

    try {
      this.logger.log(`📞 正在拨打语音电话到 ${phoneNumber}...`);
      
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`,
        new URLSearchParams({
          To: phoneNumber,
          From: twilioPhone || '+1234567890',
          Twiml: `
            <Response>
              <Say voice="alice" language="zh-CN">${ttsMessage}</Say>
            </Response>
          `,
        }),
        {
          auth: { username: twilioAccountSid, password: twilioAuthToken },
        }
      );

      this.logger.log(`✅ 语音电话已拨打：${response.data.sid}`);
      await this.updateNotificationStatus(notificationId, 'phone', 'sent');
    } catch (error: any) {
      this.logger.error(`❌ 语音电话发送失败：${error.message}`);
      await this.updateNotificationStatus(notificationId, 'phone', 'failed', error.message);
    }
  }

  /**
   * 发送邮件通知
   */
  private async sendEmail(tweet: any, notificationId: string): Promise<void> {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpHost || !smtpUser || !smtpPassword) {
      this.logger.warn('⚠️ SMTP 未配置，跳过邮件通知');
      await this.updateNotificationStatus(notificationId, 'email', 'failed', 'SMTP 未配置');
      return;
    }

    try {
      this.logger.log(`📧 正在发送邮件通知...`);
      
      // 使用 nodemailer 发送邮件
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

      await transporter.sendMail({
        from: smtpFrom || smtpUser,
        to: smtpUser, // 发送到配置的管理员邮箱
        subject: `🔔 新推文提醒 - @${tweet.author}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1DA1F2;">🔔 新推文提醒</h2>
            <div style="background: #f5f8fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="font-size: 16px; margin: 0 0 10px 0;">
                <strong>作者：</strong>@${tweet.author}
              </p>
              <p style="font-size: 14px; color: #657786; margin: 0 0 15px 0;">
                <strong>内容：</strong>
              </p>
              <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                ${tweet.text}
              </p>
              <a href="${tweet.url}" style="display: inline-block; padding: 10px 20px; background: #1DA1F2; color: white; text-decoration: none; border-radius: 5px;">
                查看推文 →
              </a>
            </div>
            <p style="font-size: 12px; color: #657786; text-align: center;">
              此邮件由 Tweet Alert Pro 自动发送
            </p>
          </div>
        `,
      });

      this.logger.log(`✅ 邮件通知已发送`);
      await this.updateNotificationStatus(notificationId, 'email', 'sent');
    } catch (error: any) {
      this.logger.error(`❌ 邮件发送失败：${error.message}`);
      await this.updateNotificationStatus(notificationId, 'email', 'failed', error.message);
    }
  }

  /**
   * 发送 Webhook 通知（钉钉/企业微信/飞书）
   */
  private async sendWebhook(
    webhookUrl: string,
    tweet: any,
    notificationId: string
  ): Promise<void> {
    try {
      this.logger.log(`🔗 正在发送 Webhook 通知到 ${webhookUrl.substring(0, 50)}...`);

      let message: any;
      let channelType = 'wechat';

      // 检测 Webhook 类型
      if (webhookUrl.includes('dingtalk.com')) {
        // 钉钉机器人
        message = {
          msgtype: 'text',
          text: {
            content: `🔔 新推文提醒\n\n作者：@${tweet.author}\n内容：${tweet.text}\n\n查看详情：${tweet.url}`,
          },
        };
        this.logger.log('📌 检测到钉钉 Webhook');
      } else if (webhookUrl.includes('weixin.qq.com') || webhookUrl.includes('qyapi.weixin.qq.com')) {
        // 企业微信机器人
        message = {
          msgtype: 'text',
          text: {
            content: `🔔 新推文提醒\n\n作者：@${tweet.author}\n内容：${tweet.text}\n\n查看详情：${tweet.url}`,
          },
        };
        this.logger.log('💬 检测到企业微信 Webhook');
      } else if (webhookUrl.includes('feishu.cn') || webhookUrl.includes('larksuite.com')) {
        // 飞书机器人
        message = {
          msg_type: 'text',
          content: {
            text: `🔔 新推文提醒\n\n作者：@${tweet.author}\n内容：${tweet.text}\n\n查看详情：${tweet.url}`,
          },
        };
        channelType = 'feishu';
        this.logger.log('🚀 检测到飞书 Webhook');
      } else {
        // 通用 Webhook
        message = {
          msgtype: 'text',
          text: {
            content: `🔔 新推文提醒\n\n作者：@${tweet.author}\n内容：${tweet.text}\n\n查看详情：${tweet.url}`,
          },
        };
        this.logger.log('🔗 使用通用 Webhook 格式');
      }

      const response = await axios.post(webhookUrl, message, {
        headers: { 'Content-Type': 'application/json' },
      });

      this.logger.log(`✅ Webhook 通知已发送`);
      await this.updateNotificationStatus(notificationId, channelType, 'sent');
    } catch (error: any) {
      this.logger.error(`❌ Webhook 发送失败：${error.message}`);
      await this.updateNotificationStatus(notificationId, 'wechat', 'failed', error.message);
    }
  }

  /**
   * 更新通知状态
   */
  private async updateNotificationStatus(
    notificationId: string,
    channel: string,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          channel,
          status,
          errorMessage: errorMessage || null,
        },
      });
    } catch (error) {
      this.logger.error(`更新通知状态失败：${error}`);
    }
  }
}
