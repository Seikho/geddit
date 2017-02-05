import * as ko from 'knockout'
import * as fs from 'fs'

interface NavItem {
  name: string
  component: string
  paths: string[]
  url: string
}

class BodyVM {
  navItems: KnockoutObservableArray<NavItem> = ko.observableArray([
    { name: 'latest', component: 'ge-quote-list', paths: ['/latest', '/', 'index.html'], url: '/latest' },
    { name: 'oldest', component: 'ge-quote-list', paths: ['/oldest'], url: '/oldest' },
    { name: 'random', component: 'ge-quote-list', paths: ['/random'], url: '/random' },
    { name: 'top', component: 'ge-quote-list', paths: ['/top'], url: '/top' },
    { name: 'add quote', component: 'ge-add-quote', paths: ['/add-quote'], url: '/add-quote' }
  ])

  notFoundItem = { name: 'Not Found', component: 'ge-not-found', paths: [], url: '/not-found' }
  currentItem = ko.observable<NavItem>(this.navItems()[0])

  constructor() {
    window.addEventListener('push-state', () => {
      this.navigate()
    })

    window.addEventListener('popstate', () => {
      this.navigate()
    })

    this.navigate()
  }

  navigate = () => {
    const path = window.location.pathname
    const navItem = this
      .navItems()
      .find(item => item.paths.some(p => p === path))
    if (navItem) {
      this.currentItem(navItem)
      return
    }

    this.currentItem(this.notFoundItem)
  }
}

const viewModel = new BodyVM()

ko.components.register('ge-body', {
  template: fs.readFileSync(`${__dirname}/body.html`).toString(),
  viewModel: {
    createViewModel: () => viewModel
  }
})

export default viewModel