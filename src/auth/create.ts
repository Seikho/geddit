/**
 * Intended to be used on the command line to help instantiate a user
 */

import * as process from 'process'
import hash from './hash'
import db, { USER } from '../store'

const username = (process.argv[2] || '').toLowerCase()
const password = process.argv[3]

async function createUser() {
  if (!username) {
    console.log('No username provided') // tslint:disable-line
    process.exit(1)
  }

  if (!password) {
    console.log('No password provided') // tslint:disable-line
    process.exit(1)
  }

  const user: Schema.User = await db(USER)
    .select()
    .where('username', username)
    .first()

  if (user) {
    console.log('Username already exists') // tslint:disable-line
    process.exit(1)
  }

  const hashedPassword = await hash(password)

  await db(USER)
  .insert({ username, hashedPassword })

  console.log(`User '${username}' successfully created`) // tslint:disable-line
  process.exit(0)
}

createUser()