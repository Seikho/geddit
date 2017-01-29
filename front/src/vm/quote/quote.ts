import * as ko from 'knockout'
import * as fs from 'fs'

class QuoteVM {
  id = ko.observable(0)
  createdBy = ko.observable('')
  dateCreated = ko.observable(new Date())
  lastUpdated = ko.observable(new Date())
  quote = ko.observableArray([])
  votes = ko.observable(0)

  quoteText = ko.computed(() => {
    return this
      .quote()
      .join('\n')
  })

  constructor(quote: Schema.Quote) {
    this.id(quote.id)
    this.createdBy(quote.createdBy)
    this.dateCreated(new Date(quote.dateCreated))
    this.lastUpdated(new Date(quote.lastUpdated))
    this.quote(JSON.parse(quote.quote))
    this.votes(quote.votes)
  }

  voteUp = async () => {
    await fetch(`/quote/${this.id}/up`)
  }

  voteDown = async () => {
    await fetch(`/quote/${this.id}/down`)
  }
}

ko.components.register('ge-quote', {
  template: fs.readFileSync(`${__dirname}/quote.html`).toString(),
  viewModel: QuoteVM
})

export default QuoteVM