import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MovieService } from './movie.service';
import { MovieDao } from './dao/movie.dao';
import { TMDBDao } from './dao/tmdb.dao';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [MovieService, MovieDao, TMDBDao, ConfigService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
