import createHash from '../../auth/hash'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { USER } from '../../store'

const handler: RequestHandler = async (req, res, next) => {
  const { username, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    const error = new StatusError('Passwords do not match', 400)
    return next(error)
  }

  const user: Schema.User = await db(USER)
    .select()
    .where('username', username.toLowerCase())
    .first()

  if (user) {
    const error = new StatusError('User already exists', 400)
    return next(error)
  }

  const hashedPassword = await createHash(password)
  const newUser = {
    username: username.toLowerCase(),
    hashedPassword
  }

  await db(USER)
    .insert(newUser)

  res
    .status(200)
    .end()
}

export default handler