import * as knex from 'knex'

const db = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'geddit.sqlite'
  }
})

export const QUOTE = 'Quote'
export const QUOTE_REVISION = 'QuoteRevision'

export default db
