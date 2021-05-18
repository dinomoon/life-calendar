<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    clickedDay,
    userDocId,
    userInfo,
    activeTab,
    showItemModal,
    dayNum,
    dayArray,
    weekObj,
    selectedCategories
  } from '../store.js';

  import AnnualModal from './AnnualModal.svelte';
  import MonthlyModal from './MonthlyModal.svelte';
  import WeeklyModal from './WeeklyModal.svelte';

  let value = '';
  let editor;
  let currentDay = $weekObj[$dayNum];
  let allTags = [];
  let tags = [];
  let categories = [];
  let categoryItems = [];
  const FIRST_DAY_OF_WEEK = '월';
  const LAST_DAY_OF_WEEK = '일';
  const placeholder =
    '마크다운을 사용해 작성할 수 있어요! 혹시 모르신다면 도움말을 확인해보세요.';

  onMount(() => {
    BalloonEditor.create(document.querySelector('#editor'), {
      placeholder,
    })
      .then((newEditor) => {
        editor = newEditor;
        getData();
      })
      .catch((error) => {
        console.error(error);
      });
  });

  onDestroy(() => {
    saveData();
  });

  // clickHandler - annual, month, week - prev, next
  const clickHandler = async (e) => {
    const date = e.detail.date;
    const dir = e.detail.dir;
    const lastMonthOrWeek = date === 'month' ? 12 : 52;
    await saveData();

    // clickedDay 재설정
    if (dir === 'prev') {
      $clickedDay[date] === 1
        ? clickedDay.set({
            ...$clickedDay,
            year: $clickedDay.year - 1,
            age: $clickedDay.age - 1,
            [date]: lastMonthOrWeek,
          })
        : clickedDay.set({ ...$clickedDay, [date]: $clickedDay[date] - 1 });
    } else if (dir === 'next') {
      $clickedDay[date] === lastMonthOrWeek
        ? clickedDay.set({
            ...$clickedDay,
            year: $clickedDay.year + 1,
            age: $clickedDay.age + 1,
            [date]: 1,
          })
        : clickedDay.set({ ...$clickedDay, [date]: $clickedDay[date] + 1 });
    }
    getData();
  };

  // keydownHandler
  function keydownHandler(event) {
    event.keyCode === 27 && showItemModal.set(false);
  }

  // dayClickHandler
  function dayClickHandler(e) {
    saveData();
    const target = e.detail.target;
    if (target.classList.contains('day')) {
      currentDay = target.textContent;
      clickedDay.set({ ...$clickedDay, day: target.textContent });
      getData();
    }
  }

  // dayArrowClickHandler
  function dayArrowClickHandler(e) {
    saveData();
    const dir = e.detail;
    let currentIdx = $dayArray.indexOf(currentDay);

    if (dir === 'prev') {
      if (currentDay === FIRST_DAY_OF_WEEK && $clickedDay.week === 1) {
        clickedDay.set({...$clickedDay, age: $clickedDay.age - 1, week: 52})
      } else if (currentDay === FIRST_DAY_OF_WEEK) {
        clickedDay.set({...$clickedDay, week: $clickedDay.week - 1})
      }
      
      currentIdx--;
      if (currentIdx < 0) {
        currentIdx = 6;
      }
    } else if (dir === 'next') {
      if (currentDay === LAST_DAY_OF_WEEK && $clickedDay.week === 52) {
        clickedDay.set({...$clickedDay, age: $clickedDay.age + 1, week: 1})
      } else if (currentDay === LAST_DAY_OF_WEEK) {
        clickedDay.set({...$clickedDay, week: $clickedDay.week + 1})
      }
      
      currentIdx++;
      if (currentIdx > 6) {
        currentIdx = 0;
      }
    }
    currentDay = $dayArray[currentIdx];
    clickedDay.set({...$clickedDay, day: currentDay})
    getData();
  }

  // getData
  function getData() {
    switch ($activeTab) {
      case 'annual':
        value = $userInfo.annual[$clickedDay.year] || '';
        break;
      case 'monthly':
        value = $userInfo.monthly[`${$clickedDay.age} ${$clickedDay.month}`] || '';
        break;
      case 'weekly':
        if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] == null) {
          value = '';
          tags = [];
        } else if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day] == null) {
          value = '';
          tags = [];
        } else {
          value = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day].value || '';
          tags = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`][$clickedDay.day].tags || [];
        }
        allTags = $userInfo.weekly.allTags || [];
        categories = $userInfo.weekly.categories || [{category: '운동', items: ['푸쉬업', '턱걸이']}];

        if (categories == false) {
          categoryItems = [];
        } else {
          categoryItems = categories[0].items;
        }

        break;
    }

    editor.setData(value);
    editor.focus();
  }

  // saveData
  function saveData() {
    let value = editor.getData();
    value === '' ? value = null : value;
    switch ($activeTab) {
      case 'annual':
        db.collection('users')
          .doc($userDocId)
          .set(
            {
              annual: {
                [$clickedDay.year]: value
              }
            },
            { merge: true },
          );
        break;
      case 'monthly':
        db.collection('users')
          .doc($userDocId)
          .set(
            {
              monthly: {
                [`${$clickedDay.age} ${$clickedDay.month}`]: value
              },
            },
            { merge: true },
          );
        break;
      case 'weekly':
        let greenCount = 0;

        if ($userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`] !== undefined) {
          const weekDB = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`];
          if (value === null) {
            $dayArray.forEach(day => {
              if (weekDB[day] != null && weekDB[day].value != null && day !== $clickedDay.day) {
                greenCount++;
              }
            })
          } else {
            $dayArray.forEach(day => {
              if (weekDB[day] != null && weekDB[day].value != null || day === $clickedDay.day) {
                greenCount++;
              }
            })
          }
        } else if (value !== null){
          greenCount++;
        }
        db.collection('users')
          .doc($userDocId)
          .set(
            {
              weekly: {
                [`${$clickedDay.age} ${$clickedDay.week}`]: {
                  [$clickedDay.day]: {
                    value,
                  },
                  greenCount: {all: greenCount}
                },
              },
            },
            { merge: true },
          );
        break;
    }
  }

  // tagSubmitHandler
  function tagSubmitHandler(e) {
    const value = e.detail.tagInputValue;
    const color = e.detail.color;
    const newTag = {
      value,
      color,
    }
    tags = [...tags, newTag];
    allTags = [...allTags, newTag];
    tagsUpdateToDB('add', value);
  }

  // tagRemoveHandler
  function tagRemoveHandler(e) {
    const value = e.detail.value;
    const type = e.detail.type;

    if (type === 'onlyThis') {
      tags = tags.filter((tag) => tag.value != value);
    }
    
    if (type === 'all') {
      tags = tags.filter((tag) => tag.value != value);
      allTags = allTags.filter(tag => tag.value != value);
    }
    
    tagsUpdateToDB('remove', value);
  }

  function tagsUpdateToDB(type, value) {
    const weekDB = $userInfo.weekly[`${$clickedDay.age} ${$clickedDay.week}`];
    let tagCount = 0;
    $dayArray.forEach(day => {
      if (weekDB != null && weekDB[day] != null && weekDB[day].tags != null) {
        weekDB[day].tags.forEach(tag => {
          if (tag.value === value) {
            tagCount++;
          }
        })
      }
    })
    type === 'add' ? tagCount++  : tagCount--;
    if (tagCount === -1) {
      tagCount = 0;
    }
    
    db.collection('users')
      .doc($userDocId)
      .set(
        {
          weekly: {
            allTags,
            [`${$clickedDay.age} ${$clickedDay.week}`]: {
              [$clickedDay.day]: {
                tags,
              },
              greenCount: {[value]: tagCount}
            },
          },
        },
        { merge: true },
      );
  }

  function allTagsClickHandler(e) {
    const value = e.detail.value;
    let exist = false;
    tags.forEach(tag => {
      if (tag.value === e.detail.value) {
        exist = true;
      }
    })

    if (!exist) {
      tags = [...tags, e.detail];
      tagsUpdateToDB('add', value);
    }
  }

  function categorySubmitHandler(e) {
    const newCategory = e.detail;
    categories = [...categories, newCategory];

    categoryUpdateToDB();
  }

  function categoryItemSubmitHandler(e) {
    const selectedCategory = e.detail.selectedCategory;
    const newCategoryItem = e.detail.categoryItemValue;
    let selectedCategoryIdx;

    categories.filter((obj, idx) => {
      if (obj.category === selectedCategory) {
        selectedCategoryIdx = idx;
        categoryItems = obj.items;
      }
    });

    categoryItems = [...categoryItems, newCategoryItem];
    categories[selectedCategoryIdx].items = categoryItems;

    categoryUpdateToDB();
  }

  function categoryUpdateToDB() {
    db.collection('users')
      .doc($userDocId)
      .set(
        {
          weekly: {
            categories,
          },
        },
        { merge: true },
      );
  }
</script>

<svelte:window on:keydown={keydownHandler} />
{#if $activeTab === 'annual'}
  <AnnualModal on:click on:clickHandler={clickHandler} />
{:else if $activeTab === 'monthly'}
  <MonthlyModal on:click on:clickHandler={clickHandler} />
{:else if $activeTab === 'weekly'}
  <WeeklyModal
    on:click
    on:clickHandler={clickHandler}
    on:dayClickHandler={dayClickHandler}
    on:dayArrowClickHandler={dayArrowClickHandler}
    on:tagSubmitHandler={tagSubmitHandler}
    on:tagRemoveHandler={tagRemoveHandler}
    on:allTagsClickHandler={allTagsClickHandler}
    on:categorySubmitHandler={categorySubmitHandler}
    on:categoryItemSubmitHandler={categoryItemSubmitHandler}
    {currentDay}
    {allTags}
    {tags}
    {categories}
    {categoryItems}
  />
{/if}

<style>
  :global(#editor) {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }
</style>
