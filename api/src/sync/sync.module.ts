import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [PrismaModule, MovieModule, ScheduleModule.forRoot()],
  providers: [SyncService],
})
export class SyncModule {}
