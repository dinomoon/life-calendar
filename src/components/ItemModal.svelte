<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    clickedDay,
    userDocId,
    userInfo,
    activeTab,
    showItemModal,
    dayNum,
    dayArray,
    weekObj,
  } from '../store.js';
  import { fly } from 'svelte/transition';

  let value = '';
  let isEmpty;
  let editor;
  let currentDay = $weekObj[$dayNum];
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

  // clickHandler - annual, month, week - prev, next
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
    event.keyCode === 27 && showItemModal.set(false);
  }

  // dayClickHandler
  function dayClickHandler(e) {
    saveData();
    const target = e.target;
    if (target.classList.contains('day')) {
      currentDay = target.textContent;
      clickedDay.set({ ...$clickedDay, day: target.textContent });
      getData();
    }
  }

  // dayArrowClickHandler
  function dayArrowClickHandler(dir) {
    saveData();
    let currentIdx = $dayArray.indexOf(currentDay);

    if (dir === 'prev') {
      if (currentDay === '일' && $clickedDay.week === 1) {
        clickedDay.set({...$clickedDay, age: $clickedDay.age - 1, week: 52})
      } else if (currentDay === '일') {
        clickedDay.set({...$clickedDay, week: $clickedDay.week - 1})
      }
      currentIdx--;
      if (currentIdx < 0) {
        currentIdx = 6;
      }
    } else if (dir === 'next') {
      if (currentDay === '토' && $clickedDay.week === 52) {
        clickedDay.set({...$clickedDay, age: $clickedDay.age + 1, week: 1})
      } else if (currentDay === '토') {
        clickedDay.set({...$clickedDay, week: $clickedDay.week + 1})
      }
      
      currentIdx++;
      if (currentIdx > 6) {
        currentIdx = 0;
      }
    }
    currentDay = $dayArray[currentIdx];
    clickedDay.set({...$clickedDay, day: currentDay})
    getData();
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

    value === '' ? isEmpty = true : isEmpty = false;
    editor.setData(value);
    editor.focus();
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
          let greenCount = 0;
          const value = editor.getData();

          if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] !== undefined) {
            if (value === '') {
              $dayArray.forEach(day => {
                if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][day] !== '' && $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][day] !== undefined) {
                  greenCount++;
                }
              })
              if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day] !== '' && $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day] !== undefined) {
                  greenCount--;
              }
            } else {
              $dayArray.forEach(day => {
                if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][day] !== '' && $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][day] !== undefined) {
                  greenCount++;
                }
              })
              if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day] === '' || $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day] === undefined) {
                  greenCount++;
              }
            }
          } else if (value !== ''){
            greenCount++;
          }
          if (greenCount !== 0 || !isEmpty) {
            db.collection('users')
            .doc($userDocId)
            .set(
              {
                weekly: {
                  [`${$clickedDay.age} ${$clickedDay.week}`]: {
                    [$clickedDay.day]: value,
                    greenCount
                  },
                },
              },
              { merge: true },
            );
          }
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
        <i
          class="prev fas fa-chevron-left"
          on:click={() => dayArrowClickHandler('prev')}
          class:hidden={$clickedDay.age === 1 && $clickedDay.week === 1 && $clickedDay.day === '일'}
        />
        {#each $dayArray as day}
          <span class="day" class:today={currentDay === day}
            >{day}</span
          >
        {/each}
        <i
          class="next fas fa-chevron-right"
          on:click={() => dayArrowClickHandler('next')}
          class:hidden={$clickedDay.age === 100 && $clickedDay.week === 52 && $clickedDay.day === '토'}
        />
      </div>
      <div class="hash-tag__wrapper">
        <input type="text" class="hasg-tag__input" placeholder="태그를 입력할 수 있어요.">
        <div class="tag-container"></div>
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
    justify-content: space-between;
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

  .day:hover {
    background-color: #ff8787;
    border-radius: 50%;
    color: #fff;
  }

  .day.today {
    background-color: var(--active-color);
    border-radius: 50%;
    color: #fff;
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
    color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  #year.prev, #year.next {
    color: rgba(0, 0, 0, 0.2)
  }

  .prev:hover,
  .next:hover {
    color: rgba(0, 0, 0, 0.6) !important;
  }

  :global(.ck-editor__editable_inline) {
    width: calc(50vw - 160px);
  }

  :global(.ck-editor__editable_inline ol, .ck-editor__editable_inline ul) {
    padding-left: 2rem;
  }

  .hash-tag__wrapper {
    width: calc(50vw - 160px);
  }

  .hasg-tag__input {
    width: 100%;
    outline: none;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #efefef;
    padding: 0.8em 0.6em;
  }

  .hasg-tag__input:hover {
    background-color: #efefef;
  }
</style>
