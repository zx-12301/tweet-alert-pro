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

    return prisma.subscription.upsert({
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
