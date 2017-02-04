import * as ko from 'knockout'
import * as fs from 'fs'

interface NavItem {
  name: string
  component: string
}

class BodyVM {
  navItems: KnockoutObservableArray<NavItem> = ko.observableArray([
    { name: 'latest', component: 'ge-quote-list' },
    { name: 'random', component: 'ge-random' },
    { name: 'top', component: 'ge-top' },
    { name: 'add quote', component: 'ge-add-quote' }
  ])

  currentItem = ko.observable<NavItem>(this.navItems()[0])
}

const viewModel = new BodyVM()

ko.components.register('ge-body', {
  template: fs.readFileSync(`${__dirname}/body.html`).toString(),
  viewModel: {
    createViewModel: () => viewModel
  }
})

export default viewModel