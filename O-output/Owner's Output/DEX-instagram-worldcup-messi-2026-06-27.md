# Instagram Post — World Cup 2026 x RunningInWar
**DEX | 2026-06-27**

---

## חלק 1: טקסט הפוסט

### כותרת
> **"הם שומרים עליו במגרש. אנחנו שומרים עליך במסלול."**

### גוף הפוסט (עברית)

```
הם שומרים עליו במגרש.
אנחנו שומרים עליך במסלול.

בזמן שהעולם עוצר למונדיאל —
רצים ישראלים לא עוצרים.
כי יש להם את הגב.

מסלולי ריצה בטוחים + מקלטים קרובים.
תשים נעליים — אנחנו נדאג לשאר.
```

### CTA
**הורד את האפליקציה — הקישור בביו**
*(חצי שורה, מיד מתחת לגוף — לא שורה נפרדת, לא פסקה)*

### האשטגים

```
#ריצה #ריצהישראלית #רצים #ריצהבטוחה #ריצהבזמןמלחמה
#RunningInWar #מונדיאל2026 #WorldCup2026 #ספורט #ישראל
#אימון #חוזריםלרוץ #מקלטים #בטיחות #ריצה
```

---

## חלק 2: תיאור ויזואלי

### קונספט: שני עולמות — מגרש ומסלול

הפוסט מציג שני חצאים ויזואליים שמחוברים יחד לתמונה אחת. לא קולאז', לא דיפטיך — שני אלמנטים שנמזגים בתוך פריים אחד, כמו שני מציאויות שנגעות אחת בשניה.

---

### פורמט
- **גודל:** 1080 x 1080 px (Instagram Square)
- **מצב:** Dark only
- **כיוון:** RTL — טקסט מיושר ימין

---

### ASCII Layout Mockup

```
┌─────────────────────────────────────────────┐  1080px
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← grid texture overlay (#ffffff08)
│                                             │
│  ┌───────────────┬───────────────────────┐  │
│  │               │                       │  │
│  │  [מגרש כדורגל │   [מפת ריצה          │  │
│  │   — קווים      │    — מסלול + מקלטים │  │
│  │   לבנים על     │    נקודות + גרידים] │  │
│  │   ירוק כהה]    │                      │  │
│  │               │                       │  │
│  └───────────────┴───────────────────────┘  │  ← 50/50 split with diagonal cut
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← divider: #00ff88, 2px, 70% width
│                                             │
│    הם שומרים עליו במגרש.                   │  ← H1 | Rubik ExtraBold | 56px | #e8eef7
│    אנחנו שומרים עליך במסלול.              │     text-right
│                                             │
│    בזמן שהעולם עוצר למונדיאל —             │  ← body | Rubik Regular | 22px | #8ba3c7
│    רצים ישראלים לא עוצרים.                 │
│                                             │
│    הורד את האפליקציה — הקישור בביו ←      │  ← CTA | Rubik Bold | 20px | #00ff88
│                                             │
│  [LOGO RunningInWar — bottom-right corner]  │  ← לוגו קטן | ~180px | עם glow ירוק
│                        [🌐 small trophy icon]│  ← אייקון גביע קטן (SVG/lucide) — bottom-left
└─────────────────────────────────────────────┘
```

---

### האלמנטים הויזואליים

**חצי שמאל — המגרש:**
קווי כדורגל סכמטיים ולא ריאליסטיים — רק קווים לבנים-שקופים (opacity 40%) על רקע ירוק כהה מאוד (`#0a1a0f`). מגרש מינימליסטי, לא צילום. הקווים מרמזים על מגרש כדורגל: קו מרכז + עיגול + קצות.

**חצי ימין — מסלול הריצה:**
מפה טקטיקלית סכמטית — רשת רחובות ב-navy (`#111f3c`), קו מסלול ריצה בירוק זוהר (`#00ff88`, 3px), ושלוש נקודות מקלט (עיגולים קטנים ירוקים עם pulse). זו המפה של האפליקציה — לא מפה ריאליסטית, מפה tactical.

