<script>
  import { loggedIn } from '../store';

  let year = new Date().getFullYear();
</script>

<footer class:loggedIn={$loggedIn}>
  <div class="copyright">Copyright {year}. MoonK. All rights reserved.</div>
</footer>

<style>
  footer {
    padding: 100px 0 20px;
    text-align: center;
  }

  .copyright {
    color: #888;
    display: inline-block;
    padding: 20px;
    font-size: 12px;
    border-top: 1px solid var(--border-color);
  }
</style>
