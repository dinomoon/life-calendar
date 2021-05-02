<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    clickedDay,
    userDocId,
    userInfo,
    activeTab,
    showModal,
    dayNum,
    thisMonth,
    dateNum,
    dayArray,
  } from '../store.js';
  import { fly } from 'svelte/transition';

  let value = '';
  let isEmpty;
  let editor;
  let days = [];
  const modalTransition = { y: -20, duration: 400 };
  const placeholder =
    '마크다운을 사용해 작성할 수 있어요! 혹시 모르신다면 도움말을 확인해보세요.';

  onMount(() => {
    BalloonEditor.create(document.querySelector('#editor'), {
      placeholder,
    })
      .then((newEditor) => {
        editor = newEditor;
        getData();
      })
      .catch((error) => {
        console.error(error);
      });
  });

  onDestroy(() => {
    saveData();
  });

  // clickHandler
  const clickHandler = async (e, dir) => {
    const date = e.target.id;
    const lastMonthOrWeek = date === 'month' ? 12 : 52;
    await saveData();

    // clickedDay 재설정
    if (dir === 'prev') {
      $clickedDay[date] === 1
        ? clickedDay.set({
            ...$clickedDay,
            age: $clickedDay.age - 1,
            [date]: lastMonthOrWeek,
          })
        : clickedDay.set({ ...$clickedDay, [date]: $clickedDay[date] - 1 });
    } else if (dir === 'next') {
      $clickedDay[date] === lastMonthOrWeek
        ? clickedDay.set({
            ...$clickedDay,
            age: $clickedDay.age + 1,
            [date]: 1,
          })
        : clickedDay.set({ ...$clickedDay, [date]: $clickedDay[date] + 1 });
    }
    getData();
  };

  // keydownHandler
  function keydownHandler(event) {
    event.keyCode === 27 && showModal.set(false);
  }

  // dayClickHandler
  function dayClickHandler(e) {
    saveData();
    const target = e.target;
    if (target.classList.contains('day')) {
      days.forEach((day) => {
        day.classList.remove('today');
      });
      target.classList.add('today');
      clickedDay.set({ ...$clickedDay, day: target.textContent });
      getData();
    }
  }

  // getData
  function getData() {
    switch ($activeTab) {
      case 'annual':
        value = $userInfo.annual[$clickedDay.year] || '';
        break;
      case 'monthly':
        value =
          $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || '';
        break;
      case 'weekly':
        $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] === undefined
          ? (value = '')
          : (value =
              $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][
                $clickedDay.day
              ] || '');
        break;
    }
    value === '' ? (isEmpty = true) : (isEmpty = false);
    editor.setData(value);
  }

  // saveData
  function saveData() {
    if (editor.getData() !== '' || !isEmpty) {
      switch ($activeTab) {
        case 'annual':
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
        case 'monthly':
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
        case 'weekly':
          db.collection('users')
            .doc($userDocId)
            .set(
              {
                weekly: {
                  [`${$clickedDay.age} ${$clickedDay.week}`]: {
                    [$clickedDay.day]: editor.getData(),
                  },
                },
              },
              { merge: true },
            );
          break;
      }
    }
  }
</script>

<svelte:window on:keydown={keydownHandler} />
{#if $activeTab === 'annual'}
  <div class="backdrop" on:click|self>
    <div class="modal" in:fly={modalTransition}>
      <header>
        <span
          id="year"
          class="prev"
          class:hidden={$clickedDay.year === $userInfo.birthday.year}
          on:click={(e) => clickHandler(e, 'prev')}
        >
          {$clickedDay.year - 1}년
        </span>
        <h2>{$clickedDay.year}년</h2>
        <span
          id="year"
          class="next"
          class:hidden={$clickedDay.year === $userInfo.birthday.year + 99}
          on:click={(e) => clickHandler(e, 'next')}
        >
          {$clickedDay.year + 1}년
        </span>
      </header>
      <div id="editor" />
    </div>
  </div>
{:else if $activeTab === 'monthly'}
  <div class="backdrop" on:click|self>
    <div class="modal" in:fly={modalTransition}>
      <header>
        <h2 class="age left">
          {$userInfo.birthday.year +
            $clickedDay.age -
            1}년&nbsp;({$clickedDay.age})
        </h2>
        <div class="right">
          <i
            id="month"
            class="prev fas fa-chevron-left"
            on:click={(e) => clickHandler(e, 'prev')}
            class:hidden={$clickedDay.age === 1 && $clickedDay.month === 1}
          />
          <h2>{$clickedDay.month}월</h2>
          <i
            id="month"
            class="next fas fa-chevron-right"
            on:click={(e) => clickHandler(e, 'next')}
            class:hidden={$clickedDay.age === 100 && $clickedDay.month === 12}
          />
        </div>
      </header>
      <div id="editor" />
    </div>
  </div>
{:else if $activeTab === 'weekly'}
  <div class="backdrop" on:click|self>
    <div class="modal" in:fly={modalTransition}>
      <header>
        <h2 class="age left">
          {$userInfo.birthday.year +
            $clickedDay.age -
            1}년&nbsp;({$clickedDay.age})
        </h2>
        <div class="right">
          <i
            id="week"
            class="prev fas fa-chevron-left"
            on:click={(e) => clickHandler(e, 'prev')}
            class:hidden={$clickedDay.age === 1 && $clickedDay.week === 1}
          />
          <h2>{$clickedDay.week}주</h2>
          <i
            id="week"
            class="next fas fa-chevron-right"
            on:click={(e) => clickHandler(e, 'next')}
            class:hidden={$clickedDay.age === 100 && $clickedDay.week === 52}
          />
        </div>
      </header>
      <div class="day-wrap" on:click={dayClickHandler}>
        {#each $dayArray as day, idx}
          <span class="day" class:today={$dayNum === idx} bind:this={days[idx]}
            >{day}</span
          >
        {/each}
      </div>
      <div id="editor" />
    </div>
  </div>
{/if}

<style>
  #editor {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .day-wrap {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-around;
    user-select: none;
    margin-bottom: 1.5rem;
  }

  .day-wrap .day {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    padding: 10px;
    cursor: pointer;
  }

  .day.today {
    background-color: var(--active-color);
    border-radius: 50%;
    color: #fff;
  }

  .backdrop {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50vw;
    height: 80vh;
    padding: 40px 80px 60px;
    background-color: #fff;
    border-radius: 4px;
    overflow-y: auto;
  }

  header {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: baseline;
    padding-bottom: 20px;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--gray-2);
    user-select: none;
  }

  header h2 {
    font-weight: normal;
  }

  header .left,
  header .right {
    flex: 1;
  }

  header .right {
    display: flex;
    align-items: center;
  }

  header .left {
    font-size: 20px;
  }

  header .right h2 {
    font-size: 24px;
    flex: 1;
  }

  .prev,
  .next {
    display: inline-block;
    font-size: 20px;
    padding: 10px;
    color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  .prev:hover,
  .next:hover {
    color: rgba(0, 0, 0, 0.6);
  }

  :global(.ck-editor__editable_inline) {
    width: calc(50vw - 160px);
  }

  :global(.ck-editor__editable_inline ol, .ck-editor__editable_inline ul) {
    padding-left: 2rem;
  }
</style>
