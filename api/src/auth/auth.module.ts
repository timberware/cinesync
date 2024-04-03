import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NotificationModule } from '../notification/notification.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthDao } from './dao/auth.dao';
import { LocalStrategy } from '../auth/passport/local.strategy';
import { JwtStrategy } from '../auth/passport/jwt.strategy';

@Module({
  imports: [PrismaModule, PassportModule, ConfigModule, NotificationModule],
  controllers: [AuthController],
  providers: [AuthService, AuthDao, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
