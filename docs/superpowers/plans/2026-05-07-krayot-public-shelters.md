# Krayot Public Shelters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing public shelters button (which is broken in production) with a new button that shows shelters for 4 Krayot cities as real map markers, fetched from the Overpass (OpenStreetMap) API.

**Architecture:** Delete old `publicShelters.js` + `PublicShelterMarker.jsx`. Create `krayotShelters.js` (Overpass fetcher + city bboxes), `useKrayotShelters.js` hook, and `KrayotCityPicker.jsx` UI. Wire into `MapPage.jsx` — Krayot markers render using the existing `ShelterMarker` with type `municipal`. Editing a Krayot marker saves it to Firebase as a regular user shelter.

**Tech Stack:** React 19, react-leaflet, Overpass API (OpenStreetMap), Firebase Firestore, Tailwind CSS

---

## Files

| Action | File | What it does |
|--------|------|--------------|
| Delete | `src/lib/publicShelters.js` | Old data.gov.il fetcher — replaced entirely |
| Delete | `src/components/map/PublicShelterMarker.jsx` | Old marker component — replaced by ShelterMarker |
| Modify | `src/pages/MapPage.jsx` | Remove old public shelter code, add Krayot integration |
| Create | `src/lib/krayotShelters.js` | City bboxes + Overpass API fetcher + in-memory cache |
| Create | `src/hooks/useKrayotShelters.js` | React hook: selected city → shelter array |
| Create | `src/components/map/KrayotCityPicker.jsx` | City selection UI shown above the map |

---

## Task 1: Delete old public shelters files

**Files:**
- Delete: `src/lib/publicShelters.js`
- Delete: `src/components/map/PublicShelterMarker.jsx`

- [ ] **Step 1: Delete publicShelters.js**

Delete the file `src/lib/publicShelters.js` entirely.

- [ ] **Step 2: Delete PublicShelterMarker.jsx**

Delete the file `src/components/map/PublicShelterMarker.jsx` entirely.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old public shelters implementation"
```

---

## Task 2: Create krayotShelters.js — Overpass fetcher

**Files:**
- Create: `src/lib/krayotShelters.js`

- [ ] **Step 1: Create the file**

Create `src/lib/krayotShelters.js` with this exact content:

```js
// Bounding boxes: [south, west, north, east] in WGS84
export const KRAYOT_CITIES = [
  { name: 'קרית ביאליק', bbox: [32.820, 35.070, 32.870, 35.120] },
  { name: 'קרית מוצקין', bbox: [32.830, 35.055, 32.870, 35.100] },
  { name: 'קרית חיים',   bbox: [32.815, 35.040, 32.860, 35.080] },
  { name: 'קרית ים',     bbox: [32.835, 35.065, 32.875, 35.110] },
]

// In-memory cache: cityName → shelter array
const _cache = {}

/**
 * Fetch public shelters for a Krayot city from Overpass (OpenStreetMap).
 * Returns array of { id, lat, lng, name, type, isPublic }.
 */
export async function fetchKrayotShelters(cityName) {
  if (_cache[cityName]) return _cache[cityName]

  const city = KRAYOT_CITIES.find(c => c.name === cityName)
  if (!city) throw new Error(`עיר לא מוכרת: ${cityName}`)

  const [south, west, north, east] = city.bbox
  const bbox = `${south},${west},${north},${east}`

  const query = `[out:json][timeout:25];(node["amenity"="shelter"](${bbox});node["emergency"="shelter"](${bbox}););out body;`
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('לא ניתן להתחבר ל-Overpass. בדוק חיבור אינטרנט.')
  }
  if (!res.ok) throw new Error(`שגיאת שרת Overpass (${res.status})`)

  const json = await res.json()
  const shelters = (json.elements ?? [])
    .filter(el => el.lat && el.lon)
    .map(el => ({
      id:       `osm_${el.id}`,
      lat:      el.lat,
      lng:      el.lon,
      name:     el.tags?.name || el.tags?.['name:he'] || `מקלט ציבורי`,
      type:     'municipal',
      isPublic: true,
      osmId:    el.id,
    }))

  _cache[cityName] = shelters
  return shelters
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/krayotShelters.js
git commit -m "feat: add Overpass fetcher for Krayot public shelters"
```

---

## Task 3: Create useKrayotShelters.js hook

**Files:**
- Create: `src/hooks/useKrayotShelters.js`

- [ ] **Step 1: Create the file**

Create `src/hooks/useKrayotShelters.js`:

```js
import { useState, useEffect } from 'react'
import { fetchKrayotShelters } from '../lib/krayotShelters'

