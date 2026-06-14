# Learning Log
Where we capture what works, what doesn't, and patterns we repeat.

---

## Active Patterns — Apply These Now

| עשה | אל תעשה |
|-----|---------|
| ABC-TOM folder structure (A-agents, B-brain, C-core, M-memory, O-output) | כל הקבצים ב-root של הפרויקט |
| node:sqlite built-in (Node 22.5+) | ספריית sqlite חיצונית עם compilation |
| Deploy: `git push` → `cd app && vercel --prod` | vercel לפני GitHub |
| brand-guidelines skill ב-`.claude/skills/brand-guidelines/SKILL.md` | ב-`.agents/skills/` |
| markdown > DB לזיכרון סוכנים — agents קוראים .md ישירות | sessions/lessons table בDB שאף אחד לא שואל |
| Agent tool ברירת מחדל לכל סוכן חדש | סוכנים ללא יכולת לקרוא לBOB |

---

## Common Mistakes to Avoid

1. **sessions table בDB** — overengineered. Iteration Log בmarkdown מספיק ועדיף
2. **קריאה לBOB לגיוס סוכן** — גיוס = JOHN, לא BOB
3. **add-session.mjs** — בוטל. לא להריץ אותו
4. **כתיבה לlearning-log מסוכנים ישירות** — רק BOB כותב. שאר הסוכנים מדווחים לBOB

---

## Iteration Log

### 2026-06-13 — ABC-TOM Restructure + BOB + JOHN + מוטי
**מה עשינו:** ארגון מחדש של הפרויקט ל-ABC-TOM structure. יצרנו BOB (DB Manager), JOHN (HR Agent), מוטי (Research Agent). JOHN ביצע review על BOB ואישר production.
**מה עבד:** ABC-TOM folder structure — כל דבר יש לו מקום ברור. node:sqlite built-in — אין צורך בpackage חיצוני.
**מה לא עבד:** sessions table בDB — תוכנן ובוטל. markdown מספיק.
**Pattern שנגלה:** פשטות > מורכבות. אם סוכן יכול לקרוא markdown — לא צריך DB.

### 2026-06-14 — זיכרון real-time + links + Tom Even format
**מה עשינו:** עדכון מבנה learning-log לפורמט Tom Even (Active Patterns / Common Mistakes / Iteration Log). הוספת link-update.mjs לDB. עדכון כל הסוכנים עם Agent tool + כלל "לקח → BOB".
**מה עבד:** Tom Even format — actionable יותר מ"What Works / What Doesn't"
**מה לא עבד:** אין
**Pattern שנגלה:** Iteration Log = מחליף sessions table. מידע זהה, פורמט שסוכנים קוראים.

### 2026-06-14 — T-tools + Skills Catalog + C-core enforcement
**מה עשינו:** הרצנו מוטי לסקור את כל הסקילים הקיימים (16 גלובליים + 2 פרויקטיים) — הדו"ח נשמר ב-O-output/Owner's Output/MOTI-research-skills-catalog.md. עדכנו JOHN.md שיחייב "Before Every Task → Read C-core + learning-log" בכל סוכן חדש שהוא יוצר. הגדרנו רעיון T-tools (תיקיה לכלים, workflows, סקילים) שיממש בשיחה הבאה.

---

*BOB כותב לקובץ זה. שאר הסוכנים מדווחים לBOB.*
