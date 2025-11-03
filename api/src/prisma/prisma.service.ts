import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseQueryDto } from 'src/common/dto/baseQuery.dto';
import { PAGE_NUMBER, PER_PAGE } from 'src/utils';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  getPrismaSearch(search: string) {
    return {
      contains: `%${search}%`,
      mode: Prisma.QueryMode.insensitive,
    };
  }

  getPagination(query: BaseQueryDto) {
    return {
      take: query.per_page ?? PER_PAGE,
      skip: (query.page_number ?? PAGE_NUMBER) * (query.per_page ?? PER_PAGE),
    };
  }
}
