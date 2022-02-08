<script>
  import { location, push } from 'svelte-spa-router';

  import {
    loggedIn,
    calendarTabs,
    firebaseLoggedIn,
    kakaoLoggedIn,
    activeTab,
    userInfo,
    showHelpModal,
    selectedTag
  } from '../store';
  import HelpModal from './HelpModal.svelte';

  export let rightTabs;
  let borderBottom = false;
  let obj = {
    로그인: 'login',
    회원가입: 'signup',
    도움말: 'help',
    연간: 'annual',
    월간: 'monthly',
    주간: 'weekly',
  };
  let selected;
  $: selectedTag.set(selected);

  const logoutHandler = async () => {
    if ($firebaseLoggedIn) {
      try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
    } else if ($kakaoLoggedIn) {
      try {
        await window.Kakao.Auth.logout();
        kakaoLoggedIn.set(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  window.onscroll = () => {
    if (window.pageYOffset > 80) {
      borderBottom = true;
    } else {
      borderBottom = false;
    }
  };

  function homeClickHandler() {
    if ($loggedIn) {
      push('/annual');
    } else {
      push('/');
    }
  }

  function helpModalToggle() {
    if ($showHelpModal) {
      document.body.classList.remove('showModal')
    } else {
      document.body.classList.add('showModal')
    }

    showHelpModal.update(showModal => {
      showModal = !showModal;
      return showModal;
    });
  }
</script>

<header class:loggedIn={$loggedIn} class:borderBottom>
  <div class="container">
    <h1>
      <a href="/#/" on:click|preventDefault={homeClickHandler}>Life Calendar</a>
    </h1>
    {#if $loggedIn && $userInfo}
      <nav>
        <ul class="calendar-tabs">
          {#each $calendarTabs as tab}
            <li>
              <a
                href="/#/{obj[tab]}"
                class:activeTab={obj[tab] === $activeTab}
                class:notActiveTab={obj[tab] !== $activeTab}>{tab}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
    <nav>
      <ul class="right-tabs">
        {#if $location === '/weekly' && $loggedIn}
          <select bind:value={selected}>
            <option value="all">모든 태그</option>
            {#each $userInfo.weekly.allTags as tag}
              <option value={tag.value}>{tag.value}</option>
            {/each}
          </select>
        {/if}
        {#each rightTabs as tab}
          {#if tab === '로그아웃'}
            <li on:click={logoutHandler}>
              <button class="logout-btn" type="button">{tab}</button>
            </li>
          {:else if tab === '도움말'}
            <li on:click={helpModalToggle}>
              <button type="button">{tab}</button>
            </li>
          {:else}
            <li>
              <a
                href="/#/{obj[tab]}"
                class:signButton={tab === '로그인' || tab === '회원가입'}
                >{tab}</a
              >
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  </div>
</header>
<HelpModal on:click={helpModalToggle} />

<style>
  .activeTab {
    color: var(--active-color);
    border-bottom: 2px solid var(--active-color);
  }

  .notActiveTab:hover {
    border-bottom: 2px solid var(--border-color);
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background-color: inherit;
    transition: all 0.3s ease;
    z-index: 1;
  }

  header.loggedIn {
    padding: 0 40px;
    height: 80px;
  }

  header h1 {
    font-size: 1.8rem;
    font-weight: 500;
    letter-spacing: -0.4px;
  }

  header.loggedIn h1 {
    font-size: 1.5rem;
    flex: 1;
  }

  header.loggedIn nav {
    flex: 1;
  }

  header.loggedIn .right-tabs {
    justify-content: flex-end;
  }

  header.borderBottom {
    height: 70px;
  }

  .borderBottom .container {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .loggedIn .container {
    max-width: 100%;
  }

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style-type: none;
  }

  button {
    background-color: transparent;
    border: none;
    margin: 0;
  }

  .signButton {
    background-color: #151515;
    color: #fff;
    transition: 0.3s;
    border-radius: 4px;
  }

  .signButton:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .logout-btn {
    transition: 0.3s;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .logout-btn:hover {
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
  }

  ul li a,
  button {
    font-size: 18px;
    cursor: pointer;
    padding: 6px 20px;
  }

  select {
    width: 120px;
    padding: 6px 10px;
    background-color: transparent;
    outline: none;
    font-size: 18px;
    border-color: rgba(0, 0, 0, 0.2);
    -webkit-appearance: none;  /* 네이티브 외형 감추기 */
    -moz-appearance: none;
    appearance: none;
    background: url('/img/arrow_down.png') no-repeat 105% 50%;
    background-size: 30px; /* 화살표 크기 */
  }

  select:hover {
    border-color: #aaa;
  }
</style>
