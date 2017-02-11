import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { PageRequest } from '../paging'
import currentUser from '../current-user'
import { StatusError } from '../error'

const handler: RequestHandler = async (req: PageRequest, res, next) => {
  const authUser = currentUser(req)
  if (!authUser) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  const { offset, pageSize } = req.paging

  const quotes: Schema.Quote[] = await db(QUOTE)
    .select()
    .where('approved', true)
    .andWhere('userId', authUser.id)
    .orderBy('dateCreated', 'desc')
    .offset(offset)
    .limit(pageSize)

  res.json(quotes)
}

export default handler