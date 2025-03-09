import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { NotificationModule } from './notification/notification.module';
import { ImageModule } from './image/image.module';
import { MovieModule } from './movie/movie.module';
import { SyncModule } from './sync/sync.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AuthModule,
    ListModule,
    NotificationModule,
    ImageModule,
    MovieModule,
    SyncModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    PrismaService,
  ],
})
export class AppModule {}
