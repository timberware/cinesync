<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
  import MovieResult from './MovieResult.svelte';
  import type { MovieWithLists } from '../../ambient';

  export let showMovieModal: boolean;
  export let listId: string;
  let search: string;
  let movies: MovieWithLists[] = [];

  const handleOnClick = async () => {
    const response = await fetch(`/search?search=${search}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });

    if (response.status === 200) {
      movies = await response.json();
    }
  };

  const handleKeyPress = async (e: KeyboardEvent) => {
    e.key === 'Enter' && (await handleOnClick());
  };
</script>

<Modal bind:showModal="{showMovieModal}">
  <div class="p-4">
    <h2 class="font-bold text-4xl underline text-center mb-4">search</h2>
    <div class="flex pt-2 pb-2 mb-3 justify-center">
      <label class="text-right pr-4" for="list-name">title</label>
      <input
        class=" text-background pl-1"
        type="text"
        name="movie-name"
        id="movie-name"
        placeholder="The Godfather"
        bind:value="{search}"
        required
        on:keypress="{handleKeyPress}"
      />
      <button class="pl-4" type="button" on:click="{handleOnClick}"
        ><FontAwesomeIcon class="text-text text-md" icon="{faMagnifyingGlass}" /></button
      >
    </div>
    {#if movies.length}
      <h2 class="font-bold text-2xl underline text-center mt-4 mb-2">results</h2>
      {#each movies as movie (movie.tmdbId)}
        <MovieResult bind:showMovieModal {movie} {listId} />
      {/each}
    {/if}
  </div>
</Modal>
