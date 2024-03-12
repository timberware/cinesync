import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MovieService } from './movie.service';
import { MoviesDao } from './dao/movie.dao';

@Module({
  imports: [PrismaModule],
  providers: [MovieService, MoviesDao],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
