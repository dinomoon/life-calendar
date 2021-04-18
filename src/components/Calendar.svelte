<script>
  import { onMount } from 'svelte';
  import { userInfo, colors, clickedDay, showModal, activeTab } from '../store';
  import Birthday from './Birthday.svelte';
  import Modal from './Modal.svelte';
  import Annual from './tabs/Annual.svelte';
  import Monthly from './tabs/Monthly.svelte';
  import Weekly from './tabs/Weekly.svelte';

  let calendarGrid = null;

  onMount(() => {
    calendarGrid = document.querySelector('.calendar--grid');
  });

  // clickHandler
  const clickHandler = async (e) => {
    const classList = e.target.classList;
    if (classList.contains('item')) {
      if ($activeTab === '연간') {
        await clickedDay.set({ year: +e.target.dataset.year });
      } else if ($activeTab === '월간') {
        clickedDay.set({
          month: +e.target.dataset.id + 1,
          age: +e.target.dataset.age + 1,
        });
      } else if ($activeTab === '주간') {
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
      if ($activeTab === '연간') {
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
      if ($activeTab === '연간') {
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
    {#if $showModal}
      <Modal on:click={clickHandler} />
    {/if}
    <div class="container">
      <!-- <div class="time">오늘은 {thisYear}년 {$thisMonth + 1}월 {date.getDate()}일 {$week[date.getDay()]}요일입니다.</div> -->
      {#if $activeTab === '연간'}
        <Annual
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {:else if $activeTab === '월간'}
        <Monthly
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {:else if $activeTab === '주간'}
        <Weekly
          on:click={clickHandler}
          on:mouseover={mouseoverHandler}
          on:mouseout={mouseoutHandler}
        />
      {/if}
    </div>
  {:else}
    <Birthday />
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

  :global(.currentText) {
    color: var(--active-color);
    font-weight: 800;
  }

  /* Grid Common Style */
  :global(.calendar--grid) {
    display: inline-grid;
    position: relative;
  }

  :global(.item) {
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

  :global(.textBold) {
    font-weight: 800;
  }

  :global(.past) {
    background-color: var(--past-background-color);
  }

  :global(.cursor-default) {
    cursor: default;
  }

  :global(.fold-button) {
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

  :global(.circle::before) {
    content: '';
    position: absolute;
    right: 5px;
    top: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--active-color);
  }
</style>
