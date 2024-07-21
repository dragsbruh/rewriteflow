<script lang="ts">
  import { onMount } from "svelte";
  import {
    calcSuccessRate,
    generateDemoToken,
    rf,
    type Flow,
  } from "../rewrite_flow";

  import AlertBox from "../lib/AlertBox.svelte";

  interface EnvironmentVariable {
    name: string;
    value: string;
    id: string;
  }

  export let id: string;

  let flow: Flow;
  let loaded: boolean = false;
  let success_rate: number;
  let env: EnvironmentVariable[] = [];
  let flowCodePreview: HTMLElement | null;

  onMount(() => {
    rf.getMyFlow(id).then((theflow) => {
      flow = theflow;

      success_rate = calcSuccessRate(flow);

      env = [];
      for (const [key, value] of Object.entries(flow.env)) {
        env.push({
          name: key,
          value: value,
          id: generateDemoToken(),
        });
      }
      env = env;
      loaded = true;

      rf.getMyCode(flow.id).then((code) => {
        if (!flowCodePreview) {
          return;
        }
        flowCodePreview.innerText = code;
      });
    });
  });

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  function envSubmit(e: Event) {
    e.preventDefault();

    let payload: { [key: string]: string } = {};
    env.forEach((evar) => {
      payload[evar.name] = evar.value;
    });

    rf.updateFlowEnv(flow.id, payload)
      .then(() => {
        showAlert("Environment variables updated successfully", "success");
      })
      .catch((err) => {
        showAlert(err, "danger");
      });
  }

  let showAlert: (msg: string, lvl: string) => undefined = (msg, lvl) => {
    // placeholder so we wait until the alertbox is loaded
    setTimeout(() => {
      showAlert(msg, lvl);
    }, 1000);
  };
</script>

<section class="section">
  {#if loaded}
    <section class="hero {success_rate > 10 ? 'is-primary' : 'is-danger'}">
      <div class="hero-body">
        <p class="title">
          Your flow is performing {success_rate > 10
            ? "well!"
            : "a bit weird..."}
        </p>
        <p class="subtitle">
          Success rate is at {success_rate}% for {flow.analytics.calls} requests
        </p>
      </div>
    </section>
    <nav class="level mt-5">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Calls</p>
          <p class="title">{flow.analytics.calls}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Success Rate</p>
          <p class="title">{success_rate}%</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Fail count</p>
          <p class="title">{flow.analytics.failure}</p>
        </div>
      </div>
    </nav>

    <div class="section">
      <p class="title">{flow.name}</p>
      <div class="content">
        <p>
          Created on {formatDate(flow.created_at)}
        </p>

        <p>
          Last modified {formatDate(flow.last_modified)}
        </p>
        <hr />
        <div class="content is-small">
          <p>Internal ID: {flow.id}</p>
          <p>{flow.analytics.success} successful calls</p>
          <p>{flow.analytics.failure} failed calls</p>
          <p>{flow.analytics.calls} total calls</p>
        </div>
        <hr />
      </div>

      <div class="container mb-5">
        <AlertBox bind:showAlert />
      </div>

      <form class="control" on:submit={envSubmit}>
        <p class="title">Environment Variables</p>
        {#if env.length === 0}
          <p class="subtitle"><i>No env variables...</i></p>
        {/if}
        {#each env as evar}
          <div class="field has-addons">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Name"
                bind:value={evar.name}
              />
            </div>
            <div class="control is-expanded">
              <input
                class="input"
                type="text"
                placeholder="Value"
                bind:value={evar.value}
              />
            </div>
            <div class="control">
              <button
                class="button is-danger"
                on:click={(e) => {
                  e.preventDefault();
                  env = env.filter((e) => e.id !== evar.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
        <button class="button is-success control" type="submit">Sync</button>
        <button
          class="button is-info"
          on:click={(e) => {
            e.preventDefault();
            env.push({
              name: "",
              value: "",
              id: generateDemoToken(),
            });
            env = env;
          }}>New</button
        >
      </form>
      <hr />
      <div class="content mt-5">
        <p class="title">Your code</p>
        <div
          class="section m-2 mt-5 has-border-radius-3"
          style="background-color: #282c34;"
        >
          <div class="content" bind:this={flowCodePreview}></div>
        </div>
      </div>
    </div>
  {:else}
    <p class="subtitle has-text-centered is-italic">Loading</p>
  {/if}
</section>
