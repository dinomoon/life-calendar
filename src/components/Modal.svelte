<script>
  import { onDestroy, onMount } from 'svelte';
  import { clickedDay, userDocId, userInfo, activeTab } from '../store.js';

  let value = '';
  let editor;

  onMount(() => {
    switch ($activeTab) {
      case '연간':
        value = $userInfo.annual[$clickedDay.year] || '';
        break;
      case '월간':
        value =
          $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || '';
        break;
      case '주간':
        value =
          $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] || '';
        break;
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

  const clickHandler = async (dir, date, adv) => {
    await saveData();
    if (dir === 'prev') {
      clickedDay.set({ [date]: $clickedDay[date] - 1 });
    } else if (dir === 'next') {
      clickedDay.set({ [date]: $clickedDay[date] + 1 });
    }

    value = $userInfo[adv][$clickedDay[date]] || '';
    editor.setData(value);
  };

  function saveData() {
    if (editor.getData() !== '') {
      switch ($activeTab) {
        case '연간':
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
          break;
        case '월간':
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
          break;
        case '주간':
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
          break;
      }
    }
  }
</script>

{#if $activeTab === '연간'}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <span
          class="prev"
          class:hidden={$clickedDay.year === $userInfo.birthday.year}
          on:click={() => clickHandler('prev', 'year', 'annual')}
        >
          {$clickedDay.year - 1}년
        </span>
        <h2>{$clickedDay.year}년</h2>
        <span
          class="next"
          class:hidden={$clickedDay.year === $userInfo.birthday.year + 99}
          on:click={() => clickHandler('next', 'year', 'annual')}
        >
          {$clickedDay.year + 1}년
        </span>
      </header>
      <div id="editor" />
    </div>
  </div>
{:else if $activeTab === '월간'}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <span
          class="prev"
          class:hidden={$clickedDay.month === 1}
          on:click={() => clickHandler('prev', 'month', 'monthly')}
        >
          {$clickedDay.month - 1}월
        </span>
        <h2>{$clickedDay.month}월</h2>
        <span
          class="next"
          class:hidden={$clickedDay.month === 12}
          on:click={() => clickHandler('next', 'month', 'monthly')}
        >
          {$clickedDay.month + 1}월
        </span>
      </header>
      <div id="editor" />
    </div>
  </div>
{:else if $activeTab === '주간'}
  <div class="backdrop" on:click|self>
    <div class="modal">
      <header>
        <span
          class="prev"
          class:hidden={$clickedDay.week === 1}
          on:click={() => clickHandler('prev', 'week', 'weekly')}
        >
          {$clickedDay.week - 1}주
        </span>
        <h2>{$clickedDay.week}주</h2>
        <span
          class="next"
          class:hidden={$clickedDay.week === 52}
          on:click={() => clickHandler('next', 'week', 'weekly')}
        >
          {$clickedDay.week + 1}주
        </span>
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
    width: 60vw;
    height: 80vh;
    padding: 40px 100px 60px;
    background-color: #fff;
    border-radius: 4px;
  }

  header {
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-evenly;
    padding-bottom: 20px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    user-select: none;
  }

  header h2 {
    font-size: 24px;
  }

  header span {
    display: inline-block;
    font-size: 20px;
    padding: 10px;
    color: #666;
    cursor: pointer;
  }
</style>
