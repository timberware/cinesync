import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtAuthGuard } from './users/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { ListModule } from './list/list.module';
import { NotificationModule } from './notification/notification.module';
import { ImageModule } from './image/image.module';
import { MovieModule } from './movie/movie.module';
import { MovielistModule } from './movielist/movielist.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ListModule,
    NotificationModule,
    ImageModule,
    MovieModule,
    MovielistModule,
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
