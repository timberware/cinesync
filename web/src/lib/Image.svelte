<script lang="ts">
  import { onMount } from 'svelte';
  import { LIST_PLACEHOLDER } from '../utils';

  export let src: string;
  export let watched: boolean;

  let loaded = false;
  let failed = false;
  let loading = false;

  onMount(() => {
    const img = new Image();
    img.src = src;
    loading = true;

    img.onload = () => {
      loading = false;
      loaded = true;
    };
    img.onerror = () => {
      loading = false;
      failed = true;
    };
  });
</script>

{#if loaded}
  <img
    class="{`h-full w-full object-scale-down rounded-md ${!watched && ' brightness-25'}`}"
    src="{src}"
    alt="List"
  />
{:else if failed}
  <img class="h-full w-full object-scale-down" src="{LIST_PLACEHOLDER}" alt="Not Found" />
{:else if loading}
  <img
    class="h-full w-full object-scale-down"
    src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
    alt="Loading..."
  />
{/if}
