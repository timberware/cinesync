import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { UserService } from '../user.service';
import { UserDao } from '../dao/user.dao';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ExportController],
  providers: [ExportService, UserService, UserDao, PrismaService],
})
export class ExportModule {}
