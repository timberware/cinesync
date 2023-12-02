<script lang="ts">
  import type { MovieType } from '../../ambient';
  import Delete from './Delete.svelte';
  import Watch from './Watched.svelte';
  import Image from '$lib/Image.svelte';
  import MovieContainer from './MovieContainer.svelte';
  import Label from './Label.svelte';
  import { getPosterUrl } from '../../utils';

  export let listId: string;
  export let movie: MovieType;
</script>

<MovieContainer>
  <div class="absolute flex top-1 left-1 gap-2 bg-secondary px-1 rounded-md">
    <Watch movieId="{movie.id}" watched="{movie.watched}" />
    <Delete listId="{listId}" movieId="{movie.id}" />
  </div>
  <div class="w-2/5 mr-3">
    <div><Image src="{getPosterUrl(movie.posterUrl)}" /></div>
    <p class="pt-2"><Label>rating:</Label> {movie.rating.toFixed(1)}</p>
    <p>
      <Label>released</Label>: {new Date(
        movie.releaseDate || new Date().getFullYear()
      ).getFullYear()}
    </p>
  </div>
  <div class="w-3/5 overflow-y-auto">
    <p>
      <Label>title</Label>:
      {movie.title}
    </p>
    <p class="break-normal">
      <Label>genre</Label>:
      {#each movie.genre as genre (genre)}
        <span>{genre} </span>
      {/each}
    </p>
    <p class="break-normal">
      <Label>description</Label>:
      {movie.description}
    </p>
  </div>
</MovieContainer>
