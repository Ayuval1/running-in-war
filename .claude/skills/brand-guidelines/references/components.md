# Components — Building Blocks

הקובץ הזה הוא ה-vocabulary של ה-UI. כל קומפוננטה חדשה צריכה להידמות לאחת מאלה — או לקבל אישור על הוספה חדשה.

## Buttons

### Primary (פעולה ראשית — neon)
```jsx
<button
  className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform cursor-pointer"
  style={{
    background: '#00E5A0',
    color: '#070D18',
    boxShadow: '0 0 20px rgba(0,229,160,0.25)',
  }}
>
  <Map size={17} strokeWidth={2} />
  פתח מפה
</button>
```
**מתי:** פעולה ראשית במסך, "פתח מפה", "תכנן מסלול", "שמור".
**אסור:** יותר מ-1 בכל מסך.

### Secondary (פעולה משנית — surface)
```jsx
<button
  className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm active:scale-95 transition-all cursor-pointer"
  style={{
    background: 'rgba(15,32,53,0.8)',
    border: '1px solid rgba(26,48,80,0.9)',
    color: '#E6F4F0',
  }}
>
  <Map size={15} strokeWidth={2} />
  מפה
</button>
```
**מתי:** פעולות משניות, navigation בין מסכים.

### SOS Button (FAB)
```jsx
<button
  className="fixed bottom-24 right-4 z-40 w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-90 transition-transform"
  style={{
    background: 'radial-gradient(circle at 35% 35%, #FF4060, #FF1744)',
    boxShadow: '0 0 0 2px rgba(255,23,68,0.3), 0 0 40px rgba(255,23,68,0.4), 0 4px 16px rgba(0,0,0,0.6)',
  }}
>
  <span className="radar-ring" style={{ borderColor: '#FF1744' }} />
  <span className="radar-ring radar-ring-2" style={{ borderColor: '#FF1744' }} />
  <span className="radar-ring radar-ring-3" style={{ borderColor: '#FF1744' }} />
  <AlertOctagon size={26} strokeWidth={2.5} className="text-white" />
  <span className="text-[10px] font-bold tracking-widest text-white/90 font-mono">SOS</span>
</button>
```
**מתי:** כפתור SOS תמידי במסכי מפה.
**אסור:** לחסום אותו עם modals. לעולם.

### Destructive (delete)
```jsx
<button
  className="flex-shrink-0 p-1.5 rounded-lg cursor-pointer active:scale-90 transition-transform"
  style={{ color: '#FF4154', background: 'rgba(255,65,84,0.08)' }}
>
  <Trash2 size={15} strokeWidth={2} />
</button>
```
**אזהרה:** דרוש `confirm()` לפני פעולה הרסנית.

### Disabled
- `disabled:opacity-50`
- `disabled:cursor-not-allowed` (לא חובה — opacity מספיק)

### Sizes
| Size | Padding | Min height | Use |
|------|---------|------------|-----|
| Small | `px-3 py-1.5` | 32px | inline actions |
| Medium | `px-4 py-2.5` | 40px | nav, secondary |
| Large | `px-6 py-3` | 44px | primary actions |
| Hero | `py-6 + min-h-100` | 100px | SOS hero, CTA ראשי במסך |

**Minimum tap target:** 44×44px (Apple HIG).

---

## Cards

### Standard Card
```jsx
<div
  className="flex items-center gap-3 rounded-xl px-4 py-3"
  style={{
    background: 'linear-gradient(135deg, #0F2035, #0C1929)',
    border: '1px solid rgba(26,48,80,0.9)',
  }}
>
  {/* content */}
</div>
```

### Shelter Card (with side-accent)
```jsx
<div
  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-right"
  style={{
    background: 'linear-gradient(135deg, #0F2035 0%, #0C1929 100%)',
    border: '1px solid rgba(26,48,80,0.9)',
    borderRight: `3px solid ${typeColor}`,  // ← accent כיוון סוג המקלט
  }}
>
  {/* direction arrow + distance, name + address + type badge, ETA */}
</div>
```

### Hero Card (SOS button)
```jsx
<div
  className="relative w-full rounded-2xl overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, #1A0A10 0%, #200813 100%)',
    border: '1px solid rgba(255,23,68,0.25)',
    boxShadow: '0 0 0 1px rgba(255,23,68,0.1), 0 8px 40px rgba(255,23,68,0.15)',
    minHeight: 100,
  }}
>
  {/* background glow blob + content */}
</div>
```

---

## Drawer (Bottom Sheet)
**File:** `src/components/ui/Drawer.jsx`

```jsx
<Drawer open={open} onClose={close} title="כותרת">
  {/* content */}
</Drawer>
```

