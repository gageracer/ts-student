<script lang="ts">

export let inputVal: string;
export let bgColor: string;
export let height:string;
</script>

<style>
input{
    width: fit-content;
    border:none;
    outline: none;
    font-weight: 100;
}
</style>

<input style="background-color: {bgColor}; height:{height}" bind:value={inputVal}/>