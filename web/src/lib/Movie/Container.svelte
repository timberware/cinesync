<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="w-full h-60 relative flex rounded-xl bg-secondary mx-5 p-3" transition:fade>
  {@render children()}
</div>
