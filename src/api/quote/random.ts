import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'

const handler: RequestHandler = async (_, res) => {
  const quote: Schema.Quote = await db(QUOTE)
    .select()
    .orderByRaw('RANDOM()')
    .limit(10)

  // TODO: Use map to DTO prior to responding
  res.json(quote)
}

export default handler
