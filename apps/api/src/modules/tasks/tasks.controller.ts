import { Controller, Get, Post, Put, Delete, Body, Param, Request, HttpException, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Request() req: any) {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        throw new HttpException('缺少用户 ID', HttpStatus.BAD_REQUEST);
      }
      return await this.tasksService.getUserTasks(userId);
    } catch (error: any) {
      console.error('获取任务列表失败:', error);
      throw new HttpException(
        { message: error.message || '获取任务失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createTask(@Request() req: any, @Body() body: any) {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        throw new HttpException('缺少用户 ID', HttpStatus.BAD_REQUEST);
      }
      return await this.tasksService.createTask(userId, body);
    } catch (error: any) {
      console.error('创建任务失败:', error);
      throw new HttpException(
        { message: error.message || '创建任务失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    try {
      return await this.tasksService.getTask(id);
    } catch (error: any) {
      console.error('获取任务详情失败:', error);
      throw new HttpException(
        { message: error.message || '获取任务失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.tasksService.updateTask(id, body);
    } catch (error: any) {
      console.error('更新任务失败:', error);
      throw new HttpException(
        { message: error.message || '更新任务失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    try {
      return await this.tasksService.deleteTask(id);
    } catch (error: any) {
      console.error('删除任务失败:', error);
      throw new HttpException(
        { message: error.message || '删除任务失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
