<script>
  import { onMount } from 'svelte';
  import { userId, userInfo, week, colors, squareList, beforeBtnClasses, 
    beforeBtnObj, monthlyFoldObj, weeklyFoldObj, birthdayValid,
    date, thisYear, thisMonth, weekNum, clickedDay } from "../store";
  import { fade } from 'svelte/transition';
  import { weekNumber } from '../../public/weekNum.js'
  import Modal from './Modal.svelte';

  export let annual = false;
  export let monthly = false;
  export let weekly = false;
  let calendarGrid = null;
  let showModal = false;
  
  if (annual) {
    squareList.set(Array.from(Array(100).keys()));
  } else if (monthly) {
    squareList.set(Array.from(Array(1200).keys()));
  } else if (weekly) {
    squareList.set(Array.from(Array(5200).keys()));
  }
  
  onMount(() => {
    calendarGrid = document.querySelector('.calendar--grid');
    if (JSON.parse(localStorage.getItem('monthly-fold-obj')) === null) {
      localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
    }

    if (JSON.parse(localStorage.getItem('weekly-fold-obj')) === null) {
      localStorage.setItem('weekly-fold-obj', JSON.stringify($weeklyFoldObj));
    }

    if (monthly) {
      $beforeBtnClasses.forEach(btnClass => {
        if (JSON.parse(localStorage.getItem('monthly-fold-obj'))[btnClass] === true) {
          const btn = calendarGrid.querySelector(`.${btnClass}`);
          const icon = btn.querySelector('i');
          icon.classList.add('fold');
          const items = calendarGrid.querySelectorAll($beforeBtnObj[btnClass]);
          items.forEach(item => item.classList.add('hidden'));
        }
      });
    } else if (weekly) {
      $beforeBtnClasses.forEach(btnClass => {
        if (JSON.parse(localStorage.getItem('weekly-fold-obj'))[btnClass] === true) {
          const btn = calendarGrid.querySelector(`.${btnClass}`);
          const icon = btn.querySelector('i');
          icon.classList.add('fold');
          const items = calendarGrid.querySelectorAll($beforeBtnObj[btnClass]);
          items.forEach(item => item.classList.add('hidden'));
        }
      })
      weekNum.set(weekNumber($date));
    }
  })

  const submitHandler = async (e) => {
    birthdayValid.set(true);
    const birthday = e.target['birthday'].value;
    const birthArray = birthday.split('-');
    const year = +birthArray[0];
    const month = +birthArray[1];
    const day = +birthArray[2];

    birthdayValid.set(birthday ? true : false);

    if (birthdayValid) {
      await db.collection('users').add({
        userId: $userId,
        birthday: {year, month, day},
      })
    }
  }

  // clickHandler
  const clickHandler = (e) => {
    if (e.target.classList.contains('item')) {
      if (annual) {
        clickedDay.set({year: +e.target.dataset.year});
      } else if (monthly) {
        console.log(e.target)
        clickedDay.set({month: +e.target.dataset.id + 1});
      } else if (weekly) {
        clickedDay.set({week: +e.target.dataset.id + 1});
      }
      showModal = true;
    } else {
      showModal = false;
    }
  }

  // hideHandler
  function hideHandler(e) {
    let button = null;
    let icon = null;
    let classList = null;
    let items = null;

    if (e.target.tagName === 'BUTTON') {
      button = e.target;
      icon = button.children[0];
      classList = button.classList;
    } else {
      icon = e.target;
      button = icon.parentNode;
      classList = button.classList;
    }

    icon.classList.toggle('fold');

    $beforeBtnClasses.forEach(btnClass => {
      if (classList.contains(btnClass)) {
        if (monthly) {
          monthlyFoldObj.set(JSON.parse(localStorage.getItem('monthly-fold-obj')));
          $monthlyFoldObj[btnClass] = $monthlyFoldObj[btnClass] ? false : true;
          localStorage.setItem('monthly-fold-obj', JSON.stringify($monthlyFoldObj));
        } else if (weekly) {
          monthlyFoldObj.set(JSON.parse(localStorage.getItem('weekly-fold-obj')));
          $weeklyFoldObj[btnClass] = $weeklyFoldObj[btnClass] ? false : true;
          localStorage.setItem('weekly-fold-obj', JSON.stringify($weeklyFoldObj));
        }
        items = calendarGrid.querySelectorAll($beforeBtnObj[btnClass]);
      }
    });
    items.forEach((item, idx) => {
      item.classList.toggle('hidden');
    });
  }

  function mouseoverHandler(e) {
    let items = null;
    let ages = null;
    const hoverColor = $colors['hover-item-color'];
    const currentHoverColor = $colors['current-hover-item-color'];
    const target = e.target;

    if (target.classList.contains('item')) {
      if (annual) {
        target.style.backgroundColor = currentHoverColor;
        target.style.color = $colors['item-background-color'];
        let age = target.textContent - $userInfo.birthday.year + 1;
        target.textContent = age;
      } else {
        const hoverId = target.dataset.id;
        const hoverAge = target.dataset.age;

        items = calendarGrid.querySelectorAll(`[data-id="${hoverId}"]`);
        ages = calendarGrid.querySelectorAll(`[data-age="${hoverAge}"]`);

        items.forEach(item => {
          item.style.backgroundColor = hoverColor;
        })
        ages.forEach(age => {
          age.style.backgroundColor = hoverColor;
        })
        target.style.backgroundColor = currentHoverColor;
      }
    }
  }

  function mouseoutHandler(e) {
    let items = null;
    let ages = null;
    const pastColor = $colors['past-background-color'];
    const itemColor = $colors['item-background-color'];
    let target = e.target;

    if (target.classList.contains('item')) {
      if (annual) {
        target.style.color = '#000';
        target.style.backgroundColor = target.classList.contains('past') ? pastColor : itemColor;
        let year = +target.textContent + $userInfo.birthday.year - 1;
        target.textContent = year;
      } else {
        const hoverId = target.dataset.id;
        const hoverAge = target.dataset.age;

        items = calendarGrid.querySelectorAll(`[data-id="${hoverId}"]`);
        ages = calendarGrid.querySelectorAll(`[data-age="${hoverAge}"]`);
        
        items.forEach(item => {
          item.style.backgroundColor = item.classList.contains('past') ? pastColor : itemColor;
        })
        ages.forEach(age => {
          age.style.backgroundColor = age.classList.contains('past') ? pastColor : itemColor;
        })
      }
    }
  }
