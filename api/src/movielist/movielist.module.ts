import { Module } from '@nestjs/common';
import { MovielistService } from './movielist.service';
import { MovielistController } from './movielist.controller';
import { MovieModule } from '../movie/movie.module';
import { ListModule } from '../list/list.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MovieModule, ListModule, PrismaModule],
  providers: [MovielistService],
  controllers: [MovielistController],
  exports: [MovielistService],
})
export class MovielistModule {}
