<script lang="ts">
  import ListsContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import TopSection from '$lib/TopSection.svelte';
  import type { PageProps } from './$types';
  import Pagination from '$lib/Pagination.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>cinesync - /shared</title>
</svelte:head>

<Nav username={data.user?.username ?? 'someone'} />
<TopSection>
  <button type="button" class="ml-auto bg-secondary rounded-t-2xl px-2 pt-1" disabled>
    <FontAwesomeIcon class="text-text" icon={faMagnifyingGlass} />
  </button>
</TopSection>

<div class="bg-secondary rounded-tl-2xl rounded-bl-2xl p-3">
  <ListsContainer lists={data.lists} path="shared" />
</div>
{#if data.pagination}
  <Pagination tags={data.pagination} />
{/if}
