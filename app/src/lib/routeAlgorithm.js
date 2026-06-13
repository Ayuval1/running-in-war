import { haversineDistance, geoPointToLatLng } from './geo'
import { SAFE_RADIUS_METERS } from '../constants/shelterTypes'

const CONNECTION_RADIUS = SAFE_RADIUS_METERS * 2 // shelters within this are "connected"

/**
 * CIRCULAR ROUTE from home.
 * Finds shelters reachable from home and builds a loop that
 * keeps the runner within SAFE_RADIUS of a shelter at all times.
 */
export function buildCircularRoute(homeLatLng, shelters, targetKm = 3) {
  const positions = shelters.map(s => ({
    ...s,
    pos: geoPointToLatLng(s.location),
  })).filter(s => s.pos)

  const targetM = targetKm * 1000

  // Filter to shelters within targetKm/2 of home
  const local = positions.filter(
    s => haversineDistance(homeLatLng, s.pos) <= targetM / 2
  )

  if (!local.length) {
    // No local shelters — return simple out-and-back to nearest shelter
    const nearest = positions.sort(
      (a, b) => haversineDistance(homeLatLng, a.pos) - haversineDistance(homeLatLng, b.pos)
    )[0]
    if (!nearest) return { waypoints: [homeLatLng], sheltersCovered: [] }
    return {
      waypoints: [homeLatLng, nearest.pos, homeLatLng],
      sheltersCovered: [nearest.id],
    }
  }

  // Greedy nearest-neighbour cycle starting from home
  const visited = new Set()
  const path = [homeLatLng]
  const shelterIds = []
  let current = homeLatLng
  let totalDist = 0

  while (visited.size < local.length) {
    // Find unvisited shelter reachable within budget
    const remaining = totalDist < targetM
      ? local.filter(s => !visited.has(s.id))
      : []
    if (!remaining.length) break

    // Prefer shelters connected to current (within CONNECTION_RADIUS)
    const connected = remaining.filter(
      s => haversineDistance(current, s.pos) <= CONNECTION_RADIUS
    )
    const candidates = connected.length ? connected : remaining

    // Pick closest
    const next = candidates.reduce((best, s) => {
      const d = haversineDistance(current, s.pos)
      return d < haversineDistance(current, best.pos) ? s : best
    })

    const step = haversineDistance(current, next.pos)
    if (totalDist + step > targetM * 1.3) break // don't overshoot too much

    visited.add(next.id)
    path.push(next.pos)
    shelterIds.push(next.id)
    totalDist += step
    current = next.pos
  }

  path.push(homeLatLng) // close the loop
  return { waypoints: path, sheltersCovered: shelterIds }
}

/**
 * POINT-TO-POINT ROUTE from start to end.
 * Finds shelters in a corridor around the direct path and
 * routes through them.
 */
export function buildPointToPointRoute(startLatLng, endLatLng, shelters) {
  const positions = shelters.map(s => ({
    ...s,
    pos: geoPointToLatLng(s.location),
  })).filter(s => s.pos)

  const totalDist = haversineDistance(startLatLng, endLatLng)
  const corridorWidth = Math.max(150, totalDist * 0.35)

  // Project each shelter onto the start→end axis
  // and find those within corridorWidth of the line
  const dLat = endLatLng.lat - startLatLng.lat
  const dLng = endLatLng.lng - startLatLng.lng
  const len2 = dLat * dLat + dLng * dLng

  const corridor = positions
    .map(s => {
      const t = len2 > 0
        ? Math.max(0, Math.min(1,
            ((s.pos.lat - startLatLng.lat) * dLat +
             (s.pos.lng - startLatLng.lng) * dLng) / len2
          ))
        : 0
      const proj = {
        lat: startLatLng.lat + t * dLat,
        lng: startLatLng.lng + t * dLng,
      }
      const perpDist = haversineDistance(s.pos, proj)
      return { ...s, t, perpDist }
    })
    .filter(s => s.perpDist <= corridorWidth)
    .sort((a, b) => a.t - b.t)

  // Build waypoints: start → shelters in order → end
  const waypoints = [startLatLng]
  const shelterIds = []
  for (const s of corridor) {
    // Only include if it doesn't add more than 20% extra distance
    const detour = haversineDistance(waypoints.at(-1), s.pos)
    if (detour < totalDist * 0.4) {
      waypoints.push(s.pos)
      shelterIds.push(s.id)
    }
  }
  waypoints.push(endLatLng)

  return { waypoints, sheltersCovered: shelterIds }
}

/** Total route distance in km */
export function routeDistanceKm(waypoints) {
  let total = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += haversineDistance(waypoints[i], waypoints[i + 1])
  }
  return Math.round((total / 1000) * 100) / 100
}
