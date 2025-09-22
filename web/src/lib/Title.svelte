<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    isActive = true,
    onClick
  }: {
    children: Snippet;
    isActive?: boolean;
    onClick?: () => void;
  } = $props();

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
  };
</script>

<button
  type="button"
  onclick={handleOnClick}
  class={`${isActive ? 'text-text' : 'text-primary'} hover:text-text active:text-text`}
>
  {@render children()}
</button>
