<script lang="typescript">
    import { onMount } from 'svelte'
    import { goto } from '@sapper/app'
    import Nav from '../components/Nav.svelte'
    import NewPoll from '../components/NewPoll.svelte'
    import type { Poll } from '../interfaces'

    export let url : string = 'http://localhost:5005'

    let polls : Array<Poll> = []
    let user : any = []

    onMount(async () => {
        const res = await fetch(url + '/api/poll')
        polls = await res.json()

        polls.map((poll : Poll) => {
            const dateObj : Date = new Date(poll.createdAt)
            poll.createdAt = dateObj.getDate()  + '/' + dateObj.getMonth() + '/' + dateObj.getFullYear()
        })

        const userRes = await fetch(url + '/auth/user', { credentials: 'include' })
        user = await userRes.json()

        if (user.error) {
            setTimeout(() => {
                return goto('/login')
            }, 5000)
        }
    })
    
</script>

<Nav />

{#if user.error}
    <div class="section">
        <h1 class="title notification is-danger">
            You Are Not Logged In
        </h1>
        <h2 class="subtitle notification is-danger is-light">
            redirecting you to login page......
        </h2>
    </div>
{:else }
    <div class="section">
    
        <h1 class="title is-1"> Polls </h1>
        <h2 class="subtitle">Happy Voting 😆</h2>

        <NewPoll />

        {#each polls as poll}
        <div class="message box is-primary">
            <div class="message-header">
                    <p class="title is-5">{poll.title}</p>
            </div>
            <div class="message-body">
                <p><strong>Current Voters :</strong> {poll.voteCount}</p>
                <p><strong>Created At :</strong> {poll.createdAt}</p>
                <br>
                <a class="button is-primary" href={'/' + poll._id}>View Poll</a>
            </div>
        </div>
        {/each}
    </div>
{/if}

<style>
    p.title.is-5 {
        color: white;
    }
</style>