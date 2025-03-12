import { redirect } from '@sveltejs/kit';
import { AUTHENTICATION } from '../../utils/consts.js';
import type { Actions } from './$types.js';

export const actions = {
  logout: async ({ locals, cookies }) => {
    locals.user = null;
    cookies.delete(AUTHENTICATION, {
      path: '/'
    });

    redirect(301, '/');
  }
} satisfies Actions;
