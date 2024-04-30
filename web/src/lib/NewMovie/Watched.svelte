<script lang="ts">
  import IconButton from '$lib/IconButton.svelte';
  import { faEye } from '@fortawesome/free-solid-svg-icons';

  export let movieId: string;
  export let watched: boolean;
</script>

<div>
  <form method="POST" action="lists?/toggleWatched">
    <input type="hidden" name="movieId" value="{movieId}" />
    <IconButton
      type="submit"
      icon="{faEye}"
      tooltip="{`tag as ${watched ? 'not watched' : 'watched'}`}"
    />
  </form>
</div>