**Properties:**
- Backdrop: `bg-black/60 backdrop-blur-sm`
- Panel: `bg-brand-card rounded-t-2xl max-h-[85vh]`
- Animation: `drawer-enter` (slideUp 0.3s)
- Handle: bar 40×4px עליון
- Header: title + ✕ button
- Content: `overflow-y-auto` + safe-bottom padding

**מתי:** טפסים, רשימות ארוכות, picker.

---

## Modal / Overlay (Full Screen)
**File:** `src/components/sos/SOSOverlay.jsx` — דוגמה לרצינית

**Standard pattern:**
```jsx
<div className="fixed inset-0 z-[9999] flex flex-col">
  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
  {/* content */}
</div>
```

---

## Bottom Navigation
**File:** `src/components/ui/BottomNav.jsx`

```jsx
<nav
  className="fixed bottom-0 left-0 right-0 z-50 flex safe-bottom"
  style={{
    background: 'rgba(7,13,24,0.92)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(26,48,80,0.8)',
  }}
>
  {/* NavLink items */}
</nav>
```

**Active state:**
- Active color: `#00E5A0` (neon)
- Inactive color: `#3D7070` (dim)
- Active indicator: 2px dot על הראש
- Icon strokeWidth: 2.5 active, 1.8 inactive

**4 items קבועים:** Home, Map, Route, Profile. אל תוסיף 5.

---

## Inputs

### Text Input
```jsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-xl text-base"
  style={{
    background: 'rgba(15,32,53,0.8)',
    border: '1px solid rgba(26,48,80,0.9)',
    color: '#E6F4F0',
  }}
  placeholder="חפש כתובת..."
/>
```

### Autocomplete (suggestions list)
```jsx
{suggestions.map(item => (
  <button
    onClick={() => pick(item)}
    className="w-full text-right px-4 py-2.5 hover:bg-white/5"
  >
    <span className="text-sm">{item.label}</span>
  </button>
))}
```

---

## Badges / Pills

### Type Badge (small label)
```jsx
<span
  className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded"
  style={{ background: `${color}18`, color }}  // ← 18 = 9% opacity
>
  {emoji} {label}
</span>
```

### Counter Badge (on icon)
```jsx
<span
  className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
  style={{ background: '#3B9EFF', color: '#fff' }}
>
  {count}
</span>
```

### Status Dot
```jsx
<span
  className="w-2.5 h-2.5 rounded-full"
  style={{ background: active ? '#00E5A0' : '#3D7070' }}
/>
```

---

## Progress Bars

### Linear Bar
```jsx
<div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,48,80,0.8)' }}>
  <div
    className="h-full rounded-full transition-all duration-700"
    style={{ width: `${pct}%`, background: color }}
  />
</div>
```

**Color logic:**
- 0-39%: `#FF4154` (red)
- 40-79%: `#FFB800` (gold)
- 80-100%: `#00E5A0` (neon)

---

## Indicators

### GPS Status
```jsx
<div className="flex items-center gap-2">
  <div className="relative w-2.5 h-2.5">
    {active && <span className="absolute inset-0 rounded-full gps-ping" style={{ background: 'rgba(0,229,160,0.4)' }} />}
    <span className="relative w-2.5 h-2.5 rounded-full" style={{ background: active ? '#00E5A0' : '#3D7070' }} />
  </div>
  <span className="text-xs font-semibold tracking-wide mono" style={{ color: active ? '#00E5A0' : '#3D7070' }}>
    {active ? 'GPS ON' : 'GPS...'}
  </span>
</div>
```

### Alert Banner (top)
```jsx
<div
  className="flex items-center justify-center gap-2 font-black text-sm px-4 py-2.5 alert-pulse"
  style={{ background: '#FF1744', color: '#fff' }}
>
  <AlertOctagon size={15} strokeWidth={2.5} />
  אזעקה פעילה — לך למקלט עכשיו!
</div>
```

---

## Map Overlay Panel (פאנל פילטר על מפה)

