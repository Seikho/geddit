import * as ko from 'knockout'
import * as fs from 'fs'

class LogoutVM {
  constructor() {
    this.logout()
  }

  logout = async () => {
    await fetch('/user/logout', { credentials: 'include' })
    window.history.pushState({}, 'Geddit.LOL', '/latest')
    window.dispatchEvent(new Event('push-state'))
    window.dispatchEvent(new Event('unauthenticated'))
  }
}

ko.components.register('ge-logout', {
  template: fs.readFileSync(`${__dirname}/logout.html`).toString(),
  viewModel: {
    createViewModel: () => new LogoutVM()
  }
})