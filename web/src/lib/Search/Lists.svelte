<script lang="ts">
  import type { ListType } from '../../ambient';

  export let lists: ListType[] = [];
</script>

<div class="bg-background rounded-xl mt-2 p-2">
  <p class="px-1 pt-2 underline">Film in list(s)</p>
  {#each lists as list (list.id)}
    <a
      class="block bg-secondary hover:bg-secondary-hover rounded-xl p-2 mt-2"
      href={`/user/lists/${list.id}`}>{list.name}</a
    >
  {/each}
</div>
