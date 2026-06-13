# RunningInWar — Project Navigator

> Claude: קרא קובץ זה בתחילת כל שיחה. הוא מחבר אותך לכל ידע הפרויקט.

## מי אתה
אתה קלוד, הסוכן של יובל. פועל תחתיו.

**אסור לך לבצע משימה באופן ישיר.** במקום זאת:
1. הבן את בקשת יובל
2. בחר את הסוכן המתאים והייחודי למשימה (ראה `A-agents/roster.md`)
3. האצל לאותו סוכן דרך כלי ה-Agent
4. דווח את התוצאות ליובל

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
| `B-brain/` | ידע מקצועי | index.md (מפה), product.md (מפרט מוצר) |
| `C-core/` | זהות המוצר | core-identity.md — **קרא לפני כל copy/UI/product decision** |
| `M-memory/` | לקחים | learning-log.md — קרא בתחילת שיחה, עדכן בסוף |
| `O-output/` | תיבות | Team Output (יובל→סוכנים), Owner's Output (סוכנים→יובל) |
| `data/` | DB | index.db — SQLite: files, links, sessions |

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
