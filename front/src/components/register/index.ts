import * as ko from 'knockout'
import * as fs from 'fs'

class AccountVM {
  username = ko.observable('')
  displayName = ko.observable('')
  password = ko.observable('')
  confirmPassword = ko.observable('')
  message = ko.observable('')

  isPasswordValid = ko.computed(() => {
    return this.password().length > 0 && this.password() === this.confirmPassword()
  })

  isFormValid = ko.computed(() => {
    if (!this.isPasswordValid()) {
      return false
    }

    const validUsername = this.username().length > 3
    const validDisplayName = this.displayName().length > 3
    const validPassword = this.password().length > 5
    return validUsername && validDisplayName && validPassword
  })

  submit = async () => {
    if (!this.isPasswordValid()) {
      return
    }

    if (!this.isFormValid()) {
      return
    }

    this.message('Submitting...')

    const body = {
      username: this.username(),
      displayName: this.displayName(),
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

    const result = await fetch('/user/register', options as any)
    if (result.status === 200) {
      this.message('Successfully registered!')
      window.dispatchEvent(new Event('authenticated'))
      return
    }

    this.message(result.statusText)
  }
}

ko.components.register('ge-register', {
  template: fs.readFileSync(`${__dirname}/register.html`).toString(),
  viewModel: {
    createViewModel: () => new AccountVM()
  }
})