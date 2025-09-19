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
    loading = true;
    img.src = src;

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
    loading="lazy"
    class={`transition-all ease-in-out duration-500 h-full w-full object-scale-down rounded-md ${
      !watched && ' brightness-25'
    }`}
    {src}
    alt="List"
  />
{:else if failed}
  <img
    loading="lazy"
    class="h-full w-full object-scale-down"
    src={LIST_PLACEHOLDER}
    alt="Not Found"
  />
{:else if loading}
  <img
    loading="lazy"
    class="h-full w-full object-scale-down"
    src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
    alt="Loading..."
  />
{/if}
