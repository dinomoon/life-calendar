<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { loggedIn, showHelpModal } from '../store';

  onMount(() => {
    if ($loggedIn === false) {
      push('/');
    }
  });

  // keydownHandler
  function keydownHandler(event) {
    event.keyCode === 27 && showHelpModal.set(false);
  }
</script>

<svelte:window on:keydown={keydownHandler} />
{#if $showHelpModal}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <h2>도움말</h2>
    </div>
  </div>
{/if}

<style>

</style>
