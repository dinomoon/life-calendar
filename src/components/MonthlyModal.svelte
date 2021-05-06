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
      <h2 class="age left">
        {$userInfo.birthday.year +
          $clickedDay.age -
          1}년&nbsp;({$clickedDay.age})
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
    <div id="editor" />
  </div>
</div>