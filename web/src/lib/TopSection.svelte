<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex text-2xl justify-between mt-5">
  {@render children()}
</div>
