<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
  import { PROFILE_IMAGE_PLACEHOLDER } from '../utils';
  export let username: string;
  export let isLarge: Boolean = false;

  const initial = username[0];
  let loaded = false;
  let failed = false;
  let loading = false;

  const avatarBaseClass =
    'inline-block text-center rounded-full bg-accent text-text select-none';

  const imageClass = `${avatarBaseClass} ${
    isLarge ? 'h-56 w-56 text-8xl content-center' : 'h-6 w-6 has-tooltip'
  }`;

  const initialClass = `${avatarBaseClass} ${
    isLarge ? 'w-64 h-64 text-8xl content-center ' : 'h-6 w-6 has-tooltip'
  }`;

  const fullPath = `${env.PUBLIC_API_HOST || 'http://localhost:4000'}/images/${username}`;
  let img: HTMLImageElement;

  onMount(() => {
    img = new Image();
    loading = true;
    img.src = fullPath;

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
  <img loading="lazy" class="{imageClass}" src="{fullPath}" alt="Avatar" />
{:else if failed}
  {#if isLarge}
    <img
      loading="lazy"
      class="{imageClass}"
      src="{PROFILE_IMAGE_PLACEHOLDER}"
      alt="Avatar"
    />
  {:else}
    <div class="{initialClass}">
      <span class="tooltip rounded-lg bg-background text-text p-2 mt-5 -ml-5"
        >{username}</span
      >
      {initial}
    </div>
  {/if}
{:else if loading}
  <img
    loading="lazy"
    class="{imageClass}"
    src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
    alt="Loading..."
  />
{/if}
