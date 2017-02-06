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

declare module 'cookie-session' {
    import * as express from 'express'
    function cookieSession(options?: CookieSessionInterfaces.CookieSessionOptions): express.RequestHandler;
    namespace cookieSession { }
    export = cookieSession
}

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

// Type definitions for cookie-session 2.0
// Project: https://github.com/expressjs/cookie-session
// Definitions by: Borislav Zhivkov <https://github.com/borislavjivkov/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="express" />

declare namespace Express {
    interface Request extends CookieSessionInterfaces.CookieSessionRequest { }
}

declare namespace CookieSessionInterfaces {
    interface CookieSessionOptions {
        /**
         * The name of the cookie to set, defaults to session.
         */
        name: string;

        /**
         * The list of keys to use to sign & verify cookie values. Set cookies are always signed with keys[0], while the other keys are valid for verification, allowing for key rotation.
         */
        keys?: Array<string>;

        /**
         * A string which will be used as single key if keys is not provided.
         */
        secret?: string;

        /**
         * a number representing the milliseconds from Date.now() for expiry.
         */
        maxAge?: number;

        /**
         * a Date object indicating the cookie's expiration date (expires at the end of session by default).
         */
        expires?: Date;

        /**
         * a string indicating the path of the cookie (/ by default).
         */
        path?: string;

        /**
         * a string indicating the domain of the cookie (no default).
         */
        domain?: string;

        /**
         * a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
         */
        secure?: boolean;

        /**
         * a boolean indicating whether the cookie is only to be sent over HTTPS (use this if you handle SSL not in your node process).
         */
        secureProxy?: boolean;

        /**
         * a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
         */
        httpOnly?: boolean;

        /**
         * a boolean indicating whether the cookie is to be signed (true by default). If this is true, another cookie of the same name with the .sig suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the
         * first Keygrip key. This signature key is used to detect tampering the next time a cookie is received.
         */
        signed?: boolean;

        /**
         * a boolean indicating whether to overwrite previously set cookies of the same name (true by default). If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.
         */
        overwrite?: boolean;
    }

    interface CookieSessionObject {
        /**
         * Is true if the session has been changed during the request.
         */
        isChanged: boolean;

        /**
         * Is true if the session is new.
         */
        isNew: boolean;

        /**
         * Determine if the session has been populated with data or is empty.
         */
        isPopulated: boolean;

        [propertyName: string]: any;
    }

    interface CookieSessionRequest {
        /**
         * Represents the session for the given request.
         */
        session: CookieSessionObject;

        /**
         * Represents the session options for the current request. These options are a shallow clone of what was provided at middleware construction and can be altered to change cookie setting behavior on a per-request basis.
         */
        sessionOptions: CookieSessionOptions;
    }
}
