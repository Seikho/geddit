import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { PageRequest } from '../paging'
import toDto from './to-dto'

const handler: RequestHandler = async (req: PageRequest, res) => {
  const { page, pageSize } = req.paging
  const offset = (page * pageSize) - pageSize

  const quote: Schema.Quote[] = await db(QUOTE)
    .select()
    .where('approved', true)
    .orderBy('dateCreated', 'asc')
    .offset(offset)
    .limit(pageSize)

  res.json(quote.map(q => toDto(q, req.signedCookies)))
}

export default handler