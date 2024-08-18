import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MovieService } from './movie.service';
import { MovieDao } from './dao/movie.dao';
import { TMDBDao } from './dao/tmdb.dao';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PaginationMiddleware } from '../middleware/pagination';
import { RedisOptions } from '../config/redisCache';

@Module({
  imports: [PrismaModule, HttpModule, CacheModule.registerAsync(RedisOptions)],
  providers: [MovieService, MovieDao, TMDBDao, ConfigService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('movies/');
  }
}