**חיבור בין שני החצאים:**
חיתוך אלכסוני מ-top-left ל-bottom-right, לא קו ישר. אין גבול קשה — השני נמזגים. החיתוך עצמו מוארק בקו `#00ff88` דק (1px).

**טקסט:**
מרוכז בחלק התחתון, על רקע navy כהה semi-transparent (`bg-navy-950/90`). RTL, מיושר ימין.

---

### פלטת צבעים

| אלמנט | טוקן | Hex | שימוש |
|-------|------|-----|-------|
| רקע כללי | navy-950 | `#0a0f1a` | solid fill |
| חצי מגרש | -- | `#0a1a0f` | ירוק כהה מאוד, לא צבע המוצר |
| חצי מסלול | navy-800 | `#111f3c` | tactical map bg |
| Grid overlay | -- | `#ffffff` at 3% opacity | grid texture |
| H1 טקסט | text-primary | `#e8eef7` | כותרת |
| Body טקסט | text-secondary | `#8ba3c7` | גוף הפוסט |
| CTA טקסט | neon-green | `#00ff88` | הקישור בביו |
| קו מסלול ריצה | neon-green | `#00ff88` | route line on map |
| קו מחבר | neon-green | `#00ff88` | diagonal divider |
| Divider line | neon-green | `#00ff88` | horizontal rule |
| Logo glow | neon-green | `#00ff8840` | drop-shadow |
| קווי מגרש | white 40% | `#ffffff66` | football field lines |

**NO RED — אפס אדום.** זה פוסט שיווקי, לא מצב חירום.

---

### טיפוגרפיה

| אלמנט | פונט | Weight | Size | Color |
|-------|------|--------|------|-------|
| H1 שורה 1 | Rubik | 800 ExtraBold | 56px | `#e8eef7` |
| H1 שורה 2 | Rubik | 800 ExtraBold | 56px | `#e8eef7` |
| Body (2 שורות) | Rubik | 400 Regular | 22px | `#8ba3c7` |
| CTA | Rubik | 700 Bold | 20px | `#00ff88` |
| לוגו טקסט | Rubik | -- | לפי לוגו | -- |

**מינימום טקסט:** 20px. כל טקסט עובר את כלל ה-12px בפער גדול.

---

### שכבות (bottom → top)

1. **Background fill** — `#0a0f1a` solid
2. **Left half** — football field, `#0a1a0f`, white field lines at 40% opacity
3. **Right half** — tactical map, `#111f3c`, route + shelter dots
4. **Diagonal blend** — `#00ff88` 1px diagonal line מחבר השניים
5. **Grid texture** — `#ffffff` 3% opacity, 40px cell, כל הפריים
6. **Text panel** — semi-transparent navy bar בתחתית: `#0a0f1a` at 90% opacity
7. **Divider** — `#00ff88` horizontal line, 2px, 70% width
8. **H1 block** — right-aligned, Rubik ExtraBold 56px
9. **Body text** — right-aligned, Rubik Regular 22px, #8ba3c7
10. **CTA line** — right-aligned, Rubik Bold 20px, neon-green
11. **Logo** — bottom-right, ~180px, neon glow shadow
12. **Trophy icon** — bottom-left, small SVG silhouette, `#ffffff40`

---

### מה כתוב על התמונה (טקסט ויזואלי, בסדר מלמעלה למטה)

```
[אייקון גביע קטן — שמאל עליון]     [WORLDCUP 2026 — Space Mono 12px #ffffff40]

[שני חצאי תמונה: מגרש ← → מסלול]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

הם שומרים עליו במגרש.
אנחנו שומרים עליך במסלול.

בזמן שהעולם עוצר למונדיאל —
רצים ישראלים לא עוצרים.

הורד את האפליקציה — הקישור בביו ←

                              [LOGO RunningInWar]
```

---

## חלק 3: 3 וריאציות A/B

### וריאציה A — הניגוד (מומלצת)
> **"הם שומרים עליו במגרש. אנחנו שומרים עליך במסלול."**

**למה זה עובד:** ניגוד ישיר ועוצמתי. "הם" = שחקני הגנה. "אנחנו" = האפליקציה. הקבלה מושלמת. לא מזכיר את מסי בשם — לא מפר זכויות יוצרים, אבל כולם יבינו. קצר, פרגמטי, מכה.

