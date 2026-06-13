# Architecture — WHAT

## Tech Stack (locked)
| Layer | Choice | Why locked |
|-------|--------|------------|
| Frontend framework | React 18 + React Compiler | Stable, fast, מוכר |
| Build tool | Vite 5 | מהיר, HMR, PWA support |
| Styling | Tailwind CSS 3 | אחיד, ב-dark only, מובן ב-tokens |
| Map library | Leaflet + react-leaflet | פתוח, חופשי, RTL friendly. **לא Mapbox / Google.** |
| Icons | lucide-react | אחיד, stroke-based, מתאים לטון tactical. **לא Heroicons / FA.** |
| Auth | Firebase Auth | מהיר, מובנה, free tier מספיק |
| DB | Firestore + IndexedDB (offline) | Offline-first חשוב — אזעקה ייתכן עם רשת חלשה |
| Routing | react-router v6 | סטנדרט |
| External APIs | OSRM (routing), Nominatim (geocoding), Pikud HaOref (alerts) | פתוחים, חופשיים |
| Deploy | Vercel | מהיר, auto-deploy מ-main |
| PWA | vite-plugin-pwa | install prompt, offline cache |

## Screens / Pages
| Path | File | Purpose |
|------|------|---------|
| `/` | `pages/HomePage.jsx` | מסך ראשי — readiness bar, SOS hero, מקלטים קרובים |
| `/map` | `pages/MapPage.jsx` | מפת Leaflet, סימון מקלטים, סנן עיר, מקלטים ציבוריים |
| `/route` | `pages/RoutePage.jsx` | תכנון מסלול, נקודה לנקודה, ציון בטיחות |
| `/profile` | `pages/ProfilePage.jsx` | פרופיל, שפה, מצב שם עיר |
| `/auth` | `pages/AuthPage.jsx` | login/signup |
| `/share/:routeId` | `pages/SharingPage.jsx` | יצירת קישור שיתוף |
| `/route/shared/:id` | `pages/SharedRoutePage.jsx` | צפייה במסלול משותף |
| `/shelters/import/:id` | `pages/SharedImportPage.jsx` | יבוא מקלטים מקישור |

## Component Hierarchy
```
src/components/
├── auth/         LoginForm, SignupForm — טפסים מינימליים
├── map/          ShelterMarker, UserMarker, RoutePointMarker, RoutePolyline, CityFilter
├── route/        SafetyScoreBar — ציון 0-100% עם צבע דינמי
├── shelters/     ShelterForm — drawer עם form הוספת מקלט
├── sos/          SOSButton (FAB), SOSOverlay (full screen lock)
└── ui/           BottomNav, Drawer, LoadingSpinner, ErrorBoundary — כלליים
```

## Hooks
| Hook | Purpose |
|------|---------|
| `useShelters` | מקלטים אישיים מ-Firestore |
| `useCityShelters` | מקלטים ציבוריים לפי עיר (5 קריות) |
| `useLocation` | GPS position מתעדכן |
| `useAlerts` | אזעקות פיקוד העורף (polling) |
| `useAddressAutocomplete` | Nominatim search לכתובות |
| `useInstallPrompt` | PWA install prompt |

## Contexts (global state)
- `AuthContext` — user, signIn, signOut
- `LanguageContext` — t(), lang, setLang (he/en)
- `CityNameContext` — full vs short city names

## Lib (pure functions)
- `geo.js` — haversineDistance, bearing, findNearestShelter, geoPointToLatLng, etaSeconds
- `osrmRouting.js` — calls OSRM API for foot routing
- `routeAlgorithm.js` — finds shelter-friendly routes
- `safetyScore.js` — calculates 0-100 score based on shelter coverage
- `pikudHaOref.js` — fetches alerts
- `gpxExport.js` — export routes as GPX
- `indexedDB.js` — offline cache

## Data Models (Firestore)
### `users/{userId}`
```js
{
  email, displayName, homeLocation: GeoPoint,
  createdAt, lastSeen
}
```

### `shelters/{shelterId}` (אישיים — של המשתמש)
```js
{
  ownerId, name, address, location: GeoPoint,
  type: 'building' | 'municipal' | 'safe_room',
  isImported: boolean,  // True if imported via share
  createdAt
}
```

### `city_shelters/{cityId}/shelters/{shelterId}` (ציבוריים)
```js
{
  name, address, location: GeoPoint, city
}
```

### `routes/{routeId}` (מסלולים)
```js
{
  ownerId, name, points: [GeoPoint, ...],
  distance, duration, safetyScore,
  isPublic: boolean, createdAt
}
```

## Architectural Patterns — אסור לעבור עליהם
1. **Context לכל state גלובלי** — אין Redux, אין Zustand. רק Context.
2. **Hook לכל data fetch** — לעולם לא `useEffect` עם `fetch` בתוך קומפוננטה רגילה.
3. **Pure functions ב-lib** — שום React/Firebase יבוא בתוך lib.
4. **Firestore = source of truth, IndexedDB = cache** — אף פעם לא להפך.
5. **Leaflet בלבד למפות.**
6. **lucide-react בלבד לאייקונים.**
7. **Tailwind בלבד לסטיילינג** — מותר `style={{}}` inline לערכי tokens (gradients, dynamic colors), אבל לא קבצי CSS מפוזרים.
8. **RTL ברירת מחדל** — `direction: rtl` ב-body. רק מסכים ספציפיים (LTR content) משנים.
9. **Dark mode בלבד** — אין light mode, אין theme switcher.
10. **Mobile-first** — כל UI חייב לעבוד מצוין בטלפון. desktop = bonus.

## Routing Performance (Map)
- Leaflet tiles: OpenStreetMap default
- Marker clustering: לא משתמש (פחות מ-200 markers בדרך כלל)
- User location: `useLocation` עם `watchPosition`
- Map center default: Israel `[31.5, 34.9]`

## Offline Strategy
- **Critical data (shelters, home location):** IndexedDB מתעדכן מ-Firestore
- **Alerts:** רק online (לא רלוונטי offline)
- **Map tiles:** Service Worker cache (vite-plugin-pwa)
- **App shell:** PWA cache

## SOS Flow — Critical Path
1. User taps SOS button (FAB on Map, hero on Home)
2. `findNearestShelter(position, shelters)` — נוקרא מ-`lib/geo.js`
3. `<SOSOverlay shelter={nearest}>` — מסך מלא עם arrow + distance + ETA
4. Live updates: כל שנייה GPS מתעדכן, מרחק מתעדכן
5. User יכול "Next shelter" → המקלט הבא הכי קרוב
6. User יכול לסגור (X) — חוזר למסך הקודם

**זה הזרימה הקריטית. כל שינוי בה דורש אישור.**

## Future Features — לא לבנות בלי אישור
- אזעקה אוטומטית בזמן אמת (כרגע ידני בלבד)
- שיתוף מסלולים פומבי / community
- אינטגרציה עם Strava/GPX import
- Watch app
- Voice navigation
- Multi-language (יש en אבל לא מלא)
