<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import { goto } from '$app/navigation';
  import { faTrash } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/IconButton.svelte';
  import { addToast } from '../../store/toast';
  import { deletedError, deletedSuccess } from './messages';

  export let listId: string;
</script>

<form
  method="POST"
  action="?/deleteList"
  use:enhance="{() => {
    return async ({ result }) => {
      if (result.type === 'failure') {
        addToast(deletedError);
      } else if (result.type === 'success') {
        addToast(deletedSuccess);
        goto('/user/lists');
      }
      await applyAction(result);
    };
  }}"
>
  <input type="hidden" name="listId" value="{listId}" />
  <IconButton type="submit" icon="{faTrash}" tooltip="delete List" />
</form>
