<script lang="ts">
  import Nav from '$lib/Nav/Nav.svelte';
  import type { User } from '../../../ambient';
  import { THE_MOVIE_DB_BIG_AVATAR } from '../../../utils';

  export let data: {
    user: User;
  };
  const { user } = data;
</script>

<Nav username="{user.username}" />
<div class="mt-7 max-w-6xl mx-auto">
  <h2 class="mb-3 text-2xl underline">cinesync</h2>
  <p>
    cinesync is designed to bring the magic of cinema closer to movie enthusiasts. It is a
    modern and user-friendly web application that caters to the needs of movie enthusiasts
    and their friends. Our platform was created to bridge the gap between your love for
    movies and your desire to connect with friends and fellow cinephiles. cinesync allows
    you to synchronize and share your personalized movie watchlists effortlessly,
    transforming your movie-watching experience into a social, interactive, and
    community-driven adventure.
  </p>
  <p class="mt-3">
    The purpose of cinesync is simple yet profound: to create a vibrant and engaging
    community of movie enthusiasts who can share, discover, and celebrate the world of
    cinema together. We believe that movies have the power to bring people closer, spark
    conversations, and offer a unique form of entertainment. cinesync serves as the bridge
    that connects your passion for movies with the people who share that passion.
  </p>
  <p class="mt-3">
    Join us on this cinematic journey, and let cinesync enhance your love for movies,
    making every film-watching experience a shared adventure.
  </p>
  <div class="mt-10">
    <a href="https://www.themoviedb.org/">
      <img src="{THE_MOVIE_DB_BIG_AVATAR}" alt="TMDB logo" height="{12}" width="{165}" />
    </a>
    <p class="mt-1">
      This product uses the TMDB API but is not endorsed or certified by TMDB.
    </p>
  </div>
</div>
