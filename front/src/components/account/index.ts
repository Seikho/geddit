import * as ko from 'knockout'
import * as fs from 'fs'

class AccountVM {
  username = ko.observable('')
  oldPassword = ko.observable('')
  password = ko.observable('')
  confirmPassword = ko.observable('')
  message = ko.observable('')

  isPasswordValid = ko.computed(() => {
    return this.password().length > 0 && this.password() === this.confirmPassword()
  })

  constructor() {
    this.whoAmI()
  }

  whoAmI = async () => {
    const result = await fetch('/user/who-am-i', { credentials: 'include' })
    if (result.status === 200) {
      const json = await result.json()
      this.username(json.username)
    }
  }

  submit = async () => {
    if (!this.isPasswordValid()) {
      return
    }
    const body = {
      oldPassword: this.oldPassword(),
      password: this.password(),
      confirmPassword: this.confirmPassword()
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }

    const result = await fetch('/user/change-password', options as any)
    if (result.status === 200) {
      this.message('Password successfully updated')
      return
    }

    this.message(result.statusText)
  }
}

ko.components.register('ge-account', {
  template: fs.readFileSync(`${__dirname}/account.html`).toString(),
  viewModel: {
    createViewModel: () => new AccountVM()
  }
})