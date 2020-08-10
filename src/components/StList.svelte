<script lang="ts">

	import DInput from './DInput.svelte';
    import {writable} from 'svelte/store';
    import {fade} from 'svelte/transition';
    
    export const mydata = writable(getLocalData());
	
	async function fetchData(){
		const getData = await fetch('https://api.github.com/users')
			.then(res => res.json())//response type
			.then(data => {
				$mydata = data
			})
	}
	
	function handleSave(){
		localStorage.setItem("myData", JSON.stringify($mydata));
		console.log($mydata);
	}
	function getLocalData(){
		if(localStorage.getItem("myData"))return JSON.parse(localStorage.getItem("myData"))
		return []
	}
	
    $: console.log($mydata);
</script>

<style>
	button{
		margin-top:2em;
	}
    .user-pic{
		grid-area:pic;
		margin: 1em 0 1em 2em;
		height: 20vh;
		border-radius: 1em;
	}
	.user-name{
		width: 90%;
		border-radius: 0.5rem;
		background-color: #90caf9;
		grid-area: name;
	}
	.user-type{
		width: 90%;
		border-radius: 0.5rem;
		background-color: #90caf9;
		grid-area: type;
	}
	.user-follow{
		width: 90%;
		border-radius: 0.5rem;
		background-color: #90caf9;
		grid-area: fol;
	}
	.user-github{
		width: 90%;
		border-radius: 0.5rem;
		background-color: #90caf9;
		grid-area: git;
	}
	.user-profile-cart{
		font-size: 3vmin;
		color: #ff3e00;
		font-weight: 100;

		display: grid;
		grid-template-areas: 
			'pic name'
			'pic type'
			'pic fol'
			'pic git';
		grid-gap: 1rem 1rem;
		align-items: center;
		justify-items: center;
		grid-template-columns: 20vw 55vw;
		/* justify-content: space-around; */
		
		max-width: 75vw;
		margin: 2em auto 0 auto;
		background-color: #bbdefb;
		border-radius: 1em;
	}
    @media (max-width: 920px) {
		.user-profile-cart {
			max-width: 95vw;
			grid-template-columns: 10vw 85vw;
			font-weight: normal;
		}
		.user-pic{
		grid-area:pic;
		margin: 1em 0 1em 3em;
		height: 8vh;
		border-radius: 1em;
		}
	}
</style>
	
{#if $mydata.length == 0}
	<button on:click={fetchData}>Fetch Data</button>
	<p>Fetch data to see it</p>	
{:else}
	<button on:click={handleSave}>Save Data</button>
	<button on:click={fetchData}>Fetch Data</button>
	{#each $mydata as user,index}
		<div class="user-profile-cart" transition:fade>
			<div class="user-name">username: <DInput bind:inputVal={user.login} height="auto" bgColor="#90caf9"/></div>
			<div class="user-type">user-type: <DInput bind:inputVal={user.type} height="auto" bgColor="#90caf9"/></div>
			<div class="user-follow">followers: <DInput inputVal={user.followers_url} height="auto" bgColor="#90caf9"/></div>
			<div class="user-github">github: <a href="https://www.github.com/{user.login}">https://www.github.com/{user.login}</a></div> 
			<img class="user-pic" src="{user.avatar_url}" alt="{user.login}-avatar">
		</div>
	{/each}
{/if}