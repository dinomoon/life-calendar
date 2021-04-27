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

  squareList.set(new Array(1200));

  let monthName = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  let btns = [];
  let items = [];
  let btnIdx = 0;

  onMount(() => {
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

  async function hideHandler(e) {
    let target = e.currentTarget;
    let icon = target.children[0];
    let data = target.dataset.btn;

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

    await monthlyFoldObj.update((obj) => {
      obj[data] = !obj[data];
      return obj;
    });
    localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
    icon.classList.toggle('fold');
  }
</script>

<div class="calendar--grid" on:click on:mouseover on:mouseout in:fade>
  {#each $squareList as _, idx}
    <div
      bind:this={items[idx]}
      class="item"
      class:past={$userInfo.birthday.year + Math.floor(idx / 12) < $thisYear}
      class:current={Math.floor(idx / 12) ===
        $thisYear - $userInfo.birthday.year && idx % 12 === $thisMonth}
      class:all-this-vertical-past={idx % 12 === $thisMonth &&
        Math.floor(idx / 12) < $thisYear - $userInfo.birthday.year}
      class:all-this-vertical-future={idx % 12 === $thisMonth &&
        Math.floor(idx / 12) > $thisYear - $userInfo.birthday.year}
      class:all-this-horizontal-past={Math.floor(idx / 12) ===
        $thisYear - $userInfo.birthday.year && idx % 12 < $thisMonth}
      class:all-this-horizontal-future={Math.floor(idx / 12) ===
        $thisYear - $userInfo.birthday.year && idx % 12 > $thisMonth}
      class:circle={$userInfo.monthly[
        `${Math.floor(idx / 12) + 1} ${(idx % 12) + 1}`
      ] !== undefined &&
        $userInfo.monthly[`${Math.floor(idx / 12) + 1} ${(idx % 12) + 1}`]
          .length > 0}
      data-id={idx % 12}
      data-age={Math.floor(idx / 12)}
    >
      {#if idx >= 0 && idx <= 11}
        <span class="month-name" class:current-text={$thisMonth === idx}
          >{monthName[idx]}</span
        >
      {/if}
      <!-- age -->
      {#if idx % 12 === 0}
        <span
          class="cursor-default age"
          class:text-bold={(Math.floor(idx / 12) + 1) % 10 === 0 || idx === 0}
          class:current-text={Math.floor(idx / 12) ===
            $thisYear - $userInfo.birthday.year}
        >
          {Math.floor(idx / 12) + 1}
        </span>
      {/if}
      <!-- // age -->
      <!-- fold button -->
      {#if (idx != 1199 && idx % 12 === 11 && (Math.floor(idx / 12) + 1) % 10 === 0) || idx === 11}
        <button
          on:click={hideHandler}
          class="fold-button"
          data-btn={Math.ceil(idx / 12)}
          bind:this={btns[btnIdx++]}
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
