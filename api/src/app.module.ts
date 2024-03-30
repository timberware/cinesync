import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { NotificationModule } from './notification/notification.module';
import { ImageModule } from './image/image.module';
import { MovieModule } from './movie/movie.module';
import { MovielistModule } from './movielist/movielist.module';
import { SyncModule } from './sync/sync.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AuthModule,
    ListModule,
    NotificationModule,
    ImageModule,
    MovieModule,
    MovielistModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    PrismaService,
    JwtService,
  ],
})
export class AppModule {}
