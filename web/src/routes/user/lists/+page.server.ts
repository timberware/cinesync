import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import type { Lists, ListType } from '../../../ambient';
import { API_HOST } from '$env/static/private';
import { LISTS_PER_PAGE } from '../../../utils/consts';

const API = process.env.API_HOST || API_HOST || 'http://localhost:4000';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals }) => {
  const { user } = locals;

  if (!user) {
    return {};
  }

  const PER_PAGE = `per_page=${LISTS_PER_PAGE}`;

  try {
    const [listResponse, sharedListsResponse] = await Promise.all([
      fetch(`${API}/lists?id=${user.id}&${PER_PAGE}`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      }),
      fetch(`${API}/lists?id=${user.id}&shared=true&${PER_PAGE}`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie as string
        }
      })
    ]);

    if (listResponse.status !== 200 && sharedListsResponse.status !== 200) {
      return { user: user };
    }

    const { lists }: Lists = await listResponse.json();
    const { lists: sharedLists }: Lists = await sharedListsResponse.json();

    const [
      moviesInListsResponse,
      moviesInSharedListsResponse,
      shareesResponse,
      shareesInSharedResponse
    ] = await Promise.all([
      Promise.all(
        lists.map((l: ListType) =>
          fetch(`${API}/movies?listId=${l.id}`, {
            method: 'GET',
            headers: {
              Authorization: locals.cookie as string
            }
          })
        )
      ),
      Promise.all(
        sharedLists.map((l: ListType) =>
          fetch(`${API}/movies?listId=${l.id}`, {
            method: 'GET',
            headers: {
              Authorization: locals.cookie as string
            }
          })
        )
      ),
      Promise.all(
        lists.map((l: ListType) =>
          fetch(`${API}/lists/${l.id}/sharees`, {
            method: 'GET',
            headers: {
              Authorization: locals.cookie as string
            }
          })
        )
      ),
      Promise.all(
        sharedLists.map((l: ListType) =>
          fetch(`${API}/lists/${l.id}/sharees`, {
            method: 'GET',
            headers: {
              Authorization: locals.cookie as string
            }
          })
        )
      )
    ]);

    const moviesInLists = await Promise.all(moviesInListsResponse.map(m => m.json()));
    const moviesInSharedLists = await Promise.all(
      moviesInSharedListsResponse.map(m => m.json())
    );
    const sharees = await Promise.all(shareesResponse.map(sharee => sharee.json()));
    const shareesInShared = await Promise.all(
      shareesInSharedResponse.map(sharee => sharee.json())
    );

    lists.forEach((l, index) => {
      l.movies = moviesInLists[index].movies.length;
      l.posterUrl =
        moviesInLists[index].movies.length && moviesInLists[index].movies[0]?.posterUrl;
      l.sharees = sharees[index].length;
    });
    sharedLists.forEach((l, index) => {
      l.movies = moviesInSharedLists[index].movies.length;
      l.posterUrl =
        moviesInSharedLists[index].movies.length &&
        moviesInSharedLists[index].movies[0]?.posterUrl;
      l.sharees = shareesInShared[index].length;
    });

    return { lists, sharedLists, user: user };
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
