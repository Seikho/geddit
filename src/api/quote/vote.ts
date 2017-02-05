import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { StatusError } from '../error'

const handler: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  const direction = req.params.direction

  if (direction !== 'up' && direction !== 'down') {
    const error = new StatusError('Invalid vote cast', 400)
    return next(error)
  }

  const quote: Schema.Quote | undefined = await db(QUOTE)
    .select()
    .where('id', id)
    .andWhere('approved', true)
    .first()

  if (!quote) {
    const error = new StatusError(`Quote '${id}' not found`, 404)
    next(error)
    return
  }

  const change = direction === 'up' ? 1 : -1
  const votes = quote.votes + change

  await db(QUOTE)
    .update('votes', votes)
    .where('id', id)

  // TODO: Use map to DTO prior to responding
  quote.votes = votes
  res.json(quote)
}

export default handler