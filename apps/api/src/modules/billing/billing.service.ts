import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BillingService {
  async getSubscription(userId: string) {
    return prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async subscribe(userId: string, plan: string) {
    const plans: any = {
      free: { dailyNotificationLimit: 5, maxTasks: 3 },
      basic: { dailyNotificationLimit: 50, maxTasks: 10 },
      pro: { dailyNotificationLimit: 100, maxTasks: 20 },
      enterprise: { dailyNotificationLimit: 9999, maxTasks: 9999 },
    };

    const planConfig = plans[plan] || plans.free;

    try {
      // 尝试 upsert
      return await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan,
          status: 'active',
          dailyNotificationLimit: planConfig.dailyNotificationLimit,
          maxTasks: planConfig.maxTasks,
        },
        create: {
          userId,
          plan,
          status: 'active',
          dailyNotificationLimit: planConfig.dailyNotificationLimit,
          maxTasks: planConfig.maxTasks,
        },
      });
    } catch (error: any) {
      // 如果外键约束失败，先创建用户再创建订阅
      if (error.code === 'P2003' || error.message.includes('Foreign key')) {
        console.log('用户不存在，创建用户:', userId);
        
        // 创建演示用户
        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: `user_${userId.substr(0, 8)}@demo.com`,
            name: '演示用户',
          },
        });

        // 再次尝试创建订阅
        return await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: 'active',
            dailyNotificationLimit: planConfig.dailyNotificationLimit,
            maxTasks: planConfig.maxTasks,
          },
          create: {
            userId,
            plan,
            status: 'active',
            dailyNotificationLimit: planConfig.dailyNotificationLimit,
            maxTasks: planConfig.maxTasks,
          },
        });
      }
      throw error;
    }
  }

  async cancel(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('未找到订阅记录');
    }

    // 将状态改为已取消（当前周期结束后失效）
    return prisma.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
      },
    });
  }
}
