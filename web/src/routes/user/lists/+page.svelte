<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import { page } from '$app/stores';
  import ListContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import type { ListType, User } from '../../../ambient';
  import TopSection from '$lib/TopSection.svelte';

  export let data: {
    user: User;
    lists: ListType[];
    sharedLists: ListType[];
  };

  let showModal = false;
  const { user, lists, sharedLists } = data;
  console.log({ page: $page });
</script>

<Nav username="{user.username}" />
<TopSection>
  <div>your lists</div>
  <button type="button" class="min-h-full" on:click="{() => (showModal = true)}">
    <FontAwesomeIcon class="text-text" icon="{faPlusCircle}" />
  </button>
</TopSection>
<ListContainer lists="{lists}" />
<div class="flex md:text-3xl sm:text-2xl mt-10 mb-4 mx-5 justify-between">
  <div>shared with you</div>
</div>
<ListContainer lists="{sharedLists}" />

<ListModal bind:showModal="{showModal}" />
