import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { API } from './utils';

const AUTH_PATHS = ['/login', '/', '/signup'];

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
