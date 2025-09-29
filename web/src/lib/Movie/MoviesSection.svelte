<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="grid grid-cols-1 gap-y-4 auto-rows-min h-[calc(100vh-180px)] overflow-y-auto">
  {@render children()}
</div>
