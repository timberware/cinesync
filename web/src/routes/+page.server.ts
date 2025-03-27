import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API } from '../utils';

export const load: PageServerLoad = async ({ fetch }) => {
  let status = 404;

  try {
    const response = await fetch(`${API}/auth/whoami`, {
      method: 'GET'
    });

    status = response.status;
  } catch (e) {
    console.error(e);
  }

  redirect(301, status === 200 ? '/user/lists' : '/login');
};
