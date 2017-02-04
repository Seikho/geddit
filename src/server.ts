import * as express from 'express'
import * as compression from 'compression'
import * as path from 'path'
import { StatusError } from './api/error'
import api from './api'
import errorHandler from './error-handler'

const app = express()
const staticPath = path.resolve(__dirname, '..', 'front')

app.use('/', api)
app.use(compression())
app.use(express.static(staticPath))
app.use('/', (_, __, next) => {
  const error = new StatusError('Resource not found', 404)
  next(error)
  return
})

app.use(errorHandler)

export default app