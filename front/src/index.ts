import 'whatwg-fetch'
import * as PromisePolyfill from 'promise-polyfill'

if (typeof Promise === 'undefined') {
  (window as any).Promise = PromisePolyfill
}

// Register all components
import './components'

// Bind components to view
import * as ko from 'knockout'
ko.applyBindings(document.body)