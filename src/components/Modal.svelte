<script>
  import { clickedDay, userInfo } from '../store.js';

  export let showModal = false;
  export let annual;
  export let monthly;
  export let weekly;

  let value = "";

  $: if (showModal) {
    if (annual) {
      value = $userInfo.annual[$clickedDay.year] || "";
    } else if (monthly) {
      value = $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || "";
    } else if (weekly) {
      value = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] || "";
    }
  }
</script>

{#if showModal}
  {#if annual}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <h2>{$clickedDay.year}년</h2>
        <textarea placeholder="여기에 기록을 할 수 있어요.">{value}</textarea>
      </div>
    </div>
  {:else if monthly}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <h2>{$clickedDay.month}월</h2>
        <textarea placeholder="여기에 기록을 할 수 있어요.">{value}</textarea>
      </div>
    </div>
  {:else if weekly}
    <div class="backdrop" on:click|self>
      <div class="modal">
        <h2>{$clickedDay.week}주</h2>
        <textarea placeholder="여기에 기록을 할 수 있어요.">{value}</textarea>
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
    /* justify-content: center; */
    align-items: center;
    font-size: 20px;
    width: 1000px;
    height: 800px;
    padding: 40px;
    background-color: #fff;
    border-radius: 4px;
  }

  .modal h2 {
    width: 100%;
    padding-bottom: 20px;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  textarea {
    background-color: inherit;
    border: none;
    outline: none;
    resize: none;
    width: 100%;
    height: 100%;
  }

  textarea::placeholder {
    font-size: inherit;
  }
</style>