<script lang="ts">
  import '@fortawesome/fontawesome-svg-core/styles.css';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { config } from '@fortawesome/fontawesome-svg-core';
  config.autoAddCss = false;

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
      <span class="tooltip rounded-lg bg-background text-text text-lg p-2 mt-5 -ml-5"
        >{tooltip}</span
      >
    {/if}
    {#if typeof icon === 'string'}
      {icon}
    {:else}
      <FontAwesomeIcon class="text-text" {icon} />
    {/if}
  </button>
</form>
