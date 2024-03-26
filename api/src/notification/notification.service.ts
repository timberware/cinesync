import { Injectable } from '@nestjs/common';
import { NotificationType } from './templates';
import { EmailDao } from './daos/email.dao';
import { RecipientsDto } from './dto/email.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly emailDao: EmailDao) {}

  send(recipients: RecipientsDto, notificationType: NotificationType) {
    this.emailDao.send(recipients, notificationType);
  }
}
