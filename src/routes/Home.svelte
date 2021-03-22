<script>
	import {loggedIn} from '../store';
	import Annual from '../components/tabs/Annual.svelte';
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
	.welcome img {
		margin-bottom: 1rem;
	}
</style>