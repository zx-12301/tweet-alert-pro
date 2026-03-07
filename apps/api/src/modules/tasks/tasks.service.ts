import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  async getUserTasks(userId: string) {
    try {
      return await prisma.monitorTask.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { notifications: true } },
        },
      });
    } catch (error: any) {
      console.error('获取任务列表失败:', error);
      throw new BadRequestException(`获取任务失败：${error.message}`);
    }
  }

  async createTask(userId: string, data: any) {
    try {
      const platform = data.platform || 'twitter';

      // 验证平台
      if (platform === 'weibo') {
        throw new BadRequestException('微博监控功能暂未开放，目前仅支持 Twitter 监控');
      }

      // 验证 Twitter 账号
      if (platform === 'twitter') {
        if (!data.twitterHandle || data.twitterHandle.trim() === '') {
          throw new BadRequestException('Twitter 账号不能为空');
        }

        // 清理 twitter handle
        const cleanHandle = data.twitterHandle.replace('@', '').trim();
        
        // 验证格式
        if (!/^[a-zA-Z0-9_]+$/.test(cleanHandle)) {
          throw new BadRequestException('Twitter 账号格式不正确，只能包含字母、数字和下划线');
        }

        // 检查是否已存在相同任务
        const existingTask = await prisma.monitorTask.findFirst({
          where: {
            userId,
            platform,
            twitterHandle: cleanHandle,
          },
        });

        if (existingTask) {
          throw new BadRequestException(`已存在监控任务 @${cleanHandle}，请勿重复添加`);
        }

        // 创建任务
        return await prisma.monitorTask.create({
          data: {
            userId,
            platform,
            twitterHandle: cleanHandle,
            weiboHandle: null,
            keywords: data.keywords && data.keywords.length > 0 ? JSON.stringify(data.keywords) : null,
            minLikes: data.minLikes,
            minRetweets: data.minRetweets,
            notifyChannels: data.notifyChannels ? JSON.stringify(data.notifyChannels) : null,
            phoneNumbers: data.phoneNumbers && data.phoneNumbers.length > 0 ? JSON.stringify(data.phoneNumbers) : null,
            webhooks: data.webhooks && data.webhooks.length > 0 ? JSON.stringify(data.webhooks) : null,
            emails: data.emails && data.emails.length > 0 ? JSON.stringify(data.emails) : null,
          },
        });
      }

      throw new BadRequestException(`不支持的平台：${platform}`);
    } catch (error: any) {
      console.error('创建任务失败:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`创建任务失败：${error.message}`);
    }
  }

  async getTask(id: string) {
    try {
      const task = await prisma.monitorTask.findUnique({
        where: { id },
        include: { notifications: { orderBy: { createdAt: 'desc' }, take: 50 } },
      });
      if (!task) {
        throw new NotFoundException('任务不存在');
      }
      return task;
    } catch (error: any) {
      console.error('获取任务详情失败:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`获取任务失败：${error.message}`);
    }
  }

  async updateTask(id: string, data: any) {
    try {
      // 验证任务是否存在
      const existingTask = await prisma.monitorTask.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new NotFoundException('任务不存在');
      }

      const updateData: any = {
        isActive: data.isActive,
      };

      // 根据平台更新对应字段
      if (data.platform === 'twitter' || !data.platform) {
        if (data.twitterHandle) {
          const cleanHandle = data.twitterHandle.replace('@', '').trim();
          if (!/^[a-zA-Z0-9_]+$/.test(cleanHandle)) {
            throw new BadRequestException('Twitter 账号格式不正确');
          }
          updateData.twitterHandle = cleanHandle;
        }
        updateData.weiboHandle = null;
      } else if (data.platform === 'weibo') {
        throw new BadRequestException('微博监控功能暂未开放');
      }

      if (data.keywords) {
        updateData.keywords = data.keywords.length > 0 ? JSON.stringify(data.keywords) : null;
      }
      updateData.minLikes = data.minLikes;
      updateData.minRetweets = data.minRetweets;
      
      if (data.notifyChannels) {
        updateData.notifyChannels = JSON.stringify(data.notifyChannels);
      }
      if (data.phoneNumbers) {
        updateData.phoneNumbers = data.phoneNumbers.length > 0 ? JSON.stringify(data.phoneNumbers) : null;
      }
      if (data.webhooks) {
        updateData.webhooks = data.webhooks.length > 0 ? JSON.stringify(data.webhooks) : null;
      }
      if (data.emails) {
        updateData.emails = data.emails.length > 0 ? JSON.stringify(data.emails) : null;
      }

      return await prisma.monitorTask.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      console.error('更新任务失败:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`更新任务失败：${error.message}`);
    }
  }

  async deleteTask(id: string) {
    try {
      // 验证任务是否存在
      const existingTask = await prisma.monitorTask.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new NotFoundException('任务不存在');
      }

      await prisma.monitorTask.delete({ where: { id } });
      return { success: true, message: '任务已删除' };
    } catch (error: any) {
      console.error('删除任务失败:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`删除任务失败：${error.message}`);
    }
  }
}
