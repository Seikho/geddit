import * as ko from 'knockout'
import * as fs from 'fs'
import * as store from '../../store'

interface Params {
  quote?: Schema.Quote & Object
}

class QuoteVM {
  isLoading = ko.observable(false)
  id = ko.observable(0)
  createdBy = ko.observable('')
  dateCreated = ko.observable(new Date())
  lastUpdated = ko.observable(new Date())
  quote = ko.observableArray([])
  votes = ko.observable(0)
  isDeleted = ko.observable(false)
  isApprovable = ko.observable(false)
  isApproved = ko.observable(true)
  hideQuote = ko.observable(false)

  byline = ko.computed(() => {
    const by = this.createdBy()
    const submitted = new Date(this.dateCreated()).toUTCString().slice(4, 46)
    return `Submitted by ${by} at ${submitted}`
  })

  quoteText = ko.computed(() => {
    return this
      .quote()
      .join('\n')
  })

  voteColor = ko.computed(() => {
    if (this.votes() === 0) {
      return 'black'
    }
    return this.votes() > 0 ? 'green' : 'red'
  })

  voteText = ko.computed(() => {
    if (this.votes() === 0) {
      return '0'
    }

    return this.votes() > 0 ? `+${this.votes()}` : `${this.votes()}`
  })

  constructor(params: Params = {}) {
    const quote = params.quote
    if (!quote) {
      this.fetchQuote()
      return
    }
    this.loadQuote(quote)
  }

  voteUp = async () => {
    if (this.getVoteState() === Voted.Up) {
      return
    }
    this.castVote('up')
  }

  voteDown = async () => {
    if (this.getVoteState() === Voted.Down) {
      return
    }
    this.castVote('down')
  }

  castVote = async (kind: 'up' | 'down') => {
    if (kind !== 'up' && kind !== 'down') {
      return
    }

    const adjustment = kind === 'up' ? 1 : -1
    const result = await fetch(`/quote/${this.id()}/${kind}`, { method: 'PUT', credentials: 'include' })
    if (result.status !== 200) {
      return
    }
    this.votes(this.votes() + adjustment)
    store.set(this.getVoteKey(), kind)
  }

  allow = () => {
    return this.setAllowed('allow')
  }

  disallow = async () => {
    return this.setAllowed('disallow')
  }

  setAllowed = async (kind: 'allow' | 'disallow') => {
    const url = `/quote/${this.id()}/${kind}`
    const result = await fetch(url, { method: 'PUT', credentials: 'include' })
    if (result.status === 200) {
      this.hideQuote(true)
    }
  }

  getVoteState(): Voted {
    const storedState: VoteState = store.get(`voteState_${this.id()}`)
    switch (storedState) {
      case 'up':
        return Voted.Up
      case 'down':
        return Voted.Down
      default:
        return Voted.None
    }
  }

  getVoteKey(): string {
    return `voteState_${this.id()}`
  }

  loadQuote = (quote: Schema.Quote) => {
    this.isLoading(false)
    this.id(quote.id)
    this.createdBy(quote.createdBy)
    this.dateCreated(new Date(quote.dateCreated))
    this.lastUpdated(new Date(quote.lastUpdated))
    this.quote(JSON.parse(quote.quote))
    this.votes(quote.votes)
    this.isDeleted(quote.isDeleted)
    this.isApprovable(quote.hasOwnProperty('approved'))
    this.isApproved(quote.hasOwnProperty('approved') && quote.approved)
  }

  fetchQuote = async () => {
    this.isLoading(true)
    const quoteId = window.location.pathname.replace('/quote/', '')
    if (!quoteId) {
      return
    }

    const isNumber = !isNaN(parseInt(quoteId, 10))
    if (!isNumber) {
      return
    }

    const res = await fetch(window.location.pathname, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    })

    if (res.status === 404) {
      this.isLoading(false)
      return
    }

    const quote = await res.json()
    this.loadQuote(quote)
  }
}

type VoteState = 'up' | 'down' | null

const enum Voted {
  None,
  Up,
  Down
}

ko.components.register('ge-quote', {
  template: fs.readFileSync(`${__dirname}/quote.html`).toString(),
  viewModel: QuoteVM
})

export default QuoteVM