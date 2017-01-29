import * as express from 'express'
import { StatusError } from './api/error'
import api from './api'
import errorHandler from './error-handler'

const app = express()

app.use('/', api)
app.use(express.static('front'))

app.use('/', (_, __, next) => {
  const error = new StatusError('Resource not found', 404)
  next(error)
  return
})

app.use(errorHandler)

export default app