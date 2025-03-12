<style lang="postcss">
  :global(html) {
    background-color: theme(colors.background);
    color: theme(colors.text);
  }
</style>

<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';
  import MainContainer from '$lib/MainContainer.svelte';
  import Tag from '$lib/Tag.svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  const extractTitle = (pathname: string) => pathname.replace('/user', '');
  $: isSticky =
    $page.url.pathname.includes('/user') &&
    !$page.url.pathname.includes('/about') &&
    !$page.url.pathname.includes('/profile');
</script>

<svelte:head>
  <title>{`cinesync - ${extractTitle($page.url.pathname)}`}</title>
</svelte:head>

<MainContainer>
  <slot />
</MainContainer>

<Tag tag="{data.tag}" sticky="{isSticky}" />
