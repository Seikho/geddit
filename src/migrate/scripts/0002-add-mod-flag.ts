import * as Knex from 'knex'
import * as tables from '../../store'

/**
 * Add isModerator and displayName fields to User table
 */

export async function up(db: Knex) {
  await db.schema.table(tables.USER, table => {
    table.integer('accessLevel').nullable()
    table.string('displayName').nullable()
  })

  const users: Schema.User[] = await db(tables.USER)
    .select()

  // All existing users are administrators
  // So default the new field isModerator field 'true' for all existing users
  const queries = users.map(user => db(tables.USER)
    .update({
      displayName: user.username,
      accessLevel: AccessLevel.Administrator
    }))

  await Promise.all(queries)
}

export async function down(_: Knex) {
  throw new Error('Down migrations not supported')
}