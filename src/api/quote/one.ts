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
  <meta property="og:image" content="http://www.geddit.lol/assets/1k-team-small.png" />
  <meta property="og:image:width" content="64" />
  <meta property="og:image:height" content="64" />
  <meta property="og:description" content="${lines.join(' | ')}" />
</head>

<body>
  <ge-body>
  </ge-body>
  <script src= "/bundle.js" defer> </script>
  <script defer>
    (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
      m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-61186849-3', 'auto');
    ga('send', 'pageview');

  </script>
</body>

</html>`
}