# Agent Formats Research — מוטי

**Date:** 2026-06-15
**Requested by:** Claude (orchestrator)
**Goal:** להבין ההבדל בין .claude/agents/ לA-agents/ ואיך זה משפיע על T-tools

---

## Findings

### מבנה דו-שכבתי לכל סוכן

| קובץ | מי קורא | תפקיד |
|------|---------|--------|
| `.claude/agents/[NAME].md` | Claude Code runtime (Anthropic) | System prompt מלא + frontmatter |
| `A-agents/[NAME]/[NAME].md` | סוכנים אחרים, JOHN, בני-אדם | תקציר קצר + triggers + קישור לקובץ המלא |

### Frontmatter Anthropic — שדות חובה
- `name` — מזהה ייחודי
- `description` — **הכי חשוב** — Claude קורא רק את זה כשמחליט למי לאציל

### אנלוגיה ל-T-tools
- `.claude/skills/[name]/SKILL.md` = כמו `.claude/agents/BOB.md` (runtime מלא)
- `T-tools/[name].md` = כמו `A-agents/BOB/BOB.md` (תקציר לסוכנים)

### מסקנה
T-tools/[name].md = markdown טהור ללא frontmatter. קצר (10-25 שורות). מכיל: מה הסקיל, מתי לטעון, מי משתמש, קישור לקובץ המלא.
