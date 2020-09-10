<script lang="ts">

	import DInput from './DInput.svelte';
    import {writable} from 'svelte/store';
    import {fade,fly} from 'svelte/transition';
	import { each } from 'svelte/internal';
    
	export const mydata = writable(getLocalData());

	
	let filterByName: string = '';
	let filterByTag: string = '';

	async function fetchData(){
	const getData = await fetch('https://www.hatchways.io/api/assessment/students')
			.then(res => res.json())//response type
			.then(data => {
				$mydata = data.students.map( student => {return {...student,expandGrade: false, tempTag: "" ,tags:[]} });
				console.log($mydata);
				console.log(typeof $mydata);
			})
	}
	$mydata.length === 0 && fetchData();


	const avgGrade = arr => arr.reduce( ( p, c ) => parseFloat(p) + parseFloat(c), 0 ) / arr.length;

	function handleSave(){
		localStorage.setItem("myData", JSON.stringify($mydata));
		console.log($mydata);
	}
	function getLocalData(){
		if(localStorage.getItem("myData"))return JSON.parse(localStorage.getItem("myData"))
		return []
	}
	
	$: $mydata && handleSave();
	
	
</script>

<style>
	button{
		margin:1em 0 0 0;
	}
	.expand-btn{
        width: 3em;
        height: 3em;
        
        -webkit-border-radius: 50%;
        -khtml-border-radius: 50%;
        -moz-border-radius: 50%;

        color: black;
        text-decoration: none;
        font-family: 'Courier New', Courier, monospace;
        background-color: transparent;
        overflow: hidden;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        text-align: center;
        display: flex;
	}
	#cross {
        background: #caccce;
        height: 1.5em;
        position: relative;
        width: 0.2em;
	}
    #cross:after {
        background: #caccce;
        content: "";
        height: 0.2em;
        left: -0.65em;
        position: absolute;
        top: 0.65em;
        width: 1.5em;
	}
	#square {
	width: 1.5em;
	height: 0.2em;
	background: #caccce;
	}
	#add-tag-input{
		color: black;
		outline: none;
		border-top: none;
		border-left: none;
		border-right: none;
		width: 98%;
		font-size: 2vmin;
		font-weight: 200;	
		padding: 1em 0 5px 10px;
		align-self: center;
	}
	#add-tag-input::placeholder{
		color: #caccce;
	}
	#tag-input{
		color: black;
		outline: none;
		border-top: none;
		border-left: none;
		border-right: none;
		width: 98%;
		font-size: 2vmin;
		font-weight: 200;	
		padding: 1em 0 5px 10px;
		align-self: center;
	}
	#tag-input::placeholder {
		color: #caccce;
	}#name-input{
		color: black;
		outline: none;
		border-top: none;
		border-left: none;
		border-right: none;
		width: 98%;
		font-size: 2vmin;
		font-weight: 200;	
		padding: 1em 0 5px 10px;
		align-self: center;
	}
	#name-input::placeholder {
		color: #caccce;
	}
    .user-pic{
		grid-area: pic;
		height: 15vh;;
		border-radius: 50%;
		border: 1px solid #eceff1;
		align-self: center;
		justify-self: center;
		margin-top: 1em;
	}
	.user-name{
		grid-area: name;
		font-size: 5vmin;
		font-weight: 500;
		text-transform: uppercase;
	}
	.user-email{
		grid-area: email;
		margin-left: 1em;
	}
	.user-company{
		grid-area: company;
		margin-left: 1em;
	}
	.user-skill{
		grid-area: skill;
		margin-left: 1em;
	}
	.user-average{
		grid-area: avg;
		margin-left: 1em;
	}
	.user-grades{
		grid-area: grades;
		margin-left: 1em;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.user-profile-cart{
		font-size: 2vmin;
		font-weight: 200;

		display: inline-grid;
		grid-gap: 0 1em;
		align-items: flex-start;
		justify-items: flex-start;

		grid-template-columns: 20% 70% 5%;
		grid-template-areas: 
		'pic name expand'
		'pic email .'
		'pic company .'
		'pic skill .'
		'pic avg .'
		'none grades .';

		
		border-bottom: 1px solid #eceff1;
		width: 97%;
		margin: 0 auto 0 auto;
		padding-bottom: 1em;
		padding-top: 0.5em;
		background-color: white;

	}
	.list-body{
		margin: 10vh auto 0 auto;
		height: 75vh;
		max-width: 60vw;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: center;
		overflow-y: scroll;
		border: 1px solid #caccce;
		border-radius: 1em;
		background-color: white;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.19);
	}
	.list-body::-webkit-scrollbar {
    display: none;
	}
	.tags{
		width: 10%;
		display: inline-flex;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.tag{
		display: inherit;
		background-color: #caccce;
		border-radius: 0.2em;
		padding: 5px;
		margin: 5px;
	}
	@media (max-width: 920px) {
		/* .user-profile-cart {
			max-width: 95vw;
			font-weight: normal;
		} */
		.user-pic{
			height: 10vh;
		}
		.list-body{
			max-width: 90vw;;
		}
		#name-input{
			font-size: 3vmin;
			font-weight: 400;	
		}
		#tag-input{
			font-size: 3vmin;
			font-weight: 400;	
		}
		.expand-btn{

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
	<!-- <button on:click={handleSave}>Save Data</button> -->
	<button on:click={fetchData}>Fetch Data</button>
	<br/>
	
	<div class="list-body">
		<label for="name-input">
			<input id="name-input" type="text" bind:value={filterByName} placeholder="Search by name">
		</label>
		<label for="tag-input">
			<input id="tag-input" type="text" bind:value={filterByTag} placeholder="Search by tag">
		</label>

		{#each $mydata.filter(t => ( t.firstName.concat(' ',t.lastName)).toLowerCase().includes(filterByName.toLowerCase()) && ( filterByTag != "" ?  t.tags.find(ele => ele.toLowerCase().includes(filterByTag.toLowerCase())): true ) ) as user,index}
			<div class="user-profile-cart" transition:fade>
				<img class="user-pic" src="{user.pic}" alt="{user.firstName}-avatar">
				<div class="user-name">{user.firstName} {user.lastName}</div>
				<div class="user-email">Email: {user.email}</div>
				<div class="user-company">Company: {user.company}</div>
				<div class="user-skill">Skill: {user.skill}</div>
				<div class="user-average">Average:{avgGrade(user.grades)}%</div>
				<div class="expand-btn" on:click="{ () => user.expandGrade = !user.expandGrade}"><div id="{user.expandGrade ? 'square': 'cross'}"></div></div>

				{#if user.expandGrade}
					<div class="user-grades" transition:fly="{{ y: -10, duration: 200 }}">
						{#each user.grades as grade,gind}
							<div>Test{gind+1}: &nbsp; {grade}% </div>
						{/each}	
						<div class="tags">
							{#each user.tags as tag, tidx}
								<div class="tag">{tag}</div>
							{:else}
							
							{/each}
						</div>
						<input id="add-tag-input" type="text" on:keypress={(event) => {event.keyCode === 13 && user.tempTag !== "" ? (user.tags = [...user.tags, user.tempTag], user.tempTag = "") : null }} bind:value={user.tempTag} placeholder="Add a tag">
				</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

