import * as sec from 'bcrypt'

export default async function compare(hash: string, password: string) {
  const result = await sec.compare(password, hash)
  return result
}