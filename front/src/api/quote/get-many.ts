export default async function getOne(page: number = 1, pageSize: number = 10): Promise<Schema.Quote[]> {
  const res = await fetch(`/quote?page=${page}&pageSize=${pageSize}`)
  return res.json()
}