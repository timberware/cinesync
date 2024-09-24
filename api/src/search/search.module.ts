import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { MovieDao } from './dao/movie.dao';
import { PrismaModule } from '../prisma/prisma.module';
import { TMDBDao } from './dao/tmdb.dao';
import { RedisOptions } from '../config/redisCache';

@Module({
  imports: [PrismaModule, HttpModule, CacheModule.registerAsync(RedisOptions)],
  controllers: [SearchController],
  providers: [SearchService, MovieDao, TMDBDao, ConfigService],
})
export class SearchModule {}
