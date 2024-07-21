<script lang="ts">
  import { onMount } from "svelte";
  import { rf } from "../rewrite_flow";
  import AlertBox from "../lib/AlertBox.svelte";

  type Timer = ReturnType<typeof setTimeout>;

  let wrtimeout: null | Timer;

  onMount(() => {
    setTimeout(logout, 60 * 1000);

    if (!rf.isAuthenticated()) {
      window.location.replace("/login");
    }
  });

  function logout() {
    if (wrtimeout != null) {
      // idk why i did this, this is not good but meh
      return;
    }

    rf.logout();
    wrtimeout = setTimeout(() => {
      window.location.replace("/login");
    }, 2500);
    showAlert("Logout successful! You will soon be redirected.", "success");
  }

  let showAlert: (msg: string, lvl: string) => undefined;
</script>

<AlertBox bind:showAlert />
<div class="container mt-5">
  <h1 class="title">Logout</h1>

  <p>
    You will be logged out in 60 seconds. You cannot login again without your
    access token. To prevent this action, simply close this page.
  </p>

  <div class="field is-grouped my-5">
    <div class="control">
      <button class="button is-link" on:click={logout}>Do it faster</button>
    </div>
  </div>

  <p>We hope we see you again!</p>
</div>
