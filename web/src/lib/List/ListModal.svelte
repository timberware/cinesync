<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  export let showModal: boolean;
</script>

<Modal showModal="{showModal}" ctaLabel="create">
  <form method="POST" action="lists?/createList">
    <div class="w-xl px-4 pt-4 pb-6">
      <h2 class="font-bold text-4xl underline text-center mb-4">list</h2>
      <div class="flex pt-2 pb-2">
        <label class="w-20 text-right pr-4" for="list-name">name</label>
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
  </form>
</Modal>
