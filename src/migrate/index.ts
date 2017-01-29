import store from '../store'
import * as path from 'path'
import * as Knex from 'knex'
import logger from '../logger'

export async function migrate(config: { knex?: Knex } = {}) {
  const db = config.knex || store
  const directory = path.resolve(__dirname, 'scripts')

  const startMigration = await db.migrate.currentVersion()
  logger.log(`Current migration: ${startMigration}`)

  await db.migrate.latest({ directory })

  const endMigration = await db.migrate.currentVersion()
  logger.log(`Migrated to: ${endMigration}`)
}