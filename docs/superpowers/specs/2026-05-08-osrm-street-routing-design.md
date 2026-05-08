# OSRM Street Routing — Design Spec
**Date:** 2026-05-08

## Problem

`RoutePolyline` draws straight lines between waypoints. Lines cut through buildings and are unusable in practice. `routeAlgorithm.js` selects waypoints correctly but has no street-level routing.

## Solution

Add a street-routing layer between waypoint selection and rendering:
1. Algorithm selects waypoints (unchanged)
2. New layer resolves each segment through OSRM → real street geometry
3. `RoutePolyline` renders full geometry instead of raw waypoints

OSRM is called via a Vercel serverless proxy (same pattern as `/api/alerts`) to avoid CORS.

## Architecture

```
buildCircularRoute / buildPointToPointRoute
        ↓ waypoints[]
streetRoute(waypoints, mode)   ← NEW
        ↓ geometry [{lat,lng}] (50–200 points)
RoutePolyline                  ← receives geometry, not waypoints
```

---

## Files

### NEW: `api/route.js`
Vercel serverless function. Receives `?waypoints=lng,lat;lng,lat&mode=foot|car`, proxies to OSRM public server, returns GeoJSON geometry.

- Profile mapping: `foot` → `foot`, `car` → `car`
- OSRM URL: `https://router.project-osrm.org/route/v1/{profile}/{coords}?overview=full&geometries=geojson`
- On OSRM error: return `502`
- No caching (routes are dynamic)

### NEW: `src/lib/osrmRouting.js`
Single exported function:

```js
export async function streetRoute(waypoints, mode = 'foot')
// Returns: [{lat, lng}, ...] — full street geometry
// Throws on network error (caller handles fallback)
```

Logic:
1. Build coordinate string: `lng,lat;lng,lat;...`
2. `fetch('/api/route?waypoints=...&mode=...')`
3. Parse `routes[0].geometry.coordinates` → map `[lng, lat]` → `{lat, lng}`
4. Return array

### MODIFIED: `RoutePage.jsx`
Two changes:

**State:**
```js
const [transportMode, setTransportMode] = useState('foot') // 'foot' | 'car'
const [geometry, setGeometry] = useState(null)
const [routeLoading, setRouteLoading] = useState(false)
```

**`buildRoute()` function** — after existing waypoint logic, add:
```js
setRouteLoading(true)
try {
  const geo = await streetRoute(result.waypoints, transportMode)
  setGeometry(geo)
} catch {
  setGeometry(null) // fallback: RoutePolyline uses waypoints
} finally {
  setRouteLoading(false)
}
```

**UI — transport toggle row** (added below existing circular/point2point row):
```
[ 🏃 ריצה ]  [ 🚗 רכב ]
```
- `foot` → green active style (same as existing active state)
- `car` → blue active style
- Changing mode clears `geometry` and `route` (forces recalculate)

**Loading state:** Show `<Loader2>` spinner on the calculate button while `routeLoading` is true.

### MODIFIED: `RoutePolyline.jsx`
Accept optional `geometry` prop:
```jsx
export default function RoutePolyline({ waypoints, geometry }) {
  const positions = geometry
    ? geometry.map(p => [p.lat, p.lng])
    : waypoints.map(p => [p.lat, p.lng])
  // rest unchanged
}
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| OSRM timeout / 5xx | `geometry = null` → fallback to straight lines (silent) |
| No waypoints | `streetRoute` not called |
| OSRM returns empty routes | throw → fallback |

No user-facing error message — straight-line fallback is acceptable.

---

## Transport Mode Behavior

| Mode | OSRM profile | Respects |
|---|---|---|
| `foot` | `foot` | Pedestrian paths, sidewalks |
| `car` | `car` | One-way streets, traffic rules |

---

## Out of Scope

- Caching routes in IndexedDB (future)
- Elevation / incline data (future)
- Custom OSRM server (future, if public server too slow)
- Safety score recalculation per street geometry (future)
