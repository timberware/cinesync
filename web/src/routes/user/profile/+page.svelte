<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import Avatar from '$lib/Avatar.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import Toasts from '$lib/Toast/Toasts.svelte';
  import { addToast } from '../../../store';
  import type { PageData } from './$types';
  import { error, success } from './messages';

  let { data }: PageData = $props();
  const { user, stats } = data;
</script>

<Toasts />

<svelte:head>
  <title>cinesync - /profile</title>
</svelte:head>

<Nav username={user.username} />
<div class="sm:flex w-full justify-around mt-20 mx-auto">
  <div class="max-w-64 text-center mx-auto mb-8 sm:mb-0">
    <Avatar username={user.username} isLarge />
    <form
      method="POST"
      action="?/saveAvatar"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'failure') {
            addToast(error);
          } else if (result.type === 'success') {
            addToast(success);
          }
          await applyAction(result);
        };
      }}
      enctype="multipart/form-data"
    >
      <input
        type="file"
        name="file"
        accept="image/jpeg, image/png"
        class="mt-4 p-0 file:mr-2 file:py-2 file:px-2
            file:rounded-full file:border-0
            file:text-sm file:bg-primary max-w-64"
        required
      />
      <button type="submit" class="mt-4">Upload</button>
    </form>
  </div>
  <div
    class="max-w-md sm:max-w-xl mx-auto text-xl sm:text-2xl grid content-evenly pl-8 sm:pl-0"
  >
    <div>email: {user.email}</div>
    <div>lists: {stats.listCount}</div>
    <div>movies: {stats.moviesCount}</div>
    <div>shared with you: {stats.sharedListCount}</div>
    <div>comments: {stats.commentsCount}</div>
  </div>
</div>
