declare type Cookie = {
    id: number
    username: string
    displayName: string
    accessLevel: AccessLevel
}

declare const enum AccessLevel {
    Disabled = -1,
    Contributor = 0,
    Moderator = 1,
    Administrator = 2
}

declare namespace Schema {
    interface Quote {
        id: number

        /** ISO Date string */
        lastUpdated: string

        /** ISO Date string */
        dateCreated: string

        /** ISO Date string */
        createdBy: string

        /** JSON Array of strings */
        quote: string

        votes: number

        approved: boolean

        isDeleted: boolean
    }

    interface QuoteRevision {
        id: number
        quoteId: number

        /** ISO Date string */
        revisionDate: string

        /** ISO Date string */
        updatedBy: string

        /** JSON Array of strings */
        quote: string
    }

    interface User {
        id: number

        displayName: string

        username: string

        hashedPassword: string

        accessLevel: AccessLevel
    }
}

declare namespace Geddit {
    interface Quote {
        id: number
        lastUpdated: Date
        dateCreated: Date
        quote: string[]
        votes: number
        createdBy: string
    }

    interface QuoteRevision {
        id: number
        quoteId: number
        revisionDate: Date
        newQuote: string[]
        updatedBy: string
    }
}