import { redirect } from '@sveltejs/kit';
import { API_HOST } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals }) => {
  let status = 404;

  try {
    const response = await fetch(
      `${process.env.API_HOST || API_HOST || 'http://localhost:4000'}/auth/whoami`,
      {
        method: 'GET',
        headers: {
          Authorization: locals.cookie || ''
        }
      }
    );

    status = response.status;
  } catch (e) {
    console.error(e);
  }

  redirect(301, status === 200 ? '/user/lists' : '/login');
};
