import type { Lists, ListType, PaginationType } from '../../../ambient';
import type { PageServerLoad } from './$types.js';
import { API, parsePaginationInfo, PER_PAGE } from '../../../utils';

export const load: PageServerLoad = async ({ fetch, locals, url }) => {
  const { user } = locals;

  if (!user) {
    return {};
  }

  try {
    const page = url.searchParams.get('page') ?? 0;

    const [listResponse] = await Promise.all([
      fetch(
        `${API}/lists?id=${user.id}&shared=true&per_page=${PER_PAGE}&page_number=${page}`,
        {
          method: 'GET'
        }
      )
    ]);

    if (listResponse.status !== 200) {
      return { user: user };
    }

    const { lists }: Lists = await listResponse.json();

    const pagination: PaginationType = parsePaginationInfo(
      listResponse.headers.get('link')
    );

    const [moviesInListsResponse, shareesResponse] = await Promise.all([
      Promise.all(
        lists.map((l: ListType) =>
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
      )
    ]);

    const moviesInLists = await Promise.all(moviesInListsResponse.map(m => m.json()));
    const sharees = await Promise.all(shareesResponse.map(sharee => sharee.json()));

    lists.forEach((l, index) => {
      l.movies = moviesInLists[index].movies.length;
      l.posterUrl =
        l.movies &&
        moviesInLists[index].movies[Math.floor(Math.random() * l.movies)]?.posterUrl;
      l.sharees = sharees[index].length;
    });

    return {
      lists,
      user: user,
      pagination
    };
  } catch (e) {
    console.error(e);
  }
};
