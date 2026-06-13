# City Filter Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating city filter to the map that shows public shelters for 5 Krayot cities, plus a city name preference setting (ק׳/קרית) in ProfilePage.

**Architecture:** Shelter data scraped via Playwright + geocoded via Nominatim → uploaded to Firestore `city_shelters` collection (one-time import script). App reads shelters per city on demand via `useCityShelters` hook. City filter is a floating glowing-circle panel (V2 design). City name preference stored in localStorage via `CityNameContext`.

**Tech Stack:** React 19, react-leaflet, Leaflet, Tailwind CSS, Firebase Firestore, Nominatim geocoding API, firebase-admin (import script only)

---

## File Map

**Created:**
- `scripts/import-city-shelters.mjs` — one-time script: scrape 5 cities + geocode + upload to Firestore
- `src/context/CityNameContext.jsx` — localStorage context: `cityNameMode = 'short' | 'full'`
- `src/hooks/useCityShelters.js` — Firestore hook: fetch shelters for active city
- `src/components/map/CityFilter.jsx` — floating panel, V2 glowing-circle design

**Modified:**
- `src/pages/MapPage.jsx` — add `activeCity` state, city shelter markers, `<CityFilter>`
- `src/pages/ProfilePage.jsx` — add city name preference card (copy Language card pattern)
- `src/App.jsx` — wrap in `<CityNameProvider>`

**Firestore collection:**
```
city_shelters/{auto-id}: {
  city: "kiryat_yam",   // "kiryat_bialik" | "kiryat_yam" | "kiryat_motzkin" | "kiryat_haim" | "kiryat_ata"
  address: string,
  notes: string,
  lat: number,
  lng: number
}
```

---

### Task 1: Collect and import shelter data to Firestore

**Files:**
- Create: `scripts/import-city-shelters.mjs`

**Data sources:**

| City | Key | Source | Method |
|------|-----|--------|--------|
| קרית ים | `kiryat_yam` | ArcGIS REST API | Direct JSON + coordinates |
| קרית מוצקין | `kiryat_motzkin` | `https://www.kiryat-motzkin.muni.il/מקלטים-ציבוריים/` | HTML table, 1 page |
| קרית חיים | `kiryat_haim` | `https://www.haifa-during-emergency.co.il/רשימת-מקלטים/` | HTML table, filter col[3]==="חבל קריות ומפרץ" |
| קרית אתא | `kiryat_ata` | `https://www.kiryat-ata.org.il/residentservice/emergency/publicshelterslist/` | HTML table, paginated |
| קרית ביאליק | `kiryat_bialik` | `https://qbialik.org.il/חירום/רשימת-מקלטים-ציבוריים-2/` | HTML table, paginated |

**Geocoding:** `https://nominatim.openstreetmap.org/search?q=ADDRESS,CITY_HE,ישראל&format=json&countrycodes=il&limit=1` — wait 1100ms between requests.

- [ ] **Step 1: Install firebase-admin**

```bash
npm install -D firebase-admin
```

- [ ] **Step 2: Get service account key**

Go to Firebase Console → Project Settings → Service Accounts → Generate New Private Key → save as `scripts/service-account.json` (this file is gitignored — never commit it).

Add to `.gitignore`:
```
scripts/service-account.json
```

- [ ] **Step 3: Extract Kiryat Yam from ArcGIS (Playwright MCP)**

Navigate browser to:
```
https://services6.arcgis.com/sBobFBdIDUhq9X9D/arcgis/rest/services/Miklat_Kiryat_Yam/FeatureServer/0/query?where=1%3D1&outFields=*&f=json
```

Evaluate:
```javascript
() => {
  const data = JSON.parse(document.body.innerText);
  return data.features.map((f, i) => ({
    city: 'kiryat_yam',
    address: f.attributes.Address || f.attributes.ADRESS || f.attributes.address || '',
    notes: '',
    lat: f.geometry.y,
    lng: f.geometry.x
  }));
}
```

