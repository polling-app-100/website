<script lang="typescript">
    import { writable } from "svelte/store"

    // essential poll info
    export let pollId
    export let voterId
    export let currentVotes
    export let title
    export let totalVotes
    export let optionId
    export let geoArea
    export let ageGroup

    export let user : User

    // svelte store to deal with websocket reactivity
    const count = writable(currentVotes)

    // security props
    export let voted

    import { createEventDispatcher, onMount } from 'svelte'
    import type { Message, User, VotedIn } from '../interfaces'
    import io from 'socket.io-client'

    onMount(async () => {
        
        const res = await fetch('http://localhost:5005/auth/user', { credentials: 'include' })
        user = await res.json()

        user.votedIn.forEach((vote: VotedIn) => {
            if (vote.pollId === pollId && vote.optionId === optionId) {
                voted = true
                localVoteTracker = true
                console.log('voted')
                return
            }
        })

    })

    // width calculator
    let width
    count.subscribe(n => {
      $: width = n * 20
    })
    
    // local voted tracker to unsync from sibling component
    $: localVoteTracker = false

    // event dispatcher
    const dispatcher = createEventDispatcher()

    // websocket connection
    const socket = io('ws://localhost:5005')

    socket.on('vote',(message : Message) => {
        if (message.pollId === pollId && message.optionId === optionId) {
            currentVotes += 1
            totalVotes += 1
            count.update(n => n+=1)
        }
    })

    socket.on('unvote', (message: Message) => {
        if (message.pollId === pollId && message.optionId === optionId) {
            currentVotes -= 1
            totalVotes -= 1
            count.update(n => n-=1)
        }
    })

    socket.on('rejected', (message : Message) => {
        if (message.voterId === voterId && message.pollId === pollId && message.optionId === optionId) {
            alert(message.error)
            voted = false
            currentVotes -= 1
            totalVotes -= 1
            count.update(n => n--)
            localVoteTracker = false
        }  
    })

    function handleVote(e) {
        if (voted === true) {
            alert('you have already voted')
            return
        }
        e.preventDefault()
        currentVotes += 1
        totalVotes += 1
        count.update(n => n+=1)
        voted = true
        dispatcher('vote')
        socket.emit('vote',{ pollId: pollId, voterId: voterId, option: optionId, geoArea: geoArea, ageGroup: ageGroup  })

        localVoteTracker = true
        return
    }

    function handleUnvote(e) {
        e.preventDefault()
        currentVotes -= 1
        totalVotes -= 1
        count.update(n => n-=1)
        voted = false
        dispatcher('vote')
        socket.emit('unvote',{pollId: pollId, voterId: voterId, option: optionId, geoArea: geoArea, ageGroup: ageGroup })

        localVoteTracker = false
    }
</script>

<br />
<div class="box">
    <div class="title is-4">
        {title}
    </div>
    <div class="bar" style="width: {width}px">
        {currentVotes}
    </div>
    <br/>
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
        padding: 5px 0px;
    }
</style>
