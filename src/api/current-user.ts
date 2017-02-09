import { Request } from 'express'

export default function getCurrentUser(req: Request): Cookie | null {
  const authUser = req.signedCookies['authentication'] as Cookie | undefined
  return authUser || null
}