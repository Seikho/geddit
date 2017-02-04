import * as ko from 'knockout'
import * as fs from 'fs'

interface NavItem {
  name: string
  component: string
}

class HeadVM {
  navItems: KnockoutObservableArray<NavItem> = ko.observableArray([
    { name: 'latest', component: 'ge-latest' },
    { name: 'random', component: 'ge-random' },
    { name: 'top', component: 'ge-top' },
    { name: 'add quote', component: 'ge-add-quote' }
  ])

  currentItem = ko.observable(this.navItems[0])
}

ko.components.register('ge-head', {
  template: fs.readFileSync(`${__dirname}/head.html`).toString(),
  viewModel: {
    createViewModel: () => new HeadVM()
  }
})