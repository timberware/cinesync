<script lang="ts">
  import NestJsIcon from '$lib/NestJSIcon.svelte';
  import SvelteLogo from '$lib/SvelteLogo.svelte';
  import {
    THE_MOVIE_DB_AVATAR,
    THE_MOVIE_DB,
    SVELTE_KIT_UTL,
    NESTJS_URL
  } from '../utils';
</script>

<footer
  class="container xl:max-w-screen-xl lg:max-w-screen-lg mx-auto mt-40 absolute bottom-5"
>
  <div class="flex gap-3 max-w-fit m-auto">
    <div class="pt-1">powered by</div>
    <div>
      <a href="{SVELTE_KIT_UTL}" target="_blank" rel="noreferrer"><SvelteLogo /></a>
    </div>
    <div>
      <a href="{NESTJS_URL}" target="_blank" rel="noreferrer"><NestJsIcon /></a>
    </div>
    <div>
      <a href="{THE_MOVIE_DB}" target="_blank" rel="noreferrer">
        <img src="{THE_MOVIE_DB_AVATAR}" alt="TMDB logo" width="{60}" />
      </a>
    </div>
  </div>
</footer>
