<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    faBackwardFast,
    faBackwardStep,
    faForwardFast,
    faForwardStep
  } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import type { Pagination } from '../ambient';

  let { tags }: { tags: Pagination } = $props();
  const path = $page.url.pathname.includes('lists') ? 'lists' : 'shared';
</script>

<div class="flex justify-end">
  <div
    class="flex w-min justify-end gap-x-3 px-3 py-1 bg-secondary rounded-b-2xl text-xl"
  >
    <button
      onclick={() => {
        goto(`/user/${path}?page=0`);
      }}
      disabled={tags.curr === '0'}
    >
      <FontAwesomeIcon icon={faBackwardFast} />
    </button>
    <button
      onclick={() => {
        goto(`/user/${path}?page=${tags.prev}`);
      }}
      disabled={tags.curr === '0'}
    >
      <FontAwesomeIcon icon={faBackwardStep} />
    </button>
    <div class="w-min-8">
      {`${Number(tags.curr) + 1}/${Number(tags.last) + 1}`}
    </div>
    <button
      onclick={() => {
        goto(`/user/${path}?page=${tags.next}`);
      }}
      disabled={tags.curr === tags.last}
    >
      <FontAwesomeIcon icon={faForwardStep} />
    </button>
    <button
      onclick={() => {
        goto(`/user/${path}?page=${tags.last}`);
      }}
      disabled={tags.curr === tags.last}
    >
      <FontAwesomeIcon icon={faForwardFast} />
    </button>
  </div>
</div>
