# session-manager

**Full skill:** `C:\Users\user\.claude\skills\session-manager\SKILL.md`
**סוג:** Global skill

## מה הסקיל עושה
מנהל מחזור חיי שיחה. בהתחלה: קורא קבצי זיכרון + Notion. בסוף: מעדכן זיכרון, מוסיף ל-Notion (יומן חיבורים + יומן שיפורים), וקורא ל-BOB לכתיבת Iteration Log.

## מתי לטעון
- Claude טוען אוטומטית בתחילת כל שיחה (startup hook)
- Claude קורא ל-BOB בסוף שיחה דרך הסקיל הזה

## מי משתמש
- Claude (Orchestrator) — אוטומטי בכל שיחה

## עקרונות עיקריים
- Session Start: קרא זיכרון + Notion בשקט
- Session End Step 0: קרא ל-BOB → write-to-learning-log
- Session End Step 2.5: עדכן יומן שיפורים ב-Notion (RunningInWar בלבד)
