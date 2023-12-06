<script lang="ts">
  import Footer from '$lib/Footer.svelte';
  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<header class="container xl:max-w-screen-xl lg:max-w-screen-lg mx-auto">
  <h1 class="text-7xl max-w-fit m-auto mt-20">cinesync</h1>
</header>

<form method="POST" action="?/login">
  <div class="max-w-xs m-auto pt-5">
    <div class="flex pt-2 pb-2">
      <label class="w-24 text-center" for="login">email</label>
      <input
        class=" text-background pl-1"
        type="email"
        name="email"
        id="login"
        placeholder="clint@eastwood.org"
        required
      />
    </div>
    <div class="flex pt-2 pb-2">
      <label class="w-24 text-center " for="password">password</label>
      <input
        class=" text-background pl-1"
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
      <span>incorrect email or password</span>
    </div>
  {/if}
  <div class="flex max-w-xs m-auto pt-5 justify-around">
    <button type="submit">login</button>
  </div>
  <div class="max-w-xs m-auto pt-5">
    <div class="m-auto w-fit">you don't have an account?</div>
    <div class="m-auto w-fit"><a href="/signup">sign up!</a></div>
  </div>
</form>

<Footer />
