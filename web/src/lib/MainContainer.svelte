<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div
  class="container xl:max-w-(--breakpoint-xl) lg:max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-sm) max-w-xs mx-auto h-screen"
>
  {@render children()}
</div>
