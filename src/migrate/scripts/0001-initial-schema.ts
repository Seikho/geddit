import * as Knex from 'knex'
import * as tables from '../../store'

export async function up(db: Knex) {
  await db.schema.createTable(tables.QUOTE, table => {
    table.string('id').primary().index()
    table.dateTime('lastUpdated').index()
    table.dateTime('dateCreated').index()
    table.string('createdBy')
    table.string('quote')
  })

  await db.schema.createTable(tables.QUOTE_REVISION, table => {
    table.string('id').primary()
    table.dateTime('quoteId')
      .index()
      .references(`${tables.QUOTE}.id`)

    table.dateTime('revisionDate').index()
    table.string('updatedBy')
    table.string('quote')
  })
}

export async function down(_: Knex) {
  throw new Error('Down migrations not supported')
}