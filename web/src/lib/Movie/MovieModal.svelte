<style>
  dialog {
    width: 32em;
    border-radius: 0.8em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  dialog[open]::backdrop {
    animation: fade 0.5s ease-out;
  }

  @keyframes zoom {
    from {
      transform: scale(0.75);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
  import MovieResult from './MovieResult.svelte';
  import type { TMDBMovieResult } from '../../ambient';

  export let showModal: boolean;
  export let listId: string;
  let movieTitle: string;
  let movies: TMDBMovieResult[] = [];
  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) {
    dialog.showModal();
  }

  const closeDialog = () => dialog.close();

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this="{dialog}"
  on:close="{() => (showModal = false)}"
  on:click|self="{closeDialog}"
  class="bg-background text-text rounded-xl"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click|stopPropagation>
    <div class="p-4">
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
          ><FontAwesomeIcon
            class="text-text text-md"
            icon="{faMagnifyingGlass}"
          /></button
        >
      </div>
      {#if movies.length}
        <h2 class="font-bold text-2xl underline text-center mt-4 mb-2">results</h2>
        {#each movies as movie (movie.id)}
          <MovieResult movie="{movie}" listId="{listId}" />
        {/each}
      {/if}
      <div class="flex max-w-xs m-auto pt-2 justify-around">
        <button on:click|self="{closeDialog}">cancel</button>
      </div>
    </div>
  </div>
</dialog>
