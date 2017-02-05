import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { PageRequest } from '../paging'

const handler: RequestHandler = async (req: PageRequest, res) => {
  const { page, pageSize } = req.paging
  const offset = (page * pageSize) - pageSize

  const quote: Schema.Quote = await db(QUOTE)
    .select()
    .where('approved', true)
    .orderBy('dateCreated', 'desc')
    .offset(offset)
    .limit(pageSize)

  // TODO: Use map to DTO prior to responding
  res.json(quote)
}

export default handler