- [ ] **Step 4: Extract Kiryat Motzkin (Playwright MCP)**

Navigate to `https://www.kiryat-motzkin.muni.il/מקלטים-ציבוריים/` and evaluate:
```javascript
() => [...document.querySelectorAll('table tbody tr')].map(tr => {
  const cells = [...tr.querySelectorAll('td')].map(td => td.innerText.trim());
  const raw = cells[1] || cells[0] || '';
  const parenMatch = raw.match(/\(([^)]+)\)/);
  const address = raw.replace(/\s*\([^)]+\)/g, '').trim();
  const notes = parenMatch ? parenMatch[1] : '';
  return { city: 'kiryat_motzkin', address, notes, lat: null, lng: null };
}).filter(s => s.address)
```

- [ ] **Step 5: Extract Kiryat Haim (Playwright MCP)**

Navigate to `https://www.haifa-during-emergency.co.il/רשימת-מקלטים/` and evaluate:
```javascript
() => [...document.querySelectorAll('table tbody tr')]
  .filter(tr => tr.querySelectorAll('td')[3]?.innerText.trim() === 'חבל קריות ומפרץ')
  .map(tr => {
    const cells = [...tr.querySelectorAll('td')].map(td => td.innerText.trim());
    return { city: 'kiryat_haim', address: cells[1], notes: cells[2], lat: null, lng: null };
  })
```

Expected: ~43 rows.

- [ ] **Step 6: Extract Kiryat Ata (Playwright MCP, paginated)**

Navigate to `https://www.kiryat-ata.org.il/residentservice/emergency/publicshelterslist/` and on each page evaluate:
```javascript
() => [...document.querySelectorAll('table tbody tr')]
  .filter(tr => tr.querySelectorAll('td').length >= 2)
  .map(tr => {
    const cells = [...tr.querySelectorAll('td')].map(td => td.innerText.trim());
    return { city: 'kiryat_ata', address: cells[1] || '', notes: '', lat: null, lng: null };
  }).filter(s => s.address)
```

Click next page and repeat until no rows. Merge all pages.

- [ ] **Step 7: Extract Kiryat Bialik (Playwright MCP, paginated)**

Navigate to `https://qbialik.org.il/חירום/רשימת-מקלטים-ציבוריים-2/` and evaluate same pattern per page. Expected: ~30 rows total across 3 pages. City: `kiryat_bialik`.

- [ ] **Step 8: Geocode shelters (Motzkin, Haim, Ata, Bialik)**

For each shelter with `lat: null`, fetch Nominatim via browser evaluate or MCP network tool:
```
https://nominatim.openstreetmap.org/search?q=ADDRESS,CITY_HE,ישראל&format=json&countrycodes=il&limit=1
```

City name map: `kiryat_motzkin→קרית מוצקין`, `kiryat_haim→קרית חיים`, `kiryat_ata→קרית אתא`, `kiryat_bialik→קרית ביאליק`.

