<script context="module">
    export async function preload (page, session) {
        const { id } = page.params

        const res = await this.fetch('http://localhost:5005/api/poll/' + id)
        const poll = await res.json()
        
        const resAu = await this.fetch('http://localhost:5005/auth/author/' + poll.author)
        const author = await resAu.json()
        
        const resVoter = await this.fetch('http://localhost:5005/auth/user', {credentials: 'include'})
        const voter = await resVoter.json()

        return { poll ,author, voter }
    }
</script>

<script lang="typescript">
    import Nav from '../components/Nav.svelte'
    import type { Poll, User } from '../interfaces'
    import Vote from '../components/Vote.svelte'

    export let poll : Poll
    export let author
    export let voter : User

    const dateObj = new Date(poll.createdAt)
    const date = dateObj.getDate() + '/' + dateObj.getMonth() + '/' + dateObj.getFullYear()

    let votedCounter = 0
    let voted = false

    function handleVoted() {
        votedCounter += 1
        if (votedCounter % 2 === 0) {
            voted = false
        } else if (votedCounter % 2 !== 0) {
            voted = true
        }
    }
</script>

<Nav />
<div class="section">
    <div class="header">
        <div class="title is-1">
            {poll.title}
        </div>
        <div class="subtitle">
            Created At: {date}
            <br />
            Author: {author.author}
        </div>
    </div>
    <div class="container">
        {#each poll.options as option }
            <Vote 
            pollId={poll._id} 
            voterId={voter._id}
            optionId={option._id} 
            title={option.title} 
            currentVotes={option.currentVotes} 
            totalVotes={poll.voteCount} 
            voted={voted}
            on:vote={handleVoted}
            />
        {/each}
    </div>
</div>