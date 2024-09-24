import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryDto } from '../dto/query.dto';
import { PAGE_NUMBER, PER_PAGE } from '../../utils';

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
      take: query.per_page ?? PER_PAGE,
      skip: (query.page_number ?? PAGE_NUMBER) * (query.per_page ?? PER_PAGE),
    });
  }
}
