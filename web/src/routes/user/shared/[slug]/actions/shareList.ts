import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const shareList = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const listId = data.get('listId');
  const username = data.get('username');

  try {
    const response = await fetch(`${API}/lists/${listId}/toggleShareByUsername`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (response.status !== 204) {
      return fail(400);
    }
  } catch (e) {
    console.error(e);
  }
};