</script>

<section>
  {#if $userInfo}
  <Modal on:click={clickHandler} {showModal} {annual} {monthly} {weekly} />
  <div class="container" class:annual class:monthly class:weekly>
    <div class="calendar--grid" on:click={clickHandler} on:mouseover={mouseoverHandler} on:mouseout={mouseoutHandler} in:fade>
      <!-- <div class="time">오늘은 {thisYear}년 {$thisMonth + 1}월 {date.getDate()}일 {$week[date.getDay()]}요일입니다.</div> -->
      {#each $squareList as item}
        <!-- Annual -->
        {#if annual}
          <div class="item"
            class:past={$userInfo.birthday.year + item < $thisYear}
            class:current={$userInfo.birthday.year + item === $thisYear}
            data-year={$userInfo.birthday.year + item}
          >
            {$userInfo.birthday.year + item}
          </div>
        <!-- Monthly -->
        {:else if monthly}
          <div class="item"
            class:past={$userInfo.birthday.year + Math.floor(item / 12) < $thisYear || ((Math.floor(item / 12) === ($thisYear - $userInfo.birthday.year)) && (item % 12 < $thisMonth))}
            class:current={(Math.floor(item / 12) === ($thisYear - $userInfo.birthday.year)) && (item % 12 === $thisMonth)}
            class:allThisMonthPast={item % 12 === $thisMonth && (Math.floor(item / 12) < ($thisYear - $userInfo.birthday.year))}
            class:allThisMonthFuture={item % 12 === $thisMonth && (Math.floor(item / 12) > ($thisYear - $userInfo.birthday.year))}
            class:thisYear={Math.floor(item / 12) === ($thisYear - $userInfo.birthday.year)}
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
              <span class="month-name" class:currentText={$thisMonth === 0}>JAN</span>
            {:else if item === 1}
              <span class="month-name" class:currentText={$thisMonth === 1}>FEB</span>
            {:else if item === 2}
              <span class="month-name" class:currentText={$thisMonth === 2}>MAR</span>
            {:else if item === 3}
              <span class="month-name" class:currentText={$thisMonth === 3}>APR</span>
            {:else if item === 4}
              <span class="month-name" class:currentText={$thisMonth === 4}>MAY</span>
            {:else if item === 5}
              <span class="month-name" class:currentText={$thisMonth === 5}>JUN</span>
            {:else if item === 6}
              <span class="month-name" class:currentText={$thisMonth === 6}>JUL</span>
            {:else if item === 7}
              <span class="month-name" class:currentText={$thisMonth === 7}>AUG</span>
            {:else if item === 8}
              <span class="month-name" class:currentText={$thisMonth === 8}>SEP</span>
            {:else if item === 9}
              <span class="month-name" class:currentText={$thisMonth === 9}>OCT</span>
            {:else if item === 10}
              <span class="month-name" class:currentText={$thisMonth === 10}>NOV</span>
            {:else if item === 11}
              <span class="month-name" class:currentText={$thisMonth === 11}>DEC</span>
            {/if}
            <!-- age -->
            {#if item % 12 === 0}
              <span 
                class="cursor-default age"
                class:textBold={(Math.floor(item / 12) + 1) % 10 === 0 || item === 0}
                class:currentText={Math.floor(item / 12) === $thisYear - $userInfo.birthday.year}
              >
                {Math.floor(item / 12) + 1}
              </span>
            {/if}
            <!-- // age -->
            <!-- fold button -->
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
              <!-- // fold button -->
            {/if}
          </div>
        <!-- // Monthly  -->
        <!-- Weekly -->
        {:else if weekly}
          <div
            class="item"
            class:past={($userInfo.birthday.year + Math.floor(item / 52) < $thisYear) || (($userInfo.birthday.year + Math.floor(item / 52) == $thisYear) && (item % 52 < $weekNum - 1))}
            class:current={(Math.floor(item / 52) === ($thisYear - $userInfo.birthday.year)) && (item % 52 === $weekNum - 1)}
            class:allThisMonthPast={item % 52 === $weekNum - 1 && (Math.floor(item / 52) < ($thisYear - $userInfo.birthday.year))}
            class:allThisMonthFuture={item % 52 === $weekNum - 1 && (Math.floor(item / 52) > ($thisYear - $userInfo.birthday.year))}
            class:thisYear={Math.floor(item / 52) === ($thisYear - $userInfo.birthday.year)}
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
              <span class="top-item cursor-default" class:currentText={item === $weekNum - 1}>{item + 1}</span>
            {/if}
            {#if item % 52 === 0}
              <span
                class="left-item cursor-default"
                class:textBold={(Math.floor(item / 52) + 1) % 10 === 0 || item === 0}
                class:currentText={Math.floor(item / 52) === $thisYear - $userInfo.birthday.year}
              >
                {Math.floor(item / 52) + 1}
              </span>
            {/if}
            <!-- fold button -->
            {#if item != 5199 && item % 52 === 51 && (Math.floor(item / 52) + 1) % 10 === 0 || item === 51}
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
            <!-- // fold button -->
          </div>
        {/if}
      {/each}
    </div>
  </div>
  {:else}
    <div class="birth-form-container">
      <h2>생일을 입력해주세요.😊👀</h2>
      <form on:submit|preventDefault={submitHandler}>
        <input type="date" id="birthday" name="birthday">
        <button type="submit">시작하기</button>
      </form>
      <div class="birth-img-wrap">
        <img class="party-img" src="/img/party.svg" alt="">
        <img class="birthday-img" src="/img/birthday.svg" alt="">
      </div>
    </div>
  {/if}
  <div class="hidden current-hover-item"></div>
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

  .birth-form-container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
	}

  .birth-form-container h2 {
    font-size: 30px;
    margin-bottom: 2rem;
  }

  .birth-form-container form {
    display: flex;
		justify-content: center;
  }

  .birth-form-container input {
    padding: 10px;
  }

  .birth-img-wrap {
    display: flex;
    justify-content: space-between;
  }

  .birth-img-wrap img {
    width: 300px;
  }

  .birth-img-wrap .birthday-img {
    margin-top: 10rem;
  }

  .currentText {
    color: var(--active-color);
    font-weight: 800;
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
    background-color: var(--item-background-color);
  }

  .item.current {
    background-color: var(--current-item-color) !important;
    border: none;
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
    outline: none;
    cursor: pointer;
  }

  /* Annual */
  .annual .calendar--grid {
    grid-template-columns: repeat(10, 90px);
    grid-template-rows: repeat(10, 45px);
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
    font-size: 14px;
  }

  .monthly .calendar--grid .item .age {
    position: absolute;
    right: 130%;
  }

  .month-name {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -30px;
    cursor: default;
  }

  .allThisMonthPast {
    background-color: var(--all-this-month-past-color) !important;
  }

  .allThisMonthFuture {
    background-color: var(--all-this-month-future-color) !important;
  }

  .thisYear {
    background-color: var(--this-year-color) !important;
  }

  .thisYear.past {
    background-color: var(--this-year-past-color) !important;
  }

  .allThisMonthPast:hover, .allThisMonthFuture:hover, .thisYear:hover, .thisYear.past:hover {
    opacity: 0.7;
  }

  /* Weekly */
  .weekly .calendar--grid {
    grid-template-columns: repeat(52, 21px);
    grid-template-rows: repeat(100, 21px);
    gap: 3px;
  }

  .weekly .calendar--grid .item {
    border-radius: 1px;
  }

  .weekly .top-item, .weekly .left-item {
    position: absolute;
    font-size: 12px;
  }

  .weekly .top-item {
    top: -25px;
  }

  .weekly .left-item {
    right: 165%;
  }

  .weekly .fold-button {
    font-size: 12px;
    right: -25px;
  }
</style>