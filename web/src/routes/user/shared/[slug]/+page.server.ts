import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import type { ListInfoType, Movies, User } from '../../../../ambient.d';
import { API } from '../../../../utils';
import { togglePrivacy } from './actions/togglePrivacy.js';
import { deleteList } from './actions/deleteList.js';
import { updateList } from './actions/updateList.js';
import { cloneList } from './actions/cloneList.js';
import { shareList } from './actions/shareList.js';
import { updateListInfo } from './actions/updateListInfo.js';
import { toggleWatched } from './actions/toggleWatch.js';
import { deleteMovie } from './actions/deleteMovie.js';
import { submitComment } from './actions/submitComment.js';

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
  const { slug: listId } = params;
  const { user } = locals;

  if (!listId) {
    return fail(404);
  }

  if (!user) {
    return fail(401);
  }

  try {
    const [moviesResponse, shareesResponse, listInfoResponse] = await Promise.all([
      fetch(`${API}/movies?listId=${listId}`, {
        method: 'GET'
      }),
      fetch(`${API}/lists/${listId}/sharees`, {
        method: 'GET'
      }),
      fetch(`${API}/lists/${listId}`, {
        method: 'GET'
      })
    ]);

    if (moviesResponse.status !== 200 || listInfoResponse.status !== 200) {
      return { user };
    }

    const { movies }: Movies = await moviesResponse.json();
    const listInfo: ListInfoType = await listInfoResponse.json();

    if (shareesResponse.status !== 200) {
      return { movies, user, listId };
    }

    const sharees: User[] = await shareesResponse.json();

    const userAndSharees = [user, ...sharees];
    const watchedByUsersResponse = await Promise.all(
      userAndSharees.map(sharee =>
        fetch(`${API}/movies?listId=${listId}&userId=${sharee.id}&per_page=999`, {
          method: 'GET'
        })
      )
    );

    const watchedByUsers: Movies[] = await Promise.all(
      watchedByUsersResponse.map(r => r.json())
    );

    watchedByUsers[0].movies.forEach(movie => {
      const index = movies.findIndex(m => m.id === movie.id);
      if (index !== -1) {
        movies[index].watched = true;
      }
    });

    if (sharees.length) {
      watchedByUsers.slice(1).forEach((w, i) => {
        sharees[i].watched = w.movies.map(m => m.id);
      });
    }
    const comments = listInfo.comments.map(comment => {
      const user = userAndSharees.find(u => u.id === comment.userId);

      if (user) comment.username = user.username;

      return comment;
    });

    return {
      movies,
      user,
      list: {
        id: listId,
        name: listInfo.name,
        isPrivate: listInfo.isPrivate,
        creatorId: listInfo.creatorId
      },
      sharees,
      comments
    };
  } catch (e) {
    console.error(e);
  }
};

export const actions = {
  togglePrivacy,
  deleteList,
  updateList,
  cloneList,
  shareList,
  updateListInfo,
  toggleWatched,
  deleteMovie,
  submitComment
} satisfies Actions;
