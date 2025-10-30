import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const deleteMovie = async ({ request, fetch }: RequestEvent) => {
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
};
