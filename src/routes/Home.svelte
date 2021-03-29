<script>
	import {loggedIn, userId, userInfo} from '../store';
	import Annual from '../components/tabs/Annual.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		db.collection('users').onSnapshot((snapshot => {
			snapshot.docs.forEach(doc => {
				if (doc.data().userId === $userId) {
					userInfo.set(doc.data());
				}
			})
		}))
	})
</script>

{#if $loggedIn}
	<Annual />
{:else}
	<section class="welcome">
		<img src="/img/welcome-img.svg" alt="">
		<h2>Welcome to Life Calendar!</h2>
	</section>
{/if}


<style>
	section {
		padding-top: 5rem;
	}

	.welcome img {
		margin-bottom: 1rem;
	}
</style>