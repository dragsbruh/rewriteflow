<script lang="ts">
  import { onMount } from "svelte";
  import { calcSuccessRate, rf, type Flow } from "../rewrite_flow";

  export let flow: Flow;

  let success_rate = -1;

  function process_info() {
    success_rate = calcSuccessRate(flow);
  }

  onMount(() => {
    process_info();
  });
</script>

<div class="container">
  <div class="card" style="border-radius: 0.2rem;">
    <header class="card-header">
      <p class="card-header-title">{flow.name}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <p>{success_rate}% success rate</p>
        <p>
          Created on
          <time datetime={new Date(flow.created_at).toLocaleString()}
            >{new Date(flow.created_at).toLocaleString()}</time
          >
        </p>
      </div>
    </div>
    <footer class="card-footer">
      <a href="/app/my/{flow.id}" class="card-footer-item is-primary">Details</a
      >
    </footer>
  </div>
</div>
