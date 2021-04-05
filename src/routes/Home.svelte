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
		<div class="left-text">
			<h2>당신은 어떤 삶을 살고 계신가요?</h2>
			<p>당신의 삶을 기록해보세요.</p>
		</div>
		<div class="right-img">
			<img src="/img/main.svg" alt="">
		</div>
	</section>
	<!-- <Calendar annual /> -->
{/if}

<style>
	.welcome {
		padding-top: 10rem;
		text-align: left;
	}

	.left-text {
		margin-bottom: 4rem;
	}

	.left-text h2 {
		font-size: 46px;
		margin-bottom: 10px;
	}

	.left-text p {
		font-size: 24px;
	}

	.right-img {
		text-align: right;
	}

	.right-img img {
		width: 900px;
	}
</style>