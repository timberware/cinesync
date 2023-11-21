<script lang="ts">
  import { faTrash } from '@fortawesome/free-solid-svg-icons';
  import SubmitButton from '$lib/SubmitButton.svelte';

  export let listId: string;
</script>

<SubmitButton
  formAction="lists?/deleteList"
  name="listId"
  value="{listId}"
  icon="{faTrash}"
/>
