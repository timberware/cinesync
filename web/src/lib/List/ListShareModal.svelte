<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  export let listId: string;
  export let showShareListModal: boolean;
</script>

<Modal showModal="{showShareListModal}">
  <form method="POST" action="?/shareList">
    <div class="w-xl p-4">
      <h2 class="font-bold text-4xl underline text-center mb-4">share list</h2>
      <div class="flex pt-2 pb-2">
        <label class="w-18 text-right pr-4" for="username">username</label>
        <input
          class="text-background pl-1"
          type="text"
          name="username"
          id="username"
          placeholder="cinesync"
          required
        />
        <input type="hidden" name="listId" value="{listId}" />
      </div>
    </div>
    <div class="flex pb-5 justify-around">
      <button type="submit">share</button>
    </div>
  </form>
</Modal>
