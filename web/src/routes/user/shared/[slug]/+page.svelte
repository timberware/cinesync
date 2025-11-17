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
  import Head from '$lib/Head.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const { user } = data;
  let showModal = $state(false);
  let showShareListModal = $state(false);
  let showListNameModal = $state(false);

  let movies = $derived(data.movies);
  let list = $derived(data.list);
  let sharees = $derived(data.sharees);
  let comments = $derived(data.comments);

  let displayComments = $state(false);
</script>

<Toasts />

<Head title={`cinesync - /${list?.name}`} />

<Nav username={user.username} />
<TopSection>
  <Title>{list.name}</Title>
  <div class="flex gap-x-2">
    <IconButton
      type="button"
      classes="h-4"
      icon={faEdit}
      tooltip="edit name"
      on:click={() => (showListNameModal = true)}
    />
    <IconButton
      type="button"
      classes="min-h-full"
      icon={faPlusCircle}
      tooltip="add movie"
      on:click={() => (showModal = true)}
    />
    {#if list?.creatorId === user.id}
      <IconButton
        type="button"
        classes="min-h-full"
        icon={faShareNodes}
        tooltip="share list"
        on:click={() => (showShareListModal = true)}
      />
      <SubmitButton
        formAction="?/togglePrivacy"
        inputs={[
          { name: 'listId', value: list.id },
          { name: 'isPrivate', value: list.isPrivate ? 'true' : 'false' }
        ]}
        icon={list.isPrivate ? faLock : faLockOpen}
        tooltip={list.isPrivate ? 'private list' : 'public list'}
      />
      <Delete listId={list.id} />
    {:else}
      <Clone name={list.name} listId={list.id} />
    {/if}
    <IconButton
      type="button"
      classes="h-4"
      icon={faComments}
      tooltip="display comments"
      on:click={() => (displayComments = !displayComments)}
    />
  </div>
</TopSection>
<div class="flex justify-between mx-5 pb-3">
  {#if sharees?.length}
    <div class="flex gap-x-2">
      {#each sharees as sharee (sharee.email)}
        <Avatar username={sharee.username} />
      {/each}
    </div>
  {/if}
  <div class="my-auto"></div>
</div>
{#if displayComments}
  <div
    class="mx-5"
    in:slide={{ axis: 'y', duration: 800, delay: 150, easing: quartOut }}
    out:slide={{ axis: 'y', duration: 800, delay: 150, easing: quartOut }}
  >
    <Comment {comments} listId={list.id} />
  </div>
{/if}
<div class={'bg-secondary rounded-2xl  p-3'}>
  <MoviesSection>
    {#if movies.length}
      {#each movies as movie (movie.id)}
        <Movie
          listId={list.id}
          {movie}
          sharees={sharees
            .filter(s => s.watched?.includes(movie.id))
            .map(m => m.username)}
        />
      {/each}
    {/if}
  </MoviesSection>
</div>

<ListShareModal bind:showShareListModal listId={list.id} />
<ListNameModal bind:showListNameModal listId={list.id} />
<MovieModal bind:showMovieModal={showModal} listId={list.id} />
