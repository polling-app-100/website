<script lang="typescript">

    import { fade } from 'svelte/transition';
    import { goto } from '@sapper/app'

    let isActive : number = 0
    let logoutMsg : string = ''
    let isLoggedOut : boolean = false

    const url : string = 'http://localhost:5005'

    function displayHiddenLinks () : void {
        isActive += 1
    }

    async function logout () : Promise<void> {
        await fetch(url + '/auth/logout', { method: 'POST', credentials: 'include' })
        .then(() => logoutMsg = 'succesfully logged out')
        .catch(e => logoutMsg = e.error)
        
        isLoggedOut = true
        setTimeout(() => {
            isLoggedOut = false
        }, 5000)
        setTimeout(() => {
            goto('/login')
        }, 3000)
    }

    async function autoLogin () : Promise<void> {
        await fetch(url + '/auth/login', { method: 'POST', credentials: 'include' })
        .then((res) => { 
            if (res.status === 200) {
                goto('/main')
            } else {
                goto('/login')
            }
         })
         .catch(() => { goto('/login') })
    }
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="logo">
      </a>
  
      <button role="button" class="navbar-burger {isActive % 2 === 0 ? null : 'is-active'}" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" on:click={displayHiddenLinks}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>
  
    <div class="navbar-menu {isActive % 2 === 0 ? null : 'is-active'}">
        <div class="navbar-start">
            <a class="navbar-item" href="/main">
                Home
            </a>
            <a class="navbar-item" href="/user">
                User
            </a>
        </div>
    
  
        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-primary" href="/signup">
                        <strong>Sign up</strong>
                    </a>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class="button is-light" on:click={autoLogin}>
                        Log in
                    </a>
                    <button class="button is-link" on:click={logout}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    </div>
</nav>

{#if isLoggedOut}
    <div class="notification is-link" in:fade out:fade>
        {logoutMsg}
    </div>
{/if}



<style>
    .navbar-burger {
          border: 0;
    }
</style>