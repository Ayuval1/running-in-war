# Design Tokens — Visual System

Source of truth — `tailwind.config.js` + `src/index.css`. **כל הערכים האלה אמיתיים. אסור להוסיף/לשנות בלי אישור.**

## Color Palette (Tactical Dark)

### Brand — Tailwind class prefix `brand-*` + CSS var `--brand-*`
| Token | Hex | Use |
|-------|-----|-----|
| `brand-bg` | `#070D18` | App background — הכי כהה |
| `brand-surface` | `#0C1929` | Surface — שכבה מעל bg |
| `brand-card` | `#0F2035` | Card backgrounds |
| `brand-border` | `#1A3050` | Borders, dividers |
| `brand-red` | `#FF1744` | **חירום בלבד.** SOS, אזעקה, errors קריטיים |
| `brand-neon` | `#00E5A0` | פעולה אקטיבית, "בטוח", פעיל ב-nav, GPS on |
| `brand-gold` | `#FFB800` | אזהרה, warning, מצב ביניים |
| `brand-blue` | `#3B9EFF` | Info, ערים, מקלטים ציבוריים |
| `brand-text` | `#E6F4F0` | טקסט עיקרי — כמעט לבן עם גוון cyan |
| `brand-dim` | `#3D7070` | טקסט משני, labels, "GPS off" |

### Shelter Type Colors
| Type | Color | Hebrew | Use |
|------|-------|--------|-----|
| `shelter-building` | `#3B9EFF` | בניין | אותו כמו `brand-blue` |
| `shelter-municipal` | `#00E5A0` | עירוני | אותו כמו `brand-neon` |
| `shelter-safe_room` | `#FF9F1C` | ממ"ד | כתום חם — היחיד בפלטה |

### Color Usage Rules
- **אדום `brand-red`** = **חירום בלבד.** אסור לכפתורי נווט / cancel רגילים.
- **ירוק `neon`** = פעולה ראשית או "בטוח". אסור לטקסט פסיבי.
- **זהב `gold`** = אזהרה לא־קריטית. אסור לפעולות.
- **כחול `blue`** = מידע / מקלטים. אסור לפעולה ראשית.

## Typography

### Font Family
```css
font-family: 'Rubik', sans-serif;
```
**Rubik** — Variable font, weights 300-900, תומך עברית + Latin
**Space Mono** — backup לקריאות מספרים, weights 400 + 700

### Hosted Locally (לא CDN)
- `/fonts/rubik-hebrew.woff2`
- `/fonts/rubik-latin.woff2`
- `/fonts/rubik-latin-ext.woff2`
- `/fonts/space-mono-400.woff2`
- `/fonts/space-mono-700.woff2`

### Type Scale
| Use | Size | Weight | Class |
|-----|------|--------|-------|
| Hero (SOS button) | 20px | 900 (black) | `text-xl font-black` |
| H1 / page title | 18px | 700 | `text-lg font-bold` |
| H2 / section | 16px | 700 | `text-base font-bold` |
| Body | 14px | 500 | `text-sm font-medium` |
| Body small | 13px | 500 | `text-[13px] font-medium` |
| Label / caption | 12px | 600 | `text-xs font-semibold` |
| Mono / data | 12-13px | 700 | `text-xs font-bold mono` |
| Tiny label | 10px | 700 + tracking-widest uppercase | `text-[10px] font-bold tracking-widest uppercase` |

**Hard minimum:** 12px (לא תרד מתחת לזה גם ב-labels).

### Mono Usage — Always for:
- מספרים שמתעדכנים בזמן אמת (מרחק, ETA, מהירות)
- קואורדינטות
- אחוזים בציון בטיחות
- GPS status, timer
- כל מספר עם `tabular-nums`

```jsx
<span className="mono tabular-nums">2.34 ק"מ</span>
```

## Shadows & Glows

### Box Shadows (Tailwind)
```js
'neon':    '0 0 0 1px rgba(0,229,160,0.25), 0 0 24px rgba(0,229,160,0.15)'
'neon-lg': '0 0 0 1px rgba(0,229,160,0.35), 0 0 40px rgba(0,229,160,0.25)'
'red':     '0 0 0 1px rgba(255,23,68,0.35), 0 0 32px rgba(255,23,68,0.25)'
'red-lg':  '0 0 0 4px rgba(255,23,68,0.2),  0 8px 40px rgba(255,23,68,0.35)'
```

