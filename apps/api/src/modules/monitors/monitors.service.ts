import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

const prisma = new PrismaClient();

@Injectable()
export class MonitorsService {
  private readonly logger = new Logger(MonitorsService.name);

  constructor(private notificationsService: NotificationsService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAllTasks() {
    this.logger.log('🔍 开始检查所有监控任务...');
    
    const activeTasks = await prisma.monitorTask.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    this.logger.log(`📊 共有 ${activeTasks.length} 个活跃任务`);

    for (const task of activeTasks) {
      try {
        await this.checkTask(task);
      } catch (error) {
        this.logger.error(`❌ 检查任务 @${task.twitterHandle} 失败：${error.message}`);
      }
    }
  }

  /**
   * 检查单个任务的新推文
   */
  private async checkTask(task: any) {
    this.logger.log(`📝 检查 @${task.twitterHandle} 的新推文...`);

    // 检查是否配置了 Twitter API
    const twitterApiKey = process.env.TWITTER_API_KEY;
    const twitterApiSecret = process.env.TWITTER_API_SECRET;
    const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
    const twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!twitterApiKey || !twitterApiSecret || !twitterAccessToken || !twitterAccessSecret) {
      this.logger.warn(`⚠️ 未配置 Twitter API，跳过 @${task.twitterHandle} 的检查`);
      this.logger.warn(`💡 请在 功能配置 页面配置 Twitter API，或在 .env 文件中设置环境变量`);
      
      // 更新最后检查时间
      await prisma.monitorTask.update({
        where: { id: task.id },
        data: { lastCheckedAt: new Date() },
      });
      return;
    }

    try {
      // 使用 Twitter API v2 获取用户推文
      const { TwitterApi } = await import('twitter-api-v2');
      
      const twitterClient = new TwitterApi({
        appKey: twitterApiKey,
        appSecret: twitterApiSecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessSecret,
      });

      // 获取用户 ID
      const user = await twitterClient.v2.userByUsername(task.twitterHandle);
      const userId = user.data.id;

      // 获取用户推文（最多 5 条）
      const timeline = await twitterClient.v2.userTimeline(userId, {
        max_results: 5,
        since_id: task.lastTweetId || undefined,
        'tweet.fields': ['created_at', 'public_metrics'],
      });

      // 转换为数组
      const tweetArray: any[] = [];
      for await (const tweet of timeline) {
        tweetArray.push(tweet);
      }
      
      if (tweetArray.length === 0) {
        this.logger.log(`✅ @${task.twitterHandle} 没有新推文`);
        await prisma.monitorTask.update({
          where: { id: task.id },
          data: { lastCheckedAt: new Date() },
        });
        return;
      }

      // 倒序处理（从旧到新）
      const newTweets = tweetArray.reverse();
      this.logger.log(`🎉 @${task.twitterHandle} 有 ${newTweets.length} 条新推文`);

      for (const tweet of newTweets) {
        // 应用过滤规则
        if (!this.shouldNotify(tweet, task)) {
          this.logger.log(`⏭️ 跳过推文：${tweet.text?.substring(0, 50) || '...'}`);
          continue;
        }

        // 创建通知记录
        const notification = await prisma.notification.create({
          data: {
            userId: task.userId,
            taskId: task.id,
            tweetId: tweet.id,
            tweetContent: tweet.text || '',
            tweetUrl: `https://twitter.com/${task.twitterHandle}/status/${tweet.id}`,
            tweetCreatedAt: new Date(tweet.created_at || Date.now()),
            channel: 'phone',
            status: 'pending',
          },
        });

        this.logger.log(`📬 创建通知：${notification.id}`);

        // 发送通知
        await this.notificationsService.sendNotification({
          notificationId: notification.id,
          channels: task.notifyChannels ? JSON.parse(task.notifyChannels) : {},
          phoneNumbers: task.phoneNumbers ? JSON.parse(task.phoneNumbers) : [],
          webhooks: task.webhooks ? JSON.parse(task.webhooks) : [],
          tweet: {
            id: tweet.id,
            text: tweet.text || '',
            url: `https://twitter.com/${task.twitterHandle}/status/${tweet.id}`,
            author: task.twitterHandle,
          },
        });

        // 更新任务的 lastTweetId
        await prisma.monitorTask.update({
          where: { id: task.id },
          data: {
            lastTweetId: tweet.id,
            lastCheckedAt: new Date(),
            totalNotifications: { increment: 1 },
          },
        });

        this.logger.log(`✅ 推文 ${tweet.id} 处理完成`);
      }

    } catch (error) {
      this.logger.error(`❌ Twitter API 调用失败：${error.message}`);
      this.logger.error(`💡 请检查 Twitter API 配置是否正确`);
      
      // 即使失败也更新最后检查时间
      await prisma.monitorTask.update({
        where: { id: task.id },
        data: { lastCheckedAt: new Date() },
      });
    }
  }

  /**
   * 判断是否应该发送通知
   */
  private shouldNotify(tweet: any, task: any): boolean {
    // 关键词过滤
    if (task.keywords) {
      try {
        const keywords = typeof task.keywords === 'string' 
          ? JSON.parse(task.keywords) 
          : task.keywords;
        
        if (keywords && keywords.length > 0) {
          const hasKeyword = keywords.some((kw: string) =>
            (tweet.text || '').toLowerCase().includes(kw.toLowerCase())
          );
          if (!hasKeyword) {
            this.logger.log(`⏭️ 不包含关键词，跳过`);
            return false;
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }

    // 点赞数过滤
    if (task.minLikes && tweet.public_metrics?.like_count < task.minLikes) {
      this.logger.log(`⏭️ 点赞数 ${tweet.public_metrics?.like_count || 0} < ${task.minLikes}，跳过`);
      return false;
    }

    // 转发数过滤
    if (task.minRetweets && tweet.public_metrics?.retweet_count < task.minRetweets) {
      this.logger.log(`⏭️ 转发数 ${tweet.public_metrics?.retweet_count || 0} < ${task.minRetweets}，跳过`);
      return false;
    }

    return true;
  }
}
