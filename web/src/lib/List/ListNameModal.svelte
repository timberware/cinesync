<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  export let listId: string;
  export let showListNameModal: boolean;
</script>

<Modal showModal="{showListNameModal}">
  <form method="POST" action="?/updateListInfo">
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
      <button type="submit">save</button>
    </div>
  </form>
</Modal>
