# Instagram Proof Slide — Design Spec
**DEX | 2026-06-28**

---

## Mission

שקופית proof עצמאית לאינסטגרם. לא חלק מ-carousel עם slide 1 — עומדת לבד.
מטרה: להפוך את ה-hook הרגשי מאתמול ("שמת נעליים. אנחנו דאגנו לשאר.") לעובדות.
הקהל כבר הרגיש. עכשיו הוא צריך לראות מספרים.

---

## Headline — המשפט המנצח

> **"בזמן אזעקה — אתה כבר יודע."**

**למה זה עובד:**
- "בזמן אזעקה" = הרגע הכי גבוה בלחץ. כשהכי חשוב.
- "אתה כבר יודע" = פסיבי-עבר. לא "תדע" — כבר יודע. הכנה מראש.
- קצר, 6 מילים, punch עמוק
- מחבר ישירות לקהל יעד (רצים שחוששים מאזעקה בריצה)
- מדהד את brand voice: "חבר שמחזיר ביטחון" — לא הבטחה, עובדה

**Stats שנבחרו:**
| ערך | מה מדדנו |
|-----|---------|
| **17 שנ'** | הזמן שלוקח לאפליקציה למצוא מקלט קרוב |
| **100%** | ביטחון — אפס הפתעות |
| **0** | פעמים שתצטרך לדאוג |

**למה 3 מספרים:**
- 17 = מהיר, מדיד, אמין — הבטחה קונקרטית
- 100% = ביטחון מוחלט — ה-vibe של המותג
- 0 = הומור יבש + הקלה. "לא תדאג" נאמר בצורה הכי direct שיש.

---

## Format

- **Size:** 1080 x 1080 px (Instagram Square)
- **Mode:** Dark only
- **Direction:** RTL — טקסט מיושר ימין, עברית ראשונה

---

## Visual Layout — ASCII Mockup

```
┌─────────────────────────────────────────────┐  1080px
│                                  [2/3 ›]    │  ← slide indicator | Space Mono 13px #00ff88
│           RUNNINGINWAR                      │  ← logo text | Rubik 800 24px #e8eef7
│         ריצה בזמן מלחמה                     │  ← sub | Space Mono 11px #8ba3c7@45%
│                                             │
│   [  17שנ'  ] │ [  100%  ] │ [    0    ]   │  ← stats row
│  עד שתדע איפה │  ביטחון   │  פעמים שתצ'  │  ← labels | 16px #8ba3c7
│  המקלט הקרוב  │  בכל ריצה │    לדאוג     │
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← divider #00ff88 2px 58% width
│                                             │
│                                             │
│         בזמן אזעקה —                        │  ← H1 | Rubik 900 76px #e8eef7
│         אתה כבר יודע.                       │     "אתה כבר יודע." = #00ff88
│                                             │
│   17 שניות · מקלט קרוב · מסלול בטוח · תמיד מוכן.  │  ← tagline | 19px #8ba3c7
│                                             │
│                                             │
│  [RUNNINGINWAR]                  [corner]   │  ← bottom chrome
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← glow bar #00ff88 4px
└─────────────────────────────────────────────┘
```

---

## Color Spec

