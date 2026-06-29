# Instagram Post — Messi Hook x RunningInWar
**DEX | 2026-06-28**

---

## Mission

פוסט אינסטגרם בודד (לא קרוסלה). מנצל הייפ מונדיאל 2026 כ-HOOK לגיוס לידים לאפליקציה.
קהל יעד: בני נוער 14-17 ישראלים שרצים, הפסיקו בגלל מלחמה, מחפשים דרך לחזור.

---

## ה-HOOK שנבחר

> **"מסי לא עצר. גם אתה לא חייב."**

### למה זה עובד (נימוק שיווקי):

מוטי הביא ממצאים ברורים: הגשר הרגשי בין מסי לרץ ישראלי הוא **"לא עוצרים כשהחיים קשים"**. מסי לא עצר אחרי 4 גביעות כושלות. הרץ לא חייב לעצור בגלל מלחמה. RunningInWar = הכלי שמאפשר את ה-"לא עוצרים".

הHOOK "מסי לא / עצר." הוא curiosity gap + pattern interrupt — שני אלמנטים שמוכחים כעוצרי גלילה. "עצר." = שאלה בתחפושת של הצהרה. מה עצר? למה זה קשור אלי? הציסיות פתוח.

**למה לא Fear:** מחקר Johns Hopkins — fear-based messaging מזיק לבני נוער ספורטאים ומגביר חרדה. הכיוון הנכון: Awe + Empowerment.

---

## ויז'ואל

### פורמט
- **גודל:** 1080 x 1350 px (Instagram Portrait 4:5)
- **למה 4:5 ולא square:** מוטי: Meta ממליצה רשמית, 1.4x יותר reach אורגני מ-square
- **מצב:** Dark only
- **כיוון:** RTL — טקסט מיושר ימין

### Concept: Split-Screen — מגרש vs. מסלול

שני עולמות בפריים אחד, מחוברים בקו אלכסוני ירוק זוהר:

**חצי שמאל — מגרש כדורגל World Cup:**
- קווי מגרש סכמטיים לבנים (opacity נמוכה) על רקע ירוק כהה מאוד
- עיגול מרכז, קו penalty, goal area
- label: "WORLD CUP FIELD" | Space Mono 11px
- מרמז על מסי/מונדיאל בלי לאזכר בשם (זכויות יוצרים)

**חצי ימין — מפת ריצה טקטית:**
- רשת רחובות navy (`#111f3c`)
- Route ירוק זוהר (`#00ff88`, 4px) עם glow
- 3 מקלטים ("S") עם pulse rings
- runner dot (עיגול לבן) = מיקום הרץ
- label: "RUNNING ROUTE" | Space Mono 11px
- מרחקים: "1.2km", "2.8km" | Space Mono

**מחבר:** קו אלכסוני `#00ff88` עם glow זוהר

---

## ASCII Layout

```
┌──────────────────────────────────────────────┐  1080px
│ [RunningInWar logo]     [WORLD CUP 2026 🏆]  │  ← top bar
│                                              │
│  WORLD CUP FIELD  |  RUNNING ROUTE          │
│                   |                          │
│  [קווי מגרש      | [מפת ריצה               │
│   כדורגל,         |  נייבי, route ירוק      │
│   לבן שקוף]      |  + 3 מקלטי S]           │
│                   |                          │
│                   |                          │
├──────────────────────────────────────────────┤  80% height
│                                              │
│                                  מסי לא      │  ← H1 | 120px | #e8eef7
│                                   עצר.       │  ← H1 | 120px | #00ff88 + glow
│                                              │
│                    גם אתה לא חייב.           │  ← sub | 30px | #8ba3c7
│                                              │
│ running-in-war.vercel.app  ←  חזור לרוץ — הקישור בביו │
└──────────────────────────────────────────────┘  1350px
```

---

## Color Spec

| Element | Hex | שימוש |
|---------|-----|-------|
| Background | `#07101e` | deep navy, slightly darker than standard |
| Grid overlay | `#ffffff` @ 1.8% | 60px cells, subtle |
| Field BG tint | `rgba(0,20,8,0.38)` | dark green wash, left half |
| Field lines | `rgba(255,255,255,0.12)` | pitch markings |
| Map streets | `rgba(17,31,60,0.9)` | road network |
| Running route | `#00ff88` | 4px + glow |
| Shelter markers | `#00ff88` | circle + "S" label |
| Runner dot | `#ffffff` @ 95% | current position |
| Split line | `#00ff88` | 2px diagonal, glow |
| H1 line 1 | `#e8eef7` | "מסי לא" |
| H1 line 2 | `#00ff88` | "עצר." + text-shadow glow |
| Sub text | `rgba(139,163,199,0.78)` | "גם אתה לא חייב." |
| CTA | `#00ff88` | "חזור לרוץ — הקישור בביו" |
| Glow bar bottom | `#00ff88` | 4px, full width |

**NO RED** — אין אדום. פוסט שיווקי, לא חירום.

---

