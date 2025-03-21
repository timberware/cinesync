import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { logLevels } from './utils/logLevels';
import { PrismaClientExceptionFilter } from './prisma/filter/prisma-client-exception.filter';
import * as cookieParser from 'cookie-parser';

const port = 4000;

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule, {
    logger: logLevels(process.env.NODE_ENV === 'production'),
  });

  if (!(configService.get<string>('NODE_ENV') === 'production')) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Cinesync')
      .setDescription('Your favourite site for tracking your watch lists')
      .setVersion('0.1')
      .addTag('cinesync')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);
  }

  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const httpService = new HttpService();
  httpService.axiosRef.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (error.response.status === HttpStatus.NOT_MODIFIED) return error;
    },
  );

  await app.listen(port);
}
bootstrap();
