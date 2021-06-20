<script lang="typescript">
    export let submit
    
    import { createEventDispatcher } from 'svelte'
    const dispatcher = createEventDispatcher()

    let title = ''

    $: if(submit === true) {
        dispatcher('submit', { title })
    }
</script>

<div class="field">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <input class="input optionInput" type="text" maxlength="40" placeholder="" bind:value={title}>
</div>


<style>
    input.optionInput {
        width: 55%;
    }

    @media only screen and (max-width: 600px) {
        input.optionInput {
            width: 100%;
        }
    }
</style>
