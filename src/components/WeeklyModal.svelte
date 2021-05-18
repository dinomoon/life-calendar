<script>
  import { userInfo, clickedDay, modalTransition, dayArray, lastColorIdx, selectedCategories } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  export let currentDay;
  export let allTags = [];
  export let tags = [];
  export let categories = [];
  export let categoryItems = [];
  let tagInputValue = '';
  let showAllTags = false;
  let categoryAdding = false;
  let categoryItemAdding = false;
  let categoryValue;
  let categoryItemValue;
  let selectedCategory;
  let selectedCategoryItem;
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

  function allTagsClickHandler(e) {
    if (e.target.classList.contains('tag-value')) {
      const color = e.target.parentNode.style.backgroundColor;
      const value = e.target.textContent;
      const clickedTag = {
        color,
        value
      }

      dispatch('allTagsClickHandler', clickedTag)
    }
  }

  function tdMouseOver(e) {
    const addBtn = e.currentTarget.children[1];
    addBtn != null && addBtn.classList.remove('hidden');
  }

  function tdMouseOut(e) {
    const addBtn = e.currentTarget.children[1];
    addBtn != null && addBtn.classList.add('hidden');
  }
  
  function categoryAddClickHandler() {
    categoryAdding = true;
  }

  function categoryItemAddClickHandler() {
    categoryItemAdding = true;
  }

  function categorySubmit() {
    if (categoryValue === '' || categoryValue == null) {
      alert('빈 칸은 입력할 수 없습니다.');
    } else {
      dispatch('categorySubmitHandler', {
        category: categoryValue,
        items: [],
      })
      categoryAdding = false;
      categoryValue = '';
    }
  }

  function categoryItemSubmit() {
    if (categoryItemValue === '' || categoryItemValue == null) {
      alert('빈 칸은 입력할 수 없습니다.');
    } else {
      dispatch('categoryItemSubmitHandler', {
        selectedCategory,
        categoryItemValue
      })
      categoryItemAdding = false;
      categoryItemValue = '';
    }
  }

  $: categories.filter((obj) => {
    if (obj.category === selectedCategory) {
      categoryItems = obj.items;
    }
  });

  $: console.log($selectedCategories)
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
          <span class="tag-value" data-type='tag'>{tag.value}</span>
          <button data-type='tag' class="tag-remove" on:click={() => tagRemoveHandler(tag.value, 'onlyThis')}>
            <i data-type='tag' class="fas fa-times"></i>
          </button>
        </div>
      {/each}
      <div class="tag-input-container">
        <form on:submit|preventDefault={tagSubmitHandler}>
          <input
          data-type='tag'
          type="text"
          class="tag-input"
          placeholder="태그를 추가해보세요."
          bind:value={tagInputValue}
        >
        </form>
      </div>
    </div>
    {#if showAllTags && allTags.length !== 0}
      <div
        class="all-tags-container tag-container"
        data-type='tag'
        on:click={(e) => allTagsClickHandler(e)}
      >
        {#each allTags as tag}
          <div data-type='tag' class="tag" style="background-color: {tag.color}">
            <span class="tag-value" data-type='tag'>{tag.value}</span>
            <button data-type='tag' class="tag-remove" on:click={() => tagRemoveHandler(tag.value, 'all')}>
              <i data-type='tag' class="fas fa-times"></i>
            </button>
          </div>
        {/each}
      </div>
    {/if}
    <div class="table-container">
      <h2 class="table-title">그래프로 확인하고 싶은 항목들</h2>
      <div class="table">
        <span class="col-add">
          <i class="far fa-plus-square"></i>
        </span>
        <span class="row-add">
          <i class="far fa-plus-square"></i>
        </span>
        <!-- table -->
        <table>
          <!-- thead -->
          <thead class="thead">
            <tr>
              <td on:mouseover={(e) => tdMouseOver(e)} on:mouseout={(e) => tdMouseOut(e)}>
                {#if categoryAdding}
                  <form
                    on:submit|preventDefault={() => {categorySubmit()}}
                  >
                    <input type="text" bind:value={categoryValue}>
                  </form>
                {:else}
                  <span>분류</span>
                  <button on:click={() => categoryAddClickHandler()} class="hidden add-btn">+</button>
                {/if}
              </td>
              <td on:mouseover={(e) => tdMouseOver(e)} on:mouseout={(e) => tdMouseOut(e)}>
                {#if categoryItemAdding}
                  <form
                    on:submit|preventDefault={() => {categoryItemSubmit()}}
                  >
                    <input type="text" bind:value={categoryItemValue}>
                  </form>
                {:else}
                  <span>항목명</span>
                  <button on:click={() => categoryItemAddClickHandler()} class="hidden add-btn">+</button>
                {/if}
              </td>
              <td>
                <span>추가사항</span>
              </td>
            </tr>
          </thead>
          <!-- tbody -->
          <tbody>
            {#each $selectedCategories as category}
              <tr>
                <td>
                  <select class="category-select" bind:value={category.category}>
                    {#each categories as obj}
                      {#if obj.category === category.category}
                        <option selected value={obj.category}>{obj.category}</option>
                      {:else}
                        <option value={obj.category}>{obj.category}</option>
                      {/if}
                    {/each}
                  </select>
                </td>
                <td>
                  <select class="category-select" bind:value={category.item}>
                    {#each categoryItems as categoryItem}
                      <option value={categoryItem}>{categoryItem}</option>
                    {/each}
                  </select>
                </td>
                <td>
                  <select name="" id="">
                    <option value="">개수</option>
                    <option value="">시간</option>
                  </select>
                  <input type="text">
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <div id="editor" spellcheck="false" />
  </div>
</div>

<style>
  .table-container {
    text-align: left;
    padding-bottom: 2rem;
    margin-top: 1rem;
    border-bottom: 1px solid var(--gray-2);
  }

  .table-container .table-title {
    position: relative;
    display: inline-block;
    font-size: 18px;
    margin-bottom: 1rem;
    font-weight: normal;
    z-index: 1;
  }

  .table-container .table-title:before {
    content: '';
    display: block;
    width: 100%;
    height: 12px;
    position: absolute;
    left: -1px;
    bottom: 0;
    background: lightpink;
    z-index: -1;
  }

  .table {
    display: grid;
    grid-template-columns: auto 1fr;
    row-gap: 12px;
    column-gap: 16px;
  }

  .table .col-add {
    grid-column: 2;
  }

  .table .row-add {
    grid-row: 2;
  }
  
  .table i {
    font-size: 18px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.2);
  }

  .table i:hover {
    color: rgba(0, 0, 0, 0.6);
  }

  .thead .add-btn {
    padding: 0 7px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .thead .add-btn:hover {
    background-color: lightpink;
    color: #fff;
    border-radius: 50%;
  }

  table {
    grid-row: 2;
    border-collapse: collapse;
  }

  table td {
    vertical-align: top;
    display: inline-block;
    width: 100px;
    margin-right: 10px;
  }

  table select, input {
    width: 100%;
    height: 30px;
  }

  table input {
    text-align: right;
    padding-right: 5px;
  }

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