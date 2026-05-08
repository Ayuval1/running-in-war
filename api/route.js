export default async function handler(req, res) {
  const { waypoints, mode = 'foot' } = req.query
  if (!waypoints) return res.status(400).json({ error: 'waypoints required' })
  if (!/^[\d.,;-]+$/.test(waypoints)) return res.status(400).json({ error: 'invalid waypoints format' })

  const profile = mode === 'car' ? 'car' : 'foot'
  const url = `https://router.project-osrm.org/route/v1/${profile}/${waypoints}?overview=full&geometries=geojson`

  try {
    const upstream = await fetch(url)
    if (!upstream.ok) return res.status(502).json({ error: 'osrm error' })
    const data = await upstream.json()
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(data)
  } catch {
    res.status(502).json({ error: 'upstream error' })
  }
}
