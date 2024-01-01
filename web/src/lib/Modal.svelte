<style>
  dialog {
    border-radius: 0.8em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  dialog[open]::backdrop {
    animation: fade 0.5s ease-out;
  }

  @keyframes zoom {
    from {
      transform: scale(0.75);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<script lang="ts">
  export let showModal: boolean;
  export let ctaLabel: string = '';
  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) {
    dialog.showModal();
  }

  const closeDialog = () => dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this="{dialog}"
  on:close="{() => (showModal = false)}"
  on:click|self="{closeDialog}"
  class=" min-w-96 bg-background text-text rounded-xl"
>
  <div on:click|stopPropagation>
    <slot />
    <div class="flex pb-5 justify-around">
      {#if ctaLabel}
        <button type="submit">{ctaLabel}</button>
      {/if}
      <button on:click|self="{closeDialog}">close</button>
    </div>
  </div>
</dialog>
