<section class="hero is-fullheight">
  <div class="hero-body animated-background">
    <div class="container has-text-centered">
      <h1 class="title is-1">Welcome to Rewrite Flow</h1>
      <h2 class="subtitle is-3">
        Deploy lua scripts to the cloud that can be called by a webhook
      </h2>
      <a href="#get-started" class="button is-primary is-large mt-5">
        Get Started
      </a>
    </div>
  </div>
</section>

<section id="features" class="section">
  <div class="container">
    <h2 class="title has-text-centered">Features</h2>
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="box">
          <h3 class="title is-4">Generous Free Tier</h3>
          <p>We only have a free tier, and we don't have limits! (for beta)</p>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box">
          <h3 class="title is-4">Integrate with third parties</h3>
          <p>
            Call your webhook from third parties like github hooks or literally
            anyone who supports it
          </p>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="box">
          <h3 class="title is-4">Analytics</h3>
          <p>Dashboard and basic analytics (advanced analytics in progress)</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="get-started" class="section">
  <div class="container has-text-centered">
    <h2 class="title">Ready to Get Started?</h2>
    <a href="/signup" class="button is-primary is-large"> Sign Up Now </a>
  </div>
</section>

<style>
  .animated-background {
    background: linear-gradient(45deg, #14161a, #1b1f2a, #2a2e3b, #1d222b);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
  }

  @keyframes gradientAnimation {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0% 0%;
    }
  }
</style>
