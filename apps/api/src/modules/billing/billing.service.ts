import { Injectable } from '@nestjs/common';
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
}
