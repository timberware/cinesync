import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { UsersService } from '../users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { ListDao } from './daos/list.dao';
import { CommentDao } from './daos/comment.dao';
import { UsersDao } from '../users/daos/user.dao';
import { CommentsService } from './comments.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [PrismaModule, EmailModule, UsersModule, MoviesModule],
  controllers: [ListsController],
  providers: [
    ListsService,
    ListDao,
    UsersService,
    UsersDao,
    CommentsService,
    CommentDao,
  ],
})
export class ListsModule {}
