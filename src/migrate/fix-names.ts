import store from '../store'

type Migration = {
  id: number
  name: string
  batch: number
  migration_time: number
}

export async function fixMigrationNames() {
  const migrations: Migration[] = await store('knex_migrations').select()

  for (const migrate of migrations) {
    const newName = migrate.name.replace('.js', '.ts')
    await store('knex_migrations')
      .update('name', newName)
      .where('id', migrate.id)

    // tslint:disable-next-line:no-console
    console.log(`Renamed '${migrate.name}' to '${newName}'`)
  }

  // tslint:disable-next-line:no-console
  console.log('Migrations successfully renamed')
  process.exit(0)
}

fixMigrationNames()