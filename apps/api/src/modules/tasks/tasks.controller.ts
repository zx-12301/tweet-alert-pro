import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    return this.tasksService.getUserTasks(userId);
  }

  @Post()
  async createTask(@Request() req: any, @Body() body: any) {
    const userId = req.headers['x-user-id'];
    return this.tasksService.createTask(userId, body);
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.updateTask(id, body);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
