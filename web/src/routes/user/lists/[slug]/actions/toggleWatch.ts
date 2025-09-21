import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const toggleWatched = async ({ request, fetch }: RequestEvent) => {
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
};
