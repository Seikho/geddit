import * as ko from 'knockout'
import * as fs from 'fs'
import { user } from '../../api'
import PagerVM from '../pager'

class UserListVM extends PagerVM<Schema.User> {
  accessLevels: Array<AccessLabel> = [
    [AccessLevel.Disabled, 'Disabled'],
    [AccessLevel.Contributor, 'Contributor'],
    [AccessLevel.Moderator, 'Moderator'],
    [AccessLevel.Administrator, 'Administrator']
  ]

  constructor() {
    super({
      page: 1,
      pageSize: 10,
      fetcher: (page, pageSize) => user.getMany(page, pageSize)
    })
  }

  getLabel = (accessLevel: AccessLevel) => {
    const label = this.accessLevels.find(level => level[0] === accessLevel) as AccessLabel
    return label[1]
  }
}

ko.components.register('ge-user-list', {
  template: fs.readFileSync(`${__dirname}/user-list.html`).toString(),
  viewModel: {
    createViewModel: () => new UserListVM()
  }
})

export default UserListVM

type AccessLabel = [AccessLevel, string]