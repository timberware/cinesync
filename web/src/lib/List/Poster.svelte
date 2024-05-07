<script lang="ts">
  import ListInfo from '$lib/List/ListInfo.svelte';
  import Image from '$lib/Image.svelte';
  import { getPosterUrl, LIST_PLACEHOLDER } from '../../utils';

  export let src = '';
  export let movies = 0;
  export let sharees = 0;
</script>

<div class="relative bg-primary rounded-xl mb-2 mx-auto">
  <ListInfo movies="{movies}" sharees="{sharees}" />
  <Image src="{src ? getPosterUrl(src) : LIST_PLACEHOLDER}" watched />
</div>
