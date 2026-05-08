# Add Shelter Websites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add missing Krayot city shelter websites and the all-Israel government shelter map to the RunningInWar app.

**Architecture:** Add 2 missing cities (קרית מוצקין, קרית ים) to `CITY_RESOURCES` in `publicShelters.js` as `website` type entries. Add the all-Israel govmap link as a prominent button at the top of the `PublicSheltersForm` component in `MapPage.jsx`.

**Tech Stack:** React 18, Vite, existing `publicShelters.js` data layer

---

## Files

- Modify: `src/lib/publicShelters.js` — add 2 new city entries to `CITY_RESOURCES`
- Modify: `src/pages/MapPage.jsx` — add all-Israel govmap link in `PublicSheltersForm`

---

### Task 1: Add missing cities to publicShelters.js

**Files:**
- Modify: `src/lib/publicShelters.js`

- [ ] **Step 1: Open the file and locate CITY_RESOURCES**

File: `src/lib/publicShelters.js` lines 9–17.

Current `CITY_RESOURCES`:
```js
const CITY_RESOURCES = {
  'באר שבע':     { type: 'api', id: '23650a0e-43eb-4937-b3c4-7d161779e30f', latField: 'lat', lngField: 'lon' },
  'מעלה אדומים': { type: 'api', id: 'd35945fa-eb3c-4802-a956-73b6273017f6', latField: 'lat', lngField: 'lon' },
  'קרית ביאליק': { type: 'website', url: 'https://qbialik.org.il/%D7%97%D7%99%D7%A8%D7%95%D7%9D/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D-2/' },
  'פתח תקווה':   { type: 'website', url: 'https://www.petah-tikva.muni.il/city-and-municipality/emergency/receivers' },
  'רמת השרון':   { type: 'website', url: 'https://ramat-hasharon.muni.il/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D-%D7%A4%D7%AA%D7%95%D7%97%D7%99%D7%9D/' },
  'חיפה':        { type: 'website', url: 'https://www.haifa.muni.il/residents/emergency/' },
  'אשקלון':      { type: 'website', url: 'https://www.govmap.gov.il/?lay=218045' },
}
```

- [ ] **Step 2: Replace CITY_RESOURCES with updated version**

Replace the entire `CITY_RESOURCES` block with:
```js
const CITY_RESOURCES = {
  'באר שבע':     { type: 'api', id: '23650a0e-43eb-4937-b3c4-7d161779e30f', latField: 'lat', lngField: 'lon' },
  'מעלה אדומים': { type: 'api', id: 'd35945fa-eb3c-4802-a956-73b6273017f6', latField: 'lat', lngField: 'lon' },
  'קרית ביאליק': { type: 'website', url: 'https://qbialik.org.il/%D7%97%D7%99%D7%A8%D7%95%D7%9D/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D-2/' },
  'קרית מוצקין': { type: 'website', url: 'https://www.kiryat-motzkin.muni.il/%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D/' },
  'קרית ים':     { type: 'website', url: 'https://www.kiryat-yam.muni.il/203/' },
  'פתח תקווה':   { type: 'website', url: 'https://www.petah-tikva.muni.il/city-and-municipality/emergency/receivers' },
  'רמת השרון':   { type: 'website', url: 'https://ramat-hasharon.muni.il/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D-%D7%A4%D7%AA%D7%95%D7%97%D7%99%D7%9D/' },
  'חיפה':        { type: 'website', url: 'https://www.haifa.muni.il/residents/emergency/' },
  'אשקלון':      { type: 'website', url: 'https://www.govmap.gov.il/?lay=218045' },
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/publicShelters.js
git commit -m "feat: add קרית מוצקין and קרית ים shelter websites"
```

---

### Task 2: Add all-Israel govmap link to PublicSheltersForm

**Files:**
- Modify: `src/pages/MapPage.jsx` — `PublicSheltersForm` component (lines 284–343)

The govmap URL for all shelters in Israel: `https://govmap.gov.il/?c=219423.43,746245.6&z=4&lay=226453`

- [ ] **Step 1: Locate PublicSheltersForm in MapPage.jsx**

Find `function PublicSheltersForm` (line ~284). The component opens with:
```jsx
<div className="flex flex-col gap-4">
  <p className="text-white/40 text-sm leading-relaxed">
    חפש מקלטים ציבוריים לפי עיר.
  </p>
```

- [ ] **Step 2: Add govmap banner after the opening paragraph**

Replace:
```jsx
      <p className="text-white/40 text-sm leading-relaxed">
        חפש מקלטים ציבוריים לפי עיר.
      </p>

      <div className="flex flex-col gap-2">
```

With:
```jsx
      <p className="text-white/40 text-sm leading-relaxed">
        חפש מקלטים ציבוריים לפי עיר.
      </p>

      {/* All-Israel government shelter map */}
      <a
        href="https://govmap.gov.il/?c=219423.43,746245.6&z=4&lay=226453"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-400 font-bold py-3 rounded-xl active:scale-95 transition-transform cursor-pointer text-sm"
      >
        <Building2 size={15} strokeWidth={2} />
        מפת מקלטים ממשלתית — כל הארץ
      </a>

      <div className="flex flex-col gap-2">
```

- [ ] **Step 3: Verify Building2 is already imported**

Check line 6 of MapPage.jsx — `Building2` is already imported from `lucide-react`. No import change needed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: add all-Israel govmap link to public shelters drawer"
```

---

### Task 3: Push to GitHub

- [ ] **Step 1: Push**

```bash
git push
```

Expected output: `Branch 'main' set up to track remote branch 'main' from 'origin'.`

---

## Verification

1. Run `npm run dev`
2. Open the app → Map page → click "ציבורי" button
3. Verify a blue banner "מפת מקלטים ממשלתית — כל הארץ" appears at the top of the drawer — clicking it opens govmap in a new tab
4. Select "קרית מוצקין" from the city dropdown — verify a purple link button appears linking to kiryat-motzkin.muni.il
5. Select "קרית ים" from the city dropdown — verify link to kiryat-yam.muni.il/203/
6. Select "קרית ביאליק" — verify link still works (existing)
