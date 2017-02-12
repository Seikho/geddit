import * as express from 'express'
import * as compression from 'compression'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as cookieSession from 'cookie-session'
import * as cookieParser from 'cookie-parser'
import * as fs from 'fs'
import api from './api'
import errorHandler from './error-handler'

const app = express()
const staticPath = path.resolve(__dirname, '..', 'front')
app.use(compression())

// Use signed cookies
app.set('trust proxy', 1)
try {
  const secret = fs.readFileSync('session.secret').toString()
  app.use(cookieParser(secret))
  app.use(cookieSession({
    name: 'session',
    keys: [secret],
    signed: true,
    maxAge: (24 * 60 * 60 * 1000) * 365 // 365 days
  } as any))
} catch (ex) {
  console.log(`Please create a 'session.secret' file and restart the server`) // tslint:disable-line
  process.exit(-1)
}

app.use(bodyParser.json())

const frontEndRoutes = [
  '/oldest',
  '/latest',
  '/random',
  '/top',
  '/add-quote',
  '/login',
  '/logout',
  '/unapproved',
  '/my-account',
  '/mine',
  '/users'
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