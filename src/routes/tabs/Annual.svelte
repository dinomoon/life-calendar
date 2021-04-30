<script>
  import { userInfo, colArray, userAge } from '../../store';

  colArray.set(new Array(100));
</script>

<div class="calendar--grid" on:click on:mouseover on:mouseout>
  {#each $colArray as _, colIdx}
    <div
      class="item"
      class:past={colIdx + 1 < $userAge}
      class:current={colIdx + 1 === $userAge}
      class:circle={$userInfo.annual[$userInfo.birthday.year + colIdx] !==
        undefined &&
        $userInfo.annual[$userInfo.birthday.year + colIdx].length !== 0}
      data-year={$userInfo.birthday.year + colIdx}
    >
      {$userInfo.birthday.year + colIdx}
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
