<script>
  import Router, { location, push } from 'svelte-spa-router';
  import routes from './routes';

  import Header from './components/Header.svelte';
  import Main from './components/Main.svelte';
  import Footer from './components/Footer.svelte';

  import {
    loggedIn,
    firebaseLoggedIn,
    kakaoLoggedIn,
    activeTab,
    userId,
    userInfo,
    userDocId,
    loading,
    userAge,
    thisYear,
  } from './store';

  let rightTabs = [];

  $: if ($userDocId) {
    db.collection('users')
      .doc($userDocId)
      .onSnapshot((doc) => {
        userInfo.set(doc.data());
      });
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      firebaseLoggedIn.set(true);
      userId.set(user.uid);
    } else {
      firebaseLoggedIn.set(false);
    }
  });

  async function getUser() {
    await db
      .collection('users')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc.data().userId === $userId) {
            userInfo.set(doc.data());
            userDocId.set(doc.id);
          }
        });
      })
      .then(() => {
        if ($userInfo === null) {
          push('/birthday');
        } else {
          push('/annual');
          userAge.set($thisYear - $userInfo.birthday.year + 1);
        }
      });
  }

  $: if ($firebaseLoggedIn || $kakaoLoggedIn) {
    loggedIn.set(true);
    getUser();
  } else {
    push('/');
    loggedIn.set(false);
    userInfo.set(null);
    userId.set(null);
    loading.set(false);
  }

  $: if ($loggedIn) {
    rightTabs = ['도움말', '로그아웃'];
    switch ($location) {
      case '/annual':
        activeTab.set('annual');
        break;
      case '/monthly':
        activeTab.set('monthly');
        break;
      case '/weekly':
        activeTab.set('weekly');
        break;
      default:
        break;
    }
  } else {
    switch ($location) {
      case '/':
        rightTabs = ['로그인'];
        break;
      case '/signup':
        rightTabs = ['로그인'];
        break;
      case '/login':
        rightTabs = ['회원가입'];
        break;
      default:
        break;
    }
  }
</script>

<Header {rightTabs} />
<Main>
  <Router {routes} />
</Main>
<Footer />
