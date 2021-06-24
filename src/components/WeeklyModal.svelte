<script>
  import { 
    userInfo,
    clickedDay,
    modalTransition,
    dayArray,
    lastColorIdx,
    selectedCategories,
    categories,
    userDocId,
  } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let currentDay;
  export let allTags = [];
  export let tags = [];
  let tagInputValue = '';
  let showAllTags = false;
  let categoryAdding = false;
  let categoryItemAdding = false;
  let categoryInputValue;
  let categoryItemInputValue;
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
    // const removeBtn = e.currentTarget.children[2];
    addBtn.classList.remove('hidden');
    // removeBtn.classList.remove('hidden');
  }

  function tdMouseOut(e) {
    const addBtn = e.currentTarget.children[1];
    // const removeBtn = e.currentTarget.children[2];
    addBtn.classList.add('hidden');
    // removeBtn.classList.add('hidden');
  }
  
  function categoryAddClickHandler() {
    categoryAdding = true;
  }

  function categoryItemAddClickHandler() {
    categoryItemAdding = true;
  }

  function categoryRemoveClickHandler() {
    const scLength = $selectedCategories.length;
    const currentCate = $selectedCategories[scLength - 1].category;
    const isConfirm = confirm(`${currentCate} 분류를 삭제하시겠습니까? 항목들도 다 같이 삭제됩니다.`);
    if (isConfirm) {
      const filteredSC = $selectedCategories.filter(sc => {
        return sc.category != currentCate;
      })
      selectedCategories.set(filteredSC);

      const filteredCategories = $categories.filter(cateObj => {
        return cateObj.category != currentCate;
      })
      categories.set(filteredCategories);

      const copiedCategories = $categories;
      db.collection('users')
      .doc($userDocId)
      .set(
        {
          weekly: {
            categories: copiedCategories,
          },
        },
        { merge: true },
      );

      console.log($categories.length)
      if ($categories.length === 0) {
        const initSC = { category: '텅', item: '텅', detail: {type: 'count', value: 0} };
        selectedCategories.set(initSC)
      }
    }
  }

  function categorySubmit() {
    if (categoryInputValue.trim() === '' || categoryInputValue == null) {
      alert('빈 칸은 입력할 수 없습니다.');
    } else {
      dispatch('categorySubmitHandler', {
        category: categoryInputValue,
        items: ['텅'],
      })

      $selectedCategories[$selectedCategories.length - 1].category = categoryInputValue;

      categoryAdding = false;
      categoryInputValue = '';
    }
  }

  function categoryItemSubmit(selectedCategory) {
    if (categoryItemInputValue === '' || categoryItemInputValue == null) {
      alert('빈 칸은 입력할 수 없습니다.');
    } else {
      dispatch('categoryItemSubmitHandler', {
        selectedCategory,
        categoryItemInputValue
      })

      $selectedCategories[$selectedCategories.length - 1].item = categoryItemInputValue;

      categoryItemAdding = false;
      categoryItemInputValue = '';
    }
  }

  function rowAddClickHandler() {
    let newSCObj;

    if ($selectedCategories.length === 0) {
      const initCate = $categories[0].category;
      const initItem = $categories[0].items[0];
      newSCObj = { category: initCate, item: initItem, detail: {type: 'count', value: 0} };
    } else {
      const lastSelected = $selectedCategories[$selectedCategories.length - 1];
      const lastCategory = lastSelected.category;
      const lastDetailType = lastSelected.detail.type;
      const lastItem = lastSelected.item;
      newSCObj = {category: lastCategory, item: lastItem, detail: {type: lastDetailType, value: 0}};
    }

    selectedCategories.update((sc) => {
      return [...sc, newSCObj]
    })
  }

  function handleSelectChange(idx) {
    const selectedCate = document.querySelector(`#categorySelect${idx}`).value;
    let item;
    $categories.forEach((categoryObj) => {
      if (categoryObj.category === selectedCate) {
        item = categoryObj.items[0];
      }
    })
    $selectedCategories.forEach(sc => {
      if (sc.category === selectedCate) {
        sc.item = item;
      }
    })
  }

  function handleSelectBlur() {
    return;
  }

  let showTable = true;
  function showTableToggle() {
    showTable = !showTable;
  }

  function handleTrDelete(idx) {
    const filteredSC = $selectedCategories.filter((sc, scIdx) => {
      return scIdx != idx;
    })

    selectedCategories.set(filteredSC);
  }
</script>

