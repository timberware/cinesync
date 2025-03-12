import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const AUTH_PATHS = ['/login', '/', '/signup'];
const API = process.env.API_HOST || env.API_HOST || 'http://localhost:4000';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await event.fetch(`${API}/auth/whoami`, {
    method: 'GET'
  });

  const user = await response.json();

  if (user && response.status === 200) {
    event.locals.user = user;
  }

  if (!event.locals.user && !AUTH_PATHS.includes(event.url.pathname)) {
    redirect(302, '/login');
  } else if (event.locals.user && AUTH_PATHS.includes(event.url.pathname)) {
    redirect(302, '/user/lists');
  }

  return await resolve(event);
};
