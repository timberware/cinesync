import { json, type RequestHandler } from '@sveltejs/kit';
import type { MovieWithLists, SearchResult } from '../../ambient.js';
import { API } from '../../utils';

export const GET: RequestHandler = async ({ url, locals, fetch }) => {
  try {
    const search = url.searchParams.get('search');

    if (!search) {
      return new Response();
    }

    const res = await fetch(`${API}/search?search=${search}&per_page=20`, {
      method: 'GET'
    });

    if (res.status !== 200) {
      throw new Error();
    }
    const { tmdb, db }: SearchResult = await res.json();

    const moviesWithLists: MovieWithLists[] = tmdb.map(movie => {
      const dbMovie = db.find(m => m.tmdbId === movie.tmdbId);

      return {
        ...movie,
        lists: dbMovie ? dbMovie.lists.filter(l => l.creatorId === locals.user?.id) : []
      };
    });

    return json(moviesWithLists);
  } catch (e) {
    console.error({ error: e });
  }
};
