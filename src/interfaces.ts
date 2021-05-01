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
export interface User {
    username: string
    password: string
    _id: string
    ageGroup: string
    region: string
    votedIn: Array<string>
    createdPolls: Array<string>
    error?: string
}