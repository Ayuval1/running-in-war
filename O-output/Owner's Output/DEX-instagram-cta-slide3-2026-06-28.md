# Instagram Carousel — Slide 3/3 — CTA | Design Spec
**DEX | 2026-06-28**

---

## Mission

שקופית 3 — סיום הקרוסלה. מניעה לפעולה. לאחר שה-hook עצר (שקופית 1) וה-proof בנה אמון (שקופית 2), שקופית זו סוגרת את הלולאה ומוציאה את המשתמש לפעולה. כל אלמנט ויזואלי מכוון לכפתור ה-CTA הירוק.

---

## Copy — המשפטים המנצחים

**Headline:**
> **"שים נעליים."** (לבן — הפשוט שלך)
> **"הורד עכשיו."** (ירוק זוהר — הפעולה שלנו)

**למה זה עובד:**
- מהדהד שקופית 1: "שמת נעליים. אנחנו דאגנו לשאר." — יוצר לולאה נרטיבית שלמה
- "שים" = ציווי עכשיו. לא עבר. מפעיל.
- "הורד עכשיו" = ירוק = פעולה אקטיבית — בדיוק לפי golden rule
- שתי שורות קצרות → קל לסרוק, קל לזכור

**CTA Button:**
> **"הורד את האפליקציה"**

**Sub-copy:**
> **"הקישור בביו — חינם, עברית, עובד."**
- שלוש מילות אמון קצרות שמסירות כל חיכוך
- ישיר לגמרי — בדיוק לפי voice-tone.md

**Trust Badges:**
> מסלולים בטוחים · מקלטים קרובים · חינם לחלוטין

---

## Format

- **Size:** 1080 x 1080 px (Instagram Square)
- **Mode:** Dark only
- **Direction:** RTL — טקסט מיושר ימין

---

## Visual Layout — ASCII Mockup

```
┌─────────────────────────────────────────────┐  1080px
│ [corner-tl subtle 30px]          3/3 ›      │  ← Space Mono 14px #00ff88
│                                             │
│                        שים נעליים.          │  ← Rubik 800 | 68px | #e8eef7
│                        הורד עכשיו.          │  ← Rubik 800 | 68px | #00ff88 + glow
│                                             │
│              (spacer ~246px max)            │
│                                             │
│          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │  ← divider #00ff88, 55% width, right-aligned
│                                             │
│  ╔══════════════════════════════════════╗   │  ← pill button 680×100px #00ff88 + triple glow
│  ║        הורד את האפליקציה            ║   │    text: Rubik Bold 28px #0a0f1a
│  ╚══════════════════════════════════════╝   │
│                                             │
│       הקישור בביו — חינם, עברית, עובד.     │  ← Rubik 400 | 20px | #8ba3c7
│                                             │
│   ⊙ חינם לחלוטין · ⊙ מקלטים קרובים · ⊙ מסלולים בטוחים │  ← badges 13px
│                                             │
│ [corner-bl 60px L-accent]                  │
└─────────────────────────────────────────────┘
```

---

## Color Spec

| Element | Token | Hex | Usage |
|---------|-------|-----|-------|
| Background | navy-950 | `#0a0f1a` | solid fill |
| Grid overlay | -- | `#ffffff` at 3% opacity | tactical dot grid, 28px |
| Vignette | -- | `#000000` at 30% | 4-corner radial darkening |
| H1 "שים נעליים." | text-primary | `#e8eef7` | near-white |
| H1 "הורד עכשיו." | neon-green | `#00ff88` | + text-shadow glow |
| Divider | neon-green | `#00ff88` | 2px, 55% width, right-aligned |
| CTA Button bg | neon-green | `#00ff88` | dominant visual element |
| CTA Button text | navy | `#0a0f1a` | dark text on green |
| CTA Glow | neon-green | `#00ff88` | triple box-shadow layer |
| Sub-copy | text-secondary | `#8ba3c7` | muted |
| Trust badges text | text-secondary | `#8ba3c7` | muted |
| Badge separator · | neon-green | `#00ff88` | dot separator |
| Slide counter | neon-green | `#00ff88` | "3/3" |
| Corner-bl | neon-green | `#00ff88` | full opacity L |
| Corner-tl | neon-green | `#00ff88` at 40% | subtle balance |

**NO RED** — אין חירום בפוסט שיווקי.

---

## Typography Spec

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| "שים נעליים." | Rubik | 800 | 68px | `#e8eef7` |
| "הורד עכשיו." | Rubik | 800 | 68px | `#00ff88` + glow |
| CTA Button text | Rubik | 700 | 28px | `#0a0f1a` |
| Sub-copy | Rubik | 400 | 20px | `#8ba3c7` |
| Trust badge labels | Rubik | 500 | 13px | `#8ba3c7` |
| Slide counter "3/3" | Space Mono | 400 | 14px | `#00ff88` |

