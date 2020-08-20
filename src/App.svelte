<script lang="ts">

	import {writable} from 'svelte/store';
	import StList from './components/StList.svelte';
	//import { onMount } from 'svelte';

	export const name = writable("");

	// onMount(async() => {
	// 	const test = await fetch('https://api.github.com/users')
	// 	.then(res => res.json())//response type
	// 	.then(data => {
	// 		$mydata = data
	// 		console.log(data[0])
	// 	})//log the data;
	// });
	// //call the fetch function


</script>

<svelte:head>
	<title>Student List</title>
</svelte:head>

<main>
	<!-- <input type="text" bind:value={$name}/> -->
	
	<!-- <p>Hello <input value={$name}/>!</p> -->

	<!-- /<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> -->
	
	<StList/>

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
	p>input{
		width: 25vw;
		border:none;
		outline: none;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 1em;
		font-weight: 100;
		background-color: #e3f2fd;
	}
</style>