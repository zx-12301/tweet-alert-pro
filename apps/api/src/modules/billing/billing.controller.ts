import { Controller, Get, Post, Body, Request } from '@nestjs/common';
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
    const userId = req.headers['x-user-id'];
    return this.billingService.subscribe(userId, body.plan);
  }
}
