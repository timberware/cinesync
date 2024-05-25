<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import type { MovieType, User } from '../../../../ambient';
  import Nav from '$lib/Nav/Nav.svelte';
  import Movie from '$lib/Movie/Movie.svelte';
  import MovieModal from '$lib/Movie/MovieModal.svelte';
  import MoviesSection from '$lib/Movie/MoviesSection.svelte';
  import TopSection from '$lib/TopSection.svelte';

  export let data: {
    user: User;
    movies: MovieType[];
    list: {
      id: string;
      name: string;
    };
  };

  const { user, movies, list } = data;
  let showModal = false;
  let toBeDeleted: string;
  let displayedMovies = movies;

  const deleteMovieFromList = (id: string) => {
    if (id) {
      const filteredList = displayedMovies.filter(m => m.id !== id);

      if (filteredList.length) {
        displayedMovies = filteredList;
      }
      toBeDeleted = '';
    }
  };

  $: deleteMovieFromList(toBeDeleted);
</script>

<Nav username="{user.username}" />
<TopSection>
  <div>{list.name}</div>
  <button type="button" class="min-h-full" on:click="{() => (showModal = true)}">
    <FontAwesomeIcon class="text-text" icon="{faPlusCircle}" />
  </button>
</TopSection>
<MoviesSection>
  {#if displayedMovies?.length}
    {#each displayedMovies as movie (movie.id)}
      <Movie listId="{list.id}" movie="{movie}" bind:toBeDeleted="{toBeDeleted}" />
    {/each}
  {/if}
</MoviesSection>

<MovieModal bind:showMovieModal="{showModal}" listId="{list.id}" />
