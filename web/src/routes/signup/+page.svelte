<script>
  import Footer from '$lib/Footer.svelte';
  import { selectRandomDirector } from '../../utils';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<header class="container xl:max-w-screen-xl lg:max-w-screen-lg mx-auto">
  <h1 class="text-7xl max-w-fit m-auto pt-20">cinesync</h1>
</header>

<form method="POST" action="?/signup">
  <div class="max-w-md m-auto mt-5">
    <div class="flex pt-2 pb-2 justify-center">
      <label class="w-24 text-center" for="username">username</label>
      <input
        class=" text-background pl-1 w-60"
        type="text"
        name="username"
        id="username"
        placeholder="cinephile"
        required
      />
    </div>
    <div class="flex pt-2 pb-2 justify-center">
      <label class="w-24 text-center" for="login">email</label>
      <input
        class=" text-background pl-1 w-60"
        type="email"
        name="email"
        id="login"
        placeholder="{selectRandomDirector()}"
        required
      />
    </div>
    <div class="flex pt-2 pb-2 justify-center">
      <label class="w-24 text-center " for="password">password</label>
      <input
        class=" text-background pl-1 w-60"
        type="password"
        name="password"
        id="password"
        placeholder="password"
        required
      />
    </div>
  </div>
  {#if form?.statusCode !== 201 && form?.statusCode !== undefined}
    <div class="flex max-w-xs m-auto pt-5 justify-around">
      <span>invalid username or email</span>
    </div>
  {/if}
  <div class="flex max-w-xs m-auto pt-5 justify-around">
    <button type="submit">sign Up</button>
  </div>
  <div class="max-w-xs m-auto pt-5">
    <div class="m-auto w-fit">you already have an account?</div>
    <div class="m-auto w-fit"><a href="/login">log in!</a></div>
  </div>
</form>

<Footer />
