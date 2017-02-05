import * as sec from 'bcrypt'

export default async function createHash(password: string): Promise<string> {
  const secret = await getSecret()
  const hashedPassword = await sec.hash(password, secret)
  return hashedPassword
}

async function getSecret() {
  return await sec.genSalt(10)
}
