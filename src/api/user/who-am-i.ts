import { RequestHandler } from 'express'
import { StatusError } from '../error'

const handler: RequestHandler = async (req, res, next) => {
  const cookie = req.signedCookies['authentication']
  if (!cookie) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  res.json({ username: cookie.username })
}

export default handler