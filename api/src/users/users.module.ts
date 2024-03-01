import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersDao } from './daos/user.dao';
import { ListsService } from '../list/list.service';
import { ListDao } from '../list/dao/list.dao';
import { LocalStrategy } from './auth/passport/local.strategy';
import { JwtStrategy } from './auth/passport/jwt.strategy';
import { CommentDao } from '../list/dao/comment.dao';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ExportModule } from './export/export.module';
import { ImageModule } from '../image/image.module';
import { ImageService } from '../image/image.service';
import { ImageDao } from '../image/daos/image.dao';
import { MoviesModule } from '../movie/movie.module';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    PassportModule,
    ConfigModule,
    AuthModule,
    ExportModule,
    ImageModule,
    MoviesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    ImageService,
    ListsService,
    JwtService,
    UsersDao,
    ListDao,
    CommentDao,
    ImageDao,
    LocalStrategy,
    JwtStrategy,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
