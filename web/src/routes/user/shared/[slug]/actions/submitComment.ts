import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const submitComment = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const listId = data.get('listId');
  const text = data.get('text');

  try {
    const response = await fetch(`${API}/lists/${listId}/comments`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (response.status !== 204) {
      return fail(400);
    }
  } catch (e) {
    console.error(e);
  }
};
