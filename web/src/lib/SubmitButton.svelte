<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  export let formAction: string;
  export let name: string;
  export let value: string;
  export let icon: any;
</script>

<form method="POST" action="{formAction}">
  {#if name && value}
    <input type="hidden" name="{name}" value="{value}" />
  {/if}
  <button type="submit">
    {#if typeof icon === 'string'}
      {icon}
    {:else}
      <FontAwesomeIcon class="text-text" icon="{icon}" />
    {/if}
  </button>
</form>
