import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserDao } from './dao/user.dao';
import { AuthModule } from '../auth/auth.module';
import { ExportModule } from './export/export.module';
import { ImageModule } from '../image/image.module';
import { PaginationMiddleware } from '../middleware/pagination';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule, ExportModule, ImageModule],
  controllers: [UserController],
  providers: [UserService, UserDao],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('users/');
  }
}
