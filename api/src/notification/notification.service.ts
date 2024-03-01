import { Injectable } from '@nestjs/common';
import { NotificationType, Recipients } from './templates';
import { EmailDao } from './daos/email.dao';

@Injectable()
export class NotificationService {
  constructor(private readonly emailDao: EmailDao) {}

  send(recipients: Recipients, notificationType: NotificationType) {
    this.emailDao.send(recipients, notificationType);
  }
}
