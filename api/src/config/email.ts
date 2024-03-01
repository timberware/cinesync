import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import * as FormData from 'form-data';

const configService = new ConfigService();

const mailgunApiKey = configService.get<string>('MAILGUN_KEY') as string;
const mailgunDomain = configService.get<string>('MAILGUN_DOMAIN') as string;

if (!mailgunApiKey || !mailgunDomain) {
  throw new Error('Mailgun API key or domain is not configured');
}

const mailgun = new Mailgun(FormData);

export default mailgun.client({
  username: 'api',
  key: mailgunApiKey,
});
