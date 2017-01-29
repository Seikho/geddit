import server from './server'
import logger from './logger'

const port = process.env.PORT || 7344
server.listen(port, () => {
  logger.log(`Listening on port ${port}`)
})