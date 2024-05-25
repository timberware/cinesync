<script>
  import { fade } from 'svelte/transition';
</script>

<div class="w-full h-60 relative flex rounded-xl bg-secondary mx-5 p-3" transition:fade>
  <slot />
</div>
