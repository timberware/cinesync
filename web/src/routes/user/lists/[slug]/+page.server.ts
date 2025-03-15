import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types.js';
import type { ListInfoType, Movies, User } from '../../../../ambient.d';
import { env } from '$env/dynamic/private';

const API = process.env.API_HOST || env.API_HOST || 'http://localhost:4000';

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
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
        method: 'GET'
      }),
      fetch(`${API}/lists/${listId}/sharees`, {
        method: 'GET'
      }),
      fetch(`${API}/lists/${listId}`, {
        method: 'GET'
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
          method: 'GET'
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

export const actions = {
  togglePrivacy: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const isPrivate = data.get('isPrivate');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
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
  deleteList: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'DELETE'
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  updateList: async ({ request, fetch }: RequestEvent) => {
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
          'Content-type': 'application/json'
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
  cloneList: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/lists/${listId}/clone`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
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
  shareList: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const username = data.get('username');

    try {
      const response = await fetch(`${API}/lists/${listId}/toggleShareByUsername`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
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
  updateListInfo: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
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
  toggleWatched: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const movieId = data.get('movieId');

    try {
      const response = await fetch(`${API}/movies/${movieId}`, {
        method: 'PATCH'
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteMovie: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const movieId = data.get('movieId');

    try {
      const response = await fetch(`${API}/movies/${movieId}/lists/${listId}`, {
        method: 'DELETE'
      });

      if (response.status !== 204) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  },
  submitComment: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const text = data.get('text');

    try {
      const response = await fetch(`${API}/lists/${listId}/comments`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
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
} satisfies Actions;
