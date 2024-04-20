<script lang="ts">
  import Label from '$lib/Movie/Label.svelte';

  export let title = '';
</script>

<div class="w-full bg-background rounded-xl py-2 px-3">
  <p class="truncate text-center">
    <Label>
      {title}
    </Label>
  </p>
</div>
