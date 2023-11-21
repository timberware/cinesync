<script lang="ts">
  import { page } from '$app/stores';
  export let href: string;

  const comparePaths = (path1: string, path2: string): boolean =>
    path1.split('/').at(-1) === path2.split('/').at(-1);

  $: isActive = comparePaths($page.url.pathname, href);
</script>

<a
  href="{href}"
  class="{`${isActive ? 'text-text' : 'text-primary'} hover:text-text active:text-text`} "
>
  <slot />
</a>
