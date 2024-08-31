<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Modal from '$lib/Modal.svelte';
  import { addToast } from '../../store';
  import { updateNameSuccess, updateNameError } from './messages';

  export let listId: string;
  export let showListNameModal: boolean;
</script>

<Modal showModal="{showListNameModal}">
  <form
    method="POST"
    action="?/updateListInfo"
    use:enhance="{() => {
      return async ({ result }) => {
        if (result.type === 'failure') {
          addToast(updateNameError);
        } else if (result.type === 'success') {
          addToast(updateNameSuccess);
          invalidateAll();
        }
        await applyAction(result);
        showListNameModal = false;
      };
    }}"
  >
    <div class="w-xl p-4">
      <h2 class="font-bold text-4xl underline text-center mb-4">name</h2>
      <div class="flex pt-2 pb-2 mx-auto">
        <label class="w-24 text-right pr-4" for="name">name</label>
        <input
          class="text-background pl-1"
          type="text"
          name="name"
          id="name"
          placeholder="80s and 90s"
          required
        />
        <input type="hidden" name="listId" value="{listId}" />
      </div>
    </div>
    <div class="flex pb-5 justify-around">
      <button type="submit">update</button>
    </div>
  </form>
</Modal>
