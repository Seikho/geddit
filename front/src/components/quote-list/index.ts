import * as ko from 'knockout'
import QuoteVM from '../quote'
import * as fs from 'fs'
import { quote } from '../../api'

class QuoteListVM {

  quotes = ko.observableArray<QuoteVM>([])

  constructor(public page: number = 1, public pageSize: number = 10) {
    this.getQuotes()
  }

  getQuotes = async () => {
    const quotes = await quote.getMany(this.page, this.pageSize)
    this.quotes.destroyAll()
    for (const quote of quotes) {
      this.quotes.push(new QuoteVM(quote))
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