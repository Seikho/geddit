export default function map(quote: Schema.Quote, signedCookies: { authentication: Cookie }) {
  const newQuote = { ...quote }
  const auth = signedCookies.authentication
  if (!auth || auth.accessLevel < AccessLevel.Moderator) {
    delete newQuote.approved
    return newQuote
  }

  return quote
}