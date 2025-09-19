<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import { faClone } from '@fortawesome/free-solid-svg-icons';
  import IconButton from '$lib/IconButton.svelte';
  import { addToast } from '../../store/toast';
  import { clonedError, clonedSuccess } from './messages';

  export let listId: string;
  export let name: string;
</script>

<form
  method="POST"
  action="?/cloneList"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === 'failure') {
        addToast(clonedError);
      } else if (result.type === 'success') {
        addToast(clonedSuccess);
      }
      await applyAction(result);
    };
  }}
>
  <input type="hidden" name="listId" value={listId} />
  <input type="hidden" name="name" value={name} />
  <IconButton type="submit" icon={faClone} tooltip="clone list" />
</form>
