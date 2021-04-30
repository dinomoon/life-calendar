<script>
  import {
    userInfo,
    thisMonth,
    rowArray,
    colArray,
    userAge,
  } from '../../store';

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  colArray.set(new Array(12));
  export let rows = [];
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

  function hideHandler(e) {
    dispatch('hideHandler', e);
  }
</script>

<div class="calendar--grid" on:click on:mouseover on:mouseout>
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
          data-row={rowIdx}
          data-col={colIdx}
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
              class:current-text={rowIdx + 1 === $userAge}
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
              data-btn-id={rowIdx + 1}
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
