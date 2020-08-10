<script lang="ts">

export let inputVal: string;
export let bgColor: string;
export let height:string;
</script>

<style>
input{
    resize: none;
    min-width: 70%;
    border:none;
    outline: none;
    font-weight: 100;
}
@media (max-width: 920px) {
    input{
        font-weight: normal;
    }
}
</style>

<input style="background-color: {bgColor}; height:{height}" bind:value={inputVal}/>