<script lang="typescript">
    import { onMount } from 'svelte'
    import Nav from '../components/Nav.svelte'
    import type { Poll } from '../interfaces'

    export let url : string = 'http://localhost:5005'

    let polls : Array<Poll> = []

    onMount(async () => {
        const res = await fetch(url + '/api/poll')
        polls = await res.json()

        polls.map((poll : Poll) => {
            const dateObj : Date = new Date(poll.createdAt)
            poll.createdAt = dateObj.getDate()  + '/' + dateObj.getMonth() + '/' + dateObj.getFullYear()
        })
    })
    
</script>

<Nav />

<div class="section">
    
    <h1 class="title is-1"> Polls </h1>
    <h2 class="subtitle">Happy Voting 😆</h2>

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

<style>
    p.title.is-5 {
        color: white;
    }
</style>
