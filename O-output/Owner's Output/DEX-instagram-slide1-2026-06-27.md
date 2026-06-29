# Instagram Carousel — Slide 1 | Design Spec
**DEX | 2026-06-27**

---

## Mission

שקופית 1 מתוך קרוסלה לאינסטגרם. מטרה: עצירה. האצבע עוצרת תוך 0.3 שניות.
ה-hook: משפט אחד שמכה, לוגו שמזוהה, ויז'ואל שמשדר command-center.

---

## Headline — המשפט המנצח

> **"שמת נעליים. אנחנו דאגנו לשאר."**

**למה זה עובד:**
- מדבר ישירות לאקט הכי פשוט (לנעול נעליים)
- "אנחנו" = חבר אמין לצידך
- "דאגנו לשאר" = ביטחון מלא, אפס דאגות
- קצר, פרגמטי — בדיוק הטון של yuval-voice.md
- לא מבטיח יותר מדי, לא מתנצל — מדבר מניסיון
- מהדהד Nike "Just Do It" — אתה תעשה את הפשוט, אנחנו נעשה את השאר

**Tagline משני (מתחת):**
> **מסלולי ריצה בטוחים · מקלטים קרובים · תמיד.**

---

## Format

- **Size:** 1080 x 1080 px (Instagram Square)
- **Mode:** Dark only
- **Direction:** RTL — טקסט מיושר ימין

---

## Visual Layout — ASCII Mockup

```
┌─────────────────────────────────────────────┐  1080px
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← grid texture overlay (#ffffff08)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                             │
│              ┌──────────────┐               │  ← LOGO ZONE (centered, ~320px wide)
│              │  [LOGO FULL] │               │  logo-dark.png
│              │  RunningInWar│               │  glow: drop-shadow(0 0 24px #00ff8840)
│              └──────────────┘               │
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← divider line #00ff88, 2px, 60% width
│                                             │
│                                             │
│        שמת נעליים.                          │  ← H1 | Rubik Bold | 72px | #e8eef7
│        אנחנו דאגנו לשאר.                   │     line-height: 1.15 | text-right
│                                             │
│                                             │
│   מסלולי ריצה בטוחים · מקלטים קרובים · תמיד  │  ← tagline | Rubik Regular | 22px | #8ba3c7
│                                             │
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                             │
│  [neon-green corner accent — bottom-left]   │  ← accent: 4px line + small pulse dot
│                                    1/3 ›    │  ← slide indicator — top-right | Space Mono 14px #00ff88
└─────────────────────────────────────────────┘
```

---

## Color Spec

| Element | Token | Hex | Usage |
|---------|-------|-----|-------|
| Background | navy-950 | `#0a0f1a` | solid fill |
| Grid overlay | -- | `#ffffff` at 3% opacity | subtle tactical grid |
| H1 text | text-primary | `#e8eef7` | headline |
| Tagline text | text-secondary | `#8ba3c7` | subtitle |
| Divider line | neon-green | `#00ff88` | thin horizontal rule |
| Logo glow | neon-green | `#00ff8840` | drop-shadow on logo |
| Slide indicator | neon-green | `#00ff88` | "1/3 ›" top-right corner |
| Corner accent | neon-green | `#00ff88` | bottom-left decorative element |

**NO RED** — אדום שמור לחירום בלבד. זה פוסט שיווקי, לא מצב חירום.

---

## Typography Spec

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| H1 Line 1 "שמת נעליים." | Rubik | 800 (ExtraBold) | 72px | `#e8eef7` |
| H1 Line 2 "אנחנו דאגנו לשאר." | Rubik | 800 (ExtraBold) | 72px | `#e8eef7` |
| Tagline | Rubik | 400 (Regular) | 22px | `#8ba3c7` |
| Slide counter "1/3 ›" | Space Mono | 400 | 14px | `#00ff88` |

**מינימום טקסט:** 14px (Space Mono). כל טקסט עובר את כלל ה-12px.

---

## Design Layers (order: bottom → top)

1. **Background fill** — `#0a0f1a` solid
2. **Grid texture** — subtle repeating grid lines, `#ffffff` 3% opacity, 40px cell size
3. **Vignette** — radial gradient: transparent center → `#000000` 30% at edges
4. **Logo** — centered, ~320px wide, with neon glow shadow
5. **Divider** — `#00ff88` horizontal line, 2px, 60% canvas width, centered
6. **H1 text block** — right-aligned, Rubik ExtraBold 72px
7. **Tagline** — right-aligned below H1, Rubik 22px
8. **Slide counter** — top-right corner, "1/3 ›", Space Mono 14px neon-green
9. **Corner accent** — bottom-left, thin neon-green L-shape (2px lines, ~60px)

