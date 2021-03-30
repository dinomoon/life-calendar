<script>
	import {loggedIn, userId, userInfo} from '../store';
	import Annual from '../components/tabs/Annual.svelte';
	import { onMount } from 'svelte';
import Calendar from '../components/Calendar.svelte';

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
		<h2>당신은 어떤 삶을 살고 계신가요?</h2>
	</section>
	<!-- <Calendar monthly /> -->
{/if}

<style>
	section {
		height: 100vh;
		padding-top: 5rem;
	}

	section h2 {
		font-size: 2rem;
	}
</style>