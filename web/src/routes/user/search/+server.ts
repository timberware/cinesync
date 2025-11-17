import { json, type RequestHandler } from '@sveltejs/kit';
import { API, parsePaginationInfo, PER_PAGE } from '../../../utils';
import type { Lists, ListType, PaginationType } from '../../../ambient';

export const GET: RequestHandler = async ({ url, locals, fetch }) => {
  try {
    const { user } = locals;
    const search = url.searchParams.get('search');
    const page = url.searchParams.get('page_number');

    if (!search) {
      return new Response();
    }

    const res = await fetch(
      `${API}/lists?id=${user?.id}&search=${search}&page_number=${page}&per_page=${PER_PAGE}`,
      {
        method: 'GET'
      }
    );

    if (res.status !== 200) {
      throw new Error();
    }

    const pagination: PaginationType = parsePaginationInfo(res.headers.get('link'));
    const { lists }: Lists = await res.json();

    const moviesInListsResponse = await Promise.all(
      lists.map((l: ListType) =>
        fetch(`${API}/movies?listId=${l.id}`, {
          method: 'GET'
        })
      )
    );

    const moviesInLists = await Promise.all(moviesInListsResponse.map(m => m.json()));

    lists.forEach((l, index) => {
      l.movies = moviesInLists[index].movies.length;
      l.posterUrl =
        l.movies &&
        moviesInLists[index].movies[Math.floor(Math.random() * l.movies)]?.posterUrl;
    });

    return json({ lists, pagination });
  } catch (e) {
    console.error({ error: e });
    return json([]);
  }
};
