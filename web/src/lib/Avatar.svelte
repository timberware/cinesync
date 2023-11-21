<script lang="ts">
  export let username: string;

  const initial = username[0];
</script>

<div
  class="inline-block text-center h-6 w-6 rounded-full bg-accent text-text has-tooltip"
>
  <span class="tooltip rounded-lg bg-background text-text p-2 mt-2 -ml-5">{username}</span
  >
  {initial}
</div>
