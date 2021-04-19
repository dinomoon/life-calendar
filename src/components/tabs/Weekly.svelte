<script>
  import { onMount } from 'svelte';

  import {
    userInfo,
    thisYear,
    squareList,
    weekNum,
    weeklyFoldObj,
  } from '../../store';
  import { fade } from 'svelte/transition';

  squareList.set(Array.from(Array(5200).keys()));
  let calendarGrid;
  let btns;
  let items;

  onMount(async () => {
    calendarGrid = document.querySelector('.calendar--grid');
    items = calendarGrid.querySelectorAll('.item');
    btns = calendarGrid.querySelectorAll('button');

    if (JSON.parse(localStorage.getItem('weekly-fold-obj')) === null) {
      localStorage.setItem('weekly-fold-obj', JSON.stringify($weeklyFoldObj));
    }

    const obj = await JSON.parse(localStorage.getItem('weekly-fold-obj'));
    weeklyFoldObj.set(obj);

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

  async function hideHandler(e) {
    let target = e.currentTarget;
    let icon = target.children[0];
    let data = target.dataset.btn;
    let item;

    if (data === '1') {
      for (item of items) {
        if (item.dataset.age >= +data && item.dataset.age <= +data + 7) {
          item.classList.toggle('hidden');
        }
      }
    } else {
      for (item of items) {
        if (item.dataset.age >= +data && item.dataset.age <= +data + 8) {
          item.classList.toggle('hidden');
        }
      }
    }

    await weeklyFoldObj.update((obj) => {
      obj[data] = !obj[data];
      return obj;
    });
    localStorage.setItem('weekly-fold-obj', JSON.stringify($weeklyFoldObj));
    icon.classList.toggle('fold');
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
          class:current-text={item === $weekNum - 1}>{item + 1}</span
        >
      {/if}
      {#if item % 52 === 0}
        <span
          class="left-item cursor-default"
          class:text-bold={(Math.floor(item / 52) + 1) % 10 === 0 || item === 0}
          class:current-text={Math.floor(item / 52) ===
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
          data-btn={Math.ceil(item / 52)}
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
