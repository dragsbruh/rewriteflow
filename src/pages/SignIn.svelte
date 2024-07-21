<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
  import AlertBox from "../lib/AlertBox.svelte";

  import { rf, generateDemoToken } from "../rewrite_flow";
  import { onMount } from "svelte";

  onMount(() => {
    if (rf.isAuthenticated()) {
      window.location.replace("/app");
    }
  });

  const tokenRegex = /^[0-9a-fA-F]{32}$/;
  let token: string;

  function authFlow(e: Event) {
    e.preventDefault();
    if (!tokenRegex.test(token)) {
      showAlert("Invalid access token", "danger");
      return;
    }
    rf.authenticate(token)
      .then((user) => {
        showAlert(
          `Welcome ${user.username}! Redirecting in 3 seconds.`,
          "success"
        );
        setTimeout(() => {
          window.location.replace("/app");
        }, 3000);
      })
      .catch((err) => {
        try {
          let jsonErr = JSON.parse(err.message);
          showAlert(jsonErr.detail, "danger");
        } catch (e) {
          showAlert(`An error occurred: ${err.message}`, "danger");
          return;
        }
      });
  }

  let showAlert: (msg: string, lvl: string) => undefined;
</script>

<AlertBox bind:showAlert />
<div class="container mt-5 is-fluid">
  <h1 class="title">Sign In</h1>

  <form class="control" on:submit={authFlow}>
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Token</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Ex: {generateDemoToken()}"
          required
          bind:value={token}
        />
      </div>
      <p class="help">
        This is the token you got from your email when you first signed up.
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">Login</button>
      </div>
    </div>
  </form>
  <div class="has-text-centered text">
    Don't have an account? <a href="/signup">Sign Up</a>
  </div>
</div>
