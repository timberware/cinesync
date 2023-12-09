<script lang="ts">
  export let username: string;
  export let isLarge: Boolean = false;

  const initial = username[0];
</script>

<div
  class="{`inline-block text-center rounded-full bg-accent text-text select-none ${
    isLarge ? 'h-24 w-24 text-8xl' : 'h-6 w-6 has-tooltip'
  }`}"
>
  <span class="tooltip rounded-lg bg-background text-text p-2 mt-5 -ml-5">{username}</span
  >
  {initial}
</div>
