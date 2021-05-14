<script>
  import { weekNum, rowArray, colArray, userAge, userInfo, selectedTag } from '../../store';

  import { createEventDispatcher } from 'svelte';

  colArray.set(new Array(52));
  export let rows = [];
  const dispatch = createEventDispatcher();

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
          class:past={rowIdx + 1 < $userAge ||
            (rowIdx + 1 === $userAge && colIdx < $weekNum)}
          class:current={rowIdx + 1 === $userAge && colIdx + 1 === $weekNum}
          class:green1={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 1}
          class:green2={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 2}
          class:green3={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 3}
          class:green4={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 4}
          class:green5={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 5}
          class:green6={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 6}
          class:green7={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] != null && $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].greenCount[$selectedTag] === 7}
          data-row={rowIdx}
          data-col={colIdx}
        >
          <!-- age -->
          {#if colIdx === 0}
            <span
              class="left-item cursor-default"
              class:text-bold={rowIdx === 0 || (rowIdx + 1) % 10 === 0}
              class:current-text={rowIdx + 1 === $userAge}
            >
              {rowIdx + 1}
            </span>
          {/if}
          <!-- // age -->

          <!-- fold button -->
          {#if (rowIdx === 0 || (rowIdx + 1) % 10 === 0) && colIdx === 51 && rowIdx !== 99}
            <button
              on:click={hideHandler}
              class="fold-button"
              data-btn-id={rowIdx + 1}
            >
              <i class="fas fa-chevron-down" />
            </button>
          {/if}
          <!-- // fold button -->

          <!-- week -->
          {#if rowIdx === 0 && colIdx < 52}
            <span
              class="top-item cursor-default"
              class:current-text={$weekNum === colIdx + 1}>{colIdx + 1}</span
            >
          {/if}
          <!-- // week -->
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .row {
    display: inline-grid;
    grid-template-columns: repeat(52, 21px);
    gap: 2px;
  }

  .calendar--grid {
    grid-template-rows: repeat(100, 21px);
    gap: 2px;
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
