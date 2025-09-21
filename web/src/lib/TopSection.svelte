<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex text-2xl mt-10 mb-4 mx-5 justify-between">
  {@render children()}
</div>
