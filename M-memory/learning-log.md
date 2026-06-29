# Learning Log
Where we capture what works, what doesn't, and patterns we repeat.

---

## Active Patterns — Apply These Now

| עשה | אל תעשה |
|-----|---------|
| ABC-TOM folder structure (A-agents, B-brain, C-core, M-memory, O-output) | כל הקבצים ב-root של הפרויקט |
| node:sqlite built-in (Node 22.5+) | ספריית sqlite חיצונית עם compilation |
| Deploy: `git push` → `cd app && vercel --prod` | vercel לפני GitHub |
| אחרי שמירת קובץ ל-`O-output/Owner's Output/` — קרא לBOB להריץ index-update | קובץ שלא מקוטלג = לא קיים בDB ולא נמצא בwiki graph |
| brand-guidelines skill ב-`.claude/skills/brand-guidelines/SKILL.md` | ב-`.agents/skills/` |
| markdown > DB לזיכרון סוכנים — agents קוראים .md ישירות | sessions/lessons table בDB שאף אחד לא שואל |
| Agent tool ברירת מחדל לכל סוכן חדש | סוכנים ללא יכולת לקרוא לBOB |
| קוד + פיצ'רים + UI → subagent_type: barak | תכנות inline במקום הנתיך לברק |
| DEX מעצב (design-only), BARAK מממש (implementation-only) | DEX/BARAK עובדים בעצמם יחד בעיבוד |
| JOHN שלב 1.5: שאל קריטיות לפני שולח מוטי (שם, אחריות, כלים, טריגרים, שיתוף פעולה) | JOHN משדר מוטי ללא שאלות סקרנות |
| JOHN שלב 2.5: Glob לאימות קובץ מוטי קיים. אם לא קיים → שלח מוטי שוב | אמון עיוור בתגובה טקסטואלית של מוטי ללא בדיקה |
| פרומפט למוטי מסתיים: "סיים רק כשהקובץ נוצר בפועל, ציין נתיב." | מוטי משאיר תגובה בלבד בלי Write tool |
| ברק = קוד/לוגיקה/Firebase בלבד. DEX = UI/עיצוב בלבד. לא לערבב | DEX כותב קוד, ברק עוצב |

---

## Common Mistakes to Avoid

1. **sessions table בDB** — overengineered. Iteration Log בmarkdown מספיק ועדיף
2. **קריאה לBOB לגיוס סוכן** — גיוס = JOHN, לא BOB
3. **add-session.mjs** — בוטל. לא להריץ אותו
4. **כתיבה לlearning-log מסוכנים ישירות** — רק BOB כותב. שאר הסוכנים מדווחים לBOB
5. **Regex עם hyphenated names** — לא `\b`. הyphen הוא word boundary, אז `\bbrand-guidelines\b` שובר. תמיד: `(?<![\w-])name(?![\w-])`
6. **JOHN דילג על מוטי כשקיבל spec מלא** — JOHN חייב לשלוח מוטי ל-validation גם כשהspec ממלא. אין חריג. בנוסף: (א) JOHN חייב לשאול יובל שאלות אם חסר מידע - לא מנחש. (ב) Claude (coordinator) לא שולח לJOHN spec מלא — רק: שם + תפקיד + אישורים טכניים. הכל האחר JOHN מגלה עם מוטי.
7. **DEX השתמש בPython במקום Open Design MCP** — DEX חיפש MCP ב`claude_desktop_config.json` (שגוי), לא מצא, היסק "אין MCPs", יצר PNG עם Python. כללים: (א) Claude לא כותב escape hatch בפרומפטים לDEX ("אם לא עובד תעשה X"); (ב) DEX בודק MCP ב`C:/Users/user/.claude.json` בלבד; (ג) אם MCP לא עובד → DEX מדווח לקלוד ומחכה לאישור, לא יוצר פתרון עצמאי.
8. **מוטי תגובה טקסטואלית בלבד = כישלון** — מוטי חייב לכתוב קובץ עם Write tool. תגובה טקסטית בלבד (לו מונומן) ללא Write tool = כישלון בביצוע. JOHN חייב לבדוק בGlob ולשלוח מוטי שוב אם הקובץ לא קיים.

---

## Iteration Log

### 2026-06-27 — BARAK Agent Created
**מה עשינו:** JOHN ביצע ניוס לBARK (בראק) — Senior Code Agent. BARAK רשום ב-agents table, מנתב בCLAUDE.md, ופרטי persona מוגדרים.
**מה עבד:** BARAK מוגדר בDB ו-routing לפני השיחה. DEX+BARAK split עובד: DEX עוצב, BARAK מממש קוד.
**מה לא עבד:** אין
**Pattern שנגלה:** כל סוכן קוד צריך entry ברמה HIGH בניתוב (CLAUDE.md), כי הוא מטופל לעיתים קרובות.

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

### 2026-06-15 — T-tools Implementation + Skills Audit
**מה עשינו:** נבנה T-tools/ עם index.md + 12 קבצי סיכום per-skill. נוצרו 2 סקילי פרויקט חדשים: deploy (מתוך app/ בלבד), write-to-learning-log (של BOB לסוף שיחה). נמחקו 5 סקילים גלובליים: review, personal-context, israeli-shelter-guide, electron, impeccable. עודכנו סוכנים: MOTI (טוען research-analyst), BOB (טוען write-to-learning-log), JOHN (מוסיף T-tools שורה בכל גיוס). עודכן data/index.db: 4 רשומות חדשות + link מוטי→research-analyst. הכל עלה ל-GitHub, commit ab86a47.

