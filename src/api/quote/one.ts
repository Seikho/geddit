import db, { QUOTE } from '../../store'
import { RequestHandler } from 'express'
import { StatusError } from '../error'
import toDto from './to-dto'

const handler: RequestHandler = async (req, res, next) => {
  const accept = req.headers['accept']
  const id = req.params.id

  const quote: Schema.Quote | undefined = await db(QUOTE)
    .select()
    .where('id', id)
    .andWhere('approved', true)
    .first()

  if (!quote) {
    const error = new StatusError(`Quote '${id}' not found`, 404)
    next(error)
    return
  }

  if (accept !== 'application/json') {
    res.write(createQuoteHtml(quote))
    res.end()
    return
  }

  res.json(toDto(quote, req.signedCookies))
}

export default handler

function createQuoteHtml(quote: Schema.Quote) {
  const lines: string[] = JSON.parse(quote.quote)
  return `
<!DOCTYPE html>
<html>

<head>
  <title>Geddit ? LOL </title>
  <link href= "/assets/spectre.min.css" rel= "stylesheet" />
  <meta property="og:title" content="Geddit? Lol!" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="http://www.geddit.lol/quote/${quote.id}" />
  <meta property="og:image" content="http://www.geddit.lol/assets/1k-team.png" />
  <meta property="og:description" content="${lines.join(' | ')}" />
</head>

<body>
  <ge-body>
  </ge-body>
  <script src= "/bundle.js" defer> </script>
</body>

</html>`
}