<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div
  class="container xl:max-w-screen-xl lg:max-w-screen-lg sm:max-w-screen-sm max-w-xs mx-auto h-screen"
>
  {@render children()}
</div>
