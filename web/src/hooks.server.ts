import { redirect } from '@sveltejs/kit';
import { API_HOST } from '$env/static/private';

const AUTH_PATHS = ['/login', '/', '/signup'];

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  const jwt = event.cookies.get('Authorization');

  const response = await event.fetch(
    `${API_HOST || 'http://localhost:4000'}/auth/whoami`,
    {
      method: 'GET',
      headers: {
        Authorization: jwt || ''
      }
    }
  );

  const user = await response.json();

  if (user && response.status === 200) {
    event.locals.user = user;
    event.locals.cookie = jwt || null;
  }

  if (!event.locals.user && !AUTH_PATHS.includes(event.url.pathname)) {
    redirect(302, '/login');
  } else if (event.locals.user && AUTH_PATHS.includes(event.url.pathname)) {
    redirect(302, '/user/lists');
  }

  return await resolve(event);
};
