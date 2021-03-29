<script>
  import {loggedIn} from '../store';
</script>

<main class:loggedIn>
  <slot></slot>
</main>

<style>
  main {
    max-width: 1248px;
    margin: 0 auto;
    padding-top: 5rem;
    text-align: center;
  }

  main.loggedIn {
    max-width: 100%;
  }
</style>