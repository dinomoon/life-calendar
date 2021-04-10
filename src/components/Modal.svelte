<script>
  import { onDestroy, onMount } from 'svelte';
  import { clickedDay, userDocId, userInfo } from '../store.js';

  export let annual;
  export let monthly;
  export let weekly;

  let value = "";

  onMount(() => {
    if (annual) {
      value = $userInfo.annual[$clickedDay.year] || "";
    } else if (monthly) {
      value = $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || "";
    } else if (weekly) {
      value = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] || "";
    }
  })

  onDestroy(() => {
    if (annual) {
      db.collection('users').doc($userDocId).set({
        annual: {
          [$clickedDay.year]: value
        },
      }, {merge: true});
    } else if (monthly) {
      db.collection('users').doc($userDocId).set({
        monthly: {
          [`${$clickedDay.age} ${$clickedDay.month}`]: textarea.innerHTML
        },
      }, {merge: true})
    } else if (weekly) {
      db.collection('users').doc($userDocId).set({
        weekly: {
          [`${$clickedDay.age} ${$clickedDay.week}`]: textarea.innerHTML
        },
      }, {merge: true})
    }
  })

  const clickHandler = (dir) => {
    db.collection('users').doc($userDocId).set({
      annual: {
        [$clickedDay.year]: value
      },
    }, {merge: true});
    if (dir === 'prev') {
      clickedDay.set({year: $clickedDay.year - 1});
    } else if (dir === 'next') {
      clickedDay.set({year: $clickedDay.year + 1});
    }
    value = $userInfo.annual[$clickedDay.year] || "";
  }
</script>

{#if annual}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <span
          class="prev"
          class:hidden={$clickedDay.year === $userInfo.birthday.year}
          on:click={() => clickHandler('prev')}
        >
          {$clickedDay.year - 1}년
        </span>
        <h2>{$clickedDay.year}년</h2>
        <span
          class="next"
          class:hidden={$clickedDay.year === $userInfo.birthday.year + 99}
          on:click={() => clickHandler('next')}
        >
          {$clickedDay.year + 1}년
        </span>
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

<style>
  .modal .hidden {
    visibility: hidden;
  }

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
    padding: 40px 100px 60px;
    background-color: #fff;
    border-radius: 4px;
  }

  .modal header {
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-evenly;
    padding-bottom: 20px;
    margin-bottom: 1.5rem;
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