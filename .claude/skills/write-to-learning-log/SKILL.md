---
name: write-to-learning-log
description: Use this skill when BOB needs to write an Iteration Log entry to M-memory/learning-log.md. Trigger at session end when session-manager calls BOB with a session summary.
---

# Write to Learning Log — BOB's Skill

## מה הסקיל הזה עושה
כותב רשומת Iteration Log ל-`M-memory/learning-log.md` בפורמט Tom Even. זה הסקיל של BOB לסוף שיחה.

---

## לפני הכתיבה — בדיקת כפילות

1. קרא את `M-memory/learning-log.md`
2. בדוק את הרשומה האחרונה ב-Iteration Log
3. אם כבר קיימת רשומה לתאריך הנוכחי עם אותו נושא → **אל תכתוב כפילות, דווח ל-Claude**
4. אחרת → המשך לכתיבה

---

## פורמט הרשומה

```
### [YYYY-MM-DD] — [שם השיחה]
**מה עשינו:** [מה נבנה, הוחלט, או שונה — ספציפי. diary בלבד.]
```

**Iteration Log = יומן בלבד.** לא כולל לקחים — לקחים נרשמים real-time ב-Active Patterns / Common Mistakes.

---

## מה לכתוב ב"מה עשינו"

✅ כן:
- מה נבנה (קבצים, פיצ'רים, מבנה)
- מה הוחלט (ארכיטקטורה, כלים)
- מה השתנה (עדכונים, מחיקות)

❌ לא:
- לקחים / מסקנות (כבר ב-Active Patterns)
- הסברים מדוע (זה ב-Common Mistakes)
- תיאור כללי ללא פרטים ("עשינו דברים")

---

## איפה לשים

רשומה חדשה תמיד נוספת **בסוף** `## Iteration Log`, מתחת לרשומה האחרונה.

---

## אחרי הכתיבה

דווח ל-Claude: "כתבתי Iteration Log ל-[תאריך]."
