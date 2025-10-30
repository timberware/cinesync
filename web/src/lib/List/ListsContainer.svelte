<script lang="ts">
  import List from '$lib/List/List.svelte';

  const { lists, path } = $props();
</script>

<div
  class="xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid h-[calc(100vh-190px)] overflow-y-auto auto-rows-min gap-y-4"
>
  {#if lists?.length}
    {#each lists as list (list.id)}
      <div class="w-full h-min">
        <List
          id={list.id}
          title={list.name}
          movies={list.movies}
          sharees={list.sharees}
          imageUrl={list.posterUrl ?? ''}
          {path}
        />
      </div>
    {/each}
  {/if}
</div>
