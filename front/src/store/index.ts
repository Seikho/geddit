export function get(key: string) {
  const store = getStore()
  return store(key)
}

export function set(key: string, value: any) {
  const store = getStore()
  store(key, value)
}

function getStore() {
  const hasLocalStore = !!localStorage

  return hasLocalStore
    ? useStorage
    : useCookies
}

function useStorage(key: string, value?: any): any | void {
  if (arguments.length === 1) {
    const item = localStorage.getItem(key)
    if (!item) {
      return null
    }
    return JSON.parse(localStorage.getItem(key) as string)
  }

  localStorage.setItem(key, JSON.stringify(value))
}

function useCookies(key: string, value?: any): any | void {
  if (arguments.length === 1) {
    const cookie = "; " + document.cookie
    const parts = cookie.split(`; ${key}=`)
    if (parts.length === 2) {
      const part = parts.pop() as string
      return JSON.parse(part.split(';').shift() as string)
    }
    return null
  }

  const oneYear = new Date()
  oneYear.setTime(oneYear.getTime() + (365 * 24 * 60 * 60 * 1000))
  document.cookie = `${key}=${JSON.stringify(value)};expires=${oneYear.toUTCString()}; path=/`
}