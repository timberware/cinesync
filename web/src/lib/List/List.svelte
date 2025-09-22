<script lang="ts">
  import Container from '$lib/List/Container.svelte';
  import Poster from '$lib/List/Poster.svelte';
  import ListTitle from '$lib/List/ListTitle.svelte';

  const {
    id,
    title,
    movies,
    sharees,
    imageUrl
  }: {
    id: string;
    title: string;
    movies: number;
    sharees: number;
    imageUrl: string;
  } = $props();
</script>

<div class="w-48 mx-auto">
  <a href={`/user/lists/${id}`}>
    <Container>
      <Poster src={imageUrl} {movies} {sharees} />
      <ListTitle {title} />
    </Container>
  </a>
</div>
