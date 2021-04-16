<script lang="typescript">
    import Nav from '../components/Nav.svelte'
    import { fade } from 'svelte/transition'
    import { goto } from '@sapper/app'

    export let url : string ='http://localhost:5005'

    let username : string = ''
    let password : string = ''
    let region : string = 'asia'
    let ageGroup : string = 'children'

    let signupSuccess : boolean = false 
    let signedUpMsg : string = ''

    let failedSignup : boolean = false 
    let failedMsg : string = ''

    async function signup (e : any) : Promise<void> {

        e.preventDefault()

        if (!username || !password || !region || !ageGroup) {
            failedSignup = true 
            failedMsg = 'username and password fields cannot be empty'
            setTimeout(() => {
                failedSignup = false
            }, 5000)
        }
        else {
            if (password.length < 7) {
              failedSignup = true
              failedMsg = 'password must be at least 7 characters long'

              setTimeout(() => {
                failedSignup = false
                failedMsg = ''
              }, 3000)

              return 
            }

            let reqBody = { 
            username : username.trim(),
            password : password.trim(),
            region, 
            ageGroup
            }

            await fetch(url + '/auth/signup', { method:'POST', body: JSON.stringify(reqBody) ,headers: {'Content-type':'application/json'}, credentials: 'include'})
            .then(async (res : any) => {
             if (res.status !== 200) {
                    const data : any = await res.json()
                    failedSignup = true 
                    failedMsg = data.error

                    setTimeout(() => {
                        failedSignup = false
                    }, 3000)
                } else {
                    const data : any = await res.json()
                    signupSuccess = true 
                    signedUpMsg = data.message

                    setTimeout(() => {
                        signupSuccess = false 
                    }, 5000)
                    setTimeout(() => {
                      goto('/main')
                    }, 3000)
                }
            })

            username = ''
            password = ''
        }
    }

</script>

<Nav />

<form class="form"> 

    <h1 class="form-title"> Signup </h1>

    <div class="field">
        <label for="username" class="label"> Username </label>
        <div class="control" id="username">
            <input type="text" class="input" bind:value={username}>
        </div>
    </div>
    
    <div class="field">
        <label for="password" class="label"> Password </label>
        <div class="control" id="password">
            <input type="password" class="input" bind:value={password}>
        </div>
    </div>

    <div class="field">
        <label class="label" for="region" >Region</label>
        <div class="control" id="region">
          <div class="select">
            <select bind:value={region}>
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
          <div class="select" id="ageGroup">
            <select bind:value={ageGroup}>
              <option value="children">Children [0 - 14]</option>
              <option value="youth">Youth [15 - 24]</option>
              <option value="adults">Adults [25 - 64]</option>
              <option value="seniors">Seniors [65 and over]</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" on:click={signup}>Signup</button>
        </div>
      </div>

      {#if signupSuccess} 
        <div class="notification is-primary" in:fade out:fade>
            {signedUpMsg}
        </div>
      {/if}
      {#if failedSignup} 
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