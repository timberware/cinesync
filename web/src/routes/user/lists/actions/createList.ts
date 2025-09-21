import { fail } from '@sveltejs/kit';
import { API } from '../../../../utils';
import type { RequestEvent } from '../$types';

export const createList = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const listName = data.get('list-name') as string;

  try {
    const list = {
      name: listName
    };

    const response = await fetch(`${API}/lists`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(list)
    });

    if (response.status !== 201) {
      return fail(400);
    }
  } catch (e) {
    console.error(e);
  }
};
