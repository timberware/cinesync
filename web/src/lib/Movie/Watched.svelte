<script lang="ts">
  import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  export let movieId: string;
  export let watched: boolean;
</script>

<div>
  <form method="POST" action="lists?/toggleWatched">
    <input type="hidden" name="movieId" value="{movieId}" />
    <button type="submit">
      <FontAwesomeIcon class="text-text" icon="{watched ? faEye : faEyeSlash}" />
    </button>
  </form>
</div>
