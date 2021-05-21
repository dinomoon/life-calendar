<script>
  import { 
    userInfo,
    clickedDay,
    modalTransition,
    dayArray,
    startWeek,
    endWeek,
    categories,
    backgroundColors,
    borderColors,
    tagCounts,
  } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  let tagPieChart;
  let categoryChart = [];
  let fromStartToEndWeek = [];
  let tagChecked = false;
  let checkedArray = [];
  $categories.forEach(cate => {
    checkedArray = [...checkedArray, {category: cate.category, checked: false}];
  })

  onMount(() => {
    getStartAndEndWeek();
  })

  // getStartAndEndWeek
  function getStartAndEndWeek() {
    let year = moment().year($clickedDay.year);
    let month = year.month($clickedDay.month - 1);
    let monthStartDay = month.startOf('month').isoWeekday();
    let monthEndDay = month.endOf('month').isoWeekday();

    if (monthStartDay < 5) {
      // 월화수일 때
      startWeek.set(month.startOf('month').isoWeek());
    } else {
      startWeek.set(month.startOf('month').isoWeek() + 1);
    }

    if (monthEndDay < 4) {
      endWeek.set(month.endOf('month').isoWeek() - 1);
    } else {
      endWeek.set(month.endOf('month').isoWeek());
    }

    if ($clickedDay.month === 1 && $startWeek > monthEndDay) {
      startWeek.set(1);
    }

    fromStartToEndWeek = [];
    let i = $startWeek;
    while(i <= $endWeek) {
      fromStartToEndWeek.push(i);
      i++;
    }
  }

  // Tags to Pie
  function makeTagPie() {
    tagCounts.set([]);
    let tagObj = new Object;
    let labels, tags, tagsArray, tagName, tagCount;
    for (let i = $startWeek; i <= $endWeek; i++) {
      if ($userInfo.weekly[`${$clickedDay.age} ${i}`] != null) {
        tags = $userInfo.weekly[`${$clickedDay.age} ${i}`].greenCount;
        tagsArray = Object.entries(tags);
        tagsArray.forEach(tagArray => {
          tagName = tagArray[0];
          tagCount = tagArray[1];
          if (tagName !== 'all' && tagCount !== 0) {
            tagObj[tagName] === undefined
              ? tagObj[tagName] = tagCount
              : tagObj[tagName] += tagCount;
          }
        })
      }
    }

    labels = Object.keys(tagObj);
    for (let key in tagObj) {
      tagCounts.update(tc => {
        return [...tc, tagObj[key]];
      })
    }

    if ($tagCounts.length === 0) {
      labels = ['텅']
      tagCounts.set([1])
    }

    const config = {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'tag',
          data: $tagCounts,
          backgroundColor: $backgroundColors,
        }]
      },
      options: {
        responsive: false
      }
    };

    if (tagPieChart != null) {
      tagPieChart.destroy();
    }
    tagPieChart = new Chart(document.getElementById('tagChart'), config);
  }

  // makeCategoryChart
  function makeCategoryChart() {
    let datasets, text, config, dayDB;
    $categories.forEach(obj => {
      fromStartToEndWeek.forEach((week) => {
        datasets = [];
        obj.items.forEach((item, idx) => {
          datasets = [...datasets, {label: item, data: new Array(7).fill(0), backgroundColor: $backgroundColors[idx]}]
        })
        text = week + '주';
        if ($userInfo.weekly[`${$clickedDay.age} ${week}`] != null) {
          $dayArray.forEach((day, idx) => {
            dayDB = $userInfo.weekly[`${$clickedDay.age} ${week}`][day];
            if (dayDB != null) {
              dayDB.selectedCategories.forEach(sc => {
                if (sc.detail.value != 0) {
                  datasets.forEach((dataset) => {
                    if (dataset.label === sc.item && obj.category === sc.category && dataset.label != '텅') {
                      dataset.data[idx] = sc.detail.value;
                    }
                  })
                }
              })
            }
          })
        }

        config = {
          type: 'bar',
          data: {
            labels: $dayArray,
            datasets,
          },
          options: {
            responsive: false,
            plugins: {
              title: {
                display: true,
                text,
              }
            }
          }
        }
        // if (categoryChart[idx] != null) {
        //   categoryChart[idx].destroy();
        // }
        // categoryChart[idx] = 
        new Chart(document.getElementById(`${obj.category}chart${week}`), config);
      })
    })
  }

  // clickHandler
  async function clickHandler(date, dir) {
    await dispatch('clickHandler', {
      date,
      dir,
    })
    getStartAndEndWeek();
    makeTagPie();
    makeCategoryChart();
  }

  function handleClickAll(e) {
    const checked = e.target.checked;
    tagChecked = checked;
    checkedArray.forEach(obj => {
      obj.checked = checked;
    })

    checkedArray = checkedArray;
  }

  function handleClickCheckBox(e) {
    let checkBoxArray = document.querySelectorAll('input[name=checkbox]');
    let checkedBoxArray = document.querySelectorAll('input[name=checkbox]:checked');
    let checkedAll = (checkBoxArray.length == checkedBoxArray.length);
    const checkBoxAll = document.querySelector('#all');
    checkBoxAll.checked = checkedAll;

    if (e.target.id === 'tag') {
      makeTagPie();
    }
    makeCategoryChart();
  }
