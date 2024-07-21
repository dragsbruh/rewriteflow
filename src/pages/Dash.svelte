<script lang="ts">
  import { onMount } from "svelte";
  import { rf, type Flow, type User } from "../rewrite_flow";
  import AlertBox from "../lib/AlertBox.svelte";
  import FlowView from "../lib/FlowThumb.svelte";

  let user: User;
  let userFlows: Flow[];

  onMount(() => {
    if (!rf.isAuthenticated()) {
      window.location.href = "/login";
    }
    rf.me()
      .then((me) => {
        user = me;
      })
      .catch((err) => {
        showAlert("Failed to fetch user", "danger");
      });
    rf.getMyFlows().then((flows) => {
      userFlows = flows;
    });
  });

  $: loaded = user && userFlows;

  let showAlert: (msg: string, lvl: string) => undefined;
</script>

<AlertBox bind:showAlert />
{#if loaded}
  <div class="container is-fluid mt-5">
    <div class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Welcome, {user.username}</h1>
          <h2 class="subtitle">
            You have {userFlows.length} flows up and running
          </h2>
          <div class="buttons">
            <a href="/cli" class="button"> Open CLI documentation</a>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <p class="title">Your flows:</p>
      <div class="grid">
        {#each userFlows as flow}
          <div class="cell">
            <FlowView {flow} />
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
