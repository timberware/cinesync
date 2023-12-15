import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url }) {
  if (url.pathname === '/user') {
    redirect(301, '/user/lists');
  }
}
