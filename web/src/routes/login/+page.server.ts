import { redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { AUTHENTICATION } from '../../utils/consts.js';
import setCookieParser from 'set-cookie-parser';
import type { Actions } from './$types.js';

const API = process.env.API_HOST || env.API_HOST || 'http://localhost:4000';

export const actions = {
  login: async ({ request, cookies, locals }) => {
    locals.user = null;
    cookies.delete(AUTHENTICATION, {
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

      const cookiesInResponse = response.headers.getSetCookie();
      if (cookiesInResponse.length) {
        const [cookie] = setCookieParser(cookiesInResponse);
        cookies.set(AUTHENTICATION, cookie.value, {
          path: cookie.path ?? '/',
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          expires: cookie.expires
        });
      }
    } catch (e) {
      console.error(e);
    }
    redirect(302, '/user/lists');
  }
} satisfies Actions;
