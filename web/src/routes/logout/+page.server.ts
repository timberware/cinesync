import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';

/** @type {import('./$types').Actions} */
export const actions = {
  logout: async ({ locals, cookies }: RequestEvent) => {
    locals.user = null;
    locals.cookie = null;
    cookies.delete('Authorization', {
      path: '/'
    });

    redirect(301, '/signin');
  }
};