### 2026-06-15 — Wiki Knowledge Graph + Agent Wiring
**מה עשינו:** הוספנו wiki links system לBOB: buildEntityRegistry, wiki_mention detection (166 links), indexes על DB, wiki-writer.mjs (מוכן לObsidian). עדכנו כל הסוכנים (מוטי, JOHN, BOB) + CLAUDE.md — עכשיו כולם שואלים BOB "מה קשור ל-X?" לפני שמתחילים עבודה.

### 2026-06-18 — מוטי explore-structure + CLAUDE.md routing enforcement
**מה עשינו:** נוצר skill explore-structure למוטי לחקירת קוד מקומי. CLAUDE.md עודכן — ניתוב עלה לשורה 1 + חסימת subagent_types מערכתיים (Explore/Plan/general-purpose). מוטי מוגדר עכשיו כסוכן הרשמי לכל חקירה (פנימית וחיצונית). DB עודכן: 237 files, 272 links.

### 2026-06-27 — JOHN Agent Refinement + BARAK Agent Created
**מה עשינו:** JOHN שופר עם טריגרים חדשים: שלב 1.5 (שאל קריטיות לפני מוטי), שלב 2.5 (Glob validation לקובץ מוטי). ברק (BARAK) מגויס — Senior Code Agent עבור כל קוד/לוגיקה/Firebase. ברק רשום בDB + agents table + ניתוב בCLAUDE.md ב-HIGH. DEX+BARAK split מוגדר: DEX עוצב, BARAK מממש. 3 קבצים חדשים: `.claude/agents/barak.md`, `A-agents/BARAK/BARAK.md`, `O-output/Owner's Output/JOHN-BARAK-report.md`.
**מה עבד:** JOHN ההסתמכות על שאלות ראשוניות (שם, אחריות, כלים, טריגרים) מגדלת דיוק של spec. Glob check כנגד null-response מונע גיגים שליחה למוטי.
**מה לא עבד:** אין
**Pattern שנגלה:** סוכן קוד HIGH-priority צריך: (א) entry ברמה HIGH בניתוב, (ב) persona מפורשת בDB, (ג) טריגרים ברורים לBOB/JOHN.

### 2026-06-27 — Open Design MCP Debug + DEX Instagram Test
**מה עשינו:** אישרנו שה-Windows startup shortcut קיים ועובד (Test-Path = True). הסברנו לDEX שצריך Open Design MCP — לא Python. DEX ניסה לייצר תמונה אינסטגרם (slide 1) — שוב השתמש בPython/Playwright במקום Open Design MCP. זיהינו סיבת שורש: Claude Code לא הופעל מחדש אחרי שעדכנו את .claude.json, לכן Open Design MCP לא מחובר בsession הנוכחי. Daemon רץ על פורט 7456 ✅. הוחלט: מחר — (1) הפעלת מחדש Claude Code, (2) הגדרת מערכת עיצוב ב-Open Design, (3) ניסיון נוסף עם DEX.
**מה עבד:** Daemon הפעלת מחדש ועדכון .claude.json.
**מה לא עבד:** DEX לא זיהה שחייב להשתמש בOpen Design MCP ויצר Python script במקום זה. Claude Code לא עדכן את MCPs זמינים בsession הנוכחי.
**Pattern שנגלה:** MCP הפעלת מחדש דורשת Claude Code restart מלא. DEX צריך בדיקה מפורשת שMCP זמין לפני יצירת escape hatch ל-Python.

### 2026-06-28 — DEX Open Design Fix + Workflow Reflection
**מה עשינו:**
1. רפלקציה עמוקה על תהליך עבודה — למה DEX לא השתמש ב-Open Design בסלייד הקודם
2. גילינו root cause: MCP tools לא היו ברשימת הכלים של DEX בfrontmatter
3. BARAK הוסיף 14 כלי `mcp__open-design__*` לDEX.md
4. BARAK הוסיף HARD STOP protocol לDEX.md — אם Open Design לא זמין: עצור, דווח, אל תמשיך לfallback
5. הוספנו כלל לCLAUDE.md: כל קריאת קובץ לצורך מחקר = dispatch מוטי. אין יוצא מן הכלל
6. הוספנו כלל ראשון בCLAUDE.md: כל פעולה → זהה סוכן צוות → האצל → דווח
7. הוספנו כלל BLOCKED לCLAUDE.md: כשסוכן מחזיר ⛔ BLOCKED — עצור ודווח ליובל
8. BARAK תיקן ניסוח explore-structure במוטי — ברירת מחדל לחקירה פנימית בלבד, לא חיצונית
9. DEX יצר slide 3 (CTA) בהצלחה דרך Open Design MCP ✅ — "שים נעליים. הורד עכשיו."
10. מוטי מיפה כל מידע זמין להעשרת DEX (Task 004 מ-ideas.md)
11. עצרנו: מחר ממשיכים עם Task 004 — העשרת DEX במטא-דאטא מלא

**מה עבד:** 
- Open Design MCP שימוש (אחרי שהוספנו tools ל-DEX.md) ✅
- HARD STOP protocol מונע escape hatches עתידיות ✅
- Workflow reflection — זיהינו בעיה בmeta-structure (frontmatter tools) ✅

**מה לא עבד:** אין

**Pattern שנגלה:**
1. סוכן tools = משהו שחייב להיות בfrontmatter YAML, לא תלוי סקיל או context
2. HARD STOP (עצור, דווח, אל תמשיך) עדיף על escape hatch (עשה משהו שונה)
3. ניתוב + dispatch כלל ראשון בCLAUDE.md = לא דילוגים

---

*BOB כותב לקובץ זה. שאר הסוכנים מדווחים לBOB.*
