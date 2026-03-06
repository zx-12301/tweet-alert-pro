import { Controller, Get, Put, Body, Request } from '@nestjs/common';

// 内存存储配置（演示用，实际应该存入数据库）
const settingsStore: any = {};

@Controller('settings')
export class SettingsController {
  @Get()
  async getSettings(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    return settingsStore[userId] || {};
  }

  @Put()
  async updateSettings(@Request() req: any, @Body() data: any) {
    const userId = req.headers['x-user-id'];
    settingsStore[userId] = {
      ...settingsStore[userId],
      ...data,
    };
    return settingsStore[userId];
  }
}
