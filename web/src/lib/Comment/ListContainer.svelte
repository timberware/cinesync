<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="max-h-96 overflow-y-auto">
  {@render children()}
</div>
