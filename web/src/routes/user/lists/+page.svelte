<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import ListContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import type { ListType, User } from '../../../ambient';

  export let data: {
    user: User;
    lists: ListType[];
    sharedLists: ListType[];
  };

  let showModal = false;
  const { user, lists, sharedLists } = data;
</script>

<Nav username="{user.username}" />
<div class="flex md:text-3xl sm:text-2xl mt-10 mb-4 mx-5 justify-between">
  <div>your lists</div>
  <button type="button" class="min-h-full" on:click="{() => (showModal = true)}">
    <FontAwesomeIcon class="text-text" icon="{faPlusCircle}" />
  </button>
</div>
<ListContainer lists="{lists}" />
<div class="flex md:text-3xl sm:text-2xl mt-10 mb-4 mx-5 justify-between">
  <div>shared with you</div>
</div>
<ListContainer lists="{sharedLists}" />

<ListModal bind:showModal="{showModal}" />
