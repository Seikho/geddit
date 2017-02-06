import createHash from '../../auth/hash'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { USER } from '../../store'

const handler: RequestHandler = async (req, res, next) => {
  const authUser = req.signedCookies['authentication']
  if (authUser) {
    const error = new StatusError('Already logged in', 400)
    return next(error)
  }

  const { username, displayName, password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    const error = new StatusError('New passwords do not match', 400)
    return next(error)
  }

  if (!username) {
    const error = new StatusError('No username supplied', 400)
    return next(error)
  }

  if (!displayName) {
    const error = new StatusError('No username supplied', 400)
    return next(error)
  }

  if (username.length < 4) {
    const error = new StatusError('Username must be at least 4 characters', 400)
    return next(error)
  }

  if (displayName.length < 4) {
    const error = new StatusError('Display name must be at least 4 characters', 400)
    return next(error)
  }

  const users: Schema.User[] = await db(USER)
    .select()
    .where('username', username.toLowerCase())
    .orWhereRaw('LOWER(displayName) = ?', displayName.toLowerCase())

  const userExists = users.some(user => user.username === username.toLowerCase())
  const nameExists = users.some(user => user.username === username.toLowerCase())
  if (userExists && nameExists) {
    const error = new StatusError('Username and display name is already taken', 400)
    return next(error)
  }

  if (userExists) {
    const error = new StatusError('Username is already taken', 400)
    return next(error)
  }

  if (nameExists) {
    const error = new StatusError('Displayname is already taken', 400)
    return next(error)
  }

  const hashedPassword = await createHash(password)
  const newUser: Partial<Schema.User> = {
    username,
    displayName,
    hashedPassword,
    accessLevel: AccessLevel.Contributor
  }

  const ids: number[] = await db(USER)
    .insert(newUser)

  const cookie = {
    username,
    displayName,
    id: ids[0],
    accessLevel: AccessLevel.Contributor
  }

  res
    .cookie('authentication', cookie, { signed: true })
    .status(200)
    .end()
}

export default handler