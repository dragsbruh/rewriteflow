<script lang="ts">
  import AlertBox from "../lib/AlertBox.svelte";
  import { rf } from "../rewrite_flow";
  import { onMount } from "svelte";

  onMount(() => {
    if (rf.isAuthenticated()) {
      window.location.replace("/app");
    }
  });

  let username: string;
  let email: string;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

  function authFlow(e: Event) {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      showAlert(`That is not a valid email: ${email}`, "danger");
      return;
    }
    if (!usernameRegex.test(username)) {
      showAlert(`That is not a valid username: ${username}`, "danger");
      return;
    }

    rf.register(username, email)
      .then((user) => {
        showAlert(
          `Your account was registered. Access token was sent to the provided email. You can now login.`,
          "success"
        );
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
  <h1 class="title">Sign Up</h1>

  <form class="control" on:submit={authFlow}>
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Username</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Choose a nice one"
          required
          bind:value={username}
        />
      </div>
    </div>

    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Email</label>
      <div class="control">
        <input
          class="input"
          type="email"
          placeholder="Your email address"
          required
          bind:value={email}
        />
      </div>
      <p class="help">
        You will recieve your access token to this email, keep it safe.
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">Sign Up!</button>
      </div>
    </div>
  </form>

  <div class="has-text-centered text">
    Already have an account with us? <a href="/login">Sign In</a>
  </div>
</div>
