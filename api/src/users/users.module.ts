import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersDao } from './daos/user.dao';
import { ListsService } from '../lists/lists.service';
import { ListDao } from '../lists/daos/list.dao';
import { LocalStrategy } from './auth/passport/local.strategy';
import { JwtStrategy } from './auth/passport/jwt.strategy';
import { CommentDao } from '../lists/daos/comment.dao';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ExportModule } from './export/export.module';
import { ImageModule } from '../image/image.module';
import { ImageService } from '../image/image.service';
import { ImageDao } from '../image/daos/image.dao';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
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
