<script lang="ts">
	import StList from '../components/StList.svelte';
</script>

<svelte:head>
	<title>Student List</title>
</svelte:head>

<main>
	<StList />
</main>

<style>
	main {
		display: inherit;
		text-align: center;
		padding: 0;
		width: 100%;
		min-height: 100vh;
		margin: 0;
		background-color: #eceff1;
	}

	p {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		width: auto;
	}
	p > input {
		width: 25vw;
		border: none;
		outline: none;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 1em;
		font-weight: 100;
		background-color: #e3f2fd;
	}
</style>
