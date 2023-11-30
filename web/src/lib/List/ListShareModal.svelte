<style>
  dialog {
    max-width: 32em;
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
  export let listId: string;
  export let showShareListModal: boolean;
  let dialog: HTMLDialogElement;

  $: if (dialog && showShareListModal) {
    dialog.showModal();
  }

  const closeDialog = () => dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this="{dialog}"
  on:close="{() => (showShareListModal = false)}"
  on:click|self="{closeDialog}"
  class="bg-background text-text rounded-xl"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click|stopPropagation>
    <form method="POST" action="lists?/shareList">
      <div class="w-xl p-4">
        <h2 class="font-bold text-4xl underline text-center mb-4">share list</h2>
        <div class="flex pt-2 pb-2">
          <label class="w-20 text-right pr-4" for="username">username</label>
          <input
            class="text-background pl-1"
            type="text"
            name="username"
            id="username"
            placeholder="clint@eastwood.com"
            required
          />
          <input type="hidden" name="listId" value="{listId}" />
        </div>
        <div class="flex max-w-xs m-auto pt-5 justify-around">
          <button type="submit">share</button>
          <button on:click|self="{closeDialog}">cancel</button>
        </div>
      </div>
    </form>
  </div>
</dialog>
