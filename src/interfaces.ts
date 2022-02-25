// polls
interface Options {
    _id: string,
    title: string,
    currentVotes: number
}

interface GeoAreaCount{
    asia: number
    oceania: number
    europe: number
    northAmerica: number
    southAmerica: number
}

interface AgeGroup {
    children: number
    youth: number
    adults: number
    seniors: number
}

export interface Poll {
    author: string
    title: string
    createdAt: string 
    voteCount: number,
    _id: string,
    __v: string,
    options: Array<Options>,
    ageGroup: Array<AgeGroup>
    geoAreaCount: Array<GeoAreaCount>
    error?: string
}

// users

// the array of objects for voting history
export interface VotedIn {
    _id?: String
    pollId: string
    optionId: string
}

// user object for app
export interface User {
    username: string
    password: string
    _id: string
    ageGroup: string
    region: string
    votedIn: Array<VotedIn>
    createdPolls: Array<string>
    error?: string
}

export interface Message {
    // vote and unvote messge channel
    // mutual with vote and unvote
    pollId: string
    optionId: string
    // exclusive to vote events
    voterId?: string
    error?: string
}

export interface PollObj {
  pollId: string
  pollTitle: string
}
