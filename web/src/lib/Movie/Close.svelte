<script lang="ts">
  import { faTrash } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  export let listId: string;
  export let movieId: string;
</script>

<div>
  <form method="POST" action="lists?/deleteMovie">
    <input type="hidden" name="listId" value="{listId}" />
    <input type="hidden" name="movieId" value="{movieId}" />
    <button type="submit">
      <FontAwesomeIcon class="text-text" icon="{faTrash}" />
    </button>
  </form>
</div>
