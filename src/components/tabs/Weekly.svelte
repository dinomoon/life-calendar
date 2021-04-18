<script>
  import {
    userInfo,
    thisYear,
    squareList,
    weekNum,
    beforeBtnClasses,
    weeklyFoldObj,
    beforeBtnObj,
  } from '../../store';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  squareList.set(Array.from(Array(5200).keys()));
  let calendarGrid;

  onMount(() => {
    calendarGrid = document.querySelector('.calendar--grid');

    if (JSON.parse(localStorage.getItem('weekly-fold-obj')) === null) {
      localStorage.setItem('weekly-fold-obj', JSON.stringify($weeklyFoldObj));
    }

    $beforeBtnClasses.forEach((btnClass) => {
      if (
        JSON.parse(localStorage.getItem('weekly-fold-obj'))[btnClass] === true
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
        weeklyFoldObj.set(JSON.parse(localStorage.getItem('weekly-fold-obj')));
        $weeklyFoldObj[btnClass] = $weeklyFoldObj[btnClass] ? false : true;
        localStorage.setItem('weekly-fold-obj', JSON.stringify($weeklyFoldObj));
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
      class:past={$userInfo.birthday.year + Math.floor(item / 52) < $thisYear}
      class:current={Math.floor(item / 52) ===
        $thisYear - $userInfo.birthday.year && item % 52 === $weekNum - 1}
      class:all-this-vertical-past={item % 52 === $weekNum - 1 &&
        Math.floor(item / 52) < $thisYear - $userInfo.birthday.year}
      class:all-this-vertical-future={item % 52 === $weekNum - 1 &&
        Math.floor(item / 52) > $thisYear - $userInfo.birthday.year}
      class:all-this-horizontal-past={Math.floor(item / 52) ===
        $thisYear - $userInfo.birthday.year && item % 52 < $weekNum - 1}
      class:all-this-horizontal-future={Math.floor(item / 52) ===
        $thisYear - $userInfo.birthday.year && item % 52 > $weekNum - 1}
      class:before10={52 * 1 - 1 < item && item < 52 * 9}
      class:before20={52 * 10 - 1 < item && item < 52 * 19}
      class:before30={52 * 20 - 1 < item && item < 52 * 29}
      class:before40={52 * 30 - 1 < item && item < 52 * 39}
      class:before50={52 * 40 - 1 < item && item < 52 * 49}
      class:before60={52 * 50 - 1 < item && item < 52 * 59}
      class:before70={52 * 60 - 1 < item && item < 52 * 69}
      class:before80={52 * 70 - 1 < item && item < 52 * 79}
      class:before90={52 * 80 - 1 < item && item < 52 * 89}
      class:before100={52 * 90 - 1 < item && item < 52 * 99}
      class:circle={$userInfo.weekly[
        `${Math.floor(item / 52) + 1} ${(item % 52) + 1}`
      ] !== undefined &&
        $userInfo.weekly[`${Math.floor(item / 52) + 1} ${(item % 52) + 1}`]
          .length > 0}
      data-id={item % 52}
      data-age={Math.floor(item / 52)}
    >
      {#if item < 52}
        <span
          class="top-item cursor-default"
          class:currentText={item === $weekNum - 1}>{item + 1}</span
        >
      {/if}
      {#if item % 52 === 0}
        <span
          class="left-item cursor-default"
          class:textBold={(Math.floor(item / 52) + 1) % 10 === 0 || item === 0}
          class:currentText={Math.floor(item / 52) ===
            $thisYear - $userInfo.birthday.year}
        >
          {Math.floor(item / 52) + 1}
        </span>
      {/if}
      <!-- fold button -->
      {#if (item != 5199 && item % 52 === 51 && (Math.floor(item / 52) + 1) % 10 === 0) || item === 51}
        <button
          on:click={hideHandler}
          class="fold-button"
          class:b10={item === 52 * 1 - 1}
          class:b20={item === 52 * 10 - 1}
          class:b30={item === 52 * 20 - 1}
          class:b40={item === 52 * 30 - 1}
          class:b50={item === 52 * 40 - 1}
          class:b60={item === 52 * 50 - 1}
          class:b70={item === 52 * 60 - 1}
          class:b80={item === 52 * 70 - 1}
          class:b90={item === 52 * 80 - 1}
          class:b100={item === 52 * 90 - 1}
        >
          <i class="fas fa-chevron-down" />
        </button>
      {/if}
      <!-- // fold button -->
    </div>
  {/each}
</div>

<style>
  .calendar--grid {
    grid-template-columns: repeat(52, 21px);
    grid-template-rows: repeat(100, 21px);
    gap: 3px;
  }

  .circle::before {
    right: 3px;
    top: 3px;
    width: 5px;
    height: 5px;
  }

  .item {
    border-radius: 1px;
  }

  .top-item,
  .left-item {
    position: absolute;
    font-size: 12px;
  }

  .top-item {
    top: -25px;
  }

  .left-item {
    right: 165%;
  }

  .fold-button {
    font-size: 12px;
    right: -25px;
  }
</style>
