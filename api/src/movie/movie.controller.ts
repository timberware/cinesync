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
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ListAuthGuard } from '../list/guard/list.guard';
import { RemoveListFieldsInterceptor } from '../list/interceptor/remove-list-fields.interceptor';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('/')
  async getMovies(
    @Query('userId') userId?: string,
    @Query('listId') listId?: string,
  ) {
    return this.movieService.getMovies(userId, listId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateWatchedStatus(@Param('id') movieId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.movieService.updateWatchedStatus(movieId, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(ListAuthGuard)
  @Delete('/:id/list/:listId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMovieFromList(
    @Param('listId') listId: string,
    @Param('id') movieId: string,
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.movieService.removeMovieFromList(listId, movieId);
  }
}
