<script lang="typescript">

    import { fade } from 'svelte/transition';
    import { goto } from '@sapper/app'

    let isActive : number = 0
    let logoutMsg : string = ''
    let isLoggedOut : boolean = false

    function displayHiddenLinks () : void {
        isActive += 1
    }

    async function logout () : Promise<void> {
        await fetch('http://localhost:5005/auth/logout', { method: 'POST', credentials: 'include' })
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
                    <a class="button is-light" href="/login">
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