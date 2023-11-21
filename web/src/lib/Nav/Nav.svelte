<script lang="ts">
  import Link from './Link.svelte';
  import Avatar from '$lib/Avatar.svelte';
  import Links from '$lib/Links.svelte';
  export let username: string;
</script>

<nav class="pt-2 text-xl flex justify-between">
  <div class="">
    <Link href="/user/profile"><Avatar username="{username}" /></Link>
    <Link href="/user/profile">{username}</Link>
    <Link href="/user/lists">lists</Link>
    <Link href="/user/about">about</Link>
    <div class=" inline-block">
      <form method="POST" action="/logout?/logout">
        <button type="submit">log out</button>
      </form>
    </div>
  </div>
  <Links />
</nav>