כשלוחצים על כפתור פילטר במפה (ערים, סוגי מקלטים וכד') — הפאנל נפתח כ**centered overlay** במרכז המסך, לא כ-dropdown ולא כ-bottom drawer.

### Trigger Button (pill)
```jsx
<button
  className="absolute top-24 right-3 z-[1000] flex items-center gap-2 px-4 rounded-full cursor-pointer active:scale-95 transition-transform"
  style={{
    height: 44,
    background: 'rgba(11,25,47,0.92)',  // תמיד אטום — לא משתנה כשפעיל!
    border: `1px solid ${hasActive ? 'rgba(59,158,255,0.65)' : 'rgba(59,158,255,0.25)'}`,
    boxShadow: hasActive
      ? '0 0 0 2px rgba(59,158,255,0.12), 0 0 20px rgba(59,158,255,0.3), 0 2px 12px rgba(0,0,0,0.5)'
      : '0 2px 12px rgba(0,0,0,0.5)',
  }}
>
  <Icon size={15} strokeWidth={2.2} color={hasActive ? '#3B9EFF' : '#3D7070'} />
  <span className="text-xs font-semibold" style={{ color: hasActive ? '#3B9EFF' : '#3D7070' }}>
    תווית
  </span>
  {hasActive && (
    <span style={{ background: '#3B9EFF', color: '#070D18', /* badge */ }}>
      {count}
    </span>
  )}
</button>
```
**חוק קריטי:** `background` של הכפתור **לא משתנה** בין active/inactive — תמיד `rgba(11,25,47,0.92)`. רק border + glow + צבע טקסט משתנים. אחרת הכפתור נראה שקוף על המפה.

### Overlay Panel
```jsx
{open && (
  <div
    className="fixed inset-0 z-[1001] flex items-center justify-center"
    onClick={() => setOpen(false)}
  >
    <div
      className="absolute inset-0"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    />
    <div
      className="relative w-[92%] flex flex-col"
      style={{
        maxWidth: 380,
        background: 'rgba(15,32,53,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(59,158,255,0.2)',  // blue לפילטר ערים; neon למקלטים
        borderRadius: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header: כותרת + badge count + כפתור X */}
      {/* List: שורות עם checkbox עיגול, שם, מספר */}
    </div>
  </div>
)}
```

**כללים:**
- `z-[1001]` — מעל המפה (`z-[1000]`) אבל מתחת ל-SOS (`z-[9999]`)
- לחיצה על backdrop סוגרת
- `e.stopPropagation()` על הכרטיס עצמו
- שורות: `minHeight: 52`, `active:scale-[0.98]`, accent ימין לפעיל

**לא להשתמש ב:**
- ❌ dropdown שנפתח מתחת לכפתור — חוסם את הכפתור
- ❌ bottom Drawer — פחות מתאים לפילטרים קצרים
- ❌ `background: rgba(59,158,255,0.15)` על כפתור פעיל — נראה שקוף

---

## Map Markers

### Shelter Marker
- Shape: teardrop (`border-radius: 50% 50% 50% 0; transform: rotate(-45deg)`)
- Inner icon: rotated back `transform: rotate(45deg)`
- Border: `2px solid rgba(255,255,255,0.35)`
- Shadow: `0 2px 12px rgba(0,0,0,0.5)`
- Color: לפי type (building=blue, municipal=neon, safe_room=orange)

### User Marker
- Center dot + pulse ring
- Color: `brand-neon`

---

## Section Headers (uppercase mono labels)
```jsx
<div className="flex items-center gap-2 px-1">
  <span className="text-[10px] font-bold tracking-widest uppercase mono" style={{ color: '#3D7070' }}>
    מקלטים קרובים
  </span>
  <div className="flex-1 h-px" style={{ background: 'rgba(26,48,80,0.7)' }} />
</div>
```
**טון:** קטן, dim, tracking-widest, uppercase (גם בעברית — נראה טוב), עם קו מפריד.

---

## Layout Containers

### Full screen page
```jsx
<div
  className="fixed inset-0 flex flex-col tactical-grid"
  style={{
    background: 'linear-gradient(180deg, #070D18 0%, #0A1220 100%)',
    paddingTop: 'env(safe-area-inset-top, 0px)',
  }}
>
  {/* top bar, content, bottom nav */}
</div>
```

### Scrollable content area
```jsx
<div className="flex-1 overflow-y-auto px-4 py-4 pb-28 flex flex-col gap-4">
  {/* cards stack */}
</div>
```
**Note:** `pb-28` משאיר מקום ל-bottom nav.

---

## Common Mistakes — אל תעשה

1. ❌ `rounded-md` לכפתורים גדולים — תשתמש ב-`rounded-xl` / `rounded-2xl` / `rounded-full`
2. ❌ אייקון בלי `strokeWidth` — תמיד תגדיר 1.8-2.5
3. ❌ צבע inline שלא מהפלטה — תמיד מ-tokens
4. ❌ `text-[11px]` — לא יורדים מ-12px
5. ❌ `transition-all` בלי דחיפות — תמיד `transition-transform` או ספציפי
6. ❌ `:hover` בלי `:active` — mobile-first, חייב active state
7. ❌ קומפוננטה חדשה בלי לבדוק אם דומה קיימת
8. ❌ אייקון מספרייה אחרת חוץ מ-lucide-react

---

## When You Need a New Component
**אל תיצור בלי אישור.** במקום זה:
1. בדוק אם דומה קיים ב-`src/components/`
2. בדוק אם הרכבה של 2 קיימים פותרת
3. אם באמת חדש — שאל את יובל עם:
   - איך נראה (sketch / wireframe)
   - איפה ישתמשו בו
   - האם stateful או pure
   - תלוי בנתונים (hooks?)
