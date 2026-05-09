# Route Start Point (א׳) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manual start point picker (א׳) to point2point mode in RoutePage so the user can plan routes from any address or map tap — not just GPS.

**Architecture:** All changes in one file: `src/pages/RoutePage.jsx`. Add three state variables, one more `useAddressAutocomplete` call, update `MapClickHandler` to support both start/end picking, update `buildRoute` to use the custom start, and add the א׳ UI field above the existing ב׳ field.

**Tech Stack:** React 19, react-leaflet, existing `useAddressAutocomplete` hook

---

## Files

| Action | File | What changes |
|--------|------|-------------|
| Modify | `src/pages/RoutePage.jsx` | State, MapClickHandler, buildRoute, JSX |

---

### Task 1: Add state variables + autocomplete hook for א׳

**Files:**
- Modify: `src/pages/RoutePage.jsx:47-57`

Current state block (lines 35–49):
```jsx
const [mode, setMode]             = useState('circular')
const [distanceKm, setDist]       = useState(3)
const [endPoint, setEnd]          = useState(null)
const [route, setRoute]           = useState(null)
const [score, setScore]           = useState(null)
const [settingEnd, setSettingEnd] = useState(false)
const [isPending, startTransition] = useTransition()
const [transportMode, setTransportMode] = useState('foot')
const [geometry, setGeometry]           = useState(null)
const [routeLoading, setRouteLoading]   = useState(false)
const latestRouteReq = useRef(0)

const [endAddress, setEndAddress] = useState('')
const { suggestions: endSuggestions, loading: loadingEndSug } =
  useAddressAutocomplete(endAddress, { enabled: !endPoint })
```

- [ ] **Step 1: Add the three new state variables and start autocomplete hook**

Find line with `const [endAddress, setEndAddress] = useState('')` and add these lines BEFORE it:

```jsx
const [startPoint, setStartPoint]     = useState(null)
const [startAddress, setStartAddress] = useState('')
const [settingStart, setSettingStart] = useState(false)
```

Then find the existing autocomplete line for end:
```jsx
const { suggestions: endSuggestions, loading: loadingEndSug } =
  useAddressAutocomplete(endAddress, { enabled: !endPoint })
```

Add this line directly AFTER it:
```jsx
const { suggestions: startSuggestions, loading: loadingStartSug } =
  useAddressAutocomplete(startAddress, { enabled: !startPoint && mode === 'point2point' })
```

- [ ] **Step 2: Add helper functions for start point**

Find the existing `pickEndSuggestion` function:
```jsx
function pickEndSuggestion(item) {
  const a = item.address || {}
  const label = [a.road, a.house_number, a.city || a.town || a.village]
    .filter(Boolean).join(' ') || item.display_name.split(',')[0]
  setEnd({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) })
  setEndAddress(label)
}
```

Add this new function BEFORE it:
```jsx
function pickStartSuggestion(item) {
  const a = item.address || {}
  const label = [a.road, a.house_number, a.city || a.town || a.village]
    .filter(Boolean).join(' ') || item.display_name.split(',')[0]
  setStartPoint({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) })
  setStartAddress(label)
}

function clearStart() {
  setStartPoint(null)
  setStartAddress('')
}
```

- [ ] **Step 3: Clear startPoint when switching away from point2point mode**

Find these two mode-switch onClick handlers:
```jsx
onClick={() => { setMode('circular'); setRoute(null); setGeometry(null) }}
```
and
```jsx
onClick={() => { setMode('point2point'); setRoute(null); setGeometry(null) }}
```

Update the circular one to also clear start:
```jsx
onClick={() => { setMode('circular'); setRoute(null); setGeometry(null); setStartPoint(null); setStartAddress('') }}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "feat: add startPoint state and autocomplete hook for route start"
```

---

### Task 2: Update MapClickHandler to handle start and end

**Files:**
- Modify: `src/pages/RoutePage.jsx:21-28` (MapClickHandler component)

- [ ] **Step 1: Replace MapClickHandler component**

Find the existing component:
```jsx
function MapClickHandler({ active, onPick }) {
  useMapEvents({
    click(e) {
      if (active) onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}
```

Replace it with:
```jsx
function MapClickHandler({ picking, onPick }) {
  useMapEvents({
    click(e) {
      if (picking) onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}
```

