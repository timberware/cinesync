<script lang="ts">
  export let tag: string | undefined;
  export let sticky: boolean = false;
</script>

<footer
  class="{`${sticky ? 'sticky ml-auto mr-2' : 'absolute right-2'}
  bg-secondary w-20 text-center p-1 rounded-xl bottom-3 z-50`}"
>
  {tag ?? 'unavailable'}
</footer>
