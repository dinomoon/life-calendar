<script>
  import { userInfo, clickedDay, modalTransition, dayArray } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  export let currentDay;
  export let tags = [];
  let tagInputValue = '';

  function clickHandler(date, dir) {
    dispatch('clickHandler', {
      date,
      dir,
    })
  }

  function dayClickHandler(e) {
    dispatch('dayClickHandler', e);
  }

  function dayArrowClickHandler(dir) {
    dispatch('dayArrowClickHandler', dir)
  }

  function tagSubmitHandler(e) {
    const keyCode = e.keyCode;
    dispatch('tagSubmitHandler', {
      keyCode, tagInputValue
    })

    if (keyCode === 13) {
      tagInputValue = '';
    }
  }

  function tagRemoveHandler(e) {
    dispatch('tagRemoveHandler', e)
  }
</script>

<div class="backdrop" on:click|self>
  <div class="modal" in:fly={$modalTransition}>
    <header class="modal-header">
      <h2 class="age left">
        {$userInfo.birthday.year + $clickedDay.age - 1}년&nbsp;({$clickedDay.age})
      </h2>
      <div class="right">
        <i
          id="week"
          class="prev fas fa-chevron-left"
          on:click={() => clickHandler('week', 'prev')}
          class:hidden={$clickedDay.age === 1 && $clickedDay.week === 1}
        />
        <h2>{$clickedDay.week}주</h2>
        <i
          id="week"
          class="next fas fa-chevron-right"
          on:click={() => clickHandler('week', 'next')}
          class:hidden={$clickedDay.age === 100 && $clickedDay.week === 52}
        />
      </div>
    </header>
    <div class="day-wrap" on:click={dayClickHandler}>
      <i
        class="prev fas fa-chevron-left"
        on:click={() => dayArrowClickHandler('prev')}
        class:hidden={$clickedDay.age === 1 && $clickedDay.week === 1 && $clickedDay.day === '일'}
      />
      {#each $dayArray as day}
        <span class="day" class:today={currentDay === day}
          >{day}</span
        >
      {/each}
      <i
        class="next fas fa-chevron-right"
        on:click={() => dayArrowClickHandler('next')}
        class:hidden={$clickedDay.age === 100 && $clickedDay.week === 52 && $clickedDay.day === '토'}
      />
    </div>
    <div class="tag-container">
      {#each tags as tag, idx}
        <div class="tag">
          <span>{tag}</span>
          <button data-id={idx} class="tag-remove" on:click={tagRemoveHandler}>
            <i class="fas fa-times"></i>
          </button>
        </div>
      {/each}
      <div class="tag-input-container">
        <input
          type="text"
          class="tag-input"
          placeholder="ex) 독서:5"
          on:keydown={(e) => {tagSubmitHandler(e)}} bind:value={tagInputValue}
        >
      </div>
    </div>
    <div id="editor" />
  </div>
</div>

<style>
  .day-wrap {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin-bottom: 1.5rem;
  }

  .day-wrap .day {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    padding: 10px;
    cursor: pointer;
  }

  .day:hover {
    background-color: #ff8787;
    border-radius: 50%;
    color: #fff;
  }

  .day.today {
    background-color: var(--active-color);
    border-radius: 50%;
    color: #fff;
  }
</style>