<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import List from '$lib/List/List.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import type { ListType, User } from '../../../ambient';

  export let data: {
    user: User;
    lists: ListType[];
  };
  let showModal = false;
  const { user, lists } = data;
</script>

<Nav username="{user.username}" />
<div class="flex mt-7 mb-4">
  <button type="button" class="min-h-full pt-2" on:click="{() => (showModal = true)}">
    <FontAwesomeIcon class="text-text text-3xl" icon="{faPlusCircle}" />
  </button>
</div>
<div>
  {#if lists?.length}
    {#each lists as list (list.id)}
      <List list="{list}" />
    {/each}
  {/if}
</div>

<ListModal bind:showModal />
