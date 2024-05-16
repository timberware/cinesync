<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import IconButton from '$lib/IconButton.svelte';
  import { faClose } from '@fortawesome/free-solid-svg-icons';
  import { type ToastTypes } from '../../ambient.d';

  export let type: ToastTypes;
  export let dismissible = true;

  const dispatch = createEventDispatcher();
  const toastBgColor = new Map<ToastTypes, string>([
    ['info', 'bg-info'],
    ['success', 'bg-success'],
    ['error', 'bg-error']
  ]);
</script>

<article
  class="{`rounded-lg flex px-4 py-3 justify-around mx-auto mb-3 max-w-96 ${toastBgColor.get(
    type
  )}
   gap-x-2 align-baseline`}"
  role="alert"
  transition:fade
>
  <div class="text-text">
    <slot />
  </div>

  {#if dismissible}
    <IconButton
      type="button"
      classes="text-text bg-transparent"
      on:click="{() => dispatch('dismiss')}"
      icon="{faClose}"
    />
  {/if}
</article>
