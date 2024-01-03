import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import type { ListType, Sharee } from '../../../ambient';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals }) => {
  try {
    const [response, w] = await Promise.all([
      fetch(`${process.env.API_HOST || 'http://localhost:4000'}/lists/`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie || ''
        }
      }),
      fetch(`${process.env.API_HOST || 'http://localhost:4000'}/lists/watched`, {
        method: 'GET',
        headers: {
          Authorization: locals.cookie || ''
        }
      })
    ]);

    if (response.status === 200 && w.status === 200) {
      const { list }: { list: ListType[] } = await response.json();

      if (!list || !list?.length) {
        return { user: locals.user };
      }

      const s = await Promise.all(
        list.map((l: ListType) =>
          fetch(
            `${process.env.API_HOST || 'http://localhost:4000'}/lists/sharees?listId=${
              l.id
            }`,
            {
              method: 'GET',
              headers: {
                Authorization: locals.cookie || ''
              }
            }
          )
        )
      );

      const sharees = await Promise.all(s.map(sharee => sharee.json()));
      const watched = await w.json();

      sharees.forEach((s, index) => {
        let creator = undefined;
        list[index].sharees = s.map((sh: Sharee) => {
          if (sh.creator) {
            creator = sh.username;
          }
          return sh;
        });

        list[index].creatorUsername = creator || locals.user?.username;

        watched.forEach((m: string) => {
          const i = list[index].movie.findIndex(mv => mv.id === m);
          if (i !== -1) {
            list[index].movie[i].watched = true;
          }
        });
      });

      return { lists: list, user: locals.user };
    }
    return { user: locals.user };
  } catch (e) {
    console.error(e);
  }
};

/** @type {import('./$types').Actions} */
export const actions = {
  togglePrivacy: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const listId = data.get('listId');

    try {
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/updatePrivacy`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ listId })
        }
      );

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

      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ ...list })
        }
      );

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
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ listId })
        }
      );

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
    const imdbId = data.get('id') as string;

    try {
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({
            listId,
            movie: [
              {
                title,
                description,
                genre: genre?.split('.'),
                releaseDate,
                posterUrl,
                rating: parseInt(rating as string),
                imdbId
              }
            ]
          })
        }
      );

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
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/updateWatchedStatus`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ movieId })
        }
      );

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
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/deleteMovie`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ listId, movieId })
        }
      );

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
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/clone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ listId, name })
        }
      );

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
      const response = await fetch(
        `${process.env.API_HOST || 'http://localhost:4000'}/lists/toggleShareByUsername`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: locals.cookie || ''
          },
          body: JSON.stringify({ listId, username })
        }
      );

      if (response.status !== 204) {
        return;
      }
    } catch (e) {
      console.error(e);
    }

    redirect(302, '/user/lists');
  }
};
