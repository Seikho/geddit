import * as ko from 'knockout'
import * as fs from 'fs'
import { user } from '../../api'
import PagerVM from '../pager'

class UserListVM extends PagerVM<Schema.User> {
  constructor() {
    super({
      page: 1,
      pageSize: 10,
      fetcher: (page, pageSize) => user.getMany(page, pageSize)
    })
  }
}

ko.components.register('ge-user-list', {
  template: fs.readFileSync(`${__dirname}/users.html`).toString(),
  viewModel: {
    createViewModel: () => new UserListVM()
  }
})

export default UserListVM