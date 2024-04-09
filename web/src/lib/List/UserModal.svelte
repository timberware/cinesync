<script lang="ts">
  import Image from '$lib/Image.svelte';
  import Modal from '$lib/Modal.svelte';
  import type { MovieType, User } from '../../ambient';
  import { getPosterUrl } from '../../utils';
  export let showModal: boolean;
  export let sharee: string;
  export let sharees: User[] | undefined;
  export let movies: MovieType[];
  let watchedBySharee: MovieType[] = [];

  $: if (sharee && sharees?.length && movies.length) {
    watchedBySharee = [];
    const user = sharees.filter(sh => sh.username === sharee);

    if (user.length) {
      movies.forEach(movie => {
        if (user[0].watched.includes(movie.id)) {
          watchedBySharee.push(movie);
        }
      });

      watchedBySharee = watchedBySharee;
    }
  }
</script>

<Modal bind:showModal="{showModal}">
  <div class=" max-w-5xl pt-4 pb-6 px-4 m-auto">
    <h2 class="font-bold text-2xl underline text-center mb-4">watched</h2>
    <div class="flex pt-2 pb-2 gap-4 justify-center flex-wrap">
      {#each watchedBySharee as movie (movie.id)}
        <div class="w-32">
          <Image src="{getPosterUrl(movie.posterUrl)}" watched="{true}" />
        </div>
      {/each}
    </div>
  </div>
</Modal>
