<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import Footer from '$lib/Footer.svelte';
  import { selectRandomDirector } from '../../utils';
  import Toasts from '$lib/Toast/Toasts.svelte';
  import { addToast } from '../../store/toast';
  import { error } from './messages';
</script>

<Toasts />

<header class="container xl:max-w-screen-xl lg:max-w-screen-lg mx-auto">
  <h1 class="text-7xl max-w-fit m-auto mt-20">cinesync</h1>
</header>

<form
  method="POST"
  action="?/login"
  use:enhance="{() => {
    return async ({ result }) => {
      if (result.type === 'failure') {
        addToast(error);
      }
      await applyAction(result);
    };
  }}"
>
  <div class="max-w-md m-auto p-3 mt-5 rounded-xl border-solid border-secondary border-2">
    <div class="flex pt-2 pb-2 justify-center">
      <label class="w-24 text-center" for="login">email</label>
      <input
        class="text-background pl-1 w-60"
        type="email"
        name="email"
        id="login"
        placeholder="{selectRandomDirector()}"
        required
      />
    </div>
    <div class="flex pt-2 pb-2 justify-center">
      <label class="w-24 text-center" for="password">password</label>
      <input
        class="text-background pl-1 w-60"
        type="password"
        name="password"
        id="password"
        placeholder="password"
        required
      />
    </div>
    <div class="flex max-w-xs m-auto pt-5 justify-around">
      <button type="submit">login</button>
    </div>
    <div class="max-w-xs m-auto pt-5">
      <div class="m-auto w-fit">you don't have an account?</div>
      <div class="m-auto w-fit"><a href="/signup">sign up!</a></div>
    </div>
  </div>
</form>

<Footer />
