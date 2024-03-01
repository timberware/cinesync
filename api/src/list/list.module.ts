import { Module } from '@nestjs/common';
import { ListsController } from './list.controller';
import { ListsService } from './list.service';
import { UsersService } from '../users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { ListDao } from './dao/list.dao';
import { CommentDao } from './dao/comment.dao';
import { UsersDao } from '../users/daos/user.dao';
import { CommentsService } from './comment.service';
import { MoviesModule } from '../movie/movie.module';

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
