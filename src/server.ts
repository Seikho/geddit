import * as express from 'express'
import * as compression from 'compression'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import api from './api'
import errorHandler from './error-handler'

const app = express()
const staticPath = path.resolve(__dirname, '..', 'front')

app.use(bodyParser.json())
app.use(compression())

const frontEndRoutes = [
  '/oldest',
  '/latest',
  '/random',
  '/top',
  '/add-quote'
]

for (const route of frontEndRoutes) {
  app.use(route, (_, res) => res.sendFile(path.resolve(staticPath, 'index.html')))
}

// API routes
app.use('/', api)

// Static assets
app.use(express.static(staticPath))

// 404 handler
app.use('/', (_, res) => {
  res.status(404)
  res.sendFile(path.resolve(staticPath, 'index.html'))
  return
})

app.use(errorHandler)

export default app