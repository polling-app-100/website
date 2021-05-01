<script lang="typescript">
    export let url : string ='http://localhost:5005'

    import Nav from '../components/Nav.svelte'
    import { onMount } from 'svelte'
    import { goto } from '@sapper/app'
    import { fade, scale, slide } from 'svelte/transition'
    import type { User } from '../interfaces'

    let failed : boolean = false 
    let failedMsg : string = ''

    let username : string = ''
    let region : string = 'asia'
    let ageGroup : string = 'children'

    let updateSuccess : boolean = false
    let updatedMsg : string = ''

    let clickedUpdateTimes : number = 0
    let buttonState : string = 'false'

    let deleted : boolean = false 
    let deletedMsg : string = ''

    let clickedDeleteTimes : number = 0
    let delButtonState : string = 'false'

    onMount(async () => {
        await fetch(url + '/auth/user', { credentials: 'include' })
        .then(async (res) => {
            const data : User= await res.json()
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

    function handleClickUpdateUser (e) : void {
        e.preventDefault()
        clickedUpdateTimes += 1 

        if (clickedUpdateTimes === 1) {
            buttonState = 'loading'
        }
        else if (clickedUpdateTimes === 2) {
            buttonState = 'true'
            updateUser()
            clickedUpdateTimes = 0
        } 

        setTimeout(() => {
            buttonState = 'false'
        },
        3000)
    }

    function handleClickDeleteUser (e) : void {
        e.preventDefault()
        clickedDeleteTimes += 1 

        if (clickedDeleteTimes === 1) {
            delButtonState = 'loading'
        }
        else if (clickedDeleteTimes === 2) {
            delButtonState = 'true'
            deleteUser()
            clickedDeleteTimes = 0
        } 
    }

    async function deleteUser () : Promise<void> {
        await fetch(url + '/auth/deleteUser', { method: 'DELETE',headers : { 'Content-Type': 'application/json' }, credentials: 'include' })
        .then(async (res: any) => {
            const data = await res.json()
            deleted = true 
            deletedMsg = data.message

            setTimeout(() => {
                deleted = false 
                deletedMsg = ''
            }, 5000)
            setTimeout(() => {
                goto('signup')
            }, 2000)
            
        })
    }

    async function updateUser () : Promise<void> {
        const reqBody = { username, region, ageGroup }
        await fetch(url + '/auth/user', { method: 'PUT', body: JSON.stringify(reqBody), headers : { 'Content-Type': 'application/json' }, credentials: 'include' })
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

    <div class="section">
        <h1 class="title notification is-danger">
            You Are Not Logged In
        </h1>
        <h2 class="subtitle notification is-danger is-light">
            redirecting you to login page......
        </h2>
    </div>
{:else}
    <div class="section">
        <h1 class="title"> Welcome <br/> <span class="username"> { username } </span> </h1>

        <div class="settings box">
            <h2 class="subtitle"> Personal Settings </h2>

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

                <button class="button is-primary" on:click={handleClickUpdateUser}>
                    {#if buttonState === 'false'}
                        <span in:scale={{ duration: 2000 }}>Update User Settings</span>
                    {:else if buttonState === 'loading'}
                        Please Confirm
                    {:else if buttonState === 'true'}
                        User Settings Updated
                    {/if}
                </button>
            </form>

            {#if updateSuccess} 
                <div class="notification is-primary" in:fade out:fade>
                    {updatedMsg}
                </div>
            {/if}
        </div>
        
    </div>

    <div class="section">
        <div class="danger box">
            <h1 class="danger subtitle">Danger Zone</h1>
        
            <div class="container columns">
                <div class="column is-four-fifths"> 
                    <h2 class="topicTitle">
                        Delete Account <br/>
                    </h2>
                    once you delete your account there will be no going back
                </div>
                <div class="column">
                    <button class="is-danger button" on:click={handleClickDeleteUser}>
                        {#if delButtonState === 'false'}
                            <span in:scale={{ duration: 2000 }}>Delete User</span>
                        {:else if delButtonState === 'loading'}
                            Please Confirm
                        {:else if delButtonState === 'true'}
                            User Deleted
                        {/if}
                    </button>
                </div>
                
            </div>

            {#if deleted}
                <div class="notification is-danger" transition:slide>
                    {deletedMsg}
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

    .button.is-primary {
        margin-top: 15px;
    }
    .danger.box {
        border: 2px solid red;
        border-radius: 13px;
        margin: 0 2em;
    }
    .danger.subtitle {
        font-size: 1.2em;
    }
    .topicTitle {
        font-size: 1em;
        font-weight: 800;
    }
</style>
