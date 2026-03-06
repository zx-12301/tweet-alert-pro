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
    this.logger.log('开始检查所有监控任务...');
    
    const activeTasks = await prisma.monitorTask.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    this.logger.log(`共有 ${activeTasks.length} 个活跃任务`);

    // TODO: 集成 Twitter API 后实现实际监控
    // 目前仅记录日志
    for (const task of activeTasks) {
      this.logger.log(`检查任务：@${task.twitterHandle}`);
    }
  }
}
