export default async function getMany(page: number = 1, pageSize: number = 10, path?: string): Promise<Schema.Quote[]> {
  const url = `/quote${path}?page=${page}&pageSize=${pageSize}`
  const res = await fetch(url)
  return res.json()
}