<script lang="ts">
  import Avatar from '$lib/Avatar.svelte';
  import Nav from '$lib/Nav/Nav.svelte';
  import type { User } from '../../../ambient';

  export let data: {
    user: User;
  };
  const { user } = data;
</script>

<Nav username="{user.username}" />
<div class="flex max-w-4xl mt-20">
  <div class="w-1/5 mx-auto">
    <div class="m-auto w-24">
      <Avatar username="{user.username}" isLarge />
      <div class="mt-2">{user.username}</div>
    </div>
  </div>
  <div class="flex-grow pl-2 pt-2">
    <div class="mb-2">email: {user.email}</div>
    <div class="mb-2">lists: N/A</div>
    <div class="mb-2">watched movies: N/A</div>
  </div>
</div>
