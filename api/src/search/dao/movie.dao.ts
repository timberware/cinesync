import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryDto } from '../dto/query.dto';

@Injectable()
export class MovieDao {
  constructor(private readonly prisma: PrismaService) {}

  search(query: QueryDto) {
    return this.prisma.movie.findMany({
      where: {
        OR: [
          {
            title: this.prisma.getPrismaSearch(query.search),
          },
        ],
      },
      include: {
        listMovie: {
          include: {
            List: true,
          },
        },
      },
      ...this.prisma.getPagination(query),
    });
  }
}
