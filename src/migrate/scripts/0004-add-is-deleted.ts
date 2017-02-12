import * as Knex from 'knex'
import { QUOTE } from '../../store'

export async function up(db: Knex) {
  await db.schema.table(QUOTE, table => {
    table.boolean('isDeleted').nullable().index()
  })

  await db(QUOTE)
    .update('isDeleted', false)
}

export async function down(_: Knex) {
  throw new Error('Down migrations not supported')
}