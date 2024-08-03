import { API_HOST } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import type { Stats } from '../../../ambient';
import type { RequestEvent } from '../$types';

const API = process.env.API_HOST || API_HOST || 'http://localhost:4000';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, locals }) => {
  const { user } = locals;

  if (!user) {
    return {};
  }

  try {
    const userStats = await fetch(`${API}/users/${user.id}/stats`, {
      method: 'GET',
      headers: {
        Authorization: locals.cookie as string
      }
    });

    if (userStats.status !== 200) {
      return { user: user };
    }

    const stats: Stats = await userStats.json();

    return { user, stats };
  } catch (e) {
    console.error(e);
  }
};

/** @type {import('./$types').Actions} */
export const actions = {
  saveAvatar: async ({ request, fetch, locals }: RequestEvent) => {
    const data = await request.formData();
    const avatar = data.get('file') as File;

    if (!(avatar as File).name || (avatar as File).name === 'undefined') {
      return fail(400, {
        error: true,
        message: 'You must provide a file to upload'
      });
    }

    const image = new Blob([await avatar.arrayBuffer()], { type: avatar.type });
    const formData = new FormData();
    formData.set('image', image, avatar.name);

    try {
      const response = await fetch(`${API}/users/avatar`, {
        method: 'POST',
        headers: {
          Authorization: locals.cookie as string
        },
        body: formData
      });

      if (response.status !== 201) {
        return fail(response.status);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
