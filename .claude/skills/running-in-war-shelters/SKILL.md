---
name: running-in-war-shelters
description: Use when working on RunningInWar shelter data — fixing a shelter that appears in the wrong location on the map, adding shelters from a new city, or running a full verification pass on all shelters. Trigger on: "מקלט במיקום לא נכון", "תוסיף עיר", "תסרוק אתר עירייה", "תקן מקלט", "תבדוק את כל המקלטים", or any mention of city shelter coordinates being wrong.
---

# RunningInWar — ניהול נתוני מקלטים

שלושה תהליכים: **תיקון מקלט שגוי**, **הוספת עיר חדשה**, ו-**בדיקת כל המקלטים**.

## Firestore — מבנה רשומה
```js
// קולקציה: city_shelters
{
  city:     'kiryat_ata',      // snake_case
  address:  'ויצמן 1',         // כתובת בעברית
  notes:    'עלי',             // שימוש נוכחי
  lat:      32.8140457,
  lng:      35.1150417,
  verified: true               // false = geocoded אוטומטי, true = אומת
}
```

## City Bboxes — תמיד עדכניות
```js
const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.810, maxLat: 32.858, minLng: 35.058, maxLng: 35.118 },
  kiryat_yam:     { minLat: 32.810, maxLat: 32.865, minLng: 35.040, maxLng: 35.092 },
  kiryat_motzkin: { minLat: 32.818, maxLat: 32.868, minLng: 35.062, maxLng: 35.118 },
  kiryat_haim:    { minLat: 32.786, maxLat: 32.848, minLng: 35.040, maxLng: 35.092 },
  kiryat_ata:     { minLat: 32.778, maxLat: 32.852, minLng: 35.072, maxLng: 35.142 },
}
```

---

## תהליך A — תיקון מקלט שגוי

**שלב 1 — שאל:**
"מה הכתובת של המקלט ובאיזו עיר?"

**שלב 2 — מצא רשומה ב-Firestore:**
```js
// scripts/ — Node.js ESM, firebase-admin, service-account.json
db.collection('city_shelters')
  .where('city', '==', city)
  .where('address', '==', address)
  .get()
```
שמור doc ID + קואורדינטות נוכחיות.

**שלב 3 — קואורדינטות נכונות מ-Google Maps דרך Playwright:**
```js
// 1. navigate
await page.goto(`https://www.google.com/maps/search/${address},+${cityHe},+ישראל`)
// 2. extract from URL after redirect
const url = await page.evaluate(() => window.location.href)
// 3. parse /@lat,lng, from URL
const match = url.match(/@([\d.]+),([\d.]+)/)
const lat = parseFloat(match[1]), lng = parseFloat(match[2])
```

**שלב 4 — בדוק bbox:**
אם מחוץ ל-bbox: הצג ⚠️ ושאל אישור לפני המשך.

**שלב 5 — הצג ואשר:**
```
כתובת:              [כתובת], [עיר]
קואורדינטות נוכחיות: lat=[X], lng=[Y]
קואורדינטות חדשות:   lat=[A], lng=[B]
bbox: ✓ / ⚠️
```
**אל תכתוב ל-Firestore לפני אישור מפורש.**

**שלב 6 — עדכן:**
```js
col.doc(docId).update({ lat, lng, verified: true })
```

---

## תהליך B — הוספת עיר חדשה

**שלב 1 — קבל קלט:**
שאל: "שם העיר (בעברית + snake_case) + URL אתר עירייה (אופציונלי)?"

**שלב 2 — bbox אוטומטי:**
1. Playwright → `https://www.google.com/maps/search/[עיר],+ישראל`
2. חלץ lat/lng מה-URL
3. bbox = מרכז ± 0.035 בכל כיוון (מכסה עיר קטנה/בינונית):
```js
const bbox = {
  minLat: center.lat - 0.035, maxLat: center.lat + 0.035,
  minLng: center.lng - 0.035, maxLng: center.lng + 0.035,
}
```
הצג את ה-bbox למשתמש לאישור.

**שלב 3 — חלץ מקלטים מהאתר:**

אתרי ערים שונים — פורמטים שונים. השתמש ב-Playwright (לא WebFetch, כי חלק חסומים):
```js
await page.goto(url)
// קרא את הדף, חפש טבלאות HTML או רשימות עם כתובות
// פורמטים נפוצים בקריות:
//   - טבלה: עמודות "כתובת" + "שימוש נוכחי"
//   - רשימה: "רח' [כתובת]" + סוג + אנשי קשר
```
חלץ: `[{ address, notes }]` — **בלי** שמות אנשי קשר ובלי טלפונים.

