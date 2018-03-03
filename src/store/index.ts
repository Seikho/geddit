import * as knex from 'knex'

const db = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'data/geddit.sqlite'
  }
})

export const QUOTE = 'Quote'
export const QUOTE_REVISION = 'QuoteRevision'
export const USER = 'User'

export default db
