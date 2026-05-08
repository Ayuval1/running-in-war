# OSRM Street Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace straight-line route drawing with real street geometry from OSRM, and add a foot/car transport toggle.

**Architecture:** Browser calls `streetRoute()` → Vercel proxy at `/api/route` → OSRM public server → returns GeoJSON coordinates → `RoutePolyline` renders the full geometry instead of raw waypoints.

**Tech Stack:** Vercel serverless (Node.js), React useState/useTransition, OSRM public server (`router.project-osrm.org`)

---

### Task 1: Create `api/route.js` — Vercel OSRM proxy

**Files:**
- Create: `api/route.js`

- [ ] **Step 1: Write the file**

```js
export default async function handler(req, res) {
  const { waypoints, mode = 'foot' } = req.query
  if (!waypoints) return res.status(400).json({ error: 'waypoints required' })

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
```

- [ ] **Step 2: Test the proxy manually in terminal**

Run (replace coords with any two points):
```
curl "http://localhost:5173/api/route?waypoints=34.7818,32.0853;34.7900,32.0800&mode=foot"
```
Expected: JSON with `routes[0].geometry.coordinates` array of `[lng, lat]` pairs.

> Note: During local dev with Vite (not Vercel CLI), test the endpoint after deploying (Step commit and push triggers Vercel preview). Or use `vercel dev` if available.

- [ ] **Step 3: Commit**

```bash
git add api/route.js
git commit -m "feat: add /api/route Vercel proxy for OSRM street routing"
git push
```

---

### Task 2: Create `src/lib/osrmRouting.js`

**Files:**
- Create: `src/lib/osrmRouting.js`

- [ ] **Step 1: Write the file**

```js
export async function streetRoute(waypoints, mode = 'foot') {
  const coords = waypoints.map(p => `${p.lng},${p.lat}`).join(';')
  const res = await fetch(`/api/route?waypoints=${encodeURIComponent(coords)}&mode=${mode}`)
  if (!res.ok) throw new Error(`route fetch failed: ${res.status}`)
  const data = await res.json()
  if (!data.routes?.length) throw new Error('no routes returned')
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
}
```

- [ ] **Step 2: Verify in browser console after app loads**

Open browser DevTools → Console and run:
```js
import('/src/lib/osrmRouting.js').then(m =>
  m.streetRoute([{lat:32.0853,lng:34.7818},{lat:32.0800,lng:34.7900}])
).then(pts => console.log('Points:', pts.length, pts[0]))
```
Expected: `Points: 53` (or similar) and first point like `{lat: 32.085339, lng: 34.781812}`

- [ ] **Step 3: Commit**

```bash
git add src/lib/osrmRouting.js
git commit -m "feat: add streetRoute() client function for OSRM routing"
git push
```

---

### Task 3: Modify `RoutePage.jsx`

**Files:**
- Modify: `src/pages/RoutePage.jsx`

Three changes: (a) new state, (b) updated `buildRoute`, (c) transport toggle UI + spinner.

- [ ] **Step 1: Add import for `streetRoute` at top of file (line 10, after existing imports)**

Add this line after the existing imports block (after line 14 `import RoutePolyline`):
```js
import { streetRoute } from '../lib/osrmRouting'
```

- [ ] **Step 2: Add three new state variables after line 40 (`const [isPending, startTransition] = useTransition()`)**

```js
const [transportMode, setTransportMode] = useState('foot')
const [geometry, setGeometry]           = useState(null)
const [routeLoading, setRouteLoading]   = useState(false)
```

- [ ] **Step 3: Replace the entire `buildRoute` function (lines 59–71) with async version**

Old code:
```js
function buildRoute() {
  if (!position) { alert('ממתין ל-GPS...'); return }
  if (!shelters.length) { alert('אין מקלטים. הוסף מקלטים במפה קודם.'); return }
  if (mode === 'point2point' && !endPoint) { alert('בחר נקודת יעד על המפה'); return }

  startTransition(() => {
    const result = mode === 'circular'
      ? buildCircularRoute(position, shelters, distanceKm)
      : buildPointToPointRoute(position, endPoint, shelters)
    setRoute(result)
    setScore(calcSafetyScore(result.waypoints, shelters))
  })
}
```

New code:
```js
async function buildRoute() {
  if (!position) { alert('ממתין ל-GPS...'); return }
  if (!shelters.length) { alert('אין מקלטים. הוסף מקלטים במפה קודם.'); return }
  if (mode === 'point2point' && !endPoint) { alert('בחר נקודת יעד על המפה'); return }

  let result
  startTransition(() => {
    result = mode === 'circular'
      ? buildCircularRoute(position, shelters, distanceKm)
      : buildPointToPointRoute(position, endPoint, shelters)
    setRoute(result)
    setScore(calcSafetyScore(result.waypoints, shelters))
  })

  setRouteLoading(true)
  try {
    const geo = await streetRoute(result.waypoints, transportMode)
    setGeometry(geo)
  } catch {
    setGeometry(null)
  } finally {
    setRouteLoading(false)
  }
}
```

- [ ] **Step 4: Add transport mode toggle row in JSX**

