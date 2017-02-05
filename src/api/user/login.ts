import compare from '../../auth/compare'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { USER } from '../../store'

const handler: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body

  const authError = new StatusError('Invalid login attempt. Incorrect username or password', 401)

  const user: Schema.User = await db(USER)
    .select()
    .where('username', username.toLowerCase())
    .first()

  if (!user) {
    return next(authError)
  }

  const isCorrectPassword = await compare(user.hashedPassword, password)
  if (!isCorrectPassword) {
    return next(authError)
  }

  res.cookie('authentication', { username, id: user.id }, { signed: true })

  res
    .status(200)
    .end()
}

export default handler