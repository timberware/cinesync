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

    return {
      movies,
      user,
      list: {
        id: listId,
        name: listInfo.name,
        isPrivate: listInfo.isPrivate,
        creatorId: listInfo.creatorId
      },
      sharees
    };
  } catch (e) {
    console.error(e);
  }
};

/** @type {import('./$types').Actions} */
export const actions = {
  togglePrivacy: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const isPrivate = data.get('isPrivate');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify({
          isPrivate: !(isPrivate === 'true')
        })
      });

      if (response.status !== 200) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteList: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        }
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  updateList: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId') as string;
    const title = data.get('title') as string;
    const description = data.get('overview') as string;
    const genre = data.get('genres') as string;
    const releaseDate = data.get('release_date') as string;
    const posterUrl = data.get('poster_path') as string;
    const rating = data.get('vote_average');
    const tmdbId = data.get('id') as string;

    try {
      const response = await fetch(`${API}/movies/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify({
          movie: [
            {
              title,
              description,
              genre: genre?.split('.'),
              releaseDate,
              posterUrl,
              rating: Number(rating),
              tmdbId: +tmdbId
            }
          ]
        })
      });

      if (response.status !== 200) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  cloneList: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/lists/${listId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify({ name })
      });

      if (response.status !== 201) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  shareList: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const username = data.get('username');

    try {
      const response = await fetch(`${API}/lists/${listId}/toggleShareByUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify({ username })
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  updateListInfo: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify({ name })
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
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
    } catch (e) {
      console.error(e);
    }
  }
};
