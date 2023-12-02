<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  export let formAction: string;
  export let inputs: { name: string; value: string }[];
  export let icon: any;
  export let tooltip: string = '';
</script>

<form method="POST" action="{formAction}">
  {#if inputs.length}
    {#each inputs as input}
      <input type="hidden" name="{input.name}" value="{input.value}" />
    {/each}
  {/if}
  <button class="has-tooltip" type="submit">
    {#if tooltip}
      <span class="tooltip rounded-lg bg-background text-text p-2 mt-5 -ml-5"
        >{tooltip}</span
      >
    {/if}
    {#if typeof icon === 'string'}
      {icon}
    {:else}
      <FontAwesomeIcon class="text-text text-lg" icon="{icon}" />
    {/if}
  </button>
</form>
