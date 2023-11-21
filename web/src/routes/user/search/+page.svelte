<script lang="ts">
  import Nav from '$lib/Nav/Nav.svelte';
  import type { User } from '../../../ambient';

  export let data: {
    user: User;
  };
  const { user } = data;
</script>

<Nav username="{user.username}" />
<div>This is search</div>
