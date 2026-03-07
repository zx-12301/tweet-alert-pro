import { Controller, Get, Post, Body, Request, HttpException, HttpStatus } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('subscription')
  async getSubscription(@Request() req: any) {
    const userId = req.headers['x-user-id'];
    return this.billingService.getSubscription(userId);
  }

  @Post('subscribe')
  async subscribe(@Request() req: any, @Body() body: { plan: string }) {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        throw new HttpException('缺少用户 ID', HttpStatus.BAD_REQUEST);
      }
      return await this.billingService.subscribe(userId, body.plan);
    } catch (error: any) {
      console.error('订阅失败:', error);
      throw new HttpException(
        { message: error.message || '订阅失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cancel')
  async cancelSubscription(@Request() req: any) {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        throw new HttpException('缺少用户 ID', HttpStatus.BAD_REQUEST);
      }
      return await this.billingService.cancel(userId);
    } catch (error: any) {
      console.error('取消订阅失败:', error);
      throw new HttpException(
        { message: error.message || '取消订阅失败' },
        error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
