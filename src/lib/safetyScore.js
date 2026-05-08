import { sampleRoute, haversineDistance, geoPointToLatLng } from './geo'
import { SAFE_RADIUS_METERS } from '../constants/shelterTypes'

/**
 * Returns 0-100 safety score for a route.
 * Score = % of sampled points that have a shelter within SAFE_RADIUS_METERS.
 */
export function calcSafetyScore(waypoints, shelters, safeRadius = SAFE_RADIUS_METERS) {
  if (!waypoints?.length || !shelters?.length) return 0
  const samples = sampleRoute(waypoints, 10)
  if (!samples.length) return 0

  const shelterPositions = shelters.map(s => geoPointToLatLng(s.location)).filter(Boolean)

  let covered = 0
  for (const point of samples) {
    for (const sp of shelterPositions) {
      if (haversineDistance(point, sp) <= safeRadius) { covered++; break }
    }
  }
  return Math.round((covered / samples.length) * 100)
}

export function scoreLabel(score) {
  if (score >= 90) return { label: 'מסלול בטוח מאוד', color: '#22C55E' }
  if (score >= 70) return { label: 'מסלול בטוח',      color: '#84CC16' }
  if (score >= 50) return { label: 'מסלול סביר',       color: '#EAB308' }
  return { label: 'מסלול מסוכן', color: '#EF4444' }
}
