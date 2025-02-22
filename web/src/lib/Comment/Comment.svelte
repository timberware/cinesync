<script lang="ts">
  import { fade } from 'svelte/transition';
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Avatar from '$lib/Avatar.svelte';
  import type { Comment } from '../../ambient';
  import { addToast } from '../../store';
  import { success, error } from './messages';

  export let comments: Comment[];
  export let listId: string;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<div class="w-full relative rounded-xl bg-secondary mb-4 p-3">
  <div class="max-h-96 overflow-y-auto">
    {#each comments as comment (comment.id)}
      <div
        class="bg-background border-2 border-secondary-hover border-solid rounded-xl my-3 p-3"
        transition:fade
      >
        <div class="pb-2 mb-4 border-text border-b-2 border-solid">
          <Avatar username="{comment.username ?? 'deleted user'}" />
          {comment.username ?? 'deleted user'}
        </div>
        <p>
          {comment.text}
        </p>
        <div class="text-right">
          {new Date(comment.createdAt).toLocaleString('en-US', { timeZone: timezone })}
        </div>
      </div>
    {/each}
  </div>
  <div
    class="bg-background border-2 border-secondary-hover border-solid rounded-xl my-2 p-3 h-32"
  >
    <form
      method="POST"
      action="?/submitComment"
      use:enhance="{() => {
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
      }}"
    >
      <input type="hidden" name="listId" value="{listId}" />
      <textarea
        class="text-background p-1 w-full h-16 rounded-md"
        name="text"
        id="text"
        placeholder="what do you think about this list?"
        required></textarea>
      <div class="text-center">
        <button type="submit">submit</button>
      </div>
    </form>
  </div>
</div>