Wait 1100ms between calls. If empty result → log and skip (don't upload nulls).

- [ ] **Step 9: Write import script**

Create `scripts/import-city-shelters.mjs` with all collected data hardcoded, then Firestore upload:

```javascript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const shelters = [
  // paste all collected shelter objects here
  // { city: 'kiryat_yam', address: '...', notes: '', lat: 32.848, lng: 35.071 },
];

async function importShelters() {
  const col = db.collection('city_shelters');
  const batch = db.batch();
  for (const shelter of shelters) {
    batch.set(col.doc(), shelter);
  }
  await batch.commit();
  console.log(`Imported ${shelters.length} shelters`);
}

importShelters().catch(console.error);
```

- [ ] **Step 10: Run import script**

```bash
node scripts/import-city-shelters.mjs
```

Expected output: `Imported N shelters` where N ≥ 100.

- [ ] **Step 11: Verify in Firebase Console**

Open Firebase Console → Firestore → `city_shelters` collection. Verify documents exist with correct `city`, `lat`, `lng` fields.

- [ ] **Step 12: Commit**

```bash
git add scripts/import-city-shelters.mjs .gitignore
git commit -m "data: add city shelter import script (Firestore)"
git push
```

---

### Task 2: CityNameContext

**Files:**
- Create: `src/context/CityNameContext.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create context file**

```jsx
// src/context/CityNameContext.jsx
import { createContext, useContext, useState } from 'react'

const CityNameContext = createContext()

export function CityNameProvider({ children }) {
  const [cityNameMode, setCityNameMode] = useState(
    () => localStorage.getItem('cityNameMode') || 'short'
  )

  function toggle() {
    const next = cityNameMode === 'short' ? 'full' : 'short'
    setCityNameMode(next)
    localStorage.setItem('cityNameMode', next)
  }

  return (
    <CityNameContext.Provider value={{ cityNameMode, toggle }}>
      {children}
    </CityNameContext.Provider>
  )
}

export function useCityName() {
  return useContext(CityNameContext)
}
```

- [ ] **Step 2: Wrap App in provider**

In `src/App.jsx`, add import and wrap the existing return:
```jsx
import { CityNameProvider } from './context/CityNameContext'

return (
  <CityNameProvider>
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          ...existing routes unchanged...
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </CityNameProvider>
)
```

- [ ] **Step 3: Verify**

Run `npm run dev`. No console errors. `localStorage.getItem('cityNameMode')` → `null` (defaults to `'short'` in code).

- [ ] **Step 4: Commit**

```bash
git add src/context/CityNameContext.jsx src/App.jsx
git commit -m "feat: add CityNameContext for city name preference"
git push
```

---

### Task 3: useCityShelters hook

**Files:**
- Create: `src/hooks/useCityShelters.js`

- [ ] **Step 1: Check existing Firebase setup**

Read `src/firebase/firestore.js` to find how Firestore `db` is exported — use the same import pattern.

- [ ] **Step 2: Create hook**

```javascript
// src/hooks/useCityShelters.js
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/firestore'

export function useCityShelters(cityId) {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cityId) { setShelters([]); return }
    setLoading(true)
    const q = query(collection(db, 'city_shelters'), where('city', '==', cityId))
    getDocs(q)
      .then(snap => setShelters(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(err => console.error('useCityShelters error:', err))
      .finally(() => setLoading(false))
  }, [cityId])

  return { shelters, loading }
}

export async function getCityShelterCounts() {
  const cities = ['kiryat_bialik', 'kiryat_yam', 'kiryat_motzkin', 'kiryat_haim', 'kiryat_ata']
  const counts = {}
  await Promise.all(cities.map(async city => {
    const q = query(collection(db, 'city_shelters'), where('city', '==', city))
    const snap = await getCountFromServer(q)
    counts[city] = snap.data().count
  }))
  return counts
}
```

- [ ] **Step 3: Verify**

Import `useCityShelters` in a component temporarily — no TypeScript/lint errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCityShelters.js
git commit -m "feat: add useCityShelters Firestore hook"
git push
```

---

### Task 4: CityFilter component

**Files:**
- Create: `src/components/map/CityFilter.jsx`

Design: V2 glowing circle. Toggle button 40×40px. Panel: dark glass, 176px wide, 5 city rows.

- [ ] **Step 1: Create component**