</script>

<div class="backdrop" on:click|self>
  <!-- modal -->
  <div class="modal" in:fly={$modalTransition}>
    <!-- modal-header -->
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
        <h2>
          {$clickedDay.month}월
          <span class="date-period">
            {$startWeek}주 ~ {$endWeek}주
          </span>
        </h2>
        <i
          class="next fas fa-chevron-right"
          on:click={() => clickHandler('month', 'next')}
          class:hidden={$clickedDay.age === 100 && $clickedDay.month === 12}
        />
      </div>
    </header>
    <!-- // modal-header -->
    <div class="chart-container">
      <!-- checkbox-container -->
      <div class="checkbox-container">
        <label class="checkbox">
          <input id="all" type="checkbox" on:change={(e) => handleClickAll(e)}>
          <span class="icon"></span>
          <span class="text">all</span>
        </label>
        <label class="checkbox">
          <input
            id="tag"
            type="checkbox"
            name="checkbox"
            on:change={(e) => handleClickCheckBox(e)}
            bind:checked={tagChecked}
          >
          <span class="icon"></span>
          <span class="text">태그</span>
        </label>
        <!-- category checkbox -->
        {#each $categories as cateObj, idx}
          <label class="checkbox">
            <input
              id={cateObj.category}
              type="checkbox"
              name="checkbox"
              on:change={(e) => handleClickCheckBox(e)}
              bind:checked={checkedArray[idx].checked}
            >
            <span class="icon"></span>
            <span class="text">{cateObj.category}</span>
          </label>
        {/each}
        <!-- // category checkbox -->
      </div>
      <!-- // checkbox-container -->
      <canvas id="tagChart" class:hidden={!tagChecked}></canvas>
      <!-- canvas-container -->
      <div class="canvas-container">
        {#each $categories as cateObj, idx}
          {#each fromStartToEndWeek as week}
            <canvas
              id="{cateObj.category}chart{week}"
              class:hidden={!checkedArray[idx].checked}
              class="category"
            >
            </canvas>
          {/each}
        {/each}
      </div>
      <!-- // canvas-container -->
    </div>
    <div id="editor" spellcheck="false" />
  </div>
  <!-- // modal -->
</div>

<style>
  .left .age {
    font-size: 14px;
  }

  .chart-container {
    padding: 2rem 0 3rem;
    border-bottom: 1px solid var(--gray-2);
  }

  canvas {
    width: calc(30vw - 120px) !important;
  }

  canvas.category {
    display: inline-block !important;
  }

  canvas.category.hidden {
    display: none !important;
  }

  #tagChart {
    width: 300px !important;
    height: 300px !important;
    margin: 0 auto;
  }

  /* checkbox style & animation - 코남 */
  label {
    cursor: pointer;
    user-select: none;
    margin-right: 14px;
  }

  .checkbox input {
    display:none;
  }
  .checkbox span {
    display: inline-block;
    vertical-align: middle;
  }

  .checkbox .icon {
    position: relative;
    width: 16px;
    height: 16px;
    border: 1px solid #c8ccd4;
    border-radius: 3px;
    transition: all 0.1s ease;
  }

  .checkbox .icon::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 4px;
    width: 5px;
    height: 10px;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg) scale(0);
    transition: all 0.3s ease;
    transition-delay: 0.15s;opacity: 0;
  
  }

  .checkbox .text {
    margin-left: 2px;
  }

  .checkbox input:checked ~ .icon {
    border-color: transparent;
    background: var(--active-color);
    animation: jelly 0.6s ease;
  }

  .checkbox input:checked ~ .icon::after {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }

  @keyframes jelly {
    from {transform: scale(1, 1);}
    30% {transform: scale(1.25, 0.75);}
    40% {transform: scale(0.75, 1.25);}
    50% {transform: scale(1.15, 0.85);}
    65% {transform: scale(0.95, 1.05);}
    75% {transform: scale(1.05, 0.95);}
    to {transform: scale(1, 1);}
  }
</style>