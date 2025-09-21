<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="container xl:max-w-screen-xl lg:max-w-screen-lg mx-auto mb-3">
  {@render children()}
</div>
