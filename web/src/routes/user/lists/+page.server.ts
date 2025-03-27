import { fail } from '@sveltejs/kit';
import type { Lists, ListType } from '../../../ambient';
import type { Actions, PageServerLoad, RequestEvent } from './$types.js';
import { API } from '../../../utils';

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const { user } = locals;

  if (!user) {
    return {};
  }

  try {
    const [listResponse, sharedListsResponse] = await Promise.all([
      fetch(`${API}/lists?id=${user.id}`, {
        method: 'GET'
      }),
      fetch(`${API}/lists?id=${user.id}&shared=true&`, {
        method: 'GET'
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
            method: 'GET'
          })
        )
      ),
      Promise.all(
        sharedLists.map((l: ListType) =>
          fetch(`${API}/movies?listId=${l.id}`, {
            method: 'GET'
          })
        )
      ),
      Promise.all(
        lists.map((l: ListType) =>
          fetch(`${API}/lists/${l.id}/sharees`, {
            method: 'GET'
          })
        )
      ),
      Promise.all(
        sharedLists.map((l: ListType) =>
          fetch(`${API}/lists/${l.id}/sharees`, {
            method: 'GET'
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
        l.movies &&
        moviesInLists[index].movies[Math.floor(Math.random() * l.movies)]?.posterUrl;
      l.sharees = sharees[index].length;
    });
    sharedLists.forEach((l, index) => {
      l.movies = moviesInSharedLists[index].movies.length;
      l.posterUrl =
        l.movies &&
        moviesInSharedLists[index].movies[Math.floor(Math.random() * l.movies)]
          ?.posterUrl;
      l.sharees = shareesInShared[index].length;
    });

    return { lists, sharedLists, user: user };
  } catch (e) {
    console.error(e);
  }
};

export const actions = {
  createList: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const listName = data.get('list-name') as string;

    try {
      const list = {
        name: listName
      };

      const response = await fetch(`${API}/lists`, {
        method: 'POST',
        body: JSON.stringify(list)
      });

      if (response.status !== 200) {
        return fail(400);
      }
    } catch (e) {
      console.error(e);
    }
  }
} satisfies Actions;
