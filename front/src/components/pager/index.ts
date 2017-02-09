import * as ko from 'knockout'

export interface Options<T> {
  page?: number
  pageSize?: number
  fetcher: (page: number, pageSize: number) => Promise<T[]>
}

class PagerVM<T> {
  page = ko.observable(1)
  pageSize = ko.observable(10)
  content = ko.observableArray<T>([])
  canNext = ko.observable(false)
  isLoading = ko.observable(true)

  constructor(private options: Options<T>) {
    this.page(options.page || 1)
    this.pageSize(options.pageSize || 10)
    this.fetchContent()

    // Ensure the pageSize is always valid
    this.pageSize.subscribe(size => {
      if (isNaN(parseInt(size as any, 10))) {
        this.pageSize(10)

        return
      }

      if (size > 100) {
        this.pageSize(100)
        this.fetchContent()
        return
      }

      if (size < 1) {
        this.pageSize(1)
        this.fetchContent()
      }
      this.fetchContent()
    })
  }

  fetchContent = async () => {
    this.isLoading(true)
    const results = await this.options.fetcher(this.page(), this.pageSize() + 1)
    this.canNext(results.length > this.pageSize())
    this.content.destroyAll()
    results.forEach(result => this.content.push(result))
    this.isLoading(false)
  }

  nextPage = () => {
    this.page(this.page() + 1)
    this.fetchContent()
  }

  prevPage = () => {
    this.page(this.page() - 1)
    this.fetchContent()
  }
}

export default PagerVM