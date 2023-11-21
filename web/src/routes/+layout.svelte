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

  const extractTitle = (pathname: string) => pathname.replace('/user', '');
</script>

<svelte:head>
  <title>{`cinesync - ${extractTitle($page.url.pathname)}`}</title>
</svelte:head>

<MainContainer>
  <slot />
</MainContainer>
