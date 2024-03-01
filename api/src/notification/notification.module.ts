import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { EmailDao } from './daos/email.dao';

@Module({
  providers: [NotificationService, ConfigService, EmailDao],
  exports: [NotificationService],
})
export class NotificationModule {}
