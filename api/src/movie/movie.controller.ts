import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  Query,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { ListAuthGuard } from '../list/guard/list.guard';
import { RemoveListFieldsInterceptor } from '../list/interceptor/remove-list-fields.interceptor';
import { MovieService } from './movie.service';
import { QueryDto } from './dto/query.dto';
import { RemoveListCreateFieldsInterceptor } from '../list/interceptor/remove-list-create-fields.interceptor';
import { UpdateMovieListDto } from './dto/update-movie-list.dto';

@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('/')
  getMovies(@Query() query: QueryDto) {
    return this.movieService.getMovies(query);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateWatchedStatus(@Param('id') movieId: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');

    return this.movieService.updateWatchedStatus(movieId, req.user.id);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Patch('/lists/:id')
  updateList(
    @Param('id') listId: string,
    @Body() body: UpdateMovieListDto,
    @Req() req: Request,
  ) {
    if (!req.user) throw new UnauthorizedException('user not found');

    return this.movieService.createMovies(body.movie, listId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Delete('/:id/lists/:listId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMovieFromList(
    @Param('listId') listId: string,
    @Param('id') movieId: string,
    @Req() req: Request,
  ) {
    if (!req.user) throw new UnauthorizedException('user not found');

    return this.movieService.removeMovieFromList(listId, movieId, req.user.id);
  }
}
