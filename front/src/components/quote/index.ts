import * as ko from 'knockout'
import * as fs from 'fs'
import * as store from '../../store'

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
    if (this.getVoteState() === Voted.Up) {
      return
    }

    await fetch(`/quote/${this.id}/up`)
    this.votes(this.votes() + 1)
    store.set(this.getVoteKey(), 'up')
  }

  voteDown = async () => {
    if (this.getVoteState() === Voted.Down) {
      return
    }

    await fetch(`/quote/${this.id}/down`)
    this.votes(this.votes() - 1)
    store.set(this.getVoteKey(), 'down')
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