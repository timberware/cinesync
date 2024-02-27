import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MoviesService } from './movies.service';
import { MoviesDao } from './dao/movies.dao';

@Module({
  imports: [PrismaModule],
  providers: [MoviesService, MoviesDao],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
