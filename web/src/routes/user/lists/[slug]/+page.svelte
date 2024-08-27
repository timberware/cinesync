<script lang="ts">
  import {
    faLock,
    faLockOpen,
    faPlusCircle,
    faShareNodes
  } from '@fortawesome/free-solid-svg-icons';
  import Nav from '$lib/Nav/Nav.svelte';
  import Movie from '$lib/Movie/Movie.svelte';
  import MovieModal from '$lib/Movie/MovieModal.svelte';
  import MoviesSection from '$lib/Movie/MoviesSection.svelte';
  import TopSection from '$lib/TopSection.svelte';
  import Title from '$lib/Title.svelte';
  import IconButton from '$lib/IconButton.svelte';
  import Delete from '$lib/List/Delete.svelte';
  import SubmitButton from '$lib/SubmitButton.svelte';
  import Clone from '$lib/List/Clone.svelte';
  import Toasts from '$lib/Toast/Toasts.svelte';
  import ListShareModal from '$lib/List/ListShareModal.svelte';
  import Avatar from '$lib/Avatar.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  const { user, list } = data;
  let showModal = false;
  let showShareListModal = false;

  $: movies = data.movies;
  $: sharees = data.sharees;
</script>

<Toasts />

<Nav username="{user.username}" />
<TopSection>
  <Title>{list.name}</Title>
  <div class="flex gap-x-2">
    <IconButton
      type="button"
      classes="min-h-full"
      icon="{faPlusCircle}"
      tooltip="add movie"
      on:click="{() => (showModal = true)}"
    />
    {#if list?.creatorId === user.id}
      <IconButton
        type="button"
        classes="min-h-full"
        icon="{faShareNodes}"
        tooltip="share list"
        on:click="{() => (showShareListModal = true)}"
      />
      <Delete listId="{list.id}" />
      <SubmitButton
        formAction="?/togglePrivacy"
        inputs="{[
          { name: 'listId', value: list.id },
          { name: 'isPrivate', value: list.isPrivate ? 'true' : 'false' }
        ]}"
        icon="{list.isPrivate ? faLock : faLockOpen}"
        tooltip="{list.isPrivate ? 'private list' : 'public list'}"
      />
    {:else}
      <Clone name="{list.name}" listId="{list.id}" />
    {/if}
  </div>
</TopSection>
<div class="rounded-xl flex gap-x-2 mx-5 mb-4 p-1">
  {#if sharees?.length}
    {#each sharees as sharee (sharee.email)}
      <Avatar username="{sharee.username}" />
    {/each}
  {/if}
</div>
<MoviesSection>
  {#if movies.length}
    {#each movies as movie (movie.id)}
      <Movie listId="{list.id}" movie="{movie}" />
    {/each}
  {/if}
</MoviesSection>

<ListShareModal bind:showShareListModal="{showShareListModal}" listId="{list.id}" />
<MovieModal bind:showMovieModal="{showModal}" listId="{list.id}" />
