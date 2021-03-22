<script>
  import { push } from 'svelte-spa-router';

	import {loggedIn, calendarTabs, firebaseLoggedIn, kakaoLoggedIn, naverLoggedIn, activeTab} from '../store';

  export let links;
  let borderBottom = false;
  let obj = {'로그인': 'login', '회원가입': 'signup', '도움말': 'help', '연간': 'annual', '월간': 'monthly', '주간': 'weekly'}

  const pushHome = () => {
    push('/');
  }

  const logoutHandler = async () => {
    if ($firebaseLoggedIn) {
      try {
        await auth.signOut();
        pushHome();
      } catch (error) {
        console.log(error);
      }
    } else if ($kakaoLoggedIn) {
      try {
        await window.Kakao.Auth.logout();
        pushHome();
        kakaoLoggedIn.set(false);
      } catch (error) {
        console.log('error')
      }
    }
  }

  window.onscroll = () => {
    if (window.pageYOffset > 80) {
      borderBottom = true;
    } else {
      borderBottom = false;
    }
  }
</script>

<header class:loggedIn={$loggedIn} class:borderBottom={borderBottom}>
	<div class="container">
    <h1>
      <a href="/#/">
        <img class="logo" src="./img/h1.svg" alt="">
      </a>
    </h1>
    {#if $loggedIn}
      <nav>
        <ul class="calendar-tabs">
          {#each $calendarTabs as tab}
            <li>
              <a href="/#/{obj[tab]}" class:activeTab={tab === $activeTab}>{tab}</a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
    <nav>
      <ul>
        {#each links as link}
          {#if link === '로그아웃'}
            <li on:click={logoutHandler}>
              <button type="button">{link}</button>
            </li>
          {:else}
            <li>
              <a href="/#/{obj[link]}">{link}</a>
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  </div>
</header>

<style>
  .activeTab {
    color: #fa5252;
    border-bottom: 2px solid #fa5252;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-color: #fff;
    transition: all 0.3s ease;
    z-index: 1;
  }

  header.borderBottom {
    height: 70px;
  }
  
  .borderBottom .container {
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

  .container {
    max-width: 1248px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .loggedIn .container {
    max-width: 1440px;
  }

  .logo {
    cursor: pointer;
  }

  ul {
    display: flex;
    align-items: center;
    list-style-type: none;
  }

  button {
    background-color: transparent;
    border: none;
    margin: 0;
  }

  ul li a, button {
    font-size: 18px;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
  }
</style>