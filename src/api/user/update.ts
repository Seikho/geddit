import currentUser from '../current-user'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import db, { USER } from '../../store'

type Body = {
  id: number
  accessLevel?: AccessLevel
  displayName?: string
}

const handler: RequestHandler = async (req, res, next) => {
  const authUser = currentUser(req) || {} as Cookie

  const isAuthorized = authUser.accessLevel === AccessLevel.Administrator
  if (!isAuthorized) {
    const error = new StatusError('Unauthorized [Not administrator]', 401)
    return next(error)
  }

  const body = validate(req.body)
  if (!body) {
    const error = new StatusError('No user id specified', 400)
    return next(error)
  }
  const { id, accessLevel, displayName } = body

  const isPromotingToAdmin = accessLevel !== undefined && accessLevel > AccessLevel.Moderator
  if (isPromotingToAdmin) {
    const error = new StatusError('Cannot promote users to administrator', 400)
    return next(error)
  }

  const isValidDisplayname = displayName !== undefined && displayName.length < 4
  if (isValidDisplayname) {
    const error = new StatusError('Display name must be 4 characters or more', 400)
    return next(error)
  }

  const user: Schema.User = await db(USER)
    .select()
    .where('id', id)

  const isSelf = id === authUser.id
  const isAdmin = user.accessLevel === AccessLevel.Administrator
  if (isAdmin && !isSelf) {
    const error = new StatusError('Cannot modify administrators that are not yourself', 400)
    return next(error)
  }

  const isModifyingOwnLevel = isSelf
    && accessLevel !== undefined
    && accessLevel !== user.accessLevel
  if (isModifyingOwnLevel) {
    const error = new StatusError('Cannot modify your own access level', 400)
    return next(error)
  }

  const query = db(USER)
    .where('id', id)

  if (displayName !== undefined) {
    query.update('displayName', displayName)
  }

  if (accessLevel !== undefined) {
    query.update('accessLevel', accessLevel)
  }

  await query

  res
    .status(200)
    .end()
}

function validate(params: Body) {
  const { id, accessLevel, displayName } = params
  if (!id) {
    return null
  }

  const validBody: Body = {
    id
  }

  if (typeof accessLevel === 'number') {
    validBody.accessLevel = accessLevel
  }

  if (typeof displayName === 'string') {
    validBody.displayName = displayName
  }

  return validBody
}

export default handler