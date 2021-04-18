<script>
  import { onMount } from 'svelte';

  import {
    userInfo,
    thisYear,
    squareList,
    thisMonth,
    beforeBtnClasses,
    monthlyFoldObj,
    beforeBtnObj,
  } from '../../store';
  import { fade } from 'svelte/transition';

  squareList.set(Array.from(Array(1200).keys()));
  let calendarGrid;

  onMount(() => {
    calendarGrid = document.querySelector('.calendar--grid');

    if (JSON.parse(localStorage.getItem('monthly-fold-obj')) === null) {
      localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
    }

    $beforeBtnClasses.forEach((btnClass) => {
      if (
        JSON.parse(localStorage.getItem('monthly-fold-obj'))[btnClass] === true
      ) {
        const btn = calendarGrid.querySelector(`.${btnClass}`);
        const icon = btn.querySelector('i');
        icon.classList.add('fold');
        const items = calendarGrid.querySelectorAll($beforeBtnObj[btnClass]);
        items.forEach((item) => item.classList.add('hidden'));
      }
    });
  });

  function hideHandler(e) {
    let button = null;
    let icon = null;
    let classList = null;
    let items = null;

    if (e.target.tagName === 'BUTTON') {
      button = e.target;
      icon = button.children[0];
      classList = button.classList;
    } else {
      icon = e.target;
      button = icon.parentNode;
      classList = button.classList;
    }

    icon.classList.toggle('fold');

    $beforeBtnClasses.forEach((btnClass) => {
      if (classList.contains(btnClass)) {
        monthlyFoldObj.set(
          JSON.parse(localStorage.getItem('monthly-fold-obj')),
        );
        $monthlyFoldObj[btnClass] = $monthlyFoldObj[btnClass] ? false : true;
        localStorage.setItem(
          'monthly-fold-obj',
          JSON.stringify($monthlyFoldObj),
        );
        items = calendarGrid.querySelectorAll($beforeBtnObj[btnClass]);
      }
    });
    items.forEach((item) => {
      item.classList.toggle('hidden');
    });
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
      class:before10={12 * 1 - 1 < item && item < 12 * 9}
      class:before20={12 * 10 - 1 < item && item < 12 * 19}
      class:before30={12 * 20 - 1 < item && item < 12 * 29}
      class:before40={12 * 30 - 1 < item && item < 12 * 39}
      class:before50={12 * 40 - 1 < item && item < 12 * 49}
      class:before60={12 * 50 - 1 < item && item < 12 * 59}
      class:before70={12 * 60 - 1 < item && item < 12 * 69}
      class:before80={12 * 70 - 1 < item && item < 12 * 79}
      class:before90={12 * 80 - 1 < item && item < 12 * 89}
      class:before100={12 * 90 - 1 < item && item < 12 * 99}
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
          class:b10={item === 12 * 1 - 1}
          class:b20={item === 12 * 10 - 1}
          class:b30={item === 12 * 20 - 1}
          class:b40={item === 12 * 30 - 1}
          class:b50={item === 12 * 40 - 1}
          class:b60={item === 12 * 50 - 1}
          class:b70={item === 12 * 60 - 1}
          class:b80={item === 12 * 70 - 1}
          class:b90={item === 12 * 80 - 1}
          class:b100={item === 12 * 90 - 1}
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
