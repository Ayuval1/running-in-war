# running-in-war-shelters

**Full skill:** `.claude/skills/running-in-war-shelters/SKILL.md`
**סוג:** Project skill

## מה הסקיל עושה
מנחה על 3 תהליכי ניהול מקלטים: תיקון קואורדינטות שגויות, הוספת עיר חדשה לFirestore, ו-verification pass מלא על כל 159 המקלטים. כולל Playwright, Nominatim, bbox validation.

## מתי לטעון
- כשמדווחים על מקלט במיקום שגוי
- כשמוסיפים עיר חדשה למסד הנתונים
- כשרוצים לוודא שכל הקואורדינטות תקינות

## מי משתמש
- Claude (Orchestrator) — כל עבודה על נתוני מקלטים

## עקרונות עיקריים
- Firestore collection: `city_shelters`
- `verified: true` = תוקן ידנית | `false` = auto-geocoded
- תמיד להריץ `diagnose-coords.mjs` אחרי הוספת עיר חדשה
- City bboxes מוגדרים בסקיל — לא לסטות מהם
