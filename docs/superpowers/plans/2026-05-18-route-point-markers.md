# Route Point Markers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a green circle marker (א) on the map when the user selects a start point, and a blue teardrop pin (ב) when they select an end point — both appearing immediately before route calculation.

**Architecture:** Create a new `RoutePointMarker.jsx` file exporting two `L.divIcon` icons. Add two conditional `<Marker>` components inside `RoutePage.jsx`'s `<MapContainer>`, hidden when `route !== null`. Reuse existing `routeLoading` state for loading UI; add `routeError` state for timeout feedback.

**Tech Stack:** React 19, react-leaflet `<Marker>`, Leaflet `L.divIcon()`, inline CSS/SVG

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| CREATE | `src/components/map/RoutePointMarker.jsx` | Two `L.divIcon` exports: `startIcon` (green ring + א) and `endIcon` (blue teardrop + ב) |
| MODIFY | `src/pages/RoutePage.jsx` | Add `Marker` import, `routeError` state, conditional marker rendering, loading/error overlay, timeout in `buildRoute()` |

---

## Task 1: Create RoutePointMarker.jsx

**Files:**
- Create: `src/components/map/RoutePointMarker.jsx`

- [ ] **Step 1: Create the file**

```jsx
import L from 'leaflet'

export const startIcon = L.divIcon({
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  html: `
    <div style="
      width:40px;height:40px;border-radius:50%;
      background:rgba(0,229,160,0.18);
      border:3px solid #00E5A0;
      box-shadow:0 0 0 6px rgba(0,229,160,0.2),0 0 0 12px rgba(0,229,160,0.08);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;font-weight:900;color:#00E5A0;
      font-family:Rubik,sans-serif;
    ">א</div>
  `,
})

export const endIcon = L.divIcon({
  className: '',
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  html: `
    <div style="position:relative;width:32px;height:45px">
      <svg width="32" height="45" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 45 16 45C16 45 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#3B9EFF"/>
      </svg>
      <div style="
        position:absolute;top:7px;left:0;right:0;
        display:flex;align-items:center;justify-content:center;
        font-size:13px;font-weight:900;color:#0f1923;
        font-family:Rubik,sans-serif;
      ">ב</div>
    </div>
  `,
})
```

- [ ] **Step 2: Verify file was created**

```bash
cat src/components/map/RoutePointMarker.jsx
```
Expected: file content printed, no errors.

---

## Task 2: Add Markers to RoutePage.jsx

**Files:**
- Modify: `src/pages/RoutePage.jsx`

- [ ] **Step 1: Add `Marker` to the react-leaflet import (line 2)**

Current line 2:
```js
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
```

Change to:
```js
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
```

- [ ] **Step 2: Add import for RoutePointMarker icons (after line 16, after the RoutePolyline import)**

```js
import { startIcon, endIcon } from '../components/map/RoutePointMarker'
```

- [ ] **Step 3: Add conditional Markers inside `<MapContainer>`, directly after the `<UserMarker>` line (line 480)**

Current (line 480):
```jsx
          <UserMarker position={position} />
```

Change to:
```jsx
          <UserMarker position={position} />
          {mode === 'point2point' && startPoint && !route && (
            <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon} />
          )}
          {mode === 'point2point' && endPoint && !route && (
            <Marker position={[endPoint.lat, endPoint.lng]} icon={endIcon} />
          )}
```

- [ ] **Step 4: Open the app in browser and test**

1. Go to Route page → switch to "נקודה לנקודה" mode
2. Type an address for start → suggestions appear → pick one
3. **Expected:** green circle with "א" appears on map immediately
4. Type an address for end → pick one
5. **Expected:** blue teardrop pin with "ב" appears on map
6. Click map to set start/end → markers update position
7. Click "חשב מסלול"
8. **Expected:** both markers disappear, route line appears

- [ ] **Step 5: Commit**

```bash
git add src/components/map/RoutePointMarker.jsx src/pages/RoutePage.jsx
git commit -m "feat(route): show A/B markers before route calculation"
```

---

## Task 3: Add Loading Overlay

**Files:**
- Modify: `src/pages/RoutePage.jsx`

- [ ] **Step 1: Add loading overlay JSX**

