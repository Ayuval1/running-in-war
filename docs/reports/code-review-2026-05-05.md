# דוח בדיקת קוד — RunningInWar
## תאריך: 2026-05-05

## סיכום מנהלים
האפליקציה בנויה היטב מבחינה אדריכלית — Context, Hooks, lazy-loading של דפים, ותמיכה ב-PWA וב-offline cache. עם זאת, יש באג קריטי אחד שמפיל את דף ייבוא המקלטים (`SharedImportPage`), ובעיה תפיסתית מרכזית: **אלגוריתם המסלול מצייר קווים ישרים בין מקלטים ולא עוקב אחרי רחובות אמיתיים** — מה שאומר שהמסלול שמוצג למשתמש הוא לא מסלול ריצה ניתן ליישום במציאות. בנוסף יש בעיות בינוניות סביב Race Conditions, חוסר עקביות בטיפול בשגיאות, ומספר תרגומים חסרים.

---

## בעיות קריטיות 🔴

### 1. שורת קוד שבורה ב-SharedImportPage — הדף קורס
- **שם הבעיה:** שימוש שגוי ב-`useNavigate` כביטוי בוליאני
- **קובץ ושורה:** `src/pages/SharedImportPage.jsx:10`
- **מה קורה:** הקוד הוא `const { user } = useNavigate() && useAuth()`. `useNavigate()` מחזיר פונקציה (truthy), כך שהביטוי הופך ל-`useAuth()` — זה עובד במקרה — אבל הביטוי מייצר destructuring על תוצאת ה-`&&`, ובנוסף `useNavigate()` נקרא פעמיים (גם בשורה 11). זה דפוס מבולגן שעלול לקרוס בעדכון React/router הבא, ומבזבז re-renders.
- **השפעה:** התנהגות לא צפויה, hooks תלויים ב-render order ויכולים להיכשל. כל זרימת ייבוא מקלטים שותפים סיכון לשבר.
- **פתרון מומלץ:** להחליף ל-`const { user } = useAuth(); const navigate = useNavigate()` בנפרד.

### 2. אלגוריתם המסלול לא עוקב אחרי רחובות
- **שם הבעיה:** מסלול הריצה מצויר כקווים ישרים על המפה
- **קובץ ושורה:** `src/lib/routeAlgorithm.js:11-128`
- **מה קורה:** `buildCircularRoute` ו-`buildPointToPointRoute` מחזירות מערך `waypoints` שהן רק קואורדינטות של בית/מקלטים/יעד. `RoutePolyline` (`src/components/map/RoutePolyline.jsx:5`) פשוט מצייר `Polyline` ישר בין הנקודות. **אין שום קריאה ל-API ניתוב** (אין OSRM, GraphHopper, Mapbox, Valhalla).
- **השפעה:** המסלול המוצג עובר דרך בתים, גינות, כבישים מהירים — בלתי אפשרי לרוץ אותו בפועל. גם ה-GPX שמיוצא ב-`gpxExport.js` חסר ערך. **זה הופך את הפיצ'ר המרכזי של האפליקציה ללא שמיש.**
- **פתרון מומלץ:** ראה סעיף "בעיית אלגוריתם המסלול" למטה.

### 3. סוד Firebase חשוף בקובץ שעלול להיכנס ל-git
- **שם הבעיה:** `firebaseConfig` מסתמך על `VITE_*` envs, אבל אם אין `.env` כל הערכים `undefined` — האפליקציה נופלת בהפעלה
- **קובץ ושורה:** `src/firebase/config.js:5-12`
- **מה קורה:** אין `try/catch` או `validation` שבודקים שהערכים קיימים. אם משתמש קלון את הריפו ולא הגדיר `.env`, `initializeApp({apiKey: undefined, ...})` קורס בהמשך.
- **השפעה:** כישלון hard בהפעלה, ללא הודעת שגיאה ידידותית.
- **פתרון מומלץ:** להוסיף בדיקה `if (!firebaseConfig.apiKey) throw new Error('Missing Firebase env vars — copy .env.example to .env')`.

---

## בעיות חשובות 🟡

