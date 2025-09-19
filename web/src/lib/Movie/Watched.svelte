<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import IconButton from '$lib/IconButton.svelte';
  import { faEye } from '@fortawesome/free-solid-svg-icons';
  import Toasts from '$lib/Toast/Toasts.svelte';
  import { addToast } from '../../store/toast';
  import { watchedError, watchedSuccess } from './messages';

  export let movieId: string;
  export let watched: boolean;
</script>

<Toasts />

<form
  method="POST"
  action="?/toggleWatched"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'failure') {
        addToast(watchedError);
      } else if (result.type === 'success') {
        addToast(watchedSuccess);
        invalidateAll();
      }
      await applyAction(result);
    };
  }}
>
  <input type="hidden" name="movieId" value={movieId} />
  <IconButton
    type="submit"
    icon={faEye}
    tooltip={`tag as ${watched ? 'not watched' : 'watched'}`}
  />
</form>
