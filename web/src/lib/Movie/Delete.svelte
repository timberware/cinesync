<script lang="ts">
  import { faTrash } from '@fortawesome/free-solid-svg-icons';
  import SubmitButton from '$lib/SubmitButton.svelte';

  export let listId: string;
  export let movieId: string;
</script>

<SubmitButton
  formAction="lists?/deleteMovie"
  inputs="{[
    { name: 'listId', value: listId },
    { name: 'movieId', value: movieId }
  ]}"
  icon="{faTrash}"
  tooltip="delete movie"
/>
