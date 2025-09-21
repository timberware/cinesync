<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-md m-auto p-3 mt-5 rounded-xl border-solid border-secondary border-2">
  {@render children()}
</div>
