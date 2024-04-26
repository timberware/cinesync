import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import type { ListType, User, MovieType } from '../../../ambient';
import { API_HOST } from '$env/static/private';

const API = process.env.API_HOST || API_HOST || 'http://localhost:4000';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals }) => {
  const { user } = locals;

  if (!user) {
    return {};
  }

  try {
    const [listResponse, watchedResponse] = await Promise.all([
      fetch(`${API}/lists?id=${user.id}`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      }),
      fetch(`${API}/movies?userId=${user.id as string}`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      })
    ]);

    if (listResponse.status !== 200 || watchedResponse.status !== 200) {
      return { user: user };
    }

    const { list }: { list: ListType[] } = await listResponse.json();
    const watched = await watchedResponse.json();

    const moviesInListsResponse = await Promise.all(
      list.map(l =>
        fetch(`${API}/movies?listId=${l.id as string}`, {
          method: 'GET',
          headers: {
            Authorization: locals.cookie as string
          }
        })
      )
    );
    const mInl = await Promise.all(moviesInListsResponse.map(m => m.json()));

    list.forEach((l, index) => {
      l.movie = mInl[index];
    });

    if (!list || !list.length) {
      return { user };
    }

    const shareesResponse = await Promise.all(
      list.map((l: ListType) =>
        fetch(`${API}/lists/${l.id}/sharees`, {
          method: 'GET',
          headers: {
            Authorization: locals.cookie as string
          }
        })
      )
    );
    let sharees = await Promise.all(shareesResponse.map(sharee => sharee.json()));

    const shareesWatchedResponse = await Promise.all(
      sharees.map((shareeList: User[]) =>
        Promise.all(
          shareeList.map(sharee =>
            fetch(`${API}/movies?userId=${sharee.id as string}`, {
              method: 'GET',
              headers: {
                Authorization: locals.cookie as string
              }
            })
          )
        )
      )
    );

    const shareesWatched = await Promise.all(
      shareesWatchedResponse.map(sharee => Promise.all(sharee.map(sh => sh.json())))
    );

    sharees.forEach((sh: User[], index) => {
      list[index].sharees = sh;

      shareesWatched[index].forEach((s: User, i) => {
        list[index].sharees[i].watched = s.map(m => m.id);
      });

      if (list[index].creatorId !== user?.id) {
        const creatorIndex = list[index].sharees.findIndex(
          s => s.id === list[index].creatorId
        );

        list[index].creatorUsername = sh[creatorIndex].username;
      } else {
        list[index].creatorUsername = user?.username;
      }

      watched.forEach((m: MovieType) => {
        const i = list[index].movie.findIndex(mv => mv.id === m.id);
        if (i !== -1) {
          list[index].movie[i].watched = true;
        }
      });
    });

    return { lists: list, user: user };
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
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
  },
  createList: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listName = data.get('list-name') as string;

    try {
      const list = {
        name: listName
      };

      const response = await fetch(`${API}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify(list)
      });

      if (response.status !== 200) {
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
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

      if (response.status !== 200) {
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
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
      const response = await fetch(`${API}/movielists/${listId}`, {
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
        console.error('There was an error modifying the list', response.statusText);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
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
        console.error('Error: ', response.statusText);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
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
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
  },
  cloneList: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');
    const name = data.get('name');

    try {
      const response = await fetch(`${API}/movielists/${listId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: locals.cookie as string
        },
        body: JSON.stringify({ name })
      });

      if (response.status !== 201) {
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
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
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
  }
};
