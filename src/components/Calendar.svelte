<script>
  import { fade } from 'svelte/transition';
  import { push } from "svelte-spa-router";
  import { userId, userInfo, week, colors } from "../store";

  export let annual = false;
  export let monthly = false;
  export let weekly = false;
  const date = new Date();
  const thisYear = date.getFullYear();
  const thisMonth = date.getMonth();
  let weekNum = null;
  let squareList = [];

  if (annual) {
    squareList = Array.from(Array(100).keys());
  } else if (monthly) {
    squareList = Array.from(Array(1200).keys());
  } else if (weekly) {
    squareList = Array.from(Array(5200).keys());
  }

  const submitHandler = async (e) => {
    const birthday = e.target['birthday'].value;
    const birthArray = birthday.split('-');
    const year = +birthArray[0];
    const month = +birthArray[1];
    const day = +birthArray[2];
    await db.collection('users').add({
      userId: $userId,
      birthday: {year, month, day},
    })
  }

  // const clickHandler = (e) => {
  //   if (annual && e.target.classList.contains('item')) {
  //     push('/monthly')
  //   } else if (monthly && e.target.classList.contains('item')) {
  //     push('/weekly');
  //     console.log(e.target)
  //   }
  // }

  // ====== weekNum 구하기 ======

  function isLeap(year) {
    if (year % 400 == 0) return true;
    if (year % 100 == 0) return false;
    if (year % 4 == 0) return true;
    return false;
  }

  function pYear(year) {
    return (year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)) % 7;
  }

  function lastWeek(year) {
    if (pYear(year) == 4 || pYear(year - 1) == 3) {
      return 53;
    } else {
      return 52;
    }
  }

  function ordinalDay(date) {
    var ordinal_table = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    if (isLeap(date.getFullYear()))
      for (var i = 2; i < ordinal_table.length; i++)
        ordinal_table[i] += 1;

    return ordinal_table[date.getMonth()] + date.getDate();
  }

  function weekNumber(date) {
    var ordinal_day = ordinalDay(date);
    var current_year = date.getFullYear();
    var weekday = date.getDay();
    var week = Math.floor((ordinal_day - weekday + 10) / 7);

    if (week < 1) return lastWeek(current_year- 1);
    if (week > lastWeek(current_year)) return 1;
    return week;
  }

  if (weekly) {
    weekNum = weekNumber(date);
  }

  function hideHandler(e) {
    let button = null;
    let icon = null;
    let classList = null;
    if (e.target.tagName === 'BUTTON') {
      button = e.target;
      icon = e.target.children[0];
      classList = button.classList;
    } else {
      button = e.target.parentNode;
      icon = e.target;
      classList = button.classList;
    }

    icon.classList.toggle('fold');

    if (classList.contains('b10')) {
      const items = document.querySelectorAll('.before10');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b20')) {
      const items = document.querySelectorAll('.before20');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b30')) {
      const items = document.querySelectorAll('.before30');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b40')) {
      const items = document.querySelectorAll('.before40');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b50')) {
      const items = document.querySelectorAll('.before50');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b60')) {
      const items = document.querySelectorAll('.before60');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b70')) {
      const items = document.querySelectorAll('.before70');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b80')) {
      const items = document.querySelectorAll('.before80');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b90')) {
      const items = document.querySelectorAll('.before90');
      items.forEach(item => item.classList.toggle('hidden'));
    } else if (classList.contains('b100')) {
      const items = document.querySelectorAll('.before100');
      items.forEach(item => item.classList.toggle('hidden'));
    }
  }

  function mouseoverHandler(e) {
    let items = null;
    let ages = null;
    const target = e.target;

    if (target.classList.contains('item')) {
      if (annual) {
        target.style.backgroundColor = $colors['current-item-color'];
        target.style.color = '#fff';
      } else {
        const hoverId = target.dataset.id;
        const hoverAge = target.dataset.age;

        items = document.querySelectorAll(`[data-id="${hoverId}"]`);
        ages = document.querySelectorAll(`[data-age="${hoverAge}"]`);

        items.forEach(item => {
          item.style.backgroundColor = $colors['hover-item-color'];
        })
        ages.forEach(age => {
          age.style.backgroundColor = $colors['hover-item-color'];
        })
        target.style.backgroundColor = $colors['current-item-color'];
      }
    }
  }

  function mouseoutHandler(e) {
    let items = null;
    let ages = null;
    let target = e.target;

    if (target.classList.contains('item')) {
      if (annual) {
        target.style.color = '#000';
        if (target.classList.contains('past')) {
          target.style.backgroundColor = $colors['past-background-color'];
        } else {
          target.style.backgroundColor = '#fff';
        }
      } else {
        const hoverId = target.dataset.id;
        const hoverAge = target.dataset.age;

        items = document.querySelectorAll(`[data-id="${hoverId}"]`);
        ages = document.querySelectorAll(`[data-age="${hoverAge}"]`);
        
        items.forEach(item => {
          if (item.classList.contains('past')) {
            item.style.backgroundColor = $colors['past-background-color'];
          } else {
            item.style.backgroundColor = '#fff';
          }
        })
        ages.forEach(age => {
          if (age.classList.contains('past')) {
            age.style.backgroundColor = $colors['past-background-color'];
          } else {
            age.style.backgroundColor = '#fff';
          }
        })
      }
    }
  }