Find the mode selector block that ends with `</div>` after the point2point button (around line 122). The existing mode selector ends with:
```jsx
        </div>
```

Add the transport toggle immediately after (before the distance chips block):
```jsx
        {/* Transport mode toggle */}
        <div
          className="flex rounded-xl p-1 mb-3"
          style={{ background: '#070D18' }}
        >
          <button
            onClick={() => { setTransportMode('foot'); setGeometry(null) }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={transportMode === 'foot'
              ? { background: 'rgba(0,229,160,0.15)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.4)' }
              : { color: '#3D7070' }}
          >
            🏃 ריצה
          </button>
          <button
            onClick={() => { setTransportMode('car'); setGeometry(null) }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={transportMode === 'car'
              ? { background: 'rgba(59,158,255,0.15)', color: '#3B9EFF', border: '1px solid rgba(59,158,255,0.4)' }
              : { color: '#3D7070' }}
          >
            🚗 רכב
          </button>
        </div>
```

- [ ] **Step 5: Add spinner to calculate button**

Find the calculate button in the JSX (search for `buildRoute` in the onClick). It currently looks like:
```jsx
onClick={buildRoute}
```
The button label text (likely "חשב מסלול" or similar) — add spinner:

Find the button content that shows the calculate label and wrap it:
```jsx
{routeLoading ? <Loader2 size={16} className="animate-spin" /> : /* existing button content */}
```

> Loader2 is already imported at line 4.

- [ ] **Step 6: Update the RoutePolyline call in JSX (line 314)**

Old:
```jsx
{route && <RoutePolyline waypoints={route.waypoints} />}
```

New:
```jsx
{route && <RoutePolyline waypoints={route.waypoints} geometry={geometry} />}
```

- [ ] **Step 7: Verify in browser**

1. Load the app, go to Route page
2. See two toggle rows — one for circular/point2point, one for 🏃/🚗
3. Set a location, press calculate
4. Spinner shows briefly, then route appears following real streets
5. Toggle 🚗 → recalculate → route respects one-way streets

- [ ] **Step 8: Commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "feat: add transport mode toggle and OSRM street routing to RoutePage"
git push
```

---

### Task 4: Modify `RoutePolyline.jsx`

**Files:**
- Modify: `src/components/map/RoutePolyline.jsx`

- [ ] **Step 1: Update the component to accept and use `geometry` prop**

Old file:
```jsx
import { Polyline, CircleMarker } from 'react-leaflet'

export default function RoutePolyline({ waypoints }) {
  if (!waypoints?.length) return null
  const positions = waypoints.map(p => [p.lat, p.lng])

  return (
    <>
      {/* Shadow line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#000', weight: 6, opacity: 0.3 }}
      />
      {/* Main line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#2EC4B6', weight: 4, opacity: 0.9, dashArray: '8,4' }}
      />
      {/* Start dot */}
      <CircleMarker
        center={positions[0]}
        radius={7}
        pathOptions={{ fillColor: '#2EC4B6', color: '#fff', weight: 2, fillOpacity: 1 }}
      />
      {/* End dot */}
      <CircleMarker
        center={positions.at(-1)}
        radius={7}
        pathOptions={{ fillColor: '#E63946', color: '#fff', weight: 2, fillOpacity: 1 }}
      />
    </>
  )
}
```

New file:
```jsx
import { Polyline, CircleMarker } from 'react-leaflet'

export default function RoutePolyline({ waypoints, geometry }) {
  if (!waypoints?.length) return null
  const positions = geometry
    ? geometry.map(p => [p.lat, p.lng])
    : waypoints.map(p => [p.lat, p.lng])

  return (
    <>
      {/* Shadow line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#000', weight: 6, opacity: 0.3 }}
      />
      {/* Main line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#2EC4B6', weight: 4, opacity: 0.9, dashArray: '8,4' }}
      />
      {/* Start dot */}
      <CircleMarker
        center={positions[0]}
        radius={7}
        pathOptions={{ fillColor: '#2EC4B6', color: '#fff', weight: 2, fillOpacity: 1 }}
      />
      {/* End dot */}
      <CircleMarker
        center={positions.at(-1)}
        radius={7}
        pathOptions={{ fillColor: '#E63946', color: '#fff', weight: 2, fillOpacity: 1 }}
      />
    </>
  )
}
```

- [ ] **Step 2: Verify fallback works**

In browser: disconnect from internet (or force OSRM to fail by temporarily changing the URL in `api/route.js` to something invalid), recalculate route — should still show straight-line route without crashing.

Restore `api/route.js` after test.

- [ ] **Step 3: Commit**

```bash
git add src/components/map/RoutePolyline.jsx
git commit -m "feat: RoutePolyline accepts geometry prop for OSRM street paths"
git push
```

---

## Final Verification

- [ ] Full flow: open app → Route page → calculate → see real street route on map
- [ ] Switch transport mode → geometry clears → recalculate → different path
- [ ] OSRM down simulation (disconnect wifi) → route still shows (straight-line fallback, no crash)
- [ ] Both circular and point2point modes work with street routing
