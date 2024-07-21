<script lang="ts">
  let alert_container: HTMLElement;
  let alert_inner: HTMLDivElement;

  let possible_classes = [
    "is-hidden",
    "is-info",
    "is-success",
    "is-warning",
    "is-danger",
    "is-light",
    "is-dark",
  ];

  export function showAlert(msg: string, lvl: string) {
    alert_inner.innerText = msg;
    alert_container.classList.remove("is-hidden");

    possible_classes.forEach((cls) => {
      alert_container.classList.remove(cls);
    });

    alert_container.classList.add(`is-${lvl}`);
  }
</script>

<article class="message is-hidden" bind:this={alert_container}>
  <div class="message-body" bind:this={alert_inner}></div>
</article>
