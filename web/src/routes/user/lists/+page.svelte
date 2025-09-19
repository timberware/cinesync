<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import ListContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import type { ListType, User } from '../../../ambient';
  import TopSection from '$lib/TopSection.svelte';
  import Title from '$lib/Title.svelte';

  export let data: {
    user: User;
    lists: ListType[];
    sharedLists: ListType[];
  };

  let showModal = false;
  const { user, lists, sharedLists } = data;
</script>

<Nav username={user.username} />
<TopSection>
  <Title>your lists</Title>
  <button type="button" class="min-h-full" on:click={() => (showModal = true)}>
    <FontAwesomeIcon class="text-text" icon={faPlusCircle} />
  </button>
</TopSection>
<ListContainer {lists} />

{#if sharedLists.length}
  <div class="flex text-2xl mt-10 mb-4 mx-5 justify-between">
    <Title>shared with you</Title>
  </div>
  <ListContainer lists={sharedLists} />
{/if}

<ListModal bind:showModal />
