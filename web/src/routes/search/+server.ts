import { json } from '@sveltejs/kit';
import type { TMDBMovieResult } from '../../ambient.js';
import { GENRES, searchMovieUrl } from '../../utils';
import { TMDB_TOKEN } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url }) => {
  let movies: TMDBMovieResult[] = [];

  const movieTitle = url.searchParams.get('movieTitle');

  if (!movieTitle) {
    return new Response();
  }

  const [response, r] = await Promise.all([
    fetch(searchMovieUrl(movieTitle), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN || TMDB_TOKEN}`
      }
    }),
    fetch(GENRES, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_TOKEN || TMDB_TOKEN}`
      }
    })
  ]);

  if (response.status === 200 && r.status === 200) {
    const { results } = await response.json();
    const res = await r.json();

    movies = results;

    movies.forEach(movie => {
      const genres: string[] = [];
      movie.genre_ids.forEach(genreId => {
        const r = res.genres.find(
          (genre: { id: number; name: string }) => genreId === genre.id
        );

        if (r) {
          genres.push(r.name);
        }
      });
      movie.genres = genres;
    });
  }

  return json(movies);
};
