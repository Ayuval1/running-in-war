# Route Start Point — Design Spec

## Goal

Add a manual start point (א׳) selector to RoutePage's point2point mode, so the user can plan routes from any location — not just GPS.

## Chosen Design: Direct Input (Option B)

Two symmetrical fields — א׳ and ב׳ look and behave identically:

- **א׳ field**: pre-filled with "📍 מיקומך הנוכחי" (GPS) — editable via address search or map tap. ✕ to clear (returns to GPS).
- **ב׳ field**: existing end-point field, unchanged behavior.
- Both have a "לחץ על המפה" button below them.
- No "שנה" button — fields are always directly interactive.

## State Changes

Add to `RoutePage`:

```js
const [startPoint, setStartPoint]       = useState(null)   // null = use GPS
const [startAddress, setStartAddress]   = useState('')
const [settingStart, setSettingStart]   = useState(false)
```

## buildRoute Change

```js
const origin = startPoint || position
if (!origin) { alert('ממתין ל-GPS...'); return }
```

## MapClickHandler Change

Change prop from `active={settingEnd}` / `onPick` to handle both start and end:

```jsx
<MapClickHandler
  picking={settingStart ? 'start' : settingEnd ? 'end' : null}
  onPick={(pos) => {
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

## UI Layout (point2point mode)

```
[ א׳ ]  📍 מיקומך הנוכחי          ✕     ← green filled chip
         📍 לחץ על המפה לבחירת א׳       ← green dashed button

  │  (connector line)

[ ב׳ ]  🔍 הקלד כתובת יעד...            ← blue input
         📍 לחץ על המפה לבחירת ב׳       ← blue dashed button

[ ↗ חשב מסלול ]
```

When GPS is unavailable and no start set → show alert "בחר נקודת התחלה".

## Map Overlay Banners

- `settingStart = true` → banner: "🟢 לחץ על המפה — נקודת התחלה (א׳)"
- `settingEnd = true`   → banner: "🎯 לחץ על המפה — נקודת סיום (ב׳)"

## Address Autocomplete for א׳

Same `useAddressAutocomplete` hook used for ב׳. When user types in א׳ field → suggestions appear → pick → `startPoint` set, `settingStart` cleared.

## Files to Change

| File | Change |
|------|--------|
| `src/pages/RoutePage.jsx` | Add state, update buildRoute, update MapClickHandler, add א׳ UI |

No new files needed.
