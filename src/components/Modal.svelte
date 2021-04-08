<script>
  import { onMount } from 'svelte';
  import { clickedDay, showModal } from '../store.js';

  export let annual;
  export let monthly;
  export let weekly;

  export let value = "";
</script>

{#if $showModal}
  {#if annual}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <header>
          <span class="prev" on:click>{$clickedDay.year - 1}년</span>
          <h2>{$clickedDay.year}년</h2>
          <span class="next" on:click>{$clickedDay.year + 1}년</span>
        </header>
        <div
          class="textarea"
          contenteditable
          spellcheck="false"
          placeholder="여기에 기록을 할 수 있어요."
          bind:innerHTML={value}
        >
        </div>
      </div>
    </div>
  {:else if monthly}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <header>
          <h2>{$clickedDay.month}월</h2>
        </header>
        <div
          class="textarea"
          contenteditable
          spellcheck="false"
          placeholder="여기에 기록을 할 수 있어요."
          bind:innerHTML={value}
        >
        </div>
      </div>
    </div>
  {:else if weekly}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <header>
          <h2>{$clickedDay.age} - {$clickedDay.week}주</h2>
        </header>
        <div
          class="textarea"
          contenteditable
          spellcheck="false"
          placeholder="여기에 기록을 할 수 있어요."
          bind:innerHTML={value}
        >
        </div>
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
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    width: 60vw;
    height: 80vh;
    padding: 40px;
    background-color: #fff;
    border-radius: 4px;
  }

  .modal header {
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-evenly;
    padding-bottom: 20px;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
    user-select: none;
  }

  .modal header span {
    display: inline-block;
    padding: 10px;
    color: #666;
    cursor: pointer;
  }

  .textarea {
    text-align: left;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .textarea::placeholder {
    font-size: 1rem;
  }

  .textarea[placeholder]:empty:before {
    content: attr(placeholder);
    color: #777; 
  }
</style>