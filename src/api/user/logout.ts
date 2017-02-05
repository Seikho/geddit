import { RequestHandler } from 'express'

const handler: RequestHandler = async (_, res) => {
  res.clearCookie('authentication')

  res
    .status(200)
    .end()
}

export default handler