```jsx
// src/components/map/CityFilter.jsx
import { useState, useEffect } from 'react'
import { useCityName } from '../../context/CityNameContext'
import { getCityShelterCounts } from '../../hooks/useCityShelters'

const CITIES = [
  { id: 'kiryat_bialik', full: 'קרית ביאליק', short: "ק׳ ביאליק" },
  { id: 'kiryat_yam',     full: 'קרית ים',     short: "ק׳ ים"     },
  { id: 'kiryat_motzkin', full: 'קרית מוצקין', short: "ק׳ מוצקין" },
  { id: 'kiryat_haim',    full: 'קרית חיים',   short: "ק׳ חיים"   },
  { id: 'kiryat_ata',     full: 'קרית אתא',    short: "ק׳ אתא"    },
]

export default function CityFilter({ activeCity, onCityChange }) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState({})
  const { cityNameMode } = useCityName()
  const highlighted = open || !!activeCity

  useEffect(() => {
    getCityShelterCounts().then(setCounts).catch(() => {})
  }, [])

  return (
    <div className="absolute top-20 right-3 z-[1000]" dir="rtl">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: highlighted ? 'rgba(59,158,255,0.15)' : 'rgba(11,25,47,0.92)',
          border: `1px solid ${highlighted ? 'rgba(59,158,255,0.5)' : 'rgba(59,158,255,0.25)'}`,
          boxShadow: highlighted
            ? '0 0 0 3px rgba(59,158,255,0.12), 0 0 20px rgba(59,158,255,0.25)'
            : '0 2px 12px rgba(0,0,0,0.5)',
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={highlighted ? '#3B9EFF' : '#6A9CC0'} strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 6h18M6 12h12M9 18h6"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-12 right-0 w-44 rounded-2xl"
          style={{
            background: 'rgba(11,22,40,0.96)',
            border: '1px solid rgba(59,158,255,0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,158,255,0.06)',
            padding: '6px',
          }}
        >
          {CITIES.map(city => {
            const isActive = activeCity === city.id
            const count = counts[city.id] ?? '…'
            return (
              <button
                key={city.id}
                onClick={() => { onCityChange(isActive ? null : city.id); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer"
                style={{
                  background: isActive ? 'rgba(59,158,255,0.1)' : 'transparent',
                  transition: 'background 0.12s ease',
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{
                    background: isActive ? '#3B9EFF' : 'transparent',
                    border: `2px solid ${isActive ? '#3B9EFF' : 'rgba(59,158,255,0.3)'}`,
                    boxShadow: isActive
                      ? '0 0 0 3px rgba(59,158,255,0.2), 0 0 12px rgba(59,158,255,0.5)'
                      : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
                <span
                  className="flex-1 text-xs font-semibold text-right"
                  style={{ color: isActive ? '#3B9EFF' : '#7AA8C8' }}
                >
                  {cityNameMode === 'full' ? city.full : city.short}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: isActive ? 'rgba(59,158,255,0.6)' : 'rgba(122,168,200,0.35)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify no errors**

Run `npm run dev`, open browser console — no red errors from CityFilter.

- [ ] **Step 3: Commit**

```bash
git add src/components/map/CityFilter.jsx
git commit -m "feat: add CityFilter component (V2 glowing circle design)"
git push
```

---

### Task 5: MapPage integration

**Files:**
- Modify: `src/pages/MapPage.jsx`

- [ ] **Step 1: Add imports**

At top of `src/pages/MapPage.jsx`, after existing imports:
```jsx
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import CityFilter from '../components/map/CityFilter'
import { useCityShelters } from '../hooks/useCityShelters'
```

Check if `Marker`/`Popup` already imported — skip if yes.

- [ ] **Step 2: Define city shelter icon**

After `const ISRAEL_CENTER = [31.5, 34.9]`:
```jsx
const cityShelterIcon = L.divIcon({
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
  html: `<div style="
    width:28px;height:28px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:#3B9EFF;
    border:2px solid rgba(255,255,255,0.6);
    box-shadow:0 0 0 3px rgba(59,158,255,0.2),0 2px 8px rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;
  "><span style="transform:rotate(45deg);font-size:11px;line-height:1">🛡</span></div>`,
})
```

- [ ] **Step 3: Add state and hook**

Inside `MapPage()`, after existing useState declarations:
```jsx
const [activeCity, setActiveCity] = useState(null)
const { shelters: cityShelterList } = useCityShelters(activeCity)
```

- [ ] **Step 4: Add city shelter markers inside MapContainer**

After `{shelters.map(s => <ShelterMarker .../>)}`:
```jsx
{cityShelterList
  .filter(s => s.lat && s.lng)
  .map(shelter => (
    <Marker
      key={shelter.id}
      position={[shelter.lat, shelter.lng]}
      icon={cityShelterIcon}
    >
      <Popup>
        <div dir="rtl" style={{
          minWidth: 160,
          background: '#0F2035',
          color: '#E6F4F0',
          borderRadius: 12,
          padding: '10px 12px',
          fontFamily: 'Rubik, sans-serif',
        }}>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{shelter.address}</p>
          {shelter.notes && (
            <p style={{ fontSize: 11, color: '#3B9EFF', fontStyle: 'italic' }}>{shelter.notes}</p>
          )}
        </div>
      </Popup>
    </Marker>
  ))
}
```

- [ ] **Step 5: Add CityFilter outside MapContainer**

After the shelter count badge button:
```jsx
{!placingPin && (
  <CityFilter activeCity={activeCity} onCityChange={setActiveCity} />
)}
```

- [ ] **Step 6: Test in browser**

1. Open map — city filter button visible (top-right, below shelter count badge)
2. Tap → panel opens, counts load (shows `…` then numbers)
3. Tap a city → blue markers appear
4. Tap same city → markers hide
5. Tap different city → previous hides, new shows

- [ ] **Step 7: Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: integrate CityFilter and city shelter markers into MapPage"
git push
```

