import * as ko from 'knockout'
import * as fs from 'fs'

ko.components.register('ge-body', {
  template: fs.readFileSync(`${__dirname}/body.html`).toString()
})