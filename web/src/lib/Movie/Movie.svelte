<script lang="ts">
  import type { MovieType } from '../../ambient';
  import Delete from './Delete.svelte';
  import Watch from './Watched.svelte';
  import Image from '$lib/Image.svelte';
  import Container from './Container.svelte';
  import Label from './Label.svelte';
  import { getPosterUrl } from '../../utils';

  export let listId: string;
  export let movie: MovieType;
  export let toBeDeleted: string;

  $: watched = movie.watched;
</script>

<Container>
  <div class="absolute flex top-1 right-1 gap-2 bg-secondary px-1 rounded-md z-10">
    <Watch movieId="{movie.id}" bind:watched="{movie.watched}" />
    <Delete listId="{listId}" movieId="{movie.id}" bind:toBeDeleted="{toBeDeleted}" />
  </div>
  <div class="w-40 mr-3 bg-black rounded-xl">
    <Image src="{getPosterUrl(movie.posterUrl)}" watched="{watched}" />
  </div>
  <div class="w-full overflow-y-auto">
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
    <p>
      <Label>released</Label>: {new Date(
        movie.releaseDate || new Date().getFullYear()
      ).getFullYear()}
    </p>
    <p><Label>rating:</Label> {movie.rating.toFixed(1)}</p>
    <p class="break-normal">
      <Label>description</Label>:
      {movie.description}
    </p>
  </div>
</Container>
