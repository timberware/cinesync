<script lang="ts">
  import Modal from '$lib/Modal.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
  import MovieResult from './MovieResult.svelte';
  import type { TMDBMovieResult } from '../../ambient';

  export let showMovieModal: boolean;
  export let listId: string;
  let movieTitle: string;
  let movies: TMDBMovieResult[] = [];

  const handleOnClick = async () => {
    const response = await fetch(`/search?movieTitle=${movieTitle}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });

    if (response.status === 200) {
      movies = await response.json();
    }
  };
</script>

<Modal showModal="{showMovieModal}">
  <div class="p-4 w-4/5">
    <h2 class="font-bold text-4xl underline text-center mb-4">movie</h2>
    <div class="flex pt-2 pb-2 justify-around">
      <label class="w-20 text-right" for="list-name">title</label>
      <input
        class=" text-background pl-1"
        type="text"
        name="movie-name"
        id="movie-name"
        placeholder="The Godfather"
        bind:value="{movieTitle}"
        required
      />
      <button type="button" on:click="{handleOnClick}"
        ><FontAwesomeIcon class="text-text text-md" icon="{faMagnifyingGlass}" /></button
      >
    </div>
    {#if movies.length}
      <h2 class="font-bold text-2xl underline text-center mt-4 mb-2">results</h2>
      {#each movies as movie (movie.id)}
        <MovieResult movie="{movie}" listId="{listId}" />
      {/each}
    {/if}
  </div>
</Modal>
