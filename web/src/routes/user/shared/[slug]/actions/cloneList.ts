import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const cloneList = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const listId = data.get('listId');
  const name = data.get('name');

  try {
    const response = await fetch(`${API}/lists/${listId}/clone`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (response.status !== 201) {
      return fail(400);
    }
  } catch (e) {
    console.error(e);
  }
};
