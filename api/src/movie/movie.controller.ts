import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ListAuthGuard } from '../list/guard/list.guard';
import { RemoveListFieldsInterceptor } from '../list/interceptor/remove-list-fields.interceptor';
import { MovieService } from './movie.service';
import { QueryDto } from './dto/query.dto';
import { RemoveListCreateFieldsInterceptor } from '../list/interceptor/remove-list-create-fields.interceptor';
import { UpdateMovieListDto } from './dto/update-movie-list.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDto } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getMovies(@Query() query: QueryDto) {
    return this.movieService.getMovies(query);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateWatchedStatus(
    @Param('id') movieId: string,
    @CurrentUser() user: UserDto,
  ) {
    return this.movieService.updateWatchedStatus(movieId, user.id);
  }

  @UseInterceptors(RemoveListCreateFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard)
  @Patch('/lists/:id')
  updateList(@Param('id') listId: string, @Body() body: UpdateMovieListDto) {
    return this.movieService.createMovies(body.movie, listId);
  }

  @UseInterceptors(RemoveListFieldsInterceptor)
  @UseGuards(JwtAuthGuard, ListAuthGuard)
  @Delete('/:id/lists/:listId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMovieFromList(
    @Param('listId') listId: string,
    @Param('id') movieId: string,
    @CurrentUser() user: UserDto,
  ) {
    return this.movieService.removeMovieFromList(listId, movieId, user.id);
  }
}
