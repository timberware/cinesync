import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';
import { ListDao } from './dao/list.dao';
import { CommentDao } from './dao/comment.dao';
import { CommentsService } from './comment.service';

@Module({
  imports: [PrismaModule, NotificationModule, UsersModule],
  controllers: [ListController],
  providers: [ListService, ListDao, CommentsService, CommentDao],
  exports: [ListService],
})
export class ListModule {}