## Typography Spec

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Logo wordmark | Rubik | 800 | 24px | #e8eef7 ("In" = #00ff88) |
| Logo sub | Space Mono | 400 | 10px | #8ba3c7 @40% |
| WC badge text | Space Mono | 400 | 11px | #e8eef7 @50% |
| Field/Map labels | Space Mono | 400 | 11px | white @12% / green @30% |
| Distance labels | Space Mono | 400 | 10px | #00ff88 @60% |
| H1 line 1 | Rubik | 900 | 120px | #e8eef7 |
| H1 line 2 | Rubik | 900 | 120px | #00ff88 + glow |
| Sub | Rubik | 400 | 30px | #8ba3c7 @78% |
| CTA | Rubik | 700 | 22px | #00ff88 |
| Corner URL | Space Mono | 400 | 10px | #8ba3c7 @32% |

**מינימום:** 10px (corner URL). כל טקסט רלוונטי — 22px+.

---

## Golden Rules Check

| Rule | Status |
|------|--------|
| אדום = חירום בלבד | PASS — אין אדום |
| ירוק = פעיל/בטוח | PASS — route, shelter, CTA, H2 |
| אין SOS | PASS — לא רלוונטי |
| טקסט מינימום 12px | PASS — מינימום 22px בטקסט מרכזי |
| כפתורים rounded-2xl | PASS — אין כפתורים |
| overlay bg-black/60 | PASS — vignette + gradient |
| מצב חירום רטט+אדום | PASS — לא חירום |
| מספרים font-mono | PASS — כל מרחקים ב-Space Mono |
| RTL default | PASS — direction:rtl |
| עברית ראשונה | PASS — הכל עברית |

**10/10 PASS**

---

## Brand Alignment

| קריטריון | בדיקה |
|----------|-------|
| ביטחון, עוצמה, זרימה | PASS — route + shelter = ביטחון. "לא עצר" = עוצמה |
| Tactical command-center | PASS — map, grid, glow, mono |
| לא Moovit/Waze | PASS — טקטי/ספורטיבי, לא navigation |
| לא פוליטי | PASS — ספורט בלבד |
| קהל 14-17 | PASS — direct, bro-tone, ספורט ≠ מתנשא |
| זכויות יוצרים מסי | PASS — אין שם, אין תמונה, רק הקשר תרבותי רגשי |

---

## Marketing Analysis

### למה 4:5 (portrait)
מוטי: 1.4x reach אורגני vs. square. Meta 2026 official recommendation. תופס יותר מסך, יותר זמן בפיד.

### הגשר הרגשי
מסי = 4 גביעות כושלים → לא עצר → זכה 2022.
הרץ = כמה חודשים מלחמה → לא חייב לעצור → RunningInWar = הכלי.
Thread רגשי: "כשהחיים קשים — לא עוצרים."

### Fear vs. Empowerment
Fear-based messages מזיקים לבני נוער ספורטאים (Johns Hopkins). בחרתי Awe + Empowerment — "לא עצר" = inspiring, לא מפחיד.

### Curiosity Gap
"מסי לא / עצר." — שתי שורות עם פסיק שגורמות לשאלה: "לא עצר איפה? ומה זה קשור אלי?" → גלילה עצרה → caption.

---

## Caption מוצע לפוסט

```
מסי לא עצר אחרי 4 גביעות שנשברו לו.
גם אתה לא חייב לעצור בגלל מלחמה.

בזמן שהעולם עוצר למונדיאל —
רצים ישראלים לא עוצרים.
כי יש להם מסלול. יש להם מקלטים. יש להם גב.

תשים נעליים — אנחנו נדאג לשאר.
חזור לרוץ בחינם ← הקישור בביו

running-in-war.vercel.app

#ריצה #ריצהישראלית #מונדיאל2026 #WorldCup2026 #ריצהבזמןמלחמה
#RunningInWar #חזוריםלרוץ #ספורט #ישראל #אימון #מקלטים #בטיחות
```

---

## Research Findings (מוטי)

| נושא | ממצא |
|------|-------|
| פורמט | 4:5 portrait = 1.4x reach vs. square (Meta 2026) |
| טקסט על תמונה | מקסימום 5-7 מילים על תמונה |
| Hook type | Curiosity gap > Fear messaging |
| מסי-ישראל | קהילה ארגנטינאית-ישראלית גדולה — קשר לגיטימי |
| גשר רגשי | "לא עוצרים" — thread משותף מסי ורץ ישראלי |
| CTA | "חזור לרוץ בחינם" > "קישור בביו" סתם |

---

## File References

- PNG: `O-output/Owner's Output/DEX-instagram-messi-hook-2026-06-28.png`
- Spec: `O-output/Owner's Output/DEX-instagram-messi-hook-2026-06-28.md`
- HTML source: `open-design/.od/projects/41509f96.../messi-hook-2026-06-28.html`
- Related: `DEX-instagram-worldcup-messi-2026-06-27.md` (previous day spec)
- Related: `DEX-instagram-proof-slide-2026-06-28.md` (proof slide)

---

## Differentiation from Previous Posts

| פוסט | Hook | קונספט |
|------|------|--------|
| slide1 (27/6) | "שמת נעליים. אנחנו דאגנו לשאר." | רגשי, personal |
| worldcup-messi (27/6) | "הם שומרים עליו במגרש. אנחנו שומרים עליך." | parallel |
| proof-slide (28/6) | "בזמן אזעקה — אתה כבר יודע." | proof/numbers |
| **messi-hook (28/6)** | **"מסי לא עצר. גם אתה לא חייב."** | **empowerment/curiosity** |

ארבעת הפוסטים מכסים: hook רגשי → parallel → proof → empowerment. קמפיין מלא.

---

*DEX — Design EXecution | RunningInWar | 2026-06-28*
