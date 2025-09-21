import { fail } from '@sveltejs/kit';
import { API } from '../../../../../utils';
import type { RequestEvent } from '../$types';

export const updateList = async ({ request, fetch }: RequestEvent) => {
  const data = await request.formData();
  const listId = data.get('listId') as string;
  const title = data.get('title') as string;
  const description = data.get('description') as string;
  const genre = data.get('genre') as string;
  const releaseDate = data.get('releaseDate') as string;
  const posterUrl = data.get('posterUrl') as string;
  const rating = data.get('rating');
  const tmdbId = data.get('tmdbId') as string;

  try {
    const response = await fetch(`${API}/movies/lists/${listId}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        movie: [
          {
            title,
            description,
            genre: genre?.split('.'),
            releaseDate,
            posterUrl,
            rating: Number(rating),
            tmdbId: +tmdbId
          }
        ]
      })
    });

    if (response.status !== 200) {
      return fail(400);
    }
  } catch (e) {
    console.error(e);
  }
};
