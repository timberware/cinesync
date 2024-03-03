import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';
import { ListDao } from './dao/list.dao';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [PrismaModule, NotificationModule, UsersModule, CommentModule],
  controllers: [ListController],
  providers: [ListService, ListDao],
  exports: [ListService],
})
export class ListModule {}