### 1. Race Condition ב-`useShelters` בין cache ל-Firestore
- **קובץ ושורה:** `src/hooks/useShelters.js:14-22`
- **מה קורה:** `getCachedShelters()` רץ במקביל ל-`subscribeShelters()`. אם ה-Firestore מהיר מהמטמון, ה-cache "מצליח" אחרי וכותב נתונים ישנים מעל החדשים.
- **השפעה:** המשתמש יכול לראות מקלטים ישנים שנמחקו, או חוסר עקביות בין מסכים.
- **פתרון מומלץ:** לבדוק אם state כבר עודכן לפני set:
  ```js
  getCachedShelters().then(cached => {
    if (cached.length && shelters.length === 0) setShelters(cached)
  })
  ```
  או להמתין שה-snapshot הראשון יחזור ולהשתמש ב-cache רק כ-fallback.

### 2. אין `try/catch` סביב פעולות Firestore חשובות
- **קובץ ושורה:** `src/pages/HomePage.jsx:118-121`, `src/pages/MapPage.jsx:411-414`
- **מה קורה:** `handleDelete` קורא ל-`deleteShelter` ללא טיפול בשגיאות. אם המחיקה נכשלת (offline, permission denied), המשתמש לא יודע על זה.
- **השפעה:** המשתמש חושב שהמחיקה הצליחה אבל המקלט עדיין שם.
- **פתרון מומלץ:** לעטוף ב-`try/catch` ולהציג `alert` או toast.

### 3. `useAlerts` שולח request כל 5 שניות גם כשהאפליקציה ברקע
- **קובץ ושורה:** `src/hooks/useAlerts.js:21-23`
- **מה קורה:** `setInterval(check, 5000)` רץ כל זמן שהקומפוננטה mounted. גם כשהמסך נעול או הטאב לא פעיל. בנוסף `userCity` תמיד מועבר `null` מכל ה-pages (`useAlerts(null)` ב-HomePage:115, MapPage:349) — ה-hook מקבל `null` ובהמשך בודק `if (!userCity) return` — כלומר ה-hook למעשה **לא עובד בכלל בשום מקום באפליקציה**!
- **השפעה:** האזעקה לעולם לא תופעל. גם כשתופעל — בזבוז סוללה ו-network.
- **פתרון מומלץ:** להעביר את `user.city` מהפרופיל, ולעצור את ה-interval כש-`document.hidden`.

### 4. `useEffect` ב-`SOSOverlay` עם dependency חסרה
- **קובץ ושורה:** `src/components/sos/SOSOverlay.jsx:40-55`
- **מה קורה:** ה-useEffect השני (vibrate + wakeLock + timer) משתמש ב-`[]` כ-deps — תקין. אבל ה-useEffect הראשון (`[shelter]`) משווה אובייקט שלם — בכל render חדש של ההורה (כי position משתנה כל שנייה ב-`useLocation`), ה-useEffect הזה ירוץ שוב ויקרא ל-Nominatim שוב ושוב.
- **השפעה:** flooding של reverse-geocode requests ל-Nominatim, יכול לגרום ל-rate-limit ולהאטות.
- **פתרון מומלץ:** להשתמש ב-`shelter.id` בלבד כ-dependency: `[shelter.id]`.

### 5. בעיית persistence של Firebase — `browserSessionPersistence` מוחק כניסה ב-tab close
- **קובץ ושורה:** `src/firebase/config.js:19`
- **מה קורה:** `browserSessionPersistence` מתנתק כשהמשתמש סוגר את הדפדפן — אבל זאת אפליקציית PWA שצריכה לזכור משתמש כמו אפליקציה.
- **השפעה:** כל פתיחה של PWA מחייבת login מחדש — חוויה גרועה, במיוחד בחירום.
- **פתרון מומלץ:** להחליף ל-`browserLocalPersistence`, או להוסיף "remember me" checkbox.

### 6. אין validation על קואורדינטות שנשמרות ב-Firestore
- **קובץ ושורה:** `src/firebase/firestore.js:21-35`
- **מה קורה:** `addShelter` שומר GeoPoint ללא בדיקה שהוא בתוך גבולות ישראל או שהוא מספר תקין.
- **השפעה:** מקלט שגוי בקואורדינטות (0,0) או באפריקה יישמר. אם לא יש Firestore Rules הוא יישאר.
- **פתרון מומלץ:** להוסיף בדיקה: `if (lat < 29 || lat > 34 || lng < 34 || lng > 36) throw new Error(...)`.

