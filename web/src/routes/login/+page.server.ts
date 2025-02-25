import { redirect, fail } from '@sveltejs/kit';
import type { RequestEvent } from './$types.js';
import { API_HOST } from '$env/static/private';
import { AUTHORIZATION } from '../../utils/consts.js';

const API = process.env.API_HOST || API_HOST || 'http://localhost:4000';

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request, fetch, cookies, locals }: RequestEvent) => {
    locals.user = null;
    cookies.delete(AUTHORIZATION, {
      path: '/'
    });

    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await fetch(`${API}/auth/login`, {
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
        return fail(401);
      }

      const jwt = await response.json();
      cookies.set(AUTHORIZATION, `Bearer ${jwt.accessToken}`, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false
      });
    } catch (e) {
      console.error(e);
    }
    redirect(302, '/user/lists');
  }
};
