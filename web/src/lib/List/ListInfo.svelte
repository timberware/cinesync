<script lang="ts">
  import { faVideoCamera, faUserFriends } from '@fortawesome/free-solid-svg-icons';
  import '@fortawesome/fontawesome-svg-core/styles.css';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { config } from '@fortawesome/fontawesome-svg-core';
  config.autoAddCss = false;

  export let movies = 0;
  export let sharees = 0;
</script>

<div class="absolute flex top-1 left-1 gap-2 bg-secondary px-1 rounded-md z-10">
  <div>
    <FontAwesomeIcon class="text-text text-lg" icon="{faVideoCamera}" />
    {` ${movies}`}
  </div>
  {#if sharees !== 0}
    <div>
      <FontAwesomeIcon class="text-trxt text-lg" icon="{faUserFriends}" />
      {` ${sharees}`}
    </div>
  {/if}
</div>
