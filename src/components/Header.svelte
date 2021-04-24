<script>
  import { push } from 'svelte-spa-router';

  import {
    loggedIn,
    calendarTabs,
    firebaseLoggedIn,
    kakaoLoggedIn,
    activeTab,
    userInfo,
  } from '../store';

  export let links;
  let borderBottom = false;
  let obj = {
    로그인: 'login',
    회원가입: 'signup',
    도움말: 'help',
    연간: 'annual',
    월간: 'monthly',
    주간: 'weekly',
  };

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

  function clickHandler() {
    if ($loggedIn) {
      push('/annual');
    } else {
      push('/');
    }
  }
</script>

<header class:loggedIn={$loggedIn} class:borderBottom>
  <div class="container">
    <h1>
      <a href="/#/" on:click|preventDefault={clickHandler}>Life Calendar</a>
    </h1>
    {#if $loggedIn && $userInfo}
      <nav>
        <ul class="calendar-tabs">
          {#each $calendarTabs as tab}
            <li>
              <a
                href="/#/{obj[tab]}"
                class:activeTab={tab === $activeTab}
                class:notActiveTab={tab !== $activeTab}>{tab}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
    <nav>
      <ul class="sign-tabs">
        {#each links as link}
          {#if link === '로그아웃'}
            <li on:click={logoutHandler}>
              <button class="logout-btn" type="button">{link}</button>
            </li>
          {:else}
            <li>
              <a
                href="/#/{obj[link]}"
                class:signButton={link === '로그인' || link === '회원가입'}
                >{link}</a
              >
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  </div>
</header>

<style>
  .activeTab {
    color: var(--active-color);
    border-bottom: 2px solid var(--active-color);
  }

  .notActiveTab:hover {
    border-bottom: 2px solid var(--border-color);
  }

  header {
    max-width: 1920px;
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

  header.loggedIn .sign-tabs {
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
</style>
