import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

const API = process.env.API_HOST || env.API_HOST || 'http://localhost:4000';

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
