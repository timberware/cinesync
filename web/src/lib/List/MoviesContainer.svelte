<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="h-80 flex gap-x-2 min-w-full rounded-xl mt-1 overflow-x-auto">
  {@render children()}
</div>
