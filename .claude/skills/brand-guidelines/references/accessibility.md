# Accessibility — חירום קודם

נגישות באפליקציה הזו זה לא "nice to have" — זה חיים-מוות. משתמש שלא יודע לנווט לכפתור SOS בזמן אזעקה, או שלא רואה את האזהרה כי הוא color-blind — לא מסתדר עם האפליקציה הזאת.

## Core Principles
1. **חירום קודם לכל** — שום החלטת UX לא יכולה לפגוע בנגישות SOS
2. **צבע + צורה תמיד** — לעולם לא רק צבע למידע קריטי
3. **תנועה חיונית נשארת** גם במצב reduced-motion
4. **קונטרסט גבוה** — WCAG AA מינימום, AAA למצבי חירום

---

## Color-Blindness (חשוב מאוד)
~8% מהגברים לא מבחינים אדום-ירוק (Deuteranopia / Protanopia).
**הכפתור האדום של SOS וכפתורי הפעולה הירוקים אצלם נראים אותו דבר.**

### Rule: Always Color + Icon/Shape
לעולם לא מסתמכים רק על צבע למידע קריטי. כל אינדיקטור = **צבע + צורה/אייקון/טקסט**.

✅ **דוגמאות נכונות:**
- SOS button: אדום **+ אייקון AlertOctagon + טקסט "SOS"**
- כפתור פעולה ראשי: ירוק **+ אייקון פעולה + טקסט תיאורי**
- Status pill: צבע **+ emoji סטטוס (✅/🟡/🔴) + טקסט**
- אזעקה: אדום **+ אייקון AlertOctagon + טקסט "אזעקה פעילה"**
- מקלט במפה: צבע סוג **+ אייקון 🛡 + צורת teardrop**

❌ **לא:**
- כפתור שמשתנה רק מירוק לאדום בלי אייקון/טקסט
- "סטטוס" שמיוצג רק בנקודה צבעונית בלי label
- מפה עם markers שמובחנים רק לפי צבע

### Distinct Shapes for Shelter Types
| Type | Color | Distinguishing feature beyond color |
|------|-------|-------------------------------------|
| Building | Blue | 🏢 emoji + label "בניין" |
| Municipal | Neon | 🛡 emoji + label "עירוני" |
| Safe room | Orange | 🚪 emoji + label "ממ"ד" |

---

## Reduced Motion — מה נשאר חי

ב-`index.css` יש כלל מעקף שמבטל את כל האנימציות אם המשתמש הפעיל "Reduce Motion" במכשיר.
**אבל יש 2 אנימציות שחייבות להישאר** — סיגנלי בטיחות קריטיים:

### MUST stay alive (override reduced-motion)
1. **`.gps-ping`** — פעימת GPS indicator. המשתמש חייב לדעת בזמן אמת אם GPS פועל.
2. **`.radar-ring`** (כל 3 הטבעות) — סביב כפתור SOS. הסיגנל הויזואלי שאומר "אני פה, אני מוכן".

### Override Pattern
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Critical safety signals — must remain animated */
  .gps-ping {
    animation: gps-ping 2s ease-out infinite !important;
  }
  .radar-ring {
    animation: radar 2s cubic-bezier(0.3, 0, 0.7, 1) infinite !important;
  }
}
```

**אם תוסיף אנימציה חירומית חדשה (e.g., אזעקה blinking)** — תוסיף אותה לחריגות `prefers-reduced-motion`.

---

## Contrast Requirements

### Standard UI: WCAG AA (4.5:1)
- Text on background: 4.5:1 מינימום
- Large text (18pt+): 3:1 מינימום
- UI components / icons: 3:1 מינימום

### Emergency UI: WCAG AAA (7:1)
- SOS button + טקסטים בתוכו
- אזעקה banner
- SOS Overlay content
- Error messages קריטיים

### Verified Pairs (already in palette)
| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `#E6F4F0` (text) | `#070D18` (bg) | ~18:1 | AAA |
| `#E6F4F0` (text) | `#0F2035` (card) | ~13:1 | AAA |
| `#00E5A0` (neon) | `#070D18` | ~10:1 | AAA |
| `#FF1744` (red) | `#070D18` | ~5:1 | AA |
| `#FFB800` (gold) | `#070D18` | ~10:1 | AAA |
| `#3D7070` (dim) | `#070D18` | ~3.5:1 | AA Large only |

**`brand-dim` (`#3D7070`):** השתמש רק לטקסט גדול (14px+) או לאיקונים. **אסור לטקסט גוף קטן.**

---

## Touch Targets
**Minimum 44×44px** (Apple HIG, WCAG 2.5.5).

