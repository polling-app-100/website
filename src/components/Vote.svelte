<script lang="typescript">
    // essential poll info
    export let pollId
    export let voterId
    export let currentVotes
    export let title
    export let totalVotes
    export let optionId

    // security props
    export let voted

    import { createEventDispatcher } from 'svelte'
    import io from 'socket.io-client'

    // voted counter
    
    // local voted tracker to unsync from sibling component
    $: localVoteTracker = false

    // event dispatcher
    const dispatcher = createEventDispatcher()

    // websocket connection
    const socket = io('ws://localhost:5005')

    socket.on('vote',() => {
        currentVotes += 1
    })

    socket.on('rejected', () => {
        alert('you have already voted here')
        voted = true
        currentVotes -= 1
        localVoteTracker = true
    })

    function handleVote(e) {
        if (voted === true) {
            alert('you have already voted')
            return
        }
        e.preventDefault()
        currentVotes += 1
        voted = true
        dispatcher('vote')
        socket.emit('vote',{type: 'vote', pollId: pollId, voterId: voterId, option: optionId })

        localVoteTracker = true
        return
    }

    function handleUnvote(e) {
        e.preventDefault()
        currentVotes -= 1
        voted = false
        dispatcher('vote')
        socket.emit('vote',{type: 'unvote', pollId: pollId, voterId: voterId, option: optionId })

        localVoteTracker = false
    }
</script>

<div class="box">
    <div class="title is-4">
        {title}
    </div>
    <div class="bar" style="width: {(currentVotes / totalVotes) * 100 || 0}%">
        {currentVotes}
    </div>
    {#if voted === false && localVoteTracker === false }
        <button class="button is-primary" on:click={handleVote}>Vote</button>
    {:else if voted === true && localVoteTracker === true}
        <button class="button is-danger" on:click={handleUnvote}>Unvote</button>
    {:else}
        <button class="button is-primary" on:click={handleVote}>Vote</button>
    {/if}
</div>

<style>
    div.bar {
        background-color: #bbffca;
        color: black;
    }
</style>