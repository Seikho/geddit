import * as ko from 'knockout'
import * as fs from 'fs'

class LoginVM {
  username = ko.observable('')
  password = ko.observable('')
  isSubmitting = ko.observable(false)
  error = ko.observable('')

  canSubmit = ko.computed(() => {
    const canSubmit = !this.isSubmitting()
    return canSubmit
  })

  submit = async () => {
    if (!this.canSubmit()) {
      return
    }

    this.isSubmitting(true)

    const body = {
      username: this.username(),
      password: this.password()
    }

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include' as 'include',
      body: JSON.stringify(body)
    }

    const result = await fetch('/user/login', options)
    this.isSubmitting(false)
    if (result.status === 200) {
      window.history.pushState({}, 'Geddit.LOL', '/unapproved')
      window.dispatchEvent(new Event('push-state'))
      return
    }

    this.error(result.statusText)
  }
}

ko.components.register('ge-login', {
  template: fs.readFileSync(`${__dirname}/login.html`).toString(),
  viewModel: {
    createViewModel: () => new LoginVM()
  }
})