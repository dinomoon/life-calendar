<script>
  import { userInfo, thisYear, squareList, loading } from '../../store';
  import { fade } from 'svelte/transition';

  squareList.set(Array.from(Array(100).keys()));
</script>

<div class="calendar--grid" on:click on:mouseover on:mouseout in:fade>
  {#each $squareList as item}
    <div
      class="item"
      class:past={$userInfo.birthday.year + item < $thisYear}
      class:current={$userInfo.birthday.year + item === $thisYear}
      class:circle={$userInfo.annual[$userInfo.birthday.year + item] !==
        undefined &&
        $userInfo.annual[$userInfo.birthday.year + item].length > 0}
      data-year={$userInfo.birthday.year + item}
    >
      {$userInfo.birthday.year + item}
    </div>
  {/each}
</div>

<style>
  .item {
    font-size: 14px;
  }

  .item.current {
    background-color: var(--current-item-color) !important;
    border-color: #fff;
  }

  .calendar--grid {
    grid-template-columns: repeat(10, 90px);
    grid-template-rows: repeat(10, 45px);
    gap: 6px;
  }
</style>
