import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { QueryDto } from './dto/query.dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/')
  get(@Query() query: QueryDto) {
    return this.searchService.get(query);
  }
}
