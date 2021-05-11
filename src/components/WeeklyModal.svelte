<script>
  import { userInfo, clickedDay, modalTransition, dayArray, lastColorIdx } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  export let currentDay;
  export let allTags = [];
  export let tags = [];
  let tagInputValue = '';
  let showAllTags = false;
  let tagMouseEnter = false;
  const tagColors = ['#ff8787', '#f783ac', '#da77f2', '#9775fa', '#748ffc', '#4dabf7', '#3bc9db', '#38d9a9', '#69db7c', '#a9e34b', '#ffd43b', '#ffa94d'];
  const COLOR_COUNT = tagColors.length;

  $: startOfWeek = moment().year($clickedDay.year).isoWeek($clickedDay.week).startOf('isoWeek');
  $: endOfWeek = moment().year($clickedDay.year).isoWeek($clickedDay.week).endOf('isoWeek');
  $: startMonth = startOfWeek.month() + 1;
  $: startDate = startOfWeek.date();
  $: endMonth = endOfWeek.month() + 1;
  $: endDate = endOfWeek.date();

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

  function randomColor() {
    let randomIdx;
    randomIdx = Math.floor(Math.random() * COLOR_COUNT);
    // 직전에 추가한 태그의 색상과 다르게 만들기
    while ($lastColorIdx === randomIdx) {
      randomIdx = Math.floor(Math.random() * COLOR_COUNT);
    }
    lastColorIdx.set(randomIdx);
    return tagColors[randomIdx];
  }

  function tagSubmitHandler(e) {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      if (tagInputValue.trim() !== '') {
        const color = randomColor();
        
        dispatch('tagSubmitHandler', {
          tagInputValue,
          color
        })
        tagInputValue = '';
      } else {
        tagInputValue = '';
      }
    }
  }
  
  function tagRemoveHandler(value, type) {
    dispatch('tagRemoveHandler', {
      value,
      type
    })
  }

  function tagClickHandler(e) {
    if (e.target.dataset.type === 'tag') {
      showAllTags = true;
    } else {
      showAllTags = false;
    }
  }
</script>

<div class="backdrop" on:click|self>
  <div class="modal" in:fly={$modalTransition} on:click={(e) => tagClickHandler(e)}>
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
            {startMonth}/{startDate} ~ {endMonth}/{endDate}
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
    <div
      class="tag-container"
      data-type='tag'
    >
      {#each tags as tag}
        <div class="tag" style="background-color: {tag.color}">
          <span data-type='tag'>{tag.value}</span>
          <button data-type='tag' class="tag-remove" on:click={() => tagRemoveHandler(tag.value, 'onlyThis')}>
            <i data-type='tag' class="fas fa-times"></i>
          </button>
        </div>
      {/each}
      <div class="tag-input-container">
        <input
          data-type='tag'
          type="text"
          class="tag-input"
          placeholder="태그를 추가해보세요."
          on:keydown={(e) => {tagSubmitHandler(e)}} bind:value={tagInputValue}
        >
      </div>
    </div>
    {#if showAllTags && allTags.length !== 0}
      <div
        class="all-tags-container tag-container"
        data-type='tag'
        on:click={(e) => {console.log(e.target)}}
      >
        {#each allTags as tag}
          <div data-type='tag' class="tag" style="background-color: {tag.color}">
            <span data-type='tag'>{tag.value}</span>
            <button data-type='tag' class="tag-remove" on:click={() => tagRemoveHandler(tag.value, 'all')}>
              <i data-type='tag' class="fas fa-times"></i>
            </button>
          </div>
        {/each}
      </div>
    {/if}
    <div class="select-container">
      <select>
        <option value="자기계발">
          자기계발
        </option>
      </select>
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