import { json } from '@sveltejs/kit';
import type { MovieWithLists, SearchResult } from '../../ambient.js';
import { API_HOST } from '$env/static/private';

const API = process.env.API_HOST || API_HOST || 'http://localhost:4000';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url, locals, fetch }) => {
  try {
    const search = url.searchParams.get('search');

    if (!search) {
      return new Response();
    }

    const res = await fetch(`${API}/search?search=${search}&per_page=20`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: locals.cookie as string
      }
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
