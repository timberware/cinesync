<script lang="ts">
  import '@fortawesome/fontawesome-svg-core/styles.css';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import {
    faLock,
    faLockOpen,
    faShareNodes,
    faClone
  } from '@fortawesome/free-solid-svg-icons';
  import SubmitButton from '$lib/SubmitButton.svelte';
  import ListShareModal from './ListShareModal.svelte';
  import MovieModal from '$lib/Movie/MovieModal.svelte';
  import type { ListType } from '../../ambient';
  import { config } from '@fortawesome/fontawesome-svg-core';
  import Avatar from '$lib/Avatar.svelte';
  import Close from './Close.svelte';
  config.autoAddCss = false;

  export let list: ListType;
  let showMovieModal = false;
  let showShareListModal = false;
</script>

<div class="flex justify-between mx-1">
  <div class="flex gap-x-4">
    <Avatar username="{list.creatorUsername || ''}" />
    <div class="text-lg font-black">{list.name}</div>
    <button type="button" class=" min-h-full" on:click="{() => (showMovieModal = true)}"
      ><FontAwesomeIcon class="text-text text-xl" icon="{faPlusCircle}" /></button
    >
    {#if list?.sharees?.findIndex(sharee => sharee.username === list.creatorUsername) === -1}
      <Close listId="{list.id}" />
      <SubmitButton
        formAction="lists?/togglePrivacy"
        inputs="{[{ name: 'listId', value: list.id }]}"
        icon="{list.isPrivate ? faLock : faLockOpen}"
      />
    {:else}
      <SubmitButton
        formAction="lists?/cloneList"
        inputs="{[
          { name: 'listId', value: list.id },
          { name: 'name', value: list.name }
        ]}"
        icon="{faClone}"
      />
    {/if}
    <button
      type="button"
      class=" min-h-full"
      on:click="{() => (showShareListModal = true)}"
    >
      <FontAwesomeIcon class="text-text" icon="{faShareNodes}" />
    </button>
  </div>
  <div class="flex gap-x-4">
    {#if list?.sharees?.length}
      {#each list.sharees as sharee (sharee.email)}
        {#if sharee.username !== list.creatorUsername}
          <Avatar username="{sharee.username}" />
        {/if}
      {/each}
    {/if}
  </div>
</div>

<ListShareModal bind:showShareListModal listId="{list.id}" />
<MovieModal bind:showMovieModal listId="{list.id}" />
