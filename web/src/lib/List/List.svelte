<script lang="ts">
  import Container from '$lib/List/Container.svelte';
  import Poster from '$lib/List/Poster.svelte';
  import ListTitle from '$lib/List/ListTitle.svelte';

  export let title: string;
  export let movies = 0;
  export let sharees = 0;
  export let imageUrl = '';
  export let id = '';
</script>

<div class="w-60 mx-auto">
  <a href={`/user/lists/${id}`}>
    <Container>
      <Poster src={imageUrl} {movies} {sharees} />
      <ListTitle {title} />
    </Container>
  </a>
</div>
