<script>
  import { userInfo, clickedDay, modalTransition, dayArray } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  export let currentDay;
  export let tags = [];
  let tagInputValue = '';
  $: year = moment().year($clickedDay.year);
  $: month = year.isoWeek($clickedDay.week).month();
  $: startDate = year.month(month).startOf('isoWeek').date();
  $: endDate = year.month(month).endOf('isoWeek').date();

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
    if (keyCode === 13 && tagInputValue !== '') {
      const text = tagInputValue.split(" ")[0];
      const time = tagInputValue.split(" ")[1];
      let timeArray;
      let hour;
      let min;
      let value;
      let minResult;

      if (time !== undefined) {
        timeArray = time.split(':');

        if (time.indexOf(':') === -1) {
          // 숫자만 있는 경우 (: 이 없는 경우) (시간만 있는)
          hour = +time;
          min = 0;
          hour === 0 ? minResult = null : minResult = hour * 60;
        } else {
          // : 이 있는 경우 (시간 + 분 또는 분만 있는)
          hour = +timeArray[0];
          min = +timeArray[1];
          minResult = hour * 60 + min;
        }

        if (hour !== 0 && min === 0) {
          value = `${text} ${hour}시간`;
        } else if (hour === 0 && min !== 0) {
          value = `${text} ${min}분`;
        } else if (hour !== 0 && min !== 0) {
          value = `${text} ${hour}시간 ${min}분`;
        }
      } else {
        value = text;
        minResult = 0;
      }
      
      dispatch('tagSubmitHandler', {
        value, minResult
      })
      tagInputValue = '';
    }
  }

  function tagRemoveHandler(id) {
    dispatch('tagRemoveHandler', id)
  }
</script>

<div class="backdrop" on:click|self>
  <div class="modal" in:fly={$modalTransition}>
    <header class="modal-header">
      <h2 class="left">
        {$userInfo.birthday.year + $clickedDay.age - 1}년
        <span class="age">
          ({$clickedDay.age})
        </span>
      </h2>
      <div class="right">
        <i
          id="week"
          class="prev fas fa-chevron-left"
          on:click={() => clickHandler('week', 'prev')}
          class:hidden={$clickedDay.age === 1 && $clickedDay.week === 1}
        />
        <h2>
          {$clickedDay.week}주
          <span class="date-period">
            {month + 1}/{startDate}
            ~
            {#if startDate > endDate}
              {#if month + 2 === 13}
                1/{endDate}
              {:else}
                {month + 2}/{endDate}
              {/if}
            {:else}
              {month + 1}/{endDate}
            {/if}
          </span>
        </h2>
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
      {#each tags as tag (tag.id)}
        <div class="tag">
          <span>{tag.value}</span>
          <button class="tag-remove" on:click={() => tagRemoveHandler(tag.id)}>
            <i class="fas fa-times"></i>
          </button>
        </div>
      {/each}
      <div class="tag-input-container">
        <input
          type="text"
          class="tag-input"
          placeholder="도움말에서 태그 입력 방식을 확인할 수 있어요."
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