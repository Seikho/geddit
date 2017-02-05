import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import toDto from './to-dto'

const handler: RequestHandler = async (req, res) => {
  const quote: Schema.Quote[] = await db(QUOTE)
    .select()
    .where('approved', true)
    .orderByRaw('RANDOM()')
    .limit(10)

  res.json(quote.map(q => toDto(q, req.signedCookies)))
}

export default handler
