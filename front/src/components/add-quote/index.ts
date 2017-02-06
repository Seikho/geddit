import * as ko from 'knockout'
import * as fs from 'fs'

class AddQuoteVM {
  quote = ko.observable('')
  isSubmitting = ko.observable(false)

  isValidQuote = ko.computed(() => {
    const rawQuote = this.quote()

    if (rawQuote.length < 10) {
      return false
    }

    try {
      const quote = rawQuote.split('\n')
      if (!Array.isArray(quote)) {
        return false
      }

      return true
    } catch (ex) {
      return false
    }
  })

  canSubmit = ko.computed(() => {
    const isValid = this.isValidQuote()
    const canSubmit = !this.isSubmitting()
    return isValid && canSubmit
  })

  submit = async () => {
    if (!this.isValidQuote()) {
      return
    }

    if (!this.canSubmit()) {
      return
    }

    this.isSubmitting(true)

    const body = {
      quote: JSON.stringify(this.quote().split('\n'))
    }

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'include'
    }

    await fetch('/quote', options as any)
    this.isSubmitting(false)
    this.quote('')
  }
}

ko.components.register('ge-add-quote', {
  template: fs.readFileSync(`${__dirname}/add-quote.html`).toString(),
  viewModel: {
    createViewModel: () => new AddQuoteVM()
  }
})