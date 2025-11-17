<script lang="ts">
  import Nav from '$lib/Nav/Nav.svelte';
  import TopSection from '$lib/TopSection.svelte';
  import type { PageProps } from './$types';
  import Head from '$lib/Head.svelte';
  import type { ListType, PaginationType } from '../../../ambient';
  import ListsContainer from '$lib/List/ListsContainer.svelte';
  import SearchPagination from '$lib/SearchPagination.svelte';
  import { DEFAULT_PAGINATION } from '../../../utils';

  let { data }: PageProps = $props();

  let searchInput: string = $state('');
  let timer: NodeJS.Timeout;
  let searchResults: ListType[] = $state([]);
  let currentPage: string = $state('0');
  let paginationResults: PaginationType = $state(DEFAULT_PAGINATION);

  const handleInput = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
    const searchTerm = (e.target as HTMLInputElement).value;

    if (searchTerm.length) {
      timer = setTimeout(() => {
        searchInput = (e.target as HTMLInputElement).value;
      }, 600);
    } else {
      searchResults = [];
      paginationResults = DEFAULT_PAGINATION;
    }
  };

  $effect(() => {
    clearTimeout(timer);

    if (searchInput.length > 0) {
      (async () => {
        const res = await fetch(
          `/user/search?search=${searchInput}&page_number=${currentPage}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json'
            }
          }
        );

        if (res.status === 200) {
          const response = await res.json();

          const { lists, pagination } = response;
          searchResults = lists;
          paginationResults = pagination;
        }
        currentPage = paginationResults.curr;
      })();
    }

    return () => clearTimeout(timer);
  });
</script>

<Head title="cinesync - /search" />

<Nav username={data.user?.username ?? 'someone'} />
<TopSection>
  <div class="mr-auto bg-secondary rounded-t-2xl pt-1">
    <input
      id="search"
      name="search"
      type="search"
      onkeyup={handleInput}
      placeholder="search..."
      autocomplete="on"
      class={'text-text bg-secondary text-base border-b-2 border-primary mx-2 px-2 outline-none'}
    />
  </div>
</TopSection>

<div class="bg-secondary rounded-tr-2xl rounded-bl-2xl p-3">
  <ListsContainer lists={searchResults} path="lists" />
</div>
{#if paginationResults}
  <SearchPagination tags={paginationResults} bind:currentPage />
{/if}
