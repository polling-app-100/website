<script lang="typescript">
    import Nav from '../components/Nav.svelte'
    import { fade } from 'svelte/transition'
    import { goto } from '@sapper/app'

    let username : string = ''
    let password : string = ''

    let isLoggedIn : boolean = false
    let LoggedInMsg : string = ''

    let logInFailed : boolean = false
    let failedMsg : string = ''

    async function login (e : any) : Promise<void> {
        e.preventDefault()

        if (!username || !password) {
            logInFailed = true
            failedMsg = 'username and password fields cannot be empty'
            setTimeout(() => logInFailed = false, 5000)
        }
        else {
            let reqBody = { 
                username: username.trim(), 
                password : password.trim()
            }
            await fetch('http://localhost:5005/auth/login', {method: 'POST', credentials: 'include', body: JSON.stringify(reqBody), headers: { 'Content-Type': 'application/json' }})
            .then(async (res : any) => { 
                let data = await res.json() 
                if (res.status !== 200) {
                    logInFailed = true 
                    failedMsg = data.error
                    setTimeout(() => logInFailed = false, 5000)
                } else {
                    isLoggedIn = true
                    LoggedInMsg = data.message
                    setTimeout(() => isLoggedIn = false, 5000)
                    setTimeout(() => { goto('/main') }, 2000)
                }
            })
            .catch(async (e : any) => {
                let data = await e.json()
                logInFailed = true 
                failedMsg = data.error
                setTimeout(() => logInFailed = false, 5000)
            })
        }
        
    }
</script>

<Nav />

<form class="form">

    <h1 class="form-title"> Login </h1>

    <div class="field">
        <label class="label" for="username"> Username </label>
        <div class="control" id="username">
            <input type="text" class="input" bind:value={username}>
        </div>
    </div>

    <div class="field">
        <label class="label" for="username"> Password </label>
        <div class="control" id="username">
            <input type="password" class="input" bind:value={password}>
        </div>
    </div>

    <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" on:click={login}>Submit</button>
        </div>
    </div>

    {#if isLoggedIn} 
        <div class="notification is-primary" in:fade out:fade>
            {LoggedInMsg}
        </div>
    {/if}
    {#if logInFailed} 
        <div class="notification is-danger" in:fade out:fade>
            {failedMsg}
        </div>
    {/if}

</form>

<style>
    form.form {
        width: 95%;
        margin: 2em auto;
        padding: 3em;

        border: 1px solid #dedede;
        border-radius: 15px;
    }

    h1.form-title {
        font-size: 3em;
        text-align:center;
        text-transform: uppercase;
        margin: 0.5em 0;
    }

    label.label {
        font-size: 1.2em;
    }
</style>