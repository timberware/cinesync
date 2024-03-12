import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logLevels } from './utils/logLevels';
import { PrismaClientExceptionFilter } from './prisma/filter/prisma-client-exception.filter';
import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';

const port = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logLevels(process.env.NODE_ENV === 'production'),
  });
  app.enableCors({ origin: true, credentials: true });
  const httpService = new HttpService();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  httpService.axiosRef.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === HttpStatus.NOT_MODIFIED) return error;
    },
  );

  await app.listen(port);
}
bootstrap();
