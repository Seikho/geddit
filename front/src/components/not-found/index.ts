import * as ko from 'knockout'
import * as fs from 'fs'

ko.components.register('ge-not-found', {
  template: fs.readFileSync(`${__dirname}/not-found.html`).toString()
})