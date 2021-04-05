<script>
  import { clickedDay } from '../store.js';

  export let showModal = false;
  export let annual;
  export let monthly;
  export let weekly;
</script>

{#if showModal}
  {#if annual}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <h2>{$clickedDay.year}년</h2>
      </div>
    </div>
  {:else if monthly}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <h2>{$clickedDay.month}월</h2>
      </div>
    </div>
  {:else if weekly}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <h2>{$clickedDay.week}주</h2>
      </div>
    </div>
  {/if}
{/if}

<style>
  .backdrop {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    width: 1000px;
    height: 800px;
    padding: 10px;
    background-color: #fff;
  }
</style>