import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersDao } from './daos/user.dao';
import { LocalStrategy } from './auth/passport/local.strategy';
import { JwtStrategy } from './auth/passport/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ExportModule } from './export/export.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule,
    AuthModule,
    ExportModule,
    ImageModule,
    NotificationModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersDao,
    AuthService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
