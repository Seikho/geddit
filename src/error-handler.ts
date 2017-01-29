import { ErrorRequestHandler } from 'express'
import { StatusError } from './api/error'
import logger from './logger'

const isProduction = process.env.NODE_ENV === 'production'

const handler: ErrorRequestHandler = (error: Error | StatusError | any, _, res) => {
  if (error instanceof StatusError) {
    res
      .status(error.code)
      .json({ message: error.message })

    logger.error(error.message)
    logger.error(error.stack)
    return
  }

  if (error instanceof Error) {
    const errorObject = isProduction
      ? { message: error.message }
      : { message: error.message, stack: error.stack }
    res
      .status(500)
      .json(errorObject)

    logger.error(error.message)
    logger.error(error.stack)
    return
  }

  res
    .status(500)
    .json({ message: 'Internal Server Error' })

  logger.error('Unexpected error occurred:')
  logger.error(JSON.stringify(error, null, 2))
}

export default handler