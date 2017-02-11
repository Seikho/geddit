import * as ko from 'knockout'
import * as fs from 'fs'
import { quote } from '../../api'
import PagerVM from '../pager'

type Path =
  | '/latest'
  | '/oldest'
  | '/top'
  | '/random'
  | '/mine'

interface Params {
  page?: number
  pageSize?: number
  path?: string
}

class QuoteListVM extends PagerVM<Schema.Quote> {
  constructor({ page= 1, pageSize = 10, path }: Params = {}) {
    super({
      page,
      pageSize,
      fetcher: (page, pageSize) => quote.getMany(page, pageSize, path || window.location.pathname as Path)
    })
  }
}

ko.components.register('ge-quote-list', {
  template: fs.readFileSync(`${__dirname}/quote-list.html`).toString(),
  viewModel: {
    createViewModel: (params: Params) => new QuoteListVM(params)
  }
})

export default QuoteListVM