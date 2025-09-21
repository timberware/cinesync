import { redirect, fail } from '@sveltejs/kit';
import { API } from '../../../utils';
import type { RequestEvent } from '../$types';

export const signup = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const username = data.get('username');
  const email = data.get('email');
  const password = data.get('password');

  try {
    const response = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    if (response.status !== 201) {
      return fail(response.status);
    }

    await response.json();
  } catch (e) {
    console.error(e);
  }
  redirect(302, '/user/login');
};
