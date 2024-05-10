import { Injectable } from '@nestjs/common';
import { MovieService } from '../movie/movie.service';
import { ListService } from '../list/list.service';
import { CreateMovieListDto } from './dto/create-movielist.dto';
import { UpdateMovieListDto } from '../movie/dto/update-movie-list.dto';

@Injectable()
export class MovielistService {
  constructor(
    private movieService: MovieService,
    private listService: ListService,
  ) {}

  async createListWithMovies(body: CreateMovieListDto, userId: string) {
    const { id } = await this.listService.createList(body.name, userId);

    return await this.movieService.createMovies(body.movie, id);
  }

  async cloneList(listId: string, userId: string, name?: string) {
    const originalList = await this.listService.getList(listId);
    const { movies } = await this.movieService.getMovies({ listId });

    const clonedList = await this.createListWithMovies(
      {
        name: name || originalList.name,
        movie: movies,
      },
      userId,
    );

    return clonedList;
  }

  async updateList(listId: string, updateListDto: UpdateMovieListDto) {
    await this.movieService.createMovies(updateListDto.movie, listId);
  }
}
