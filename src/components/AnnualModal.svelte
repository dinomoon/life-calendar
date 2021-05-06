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
</script>

<div class="backdrop" on:click|self>
  <div class="modal" in:fly={$modalTransition}>
    <header class="modal-header">
      <span
        class="prev"
        class:hidden={$clickedDay.year === $userInfo.birthday.year}
        on:click={() => clickHandler('year', 'prev')}
      >
        {$clickedDay.year - 1}년
      </span>
      <h2>{$clickedDay.year}년</h2>
      <span
        class="next"
        class:hidden={$clickedDay.year === $userInfo.birthday.year + 99}
        on:click={() => clickHandler('year', 'next')}
      >
        {$clickedDay.year + 1}년
      </span>
    </header>
    <div id="editor" />
  </div>
</div>

<style>
  .prev,
  .next {
    color: rgba(0, 0, 0, 0.2);
  }
</style>