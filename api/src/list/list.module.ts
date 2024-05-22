import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { ListDao } from './dao/list.dao';
import { CommentModule } from '../comment/comment.module';
import { PaginationMiddleware } from '../middleware/pagination';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    UserModule,
    CommentModule,
    MovieModule,
  ],
  controllers: [ListController],
  providers: [ListService, ListDao],
  exports: [ListService],
})
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('lists/');
  }
}
