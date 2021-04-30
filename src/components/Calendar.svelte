<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import {
    userInfo,
    colors,
    clickedDay,
    showModal,
    activeTab,
    loggedIn,
    colArray,
    foldStore,
  } from '../store';
  import Modal from './Modal.svelte';
  import Annual from '../routes/tabs/Annual.svelte';
  import Monthly from '../routes/tabs/Monthly.svelte';
  import Weekly from '../routes/tabs/Weekly.svelte';
  import { fly } from 'svelte/transition';
  const transition = { y: -10, duration: 600 };

  let calendarGrid;
  let btns;
  let rows = [];

  onMount(() => {
    if ($loggedIn === false) {
      push('/');
    }
    calendarGrid = document.querySelector('.calendar--grid');
    btns = calendarGrid.querySelectorAll('button');

    // fold button 불러오기
    if ($activeTab !== 'annual') {
      if (JSON.parse(localStorage.getItem('fold-obj')) === null) {
        localStorage.setItem('fold-obj', JSON.stringify($foldStore));
      }
      foldStore.set(JSON.parse(localStorage.getItem('fold-obj')));
      const obj = $foldStore[$activeTab];

      let hideNum;
      for (const key in obj) {
        key === '1' ? (hideNum = 7) : (hideNum = 8);
        if (obj[key]) {
          rows.forEach((row, idx) => {
            if (idx >= +key && idx <= +key + hideNum) {
              row.classList.add('disappear');
            }
          });
        }

        for (let btn of btns) {
          if (obj[key] && key === btn.dataset.btnId) {
            btn.children[0].classList.add('fold');
          }
        }
      }
    }
  });

  // clickHandler
  const clickHandler = async (e) => {
    const classList = e.target.classList;
    if (classList.contains('item')) {
      switch ($activeTab) {
        case 'annual':
          await clickedDay.set({ year: +e.target.dataset.year });
          break;
        case 'monthly':
          clickedDay.set({
            month: +e.target.dataset.col + 1,
            age: +e.target.dataset.row + 1,
          });
          break;
        case 'weekly':
          clickedDay.set({
            week: +e.target.dataset.col + 1,
            age: +e.target.dataset.row + 1,
          });
          break;
        default:
          return;
      }
      showModal.set(true);
    } else if (classList.contains('backdrop')) {
      showModal.set(false);
    }
  };

  // mouseoverHandler
  function mouseoverHandler(e) {
    let column = null;
    const hoverColor = $colors['hover-item-color'];
    const currentHoverColor = $colors['current-hover-item-color'];
    const target = e.target;
    if (target.classList.contains('item')) {
      if ($activeTab === 'annual') {
        target.style.backgroundColor = currentHoverColor;
        target.style.color = $colors['item-background-color'];
        let age = target.textContent - $userInfo.birthday.year + 1;
        target.textContent = age;
      } else {
        const hoverRowIdx = target.dataset.row;
        const hoverColIdx = target.dataset.col;
        column = calendarGrid.querySelectorAll(`[data-col="${hoverColIdx}"]`);

        let row = rows[hoverRowIdx];
        for (let i = 0; i < $colArray.length; i++) {
          row.children[i].style.backgroundColor = hoverColor;
        }

        column.forEach((item) => {
          item.style.backgroundColor = hoverColor;
        });
        target.style.backgroundColor = currentHoverColor;
      }
    }
  }

  // mouseoutHandler
  function mouseoutHandler(e) {
    let column = null;
    const pastColor = $colors['past-background-color'];
    const itemColor = $colors['item-background-color'];
    let target = e.target;
    if (target.classList.contains('item')) {
      if ($activeTab === 'annual') {
        target.style.color = '#000';
        target.style.backgroundColor = target.classList.contains('past')
          ? pastColor
          : itemColor;
        let year = +target.textContent + $userInfo.birthday.year - 1;
        target.textContent = year;
      } else {
        const hoverRowIdx = target.dataset.row;
        const hoverColIdx = target.dataset.col;

        column = calendarGrid.querySelectorAll(`[data-col="${hoverColIdx}"]`);

        let row = rows[hoverRowIdx];
        for (let i = 0; i < $colArray.length; i++) {
          row.children[i].style.backgroundColor = row.children[
            i
          ].classList.contains('past')
            ? pastColor
            : itemColor;
        }

        column.forEach((item) => {
          item.style.backgroundColor = item.classList.contains('past')
            ? pastColor
            : itemColor;
        });
      }
    }
  }

  async function hideHandler(e) {
    let target = e.detail.currentTarget;
    let icon = target.children[0];
    let data = +target.dataset.btnId;
    let hideNum;
    let hideRows = [];

    data === 1 ? (hideNum = 7) : (hideNum = 8);
    await rows.forEach((row, idx) => {
      if (idx >= data && idx <= data + hideNum) {
        hideRows.push(row);
      }
    });

    if (icon.classList.contains('fold')) {
      hideRows.forEach((row, idx) => {
        row.classList.remove('disappear');
        row.classList.add('appear');
        row.style.animationDelay = `${idx * 0.02}s`;
      });
    } else {
      hideRows.forEach((row, idx) => {
        row.classList.remove('appear');
        row.classList.add('disappear');
      });
    }

    foldStore.update((obj) => {
      obj[$activeTab][data] = !obj[$activeTab][data];
      return obj;
    });

    localStorage.setItem('fold-obj', JSON.stringify($foldStore));
    icon.classList.toggle('fold');
  }
</script>

<section>
  {#if $userInfo}
    <div class="container" in:fly={transition}>
      <!-- <div class="time">오늘은 {thisYear}년 {$thisMonth + 1}월 {date.getDate()}일 {$week[date.getDay()]}요일입니다.</div> -->
      {#if $activeTab === 'annual'}
        <Annual
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {:else if $activeTab === 'monthly'}
        <Monthly
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
          on:hideHandler={hideHandler}
          {rows}
        />
      {:else if $activeTab === 'weekly'}
        <Weekly
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
          on:hideHandler={hideHandler}
          {rows}
        />
      {/if}
    </div>
  {/if}
  {#if $showModal}
    <Modal on:click={clickHandler} />
  {/if}
</section>

<style>
  section {
    padding-top: 6rem;
  }

  .container {
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }
</style>
