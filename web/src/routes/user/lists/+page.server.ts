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
