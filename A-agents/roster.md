# Roster — Who Does What

| Agent | תפקיד | אחריות |
|-------|-------|--------|
| Claude | בוחר סוכנים | בוחר את הסוכן המתאים לכל משימה |
| BOB | DB Manager | data/index.db, Team Output, session log |
| JOHN | HR Agent | גיוס סוכני AI חדשים, עדכון roster + CLAUDE.md + DB |
| מוטי | Research Agent | מחקר חיצוני + ניתוח קונטקסט לפני כל גיוס סוכן |

---

## Team Profiles

### Claude
- **Role:** Orchestrator — never executes directly
- **Trigger:** Every request from Yuval
- **Action:** Reads roster, picks the right agent, delegates, reports result

### BOB
- **Role:** DB Manager
- **Location:** `A-agents/BOB/BOB.md` | Full: `.claude/agents/BOB.md`
- **Scripts:** `A-agents/BOB/scripts/`
- **Action:** Indexes files, logs sessions, watches Team Output

### JOHN
- **Role:** HR Agent — Recruits new AI agents
- **Location:** `A-agents/JOHN/JOHN.md` | Full: `.claude/agents/JOHN.md`
- **Action:** Receives agent request → spawns מוטי → designs agent → creates all files → updates roster + CLAUDE.md + DB

### מוטי
- **Role:** Research Agent
- **Location:** `A-agents/MOTI/MOTI.md` | Full: `.claude/agents/MOTI.md`
- **Action:** Web search + Chrome browse + reads project context → delivers research report to O-output/Owner's Output/

---

## Recruitment Pipeline
To recruit a new agent: tell Claude, Claude tells JOHN, JOHN uses מוטי for research, then creates everything.
JOHN adds the new agent to this roster automatically.
