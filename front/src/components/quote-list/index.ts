import * as ko from 'knockout'
import * as fs from 'fs'
import * as quote from '../../api'

type Path =
  | '/latest'
  | '/oldest'
  | '/top'
  | '/random'

class QuoteListVM {

  quotes = ko.observableArray<Schema.Quote>([])

  constructor(public page: number = 1, public pageSize: number = 10) {
    this.getQuotes()
  }

  getQuotes = async () => {
    const path = window.location.pathname as Path
    const quotes = await quote.getMany(this.page, this.pageSize, path)
    this.quotes.destroyAll()
    for (const quote of quotes) {
      this.quotes.push(quote)
    }
  }

  nextPage = () => {
    this.page++
    this.getQuotes()
  }

  prevPage = () => {
    this.page--
    this.getQuotes()
  }
}

ko.components.register('ge-quote-list', {
  template: fs.readFileSync(`${__dirname}/quote-list.html`).toString(),
  viewModel: {
    createViewModel: () => new QuoteListVM()
  }
})

export default QuoteListVM