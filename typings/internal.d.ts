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