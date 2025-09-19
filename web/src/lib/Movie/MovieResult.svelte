<script lang="ts">
  import { applyAction, enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import type { MovieWithLists } from '../../ambient';
  import Image from '$lib/Image.svelte';
  import Label from './Label.svelte';
  import { getPosterUrl } from '../../utils';
  import { addToast } from '../../store';
  import { addedError, addedSuccess } from './messages';
  import Lists from '$lib/Search/Lists.svelte';

  export let movie: MovieWithLists;
  export let listId: string;
  export let showMovieModal: boolean;
</script>

<div class="rounded-xl bg-secondary p-3 mx-auto mb-5">
  <div class="h-96 flex">
    <div class="relative w-2/5 mr-3 rounded-md">
      <div><Image src={getPosterUrl(movie.posterUrl)} watched={true} /></div>
      <p class="pt-2"><Label>rating:</Label> {movie.rating.toFixed(1)}</p>
      <p>
        <Label>released</Label>: {new Date(movie.releaseDate).getFullYear() ||
          'unavailable'}
      </p>
      <form
        method="POST"
        action="?/updateList"
        class="absolute top-0 left-0 px-1 bg-background rounded-br-md"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'failure') {
              addToast(addedError);
            } else if (result.type === 'success') {
              addToast(addedSuccess);
              invalidateAll();
            }
            applyAction(result);
            showMovieModal = false;
          };
        }}
      >
        <input type="hidden" name="listId" value={listId} />
        <input type="hidden" name="title" value={movie.title} />
        <input type="hidden" name="description" value={movie.description} />
        <input type="hidden" name="genre" value={movie.genre} />
        <input type="hidden" name="releaseDate" value={movie.releaseDate} />
        <input type="hidden" name="posterUrl" value={movie.posterUrl} />
        <input type="hidden" name="rating" value={movie.rating} />
        <input type="hidden" name="tmdbId" value={movie.tmdbId} />
        <button type="submit">
          <FontAwesomeIcon class="text-text" icon={faPlusCircle} />
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
        {#each movie.genre as genre (genre)}
          <span>{genre} </span>
        {/each}
      </p>
      <p class="break-normal">
        <Label>description</Label>:
        {movie.description}
      </p>
    </div>
  </div>
  {#if movie.lists.length}
    <Lists lists={movie.lists} />
  {/if}
</div>
