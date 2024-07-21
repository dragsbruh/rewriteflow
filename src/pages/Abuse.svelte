<!-- svelte-ignore a11y-label-has-associated-control -->
<script lang="ts">
  import AlertBox from "../lib/AlertBox.svelte";
  import { rf } from "../rewrite_flow";

  let username: string;
  let message: string;

  function handleReport(e: Event) {
    e.preventDefault();

    rf.reportAbuse(username, message)
      .then(() => {
        showAlert(
          "The abuser has been reported. We will look into the details. Thanks for making this a better place!",
          "success"
        );
      })
      .catch((err) => {
        showAlert(`${err.message}`, "danger");
      });
  }
  let showAlert: (msg: string, lvl: string) => undefined;
</script>

<AlertBox bind:showAlert />
<div class="container mt-5 is-fluid">
  <h1 class="title">Report Abuse</h1>

  <form class="control" on:submit={handleReport}>
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Username</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="The abuser's username"
          required
          bind:value={username}
        />
      </div>
    </div>
    <div class="field">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">Message</label>
      <div class="control">
        <textarea
          class="textarea"
          placeholder="Details about the abuse. Include how you discovered it and how the abuser is abusing our platform"
          bind:value={message}
        ></textarea>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-link">Report</button>
      </div>
    </div>
  </form>
</div>
