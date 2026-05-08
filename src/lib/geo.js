/** Haversine distance between two {lat,lng} points — returns meters */
export function haversineDistance(a, b) {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const c =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

/** Bearing in degrees from point a to point b (0 = north, clockwise) */
export function bearing(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const toDeg = (r) => (r * 180) / Math.PI
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x = Math.sin(dLng) * Math.cos(lat2)
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(x, y)) + 360) % 360
}

/** Move a point by distanceMeters in direction bearingDeg */
export function destinationPoint(origin, bearingDeg, distanceMeters) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const toDeg = (r) => (r * 180) / Math.PI
  const d = distanceMeters / R
  const b = toRad(bearingDeg)
  const lat1 = toRad(origin.lat)
  const lng1 = toRad(origin.lng)
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(b)
  )
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(b) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    )
  return { lat: toDeg(lat2), lng: toDeg(lng2) }
}

/** Interpolate N points evenly along a polyline of {lat,lng} waypoints */
export function sampleRoute(waypoints, stepMeters = 10) {
  if (waypoints.length < 2) return waypoints
  const samples = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    const dist = haversineDistance(a, b)
    const steps = Math.max(1, Math.floor(dist / stepMeters))
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      samples.push({ lat: a.lat + t * (b.lat - a.lat), lng: a.lng + t * (b.lng - a.lng) })
    }
  }
  return samples
}

/** Find the shelter closest to position. Returns shelter with distanceMeters added. */
export function findNearestShelter(position, shelters) {
  if (!shelters?.length) return null
  let nearest = null
  let minDist = Infinity
  for (const s of shelters) {
    const loc = geoPointToLatLng(s.location)
    const d = haversineDistance(position, loc)
    if (d < minDist) { minDist = d; nearest = s }
  }
  return nearest ? { ...nearest, distanceMeters: minDist } : null
}

/** Convert Firestore GeoPoint (or plain {lat,lng}) to {lat,lng} */
export function geoPointToLatLng(location) {
  if (!location) return null
  if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    return { lat: location.latitude, lng: location.longitude }
  }
  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return { lat: location.lat, lng: location.lng }
  }
  return null // פורמט לא מוכר — אל תקרוס
}

/** ETA in seconds at running pace (3 m/s conservative) */
export function etaSeconds(distanceMeters) {
  return Math.ceil(distanceMeters / 3)
}
