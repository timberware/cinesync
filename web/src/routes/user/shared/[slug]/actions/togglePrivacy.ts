import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const togglePrivacy = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const listId = data.get('listId');
  const isPrivate = data.get('isPrivate');

  try {
    const response = await fetch(`${API}/lists/${listId}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        isPrivate: !(isPrivate === 'true')
      })
    });

    if (response.status !== 200) {
      return fail(400);
    }
  } catch (e) {
    console.error(e);
  }
};
