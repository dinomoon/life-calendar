<script>
  import { userInfo, clickedDay, modalTransition } from "../store";
  import { fly } from 'svelte/transition';
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  onMount(() => {
    let labelsObj = new Object;
    for (let i = startWeek; i <= endWeek; i++) {
      if ($userInfo.weekly[`${$clickedDay.age} ${i}`] != null) {
        const tags = $userInfo.weekly[`${$clickedDay.age} ${i}`].greenCount;
        const keys = Object.keys(tags);
        keys.forEach(key => {
          if (labelsObj[key] === undefined) {
            labelsObj[key] = 1;
          } else if (labelsObj[key] == 0) {
            labelsObj[key] = 0;
          } else {
            labelsObj[key]++;
          }
        })
      }
    }
    let labelsArray = Object.keys(labelsObj);
    labelsArray = labelsArray.filter(label => label != 'all');

    let dataArray = [];
    labelsArray.forEach(label => {
      dataArray.push(labelsObj[label])
    })

    console.log(dataArray)
    
    const data = {
      labels: labelsArray,
      datasets: [{
        label: 'My First dataset',
        data: dataArray,
        backgroundColor: ['red', 'orange', 'gold', 'skyblue']
      }]
    };

    const config = {
      type: 'bar',
      data: data,
    };

    new Chart(document.getElementById('myChart'), config);
  })

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
    <div>
      <canvas id="myChart"></canvas>
    </div>
    <div id="editor" spellcheck="false" />
  </div>
</div>

<style>
  .left .age {
    font-size: 14px;
  }
</style>