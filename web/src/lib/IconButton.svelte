<script lang="ts">
  import '@fortawesome/fontawesome-svg-core/styles.css';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { config } from '@fortawesome/fontawesome-svg-core';
  config.autoAddCss = false;

  export let tooltip: string = '';
  export let type: 'button' | 'reset' | 'submit' | null | undefined;
  export let classes: string = '';
  export let icon: any;
</script>

<button class="{`has-tooltip ${classes}`}" type="{type}" on:click>
  <span class="tooltip rounded-lg bg-background text-text p-2 mt-5 -ml-5">{tooltip}</span>
  <FontAwesomeIcon class="text-text text-lg" icon="{icon}" /></button
>