---

### Task 6: ProfilePage city name preference

**Files:**
- Modify: `src/pages/ProfilePage.jsx`

`MapPin` already imported at line 2. Copy Language card pattern.

- [ ] **Step 1: Add import**

```jsx
import { useCityName } from '../context/CityNameContext'
```

- [ ] **Step 2: Destructure hook**

Inside `ProfilePage()`, after `const { lang, toggleLang } = useLang()`:
```jsx
const { cityNameMode, toggle: toggleCityName } = useCityName()
```

- [ ] **Step 3: Add card after Language card**

Find the Language card (has `<Languages size={16}` icon). Add immediately after:
```jsx
{/* City name format */}
<div className="bg-brand-card border border-white/8 rounded-2xl p-5">
  <div className="flex items-center gap-2 mb-1">
    <MapPin size={16} className="text-brand-neon" strokeWidth={2} />
    <p className="font-bold text-base">{lang === 'he' ? 'שמות ערים' : 'City Names'}</p>
  </div>
  <p className="text-white/40 text-sm mb-4 pr-6">
    {lang === 'he' ? 'כיצד יוצגו שמות ערים במסנן' : 'How city names appear in the filter'}
  </p>
  <button
    onClick={toggleCityName}
    className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/8 active:scale-95 transition-all cursor-pointer"
  >
    <span className="font-semibold text-brand-text">
      {cityNameMode === 'full' ? '🏙️ קרית...' : "🏙️ ק׳..."}
    </span>
    <span className="text-xs text-white/40 bg-white/8 px-2.5 py-1 rounded-full font-medium">
      {cityNameMode === 'full'
        ? (lang === 'he' ? 'שם מלא' : 'Full name')
        : (lang === 'he' ? 'קיצור' : 'Short')}
    </span>
  </button>
</div>
```

- [ ] **Step 4: Test**

1. Profile page → "שמות ערים" card visible below Language card
2. Tap → toggles between `קרית...` / `ק׳...`
3. Open map → city filter names match preference
4. Refresh → preference persists (localStorage)

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProfilePage.jsx
git commit -m "feat: add city name preference setting to ProfilePage"
git push
```

---

### Task 7: Final verification + deploy

- [ ] **Step 1: Full flow test**

1. Map: city filter visible, select each city → shelters load from Firestore
2. Profile: city name toggle works, map filter reflects change
3. Refresh: `cityNameMode` persists, `activeCity` resets to null (intentional)
4. Mobile 375px: panel fits in viewport

- [ ] **Step 2: Deploy**

```bash
vercel --prod
```

- [ ] **Step 3: Smoke test production**

Open https://running-in-war.vercel.app, test city filter on real device.
