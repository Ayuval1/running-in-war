export async function streetRoute(waypoints, mode = 'foot') {
  const coords = waypoints.map(p => `${p.lng},${p.lat}`).join(';')
  const res = await fetch(`/api/route?waypoints=${encodeURIComponent(coords)}&mode=${mode}`)
  if (!res.ok) throw new Error(`route fetch failed: ${res.status}`)
  const data = await res.json()
  if (!data.routes?.length) throw new Error('no routes returned')
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
}
