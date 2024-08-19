import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import { MailgunMessageData } from 'mailgun.js';
import MailGun from '../../config/mailgun';
import {
  CreateEmailFunctionType,
  NotificationType,
  messageTemplates,
} from '../templates';
import { RecipientsDto } from '../dto/email.dto';

@Injectable()
export class EmailDao {
  private emailClient: IMailgunClient;
  private isProduction: boolean;
  private mailgunDomain: string | undefined;
  private mailgunApiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.mailgunApiKey = this.configService.get<string>('MAILGUN_KEY');
    this.mailgunDomain = this.configService.get<string>('MAILGUN_DOMAIN');

    if (!this.mailgunApiKey || !this.mailgunDomain) {
      throw new Error('Mailgun API key or domain is not configured');
    }

    this.emailClient = MailGun.client({
      username: 'api',
      key: this.mailgunApiKey,
    });
  }

  send(recipients: RecipientsDto, emailType: NotificationType) {
    const createMessage: CreateEmailFunctionType | undefined =
      messageTemplates.get(emailType);
    if (this.mailgunDomain && this.isProduction && createMessage) {
      try {
        return this.emailClient.messages.create(
          this.mailgunDomain,
          createMessage(recipients) as MailgunMessageData,
        );
      } catch {
        throw new InternalServerErrorException(
          'Error attempting to send email',
        );
      }
    }
  }
}
