<script lang="ts">
  import { page } from '$app/stores';
  import '../app.css';
  import MainContainer from '$lib/MainContainer.svelte';
  import Tag from '$lib/Tag.svelte';
  import type { LayoutData } from './$types';
  import type { Snippet } from 'svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let shouldDisplay = $derived(
    !$page.url.pathname.includes('/login') && !$page.url.pathname.includes('/signit')
  );
</script>

<MainContainer>
  {@render children()}

  {#if shouldDisplay}
    <Tag tag={data.tag} />
  {/if}
</MainContainer>
