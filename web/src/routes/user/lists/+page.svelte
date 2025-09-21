<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import ListContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import TopSection from '$lib/TopSection.svelte';
  import Title from '$lib/Title.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let showModal = $state(false);
  const { user, lists, sharedLists } = data;
</script>

<Nav username={user?.username ?? ''} />
<TopSection>
  <Title>your lists</Title>
  <button type="button" class="min-h-full" onclick={() => (showModal = true)}>
    <FontAwesomeIcon class="text-text" icon={faPlusCircle} />
  </button>
</TopSection>
<ListContainer lists={lists ?? []} />

{#if sharedLists?.length}
  <div class="flex text-2xl mt-10 mb-4 mx-5 justify-between">
    <Title>shared with you</Title>
  </div>
  <ListContainer lists={sharedLists} />
{/if}

<ListModal bind:showModal />
