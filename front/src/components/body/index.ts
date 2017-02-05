import * as ko from 'knockout'
import * as fs from 'fs'

interface NavItem {
  name: string
  component: string
  paths: string[]
  url: string
  display: boolean
}

class BodyVM {
  navItems: KnockoutObservableArray<NavItem> = ko.observableArray([
    {
      name: 'latest',
      component: 'ge-quote-list',
      paths: ['/latest', '/',
        'index.html'],
      url: '/latest',
      display: true
    },
    {
      name: 'oldest',
      component: 'ge-quote-list',
      paths: ['/oldest'],
      url: '/oldest',
      display: true
    },
    {
      name: 'random',
      component: 'ge-quote-list',
      paths: ['/random'],
      url: '/random',
      display: true
    },
    {
      name: 'top',
      component: 'ge-quote-list',
      paths: ['/top'],
      url: '/top',
      display: true
    },
    {
      name: 'add quote',
      component: 'ge-add-quote',
      paths: ['/add-quote'],
      url: '/add-quote',
      display: true
    },
    {
      name: 'login',
      component: 'ge-login',
      paths: ['/login'],
      url: '/login',
      display: false
    },
    {
      name: 'logout',
      component: 'ge-logout',
      paths: ['/logout'],
      url: '/logout',
      display: false
    },
    {
      name: 'unapproved',
      component: 'ge-quote-list',
      paths: ['/unapproved'],
      url: '/unapproved',
      display: false
    }
  ])

  notFoundItem = { name: 'Not Found', component: 'ge-not-found', paths: [], url: '/not-found', display: false }
  currentItem = ko.observable<NavItem>(this.navItems()[0])
  isAuthenticated = ko.observable(false)

  constructor() {
    window.addEventListener('push-state', () => {
      this.navigate()
    })

    window.addEventListener('popstate', () => {
      this.navigate()
    })

    window.addEventListener('authenticated', () => {
      this.isAuthenticated(true)
    })

    window.addEventListener('unauthenticated', () => {
      this.isAuthenticated(false)
    })

    this.navigate()

    const cookies = document.cookie.split('; ')
    const hasAuthCookie = cookies.some(cookie => cookie.split('=')[0] === 'authentication')
    this.isAuthenticated(hasAuthCookie)
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