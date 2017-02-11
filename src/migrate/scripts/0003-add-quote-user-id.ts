import * as Knex from 'knex'
import * as tables from '../../store'

/**
 * Add userId to Quote table
 * Attempt to backfill userIds
 */

export async function up(db: Knex) {
  await db.schema.table(tables.QUOTE, table => {
    table.integer('userId').nullable()
  })

  const users: Schema.User[] = await db(tables.USER)
    .select()

  const quotes: Schema.Quote[] = await db(tables.QUOTE)
    .select()

  // Attempt to find the original owner of a quote and assign a userId
  const queries: Knex.QueryBuilder[] = []
  for (const quote of quotes) {
    const owner = users.find(user => user.displayName.toLowerCase() === quote.createdBy.toLowerCase())
    if (!owner) {
      continue
    }

    queries.push(
      db(tables.QUOTE)
        .update('userId', owner.id)
        .where('id', quote.id)
    )
  }

  await Promise.all(queries)
}

export async function down(_: Knex) {
  throw new Error('Down migrations not supported')
}