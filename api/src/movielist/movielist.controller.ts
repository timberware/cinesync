import {
  Controller,
  Body,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { RemoveListCreateFieldsInterceptor } from '../list/interceptor/remove-list-create-fields.interceptor';
import { Request } from 'express';
import { CreateMovieListDto } from './dto/create-movielist.dto';
import { MovielistService } from './movielist.service';
import { ListAuthGuard } from '../list/guard/list.guard';
import { UpdateMovieListDto } from '../movie/dto/update-movie-list.dto';

@Controller('movielists')
export class MovielistController {
  constructor(private movieListService: MovielistService) {}

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/')
  createList(@Body() body: CreateMovieListDto, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.movieListService.createListWithMovies(body, req.user.id);
  }

  @UseGuards(ListAuthGuard)
  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @Post('/:id/clone')
  cloneList(
    @Param('id') listId: string,
    @Body() { name }: { name: string },
    @Req() req: Request,
  ) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.movieListService.cloneList(listId, req.user.id, name);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Patch('/:id')
  updateList(@Param('id') listId: string, @Body() body: UpdateMovieListDto) {
    return this.movieListService.updateList(listId, body);
  }
}
