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
} from '@nestjs/common';
import { Request } from 'express';
import { ListAuthGuard } from '../list/guard/list.guard';
import { RemoveListFieldsInterceptor } from '../list/interceptor/remove-list-fields.interceptor';
import { MovieService } from './movie.service';
import { QueryDto } from './dto/query.dto';

@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('/')
  async getMovies(@Query() query: QueryDto) {
    return this.movieService.getMovies(query);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateWatchedStatus(@Param('id') movieId: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('user not found');
    return this.movieService.updateWatchedStatus(movieId, req.user.id);
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
    return this.movieService.removeMovieFromList(listId, movieId);
  }
}
