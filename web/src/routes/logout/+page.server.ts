import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import { AUTHORIZATION } from '../../utils/consts.js';

/** @type {import('./$types').Actions} */
export const actions = {
  logout: async ({ locals, cookies }: RequestEvent) => {
    locals.user = null;
    cookies.delete(AUTHORIZATION, {
      path: '/'
    });

    redirect(301, '/');
  }
};
