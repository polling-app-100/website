<script lang="typescript">
    import Nav from '../components/Nav.svelte'
    import Option from '../components/Option.svelte'
    import { fade } from 'svelte/transition'
    import { goto } from '@sapper/app'

    interface Data {
        error? : string
        message? : string
    }

    // props that will be used
    let url = 'http://localhost:5005' // api url
    let options = [{}, {}] // controls number of options
    let title = '' // poll title
    let result = [] // the options that are submitted
    let data : Data =  {} // controls errors
    let submit = false

    // adds an option field to form
    function onAddOption(e) {
        e.preventDefault()
        
        if (options.length >= 10) {
            alert('10 is the maximum amount of options available')
        } else {
            const option = {}
            options = [...options, option]
        } 
    }

    // submits the form to backend
    async function onSubmit(e) {
        e.preventDefault()
        data.error = null
        
        submit = true

        // makes sure that options have been collected before submitting
        setTimeout(() => {
            // error handling
            if (!title) {
                data.error = 'title cannot be empty'
                setTimeout(() => {
                    data.error = null
                }, 3000)
                return
            } else if (result.length < options.length) {
                data.error = 'options cannot be empty'
                setTimeout(() => {
                    data.error = null
                }, 3000)
                return
            } else {
                async function submitPollOptions () {
                    const res = await fetch(url + '/api/poll', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type':'application/json' },
                        body: JSON.stringify({ 
                            title, 
                            options: result
                        })
                    })
                    data = await res.json()

                    data.message = "poll successfully registered"
                    setTimeout(() => { goto('/main') }, 2000)
                }

                submitPollOptions()
            }
        }, 5000)
    }
    
    // on submit, collects all the options from child components
    function gatherOptions (event) {
        const option = event.detail
        result.push(option)
    }
</script>

<Nav />

<div class="box primary">
    <h2 class="title is-2"> Create Poll </h2>

    <form>
        <div class="field">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            
            <!-- title input -->
            <label class="label"> 
            <h3 class="subtitle">Poll Title</h3>
            </label>
            <br>
            <input class="input titleInput" type="text" maxlength="50" placeholder="US Election" bind:value={title}>
        </div>

        <!-- option inputs -->
        <div class="box is-link">
            <!-- multiple option input fields -->
            {#each options as option}
                <h2 title="subtitle"> Option {options.indexOf(option) + 1} </h2>
                <Option bind:submit={submit} on:submit={gatherOptions} />
            {/each}

            <!-- add option button -->
            <button class="button is-link" on:click={onAddOption}>Add Option</button>
        </div>
        
        <!-- submit button -->
        <div class="field">
            <div class="control">
              <button class="button is-primary" on:click={onSubmit}>Submit</button>
            </div>   
        </div>
    </form>

    <!-- notifications for errors and success messages-->
    {#if data.error}
    <br>
    <div class="notification is-danger" in:fade out:fade>
        {data.error}
    </div>
    {:else if data.message}
    <br>
    <div class="notification is-primary" in:fade out:fade>
        {data.message}
    </div>
    {/if}
</div>

<style>
    div.box.primary {
        border: 2px #50cba3 solid;
        margin: 15px;
    }
    div.box.is-link {
        border: 2px #4657ff solid;
        margin: 35px 20px;
        max-height: 40em;
        overflow-y: scroll;
    }
    input.titleInput {
        width: 75%;
    }
</style>