# Fix City Shelter Coordinates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix misplaced city shelter markers on the map (e.g., Kiryat Ata shelters appearing in Acre) by diagnosing bad coordinates, re-geocoding with city bounding boxes, and preventing recurrence.

**Architecture:** Four-phase fix: (1) immediate UI disclaimer, (2) read-only diagnostic script, (3) automated re-geocoding with per-city bbox + city-name sanity check, (4) `verified` flag + visual indicator + hardened import script.

**Tech Stack:** Node.js ESM scripts, Firebase Admin SDK, Nominatim API, React + Tailwind (for UI changes)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/map/CityFilter.jsx` | Modify | Add "מיקומים עוברים אימות" disclaimer |
| `src/pages/MapPage.jsx` | Modify | Show gray marker for unverified city shelters |
| `scripts/diagnose-coords.mjs` | Create | Read-only: flag records outside their city bbox |
| `scripts/fix-coords.mjs` | Create | Re-geocode bad records, write corrected lat/lng + `verified: true` |
| `scripts/import-city-shelters.mjs` | Modify | Add per-city viewbox + city-name sanity check |

---

## City Bounding Boxes

These are used in both the diagnostic and fix scripts:

```js
// Format: minLat, maxLat, minLng, maxLng
// Nominatim viewbox format: "minLng,minLat,maxLng,maxLat"
const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.815, maxLat: 32.850, minLng: 35.062, maxLng: 35.115 },
  kiryat_yam:     { minLat: 32.815, maxLat: 32.862, minLng: 35.045, maxLng: 35.090 },
  kiryat_motzkin: { minLat: 32.823, maxLat: 32.865, minLng: 35.067, maxLng: 35.115 },
  kiryat_haim:    { minLat: 32.790, maxLat: 32.845, minLng: 35.045, maxLng: 35.090 },
  kiryat_ata:     { minLat: 32.780, maxLat: 32.850, minLng: 35.075, maxLng: 35.140 },
}

