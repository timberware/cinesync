<script lang="ts">
  import {
    faBackwardFast,
    faBackwardStep,
    faForwardFast,
    faForwardStep
  } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import type { PaginationType } from '../ambient';

  let { tags, currentPage = $bindable() }: { tags: PaginationType; currentPage: string } =
    $props();
</script>

<div class="flex justify-end">
  <div
    class="flex w-min justify-end gap-x-3 px-3 py-1 bg-secondary rounded-b-2xl text-xl"
  >
    <button
      onclick={() => {
        currentPage = '0';
      }}
      disabled={tags.curr === '0'}
    >
      <FontAwesomeIcon icon={faBackwardFast} />
    </button>
    <button
      onclick={() => {
        currentPage = tags.prev;
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
        currentPage = tags.next;
      }}
      disabled={tags.curr === tags.last}
    >
      <FontAwesomeIcon icon={faForwardStep} />
    </button>
    <button
      onclick={() => {
        currentPage = tags.last;
      }}
      disabled={tags.curr === tags.last}
    >
      <FontAwesomeIcon icon={faForwardFast} />
    </button>
  </div>
</div>