</script>

<section>
  {#if $userInfo}
  <div class="container" class:annual class:monthly class:weekly>
    <div class="calendar--grid" on:mouseover={mouseoverHandler} on:mouseout={mouseoutHandler} in:fade>
      <div class="time">{thisYear}년 {thisMonth + 1}월 {date.getDate()}일 {$week[date.getDay()]}요일</div>
      {#each squareList as item}
        <!-- Annual -->
        {#if annual}
          <div class="item"
            class:past={$userInfo.birthday.year + item < thisYear}
            class:current={$userInfo.birthday.year + item === thisYear}
          >
            {$userInfo.birthday.year + item}
          </div>
        <!-- Monthly -->
        {:else if monthly}
          <div class="item"
            class:past={$userInfo.birthday.year + Math.floor(item / 12) < thisYear || ((Math.floor(item / 12) === (thisYear - $userInfo.birthday.year)) && (item % 12 < thisMonth))}
            class:allThisMonth={item % 12 === thisMonth}
            class:thisYear={Math.floor(item / 12) === (thisYear - $userInfo.birthday.year)}
            class:current={(Math.floor(item / 12) === (thisYear - $userInfo.birthday.year)) && (item % 12 === thisMonth)}
            class:before10={12 * 1 - 1 < item && item < 12 * 9}
            class:before20={12 * 10 - 1 < item && item < 12 * 19}
            class:before30={12 * 20 - 1 < item && item < 12 * 29}
            class:before40={12 * 30 - 1 < item && item < 12 * 39}
            class:before50={12 * 40 - 1 < item && item < 12 * 49}
            class:before60={12 * 50 - 1 < item && item < 12 * 59}
            class:before70={12 * 60 - 1 < item && item < 12 * 69}
            class:before80={12 * 70 - 1 < item && item < 12 * 79}
            class:before90={12 * 80 - 1 < item && item < 12 * 89}
            class:before100={12 * 90 - 1 < item && item < 12 * 99}
            data-id={item % 12}
            data-age={Math.floor(item / 12)}
          >
            {#if item === 0}
              <span class="month-name">JAN</span>
            {:else if item === 1}
              <span class="month-name">FEB</span>
            {:else if item === 2}
              <span class="month-name">MAR</span>
            {:else if item === 3}
              <span class="month-name">APR</span>
            {:else if item === 4}
              <span class="month-name">MAY</span>
            {:else if item === 5}
              <span class="month-name">JUN</span>
            {:else if item === 6}
              <span class="month-name">JUL</span>
            {:else if item === 7}
              <span class="month-name">AUG</span>
            {:else if item === 8}
              <span class="month-name">SEP</span>
            {:else if item === 9}
              <span class="month-name">OCT</span>
            {:else if item === 10}
              <span class="month-name">NOV</span>
            {:else if item === 11}
              <span class="month-name">DEC</span>
            {/if}
            {#if item % 12 === 0}
              <span class="cursor-default age" class:textBold={(Math.floor(item / 12) + 1) % 10 === 0 || item === 0}>{Math.floor(item / 12) + 1}</span>
            {/if}
            {#if item != 1199 && item % 12 === 11 && (Math.floor(item / 12) + 1) % 10 === 0 || item === 11}
              <button
                on:click={hideHandler}
                class="fold-button"
                class:b10={item === 12 * 1 - 1}
                class:b20={item === 12 * 10 - 1}
                class:b30={item === 12 * 20 - 1}
                class:b40={item === 12 * 30 - 1}
                class:b50={item === 12 * 40 - 1}
                class:b60={item === 12 * 50 - 1}
                class:b70={item === 12 * 60 - 1}
                class:b80={item === 12 * 70 - 1}
                class:b90={item === 12 * 80 - 1}
                class:b100={item === 12 * 90 - 1}
              >
                <i class="fas fa-chevron-down"></i>
              </button>
            {/if}
          </div>
        <!-- Weekly -->
        {:else if weekly}
          <div
            class="item"
            class:past={($userInfo.birthday.year + Math.floor(item / 52) < thisYear) || (($userInfo.birthday.year + Math.floor(item / 52) == thisYear) && (item % 52 < weekNum - 1))}
            class:current={(Math.floor(item / 52) === (thisYear - $userInfo.birthday.year)) && (item % 52 === weekNum - 1)}
            class:before10={52 * 1 - 1 < item && item < 52 * 9}
            class:before20={52 * 10 - 1 < item && item < 52 * 19}
            class:before30={52 * 20 - 1 < item && item < 52 * 29}
            class:before40={52 * 30 - 1 < item && item < 52 * 39}
            class:before50={52 * 40 - 1 < item && item < 52 * 49}
            class:before60={52 * 50 - 1 < item && item < 52 * 59}
            class:before70={52 * 60 - 1 < item && item < 52 * 69}
            class:before80={52 * 70 - 1 < item && item < 52 * 79}
            class:before90={52 * 80 - 1 < item && item < 52 * 89}
            class:before100={52 * 90 - 1 < item && item < 52 * 99}
            data-id={item % 52}
            data-age={Math.floor(item / 52)}
          >
            {#if item < 52}
              <span class="top-item cursor-default">{item + 1}</span>
            {/if}
            {#if item % 52 === 0}
              <span class="left-item cursor-default" class:textBold={(Math.floor(item / 52) + 1) % 10 === 0 || item === 0}>
                {Math.floor(item / 52) + 1}
              </span>
            {/if}
            {#if item != 1199 && item % 52 === 51 && (Math.floor(item / 52) + 1) % 10 === 0 || item === 51}
              <button
                on:click={hideHandler}
                class="fold-button"
                class:b10={item === 52 * 1 - 1}
                class:b20={item === 52 * 10 - 1}
                class:b30={item === 52 * 20 - 1}
                class:b40={item === 52 * 30 - 1}
                class:b50={item === 52 * 40 - 1}
                class:b60={item === 52 * 50 - 1}
                class:b70={item === 52 * 60 - 1}
                class:b80={item === 52 * 70 - 1}
                class:b90={item === 52 * 80 - 1}
                class:b100={item === 52 * 90 - 1}
              >
                <i class="fas fa-chevron-down"></i>
              </button>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>
  {:else}
    <h2>태어난 날을 선택해주세요.</h2>
    <form on:submit|preventDefault={submitHandler}>
      <label for="birthday">태어난 날</label>
      <input type="date" id="birthday" name="birthday">
      <button type="submit">시작하기</button>
    </form>
  {/if}
  <div class="hidden"></div>
</section>

<style>
  section {
    padding-top: 6rem;
  }

  .container {
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  .time {
    position: absolute;
    top: -3rem;
  }

  /* Grid Common Style */
  .calendar--grid {
    display: inline-grid;
    position: relative;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    position: relative;
    transition: all 0.3s;
  }

  .textBold {
    font-weight: 800;
  }

  .past {
    background-color: var(--past-background-color);
  }

  .cursor-default {
    cursor: default;
  }

  .hidden {
    display: none;
  }

  .fold-button {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #555;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .item.current {
    background-color: var(--current-item-color) !important;
    color: #fff;
    border: none;
    font-weight: 800;
  }

  /* Annual */
  .annual .calendar--grid {
    grid-template-columns: repeat(10, 80px);
    grid-template-rows: repeat(10, 40px);
    gap: 6px;
  }

  .annual .calendar--grid .item {
    font-size: 14px;
  }

  /* Monthly */
  .monthly .calendar--grid {
    grid-template-columns: repeat(12, 60px);
    grid-template-rows: repeat(100, 30px);
    gap: 4px;
  }

  .monthly .calendar--grid .item {
    font-size: 12px;
  }

  .monthly .calendar--grid .item .age {
    position: absolute;
    right: 120%;
  }

  .month-name {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -20px;
    cursor: default;
  }

  .allThisMonth {
    background-color: var(--all-this-month-color) !important;
  }

  .thisYear {
    background-color: var(--this-year-color) !important;
  }

  .thisYear.past {
    background-color: var(--this-year-past-color) !important;
  }

  /* Weekly */
  .weekly .calendar--grid {
    grid-template-columns: repeat(52, 20px);
    grid-template-rows: repeat(100, 20px);
    gap: 2px;
  }

  .weekly .calendar--grid .item {
    border-radius: 1px;
  }

  .weekly .top-item {
    position: absolute;
    top: -16px;
    font-size: 10px;
  }

  .weekly .left-item {
    position: absolute;
    right: 140%;
    font-size: 10px;
  }

  .weekly .fold-button {
    font-size: 12px;
    right: -25px;
  }
</style>