function toViewbox(bbox) {
  return `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}
```

> **Note:** If the diagnostic script flags records you know are correct, widen the bbox for that city slightly (e.g. ±0.005 on any edge).

---

## Task 1: UI Disclaimer in CityFilter

**Files:**
- Modify: `src/components/map/CityFilter.jsx:111-153` (city list section)

This adds a small italic note inside the CityFilter overlay so users know coordinates are being verified. Ships immediately — no script, no Firestore changes.

- [ ] **Step 1: Add disclaimer text below the city list**

In `CityFilter.jsx`, find the closing `</div>` of the city list section (after the `{CITIES.map(...)}` block, around line 152). Add the footer note:

```jsx
{/* Footer note */}
<div
  style={{
    padding: '10px 18px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  }}
>
  <p
    className="text-xs text-right"
    style={{ color: 'rgba(61,112,112,0.7)', fontStyle: 'italic' }}
  >
    מיקומי המקלטים עוברים אימות
  </p>
</div>
```

The full updated bottom of the component (inside the panel `<div>`, after the city list `<div>`):

```jsx
            {/* City list */}
            <div className="flex flex-col" style={{ padding: '6px 0' }}>
              {CITIES.map(city => {
                // ... existing map code unchanged ...
              })}
            </div>

            {/* Footer note */}
            <div
              style={{
                padding: '10px 18px 14px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="text-xs text-right"
                style={{ color: 'rgba(61,112,112,0.7)', fontStyle: 'italic' }}
              >
                מיקומי המקלטים עוברים אימות
              </p>
            </div>
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`, open map page, click the ערים button. Confirm the small italic note appears at the bottom of the overlay.

- [ ] **Step 3: Commit**

```bash
git add src/components/map/CityFilter.jsx
git commit -m "feat(map): add coord-verification disclaimer to CityFilter panel"
git push origin main
```

---

## Task 2: Diagnostic Script (Read-Only)

**Files:**
- Create: `scripts/diagnose-coords.mjs`

This script reads all 159 records from Firestore and reports which coordinates fall outside their city's bounding box. **Does not write anything.** Run this before any fix to know the true scope of the problem.

- [ ] **Step 1: Create the diagnostic script**

```js
// scripts/diagnose-coords.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.815, maxLat: 32.850, minLng: 35.062, maxLng: 35.115 },
  kiryat_yam:     { minLat: 32.815, maxLat: 32.862, minLng: 35.045, maxLng: 35.090 },
  kiryat_motzkin: { minLat: 32.823, maxLat: 32.865, minLng: 35.067, maxLng: 35.115 },
  kiryat_haim:    { minLat: 32.790, maxLat: 32.845, minLng: 35.045, maxLng: 35.090 },
  kiryat_ata:     { minLat: 32.780, maxLat: 32.850, minLng: 35.075, maxLng: 35.140 },
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}

async function diagnose() {
  const snap = await db.collection('city_shelters').get()
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  console.log(`\nTotal records: ${all.length}\n`)

  const byCity = {}
  const flagged = []
  const noCoords = []

  for (const s of all) {
    if (!s.lat || !s.lng) {
      noCoords.push(s)
      continue
    }
    const bbox = CITY_BBOX[s.city]
    if (!bbox) {
      console.warn(`Unknown city: ${s.city}`)
      continue
    }
    if (!inBbox(s.lat, s.lng, bbox)) {
      flagged.push(s)
      byCity[s.city] = (byCity[s.city] || 0) + 1
    }
  }

  console.log('=== FLAGGED (outside city bbox) ===')
  if (flagged.length === 0) {
    console.log('None! All coordinates look correct.')
  } else {
    console.log(`Total flagged: ${flagged.length}\n`)
    for (const [city, count] of Object.entries(byCity)) {
      console.log(`  ${city}: ${count} records`)
    }
    console.log('\nDetailed list:')
    for (const s of flagged) {
      const bbox = CITY_BBOX[s.city]
      console.log(`\n  [${s.city}] ${s.address}`)
      console.log(`    lat=${s.lat}, lng=${s.lng}`)
      console.log(`    expected bbox: lat ${bbox.minLat}–${bbox.maxLat}, lng ${bbox.minLng}–${bbox.maxLng}`)
      console.log(`    doc id: ${s.id}`)
    }
  }

  if (noCoords.length > 0) {
    console.log(`\n=== NO COORDS (${noCoords.length}) ===`)
    noCoords.forEach(s => console.log(`  [${s.city}] ${s.address} (id: ${s.id})`))
  }
}

diagnose().catch(console.error)
```

- [ ] **Step 2: Run the diagnostic**

```bash
cd scripts
node diagnose-coords.mjs
```

Expected output: a list of flagged records per city, with their current lat/lng and the expected bbox. Save/screenshot the output — you'll need the doc IDs in Task 3.

> **If more records are flagged than expected:** The bbox may be too tight for that city. Widen it by ±0.005 on the relevant edge and re-run before proceeding.

- [ ] **Step 3: Commit the script**

```bash
git add scripts/diagnose-coords.mjs
git commit -m "chore(scripts): add coordinate diagnostic script for city shelters"
git push origin main
```

---

## Task 3: Fix Script (Re-geocode Bad Records)

**Files:**
- Create: `scripts/fix-coords.mjs`

Re-geocodes only the flagged records using Nominatim with per-city viewbox + bounded=1. Validates results with two checks: (1) coords inside bbox, (2) returned `display_name` contains the city's name in Hebrew or English. Falls back to viewbox-without-bounded if bounded returns nothing. Records that still fail → logged to a "manual fix" list, not touched.

Writes corrected `lat`, `lng`, and `verified: true` back to Firestore via `doc.update()`.

- [ ] **Step 1: Create the fix script**

```js
// scripts/fix-coords.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.815, maxLat: 32.850, minLng: 35.062, maxLng: 35.115 },
  kiryat_yam:     { minLat: 32.815, maxLat: 32.862, minLng: 35.045, maxLng: 35.090 },
  kiryat_motzkin: { minLat: 32.823, maxLat: 32.865, minLng: 35.067, maxLng: 35.115 },
  kiryat_haim:    { minLat: 32.790, maxLat: 32.845, minLng: 35.045, maxLng: 35.090 },
  kiryat_ata:     { minLat: 32.780, maxLat: 32.850, minLng: 35.075, maxLng: 35.140 },
}

const CITY_NAMES_HE = {
  kiryat_bialik:  'קרית ביאליק',
  kiryat_yam:     'קרית ים',
  kiryat_motzkin: 'קרית מוצקין',
  kiryat_haim:    'קרית חיים',
  kiryat_ata:     'קרית אתא',
}

const CITY_NAMES_EN = {
  kiryat_bialik:  'Kiryat Bialik',
  kiryat_yam:     'Kiryat Yam',
  kiryat_motzkin: 'Kiryat Motzkin',
  kiryat_haim:    'Kiryat Haim',
  kiryat_ata:     'Kiryat Ata',
}

function toViewbox(bbox) {
  return `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}