<div class="backdrop" on:click|self>
  <div class="modal" in:fly={$modalTransition} on:click={(e) => tagClickHandler(e)}>
    <!-- header -->
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
    <!-- // header -->
    <!-- day-wrap -->
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
    <!-- // day-wrap -->
    <!-- tag-container -->
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
    <!-- // tag-container -->
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
    <!-- table-container -->
    <div class="table-container">
      <div class="table-toggle">
        <!-- <i class="far fa-chart-bar" on:click={() => showTableToggle()}></i> -->
        <i class="fas fa-table" on:click={() => showTableToggle()}></i>
      </div>
      {#if showTable}
        <div class="table">
          <span class="row-add" on:click={() => rowAddClickHandler()}>
            <i class="far fa-plus-square"></i>
          </span>
          <!-- table -->
          <table>
            <!-- thead -->
            <thead class="thead">
              <tr>
                <td on:mouseover={(e) => tdMouseOver(e)} on:mouseout={(e) => tdMouseOut(e)}>
                  <span>분류</span>
                  <button on:click={() => categoryAddClickHandler()} class="hidden add-btn">&#43;</button>
                  <!-- <button on:click={() => categoryRemoveClickHandler()} class="hidden add-btn">&#45;</button> -->
                </td>
                <td on:mouseover={(e) => tdMouseOver(e)} on:mouseout={(e) => tdMouseOut(e)}>
                  <span>항목</span>
                  <button on:click={() => categoryItemAddClickHandler()} class="hidden add-btn">&#43;</button>
                  <!-- <button on:click={() => categoryItemRemoveClickHandler()} class="hidden add-btn">&#45;</button> -->
                </td>
                <td>
                  <span>추가사항</span>
                </td>
              </tr>
            </thead>
            <!-- // thead -->
            <!-- tbody -->
            <tbody>
              {#each $selectedCategories as selectedCateObj, idx}
                <tr>
                  <td>
                    {#if categoryAdding && $selectedCategories.length - 1 === idx}
                      <form
                        on:submit|preventDefault={() => {categorySubmit()}}
                      >
                        <input type="text" bind:value={categoryInputValue}>
                      </form>
                    {:else}
                      <select
                        id="categorySelect{idx}"
                        bind:value={$selectedCategories[idx].category}
                        on:change={() => handleSelectChange(idx)}
                        on:blur={() => handleSelectBlur()}
                      >
                        {#each $categories as obj}
                          <option value={obj.category}>{obj.category}</option>
                        {/each}
                      </select>
                    {/if}
                  </td>
                  <td>
                    {#if categoryItemAdding && $selectedCategories.length - 1 === idx}
                      <form
                        on:submit|preventDefault={() => {categoryItemSubmit(selectedCateObj.category)}}
                      >
                        <input type="text" bind:value={categoryItemInputValue}>
                      </form>
                    {:else}
                      <select
                        bind:value={selectedCateObj.item}
                      >
                        {#each $categories as obj, idx}
                          {#if obj.category === selectedCateObj.category}
                            {#each $categories[idx].items as item}
                              <option value={item}>{item}</option>
                            {/each}
                          {/if}
                        {/each}
                      </select>
                    {/if}
                  </td>
                  <td>
                    <select
                      bind:value={selectedCateObj.detail.type}
                      class="detail-type"
                    >
                      <option value="count">개수</option>
                      <option value="time">시간(분)</option>
                    </select>
                    <input
                      type="text"
                      bind:value={selectedCateObj.detail.value}
                    >
                  </td>
                  <td>
                    <i
                      on:click={() => handleTrDelete(idx)}
                      class="far fa-minus-square"
                    >
                    </i>
                  </td>
                </tr>
              {/each}
            </tbody>
            <!-- // tbody -->
          </table>
        </div>
      {/if}
    </div>
    <!-- // table-container -->
    <div id="editor" spellcheck="false" />
  </div>
</div>

<style>
  .modal {
    overflow-y: scroll;
  }

  .table-container {
    text-align: left;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--gray-2);
  }

  .table-container .table-toggle {
    text-align: right;
  }

  .table-container .table-toggle i {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.1);
    font-size: 1.4rem;
  }

  .table-container .table-toggle i:hover {
    color: rgba(0, 0, 0, 0.6);
  }

  .table {
    display: flex;
    padding-bottom: 1rem;
  }

  .table .row-add {
    margin: 10px 10px 0 0;
    align-self: flex-start;
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
    background-color: #51cf66;
    color: #fff;
    border-radius: 50%;
  }

  table {
    grid-row: 2;
    border-collapse: separate;
    border-spacing: 10px;
    user-select: none;
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

  table .detail-type {
    margin-bottom: 3px;
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

  .prev,
  .next {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  .prev::before,
  .next::before {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
  }

  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>