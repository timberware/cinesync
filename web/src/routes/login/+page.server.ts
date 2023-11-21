import { redirect } from '@sveltejs/kit';
import { API_HOST } from '$env/static/private';
import type { RequestEvent } from './$types.js';

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request, fetch, cookies, locals }: RequestEvent) => {
    locals.user = null;
    locals.cookie = null;
    cookies.delete('Authorization');

    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await fetch(`${API_HOST || 'http://localhost:3000'}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.status !== 200) {
        return await response.json();
      }

      const jwt = await response.json();
      cookies.set('Authorization', `Bearer ${jwt.accessToken}`, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false
      });
    } catch (e) {
      console.error(e);
    }

    throw redirect(302, '/user/lists');
  }
};
