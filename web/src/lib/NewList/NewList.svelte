<script lang="ts">
  import Container from '$lib/NewList/Container.svelte';
  import Poster from '$lib/NewList/Poster.svelte';
  import ListTitle from '$lib/NewList/ListTitle.svelte';

  export let title: string;
  export let movies = 0;
  export let sharees = 0;
</script>

<div class="w-full flex justify-between">
  <Container>
    <Poster movies="{movies}" sharees="{sharees}" />
    <ListTitle title="{title}" />
  </Container>
</div>
