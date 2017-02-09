import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { PageRequest } from '../paging'
import { StatusError } from '../error'
import currentUser from '../current-user'

const handler: RequestHandler = async (req: PageRequest, res, next) => {
  const { offset, pageSize } = req.paging

  const user = currentUser(req)
  if (!user) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  const accessLevel = user.accessLevel || AccessLevel.Contributor

  if (accessLevel === AccessLevel.Contributor) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  const quote: Schema.Quote = await db(QUOTE)
    .select()
    .where('approved', false)
    .orderBy('dateCreated', 'asc')
    .offset(offset)
    .limit(pageSize)

  res.json(quote)
}

export default handler