---

## Spacing Spec

| Zone | Value |
|------|-------|
| Canvas padding | 64px all sides |
| Logo top margin | 100px from top edge |
| Logo height | ~240px (proportional) |
| Divider to H1 gap | 48px |
| H1 to tagline gap | 24px |
| Logo to divider gap | 40px |

---

## Golden Rules Check

| Rule | Status |
|------|--------|
| אדום = חירום בלבד | PASS — אין אדום |
| ירוק = פעיל/בטוח בלבד | PASS — נעשה שימוש נכון |
| אין SOS בפוסט זה | PASS — לא רלוונטי |
| טקסט מינימום 12px | PASS — מינימום 14px |
| כפתורים rounded-2xl | PASS — אין כפתורים בפוסט זה |
| overlay = bg-black/60 | PASS — vignette בלבד |
| מצב חירום = רטט+אדום | PASS — לא חירום |
| מספרים = font-mono | PASS — "1/3" ב-Space Mono |
| RTL default | PASS — טקסט מיושר ימין |
| עברית ראשונה | PASS — הכל עברית |

**כל 10 כללי הזהב עוברים.**

---

## Canva Prompt (לשימוש ב-Canva MCP)

```
Create an Instagram square post (1080x1080px) with this exact design:

BACKGROUND: Solid dark navy #0a0f1a. Add a subtle grid texture overlay (white lines, 3% opacity, 40px grid). Add a soft dark vignette at the edges.

LOGO: Place the RunningInWar logo (uploaded image: logo-dark.png) centered horizontally, approximately 320px wide. Position in the upper-center area. Add a subtle neon green glow effect (color: #00ff88, blur radius: 24px, 25% opacity).

DIVIDER: A thin horizontal line in neon green (#00ff88), 2px thick, spanning 60% of the canvas width, centered.

HEADLINE (main text, right-aligned, RTL):
Line 1: "שמת נעליים." — Rubik ExtraBold, 72px, color #e8eef7
Line 2: "אנחנו דאגנו לשאר." — Rubik ExtraBold, 72px, color #e8eef7

TAGLINE (below headline, right-aligned):
"מסלולי ריצה בטוחים · מקלטים קרובים · תמיד." — Rubik Regular, 22px, color #8ba3c7

SLIDE INDICATOR: Top-right corner — "1/3 ›" — Space Mono font, 14px, color #00ff88

CORNER ACCENT: Bottom-left corner — thin neon green (#00ff88) L-shaped lines, 2px, approximately 60x60px

OVERALL VIBE: Tactical command-center. Dark. Precise. Like a military-grade running app. Not generic.
```

---

## Brand Alignment

| Criterion | Check |
|-----------|-------|
| ביטחון, עוצמה, זרימה | PASS — "אנחנו דאגנו לשאר" = ביטחון מלא |
| קהל יעד (14-17, רצים) | PASS — שפה ישירה, לא מתנשאת |
| Quiet Discipline tone | PASS — "דאגנו" לא "נדאג" — כבר נעשה |
| לא Moovit/Waze vibe | PASS — tactical, לא navigation-generic |
| לוגו עם glow | PASS — command-center feel |
| ירוק = פעיל בלבד | PASS — ירוק רק לaccent ולוגו |

---

## File References

- Logo source: `app/public/logo/full/logo-dark.png`
- Output folder: `O-output/Owner's Output/`
- This spec: `DEX-instagram-slide1-2026-06-27.md`

---

## Handoff Notes

**לכל מי שמייצר את זה:**

1. לוגו קיים ב-`app/public/logo/full/logo-dark.png` — השתמש בו ישירות, אל תיצור לוגו חדש
2. ה-headline מוגדר — אל תשנה אותו. כל מילה נבחרה בכוונה
3. אין אדום בעיצוב הזה בשום מצב
4. ה-tagline יכול לרדת ב-2px (20px) אם נראה עמוס
5. Grid texture חשוב — בלעדיו זה נראה generic
6. הגרסה הבאה (slide 2) תהיה feature showcase — מפה + מקלטים

---

*DEX — Design EXecution | RunningInWar | 2026-06-27*
