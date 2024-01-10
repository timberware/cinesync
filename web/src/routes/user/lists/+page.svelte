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
<div class="flex text-3xl mt-10 mb-2 justify-between">
  <div class="pl-2">your lists</div>
  <button type="button" class="min-h-full" on:click="{() => (showModal = true)}">
    <FontAwesomeIcon class="text-text" icon="{faPlusCircle}" />
  </button>
</div>
<div>
  {#if lists?.length}
    {#each lists.filter(list => list.creatorUsername === user.username) as list (list.id)}
      <List list="{list}" user="{user}" />
    {/each}
  {/if}
</div>
{#if lists?.filter(list => list.creatorUsername !== user.username).length}
  <div class="flex text-3xl mt-14 mb-2 justify-between">
    <div class="pl-2">shared with you</div>
  </div>
  <div>
    {#each lists.filter(list => list.creatorUsername !== user.username) as list (list.id)}
      <List list="{list}" user="{user}" />
    {/each}
  </div>
{/if}

<ListModal bind:showModal="{showModal}" />
