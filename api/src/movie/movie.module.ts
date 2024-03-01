import { Module } from '@nestjs/common';
import { MoviesController } from './movie.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MoviesService } from './movie.service';
import { MoviesDao } from './dao/movie.dao';

@Module({
  imports: [PrismaModule],
  providers: [MoviesService, MoviesDao],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
