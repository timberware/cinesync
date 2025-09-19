<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { faTrash } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/IconButton.svelte';
  import { addToast } from '../../store/toast';
  import { deletedError, deletedSuccess } from './messages';

  export let listId: string;
  export let movieId: string;
</script>

<form
  method="POST"
  action="?/deleteMovie"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'failure') {
        addToast(deletedError);
      } else if (result.type === 'success') {
        addToast(deletedSuccess);
        invalidateAll();
      }
      await applyAction(result);
    };
  }}
>
  <input type="hidden" name="listId" value={listId} />
  <input type="hidden" name="movieId" value={movieId} />
  <IconButton type="submit" icon={faTrash} tooltip="delete movie" />
</form>
