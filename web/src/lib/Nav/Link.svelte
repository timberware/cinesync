<script lang="ts">
  import { page } from '$app/stores';
  export let href: string;
  export let hidden: boolean = false;

  const comparePaths = (path1: string, path2: string): boolean =>
    path1.split('/').at(-1) === path2.split('/').at(-1);

  $: isActive = comparePaths($page.url.pathname, href);
</script>

<a
  href="{href}"
  class="{`${isActive ? 'text-text' : 'text-primary'} hover:text-text active:text-text ${
    hidden && 'hidden sm:inline'
  }`} "
>
  <slot />
</a>
