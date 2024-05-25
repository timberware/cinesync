import { fail } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import type { Movies } from '../../../../ambient.d';
import { API_HOST } from '$env/static/private';

const API = process.env.API_HOST || API_HOST || 'http://localhost:4000';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals, params }) => {
  const { slug: listId } = params;
  const { user } = locals;

  if (!listId) {
    return fail(404);
  }

  if (!user) {
    return fail(401);
  }

  try {
    const [moviesResponse, shareesResponse, listInfoResponse] = await Promise.all([
      fetch(`${API}/movies?listId=${listId}`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      }),
      fetch(`${API}/lists/${listId}/sharees`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      }),
      fetch(`${API}/lists/${listId}`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      })
    ]);

    if (moviesResponse.status !== 200 || listInfoResponse.status !== 200) {
      return { user };
    }

    const { movies }: Movies = await moviesResponse.json();
    const listInfo = await listInfoResponse.json();

    if (shareesResponse.status !== 200) {
      return { movies, user, listId };
    }

    const sharees = await shareesResponse.json();

    const userAndSharees = [user, ...sharees];
    const watchedByUsersResponse = await Promise.all(
      userAndSharees.map(sharee =>
        fetch(`${API}/movies?listId=${listId}&userId=${sharee.id}&per_page=999`, {
          method: 'GET',
          headers: {
            Authorization: locals.cookie as string
          }
        })
      )
    );

    const watchedByUsers: Movies[] = await Promise.all(
      watchedByUsersResponse.map(r => r.json())
    );
    watchedByUsers[0].movies.forEach(movie => {
      const index = movies.findIndex(m => m.id === movie.id);
      if (index !== -1) {
        movies[index].watched = true;
      }
    });

    return { movies, user, list: { id: listId, name: listInfo.name } };
  } catch (e) {
    console.error(e);
  }
};

/** @type {import('./$types').Actions} */
export const actions = {
  toggleWatched: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const movieId = data.get('movieId');

    try {
      const response = await fetch(`${API}/movies/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        }
      });

      if (response.status !== 204) {
        console.error('Error: ', response.statusText);
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteMovie: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const movieId = data.get('movieId');

    try {
      const response = await fetch(`${API}/movies/${movieId}/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        }
      });

      if (response.status !== 204) {
        return fail(400);
      }
      console.log('hey sailor');
      console.log({ listId });
      console.log({ movieId });
    } catch (e) {
      console.error(e);
    }

    // redirect(302, '/user/lists');
  }
};
