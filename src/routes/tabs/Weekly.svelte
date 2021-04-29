<script>
  import {
    userInfo,
    weekNum,
    rowArray,
    colArray,
    userAge,
    foldStore,
  } from '../../store';
  import { fade } from 'svelte/transition';

  colArray.set(new Array(52));

  export let rows = [];

  async function hideHandler(e) {
    let target = e.currentTarget;
    let icon = target.children[0];
    let data = +target.dataset.btnId;
    let hideNum;
    data === 1 ? (hideNum = 7) : (hideNum = 8);
    rows.forEach((row, idx) => {
      if (idx >= data && idx <= data + hideNum) {
        row.classList.toggle('hidden');
      }
    });

    foldStore.update((obj) => {
      obj.weekly[data] = !obj.weekly[data];
      return obj;
    });

    localStorage.setItem('fold-obj', JSON.stringify($foldStore));
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
          class:current={rowIdx + 1 === $userAge && colIdx + 1 === $weekNum}
          class:vertical-past={rowIdx < $userAge && colIdx + 1 === $weekNum}
          class:vertical-future={rowIdx + 1 > $userAge &&
            (colIdx + 1) % 52 === $weekNum}
          class:horizontal-past={rowIdx + 1 === $userAge && colIdx < $weekNum}
          class:horizontal-future={rowIdx + 1 === $userAge &&
            colIdx + 1 > $weekNum}
          class:circle={$userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`] !==
            undefined &&
            $userInfo.weekly[`${rowIdx + 1} ${colIdx + 1}`].length !== 0}
          data-row={rowIdx}
          data-col={colIdx}
        >
          {#if rowIdx === 0 && colIdx < 52}
            <span
              class="top-item cursor-default"
              class:current-text={$weekNum === colIdx + 1}>{colIdx + 1}</span
            >
          {/if}
          {#if colIdx === 0}
            <span
              class="left-item cursor-default"
              class:text-bold={rowIdx === 0 || (rowIdx + 1) % 10 === 0}
              class:current-text={rowIdx + 1 === $userAge}
            >
              {rowIdx + 1}
            </span>
          {/if}
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
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .row {
    display: inline-grid;
    grid-template-columns: repeat(52, 21px);
    gap: 3px;
  }

  .calendar--grid {
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
