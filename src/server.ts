import * as express from 'express'
import api from './api'
import errorHandler from './error-handler'

const app = express()

app.use('/', api)
app.use(express.static('front'))
app.use(errorHandler)

export default app