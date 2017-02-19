import * as ko from 'knockout'
import * as fs from 'fs'

interface NavItem {
  name: string | KnockoutObservable<string>
  component: string
  paths: Array<string | RegExp>
  url: string
  display: boolean | KnockoutObservable<boolean>
}

class BodyVM {
  cookie = ko.observable<{ id?: number, username?: string, accessLevel?: AccessLevel, displayName?: string }>({})

  isAuthenticated = ko.computed(() => {
    return this.cookie().username !== undefined
  })

  isAdmin = ko.computed(() => {
    return this.cookie().accessLevel === AccessLevel.Administrator
  })

  canModerate = ko.computed(() => {
    return this.cookie().accessLevel > AccessLevel.Contributor
  })

  leftNavItems: KnockoutObservableArray<NavItem> = ko.observableArray([
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
      name: 'my quotes',
      component: 'ge-quote-list',
      paths: ['/mine'],
      url: '/mine',
      display: this.isAuthenticated
    },
    {
      name: 'add quote',
      component: 'ge-add-quote',
      paths: ['/add-quote'],
      url: '/add-quote',
      display: this.isAuthenticated
    },
    {
      name: 'single quote',
      component: 'ge-quote',
      paths: [/\/quote\/[0-9]+/],
      url: '/quote',
      display: false
    }
  ])

  rightNavItems = ko.observableArray([
    {
      name: 'login',
      component: 'ge-login',
      paths: ['/login'],
      url: '/login',
      display: ko.computed(() => !this.isAuthenticated())
    },
    {
      name: 'users',
      component: 'ge-user-list',
      paths: ['/users'],
      url: '/users',
      display: this.isAdmin
    },
    {
      name: 'unapproved',
      component: 'ge-quote-list',
      paths: ['/unapproved'],
      url: '/unapproved',
      display: this.canModerate
    },
    {
      name: ko.computed(() => this.cookie().displayName || 'my account'),
      component: 'ge-account',
      paths: ['/my-account'],
      url: '/my-account',
      display: this.isAuthenticated
    },
    {
      name: 'logout',
      component: 'ge-logout',
      paths: ['/logout'],
      url: '/logout',
      display: this.isAuthenticated
    },
    {
      name: 'register',
      component: 'ge-register',
      paths: ['/register'],
      url: '/register',
      display: false
    }
  ])

  allNavItems = ko.computed(() => [
    ...this.leftNavItems(),
    ...this.rightNavItems()
  ])

  notFoundItem = { name: 'Not Found', component: 'ge-not-found', paths: [], url: '/not-found', display: false }
  currentItem = ko.observable<NavItem>(this.leftNavItems()[0])

  constructor() {
    window.addEventListener('push-state', () => {
      this.navigate()
    })

    window.addEventListener('popstate', () => {
      this.navigate()
    })

    window.addEventListener('authenticated', () => {
      this.setCookie()
    })

    window.addEventListener('unauthenticated', () => {
      this.setCookie()
    })

    this.navigate()
    this.setCookie()
  }

  setCookie = () => {
    // Don't ask
    const cookie = document.cookie
      .split('; ')
      .map(cookie => decodeURIComponent(cookie))
      .filter(cookie => cookie.indexOf('authentication=s:j:') > -1)
      .map(cookie => cookie.split('authentication=s:j:')[1])
      .map(cookie => cookie.split('.')[0])
      .map(cookie => {
        try {
          return JSON.parse(cookie)
        } catch (ex) {
          return {}
        }
      })[0]

    this.cookie(cookie || {})
  }

  navigate = () => {
    const path = window.location.pathname
    const navItem = this
      .allNavItems()
      .find(item => item.paths.some(p => {
        if (typeof p === 'string') {
          return p === path
        }

        return path
          .split(p)
          .filter(match => !!match)
          .length === 0
      }))
    if (navItem) {
      if (typeof ga === 'function') {
        ga('send', {
          hitType: 'pageview',
          location: window.location.pathname
        })
      }
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