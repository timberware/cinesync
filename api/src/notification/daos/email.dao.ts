import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import email from '../../config/email';
import { NotificationType, Recipients, messageTemplates } from '../templates';

type EmailData = {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  html: string;
};

@Injectable()
export class EmailDao {
  private emailClient: IMailgunClient;
  private isProduction: boolean;
  private mailgunDomain: string;

  constructor(private readonly configService: ConfigService) {
    this.emailClient = email;
    this.mailgunDomain = this.configService.get<string>(
      'MAILGUN_DOMAIN',
    ) as string;
  }

  async send(recipients: Recipients, emailType: NotificationType) {
    const createMessage = messageTemplates.get(emailType);
    if (this.isProduction && createMessage) {
      try {
        const fire = await this.emailClient.messages.create(
          this.mailgunDomain,
          createMessage(recipients) as EmailData,
        );

        return fire;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error attempting to send email',
        );
      }
    }
  }
}
