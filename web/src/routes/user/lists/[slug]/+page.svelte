<script lang="ts">
  import {
    faEdit,
    faLock,
    faLockOpen,
    faPlusCircle,
    faShareNodes,
    faComments
  } from '@fortawesome/free-solid-svg-icons';
  import { quartOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
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
  import ListNameModal from '$lib/List/ListNameModal.svelte';
  import Comment from '$lib/Comment/Comment.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { user } = data;
  let showModal = false;
  let showShareListModal = false;
  let showListNameModal = false;

  $: movies = data.movies;
  $: list = data.list;
  $: sharees = data.sharees;
  $: comments = data.comments;

  $: displayComments = false;
</script>

<Toasts />

<Nav username="{user.username}" />
<TopSection>
  <Title>{list.name}</Title>
  <div class="flex gap-x-2">
    <IconButton
      type="button"
      classes="h-4"
      icon="{faEdit}"
      tooltip="edit name"
      on:click="{() => (showListNameModal = true)}"
    />
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
      <SubmitButton
        formAction="?/togglePrivacy"
        inputs="{[
          { name: 'listId', value: list.id },
          { name: 'isPrivate', value: list.isPrivate ? 'true' : 'false' }
        ]}"
        icon="{list.isPrivate ? faLock : faLockOpen}"
        tooltip="{list.isPrivate ? 'private list' : 'public list'}"
      />
      <Delete listId="{list.id}" />
    {:else}
      <Clone name="{list.name}" listId="{list.id}" />
    {/if}
    <IconButton
      type="button"
      classes="h-4"
      icon="{faComments}"
      tooltip="display comments"
      on:click="{() => (displaycomments = !displaycomments)}"
    />
  </div>
</TopSection>
<div class="flex justify-between mx-5 pb-3">
  {#if sharees?.length}
    <div class="flex gap-x-2">
      {#each sharees as sharee (sharee.email)}
        <Avatar username="{sharee.username}" />
      {/each}
    </div>
  {/if}
  <div class="my-auto"></div>
</div>
{#if displayComments}
  <div
    class="mx-5"
    in:slide="{{ axis: 'y', duration: 800, delay: 150, easing: quartOut }}"
    out:slide="{{ axis: 'y', duration: 800, delay: 150, easing: quartOut }}"
  >
    <Comment {comments} listId="{list.id}" />
  </div>
{/if}
<MoviesSection>
  {#if movies.length}
    {#each movies as movie (movie.id)}
      <Movie listId="{list.id}" {movie} />
    {/each}
  {/if}
</MoviesSection>

<ListShareModal bind:showShareListModal listId="{list.id}" />
<ListNameModal bind:showListNameModal listId="{list.id}" />
<MovieModal bind:showMovieModal="{showModal}" listId="{list.id}" />
