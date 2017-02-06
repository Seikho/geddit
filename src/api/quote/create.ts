import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { QUOTE } from '../../store'

type Body = {
  quote: string
}

const handler: RequestHandler = async (req, res, next) => {
  const authUser: Cookie = req.signedCookies['authentication']
  if (!authUser) {
    const error = new StatusError('Unauthorized', 401)
    return next(error)
  }

  const { quote } = req.body as Body
  if (!isValidBody(req.body)) {
    const error = new StatusError('Invalid quote body supplied', 400)
    return next(error)
  }

  const date = new Date().toISOString()
  const votes = 0

  const record: Partial<Schema.Quote> = {
    createdBy: authUser.displayName,
    lastUpdated: date,
    dateCreated: date,
    votes,
    quote,
    approved: authUser.accessLevel > AccessLevel.Contributor
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
    return true
  } catch (ex) {
    return false
  }
}