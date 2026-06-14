# Skills Catalog — RunningInWar

**Date:** 2026-06-14
**Requested by:** JOHN (via orchestrator)
**Goal:** מיפוי מלא של כל הסקילים הקיימים — גלובליים ופרויקט — עם המלצות ורעיונות לסקילים חדשים לכל סוכן

---

## Existing Skills

### Global Skills (`C:\Users\user\.claude\skills\`)

| שם | מה עושה | מתאים ל | המלצה |
|----|---------|---------|-------|
| `session-manager` | ניהול מחזור חיי שיחה — קריאת זיכרון בהתחלה, כתיבה לNotion + learning-log בסוף | Claude (orchestrator) | השאר גלובלי — פועל על כל פרויקט |
| `managing-notion` | קריאה, כתיבה, חיפוש ב-Notion של יובל | Claude (orchestrator) | השאר גלובלי — אינו RunningInWar-specific |
| `notebooklm` | ניהול NotebookLM — יצירת notebooks, הוספת sources, ייצור podcasts/infographics/quizzes | Claude (orchestrator) | השאר גלובלי — שימוש צולב |
| `llm-council` | מפעיל 5 יועצים AI במקביל (Contrarian, First Principles, Expansionist, Outsider, Executor) לניתוח החלטות קשות | Claude (orchestrator) | השאר גלובלי — כלי החלטה כללי |
| `review` | Code review לפני push — לוגיקה, קריאות, console.logs | Claude / סוכן קוד (עתידי) | השאר גלובלי — קצר ופשוט |
| `deploy` | build + vercel --prod + דיווח URL | Claude / סוכן קוד (עתידי) | **שקול להעביר לפרויקט** — יש הגדרה ספציפית ב-CLAUDE.md (מתוך `app/`) |
| `email-organizer` | ניהול Gmail של יובל — ארגון ל-tabs, הסרת רשימות תפוצה | Claude (orchestrator) | השאר גלובלי — אישי, לא RunningInWar |
| `running-training-agent` | סוכן אימוני ריצה אישי — TrainingPeaks, לוח שבועי, התראות, Google Calendar | Claude (orchestrator) | השאר גלובלי — חיי יובל, לא האפליקציה |
| `running-agent-troubleshoot` | אבחון אוטומטי של בעיות בסוכן האימונים (token פג, Chrome crash, SMTP) | Claude (orchestrator) | השאר גלובלי — תשתית אישית |
| `prompt-mastermind` | הופך כוונה גולמית לפרומפט מקצועי — 20+ frameworks, שאלות ממוקדות, Quality Gate | Claude / JOHN | השאר גלובלי — שימוש צולב |
| `humanizer-he` | מזהה ומתקן דפוסי כתיבה AI בעברית — 30 דפוסים, 4 registers, audit pass | Claude (orchestrator) | השאר גלובלי — שימוש צולב |
| `israeli-shelter-guide` | מדריך מקלטים בישראל — סוגי מקלטים, זמני מגן, ממ"ד, פיקוד העורף | **RunningInWar-specific** | **שקול להעביר לפרויקט** — זה ידע הליבה של האפליקציה |
| `electron` | פיתוח אפליקציות Desktop עם Electron — main/renderer process, IPC, packaging | Claude / סוכן קוד (עתידי) | השאר גלובלי — שימוש ל-PhonePreview, לא RunningInWar |
| `google-calendar` | ניהול יומן Google של יובל — יצירה, עדכון, מחיקה, לוז אימוני שבועי | Claude (orchestrator) | השאר גלובלי — אישי |
| `creative-writer` | כותב 3 גרסאות שונות לכל בקשת כתיבה — רגשית, עובדתית, הומוריסטית | Claude (orchestrator) | השאר גלובלי — שימוש צולב |
| `research-analyst` | מחקר מובנה — 5W+H, איסוף נתונים, זיהוי דפוסים, הצגת ממצאים | **מוטי** | **שקול להעביר לפרויקט** — מוטי עושה בדיוק את זה, ייתכן overlap |

---

### Project Skills (`.claude/skills/` ברמת RunningInWar)

| שם | מה עושה | מתאים ל | הערות |
|----|---------|---------|-------|
| `brand-guidelines` | DNA של המוצר — ערכים, visual language, Golden Rules, decision flow לפני כל UI | Claude / סוכן קוד (עתידי) | חיוני, מוגדר היטב. כולל 6 reference files בפירוט מלא |
| `running-in-war-shelters` | ניהול נתוני מקלטים — תיקון קואורדינטות, הוספת עיר, verification pass מלא | Claude / סוכן קוד (עתידי) | מפורט מאוד — Playwright, Firestore, Nominatim, bbox validation |

---

## ניתוח: מה חסר, מה כפול, מה צריך תשומת לב

### כפילות פוטנציאלית
- `research-analyst` (גלובלי) ו-מוטי עושים דבר דומה מאוד. ההבדל: `research-analyst` הוא skill כללי; מוטי הוא סוכן שיש לו פרשנות דרך קונטקסט RunningInWar. אם מוטי משתמש ב-`research-analyst` כ-sub-skill — יש סינרגיה. אם לא — כפילות.

### גלובלי שכדאי להעביר לפרויקט
- `israeli-shelter-guide` — זה ידע הליבה של RunningInWar. כרגע גלובלי, אבל מתאים יותר כ-project skill.

