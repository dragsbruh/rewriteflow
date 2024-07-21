<script>
  import { Router, Route } from "svelte-routing";
  import { rf } from "./rewrite_flow";

  import Nav from "./lib/Nav.svelte";

  import Home from "./pages/Home.svelte";
  import SignUp from "./pages/SignUp.svelte";
  import SignIn from "./pages/SignIn.svelte";
  import Logout from "./pages/LogOut.svelte";
  import Dash from "./pages/Dash.svelte";
  import Abuse from "./pages/Abuse.svelte";
  import FlowPage from "./pages/FlowPage.svelte";
  import About from "./pages/About.svelte";
  import Docs from "./pages/Docs.svelte";

  $: isAuth = rf.isAuthenticated();

  export let url;
</script>

<Router {url}>
  <Nav />
  <div>
    <Route path="/" component={Home} />
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={SignIn} />
    <Route path="/logout" component={Logout} />
    <Route path="/report" component={Abuse} />
    <Route path="/app" component={Dash} />
    <Route path="/about" component={About} />
    <Route path="/docs" component={Docs} />
    <Route path="/app/my/:id" let:params>
      <FlowPage id={params.id}/>
    </Route>
  </div>
</Router>
