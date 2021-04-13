<script>
	import {onMount} from 'svelte';
	import Router, {location} from 'svelte-spa-router';
	import routes from './routes';

	import Header from './components/Header.svelte'
	import Main from './components/Main.svelte'
	import Footer from './components/Footer.svelte'

	import {loggedIn, firebaseLoggedIn, kakaoLoggedIn, activeTab, userId} from './store';

	let links = [];

	onMount(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				firebaseLoggedIn.set(true);
				userId.set(user.uid);
			} else {
				firebaseLoggedIn.set(false);
			}
		});
	})

	$: if ($firebaseLoggedIn || $kakaoLoggedIn) {
		loggedIn.set(true);
	} else {
		loggedIn.set(false);
	}

	$: if ($loggedIn) {
		links = ['도움말', '로그아웃']
		switch ($location) {
			case '/annual':
				activeTab.set('연간');
				break;
			case '/monthly':
				activeTab.set('월간');
				break;
			case '/weekly':
				activeTab.set('주간');
				break;
			default:
				break;
		}
	} else {
		switch ($location) {
			case '/':
				links = ['로그인'];
				break;
			case '/signup':
				links = ['로그인'];
				break;
			case '/login':
				links = ['회원가입']
				break;
			default:
				break;
		}
	}
</script>

<Header {links}/>
<Main>
	<Router {routes} />
</Main>
<Footer />