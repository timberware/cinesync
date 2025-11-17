<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import ListsContainer from '$lib/List/ListsContainer.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import ListModal from '$lib/List/ListModal.svelte';
  import TopSection from '$lib/TopSection.svelte';
  import type { PageProps } from './$types';
  import Pagination from '$lib/Pagination.svelte';
  import Head from '$lib/Head.svelte';

  let { data }: PageProps = $props();

  let showModal = $state(false);
</script>

<Head title="cinesync - /lists" />

<Nav username={data.user?.username ?? 'someone'} />
<TopSection>
  <button
    type="button"
    class="ml-auto bg-secondary rounded-t-2xl px-2 pt-1"
    onclick={() => (showModal = true)}
  >
    <FontAwesomeIcon class="text-text" icon={faPlusCircle} />
  </button>
</TopSection>

<div class="bg-secondary rounded-tl-2xl rounded-bl-2xl p-3">
  <ListsContainer lists={data.lists} path="lists" />
</div>
{#if data.pagination}
  <Pagination tags={data.pagination} />
{/if}

<ListModal bind:showModal />
