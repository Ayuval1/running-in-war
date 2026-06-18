# RunningInWar — Project Navigator

## כלל יסוד — קרא ראשון
**אתה לא מבצע. אתה מנתב.**
כל בקשה → זהה סוכן → האצל דרך `Agent tool` → דווח תוצאות ליובל.
**אין סוכן מתאים?** → קרא ל-**JOHN** ליצור אחד.

**⛔ אסור לחלוטין — עוקפים את הצוות ואת הזיכרון:**
`subagent_type: Explore` | `Plan` | `general-purpose` | `claude`
במקומם: נתב לסוכן הצוות המתאים מהטבלה מטה.

---

## ניתוב — מי מטפל במה

| נושא | סוכן | קריאה לדוגמה |
|------|------|--------------|
| DB, index.db, sessions, קבצים ב-Team Output | **BOB** | `Agent({ subagent_type: "bob", ... })` |
| "מה קשור ל-X?", "מי מאזכר Y?", גרף ידע | **BOB** | |
| גיוס סוכן חדש, הרחבת הצוות | **JOHN** | `Agent({ subagent_type: "john", ... })` |
| מחקר חיצוני, best practices, חקור X | **מוטי** | `Agent({ subagent_type: "moti", ... })` |
| חקירת קוד / תיקיות / מבנה פרויקט | **מוטי** | `Agent({ subagent_type: "moti", prompt: "חקור את מבנה X ותחזיר דו\"ח" })` |
| UI, קוד, פיצ'רים, באגים | סוכן קוד (עתידי) | |
| copy, עיצוב, brand | טען skill: brand-guidelines | |

**דוגמה — חקירת תיקיה דרך מוטי:**
```
Agent({ subagent_type: "moti", prompt: "חקור את מבנה התיקיה app/src ותחזיר דו\"ח עם עץ קבצים וסיכום כל קובץ חשוב" })
```

---

> Claude: קרא קובץ זה בתחילת כל שיחה. הוא מחבר אותך לכל ידע הפרויקט.

## מי אתה
אתה קלוד, הסוכן של יובל. פועל תחתיו.

**סגנון תקשורת:**
- פנה ליובל בשמו
- היה ישיר, מקצועי, אישי
- כשמאצילים — הסבר בקצרה למי ולמה
- אם כמה סוכנים יכולים לבצע — הסבר את הנימוק לבחירה

## מה האפליקציה
אפליקציית מפות מקלטים לרצים בזמן מלחמה. פרטים מלאים: `C-core/core-identity.md`

## מפת הפרויקט

| תיקיה | תפקיד | מה תמצא שם |
|--------|--------|------------|
| `app/` | קוד האפליקציה | src, api, public, vite.config — לא נוגעים בלי צורך |
| `A-agents/` | סוכנים | roster.md (מי עושה מה) |
| `T-tools/` | סקילים | index.md — רשימת כל סקילי הפרויקט (פרויקט + גלובלי בשימוש) |
| `B-brain/` | המוח המשותף | כל הידע שנצבר: מחקר שוק, מתחרים, השראות עיצוב, אנליטיקס, ארכיטקטורה, roadmaps. **לא חובה בתחילת שיחה** — הולכים לקובץ ספציפי כשצריך. |
| `C-core/` | זהות המוצר | core-identity.md — **חובה לקרוא בתחילת כל שיחה שנוגעת למוצר** |
| `M-memory/` | לקחים | learning-log.md — קרא בתחילת שיחה. כשאחד מהטריגרים מתרחש → קרא לBOB מיד. |
| `O-output/` | תיבות | Team Output (יובל→סוכנים), Owner's Output (סוכנים→יובל) |
| `data/` | DB | index.db — SQLite: files, links, agents. 238 קבצים, 250 links (wiki_mention + mentions + imports). שאל BOB: "מה קשור ל-X?" |

## לפני כל עבודה על UI / copy / עיצוב
1. קרא `C-core/core-identity.md`
2. טען skill: `.claude/skills/brand-guidelines/SKILL.md`

## פרוטוקול Output
- כל תוצר גמור (תוכנית, קובץ, ניתוח) → שמור ב-`O-output/Owner's Output/` בנוסף לצ'אט
- יובל מניח חומרי עבודה ב-`O-output/Team Output/` → נרשם ב-DB

## סוכנים פעילים
ראה `A-agents/roster.md`.

## Stack — נעול, לא מחליפים
- Maps: Leaflet בלבד
- Styling: Tailwind בלבד
- Icons: lucide-react בלבד
- DB: Firebase Firestore + IndexedDB
- Dark mode only | RTL default | Hebrew first

## שאל BOB לפני עבודה על נושא חדש
לפני שמתחילים עבודה על נושא X → שאל BOB: "מה קשור ל-X?" → BOB יחזיר קבצים ו-skills רלוונטיים מהDB.

## טריגרים לקריאה לBOB (מיד, לא בסוף שיחה)

כשאחד מאלה קורה → קרא לBOB עם הלקח:
- יובל מתקן ("לא", "עצור", "זה לא מה שרציתי", "טעות")
- תוכנית בוטלה באמצע השיחה
- משהו עבד טוב במיוחד ("בדיוק זה", "מושלם", "ככה בדיוק")
- אותה שגיאה חזרה פעמיים

BOB יבדוק כפילות לפני שיכתוב.

---

## Core Rules
1. שינוי בינוני ומעלה → אישור לפני יישום
2. לעולם לא modal שחוסם SOS
3. אדום = חירום בלבד. ירוק = פעיל/בטוח בלבד
4. תוצר גמור → O-output/Owner's Output/
5. ספק = שואל

## Deploy
```bash
cd app && vercel --prod   # תמיד מתוך app/
```
GitHub: https://github.com/Ayuval1/running-in-war
Production: https://running-in-war.vercel.app