**שלב 4 — גיאוקוד כל כתובת (Nominatim + bbox):**
```js
const viewbox = `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`
const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address+', '+cityHe+', ישראל')}&format=json&countrycodes=il&limit=3&viewbox=${viewbox}&bounded=1`
// אם bounded=1 מחזיר ריק → נסה bounded=0 עם אותו viewbox
// אם עדיין ריק → סמן כ-NEEDS_MANUAL_FIX
```

**שלב 5 — אמת כל קואורדינטה:**
- בתוך bbox ✓ → `verified: false` (geocoded)
- מחוץ ל-bbox ✗ → דלג, הוסף לרשימת תיקון ידני
- NEEDS_MANUAL_FIX → הוסף לרשימת תיקון ידני

**שלב 6 — תיקון ידני לשארית:**
לכל כתובת ברשימה — Playwright → Google Maps → חלץ קואורדינטות → `verified: true`.

**שלב 7 — העלה ל-Firestore:**
```js
// Batch (max 400 per batch)
const col = db.collection('city_shelters')
const batch = db.batch()
shelters.forEach(s => batch.set(col.doc(), s))
await batch.commit()
```

**שלב 8 — עדכן import-city-shelters.mjs:**
הוסף לקובץ `scripts/import-city-shelters.mjs`:
1. את ה-bbox החדש ב-`CITY_BBOX`
2. את שם העיר ב-`CITY_NAMES_HE`
3. את רשימת הכתובות ב-`rawShelters`

**שלב 9 — עדכן diagnose-coords.mjs:**
הוסף את ה-bbox החדש גם ב-`scripts/diagnose-coords.mjs`.

**שלב 10 — הרץ diagnostic:**
```bash
node scripts/diagnose-coords.mjs
```
צפוי: 0 flagged לעיר החדשה.

**שלב 11 — commit + push:**
```bash
git add src/ scripts/
git commit -m "feat(data): add [city] shelters — N records"
git push origin main
vercel --prod
```

---

---

## תהליך C — בדיקת כל המקלטים (Full Verification)

עובר על כל המקלטים, מגיאוקוד כל אחד מחדש ב-Google Maps, ומדווח על חשודים.
**ריצה: ~15 דקות ל-159 מקלטים.**

**שלב 1 — שאל אילו ערים לבדוק:**
"לבדוק את כל הערים, או עיר ספציפית?"

**שלב 2 — שלוף מ-Firestore:**
```js
const snap = await db.collection('city_shelters').get()
const shelters = snap.docs.map(d => ({ id: d.id, ...d.data() }))
```

**שלב 3 — לכל מקלט: geocode ב-Google Maps דרך Playwright:**
```js
for (const s of shelters) {
  await page.goto(`https://www.google.com/maps/search/${s.address},+${CITY_NAMES_HE[s.city]},+ישראל`)
  const url = await page.evaluate(() => window.location.href)
  const match = url.match(/@([\d.]+),([\d.]+)/)
  if (!match) { flagged.push({ ...s, reason: 'Google Maps לא מצא' }); continue }
  const gLat = parseFloat(match[1]), gLng = parseFloat(match[2])
  const dist = haversineMeters(s.lat, s.lng, gLat, gLng)
  if (dist > 300) flagged.push({ ...s, gLat, gLng, dist })
}
```

חישוב מרחק (Haversine):
```js
function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
```

**שלב 4 — הצג דו"ח:**
```
בדקתי [N] מקלטים.

חשודים ([K]):
  [עיר] — [כתובת]
    שמור:   lat=[X], lng=[Y]
    Google: lat=[A], lng=[B]
    מרחק:   [D] מטרים

תקינים: [N-K]
```

**שלב 5 — תיקון חשודים:**
לכל חשוד — הצג ושאל: "לעדכן לקואורדינטות של Google?"
אם כן → `col.doc(id).update({ lat: gLat, lng: gLng, verified: true })`

---

## כלים נדרשים
- Firebase Admin SDK — `scripts/service-account.json`
- Playwright — לGMaps + סריקת אתרי עירייה
- Nominatim — גיאוקוד ראשוני
- `scripts/diagnose-coords.mjs` — אימות סופי
