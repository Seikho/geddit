import * as ko from 'knockout'
import * as fs from 'fs'
import * as quote from '../../api'
import PagerVM from '../pager'

type Path =
  | '/latest'
  | '/oldest'
  | '/top'
  | '/random'

class QuoteListVM extends PagerVM<Schema.Quote> {
  constructor(page: number = 1, pageSize: number = 10) {
    super({
      page,
      pageSize,
      fetcher: async (page: number, pageSize: number) => {
        const path = window.location.pathname as Path
        const quotes = await quote.getMany(page, pageSize, path)
        return quotes
      }
    })
  }
}

ko.components.register('ge-quote-list', {
  template: fs.readFileSync(`${__dirname}/quote-list.html`).toString(),
  viewModel: {
    createViewModel: () => new QuoteListVM()
  }
})

export default QuoteListVM