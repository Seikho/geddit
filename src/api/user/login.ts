import compare from '../../auth/compare'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { USER } from '../../store'
import currentUser from '../current-user'

const handler: RequestHandler = async (req, res, next) => {
  const authUser = currentUser(req)
  if (authUser) {
    const error = new StatusError('Not logged in', 401)
    return next(error)
  }

  if (authUser) {
    const error = new StatusError('Already logged in', 400)
    return next(error)
  }

  const { username, password } = req.body

  const authError = new StatusError('Invalid login attempt. Incorrect username or password', 401)

  const user: Schema.User = await db(USER)
    .select()
    .where('username', username.toLowerCase())
    .first()

  if (user.accessLevel === AccessLevel.Disabled) {
    return next(authError)
  }

  if (!user) {
    return next(authError)
  }

  const isCorrectPassword = await compare(user.hashedPassword, password)
  if (!isCorrectPassword) {
    return next(authError)
  }
  const cookie = {
    username,
    displayName: user.displayName,
    id: user.id,
    accessLevel: user.accessLevel
  }
  res.cookie('authentication', cookie, { signed: true })

  res
    .status(200)
    .end()
}

export default handler