<script lang="ts">

export let inputVal: string;
export let bgColor: string;
export let height:string;

function onFocus(){bgColor="#b4ffff"}

function onBlur(){bgColor="#90caf9"}
</script>

<style>
input{
    transition: background-color 0.5s ease;
    resize: none;
    width: 90%;
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

<input type="text" on:focus={onFocus} on:blur={onBlur} style="background-color: {bgColor}; height:{height}" bind:value={inputVal}/>