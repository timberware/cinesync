<script lang="ts">
  import List from '$lib/List/List.svelte';

  const { lists } = $props();
</script>

<div class="flex flex-wrap gap-y-4 h-[calc(100vh-200px)] overflow-y-auto">
  {#if lists?.length}
    {#each lists as list (list.id)}
      <div class="w-full xl:w-1/5 lg:w-1/4 sm:w-1/3">
        <List
          id={list.id}
          title={list.name}
          movies={list.movies}
          sharees={list.sharees}
          imageUrl={list.posterUrl ?? ''}
        />
      </div>
    {/each}
  {/if}
</div>
