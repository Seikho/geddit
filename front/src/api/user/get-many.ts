export default async function getMany(page: number = 1, pageSize: number = 10, path?: string): Promise<Schema.User[]> {
  const url = `/user${path}?page=${page}&pageSize=${pageSize}`
  const res = await fetch(url, { credentials: 'include' })
  return res.json()
}