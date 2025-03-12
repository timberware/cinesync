<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  export let showModal: boolean;
</script>

<Modal bind:showModal>
  <form method="POST" action="lists?/createList">
    <div class="pt-4 pb-6">
      <h2 class="font-bold text-4xl underline text-center mb-4">list</h2>
      <div class="flex pt-2 pb-2 justify-center">
        <label class="mr-4 text-right" for="list-name">name</label>
        <input
          class="text-background pl-1"
          type="text"
          name="list-name"
          id="list-name"
          placeholder="40s movies"
          required
        />
      </div>
    </div>
    <div class="flex pb-5 justify-around">
      <button type="submit">create</button>
    </div>
  </form>
</Modal>
