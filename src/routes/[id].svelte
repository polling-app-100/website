<script context="module">
    export async function preload (page, _) {
        const { id } = page.params

        const res = await this.fetch('http://localhost:5005/api/poll/' + id)
        const poll = await res.json()

        const resAu = await this.fetch('http://localhost:5005/auth/author/', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: poll.author })
        })
        const author = await resAu.json()
        
        const resVoter = await this.fetch('http://localhost:5005/auth/user', {credentials: 'include'})
        const voter = await resVoter.json()

        return { poll, author, voter }
    }
</script>

<script lang="typescript">
    import Nav from '../components/Nav.svelte'
    import type { Poll, User, VotedIn } from '../interfaces'
    import Vote from '../components/Vote.svelte'
    import { onMount } from 'svelte'

    export let poll : Poll
    export let author
    export let voter : User

    let votedCounter = 0
    let voted = false

    onMount(() => {
        if (!voter.votedIn) {
            return voted = false
        }
        else {
            voter.votedIn.forEach((vote : VotedIn) => {
            if (vote._id === poll._id) {
              voted = true
              console.log('voted')
            }
         })
        }
    })

    const dateObj = new Date(poll.createdAt)
    const date = dateObj.getDate() + '/' + dateObj.getMonth() + '/' + dateObj.getFullYear()

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
            geoArea={voter.region}
            ageGroup={voter.ageGroup}
            on:vote={handleVoted}
            />
        {/each}
    </div>
</div>
