<script lang="ts">
  const { tag } = $props();
</script>

<div
  class={'absolute right-2 bg-secondary w-20 text-center p-1 rounded-xl bottom-3 z-50'}
>
  {tag ?? 'unavailable'}
</div>