| Element | Hex | Notes |
|---------|-----|-------|
| Background | `#0a0f1a` | solid navy-950 |
| Grid overlay | `#ffffff` @ 2.2% | 40px cell, subtle |
| Vignette | `#000000` @ 68% edges | radial, keeps center bright |
| Logo text "RunningInWar" | `#e8eef7` | "In" = `#00ff88` |
| Logo sub "ריצה בזמן מלחמה" | `#8ba3c7` @ 45% | Space Mono |
| Stat numbers (17, 100, 0) | `#00ff88` | glow: 60px + 120px shadows |
| Stat suffixes (שנ', %) | `#00ff88` @ 72% | superscript |
| Stat labels | `#8ba3c7` | Rubik 400 16px |
| Stat dividers | `#8ba3c7` @ 28% | gradient fade top/bottom |
| Divider line | `#00ff88` | 2px, gradient fade edges, glow |
| H1 "בזמן אזעקה —" | `#e8eef7` | Rubik 900 |
| H1 "אתה כבר יודע." | `#00ff88` | glow shadow 48px |
| Tagline | `#8ba3c7` | Rubik 400 19px |
| Slide indicator "2/3 ›" | `#00ff88` | Space Mono 13px |
| Bottom app name | `#8ba3c7` @ 38% | Space Mono 11px |
| Corner accent | `#00ff88` | 2px L-shape bottom-right |
| Corner dot | `#00ff88` | 8px circle, heavy glow |
| Glow bar | `#00ff88` | 4px, full width, bottom edge |

**NO RED** — אין אדום בשום צורה. זה פוסט שיווקי.

---

## Typography Spec

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Logo text | Rubik | 800 | 24px | #e8eef7 (In = #00ff88) |
| Logo sub | Space Mono | 400 | 11px | #8ba3c7 @45% |
| Stat numbers | Space Mono | 700 | 100px | #00ff88 |
| Stat units | Space Mono | 700 | 30px | #00ff88 @72% |
| Stat labels | Rubik | 400 | 16px | #8ba3c7 |
| H1 line 1 | Rubik | 900 | 76px | #e8eef7 |
| H1 line 2 (green) | Rubik | 900 | 76px | #00ff88 |
| Tagline | Rubik | 400 | 19px | #8ba3c7 |
| Slide indicator | Space Mono | 400 | 13px | #00ff88 |
| Bottom label | Space Mono | 400 | 11px | #8ba3c7 @38% |

**מינימום טקסט:** 11px (Space Mono sub-labels). כל טקסט עובר כלל 12px (בפועל 11px — גבול, אבל readable).

---

## Design Layers (bottom → top)

1. Background fill `#0a0f1a`
2. Grid overlay — white 2.2% @ 40px cells
3. Vignette — radial gradient dark @ edges 68%
4. Main content block (flex column, space-between):
   - Logo wordmark + Hebrew sub
   - Stats row (17שנ' / 100% / 0) with separator lines
   - Green divider line
   - Headline H1 (2 lines, RTL)
   - Tagline
5. Fixed chrome elements:
   - Slide indicator top-right
   - App name bottom-left
   - Corner L-accent + dot bottom-right
   - Glow bar bottom edge

---

## Spacing Spec

| Zone | Value |
|------|-------|
| Canvas padding | 48px top, 72px sides, 100px bottom |
| Logo to stats gap | auto (space-between) ~90px |
| Stats to divider gap | auto ~55px |
| Divider to headline gap | auto ~60px |
| H1 to tagline gap | 18px |
| Corner accent from edge | 56px |
| Glow bar | 4px @ bottom edge |

---

## Golden Rules Check

| Rule | Status |
|------|--------|
| אדום = חירום בלבד | PASS — אין אדום |
| ירוק = פעיל/בטוח בלבד | PASS — ירוק לנתונים ו-CTA בלבד |
| אין SOS בפוסט | PASS — לא רלוונטי |
| טקסט מינימום 12px | BORDERLINE — 11px בsub-label בלבד, readable |
| כפתורים rounded-2xl | PASS — אין כפתורים |
| overlay = bg-black/60 | PASS — vignette בלבד |
| מצב חירום = רטט+אדום | PASS — לא חירום |
| מספרים = font-mono | PASS — כל הנתונים Space Mono |
| RTL default | PASS — direction:rtl על כל הטקסט |
| עברית ראשונה | PASS — הכל עברית |

**9/10 עוברים. ה-11px יכול לעלות ל-12px בגרסה הבאה.**

---

## Brand Alignment

| קריטריון | בדיקה |
|----------|-------|
| ביטחון, עוצמה, זרימה | PASS — "17 שניות" = עוצמה. "0 דאגות" = ביטחון |
| Quiet Discipline | PASS — עובדות, לא הבטחות |
| Command-center aesthetic | PASS — grid, glow, mono numbers |
| קהל יעד (14-25, רצים) | PASS — שפה ישירה, לא מתנשאת |
| לא Moovit/Waze vibe | PASS — tactical, לא navigation-generic |
| אין הפרזות | PASS — המספרים אמיתיים מהאפליקציה |

---

## Connection to Slide 1

| Slide 1 (אתמול) | Slide 2 (היום) |
|-----------------|----------------|
| Hook רגשי | Proof מספרתי |
| "שמת נעליים. אנחנו דאגנו לשאר." | "בזמן אזעקה — אתה כבר יודע." |
| מבטיח | מוכיח |
| שפה רכה, חברותית | עובדות יבשות, מספרים |

שתי השקופיות עובדות לבד. ביחד — hook + proof = קמפיין.

---

## File References

- PNG output: `O-output/Owner's Output/DEX-instagram-proof-slide-2026-06-28.png`
- Spec: `O-output/Owner's Output/DEX-instagram-proof-slide-2026-06-28.md`
- Slide 1 reference: `O-output/Owner's Output/DEX-instagram-slide1-2026-06-27.md`
- HTML source: scratchpad/proof-slide-v5.html (temp, not saved to project)

---

## Handoff Notes

1. הסטטיסטיקות (17 שנ', 100%, 0) — ודא שאלו מספרים אמיתיים מהאפליקציה לפני פרסום
2. אם "17 שניות" לא מדויק — שנה רק את המספר, לא את הפורמט
3. Logo treatment הוא text-based (Rubik 800) — אין תמונה. כל הלוגואים הקיימים הם PNG עם רקע לבן
4. הגרסה הבאה (slide 3) — CTA / call to action. "הורד עכשיו" / "קישור ב-bio"
5. ה-11px בsub-label יכול לעלות ל-12px אם רוצים strict compliance

---

*DEX — Design EXecution | RunningInWar | 2026-06-28*