### Existing Components
- SOS FAB: 76×76px ✅
- Primary buttons: 44px+ ✅
- Bottom nav items: 56px ✅
- Trash button: 30×30 ⚠️ — מותר כי inline בתוך card לחיץ. אם standalone — חייב 44.

### Rule
אם הכפתור עומד לבד (לא חלק מפעולה רחבה יותר): **44×44px מינימום.**

---

## Aria Labels — חובה

### Buttons עם אייקון בלבד
```jsx
<button aria-label="כפתור SOS — מצא מקלט קרוב">
  <AlertOctagon />
</button>
```

### Navigation
```jsx
<nav aria-label="ניווט ראשי">
  {/* ... */}
</nav>
```

### Status indicators
```jsx
<div role="status" aria-live="polite">
  GPS ON
</div>
```

### Alerts (חירום)
```jsx
<div role="alert" aria-live="assertive">
  אזעקה פעילה — לך למקלט עכשיו!
</div>
```
**`aria-live="assertive"`** — מקריא קוראי מסך מיד, מפסיק כל דיבור אחר. **השתמש רק לחירום.**

---

## Keyboard Navigation
- כל כפתור = `<button>` (לא `<div onClick>`)
- כל לינק = `<a>` או `<NavLink>`
- Focus visible: לא להעלים `:focus` ring
- Tab order: לוגי מ-top-right (RTL)
- Esc סוגר drawers/modals

### Drawer Esc Handler
```jsx
useEffect(() => {
  function onEsc(e) { if (e.key === 'Escape') onClose() }
  document.addEventListener('keydown', onEsc)
  return () => document.removeEventListener('keydown', onEsc)
}, [onClose])
```

---

## Screen Readers
- Hebrew text: `<html lang="he" dir="rtl">`
- מספרים עם יחידה: `<span aria-label="2.34 קילומטר">2.34 ק"מ</span>` (אופציונלי, אבל עוזר)
- אייקונים דקורטיביים: `aria-hidden="true"`
- אייקונים פונקציונליים: `aria-label="..."`

---

## Emergency UX — חוקים נוקשים

### SOS Button — Never blocked
- **לעולם** modal/popup/drawer שחוסם את SOS button במפה
- **לעולם** disabled state ל-SOS button אם יש מקלטים (גם אם GPS נחלש)
- אם אין GPS — SOS עדיין יראה את המקלטים האחרונים שנשמרו

### SOS Overlay — Lock screen
- `z-[9999]` — מעל הכל
- Backdrop blur מלא — מסתיר רעש
- כפתור "סגור" קיים אבל לא דומיננטי
- Live updates של מרחק/ETA כל שנייה
- Arrow + distance — לפחות 24px font

### Alert Banner — Always visible
- כשאזעקה פעילה (`activeAlert`) — banner קבוע למעלה
- `alert-pulse` animation (חייב להישאר ב-reduced-motion!)
- צבע אדום מלא `#FF1744`, טקסט לבן bold
- אייקון `AlertOctagon` משמאל לטקסט

### Vibration (חירום)
```js
if (navigator.vibrate) {
  navigator.vibrate([200, 100, 200])  // אזעקה: pattern דחוף
}
```
**מתי:** SOS overlay פותח, אזעקה התחילה.
**לא:** לא בשגרה. לא לפעולות רגילות.

---

## Forms
- `<label>` קיים לכל `<input>`
- שגיאות: בטקסט, לא רק בצבע
- Required: `aria-required="true"` + טקסט "(חובה)"
- Validation errors: `aria-invalid="true"` + `aria-describedby` שמצביע על error message

---

## Offline / Slow Network
- LoadingSpinner עם טקסט "טוען..."
- אם offline > 5 שניות: הצג "אין חיבור — מציג נתונים מקומיים"
- Critical data (shelters, home) חייב לעבוד offline
- Map tiles cached ב-Service Worker

---

## Testing Checklist — לפני שמרים feature ל-production

- [ ] עובר במצב Reduced Motion? (GPS ping + radar עוד חיים?)
- [ ] עובר עם Color Blind simulator (Chrome DevTools → Rendering)?
- [ ] כל כפתור 44×44+ או חלק מאזור לחיץ גדול?
- [ ] קונטרסט עובר WCAG AA (axe DevTools)?
- [ ] קוראי מסך (NVDA / VoiceOver) קוראים נכון?
- [ ] Keyboard נווט עובד? Esc סוגר?
- [ ] SOS עדיין נגיש מכל מסך?
- [ ] עברית RTL לא נשבר?
- [ ] עובד בטלפון אמיתי (לא רק DevTools)?

---

## When in Doubt
- אם רכיב נוגע בחירום — שאל את יובל
- אם לא בטוח שזה accessible — בדוק עם תוסף axe DevTools
- אם השינוי משפיע על SOS / alert / map markers — דורש אישור מפורש
