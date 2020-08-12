<script lang="ts">

	import DInput from './DInput.svelte';
    import {writable} from 'svelte/store';
    import {fade} from 'svelte/transition';
	import { each } from 'svelte/internal';
    
	export const mydata = writable(getLocalData());

	let titleNames: string[] = Object.keys($mydata[0]).filter( a => a != "avatar_url")
	let titleNum: number = titleNames.length;
	let filteredTitles: object[] = titleNames.map( txt => ({filtered: false, text: txt}) );
	

	async function fetchData(){
		const getData = await fetch('https://api.github.com/users')
			.then(res => res.json())//response type
			.then(data => {
				$mydata = data
				titleNames = Object.keys($mydata[0]).filter( a => a != "avatar_url")
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
	
	function filterTitle(ind:number){
		filteredTitles[ind].filtered = !filteredTitles[ind].filtered;
		console.log(filteredTitles);
		
	}
	$: {
		console.log($mydata);
		console.log(titleNames);
		// console.log( $mydata[0][titleNames[0]] )
		
	}
	
</script>

<style>
	button{
		margin:1em 0 0 0;
	}
	p{
		font-size: 3vmin;
		color: #ff3e00;
	}
    .user-pic{
		grid-area: 1 / 1 / 2 / 2;
		margin: 1em 0 0 1em;
		height: 20vh;
		border-radius: 1em;
	}
	.user-data{
		width: 90%;
		border-radius: 0.5rem;
		background-color: #90caf9;
		display: flex;
		justify-content: flex-start;
		padding-left: 1em;
	}
	.user-profile-cart{
		transition: background-color 0.5s ease;
		font-size: 3vmin;
		color: #ff3e00;
		font-weight: 100;

		display: grid;
		grid-gap: 1rem 1rem;
		align-items: center;
		justify-items: center;
		grid-template-rows: repeat(2, auto);
		/* grid-template-columns: 5vw repeat(var(--colNum),auto); */

		/* justify-content: space-around; */
		
		max-width: 85vw;
		margin: 2em auto 0 auto;
		background-color: #bbdefb;
		border-radius: 1em;
	}
	.data-keys{
		width: 80vw;
		margin: 0 auto 0 auto;
		display: grid;
		grid-template-rows: repeat(2, auto);
		grid-template-columns: repeat(8,auto);		
	}
	.data-keys>button{
		transition: opacity 0.5s ease;
		/* background-color: transparent; */
	}
	@media (max-width: 920px) {
		.user-profile-cart {
			max-width: 95vw;
			grid-template-rows: repeat(2, auto);
			font-weight: normal;
		}
		.user-pic{
		grid-area: 1 / 1 / 2 / 2;
		margin: 1em 0 0 1em;
		height: 10vh;
		border-radius: 1em;
		}
		.data-keys{
			width: 95vw;
			display: grid;
			grid-template-rows: repeat(4, auto);
			grid-template-columns: repeat(3,auto);
		}
		button{
		margin-top:1em;
		}
	}
</style>
	
{#if $mydata.length == 0}
	<button on:click={fetchData}>Fetch Data</button>
	<p>Fetch data to see it</p>	
{:else}
	<button on:click={handleSave}>Save Data</button>
	<button on:click={fetchData}>Fetch Data</button>
	<br/>
	<p>Select any key to filter the data</p>
	<div class="data-keys">
		{#each filteredTitles as titleName,ind }
		<button on:click="{filterTitle.bind(this,ind)}" style="{titleName.filtered ? 'opacity: 50%;':'opacity:100%;'}">{titleName.text}</button>
			
		{/each}
	</div>

	{#each $mydata as user,index}
		<div class="user-profile-cart" transition:fade style="--colNum: {titleNum}">
			<img class="user-pic" src="{user.avatar_url}" alt="{user.login}-avatar">

			{#each filteredTitles.filter( t => !t.filtered) as titleName,ind}
			<div class="user-data">
				<div>{titleName.text}: </div>
				<DInput bind:inputVal={user[titleName.text]} height="auto" bgColor="#90caf9"/></div>

			{/each}	
			<!-- <div class="user-github">github: <a href="https://www.github.com/{user.login}">https://www.github.com/{user.login}</a></div>  -->
		</div>
	{/each}
{/if}