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
import { MoviesService } from './movie.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get('/')
  async getMovies(@Query('movieId') movieId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.moviesService.getMovies(movieId, req.user.id);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateWatchedStatus(@Param('id') movieId: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException('req contains no user');
    return this.moviesService.updateWatchedStatus(movieId, req.user.id);
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
    return this.moviesService.removeMovieFromList(listId, movieId);
  }
}
