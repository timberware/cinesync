import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { CommentDao } from './dao/comment.dao';
import { CommentsService } from './comment.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'src/config/redisCache';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    CacheModule.registerAsync(RedisOptions),
  ],
  providers: [CommentsService, CommentDao],
  exports: [CommentsService],
})
export class CommentModule {}
