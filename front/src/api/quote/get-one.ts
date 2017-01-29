export default async function getOne(id: number): Promise<Schema.Quote> {
  const res = await fetch(`/quote/${id}`)
  return res.json()
}