### חסר
- אין skill לכתיבה ל-learning-log (BOB עושה את זה ידנית, לא מסוכן)
- אין skill לניהול Firestore (כרגע מוטמע ב-`running-in-war-shelters` אבל לא חשוף כ-skill כללי)
- אין skill לניתוב בין סוכנים (Claude עושה זאת מ-CLAUDE.md, לא מ-skill)

---

## Per-Agent Skill Suggestions

### BOB (DB Manager)
BOB מנהל את `data/index.db`, Team Output, ולומד ל-learning-log.

| רעיון | מה זה יעשה |
|-------|----------|
| `write-to-learning-log` | Skill ממוקד לכתיבה ל-`M-memory/learning-log.md` — פורמט Tom Even (Active Patterns / Common Mistakes / Iteration Log). יבדוק כפילויות לפני כתיבה. כרגע BOB עושה את זה "ביד" לפי ההוראות בקובץ שלו. |
| `index-file` | Skill לאינדוקס קובץ חדש ב-`data/index.db` — מקבל path + metadata, מוסיף עם node:sqlite. נותן API פשוט שסוכנים אחרים יקראו לו. |
| `scan-team-output` | Watcher ל-`O-output/Team Output/` — מזהה קבצים חדשים, מאנדקס אוטומטית, מדווח ל-Claude. |

---

### JOHN (HR Agent)
JOHN גייס BOB, מוטי, ועצמו. הוא מעצב סוכנים — מקבל briefing ממוטי ויוצר כל הקבצים.

| רעיון | מה זה יעשה |
|-------|----------|
| `agent-template` | Skill שמחזיק את ה-template הסטנדרטי לסוכן חדש (frontmatter, sections, כלים נדרשים, חוקים). JOHN יעמיס אותו לפני כל גיוס — מבטיח consistency בין כל הסוכנים. |
| `roster-updater` | Skill לעדכון אוטומטי של `A-agents/roster.md` ו-`CLAUDE.md` אחרי גיוס סוכן. JOHN כרגע עושה את זה ידנית — ה-skill ידאג לפורמט הנכון ולא ישכח עמודות. |
| `agent-reviewer` | Skill לבדיקת סוכן שנוצר — בדוק שיש frontmatter, description מדויק, כלים רשומים, חוקים ברורים. ה-skill שולח back לJOHN report לפני ש-JOHN שומר. |

---

### מוטי (Research Agent)
מוטי חוקר ומחזיר דוחות. כרגע מסתמך על WebSearch + WebFetch + Read.

| רעיון | מה זה יעשה |
|-------|----------|
| `source-validator` | Skill שמקבל רשימת URLs ובודק כל אחד — קריא? נגיש? up-to-date? מחזיר רק מקורות אמינים. מוטי כרגע בוחר מקורות ידנית — ה-skill יסנן אוטומטית. |
| `runninginwar-context-loader` | Skill קצר שטוען בפעם אחת: `core-identity.md` + `roster.md` + `learning-log.md` — שלושת הקבצים שמוטי חייב לקרוא לפני כל מחקר. הגשמה של ה-workflow הנוכחי כ-reusable skill. |
| `report-formatter` | Skill שמקבל raw findings ממוטי ומייצר אוטומטית את פורמט הדוח הסטנדרטי (Executive Summary / מה הסוכן עושה / מה לא עושה / כלים / מודל / פרסונה / המלצות). |

---

### Claude (Orchestrator)
Claude מנתב בין סוכנים. הסקילים שלו הם כולם גלובליים כרגע.

| רעיון | מה זה יעשה |
|-------|----------|
| `agent-router` | Skill שמחזיק את לוגיקת הניתוב (מה → לאיזה סוכן) כ-reference file מובנה. כרגע זה קיים בטבלה ב-CLAUDE.md — skill יאפשר לעדכן ולהרחיב בלי לגעת ב-CLAUDE.md. |
| `runninginwar-onboarding` | Skill לטעינת כל הקונטקסט של RunningInWar בתחילת שיחה — core-identity, roster, learning-log, brand-guidelines. משלים את `session-manager` עם context ספציפי לפרויקט. |
| `task-dispatcher` | Skill לפיצול task מורכב למשימות לסוכנים מרובים במקביל — מגדיר מי עושה מה, מחכה לתוצאות, מאחד. מאפשר ל-Claude לתאם פעולות של BOB + מוטי + JOHN בו-זמנית. |

---

## סיכום והמלצות ל-JOHN

1. **שקול להעביר** `israeli-shelter-guide` לפרויקט — זה ידע ליבה של RunningInWar.
2. **Overlap מוטי vs. research-analyst** — בדוק אם מוטי אמור לעמוס את `research-analyst` כ-sub-skill, או שמוטי מחליף אותו לחלוטין בהקשר הפרויקט.
3. **deploy skill** — גרסת הפרויקט אמורה להכיל `cd app && vercel --prod`. הגרסה הגלובלית גנרית מדי.
4. **הסקילים המוצעים בעדיפות גבוהה:** `write-to-learning-log` (BOB), `agent-template` (JOHN), `runninginwar-context-loader` (מוטי).
5. **כל הסקילים הגלובליים שאינם RunningInWar-specific** — השאר גלובלי, אל תשכפל.

---

*מוטי — Research Agent | 2026-06-14*