export function useKrayotShelters(cityName) {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!cityName) {
      setShelters([])
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchKrayotShelters(cityName)
      .then(results => { if (!cancelled) setShelters(results) })
      .catch(err    => { if (!cancelled) setError(err.message) })
      .finally(()   => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [cityName])

  return { shelters, loading, error }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useKrayotShelters.js
git commit -m "feat: add useKrayotShelters hook"
```

---

## Task 4: Create KrayotCityPicker.jsx component

**Files:**
- Create: `src/components/map/KrayotCityPicker.jsx`

- [ ] **Step 1: Create the file**

Create `src/components/map/KrayotCityPicker.jsx`:

```jsx
import { X, Loader2 } from 'lucide-react'
import { KRAYOT_CITIES } from '../../lib/krayotShelters'

export default function KrayotCityPicker({ selectedCity, onSelect, loading, error, onClose }) {
  return (
    <div
      className="absolute z-30 bg-brand-card border border-white/10 rounded-2xl p-4 shadow-xl"
      style={{ top: 64, right: 16, left: 16 }}
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-white/80">🏛️ מקלטים ציבוריים — קריות</span>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {KRAYOT_CITIES.map(city => {
          const isSelected = selectedCity === city.name
          return (
            <button
              key={city.name}
              onClick={() => onSelect(isSelected ? null : city.name)}
              disabled={loading}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                isSelected
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {loading && isSelected
                ? <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                : null
              }
              {city.name}
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-400 text-center">{error}</p>
      )}

      {!error && (
        <p className="mt-3 text-xs text-white/25 text-center">
          נתונים מ-OpenStreetMap · לחץ שוב על עיר להסתרה
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/map/KrayotCityPicker.jsx
git commit -m "feat: add KrayotCityPicker component"
```

---

## Task 5: Wire up in MapPage.jsx

**Files:**
- Modify: `src/pages/MapPage.jsx`

This task has several steps. Do them in order — each step is an independent edit.

### Step 1: Replace imports at the top of MapPage.jsx

- [ ] **Replace line 12** — remove old publicShelters import:

Old line 12:
```js
import { fetchPublicShelters, SUPPORTED_CITIES, getCityWebsiteUrl, API_CITIES } from '../lib/publicShelters'
```

Remove it entirely.

- [ ] **Replace line 14** — remove PublicShelterMarker import:

Old line 14:
```js
import PublicShelterMarker from '../components/map/PublicShelterMarker'
```

Remove it entirely.

- [ ] **Add new imports** after the existing imports block (after line 20, before `const ISRAEL_CENTER`):

```js
import { useKrayotShelters }  from '../hooks/useKrayotShelters'
import KrayotCityPicker       from '../components/map/KrayotCityPicker'
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "refactor: update MapPage imports for Krayot shelters"
```

### Step 2: Delete PublicSheltersForm function

- [ ] Delete the entire `PublicSheltersForm` function from `MapPage.jsx` — lines 284–343:

```js
function PublicSheltersForm({ onLoad, loading }) {
  ...
}
```

Delete from `function PublicSheltersForm` to the closing `}` (inclusive).

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "refactor: remove PublicSheltersForm component"
```

### Step 3: Replace old state with new state in MapPage

- [ ] In `MapPage` component, find these 4 state lines:

```js
const [publicShelters, setPublicShelters]       = useState([])
const [showPublicShelters, setShowPublicShelters] = useState(true)
const [showPublicDrawer, setShowPublicDrawer]   = useState(false)
const [loadingPublic, setLoadingPublic]         = useState(false)
```

Replace them with:

```js
const [showKrayotPicker, setShowKrayotPicker]     = useState(false)
const [selectedKrayotCity, setSelectedKrayotCity] = useState(null)
const { shelters: krayotShelters, loading: krayotLoading, error: krayotError } = useKrayotShelters(selectedKrayotCity)
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "refactor: replace publicShelters state with krayotShelters"
```

### Step 4: Delete handleLoadPublic function

- [ ] Find and delete this function entirely:

```js
async function handleLoadPublic(city) {
  setLoadingPublic(true)
  try {
    const results = await fetchPublicShelters(city)
    if (results.length === 0) {
      alert(`לא נמצאו מקלטים ציבוריים עבור ${city}`)
      return
    }
    setPublicShelters(results)
    setShowPublicShelters(true)
    setShowPublicDrawer(false)
  } catch (err) {
    alert(err.message || 'שגיאה בטעינת מקלטים ציבוריים')
  } finally {
    setLoadingPublic(false)
  }
}
```

Add new handler in its place:

```js
async function handleSaveKrayotEdit(formData) {
  if (!editingShelter || !user) return
  setFormLoading(true)
  try {
    await addShelter(user.uid, user.displayName, {
      name:    formData.name || editingShelter.name,
      type:    'municipal',
      lat:     editingShelter.lat,
      lng:     editingShelter.lng,
      notes:   formData.notes || null,
      address: formData.address || null,
    })
    setEditing(null)
  } finally { setFormLoading(false) }
}
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "refactor: replace handleLoadPublic with handleSaveKrayotEdit"
```

### Step 5: Replace top bar button JSX

- [ ] Find the public shelters button block in the top bar (lines ~502–529):

```jsx
{/* Public shelters toggle / load button */}
{publicShelters.length > 0 ? (
  <button
    onClick={() => setShowPublicShelters(v => !v)}
    ...
  >
    ...
  </button>
) : (
  <button
    onClick={() => setShowPublicDrawer(true)}
    ...
  >
    ...
  </button>
)}
```

Replace the entire block with:

```jsx
{/* Krayot public shelters button */}
<button
  onClick={() => setShowKrayotPicker(v => !v)}
  title="מקלטים ציבוריים — קריות"
  className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer ${
    showKrayotPicker || selectedKrayotCity
      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
      : 'bg-white/10 text-brand-text hover:bg-white/15'
  }`}
>
  <span>🏛️</span>
  {krayotShelters.length > 0 && (
    <span className="tabular-nums">{krayotShelters.length}</span>
  )}
</button>
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: add Krayot shelters toggle button to top bar"
```

### Step 6: Replace public markers in map JSX

- [ ] Find this block inside `<MapContainer>`:

```jsx
{showPublicShelters && publicShelters.map(s => (
  <PublicShelterMarker key={s.id} shelter={s} />
))}
```

Replace with:

```jsx
{krayotShelters.map(s => (
  <ShelterMarker
    key={s.id}
    shelter={{ ...s, location: { latitude: s.lat, longitude: s.lng } }}
    onEdit={setEditing}
    onDelete={null}
    currentUserId={null}
  />
))}
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: render Krayot shelters using ShelterMarker"
```

### Step 7: Replace counter display

- [ ] Find the shelter counter block (lines ~589–597):

```jsx
{(shelters.length > 0 || (publicShelters.length > 0 && showPublicShelters)) && !placingPin && (
  <div ...>
    {shelters.length > 0 && <span>{shelters.length} מקלטים</span>}
    {shelters.length > 0 && publicShelters.length > 0 && showPublicShelters && <span className="mx-1">·</span>}
    {publicShelters.length > 0 && showPublicShelters && (
      <span style={{ color: '#A855F7' }}>{publicShelters.length} ציבוריים</span>
    )}
  </div>
)}
```

Replace with:

```jsx
{(shelters.length > 0 || krayotShelters.length > 0) && !placingPin && (
  <div className="absolute top-14 right-4 z-30 bg-brand-card border border-white/10 rounded-full px-3 py-1 text-xs text-white/40">
    {shelters.length > 0 && <span>{shelters.length} מקלטים</span>}
    {shelters.length > 0 && krayotShelters.length > 0 && <span className="mx-1">·</span>}
    {krayotShelters.length > 0 && (
      <span style={{ color: '#22C55E' }}>{krayotShelters.length} ציבוריים</span>
    )}
  </div>
)}
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: update shelter counter for Krayot shelters"
```

### Step 8: Add KrayotCityPicker to JSX and remove old Drawer

- [ ] Find the public shelters Drawer (lines ~649–659):

```jsx
{/* Public shelters drawer */}
<Drawer
  open={showPublicDrawer}
  onClose={() => setShowPublicDrawer(false)}
  title="מקלטים ציבוריים"
>
  <PublicSheltersForm
    onLoad={handleLoadPublic}
    loading={loadingPublic}
  />
</Drawer>
```

Replace with the KrayotCityPicker (shown above the map, not in a Drawer):

```jsx
{showKrayotPicker && (
  <KrayotCityPicker
    selectedCity={selectedKrayotCity}
    onSelect={city => setSelectedKrayotCity(city)}
    loading={krayotLoading}
    error={krayotError}
    onClose={() => setShowKrayotPicker(false)}
  />
)}
```

- [ ] Find the edit shelter Drawer. The `onSave` currently calls `handleSaveEdit`. We need a separate drawer for editing Krayot shelters. Find:

```jsx
{/* Edit shelter drawer */}
<Drawer
  open={!!editingShelter}
  onClose={() => setEditing(null)}
  title="עריכת מקלט"
>
  {editingShelter && (
    <ShelterForm
      initial={editingShelter}
      onSave={handleSaveEdit}
      onCancel={() => setEditing(null)}
      loading={formLoading}
    />
  )}
</Drawer>
```

Replace with:

```jsx
{/* Edit shelter drawer */}
<Drawer
  open={!!editingShelter}
  onClose={() => setEditing(null)}
  title="עריכת מקלט"
>
  {editingShelter && (
    <ShelterForm
      initial={editingShelter}
      onSave={editingShelter.isPublic ? handleSaveKrayotEdit : handleSaveEdit}
      onCancel={() => setEditing(null)}
      loading={formLoading}
    />
  )}
</Drawer>
```

- [ ] **Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: wire KrayotCityPicker and Krayot edit flow"
```

---

## Task 6: Fix ShelterMarker to show "ערוך" for public shelters

**Files:**
- Modify: `src/components/map/ShelterMarker.jsx`

The current code shows "ערוך" only when `isOwner && !shelter.isImported`. Krayot shelters have no owner, so "ערוך" won't appear. Fix the condition.

- [ ] **Step 1: Update the actions block in ShelterMarker.jsx**

Find this block (around line 88):

```jsx
{isOwner && !shelter.isImported && (
  <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
    <button
      onClick={() => onEdit(shelter)}
      ...
    >
      ערוך
    </button>
    <button
      onClick={() => onDelete(shelter.id)}
      ...
    >
      מחק
    </button>
  </div>
)}
```

Replace with:

```jsx
{((isOwner && !shelter.isImported) || shelter.isPublic) && onEdit && (
  <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
    <button
      onClick={() => onEdit(shelter)}
      style={{
        flex: 1,
        fontSize: 12,
        fontWeight: 700,
        padding: '6px 0',
        borderRadius: 8,
        border: '1px solid rgba(59,158,255,0.4)',
        background: 'rgba(59,158,255,0.1)',
        color: '#3B9EFF',
        cursor: 'pointer',
      }}
    >
      ערוך
    </button>
    {!shelter.isPublic && onDelete && (
      <button
        onClick={() => onDelete(shelter.id)}
        style={{
          flex: 1,
          fontSize: 12,
          fontWeight: 700,
          padding: '6px 0',
          borderRadius: 8,
          border: '1px solid rgba(255,65,84,0.4)',
          background: 'rgba(255,65,84,0.1)',
          color: '#FF4154',
          cursor: 'pointer',
        }}
      >
        מחק
      </button>
    )}
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/map/ShelterMarker.jsx
git commit -m "fix: show edit button for public Krayot shelters in ShelterMarker"
```

---

## Task 7: Manual verification

- [ ] **Step 1: Start dev server**


```bash
cd RunningInWar && npm run dev
```

- [ ] **Step 2: Open app in browser**

Navigate to `http://localhost:5173` → Map page.

- [ ] **Step 3: Verify new button exists**

Check top bar: should see 🏛️ button. Old "ציבורי" button should be gone.

- [ ] **Step 4: Open city picker**

Click 🏛️ button → KrayotCityPicker panel appears below top bar with 4 city buttons.

- [ ] **Step 5: Load a city**

Click "קרית ביאליק" → loading spinner appears → markers appear on map (green 🏛️ pins).

- [ ] **Step 6: Verify markers look correct**

Click a marker → popup shows: green "מקלט עירוני" badge, shelter name, "ערוך" button.

- [ ] **Step 7: Edit a marker**

Click "ערוך" → ShelterForm opens → change name → save → check Firebase (shelter appears in user's list).

- [ ] **Step 8: Toggle city off**

Click the same city again → markers disappear. Click 🏛️ button → picker closes.

- [ ] **Step 9: Check browser console**

No errors. No CORS errors.

- [ ] **Step 10: Final commit**

```bash
git add -A
git commit -m "feat: complete Krayot public shelters feature"
git push
```

---

## Notes

- **Overpass bbox accuracy:** The bounding boxes in `KRAYOT_CITIES` are approximate. If shelters appear outside city bounds or are missing, adjust the bbox values in `krayotShelters.js`.
- **No delete for Krayot markers:** Krayot markers (isPublic) cannot be deleted from the map — only edited (saved to Firebase). The `onDelete={null}` in `ShelterMarker` hides the delete button for these.
- **ShelterMarker edit visibility:** `ShelterMarker` shows "ערוך" only when `onEdit` prop is provided AND (`isOwner || shelter.isPublic`). Currently `ShelterMarker` checks `isOwner && !shelter.isImported`. To show "ערוך" for public shelters, in `ShelterMarker.jsx` line 88 change `isOwner && !shelter.isImported` to `isOwner && !shelter.isImported || shelter.isPublic`.
