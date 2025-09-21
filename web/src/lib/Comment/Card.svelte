<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  class="bg-background border-2 border-secondary-hover border-solid rounded-xl my-3 p-3"
  transition:fade
>
  <slot />
</div>
