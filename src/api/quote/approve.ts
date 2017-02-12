import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import currentUser from '../current-user'

const handler: RequestHandler = async (req, res, next) => {
  const user = currentUser(req)

  if (!user) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  if (user.accessLevel < AccessLevel.Moderator) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  const id = req.params.id
  const status = req.params.status

  if (status !== 'allow' && status !== 'disallow') {
    return next()
  }

  const quote: Schema.Quote | undefined = await db(QUOTE)
    .select('id')
    .where('id', id)
    .first()

  if (!quote) {
    const error = new StatusError(`Quote '${id}' not found`, 404)
    next(error)
    return
  }

  if (status === 'disallow') {
    await db(QUOTE)
      .update('isDeleted', true)
      .where('id', id)
  } else {
    await db(QUOTE)
      .update('approved', true)
      .where('id', id)
  }

  res
    .status(200)
    .end()
}

export default handler