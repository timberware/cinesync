import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { QueryDto } from './dto/query.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  get(@Query() query: QueryDto) {
    return this.searchService.get(query);
  }
}
