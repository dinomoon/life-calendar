<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import {
    userInfo,
    colors,
    clickedDay,
    showModal,
    activeTab,
    loggedIn,
  } from '../store';
  import Modal from './Modal.svelte';
  import Annual from '../routes/tabs/Annual.svelte';
  import Monthly from '../routes/tabs/Monthly.svelte';
  import Weekly from '../routes/tabs/Weekly.svelte';
  let calendarGrid = null;

  onMount(() => {
    if ($loggedIn === false) {
      push('/');
    }
    calendarGrid = document.querySelector('.calendar--grid');
  });

  // clickHandler
  const clickHandler = async (e) => {
    const classList = e.target.classList;
    if (classList.contains('item')) {
      if ($activeTab === 'annual') {
        await clickedDay.set({ year: +e.target.dataset.year });
      } else if ($activeTab === 'monthly') {
        clickedDay.set({
          month: +e.target.dataset.id + 1,
          age: +e.target.dataset.age + 1,
        });
      } else if ($activeTab === 'weekly') {
        clickedDay.set({
          week: +e.target.dataset.id + 1,
          age: +e.target.dataset.age + 1,
        });
      }
      showModal.set(true);
    } else if (classList.contains('backdrop')) {
      showModal.set(false);
    }
  };
  function mouseoverHandler(e) {
    let items = null;
    let ages = null;
    const hoverColor = $colors['hover-item-color'];
    const currentHoverColor = $colors['current-hover-item-color'];
    const target = e.target;
    if (target.classList.contains('item')) {
      if ($activeTab === 'annual') {
        target.style.backgroundColor = currentHoverColor;
        target.style.color = $colors['item-background-color'];
        let age = target.textContent - $userInfo.birthday.year + 1;
        target.textContent = age;
      } else {
        const hoverId = target.dataset.id;
        const hoverAge = target.dataset.age;
        items = calendarGrid.querySelectorAll(`[data-id="${hoverId}"]`);
        ages = calendarGrid.querySelectorAll(`[data-age="${hoverAge}"]`);
        items.forEach((item) => {
          item.style.backgroundColor = hoverColor;
        });
        ages.forEach((age) => {
          age.style.backgroundColor = hoverColor;
        });
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
      if ($activeTab === 'annual') {
        target.style.color = '#000';
        target.style.backgroundColor = target.classList.contains('past')
          ? pastColor
          : itemColor;
        let year = +target.textContent + $userInfo.birthday.year - 1;
        target.textContent = year;
      } else {
        const hoverId = target.dataset.id;
        const hoverAge = target.dataset.age;
        items = calendarGrid.querySelectorAll(`[data-id="${hoverId}"]`);
        ages = calendarGrid.querySelectorAll(`[data-age="${hoverAge}"]`);
        items.forEach((item) => {
          item.style.backgroundColor = item.classList.contains('past')
            ? pastColor
            : itemColor;
        });
        ages.forEach((age) => {
          age.style.backgroundColor = age.classList.contains('past')
            ? pastColor
            : itemColor;
        });
      }
    }
  }
</script>

<section>
  {#if $userInfo}
    <div class="container">
      <!-- <div class="time">오늘은 {thisYear}년 {$thisMonth + 1}월 {date.getDate()}일 {$week[date.getDay()]}요일입니다.</div> -->
      {#if $activeTab === 'annual'}
        <Annual
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {:else if $activeTab === 'monthly'}
        <Monthly
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {:else if $activeTab === 'weekly'}
        <Weekly
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {/if}
    </div>
  {/if}
  {#if $showModal}
    <Modal on:click={clickHandler} />
  {/if}
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
</style>
