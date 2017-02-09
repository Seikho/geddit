import store, { USER } from '../../store'
import currentUser from '../current-user'
import { RequestHandler } from 'express'
import { StatusError } from '../error'

const handler: RequestHandler = async (req, res, next) => {
  const authUser = currentUser(req)
  if (!authUser) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  const users: Schema.User = await store(USER)
    .select()
    .where('accessLevel', '<', AccessLevel.Administrator)

  res.json(users)
}

export default handler