Inside `<div className="flex-1 relative">` (line 446), directly after the existing `settingStart/settingEnd` banner (after the closing `}` of that block, before `<MapContainer>`):

```jsx
        {mode === 'point2point' && routeLoading && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-semibold pointer-events-none"
            style={{ background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.4)', color: '#00E5A0' }}
          >
            מחשב מסלול...
          </div>
        )}
```

Note: `routeLoading` already exists at line 44 — no new state needed.

- [ ] **Step 2: Verify in browser**

Click "חשב מסלול" while in point2point mode → green "מחשב מסלול..." pill appears at top of map during calculation, disappears when route renders.

- [ ] **Step 3: Commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "feat(route): show loading indicator during route calculation"
```

---

## Task 4: Add Error State with 5s Timeout

**Files:**
- Modify: `src/pages/RoutePage.jsx`

- [ ] **Step 1: Add `routeError` state (after `routeLoading` state, line 44)**

Current line 44:
```js
  const [routeLoading, setRouteLoading]   = useState(false)
```

Add after it:
```js
  const [routeError, setRouteError]       = useState(null)
```

- [ ] **Step 2: Clear `routeError` at start of `buildRoute()` and wrap `streetRoute` with timeout**

Current `buildRoute()` from line 97 onward:
```js
    setGeometry(null)
    setRouteLoading(true)
    const reqId = ++latestRouteReq.current
    try {
      const geo = await streetRoute(result.waypoints, transportMode)
      if (reqId === latestRouteReq.current) setGeometry(geo)
    } catch (err) {
      console.warn('streetRoute failed, falling back to straight lines', err)
      if (reqId === latestRouteReq.current) setGeometry(null)
    } finally {
      if (reqId === latestRouteReq.current) setRouteLoading(false)
    }
```

Replace with:
```js
    setGeometry(null)
    setRouteLoading(true)
    setRouteError(null)
    const reqId = ++latestRouteReq.current
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      )
      const geo = await Promise.race([streetRoute(result.waypoints, transportMode), timeoutPromise])
      if (reqId === latestRouteReq.current) setGeometry(geo)
    } catch (err) {
      if (reqId === latestRouteReq.current) {
        if (err.message === 'timeout') {
          setRouteError('אין חיבור — נסה שוב')
        } else {
          console.warn('streetRoute failed, falling back to straight lines', err)
        }
        setGeometry(null)
      }
    } finally {
      if (reqId === latestRouteReq.current) setRouteLoading(false)
    }
```

- [ ] **Step 3: Add error overlay JSX**

Directly after the loading overlay from Task 3:

```jsx
        {routeError && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer"
            style={{ background: 'rgba(255,65,84,0.15)', border: '1px solid rgba(255,65,84,0.5)', color: '#FF4154' }}
            onClick={() => setRouteError(null)}
          >
            {routeError}
          </div>
        )}
```

Note: `onClick={() => setRouteError(null)}` lets user dismiss it by tapping.

- [ ] **Step 4: Verify in browser**

To test timeout: temporarily change `5000` to `1` in the timeout line → click "חשב מסלול" → red "אין חיבור — נסה שוב" pill appears → tap it to dismiss. Restore `5000` after test.

- [ ] **Step 5: Final commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "feat(route): add 5s timeout and error state for route calculation"
```

---

## Final Manual Verification Checklist

- [ ] Circular mode: no A/B markers appear at all
- [ ] Point2point: start marker (green א) appears immediately when start point selected
- [ ] Point2point: end marker (blue ב) appears immediately when end point selected
- [ ] After "חשב מסלול": both markers disappear, route line with CircleMarkers from RoutePolyline shows
- [ ] Loading pill appears during calculation (green "מחשב מסלול...")
- [ ] Error pill appears on timeout (red "אין חיבור — נסה שוב"), dismissible by tap
- [ ] Changing a point (new address or new map click) moves the marker — no duplicate markers
- [ ] Pressing "איפוס" or switching mode clears markers correctly (they follow `startPoint`/`endPoint` state)

---

## Deploy

```bash
vercel --prod
```
Run from `C:\Users\user\Documents\ClaudeCode\RunningInWar` (main project dir, not a worktree).
