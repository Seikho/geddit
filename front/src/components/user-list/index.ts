import * as ko from 'knockout'
import * as fs from 'fs'
import { user } from '../../api'
import PagerVM from '../pager'
import UserVM from '../user'

type AccessLabel = [AccessLevel, string]
type Sort = { field: keyof Schema.User, ascending: boolean }

class UserListVM extends PagerVM<UserVM> {
  accessLevels: Array<AccessLabel> = [
    [AccessLevel.Disabled, 'Disabled'],
    [AccessLevel.Contributor, 'Contributor'],
    [AccessLevel.Moderator, 'Moderator'],
    [AccessLevel.Administrator, 'Administrator']
  ]

  accessOptions = ko.observableArray([
    { title: 'Disabled', level: AccessLevel.Disabled },
    { title: 'Contributor', level: AccessLevel.Contributor },
    { title: 'Moderator', level: AccessLevel.Moderator }
  ])

  sortField = ko.observable<keyof Schema.User>('username')
  sortAsc = ko.observable(true)

  constructor() {
    super({
      page: 1,
      pageSize: 10,
      fetcher: async (page, pageSize) => {
        const res = await user.getMany(page, pageSize)
        if (res.status !== 200) {
          window.history.pushState({}, 'Geddit.LOL', '/latest')
          window.dispatchEvent(new Event('push-state'))
          return []
        }
        const rawUsers: Schema.User[] = await res.json()
        const users = rawUsers.map(user => new UserVM(user))
        return users
      }
    })
  }
  sortIcon = (field: keyof Schema.User) => ko.computed(() => {
    if (this.sortField() !== field) {
      return ''
    }
    return this.sortAsc() ? '▲' : '▼'
  })

  getLabel = (accessLevel: AccessLevel) => {
    const label = this.accessLevels.find(level => level[0] === accessLevel) as AccessLabel
    return label[1]
  }

  sortBy = (field: keyof Schema.User) => {
    if (field === this.sortField()) {
      this.sortAsc(!this.sortAsc())
    } else {
      this.sortField(field)
      this.sortAsc(true)
    }

    const ascending = this.sortAsc()

    this.content.sort((left: any, right: any) => {
      const leftField = ko.unwrap(left[field])
      const rightField = ko.unwrap(right[field])

      if (leftField === rightField) {
        return 0
      }

      const result = leftField > rightField ? 1 : -1
      return ascending ? result : result * -1
    })
  }
}

ko.components.register('ge-user-list', {
  template: fs.readFileSync(`${__dirname}/user-list.html`).toString(),
  viewModel: {
    createViewModel: () => new UserListVM()
  }
})

export default UserListVM
