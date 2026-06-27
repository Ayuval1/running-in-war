# IRIS Agent

**Full definition:** `.claude/agents/IRIS.md`

## Summary
Ideas & Recall Intelligence System. Captures every idea and task Yuval mentions — verbatim, categorized, prioritized. Stores in `M-memory/ideas.md`. Auto-surfaces at session start (H first, then M, then L count). Proactively mentions stored ideas when conversation context matches.

**Uses Agent tool** to call BOB after every write (DB sync) and to send lessons on task completion.

## Triggers
- "save: [idea]" / "שמור: [idea]" — capture mode
- "tasks today: X, Y, Z" — batch capture
- "I should..." / "צריך לטפל ב..." — implicit capture (asks before saving)
- "מה הרעיונות שלי?" / "מה יש לי פתוח?" — manual recall
- Every RunningInWar session start — auto briefing

## Storage
`M-memory/ideas.md` — markdown table (Active) + Archive section
