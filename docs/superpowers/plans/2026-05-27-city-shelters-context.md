# City Shelters Global Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `activeCities` + `cityShelterList` from local MapPage state into a global React context so both MapPage and RoutePage share the same city shelter selection.

**Architecture:** Create `CitySheltersContext` (mirrors pattern of existing `CityNameContext`). Wrap app at root. MapPage reads from context instead of local state. RoutePage reads from context and merges city shelters with personal shelters for routing + display.

**Tech Stack:** React 18 context, existing `useCityShelters` hook, Firebase Firestore (`city_shelters` collection)

---

## File Map

| Action | File | Change |
|--------|------|--------|
| CREATE | `src/context/CitySheltersContext.jsx` | New context + provider + hook |
| MODIFY | `src/App.jsx` | Wrap with `<CitySheltersProvider>` |
| MODIFY | `src/pages/MapPage.jsx` | Remove local state, use context |
| MODIFY | `src/pages/RoutePage.jsx` | Use context, merge shelters |

---

## Task 1: Create CitySheltersContext

**Files:**
- Create: `src/context/CitySheltersContext.jsx`

- [ ] **Step 1: Create the context file**

```jsx
// src/context/CitySheltersContext.jsx
import { createContext, useContext, useState } from 'react'
import { useCityShelters } from '../hooks/useCityShelters'

const CitySheltersContext = createContext()

export function CitySheltersProvider({ children }) {
  const [activeCities, setActiveCities] = useState([])
  const { shelters: cityShelterList } = useCityShelters(activeCities)

  function toggleCity(id) {
    setActiveCities(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  return (
    <CitySheltersContext.Provider value={{ activeCities, toggleCity, cityShelterList }}>
      {children}
    </CitySheltersContext.Provider>
  )
}

export function useCitySheltersContext() {
  return useContext(CitySheltersContext)
}
```

- [ ] **Step 2: Verify file saved, no syntax errors**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds (context not used yet, no effect)

---

## Task 2: Add provider to App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Import and wrap**

In `src/App.jsx`, add import at top:
```jsx
import { CitySheltersProvider } from './context/CitySheltersContext'
```

Wrap the existing `<CityNameProvider>` content — add `<CitySheltersProvider>` inside it:
```jsx
return (
  <CityNameProvider>
    <CitySheltersProvider>          {/* ← ADD */}
    <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ... all routes unchanged ... */}
      </Routes>
    </Suspense>
    </ErrorBoundary>
    </CitySheltersProvider>          {/* ← ADD */}
  </CityNameProvider>
)
```

- [ ] **Step 2: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds

---

## Task 3: Update MapPage to use context

**Files:**
- Modify: `src/pages/MapPage.jsx`

- [ ] **Step 1: Add import**

Add to imports at top of `MapPage.jsx`:
```jsx
import { useCitySheltersContext } from '../context/CitySheltersContext'
```

Remove this import (no longer needed directly in MapPage):
```jsx
import { useCityShelters } from '../hooks/useCityShelters'
```

- [ ] **Step 2: Replace local state with context**

Find and remove these 3 lines (around line 432):
```jsx
const [activeCities, setActiveCities] = useState([])
const { shelters: cityShelterList }   = useCityShelters(activeCities)

function toggleCity(id) {
  setActiveCities(prev =>
    prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
  )
}
```

Replace with one line:
```jsx
const { activeCities, toggleCity, cityShelterList } = useCitySheltersContext()
```

- [ ] **Step 3: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds, no unused variable warnings about activeCities/toggleCity

---

## Task 4: Update RoutePage to include city shelters

**Files:**
- Modify: `src/pages/RoutePage.jsx`

- [ ] **Step 1: Add import**

Add to imports at top of `RoutePage.jsx`:
```jsx
import { useCitySheltersContext } from '../context/CitySheltersContext'
```

- [ ] **Step 2: Pull cityShelterList from context + merge**

After the existing line:
```jsx
const { shelters } = useShelters()
```

Add:
```jsx
const { cityShelterList } = useCitySheltersContext()
const allShelters = [...shelters, ...cityShelterList]
```

- [ ] **Step 3: Replace `shelters` with `allShelters` in routing logic**

Find `buildRoute` function. Replace every `shelters` reference with `allShelters`:

```jsx
async function buildRoute() {
  const origin = startPoint || position
  if (!origin) { alert('ממתין ל-GPS... או בחר נקודת התחלה'); return }
  if (!allShelters.length) { alert('אין מקלטים. הוסף מקלטים במפה או בחר עיר.'); return }
  if (mode === 'point2point' && !endPoint) { alert('בחר נקודת יעד על המפה'); return }

  const result = mode === 'circular'
    ? buildCircularRoute(origin, allShelters, distanceKm)
    : buildPointToPointRoute(origin, endPoint, allShelters)

  startTransition(() => {
    setRoute(result)
    setScore(calcSafetyScore(result.waypoints, allShelters))
  })
  // ... rest of function unchanged
```

- [ ] **Step 4: Replace `shelters` with `allShelters` in map display**

Find the map section that renders shelter markers (around line 541):
```jsx
{shelters.map(s => (
  <ShelterMarker key={s.id} shelter={s} onEdit={() => {}} onDelete={() => {}} currentUserId={user?.uid} />
))}
```

Replace with:
```jsx
{allShelters.map(s => (
  <ShelterMarker key={s.id} shelter={s} onEdit={() => {}} onDelete={() => {}} currentUserId={user?.uid} />
))}
```

- [ ] **Step 5: Build check**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds, no errors

---

## Task 5: Commit and deploy

- [ ] **Step 1: Final build**

Run: `npm run build 2>&1 | tail -3`
Expected: `✓ built in Xs`

- [ ] **Step 2: Commit**

```bash
git add src/context/CitySheltersContext.jsx src/App.jsx src/pages/MapPage.jsx src/pages/RoutePage.jsx
git commit -m "feat(route): city shelters shared via context — visible in route page"
git push origin main
```

- [ ] **Step 3: Deploy**

```bash
vercel --prod
```

Expected: `Aliased: https://running-in-war.vercel.app`

---

## Verification

After deploy, test manually:
1. Go to `/map` → select a city (e.g., ק׳ ביאליק)
2. Go to `/route` → build a route
3. Confirm city shelter markers appear on route map
4. Confirm route algorithm uses city shelters as waypoints (score should reflect them)
5. Deselect city on `/map` → go back to `/route` → city shelters gone
