import { Module } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [MonitorsService],
  exports: [MonitorsService],
})
export class MonitorsModule {}
