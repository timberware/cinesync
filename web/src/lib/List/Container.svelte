<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="p-2 relative bg-secondary rounded-xl">
  {@render children()}
</div>
