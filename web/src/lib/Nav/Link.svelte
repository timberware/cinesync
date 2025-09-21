<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';

  let { children, href, hidden }: { children: Snippet; href: string; hidden: boolean } =
    $props();

  const comparePaths = (path1: string, path2: string): boolean =>
    path1.split('/').at(-1) === path2.split('/').at(-1);

  let isActive = $derived(comparePaths($page.url.pathname, href));
</script>

<a
  {href}
  class="{`${isActive ? 'text-text' : 'text-primary'} hover:text-text active:text-text ${
    hidden && 'hidden sm:inline'
  }`} "
>
  {@render children()}
</a>
