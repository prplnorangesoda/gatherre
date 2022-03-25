declare global {
    interface Math {
        randInt(min:number,max:number):number
    }
    interface BigInt {
        toJSON():string
    }
    interface Player {
        VERSION: {
            number: string
            isBeta: boolean
            isPrerelease: boolean
            name?: string
        }
        berries: bigint;
        sticks: bigint;
    }
}