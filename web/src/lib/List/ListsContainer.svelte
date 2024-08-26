<script lang="ts">
  import List from '$lib/List/List.svelte';
  import type { ListType } from '../../ambient';

  export let lists: ListType[];
</script>

<div class="flex flex-wrap gap-y-6">
  {#if lists?.length}
    {#each lists as list (list.id)}
      <div class="w-full xl:w-1/4 lg:w-1/3 sm:w-1/2">
        <List
          id="{list.id}"
          title="{list.name}"
          movies="{list.movies}"
          sharees="{list.sharees}"
          imageUrl="{list.posterUrl || ''}"
        />
      </div>
    {/each}
  {/if}
</div>
