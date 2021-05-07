<script>
  import { userInfo, clickedDay, modalTransition } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function clickHandler(date, dir) {
    dispatch('clickHandler', {
      date,
      dir,
    })
  }

  $: year = moment().year($clickedDay.year);
  $: startWeek = year.month($clickedDay.month - 1).startOf('isoMonth').isoWeek();
  $: nextStartWeek = year.month($clickedDay.month).startOf('isoMonth').isoWeek();
  $: endWeek = nextStartWeek - 1;
</script>

<div class="backdrop" on:click|self>
  <div class="modal" in:fly={$modalTransition}>
    <header class="modal-header">
      <h2 class="left">
        {$userInfo.birthday.year + $clickedDay.age - 1}년
        <span class="age">({$clickedDay.age})</span>
      </h2>
      <div class="right">
        <i
          class="prev fas fa-chevron-left"
          on:click={() => clickHandler('month', 'prev')}
          class:hidden={$clickedDay.age === 1 && $clickedDay.month === 1}
        />
        <h2>{$clickedDay.month}월</h2>
        <i
          class="next fas fa-chevron-right"
          on:click={() => clickHandler('month', 'next')}
          class:hidden={$clickedDay.age === 100 && $clickedDay.month === 12}
        />
      </div>
    </header>
    {startWeek}주 ~ {endWeek}주
    <div id="editor" />
  </div>
</div>

<style>
  .left .age {
    font-size: 14px;
  }
</style>