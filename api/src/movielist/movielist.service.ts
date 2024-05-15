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
    const { count } = await this.movieService.getMovies({
      per_page: 0,
      page_number: 0,
      listId,
    });
    const originalList = await this.listService.getList(listId);
    const clonedList = await this.listService.createList(
      name || originalList.name,
      userId,
    );

    if (count === 0) {
      return clonedList;
    }

    const { movies } = await this.movieService.getMovies({
      per_page: count,
      page_number: 0,
      listId,
    });

    await this.movieService.createMovies(movies, clonedList.id);

    return clonedList;
  }

  async updateList(listId: string, updateListDto: UpdateMovieListDto) {
    await this.movieService.createMovies(updateListDto.movie, listId);
  }
}
