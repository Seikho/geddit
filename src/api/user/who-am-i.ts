import { RequestHandler } from 'express'
import { StatusError } from '../error'
import currentUser from '../current-user'

const handler: RequestHandler = async (req, res, next) => {
  const user = currentUser(req)

  if (!user) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  res.json(user)
}

export default handler