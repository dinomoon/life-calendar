<script>
  import { onDestroy, onMount } from 'svelte';
  import { clickedDay, userDocId, userInfo } from '../store.js';

  export let annual;
  export let monthly;
  export let weekly;

  let value = '';
  let editor;

  onMount(() => {
    if (annual) {
      value = $userInfo.annual[$clickedDay.year] || '';
    } else if (monthly) {
      value =
        $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || '';
    } else if (weekly) {
      value = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] || '';
    }
    ClassicEditor.create(document.querySelector('#editor'), {
      // cloudServices: {
      //   tokenUrl: 'https://www.googleapis.com/auth/firebase.database',
      //   uploadUrl: 'https://www.googleapis.com/auth/firebase.database',
      // },
    })
      .then((newEditor) => {
        editor = newEditor;
        editor.setData(value);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  onDestroy(() => {
    saveData();
  });

  const clickHandler = async (dir) => {
    await saveData();
    if (dir === 'prev') {
      clickedDay.set({ year: $clickedDay.year - 1 });
    } else if (dir === 'next') {
      clickedDay.set({ year: $clickedDay.year + 1 });
    }
    value = $userInfo.annual[$clickedDay.year] || '';
    editor.setData(value);
  };

  function saveData() {
    if (editor.getData() !== '') {
      if (annual) {
        db.collection('users')
          .doc($userDocId)
          .set(
            {
              annual: {
                [$clickedDay.year]: editor.getData(),
              },
            },
            { merge: true },
          );
      } else if (monthly) {
        db.collection('users')
          .doc($userDocId)
          .set(
            {
              monthly: {
                [`${$clickedDay.age} ${$clickedDay.month}`]: editor.getData(),
              },
            },
            { merge: true },
          );
      } else if (weekly) {
        db.collection('users')
          .doc($userDocId)
          .set(
            {
              weekly: {
                [`${$clickedDay.age} ${$clickedDay.week}`]: editor.getData(),
              },
            },
            { merge: true },
          );
      }
    }
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
      <div id="editor" />
    </div>
  </div>
{:else if monthly}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <h2>{$clickedDay.month}월</h2>
      </header>
      <div id="editor" />
    </div>
  </div>
{:else if weekly}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <h2>{$clickedDay.age} - {$clickedDay.week}주</h2>
      </header>
      <div id="editor" />
    </div>
  </div>
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
    font-size: 1rem;
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
</style>
