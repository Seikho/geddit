declare module 'compression' {
    namespace api { }
    function api(): any;
    export = api;
}

declare module 'body-parser' {
    namespace api {
        function json(): any
    }
    function api(): any;
    export = api;
}

declare namespace Schema {
    interface Quote {
        id: number;

        /** ISO Date string */
        lastUpdated: string;

        /** ISO Date string */
        dateCreated: string;

        /** ISO Date string */
        createdBy: string;

        /** JSON Array of strings */
        quote: string;

        votes: number;

        approved: boolean;
    }

    interface QuoteRevision {
        id: number;
        quoteId: number;

        /** ISO Date string */
        revisionDate: string;

        /** ISO Date string */
        updatedBy: string;

        /** JSON Array of strings */
        quote: string;
    }
}

declare namespace Geddit {
    interface Quote {
        id: number;
        lastUpdated: Date;
        dateCreated: Date;
        quote: string[];
        votes: number;
        createdBy: string;
    }

    interface QuoteRevision {
        id: number;
        quoteId: number;
        revisionDate: Date;
        newQuote: string[];
        updatedBy: string;
    }
}

// type Partial<T> = {[P in keyof T]?: T[P]}