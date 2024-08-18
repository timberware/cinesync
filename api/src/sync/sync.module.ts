import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { MovieModule } from '../movie/movie.module';
import { RedisOptions } from '../config/redisCache';

@Module({
  imports: [
    PrismaModule,
    MovieModule,
    ScheduleModule.forRoot(),
    CacheModule.registerAsync(RedisOptions),
  ],
  providers: [SyncService],
})
export class SyncModule {}
