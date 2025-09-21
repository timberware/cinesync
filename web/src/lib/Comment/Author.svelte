<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="pb-2 mb-4 border-text border-b-2 border-solid">
  {@render children()}
</div>
