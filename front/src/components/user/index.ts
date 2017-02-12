import * as ko from 'knockout'

class UserVM {
  id = ko.observable(0)
  username = ko.observable('')
  displayName = ko.observable('')
  accessLevel = ko.observable(AccessLevel.Contributor)
  originalUser = ko.observable({
    id: 0,
    username: '',
    displayName: '',
    accessLevel: 0
  })

  isModified = ko.computed(() => {
    const original = this.originalUser()
    const nameChanged = this.displayName() !== original.displayName
    const levelChanged = this.accessLevel() !== original.accessLevel
    return nameChanged || levelChanged
  })

  constructor(private user: Schema.User) {
    this.id(user.id)
    this.username(user.username)
    this.displayName(user.displayName)
    this.accessLevel(user.accessLevel)
    this.originalUser(user)
  }

  save = async () => {
    if (!this.isModified()) {
      return
    }

    const body = {
      id: this.user.id,
      displayName: this.displayName(),
      accessLevel: this.accessLevel()
    }

    const result = await fetch('/user/update', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (result.status !== 200) {
      // TODO: Notify of failure to save
      return
    }

    const original = this.originalUser()
    original.accessLevel = body.accessLevel
    original.displayName = body.displayName
    this.originalUser(original)
  }
}

export default UserVM