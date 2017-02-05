export default function map(quote: Schema.Quote, signedCookies: any) {
  const newQuote = { ...quote }
  if (signedCookies.authentication) {
    return quote
  }
  delete newQuote.approved
  return newQuote
}