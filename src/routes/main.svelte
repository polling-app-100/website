<script lang="typescript">
    import Nav from '../components/Nav.svelte'
    import { onMount } from 'svelte'
    import { goto } from '@sapper/app'
    import { fade } from 'svelte/transition'

    let failed : boolean = false 
    let failedMsg : string = ''

    let username : string = ''
    let region : string = 'asia'
    let ageGroup : string = 'children'

    let updateSuccess : boolean = false
    let updatedMsg : string = ''

    onMount(async () => {
        await fetch('http://localhost:5005/auth/user', { credentials: 'include' })
        .then(async (res) => {
            const data = await res.json()
            if (res.status !== 200) {
                failed = true 
                failedMsg = data.error

                setTimeout(() => {
                    failed = false 
                }, 4000)
                setTimeout(() => {
                    goto('/login')
                }, 2000)
            } else {
                username = data.username
                region = data.region
                ageGroup = data.ageGroup
            }
        })
    })

    async function updateUser (e) : Promise<void> {
        e.preventDefault()
        const reqBody = { username, region, ageGroup }
        await fetch('http://localhost:5005/auth/user', { method: 'PUT', body: JSON.stringify(reqBody), headers : { 'Content-Type': 'application/json' }, credentials: 'include' })
        .then(async (res) => {
            const data = await res.json()
            updateSuccess = true 
            updatedMsg = data.message

            setTimeout(() => {
                updateSuccess = false
            }, 4000)
        })
    }
</script>

<Nav />

{#if failed}
    <div class="notification is-danger"> { failedMsg } </div>
{:else}
    <div class="section">
        <h1 class="title"> Welcome <br/> <span class="username"> { username } </span> </h1>

        <div class="settings box">
            <h2 class="subtitle"> Settings </h2>

            <form class="form">

                <div class="field">
                    <label for="username" class="label"> Username </label>
                    <div class="control" id="username">
                        <input type="text" class="input" bind:value={username}>
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="region">Region</label>
                    <div class="control">
                    <div class="select">
                        <select id="region" bind:value={region}>
                        <option value="asia">Asia</option>
                        <option value="africa">Africa</option>
                        <option value="europe">Europe</option>
                        <option value="north america">North America</option>
                        <option value="south america">South America</option>
                        <option value="oceania">Oceania</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="ageGroup">Age Group</label>
                    <div class="control">
                    <div class="select">
                        <select id="ageGroup" bind:value={ageGroup}>
                            <option value="children">Children [0 - 14]</option>
                            <option value="youth">Youth [15 - 24]</option>
                            <option value="adults">Adults [25 - 64]</option>
                            <option value="seniors">Seniors [65 and over]</option>
                        </select>
                    </div>
                    </div>
                </div>

                <button class="button is-primary" on:click={updateUser}> Update Settings </button>
            </form>

            {#if updateSuccess} 
                <div class="notification is-primary" in:fade out:fade>
                    {updatedMsg}
                </div>
            {/if}
        </div>
        
    </div>
{/if}

<style>
    form.form {
        margin-bottom: 1em;
    }
    h1.title {
        font-family: sans-serif;
        font-size: 4em;
        font-weight: 100;
        text-transform: uppercase;
        text-align: center;
    }
    
    span.username {
        background: linear-gradient(to right, rgb(102, 125, 182), rgb(0, 130, 200), rgb(0, 130, 200), rgb(102, 125, 182));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .settings {
        border-radius: 15px;
        border: 2px solid #dedede;
        margin: 1em 2em;
    }

    .button {
        margin-top: 15px;
    }
</style>