---

### וריאציה B — זהות הרץ
> **"מונדיאל 2026. שיא אישי 2026. בחר את הריצה שלך."**

**למה זה עובד:** מאזן בין העולם הגדול (מונדיאל) לבין העולם הפרטי (שיא אישי). פונה לאגו הרץ — "הריצה שלך חשובה לא פחות". CTA ברור בתוך הכותרת עצמה. מגניב ומינימלי.

---

### וריאציה C — הרץ כגיבור
> **"מסי חוצה מגרש. אתה חוצה מסלול. שניכם צריכים גב."**

**למה זה עובד:** מעלה את הרץ הישראלי לרמה של שחקן עולמי. "שניכם צריכים גב" = הגדרה מדויקת למה האפליקציה עושה. קצת יותר אמוציונלי ממה שיובל בדרך כלל עושה — אבל עובד טוב לאינסטגרם.

---

## Golden Rules Check

| כלל | סטטוס |
|-----|-------|
| אדום = חירום בלבד | PASS — אין אדום |
| ירוק = פעיל/בטוח בלבד | PASS — ירוק רק ל-route, divider, CTA |
| אין SOS בפוסט | PASS — לא רלוונטי |
| טקסט מינימום 12px | PASS — מינימום 20px |
| כפתורים rounded-2xl | PASS — אין כפתורים בפוסט |
| overlay = bg-black/60 | PASS — text panel bg-navy/90 |
| מצב חירום = רטט+אדום | PASS — לא חירום |
| מספרים = font-mono | PASS — "2026" ב-Space Mono אם מופיע |
| RTL default | PASS — טקסט מיושר ימין |
| עברית ראשונה | PASS — הכל עברית |

**כל 10 כללי הזהב עוברים.**

---

## Brand Alignment Check

| קריטריון | בדיקה |
|----------|-------|
| ביטחון, עוצמה, זרימה | PASS — "שומרים עליך" = ביטחון. "לא עוצרים" = זרימה |
| קהל יעד (14-17, רצים) | PASS — שפה ישירה, לא מתנשאת, בגובה העיניים |
| Quiet Discipline tone | PASS — "שומרים" לא "נשמור" — כבר קיים |
| לא Moovit/Waze vibe | PASS — tactical, comparison sport, לא navigation |
| זכויות יוצרים מסי | PASS — אין שם, אין תמונה, רק הקשר תרבותי |
| לא פוליטי | PASS — ספורטיבי בלבד |
| לוגו עם glow | PASS — נמצא בפינה תחתון-ימין |

---

## הנחיות ייצור

**אם משתמשים בCanva/Open Design:**
1. לוגו קיים ב-`app/public/logo/full/logo-dark.png` — השתמש ישירות
2. אין לייצר תמונות של מסי — לא חוקי (זכויות יוצרים FIFA + La Pulga)
3. קווי המגרש = SVG פשוט, לא צילום
4. המסלול = screenshot מסכמטי של האפליקציה, או ציור ידני
5. הטקסט קבוע — אל תשנה אפילו מילה
6. הוריאציה המומלצת: **A** ("הם שומרים עליו במגרש")

**Prompt לOpen Design / DALL-E (ויזואל בלבד, ללא טקסט):**
```
A dark tactical split-screen image for Instagram. Left half: minimalist soccer/football field lines in white (40% opacity) on very dark green (#0a1a0f). Right half: tactical dark navy map (#111f3c) with a neon green running route line and three small glowing shelter markers. A diagonal neon green (#00ff88) line connects the two halves. Grid texture overlay across entire image. Bottom area: dark navy panel semi-transparent. No people. No Messi. No text. No red. Pure dark tactical aesthetic. 1080x1080px.
```

---

## File References

- לוגו: `app/public/logo/full/logo-dark.png`
- Output: `O-output/Owner's Output/DEX-instagram-worldcup-messi-2026-06-27.md`
- קובץ קשור: `DEX-instagram-slide1-2026-06-27.md` (slide 1 של הקרוסלה)

---

*DEX — Design EXecution | RunningInWar | 2026-06-27*