Classes: `shadow-neon`, `shadow-neon-lg`, `shadow-red`, `shadow-red-lg`

### CSS Variables (for inline style)
```css
--glow-neon: 0 0 0 1px rgba(0,229,160,0.25), 0 0 24px rgba(0,229,160,0.15);
--glow-red:  0 0 0 1px rgba(255,23,68,0.35), 0 0 32px rgba(255,23,68,0.25);
```

### Utility Classes
- `.glow-neon` / `.glow-red` — box-shadow
- `.text-glow-neon` / `.text-glow-red` — text-shadow
- `.tactical-grid` — radial-gradient dot grid ברקע

## Spacing
**Tailwind 4px scale.** כל רווח = כפולה של 4px.
- `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px) — נפוצים
- `px-4 py-3` — padding סטנדרטי לכרטיסים
- `p-5` — padding נדיב למודאלים

## Border Radius
| Class | Value | Use |
|-------|-------|-----|
| `rounded-md` | 6px | **לא להשתמש לכפתורים גדולים** |
| `rounded-lg` | 8px | inputs, small buttons |
| `rounded-xl` | 12px | cards, חלקי UI רגילים |
| `rounded-2xl` | 16px | drawers, large modals, hero buttons |
| `rounded-full` | 9999px | FAB buttons (SOS), pills, avatars |

## Animations (ב-`index.css`)

### Defined
| Name | Duration | Use |
|------|----------|-----|
| `radar` | 2s infinite | טבעות רדאר סביב SOS button |
| `gps-ping` | 2s infinite | פעימת GPS indicator |
| `pulse` (user-pulse) | 2s infinite | פעימת מיקום משתמש במפה |
| `slideUp` (drawer-enter) | 0.3s once | פתיחת drawer |
| `alert-pulse` | 1.1s infinite | באנר אזעקה |
| `fadeIn` (page-enter) | 0.22s once | מעבר בין מסכים |
| `shimmer` | 1.5s infinite | loading states |
| `scan` | (rarely used) | שכבת scan-line |

### Easing Standards
- מהיר/מענה: `cubic-bezier(0.32, 0.72, 0, 1)` — Apple-style snap
- חירום/דחוף: `ease-out` עם infinite
- מעבר רגיל: `ease`

### Reduced Motion (חובה)
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
**Exception:** ראה `accessibility.md` — `.gps-ping` ו-`.radar-ring` חייבים להישאר חיים.

## Backdrop / Overlays
- **Overlay אפל:** `bg-black/60 backdrop-blur-sm` — סטנדרט לכל מודאל
- **Nav bar transparent:** `rgba(7,13,24,0.92) + backdrop-filter: blur(20px)` — bottom nav
- **Glass card:** `rgba(11,22,40,0.96)` + border `rgba(59,158,255,0.2)` — dropdowns

## Tactical Background Pattern
```css
.tactical-grid {
  background-image: radial-gradient(circle, rgba(0,229,160,0.055) 1px, transparent 1px);
  background-size: 28px 28px;
}
```
שימוש: רקע למסך Home, mood של "מערכת מבצעים".

## Z-Index Scale
| z | Use |
|---|-----|
| z-10 | Default elevated |
| z-40 | Floating action button (SOS) |
| z-50 | Bottom navigation |
| z-60 | Drawer / modal |
| z-[1000] | Leaflet popups / overlays על מפה |
| z-[9999] | SOS Overlay full screen (חירום קריטי) |

## Safe Areas (iOS notch / PWA)
```css
.pt-safe     { padding-top:    env(safe-area-inset-top,    0px); }
.pb-safe     { padding-bottom: env(safe-area-inset-bottom, 0px); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
```

## When You Need a New Token
**אל תוסיף.** במקום זה:
1. בדוק אם הצבע הקיים מספיק
2. אם לא — שאל את יובל
3. אם מאושר — הוסף ב-`tailwind.config.js` **ו**-ב-`src/index.css` (CSS vars) **ו**-בקובץ הזה
