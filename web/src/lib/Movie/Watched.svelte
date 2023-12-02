<script lang="ts">
  import IconButton from '$lib/IconButton.svelte';
  import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

  export let movieId: string;
  export let watched: boolean;
</script>

<div>
  <form method="POST" action="lists?/toggleWatched">
    <input type="hidden" name="movieId" value="{movieId}" />
    <IconButton
      type="submit"
      icon="{watched ? faEye : faEyeSlash}"
      tooltip="{watched ? 'watched' : ' not watched'}"
    />
  </form>
</div>
