<script lang="ts">
  import { rf } from "../rewrite_flow";

  let activeEndpoint: string = window.location.pathname;

  let navItems = [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Report Abuse",
      href: "/report",
    },
  ];

  $: isAuth = rf.isAuthenticated();
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-brand">
    <a
      class="is-size-4 has-text-weight-bold is-family-monospace navbar-item"
      href="/"
    >
      Rewrite Flow
    </a>
  </div>
  <div class="navbar-menu">
    <div class="navbar-start">
      {#each navItems as nav}
        <a
          href={nav.href}
          class="navbar-item {nav.href == activeEndpoint ? 'is-active' : 'i'}"
          >{nav.title}</a
        >
      {/each}
    </div>

    <div class="navbar-end">
      {#if isAuth}
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary" href="/app">
              <strong>Dashboard</strong>
            </a>
          </div>
        </div>
      {:else}
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary" href="/signup">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light" href="/login"> Log in </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>
