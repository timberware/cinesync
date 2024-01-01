<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import type { TMDBMovieResult } from '../../ambient';
  import Image from '$lib/Image.svelte';
  import Label from './Label.svelte';
  import { getPosterUrl } from '../../utils';

  export let movie: TMDBMovieResult;
  export let listId: string;
</script>

<div class="w-96 h-80 flex rounded-xl bg-background p-3 flex-shrink-0 mb-5">
  <div class="relative w-2/5 mr-3 rounded-md">
    <div><Image src="{getPosterUrl(movie.poster_path)}" watched="{true}" /></div>
    <p class="pt-2"><Label>rating:</Label> {movie.vote_average.toFixed(1)}</p>
    <p>
      <Label>released</Label>: {new Date(movie.release_date).getFullYear() ||
        'unavailable'}
    </p>
    <form method="POST" action="lists?/updateList" class="absolute top-1 left-1">
      <input type="hidden" name="listId" value="{listId}" />
      <input type="hidden" name="title" value="{movie.title}" />
      <input type="hidden" name="overview" value="{movie.overview}" />
      <input type="hidden" name="genres" value="{movie.genres}" />
      <input type="hidden" name="release_date" value="{movie.release_date}" />
      <input type="hidden" name="poster_path" value="{movie.poster_path}" />
      <input type="hidden" name="vote_average" value="{movie.vote_average}" />
      <input type="hidden" name="id" value="{movie.id}" />
      <button type="submit">
        <FontAwesomeIcon class="text-text" icon="{faPlusCircle}" />
      </button>
    </form>
  </div>
  <div class="w-3/5 overflow-y-auto">
    <p>
      <Label>title</Label>:
      {movie.title}
    </p>
    <p class="break-normal">
      <Label>genres</Label>:
      {#each movie.genres as genre (genre)}
        <span>{genre} </span>
      {/each}
    </p>
    <p class="break-normal">
      <Label>description</Label>:
      {movie.overview}
    </p>
  </div>
</div>
