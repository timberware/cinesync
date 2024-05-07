<script lang="ts">
  import Container from '$lib/List/Container.svelte';
  import Poster from '$lib/List/Poster.svelte';
  import ListTitle from '$lib/List/ListTitle.svelte';

  export let title: string;
  export let movies = 0;
  export let sharees = 0;
  export let imageUrl = '';
</script>

<div class="w-64 mx-auto">
  <Container>
    <Poster src="{imageUrl}" movies="{movies}" sharees="{sharees}" />
    <ListTitle title="{title}" />
  </Container>
</div>