- [ ] **Step 2: Update MapClickHandler usage in JSX**

Find the existing usage (inside `<MapContainer>`):
```jsx
<MapClickHandler
  active={settingEnd}
  onPick={pos => { setEnd(pos); setEndAddress(`${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`); setSettingEnd(false) }}
/>
```

Replace with:
```jsx
<MapClickHandler
  picking={settingStart ? 'start' : settingEnd ? 'end' : null}
  onPick={pos => {
    if (settingStart) {
      setStartPoint(pos)
      setStartAddress(`${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`)
      setSettingStart(false)
    } else {
      setEnd(pos)
      setEndAddress(`${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`)
      setSettingEnd(false)
    }
  }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "refactor: update MapClickHandler to support start and end picking"
```

---

### Task 3: Update buildRoute to use custom start point

**Files:**
- Modify: `src/pages/RoutePage.jsx:64-90` (buildRoute function)

- [ ] **Step 1: Replace position checks and usage in buildRoute**

Find the current `buildRoute` function beginning:
```jsx
async function buildRoute() {
  if (!position) { alert('ממתין ל-GPS...'); return }
  if (!shelters.length) { alert('אין מקלטים. הוסף מקלטים במפה קודם.'); return }
  if (mode === 'point2point' && !endPoint) { alert('בחר נקודת יעד על המפה'); return }

  const result = mode === 'circular'
    ? buildCircularRoute(position, shelters, distanceKm)
    : buildPointToPointRoute(position, endPoint, shelters)
```

Replace those lines with:
```jsx
async function buildRoute() {
  const origin = startPoint || position
  if (!origin) { alert('ממתין ל-GPS... או בחר נקודת התחלה'); return }
  if (!shelters.length) { alert('אין מקלטים. הוסף מקלטים במפה קודם.'); return }
  if (mode === 'point2point' && !endPoint) { alert('בחר נקודת יעד על המפה'); return }

  const result = mode === 'circular'
    ? buildCircularRoute(origin, shelters, distanceKm)
    : buildPointToPointRoute(origin, endPoint, shelters)
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "feat: use custom startPoint (or GPS fallback) as route origin"
```

---

### Task 4: Add א׳ UI field + map overlay banner update

**Files:**
- Modify: `src/pages/RoutePage.jsx` — JSX section, point2point block and overlay banner

- [ ] **Step 1: Add the א׳ field above the ב׳ field**

Find this comment in the JSX:
```jsx
{/* End point — address autocomplete + map click (point2point) */}
{mode === 'point2point' && (
```

INSERT this entire block BEFORE that comment:

```jsx
{/* Start point — address autocomplete + map click (point2point) */}
{mode === 'point2point' && (
  <div className="mb-1">
    {startPoint ? (
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
        style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.35)' }}
      >
        <CheckCircle2 size={15} strokeWidth={2} style={{ color: '#00E5A0', flexShrink: 0 }} />
        <span className="flex-1 text-sm truncate" style={{ color: '#00E5A0' }}>
          {startAddress || `${startPoint.lat.toFixed(4)}, ${startPoint.lng.toFixed(4)}`}
        </span>
        <button type="button" onClick={clearStart} className="cursor-pointer" style={{ color: '#3D7070' }}>
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    ) : (
      <div className="relative">
        <div className="relative flex items-center">
          <input
            value={startAddress}
            onChange={e => setStartAddress(e.target.value)}
            placeholder='נקודת התחלה (ברירת מחדל: מיקומך)'
            className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none"
            style={{
              background: 'rgba(0,229,160,0.08)',
              border: '1px solid rgba(0,229,160,0.35)',
              color: '#E6F4F0',
              fontSize: 14,
              paddingLeft: 36,
              caretColor: '#00E5A0',
            }}
            autoComplete="off"
          />
          <span className="absolute left-3 pointer-events-none" style={{ color: '#00E5A0' }}>
            {loadingStartSug
              ? <Loader2 size={14} strokeWidth={2} className="animate-spin" />
              : <Search size={14} strokeWidth={2} />
            }
          </span>
        </div>

        {startSuggestions.length > 0 && (
          <div
            className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden"
            style={{
              background: '#0F2035',
              border: '1px solid rgba(26,48,80,0.9)',
              borderRadius: 12,
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {startSuggestions.map((item, i) => {
              const a = item.address || {}
              const line1 = [a.road, a.house_number].filter(Boolean).join(' ') || item.display_name.split(',')[0]
              const line2 = [a.city || a.town || a.village, a.state].filter(Boolean).join(', ')
              return (
                <button
                  key={i}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); pickStartSuggestion(item) }}
                  className="w-full text-right flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                  style={{ borderBottom: i < startSuggestions.length - 1 ? '1px solid rgba(26,48,80,0.5)' : 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <MapPin size={13} strokeWidth={2} style={{ color: '#00E5A0', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-bold truncate" style={{ color: '#E6F4F0' }}>{line1}</span>
                    <span className="block text-xs truncate" style={{ color: '#3D7070' }}>{line2}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <button
          onClick={() => setSettingStart(true)}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
          style={{ background: 'rgba(0,229,160,0.06)', border: '1px dashed rgba(0,229,160,0.3)', color: '#00E5A0' }}
        >
          <MapPin size={13} strokeWidth={2} />
          או לחץ על המפה לבחירת נקודת התחלה
        </button>
      </div>
    )}
  </div>
)}

{/* Connector between א׳ and ב׳ */}
{mode === 'point2point' && (
  <div className="flex items-center gap-2 mb-1 px-1">
    <div style={{ width: 2, height: 12, background: 'rgba(26,48,80,0.8)', marginRight: 'auto', marginLeft: 19 }} />
  </div>
)}
```

- [ ] **Step 2: Update the map overlay banner**

Find the existing overlay banner (inside the map `<div className="flex-1 relative">`):
```jsx
{settingEnd && (
  <div
    className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-semibold pointer-events-none"
    style={{
      background: 'rgba(59,158,255,0.15)',
      border: '1px solid rgba(59,158,255,0.5)',
      color: '#3B9EFF',
    }}
  >
    לחץ על המפה לבחירת נקודת סיום
  </div>
)}
```

Replace with:
```jsx
{(settingStart || settingEnd) && (
  <div
    className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-semibold pointer-events-none"
    style={settingStart
      ? { background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.5)', color: '#00E5A0' }
      : { background: 'rgba(59,158,255,0.15)', border: '1px solid rgba(59,158,255,0.5)', color: '#3B9EFF' }
    }
  >
    {settingStart ? '🟢 לחץ על המפה — נקודת התחלה (א׳)' : '🎯 לחץ על המפה — נקודת סיום (ב׳)'}
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/RoutePage.jsx
git commit -m "feat: add start point (א׳) UI field to point2point mode"
```

---

### Task 5: Verify in browser + push

**Files:** none — verification only

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:5173` → navigate to Route page.

- [ ] **Step 2: Verify — mode toggle**

Click "א׳→ב׳". Confirm: two input fields appear (א׳ on top, ב׳ below), connected with a short vertical line.

- [ ] **Step 3: Verify — GPS default**

With GPS available: א׳ field shows placeholder "נקודת התחלה (ברירת מחדל: מיקומך)". Press "חשב מסלול" — route calculates from GPS as usual.

- [ ] **Step 4: Verify — address autocomplete for א׳**

Type "דיזנגוף" in the א׳ field. Confirm: green suggestions dropdown appears. Pick one. Confirm: א׳ becomes a green chip with the address + ✕ button.

- [ ] **Step 5: Verify — map tap for א׳**

Click ✕ to clear. Click "או לחץ על המפה לבחירת נקודת התחלה". Confirm: green banner appears on map "🟢 לחץ על המפה — נקודת התחלה (א׳)". Click map. Confirm: banner disappears, א׳ chip shows coordinates.

- [ ] **Step 6: Verify — map tap for ב׳ still works**

Click "או לחץ על המפה לבחירת יעד". Confirm: blue banner "🎯 לחץ על המפה — נקודת סיום (ב׳)". Click map. Confirm: ב׳ chip appears.

- [ ] **Step 7: Verify — full route with custom start**

With both א׳ and ב׳ set: press "חשב מסלול". Confirm: route draws from א׳ to ב׳ on the map (with street geometry if OSRM responds).

- [ ] **Step 8: Verify — switch to circular resets start**

Switch to "ריצה מהבית". Switch back to "א׳→ב׳". Confirm: א׳ field is empty again.

- [ ] **Step 9: Push**

```bash
git push
```

Expected: Vercel auto-deploys within ~1 minute.
