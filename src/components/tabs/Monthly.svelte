<script>
  import { onMount } from 'svelte';

  import {
    userInfo,
    thisYear,
    squareList,
    thisMonth,
    monthlyFoldObj,
  } from '../../store';
  import { fade } from 'svelte/transition';

  squareList.set(Array.from(Array(1200).keys()));
  let calendarGrid;
  let btns;
  let items;

  onMount(() => {
    calendarGrid = document.querySelector('.calendar--grid');
    btns = calendarGrid.querySelectorAll('button');
    items = calendarGrid.querySelectorAll('.item');

    if (JSON.parse(localStorage.getItem('monthly-fold-obj')) === null) {
      localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
    }

    const obj = JSON.parse(localStorage.getItem('monthly-fold-obj'));
    monthlyFoldObj.set(obj);

    for (const key in obj) {
      if (key === '1' && obj[key]) {
        items.forEach((item) => {
          if (item.dataset.age >= +key && item.dataset.age <= +key + 7) {
            item.classList.add('hidden');
          }
        });
      } else if (key !== '1' && obj[key]) {
        items.forEach((item) => {
          if (item.dataset.age >= +key && item.dataset.age <= +key + 8) {
            item.classList.add('hidden');
          }
        });
      }
      for (let btn of btns) {
        if (obj[key] && key === btn.dataset.btn) {
          btn.children[0].classList.add('fold');
        }
      }
    }
  });

  function hideHandler(e) {
    let button = null;
    let icon = null;
    let data = null;

    if (e.target.tagName === 'BUTTON') {
      button = e.target;
      icon = button.children[0];
      data = button.dataset.btn;
    } else {
      icon = e.target;
      button = icon.parentNode;
      data = button.dataset.btn;
    }

    if (data === '1') {
      items.forEach((item) => {
        if (item.dataset.age >= +data && item.dataset.age <= +data + 7) {
          item.classList.toggle('hidden');
        }
      });
    } else {
      items.forEach((item) => {
        if (item.dataset.age >= +data && item.dataset.age <= +data + 8) {
          item.classList.toggle('hidden');
        }
      });
    }

    $monthlyFoldObj[data] = $monthlyFoldObj[data] ? false : true;
    localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
    icon.classList.toggle('fold');
  }
</script>

<div class="calendar--grid" on:click on:mouseover on:mouseout in:fade>
  {#each $squareList as item}
    <div
      class="item"
      class:past={$userInfo.birthday.year + Math.floor(item / 12) < $thisYear}
      class:current={Math.floor(item / 12) ===
        $thisYear - $userInfo.birthday.year && item % 12 === $thisMonth}
      class:all-this-vertical-past={item % 12 === $thisMonth &&
        Math.floor(item / 12) < $thisYear - $userInfo.birthday.year}
      class:all-this-vertical-future={item % 12 === $thisMonth &&
        Math.floor(item / 12) > $thisYear - $userInfo.birthday.year}
      class:all-this-horizontal-past={Math.floor(item / 12) ===
        $thisYear - $userInfo.birthday.year && item % 12 < $thisMonth}
      class:all-this-horizontal-future={Math.floor(item / 12) ===
        $thisYear - $userInfo.birthday.year && item % 12 > $thisMonth}
      class:circle={$userInfo.monthly[
        `${Math.floor(item / 12) + 1} ${(item % 12) + 1}`
      ] !== undefined &&
        $userInfo.monthly[`${Math.floor(item / 12) + 1} ${(item % 12) + 1}`]
          .length > 0}
      data-id={item % 12}
      data-age={Math.floor(item / 12)}
    >
      {#if item === 0}
        <span class="month-name" class:currentText={$thisMonth === 0}>JAN</span>
      {:else if item === 1}
        <span class="month-name" class:currentText={$thisMonth === 1}>FEB</span>
      {:else if item === 2}
        <span class="month-name" class:currentText={$thisMonth === 2}>MAR</span>
      {:else if item === 3}
        <span class="month-name" class:currentText={$thisMonth === 3}>APR</span>
      {:else if item === 4}
        <span class="month-name" class:currentText={$thisMonth === 4}>MAY</span>
      {:else if item === 5}
        <span class="month-name" class:currentText={$thisMonth === 5}>JUN</span>
      {:else if item === 6}
        <span class="month-name" class:currentText={$thisMonth === 6}>JUL</span>
      {:else if item === 7}
        <span class="month-name" class:currentText={$thisMonth === 7}>AUG</span>
      {:else if item === 8}
        <span class="month-name" class:currentText={$thisMonth === 8}>SEP</span>
      {:else if item === 9}
        <span class="month-name" class:currentText={$thisMonth === 9}>OCT</span>
      {:else if item === 10}
        <span class="month-name" class:currentText={$thisMonth === 10}>NOV</span
        >
      {:else if item === 11}
        <span class="month-name" class:currentText={$thisMonth === 11}>DEC</span
        >
      {/if}
      <!-- age -->
      {#if item % 12 === 0}
        <span
          class="cursor-default age"
          class:textBold={(Math.floor(item / 12) + 1) % 10 === 0 || item === 0}
          class:currentText={Math.floor(item / 12) ===
            $thisYear - $userInfo.birthday.year}
        >
          {Math.floor(item / 12) + 1}
        </span>
      {/if}
      <!-- // age -->
      <!-- fold button -->
      {#if (item != 1199 && item % 12 === 11 && (Math.floor(item / 12) + 1) % 10 === 0) || item === 11}
        <button
          on:click={hideHandler}
          class="fold-button"
          data-btn={Math.ceil(item / 12)}
        >
          <i class="fas fa-chevron-down" />
        </button>
        <!-- // fold button -->
      {/if}
    </div>
  {/each}
</div>

<style>
  .calendar--grid {
    grid-template-columns: repeat(12, 60px);
    grid-template-rows: repeat(100, 30px);
    gap: 4px;
  }

  .circle::before {
    width: 6px;
    height: 6px;
  }

  .item .age {
    position: absolute;
    right: 130%;
  }

  .month-name {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -30px;
    cursor: default;
  }
</style>