**מינימום טקסט:** 13px (badge labels). כל טקסט עובר את כלל ה-12px.

---

## Design Layers (bottom → top)

1. Background fill `#0a0f1a`
2. Tactical dot grid (white 3%, 28px)
3. 4-corner vignette (black 30%)
4. Corner accents (L-shape bottom-left 60px, subtle top-left 30px/40%)
5. Slide counter "3/3" top-right
6. Content column:
   - Headline zone (right-aligned RTL)
   - Spacer (max 246px)
   - Divider (55% width, right-aligned, glowing)
   - Hero CTA pill button (680×100px, centered, triple glow)
   - Sub-copy (right-aligned)
   - Trust badges row (centered)

---

## Spacing Spec

| Zone | Value |
|------|-------|
| Canvas padding | 64px all sides |
| Headline top from edge | ~100px (64+36) |
| Spacer | flex:1 max 246px |
| Divider margin top/bottom | 40px each |
| Sub-copy margin-top | 28px from button |
| Trust badges margin-top | 28px from sub-copy |
| CTA Button | 680×100px, border-radius: 50px |

---

## Carousel Narrative Arc

| Slide | Mission | Copy | Vibe |
|-------|---------|------|------|
| 1/3 | Hook — עצור | "שמת נעליים. אנחנו דאגנו לשאר." | רגש + ביטחון |
| 2/3 | Proof — שכנוע | "בזמן אזעקה — אתה כבר יודע." + stats | עובדות |
| 3/3 | CTA — פעולה | "שים נעליים. הורד עכשיו." | סגירת לולאה |

שקופית 3 מהדהדת שקופית 1 — "שמת נעליים" (עבר, מה עשית) הופך ל"שים נעליים" (עתיד, מה תעשה). הלולאה נסגרת.

---

## Golden Rules Check

| Rule | Status |
|------|--------|
| אדום = חירום בלבד | PASS — אין אדום |
| ירוק = פעיל/בטוח בלבד | PASS — ירוק רק לCTA + accents |
| אין SOS חסום | PASS — לא רלוונטי |
| טקסט מינימום 12px | PASS — מינימום 13px |
| כפתורים rounded-2xl/full | PASS — border-radius:50px (rounded-full) |
| overlay = bg-black/60 | PASS — vignette בלבד |
| מצב חירום = רטט+אדום | PASS — לא חירום |
| מספרים = font-mono | PASS — "3/3" ב-Space Mono |
| RTL default | PASS — dir="rtl" על html |
| עברית ראשונה | PASS — הכל עברית |

**כל 10 כללי הזהב עוברים.**

---

## Brand Alignment

| Criterion | Check |
|-----------|-------|
| ביטחון, עוצמה, זרימה | PASS — CTA ירוק = עוצמה. "חינם, עברית, עובד" = ביטחון |
| קהל יעד (14-17, רצים) | PASS — שפה ישירה, zero friction |
| Quiet Discipline tone | PASS — לא מתנצל, לא מבטיח יותר מדי |
| לא Moovit/Waze vibe | PASS — tactical pill button, לא navigation chip |
| ירוק = פעיל בלבד | PASS — CTA + accents + headline action word |
| Carousel continuity | PASS — אותם corner accents, slide indicator, divider |

---

## Open Design Project

- **Project ID:** `runninginwar-instagram-cta-slide3-c173`
- **Run ID:** `66ff301f-e0f1-4ba6-998a-276fbb8dd39d`
- **Preview URL:** `http://127.0.0.1:7456/api/projects/runninginwar-instagram-cta-slide3-c173/raw/index.html`

---

## File References

- HTML source: `O-output/Owner's Output/DEX-instagram-cta-slide3-2026-06-28.html`
- PNG output: `O-output/Owner's Output/DEX-instagram-cta-slide3-2026-06-28.png`
- Spec (this file): `O-output/Owner's Output/DEX-instagram-cta-slide3-2026-06-28.md`

---

## Handoff Notes

1. Copy נעול — כל מילה נבחרה בכוונה. "שים נעליים. הורד עכשיו." לא לשנות.
2. כפתור CTA = האלמנט הויזואלי הדומיננטי — לא לצמצם את הגלואו שלו
3. Trust badges — הסדר: חינם לחלוטין · מקלטים קרובים · מסלולים בטוחים (right-to-left visually)
4. הdivider מיושר ימין (55% רוחב) — לא מרוכז. זה מכוון.
5. כל 3 השקופיות משתמשות באותו: corner accent L בתחתית שמאל, Space Mono לslide counter, divider ירוק — כך הקרוסלה נראית כיחידה אחת.

---

*DEX — Design EXecution | RunningInWar | 2026-06-28*
