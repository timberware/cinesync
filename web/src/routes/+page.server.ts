import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { AUTHORIZATION } from '../utils/consts.js';

const API = process.env.API_HOST || env.API_HOST || 'http://localhost:4000';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies }) => {
  let status = 404;

  try {
    const response = await fetch(`${API}/auth/whoami`, {
      method: 'GET',
      headers: {
        Authorization: cookies.get(AUTHORIZATION) as string
      }
    });

    status = response.status;
  } catch (e) {
    console.error(e);
  }

  redirect(301, status === 200 ? '/user/lists' : '/login');
};