### 7. `subscribeShelters` לא מטפל בשגיאות
- **קובץ ושורה:** `src/firebase/firestore.js:10-19`
- **מה קורה:** `onSnapshot` מקבל רק callback להצלחה — אין error handler. אם משתמש מאבד הרשאה או חיבור, השגיאה נופלת בשקט.
- **השפעה:** המסך תקוע על נתונים ישנים בלי שום הודעה.
- **פתרון מומלץ:** להעביר callback שני ל-`onSnapshot(q, success, error)` ולעדכן `setOffline(true)` או דומה.

### 8. Memory leak פוטנציאלי ב-`useLocation` — fallback מיקום קופץ ל-Tel Aviv על כל error
- **קובץ ושורה:** `src/hooks/useLocation.js:18-22`
- **מה קורה:** כל שגיאת GPS (כולל `timeout`) מציבה את המשתמש בתל אביב. אם המשתמש בבאר שבע, יראו אותו בתל אביב.
- **השפעה:** המקלטים ה"קרובים" יחושבו לפי תל אביב — מסוכן בחירום אמיתי.
- **פתרון מומלץ:** להפריד בין "אין הרשאה" (להציג fallback) ל-"timeout" (להמתין/לנסות שוב). לא להניח שתל אביב היא ברירת מחדל סבירה.

### 9. `createSharedRoute` קיים אבל אף אחד לא קורא לו
- **קובץ ושורה:** `src/firebase/firestore.js:112-123`
- **מה קורה:** הפונקציה מיוצאת אבל אין שום שימוש בה ב-codebase. גם הדף `SharedRoutePage` קורא ל-`getSharedRoute` אבל אין UI שיוצר routes משותפים.
- **השפעה:** dead code, מבלבל למתחזק.
- **פתרון מומלץ:** למחוק או להוסיף UI ב-`RoutePage` לכפתור "שתף מסלול".

---

## בעיות קלות 🟢

### 1. תרגומים חסרים באנגלית/עברית — חוסר סימטריה
- **קובץ:** `src/i18n/translations.js`
- **מה חסר:** ב-`he` יש `appName`, `appTagline` (שורה 4-5), אך הם לא מופיעים בכל המקומות. רוב הדפים משתמשים בטקסט hardcoded ולא ב-`t(...)`. למשל `HomePage.jsx:168` כותב `'ריצה בזמן מלחמה'` בקשיח במקום `t('appName')`.
- **השפעה:** מצב EN לא משפיע באמת על כל הדפים.
- **פתרון:** להחליף את כל ה-hardcoded strings לקריאות `t(...)`.

### 2. Imports לא בשימוש
- `src/pages/MapPage.jsx:1` — `useEffect` מיובא ובאמת נמצא בשימוש ב-line 370. תקין.
- `src/pages/HomePage.jsx:3` — `MapPin` מיובא אבל לא בשימוש (בודק שורות, מופיע רק כ-import)
- `src/pages/RoutePage.jsx:4` — `RotateCcw` בשימוש; `ChevronLeft` בשימוש; `Search` בשימוש. תקין.
- `src/components/shelters/ShelterForm.jsx:2` — `MapPin` בשימוש בשורה 195. תקין.

### 3. `subscribeShelters` ללא `orderBy`
- **קובץ:** `src/firebase/firestore.js:10-19`
- **מה קורה:** הסדר של המקלטים אקראי ב-Firestore. ב-UI מקלטים מסודרים לפי distance, אז זה לא קריטי.
- **פתרון:** אופציונלי — להוסיף `orderBy('createdAt', 'desc')`.

### 4. כפילות לוגיקה — autocomplete חוזר על עצמו
- **קובץ:** `src/pages/MapPage.jsx:166-282`, `src/pages/RoutePage.jsx:43-235`, `src/pages/ProfilePage.jsx`, `src/components/shelters/ShelterForm.jsx`
- **מה קורה:** קוד ה-dropdown של Nominatim suggestions משוכפל פעמים רבות עם וריאציות מינוריות.
- **פתרון:** לחלץ ל-component משותף `<AddressAutocompleteInput onPick={...} />`.

### 5. כפילות פונקציות `bearingArrow`
- **קובץ:** `src/pages/HomePage.jsx:14-15`, `src/components/sos/SOSOverlay.jsx:7-11`
- **מה קורה:** אותה פונקציה מוגדרת פעמיים.
- **פתרון:** להעביר ל-`src/lib/geo.js`.

