<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { addToast } from '../../store';
  import { success, error } from './messages';

  export let listId: string;
</script>

<div
  class="bg-background border-2 border-secondary-hover border-solid rounded-xl my-2 p-3 h-32"
>
  <form
    method="POST"
    action="?/submitComment"
    use:enhance={() => {
      return async ({ result, update }) => {
        if (result.type === 'failure') {
          addToast(error);
        } else if (result.type === 'success') {
          addToast(success);
          invalidateAll();
          update({ reset: true });
        }
        await applyAction(result);
      };
    }}
  >
    <input type="hidden" name="listId" value={listId} />
    <textarea
      class="text-background p-1 w-full h-16 rounded-md"
      name="text"
      id="text"
      placeholder="what do you think about this list?"
      required
    ></textarea>
    <div class="text-center">
      <button type="submit">submit</button>
    </div>
  </form>
</div>
