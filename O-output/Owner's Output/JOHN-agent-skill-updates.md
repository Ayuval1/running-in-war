# JOHN Report — Agent Skill Updates

**Date:** 2026-06-15
**Requested by:** Claude / Yuval
**Type:** עדכון קבצי סוכנים קיימים (לא גיוס חדש)

---

## מה עודכן ב-MOTI

**`.claude/agents/MOTI.md`**
הוסף section "## Skills" לפני "## מה אתה חוקר":
- מוטי טוען `Skill("research-analyst")` לפני כל משימת מחקר
- הסקיל נמצא ב-`C:\Users\user\.claude\skills\research-analyst\SKILL.md`
- מגדיר מתודולוגיה: 5W+H → איסוף נתונים → דפוסים → ממצאים

**`A-agents/MOTI/MOTI.md`**
הוסף שורה תחת "## Tools":
- `**Uses skill:** research-analyst (גלובלי) — טוען לפני כל מחקר`

---

## מה עודכן ב-BOB

**`.claude/agents/BOB.md`**
הוסף section "## Skills" לפני "## Rules":
- BOB טוען `Skill("write-to-learning-log")` בסוף שיחה כשsession-manager קורא לו
- הסקיל נמצא ב-`.claude/skills/write-to-learning-log/SKILL.md`
- מגדיר בדיוק איך לכתוב Iteration Log ל-M-memory/learning-log.md

**`A-agents/BOB/BOB.md`**
הוסף section "## Skills":
- `**Uses skill:** write-to-learning-log (פרויקט) — טוען בסוף שיחה לכתיבת Iteration Log`

---

## מה עודכן ב-JOHN

**`.claude/agents/JOHN.md`**
הוסף שלב 9 חדש "עדכון T-tools" בתוך ה-Workflow המלא, לפני עדכון ה-DB:
- סקיל קיים → הוסף שורה ל-`T-tools/index.md`
- סקיל חדש → צור `SKILL.md` + `T-tools/[name].md` + הוסף ל-index
- עדכן קובץ הסוכן עם "Uses skill: [name]"
- שלבים 10, 11, 12 ממוספרו מחדש (היו 9, 10, 11)

**`A-agents/JOHN/JOHN.md`**
עדכון ה-Workflow (quick view) — הוסף שלב 6 לT-tools, הזיז index-update לשלב 7 ודו"ח לשלב 8.

---

## קבצים שעודכנו
- `C:\Users\user\Documents\ClaudeCode\RunningInWar\.claude\agents\MOTI.md`
- `C:\Users\user\Documents\ClaudeCode\RunningInWar\A-agents\MOTI\MOTI.md`
- `C:\Users\user\Documents\ClaudeCode\RunningInWar\.claude\agents\BOB.md`
- `C:\Users\user\Documents\ClaudeCode\RunningInWar\A-agents\BOB\BOB.md`
- `C:\Users\user\Documents\ClaudeCode\RunningInWar\.claude\agents\JOHN.md`
- `C:\Users\user\Documents\ClaudeCode\RunningInWar\A-agents\JOHN\JOHN.md`