### 6. שדה `bg`/`text`/`border` ב-`shelterTypes.js` לא בשימוש
- **קובץ:** `src/constants/shelterTypes.js:8-10, 18-20, 28-30`
- **מה קורה:** השדות `bg: 'bg-blue-500'`, `text:`, `border:` מוגדרים אבל בקוד משתמשים רק ב-`color` ישירות (hex).
- **פתרון:** למחוק את השדות.

### 7. `BottomNav` משתמש ב-`useLang` אבל לא נכשל אם ההקשר חסר — בזכות fallback בקובץ
- **קובץ:** `src/context/LanguageContext.jsx:34-39`
- **הערה:** Pattern בעייתי — fallback שקט מסתיר באגים בעתיד.

### 8. `index.css:30-31` — height: 100% וגם 100dvh בשורה אחת
- **קובץ:** `src/index.css:29-31`
- **מה קורה:** `height: 100%; height: 100dvh;` — דפדפנים ישנים יקבלו 100%, חדשים 100dvh. זה תקין כ-progressive enhancement, אבל אם React StrictMode מתלונן זה מסתבר.

### 9. אין `aria-label` לכפתורים מסוימים
- דוגמה: `src/components/ui/Drawer.jsx:21` — כפתור "×" בלי `aria-label="סגור"`.

### 10. `vite.config.js:53-63` — proxy ל-oref מוגדר רק ב-dev
- **קובץ:** `vite.config.js:53`
- **מה קורה:** ה-proxy עובד ב-`vite dev`. בפרודקשן (Vercel) לא יעבוד — `fetchActiveAlerts` יקרא ל-`/oref/...` שלא קיים.
- **פתרון:** להגדיר Vercel rewrite, או להעביר את הקריאה ל-Cloud Function.

---

## בעיית אלגוריתם המסלול 🗺️

### המצב הנוכחי
ב-`src/lib/routeAlgorithm.js`, יש שתי פונקציות:
1. **`buildCircularRoute`** (שורות 11-74): מסננת מקלטים ברדיוס של חצי-יעד, ואז בונה "Greedy Nearest Neighbour" ביניהם. מוחזר מערך של נקודות `{lat,lng}` של בית → מקלט1 → מקלט2 → ... → בית.
2. **`buildPointToPointRoute`** (שורות 81-128): מסננת מקלטים שנופלים בתוך "מסדרון" סביב הקו הישר בין start ל-end, ומחזירה רשימת waypoints ממוינים.

ב-`RoutePolyline.jsx:10-18` מצוירים שני `Polyline` ישרים בין הנקודות הללו.

### הבעיה
**זה לא מסלול ריצה. זה קווים ישרים על מפה.** ה-`waypoints` הם קואורדינטות של נקודות עניין בלבד — אין שום ניסיון לחבר בין הנקודות דרך רחובות, מדרכות, שבילי ריצה, פארקים. כשהמשתמש לוחץ "חשב מסלול" מוצג קו ישר שעובר דרך בתים, בלוקים, חצרות פרטיות, וגם חוצה כבישים סואנים וצמתים בכיוון לא אפשרי לרגל.

### מה חסר
- **API ניתוב (Routing API)** — שום קריאה ל-OSRM, GraphHopper, Mapbox Directions, Valhalla, או OpenRouteService.
- **גרף רחובות** — אין נתוני OSM ways/edges. אפילו לא חישוב elevation.
- **מסלול שניתן ללכת/לרוץ עליו בפועל** — `profile=foot` או `profile=running`.

### שיקול מקלטים
האלגוריתם **כן** מתחשב בקרבה למקלטים — הוא בורר waypoints שיש להם מקלט בקרבה (corridor 150m, או מקלטים `local` ברדיוס היעד). אבל הוא בורר את ה-waypoints ולא בודק שכל **נקודה לאורך המסלול** קרובה למקלט. הציון `calcSafetyScore` ב-`safetyScore.js:8-22` כן עושה sample לאורך הקו הישר ובודק כיסוי — אבל זה על קו ישר, לא על מסלול אמיתי. בשטח, המסלול האמיתי דרך הרחובות יהיה ארוך יותר ויעבור באזורים שלא נדגמו.

### המלצה לתיקון

