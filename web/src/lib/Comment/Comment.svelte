<script lang="ts">
  import MainContainer from './MainContainer.svelte';
  import ListContainer from './ListContainer.svelte';
  import Input from './Input.svelte';
  import Card from './Card.svelte';
  import Author from './Author.svelte';
  import Avatar from '$lib/Avatar.svelte';
  import Timestamp from './Timestamp.svelte';
  import type { CommentType } from '../../ambient';

  export let comments: CommentType[];
  export let listId: string;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<MainContainer>
  <ListContainer>
    {#each comments as comment (comment.id)}
      <Card>
        <Author>
          <Avatar username={comment.username ?? 'deleted user'} />
          {comment.username ?? 'deleted user'}
        </Author>
        <p>
          {comment.text}
        </p>
        <Timestamp>
          {new Date(comment.createdAt).toLocaleString('en-US', { timeZone: timezone })}
        </Timestamp>
      </Card>
    {/each}
  </ListContainer>
  <Input {listId} />
</MainContainer>
