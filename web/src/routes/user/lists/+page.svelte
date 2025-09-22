<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import ListsContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import TopSection from '$lib/TopSection.svelte';
  import Title from '$lib/Title.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let showModal = $state(false);
  const { user, lists, sharedLists } = data;

  let selected = $state(0);

  const listSections = [
    {
      name: 'lists',
      lists: lists
    },
    {
      name: 'shared with you',
      lists: sharedLists
    }
  ];
</script>

<Nav username={user.username} />
<TopSection>
  <div class="flex gap-x-4 px-2 bg-secondary rounded-t-2xl py-1">
    {#each listSections as section, index}
      <Title
        onClick={() => {
          selected = index;
        }}
        isActive={index === selected}>{section.name}</Title
      >
      {#if index !== listSections.length - 1}
        <div>\</div>
      {/if}
    {/each}
  </div>
  <button type="button" class="min-h-full" onclick={() => (showModal = true)}>
    <FontAwesomeIcon class="text-text" icon={faPlusCircle} />
  </button>
</TopSection>

{#each listSections as section, index}
  <div
    class={`${index !== selected ? 'hidden' : 'display'} bg-secondary rounded-tr-2xl rounded-b-2xl p-3`}
  >
    <ListsContainer lists={section.lists ?? []} />
  </div>
{/each}

<ListModal bind:showModal />