**שלב 1 — שילוב OSRM (מהיר, חינם, פתוח):**
```js
async function streetRouteBetween(a, b) {
  const url = `https://router.project-osrm.org/route/v1/foot/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`
  const res = await fetch(url)
  const data = await res.json()
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }))
}
```

**שלב 2 — לעטוף את `buildCircularRoute` עם:**
```js
export async function buildCircularRouteOnStreets(home, shelters, targetKm) {
  const waypointPlan = buildCircularRoute(home, shelters, targetKm) // התוכנית הקיימת
  const segments = []
  for (let i = 0; i < waypointPlan.waypoints.length - 1; i++) {
    const seg = await streetRouteBetween(waypointPlan.waypoints[i], waypointPlan.waypoints[i+1])
    segments.push(...seg)
  }
  return { ...waypointPlan, waypoints: segments }
}
```

**שלב 3 — `RoutePage.jsx:64-71` שיהיה async:**
```js
startTransition(async () => {
  const result = await buildCircularRouteOnStreets(...)
  setRoute(result)
  setScore(calcSafetyScore(result.waypoints, shelters))
})
```

**אלטרנטיבה:** GraphHopper API חינמי עד 500 קריאות/יום — תומך ב-`profile=foot`. או OpenRouteService (1000/יום בחינם, מצריך API key).

**הערה חשובה:** OSRM הציבורי (`router.project-osrm.org`) מבקש לא להשתמש בו לפרודקשן בכמויות גדולות. כדאי לארח OSRM משלכם או להשתמש ב-GraphHopper/ORS עם key.

---

## תכניות עתידיות מהקוד

1. **`createSharedRoute`** ב-`firestore.js:112-123` — נכתב פונקציה לשמירת מסלול משותף, אבל אין UI שמשתמש בה. נראה שהוכן לכפתור "שתף מסלול" שטרם מומש.
2. **`SharedRoutePage`** קיים (`src/pages/SharedRoutePage.jsx`) ויש לו route ב-`App.jsx:51` — אבל אין דרך ליצור קישור כזה (כי `createSharedRoute` לא נקרא).
3. **`getCityWebsiteUrl` + `WEBSITE_CITIES`** ב-`publicShelters.js` — עיריות שעדיין אין להן API. מבנה מוכן להרחבה.
4. **`useAlerts(userCity)`** עם `userCity` — מצפה לעיר משתמש מהפרופיל, אבל ה-hook נקרא תמיד עם `null` (HomePage:115, MapPage:349). פיצ'ר לא גמור.
5. **`saveUserCity`** ב-`firestore.js:53-55` — קיים אבל לא נקרא משום מקום. מוכן לטופס "בחירת עיר" שלא נבנה.
6. **שדות `sharedVia`, `importedFrom` ב-shelter** — מבנה למעקב אחרי שיתופים, מומש חלקית.

אין תגיות `TODO`/`FIXME` בקוד — סימן טוב לסדר, אבל יש הרבה `dead code` שמסמן פיצ'רים מתוכננים.

---

## מה עובד טוב

- **אדריכלות נקייה** — חלוקה מצוינת ל-`pages` / `components` / `hooks` / `lib` / `firebase`.
- **`React.memo` ב-markers** — `ShelterMarker` ו-`UserMarker` ממומוזים, חוסך re-renders יקרים על leaflet.
- **`Suspense` + `lazy`** ב-`App.jsx` — code-splitting אגרסיבי, bundle ראשון קטן.
- **`AbortController` ב-`useAddressAutocomplete`** — מבטל בקשות בעיתיות, debounce מסודר.
- **PWA + offline cache** — `vite-plugin-pwa` עם runtimeCaching ל-tiles ו-Nominatim, בנוסף IndexedDB ל-shelters.
- **`geoPointToLatLng`** מקבל גם GeoPoint וגם {lat,lng} — defensive coding טוב, מונע קריסות.
- **`SOSOverlay` עם wakeLock + vibrate** — UX מצוין למצבי חירום.
- **שימוש ב-`startTransition`** ב-`RoutePage` — מונע jank בחישוב מסלול כבד.
- **`React Compiler`** מופעל ב-`vite.config.js` — אופטימיזציות אוטומטיות ל-React 19.

---

## סיכום ממצאים
| רמה | כמות |
|-----|------|
| קריטי 🔴 | 3 |
| חשוב 🟡 | 9 |
| קל 🟢 | 10 |

**הציון הכולל:** 6/10 — האדריכלות חזקה, אבל הפיצ'ר המרכזי של האפליקציה (תכנון מסלול) לא משרת את התכלית שלו, ויש באג קריטי בדף ייבוא.
