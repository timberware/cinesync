<script lang="ts">
  import { PUBLIC_API_HOST } from '$env/static/public';
  import { onMount } from 'svelte';
  export let username: string;
  export let isLarge: Boolean = false;

  const initial = username[0];
  let loaded = false;
  let failed = false;
  let loading = false;

  const imageClass = `inline-block text-center rounded-full bg-accent text-text select-none ${
    isLarge ? 'h-24 w-24 text-8xl' : 'h-6 w-6 has-tooltip'
  }`;
  const fullPath = `${PUBLIC_API_HOST || 'http://localhost:4000'}/images/${username}`;

  onMount(() => {
    const img = new Image();
    img.src = fullPath;
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
  <img class="{imageClass}" src="{fullPath}" alt="Avatar" />
{:else if failed}
  <div class="{imageClass}">
    <span class="tooltip rounded-lg bg-background text-text p-2 mt-5 -ml-5"
      >{username}</span
    >
    {initial}
  </div>
{:else if loading}
  <img
    class="{imageClass}"
    src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
    alt="Loading..."
  />
{/if}
