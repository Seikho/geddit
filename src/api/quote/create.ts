import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { QUOTE } from '../../store'

type Body = {
  quote: string
  createdBy: string
}

const handler: RequestHandler = async (req, res, next) => {
  const isAuthed = req.signedCookies['authentication'] !== undefined
  const { quote, createdBy } = req.body as Body
  if (!isValidBody(req.body)) {
    const error = new StatusError('Invalid quote body supplied', 400)
    return next(error)
  }

  const date = new Date().toISOString()
  const votes = 0

  const record: Partial<Schema.Quote> = {
    createdBy,
    lastUpdated: date,
    dateCreated: date,
    votes,
    quote,
    approved: isAuthed
  }

  await db(QUOTE)
    .insert(record)

  res
    .status(200)
    .end()
}

export default handler

function isValidBody(body: Body): boolean {
  try {
    const result = JSON.parse(body.quote)
    if (!Array.isArray(result)) {
      return false
    }

    if (typeof body.createdBy !== 'string') {
      return false
    }

    const isAllStrings = result.every(r => typeof r === 'string')
    if (!isAllStrings) {
      return false
    }

    return true
  } catch (ex) {
    return false
  }
}