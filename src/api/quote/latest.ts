import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { PageRequest } from '../paging'
import toDto from './to-dto'

const handler: RequestHandler = async (req: PageRequest, res) => {
  const { offset, pageSize } = req.paging

  const quote: Schema.Quote[] = await db(QUOTE)
    .select()
    .where('approved', true)
    .orderBy('dateCreated', 'desc')
    .offset(offset)
    .limit(pageSize)

  res.json(quote.map(q => toDto(q, req.signedCookies)))
}

export default handler