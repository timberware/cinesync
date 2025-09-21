import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const deleteList = async ({ request, fetch }: RequestEvent) => {
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
};
