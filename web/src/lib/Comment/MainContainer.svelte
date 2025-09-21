<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="w-full relative rounded-xl bg-secondary mb-4 p-3">
  {@render children()}
</div>
