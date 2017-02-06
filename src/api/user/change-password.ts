import compare from '../../auth/compare'
import createHash from '../../auth/hash'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { USER } from '../../store'

const handler: RequestHandler = async (req, res, next) => {
  const authUser: Cookie = req.signedCookies['authentication']
  if (!authUser) {
    const error = new StatusError('Not logged in', 401)
    return next(error)
  }

  const username = authUser.username
  const { oldPassword, password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    const error = new StatusError('New passwords do not match', 400)
    return next(error)
  }

  const authError = new StatusError('Invalid password change attempt. Incorrect password', 401)

  const user: Schema.User = await db(USER)
    .select()
    .where('username', username.toLowerCase())
    .first()

  if (!user) {
    return next(authError)
  }

  const isCorrectPassword = await compare(user.hashedPassword, oldPassword)
  if (!isCorrectPassword) {
    return next(authError)
  }

  const hashedPassword = await createHash(password)
  await db(USER)
    .update('hashedPassword', hashedPassword)
    .where('username', username)

  res
    .status(200)
    .end()
}

export default handler