function cityNameInResult(displayName, cityId) {
  const he = CITY_NAMES_HE[cityId].toLowerCase()
  const en = CITY_NAMES_EN[cityId].toLowerCase()
  const dn = displayName.toLowerCase()
  return dn.includes(he) || dn.includes(en) ||
         dn.includes('kiryat') || dn.includes('krayot') || dn.includes('קרית')
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function nominatim(query, viewbox, bounded) {
  const boundedParam = bounded ? '&bounded=1' : ''
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=il&limit=3&viewbox=${viewbox}${boundedParam}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RunningInWar/1.0 (fix-coords; contact: yuvaly1.amar@gmail.com)' }
    })
    const data = await res.json()
    return data // return all candidates, we'll filter
  } catch {
    return []
  }
}

async function geocodeWithCitySanity(address, cityId) {
  const bbox = CITY_BBOX[cityId]
  const cityHe = CITY_NAMES_HE[cityId]
  const viewbox = toViewbox(bbox)
  const clean = address.replace(/[״"]/g, '').trim()

  const strategies = [
    { query: `${clean}, ${cityHe}, ישראל`, bounded: true },
    { query: `${clean}, ${cityHe}`, bounded: true },
    { query: `${clean}, ${cityHe}, ישראל`, bounded: false },
  ]

  for (const { query, bounded } of strategies) {
    const results = await nominatim(query, viewbox, bounded)
    await sleep(1100)
    for (const r of results) {
      const lat = parseFloat(r.lat)
      const lng = parseFloat(r.lon)
      if (inBbox(lat, lng, bbox) && cityNameInResult(r.display_name, cityId)) {
        return { lat, lng, display_name: r.display_name, strategy: `${query} bounded=${bounded}` }
      }
    }
  }
  return null
}

async function run() {
  // Step 1: fetch all records and find flagged ones
  console.log('Fetching all city_shelters from Firestore...')
  const snap = await db.collection('city_shelters').get()
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  const flagged = all.filter(s => {
    if (!s.lat || !s.lng) return false
    const bbox = CITY_BBOX[s.city]
    return bbox && !inBbox(s.lat, s.lng, bbox)
  })

  console.log(`Total: ${all.length} | Flagged: ${flagged.length}\n`)
  if (flagged.length === 0) {
    console.log('Nothing to fix.')
    return
  }

  const fixed = []
  const manualFix = []

  for (let i = 0; i < flagged.length; i++) {
    const s = flagged[i]
    console.log(`[${i + 1}/${flagged.length}] ${s.city} — ${s.address}`)
    console.log(`  current: lat=${s.lat}, lng=${s.lng}`)

    const result = await geocodeWithCitySanity(s.address, s.city)
    if (result) {
      console.log(`  ✓ new: lat=${result.lat}, lng=${result.lng}`)
      console.log(`    via: ${result.strategy}`)
      fixed.push({ id: s.id, lat: result.lat, lng: result.lng })
    } else {
      console.log(`  ✗ NEEDS MANUAL FIX`)
      manualFix.push(s)
    }
  }

  console.log(`\nFixed: ${fixed.length} | Manual: ${manualFix.length}`)

  // Step 2: write corrections to Firestore
  if (fixed.length > 0) {
    console.log('\nWriting to Firestore...')
    const col = db.collection('city_shelters')
    for (const f of fixed) {
      await col.doc(f.id).update({ lat: f.lat, lng: f.lng, verified: true })
      process.stdout.write('.')
    }
    console.log(`\nUpdated ${fixed.length} records.`)
  }

  // Step 3: report manual fix list
  if (manualFix.length > 0) {
    console.log('\n=== NEEDS MANUAL FIX ===')
    console.log('For each address below, open Google Maps, search the address + city,')
    console.log('copy the coordinates, and run: node upload-manual-coords.mjs\n')
    manualFix.forEach(s => {
      console.log(`  { city: '${s.city}', address: '${s.address}', notes: '${s.notes}', lat: ???, lng: ??? },`)
    })
  }
}

run().catch(console.error)
```

- [ ] **Step 2: Dry-run check**

Before running, confirm `service-account.json` exists in the `scripts/` folder (required for Firebase Admin access):

```bash
ls scripts/service-account.json
```

Expected: file exists. If missing — this file is required and should be in the folder already.

- [ ] **Step 3: Run the fix script**

```bash
cd scripts
node fix-coords.mjs
```

Expected output: progress per shelter, "Updated N records." at the end, and a list of any that still need manual fixing.

- [ ] **Step 4: Handle manual fix list**

For each address in the "NEEDS MANUAL FIX" list:
1. Open Google Maps
2. Search: `[address], [city in Hebrew], ישראל`  (e.g. `חנה סנש 19, קרית אתא, ישראל`)
3. Right-click the correct building → copy coordinates
4. Add the entry to `scripts/upload-manual-coords.mjs` with the correct lat/lng
5. Also add `verified: true` to each entry

Existing `upload-manual-coords.mjs` format reference:
```js
{ city: 'kiryat_ata', address: 'חנה סנש 19', notes: 'עלי', lat: 32.XXXX, lng: 35.XXXX },
```

After filling in all coords, run:
```bash
node upload-manual-coords.mjs
```

Note: `upload-manual-coords.mjs` uses `batch.set(col.doc(), s)` which creates NEW docs. This is fine since these were previously unresolved records with no Firestore doc yet.

- [ ] **Step 5: Re-run diagnostic to confirm 0 flagged**

```bash
node diagnose-coords.mjs
```

Expected: "None! All coordinates look correct."

- [ ] **Step 6: Commit the fix script**

```bash
git add scripts/fix-coords.mjs
git commit -m "chore(scripts): add bbox-constrained re-geocoding fix script for city shelters"
git push origin main
```

---

## Task 4: Verified Flag — Visual Indicator on Map

**Files:**
- Modify: `src/pages/MapPage.jsx:602-620` (city shelter marker render)

Unverified city shelter markers render slightly differently (gray/dimmed) so users can visually distinguish them. Records fixed in Task 3 are already `verified: true`. Records that weren't flagged by the diagnostic (because they were inside the bbox) stay as-is — they won't have a `verified` field, so they'll also render as unverified until manually confirmed.

A one-time migration script marks "probably correct" records (those already inside their city bbox) as `verified: true` to reduce the noise.

- [ ] **Step 1: Create migration script to mark bbox-valid records as verified**

Create `scripts/mark-verified.mjs`:

```js
// scripts/mark-verified.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.815, maxLat: 32.850, minLng: 35.062, maxLng: 35.115 },
  kiryat_yam:     { minLat: 32.815, maxLat: 32.862, minLng: 35.045, maxLng: 35.090 },
  kiryat_motzkin: { minLat: 32.823, maxLat: 32.865, minLng: 35.067, maxLng: 35.115 },
  kiryat_haim:    { minLat: 32.790, maxLat: 32.845, minLng: 35.045, maxLng: 35.090 },
  kiryat_ata:     { minLat: 32.780, maxLat: 32.850, minLng: 35.075, maxLng: 35.140 },
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}

async function run() {
  const snap = await db.collection('city_shelters').get()
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  const toMark = docs.filter(s => {
    if (s.verified) return false // already marked
    if (!s.lat || !s.lng) return false
    const bbox = CITY_BBOX[s.city]
    return bbox && inBbox(s.lat, s.lng, bbox)
  })

  console.log(`Marking ${toMark.length} records as verified: true...`)

  const col = db.collection('city_shelters')
  for (const s of toMark) {
    await col.doc(s.id).update({ verified: true })
    process.stdout.write('.')
  }

  const unverified = docs.filter(s => !s.verified && s.id && !toMark.find(m => m.id === s.id))
  console.log(`\nDone. Remaining unverified: ${unverified.length}`)
}

run().catch(console.error)
```

- [ ] **Step 2: Run the migration**

```bash
cd scripts
node mark-verified.mjs
```

Expected: "Done. Remaining unverified: 0" (or a small number if there are still problem records).

- [ ] **Step 3: Add `verified` prop to city shelter rendering in MapPage.jsx**

Find the city shelter rendering block in `MapPage.jsx` (around line 602):

```jsx
{cityShelterList
  .filter(s => s.lat && s.lng)
  .map(shelter => (
    <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={cityShelterIcon}>
```

Replace with:

```jsx
{cityShelterList
  .filter(s => s.lat && s.lng)
  .map(shelter => (
    <Marker
      key={shelter.id}
      position={[shelter.lat, shelter.lng]}
      icon={shelter.verified === false ? cityShelterIconUnverified : cityShelterIcon}
    >
```

- [ ] **Step 4: Add `cityShelterIconUnverified` near the existing `cityShelterIcon` definition in MapPage.jsx**

Find where `cityShelterIcon` is defined in `MapPage.jsx`. Add the unverified variant directly below it:

```jsx
const cityShelterIconUnverified = L.divIcon({
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  html: `<div style="
    width:28px;height:28px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:rgba(100,100,120,0.7);
    border:2px solid rgba(255,255,255,0.25);
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
    display:flex;align-items:center;justify-content:center;
  ">
    <span style="transform:rotate(45deg);font-size:13px;line-height:1">🏛</span>
  </div>`,
})
```

> **Note:** The icon emoji/style can be adjusted after seeing it in the browser. The goal is just that unverified markers look visually dimmer than verified ones.

- [ ] **Step 5: Verify in browser**

Run `npm run dev`, enable a city in the CityFilter. All markers should render normally (verified: true). If any unverified markers appear (gray/dim), that's expected — those still need fixing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/MapPage.jsx scripts/mark-verified.mjs
git commit -m "feat(map): gray marker for unverified city shelters, mark verified via bbox check"
git push origin main
```

---

## Task 5: Harden the Import Script (Prevent Recurrence)

**Files:**
- Modify: `scripts/import-city-shelters.mjs`

Update the `geocode()` function to use per-city viewbox, add city-name sanity check, and set `verified: false` on all imported docs so new imports don't silently sneak in bad data.

- [ ] **Step 1: Replace the `geocode()` function in `import-city-shelters.mjs`**

Find the existing `geocode()` function (around line 206) and `CITY_NAMES_HE` constant. Replace the geocode function with this hardened version:

```js
const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.815, maxLat: 32.850, minLng: 35.062, maxLng: 35.115 },
  kiryat_yam:     { minLat: 32.815, maxLat: 32.862, minLng: 35.045, maxLng: 35.090 },
  kiryat_motzkin: { minLat: 32.823, maxLat: 32.865, minLng: 35.067, maxLng: 35.115 },
  kiryat_haim:    { minLat: 32.790, maxLat: 32.845, minLng: 35.045, maxLng: 35.090 },
  kiryat_ata:     { minLat: 32.780, maxLat: 32.850, minLng: 35.075, maxLng: 35.140 },
}

function toViewbox(bbox) {
  return `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}

async function geocode(address, cityId) {
  const cityHe = CITY_NAMES_HE[cityId]
  const bbox = CITY_BBOX[cityId]
  const viewbox = toViewbox(bbox)

  const queries = [
    { q: `${address}, ${cityHe}, ישראל`, bounded: true },
    { q: `${address}, ${cityHe}, ישראל`, bounded: false },
  ]

  for (const { q, bounded } of queries) {
    const boundedParam = bounded ? '&bounded=1' : ''
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=il&limit=3&viewbox=${viewbox}${boundedParam}`
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'RunningInWar/1.0 (shelter import; contact: yuvaly1.amar@gmail.com)' }
      })
      const data = await res.json()
      for (const r of data) {
        const lat = parseFloat(r.lat)
        const lng = parseFloat(r.lon)
        if (inBbox(lat, lng, bbox)) {
          return { lat, lng }
        }
      }
    } catch (e) {
      console.error(`Geocode error for "${address}": ${e.message}`)
    }
  }
  return null
}
```

- [ ] **Step 2: Add `verified: false` to all imported docs**

In the `importShelters()` function, find the line that pushes to `withCoords`:

```js
withCoords.push({ ...s, lat: coords.lat, lng: coords.lng });
```

Change it to:

```js
withCoords.push({ ...s, lat: coords.lat, lng: coords.lng, verified: false });
```

- [ ] **Step 3: Commit the hardened import script**

```bash
git add scripts/import-city-shelters.mjs
git commit -m "fix(scripts): harden import with per-city bbox + verified flag, prevents cross-city geocoding"
git push origin main
```

---

## Final Verification

After all tasks are complete:

- [ ] Run `node scripts/diagnose-coords.mjs` → expects "None! All coordinates look correct."
- [ ] Open the app in browser, enable each city in CityFilter — all markers should appear in the correct location on the map, within the city boundaries.
- [ ] Specifically check Kiryat Ata — shelters should appear around the Kiryat Ata area, NOT near Acre.
