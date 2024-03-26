import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import MailGun from '../../config/mailgin';
import { NotificationType, messageTemplates } from '../templates';
import { RecipientsDto } from '../dto/email.dto';

@Injectable()
export class EmailDao {
  private emailClient: IMailgunClient;
  private isProduction: boolean;
  private mailgunDomain: string;
  private mailgunApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.mailgunApiKey = this.configService.get<string>(
      'MAILGUN_KEY',
    ) as string;
    this.mailgunDomain = this.configService.get<string>(
      'MAILGUN_DOMAIN',
    ) as string;

    if (!this.mailgunApiKey || !this.mailgunDomain) {
      throw new Error('Mailgun API key or domain is not configured');
    }

    this.emailClient = MailGun.client({
      username: 'api',
      key: this.mailgunApiKey,
    });

    this.mailgunDomain = this.configService.get<string>(
      'MAILGUN_DOMAIN',
    ) as string;
  }

  send(recipients: RecipientsDto, emailType: NotificationType) {
    const createMessage = messageTemplates.get(emailType);
    if (this.isProduction && createMessage) {
      try {
        return this.emailClient.messages.create(
          this.mailgunDomain,
          createMessage(recipients),
        );
      } catch (error) {
        throw new InternalServerErrorException(
          'Error attempting to send email',
        );
      }
    }
  }
}
