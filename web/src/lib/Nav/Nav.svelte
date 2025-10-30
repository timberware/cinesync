<script lang="ts">
  import Link from './Link.svelte';
  import { CINESYNC_REPO } from '../../utils';
  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import { faSignOut } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import Avatar from '$lib/Avatar.svelte';

  export let username: string;
</script>

<nav class="pt-5 mx-5 md:text-xl sm:text-lg flex justify-between">
  <div class="flex gap-x-3 md:gap-x-5">
    <Link href="/user/lists">lists</Link>
    <Link href="/user/shared">shared</Link>
    <Link href="/user/about">about</Link>
    <a href={CINESYNC_REPO} target="_blank" rel="noreferrer">
      <FontAwesomeIcon class="text-text" icon={faGithub} />
    </a>
  </div>
  <div>
    <Link href="/user/profile"><Avatar {username} /></Link>
    <Link href="/user/profile" hidden>{username}</Link>
    <div class="inline-block">
      <form method="POST" action="/logout?/logout">
        <button type="submit" class="text-text">
          <FontAwesomeIcon class="text-text" icon={faSignOut} />
        </button>
      </form>
    </div>
  </div>
</nav>
