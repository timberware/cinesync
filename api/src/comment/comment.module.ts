import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { CommentDao } from './dao/comment.dao';
import { CommentsService } from './comment.service';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [CommentsService, CommentDao],
  exports: [CommentsService],
})
export class CommentModule {}
