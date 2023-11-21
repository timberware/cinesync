<script language="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import { CINESYNC_REPO, THE_MOVIE_DB, THE_MOVIE_DB_AVATAR } from '../utils';
</script>

<div class="flex gap-2">
  <a href="{CINESYNC_REPO}" target="_blank" rel="noreferrer">
    <FontAwesomeIcon class="text-text" icon="{faGithub}" />
  </a>
  <a href="{THE_MOVIE_DB}" target="_blank" rel="noreferrer">
    <img src="{THE_MOVIE_DB_AVATAR}" alt="TMDB logo" width="{50}" />
  </a>
</div>
