export default async function getMany(page: number = 1, pageSize: number = 10): Promise<Response> {
  const url = `/user?page=${page}&pageSize=${pageSize}`
  const res = await fetch(url, { credentials: 'include' })
  return res
}