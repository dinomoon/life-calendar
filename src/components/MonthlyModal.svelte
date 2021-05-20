<script>
  import { userInfo, clickedDay, modalTransition, dayArray } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  const backgroundColors = [
    '#ffc9c9',
    '#ffd8a8',
    '#ffec99',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];

  const borderColors = [
    '#fa5252',
    '#fd7e14',
    '#fab005',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];

  onMount(() => {
    makeTagPie();
    makeCategoryChart();
  })

  let monthSelectedCate = [];

  function makeCategoryChart() {
    let datasets = [];
    for (let i = startWeek; i <= endWeek; i++) {
      if ($userInfo.weekly[`${$clickedDay.age} ${i}`] != null) {
        $dayArray.forEach(day => {
          if ($userInfo.weekly[`${$clickedDay.age} ${i}`][day] != null) {
            const sc = $userInfo.weekly[`${$clickedDay.age} ${i}`][day].selectedCategories;
            sc.forEach(c => {
              if (monthSelectedCate.indexOf(c.category) === -1) {
                monthSelectedCate = [...monthSelectedCate, c.category];
              }
            })
          }
        })
      }
    }

    console.log(monthSelectedCate)

    const data = {
      labels: $dayArray,
      datasets: [{
        label: '푸쉬업',
        data: [1,2,3,4,5,6,7],
        backgroundColor: 'orange',
      },
      {
        label: '턱걸이',
        data: [1,2,3,4,5,6,7],
        backgroundColor: 'gold',
      }]
    };

    const config = {
      type: 'bar',
      data,
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: '18주',
          }
        }
      }
    };

    new Chart(document.getElementById('chart1'), config);
    new Chart(document.getElementById('chart2'), config);
    new Chart(document.getElementById('chart3'), config);
    new Chart(document.getElementById('chart4'), config);
  }

  function makeTagPie() {
    let tagObj = new Object;
    let tagCounts = [];
    let labels = [];
    for (let i = startWeek; i <= endWeek; i++) {
      if ($userInfo.weekly[`${$clickedDay.age} ${i}`] != null) {
        let tags = $userInfo.weekly[`${$clickedDay.age} ${i}`].greenCount;
        let tagsArray = Object.entries(tags);
        tagsArray.forEach(tagArray => {
          let tagName = tagArray[0];
          let tagCount = tagArray[1];
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
      tagCounts.push(tagObj[key]);
    }

    const data = {
      labels,
      datasets: [{
        label: 'tag',
        data: tagCounts,
        backgroundColor: backgroundColors,
      }]
    };

    const config = {
      type: 'pie',
      data: data,
      options: {
        responsive: false
      }
    };

    new Chart(document.getElementById('tagChart'), config);
  }

  function clickHandler(date, dir) {
    dispatch('clickHandler', {
      date,
      dir,
    })
  }

  $: year = moment().year($clickedDay.year);
  $: month = year.month($clickedDay.month - 1);
  $: monthStartDay = month.startOf('month').isoWeekday();
  $: monthEndDay = month.endOf('month').isoWeekday();
  let startWeek;
  let endWeek;

  $: if (monthStartDay < 5) {
    // 월화수일 때
    startWeek = month.startOf('month').isoWeek();
  } else {
    startWeek = month.startOf('month').isoWeek() + 1;
  }

  $: if (monthEndDay < 4) {
    endWeek = month.endOf('month').isoWeek() - 1;
  } else {
    endWeek = month.endOf('month').isoWeek();
  }

  $: if ($clickedDay.month === 1 && startWeek > monthEndDay) {
    startWeek = 1;
  }
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
        <h2>
          {$clickedDay.month}월
          <span class="date-period">
            {startWeek}주 ~ {endWeek}주
          </span>
        </h2>
        <i
          class="next fas fa-chevron-right"
          on:click={() => clickHandler('month', 'next')}
          class:hidden={$clickedDay.age === 100 && $clickedDay.month === 12}
        />
      </div>
    </header>
    <div class="checkbox-container">
      <input id="all" type="checkbox">
      <label for="all">all</label>
      <input id="tag" type="checkbox">
      <label for="tag">태그</label>
      {#each monthSelectedCate as cate}
        <input id={cate} type="checkbox">
        <label for={cate}>{cate}</label>
      {/each}
    </div>
    <canvas id="tagChart" width="300" height="300"></canvas>
    <br>
    <div class="canvas-container">
      <canvas id="chart1"></canvas>
      <canvas id="chart2"></canvas>
      <canvas id="chart3"></canvas>
      <canvas id="chart4"></canvas>
    </div>
    <div id="editor" spellcheck="false" />
  </div>
</div>

<style>
  .left .age {
    font-size: 14px;
  }

  .checkbox-container label {
    font-size: 18px;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    margin-right: 10px;
  }

  .checkbox-container input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  canvas {
    display: inline-block !important;
    width: calc(30vw - 120px) !important;
  }

  #tagChart {
    width: 300px !important;
    height: 300px !important;
  }
</style>