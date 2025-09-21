<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex pt-2 pb-2 justify-center">
  {@render children()}
</div>
