import * as ko from 'knockout'
import * as fs from 'fs'
import * as quote from '../../api'

type Path =
  | '/latest'
  | '/oldest'
  | '/top'
  | '/random'

class QuoteListVM {
  page = ko.observable(0)
  pageSize = ko.observable(10)
  quotes = ko.observableArray<Schema.Quote>([])
  canNext = ko.observable(false)

  constructor(page: number = 1, pageSize: number = 10) {
    this.page(page)
    this.pageSize(pageSize)
    this.getQuotes()

    // Ensure the pageSize is always valid
    this.pageSize.subscribe(size => {
      if (isNaN(parseInt(size as any, 10))) {
        this.pageSize(10)

        return
      }

      if (size > 100) {
        this.pageSize(100)
        this.getQuotes()
        return
      }

      if (size < 1) {
        this.pageSize(1)
        this.getQuotes()
      }
      this.getQuotes()
    })
  }

  getQuotes = async () => {
    const path = window.location.pathname as Path
    const quotes = await quote.getMany(this.page(), this.pageSize() + 1, path)
    this.canNext(quotes.length > this.pageSize())
    this.quotes.destroyAll()
    for (const quote of quotes) {
      this.quotes.push(quote)
    }
  }

  nextPage = () => {
    this.page(this.page() + 1)
    this.getQuotes()
  }

  prevPage = () => {
    this.page(this.page() - 1)
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