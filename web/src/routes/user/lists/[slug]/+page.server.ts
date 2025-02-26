import { fail } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import type { ListInfoType, Movies, User } from '../../../../ambient.d';
import { env } from '$env/dynamic/private';
import { AUTHORIZATION } from '../../../../utils/consts.js';

const API = process.env.API_HOST || env.API_HOST || 'http://localhost:4000';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals, cookies, params }) => {
  const { slug: listId } = params;
  const { user } = locals;

  if (!listId) {
    return fail(404);
  }

  if (!user) {
    return fail(401);
  }

  const cookie = cookies.get(AUTHORIZATION);

  try {
    const [moviesResponse, shareesResponse, listInfoResponse] = await Promise.all([
      fetch(`${API}/movies?listId=${listId}`, {
        method: 'GET',
        headers: {
          Authorization: cookie as string
        }
      }),
      fetch(`${API}/lists/${listId}/sharees`, {
        method: 'GET',
        headers: {
          Authorization: cookie as string
        }
      }),
      fetch(`${API}/lists/${listId}`, {
        method: 'GET',
        headers: {
          Authorization: cookie as string
        }
      })
    ]);

    if (moviesResponse.status !== 200 || listInfoResponse.status !== 200) {
      return { user };
    }

    const { movies }: Movies = await moviesResponse.json();
    const listInfo: ListInfoType = await listInfoResponse.json();

    if (shareesResponse.status !== 200) {
      return { movies, user, listId };
    }

    const sharees: User[] = await shareesResponse.json();

    const userAndSharees = [user, ...sharees];
    const watchedByUsersResponse = await Promise.all(
      userAndSharees.map(sharee =>
        fetch(`${API}/movies?listId=${listId}&userId=${sharee.id}&per_page=999`, {
          method: 'GET',
          headers: {
            Authorization: cookie as string
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

    const comments = listInfo.comments.map(comment => {
      const user = userAndSharees.find(u => u.id === comment.userId);

      if (user) comment.username = user.username;

      return comment;
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
      sharees,
      comments
    };
  } catch (e) {
    console.error(e);
  }
};

/** @type {import('./$types').Actions} */
export const actions = {
  togglePrivacy: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const isPrivate = data.get('isPrivate');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
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
  deleteList: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
        }
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  updateList: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId') as string;
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const genre = data.get('genre') as string;
    const releaseDate = data.get('releaseDate') as string;
    const posterUrl = data.get('posterUrl') as string;
    const rating = data.get('rating');
    const tmdbId = data.get('tmdbId') as string;

    try {
      const response = await fetch(`${API}/movies/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
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
  cloneList: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/lists/${listId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
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
  shareList: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const username = data.get('username');

    try {
      const response = await fetch(`${API}/lists/${listId}/toggleShareByUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
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
  updateListInfo: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
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
  toggleWatched: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const movieId = data.get('movieId');

    try {
      const response = await fetch(`${API}/movies/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
        }
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteMovie: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const movieId = data.get('movieId');

    try {
      const response = await fetch(`${API}/movies/${movieId}/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
        }
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  submitComment: async ({ request, fetch, cookies }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const text = data.get('text');

    try {
      const response = await fetch(`${API}/lists/${listId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.get(AUTHORIZATION) as string
        },
        body: JSON.stringify({ text })
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
