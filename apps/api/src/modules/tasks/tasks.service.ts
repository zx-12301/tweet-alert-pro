import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  async getUserTasks(userId: string) {
    return prisma.monitorTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { notifications: true } },
      },
    });
  }

  async createTask(userId: string, data: any) {
    return prisma.monitorTask.create({
      data: {
        userId,
        twitterHandle: data.twitterHandle,
        keywords: data.keywords ? JSON.stringify(data.keywords) : null,
        minLikes: data.minLikes,
        minRetweets: data.minRetweets,
        notifyChannels: data.notifyChannels ? JSON.stringify(data.notifyChannels) : null,
        phoneNumbers: data.phoneNumbers ? JSON.stringify(data.phoneNumbers) : null,
        webhooks: data.webhooks ? JSON.stringify(data.webhooks) : null,
      },
    });
  }

  async getTask(id: string) {
    const task = await prisma.monitorTask.findUnique({
      where: { id },
      include: { notifications: { orderBy: { createdAt: 'desc' }, take: 50 } },
    });
    if (!task) throw new NotFoundException('任务不存在');
    return task;
  }

  async updateTask(id: string, data: any) {
    return prisma.monitorTask.update({
      where: { id },
      data: {
        twitterHandle: data.twitterHandle,
        keywords: data.keywords ? JSON.stringify(data.keywords) : null,
        minLikes: data.minLikes,
        minRetweets: data.minRetweets,
        notifyChannels: data.notifyChannels ? JSON.stringify(data.notifyChannels) : null,
        phoneNumbers: data.phoneNumbers ? JSON.stringify(data.phoneNumbers) : null,
        webhooks: data.webhooks ? JSON.stringify(data.webhooks) : null,
        isActive: data.isActive,
      },
    });
  }

  async deleteTask(id: string) {
    await prisma.monitorTask.delete({ where: { id } });
    return { success: true };
  }
}
