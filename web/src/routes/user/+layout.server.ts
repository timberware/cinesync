import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
  if (url.pathname === '/user') {
    redirect(301, '/user/lists');
  }
};
