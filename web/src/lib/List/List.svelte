<script lang="ts">
  import type { ListType } from '../../ambient';
  import ListTop from './ListTop.svelte';
  import Movie from '../Movie/Movie.svelte';
  import ListContainer from './ListContainer.svelte';
  import MoviesContainer from './MoviesContainer.svelte';

  export let list: ListType;
</script>

<ListContainer>
  <ListTop list="{list}" />
  <MoviesContainer>
    {#each list.movie as movie (movie.id)}
      <Movie listId="{list.id}" movie="{movie}" />
    {/each}
  </MoviesContainer>
</ListContainer>
