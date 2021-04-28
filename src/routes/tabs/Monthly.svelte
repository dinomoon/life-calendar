<script>
  import { onMount } from 'svelte';

  import {
    userInfo,
    thisYear,
    thisMonth,
    monthlyFoldObj,
    rowArray,
    colArray,
    userAge,
  } from '../../store';
  import { fade } from 'svelte/transition';

  colArray.set(new Array(12));

  let rows = [];
  let btns = [];
  let btnIdx = 0;

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

  onMount(() => {
    if (JSON.parse(localStorage.getItem('monthly-fold-obj')) === null) {
      localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
    }

    const obj = JSON.parse(localStorage.getItem('monthly-fold-obj'));
    monthlyFoldObj.set(obj);

    for (const key in obj) {
      if (key === '1' && obj[key]) {
        rows.forEach((row, idx) => {
          if (idx >= +key && idx <= +key + 7) {
            row.classList.toggle('hidden');
          }
        });
      } else if (key !== '1' && obj[key]) {
        rows.forEach((row, idx) => {
          if (idx >= +key && idx <= +key + 8) {
            row.classList.toggle('hidden');
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
    let data = +target.dataset.btn;

    if (data === 1) {
      rows.forEach((row, idx) => {
        if (idx >= data && idx <= data + 7) {
          row.classList.toggle('hidden');
        }
      });
    } else {
      rows.forEach((row, idx) => {
        if (idx >= data && idx <= data + 8) {
          row.classList.toggle('hidden');
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
  {#each $rowArray as _, rowIdx}
    <div class="row" bind:this={rows[rowIdx]}>
      {#each $colArray as _, colIdx}
        <div
          class="item"
          class:past={rowIdx < $userAge}
          class:current={rowIdx + 1 === $userAge && colIdx === $thisMonth}
          class:vertical-past={rowIdx < $userAge && colIdx === $thisMonth}
          class:vertical-future={rowIdx + 1 > $userAge &&
            colIdx % 12 === $thisMonth}
          class:horizontal-past={rowIdx + 1 === $userAge && colIdx < $thisMonth}
          class:horizontal-future={rowIdx + 1 === $userAge &&
            colIdx > $thisMonth}
          class:circle={$userInfo.monthly[`${rowIdx + 1} ${colIdx + 1}`] !==
            undefined &&
            $userInfo.monthly[`${rowIdx + 1} ${colIdx + 1}`].length !== 0}
          data-id={colIdx}
          data-age={rowIdx}
        >
          <!-- month -->
          {#if rowIdx === 0 && colIdx < 12}
            <span class="month-name" class:current-text={$thisMonth === colIdx}
              >{monthName[colIdx]}</span
            >
          {/if}
          <!-- // month -->
          <!-- age -->
          {#if colIdx === 0}
            <span
              class="cursor-default age"
              class:text-bold={rowIdx === 0 || (rowIdx + 1) % 10 === 0}
              class:current-text={rowIdx ===
                $thisYear - $userInfo.birthday.year}
            >
              {rowIdx + 1}
            </span>
          {/if}
          <!-- // age -->
          <!-- fold button -->
          {#if (rowIdx === 0 || (rowIdx + 1) % 10 === 0) && colIdx === 11 && rowIdx !== 99}
            <button
              on:click={hideHandler}
              class="fold-button"
              data-btn={rowIdx + 1}
              bind:this={btns[btnIdx++]}
            >
              <i class="fas fa-chevron-down" />
            </button>
            <!-- // fold button -->
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .row {
    display: inline-grid;
    grid-template-columns: repeat(12, 60px);
    gap: 4px;
  }

  .calendar--grid {
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
