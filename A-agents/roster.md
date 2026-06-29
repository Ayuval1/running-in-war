# Roster — Who Does What

| Agent | תפקיד | אחריות |
|-------|-------|--------|
| Claude | בוחר סוכנים | בוחר את הסוכן המתאים לכל משימה |
| BOB | DB Manager | data/index.db, Team Output, session log |
| JOHN | HR Agent | גיוס סוכני AI חדשים, עדכון roster + CLAUDE.md + DB |
| מוטי | Research Agent | מחקר חיצוני + ניתוח קונטקסט לפני כל גיוס סוכן |
| IRIS | Ideas & Recall | לכידת רעיונות + משימות + recall בתחילת שיחה + proactive surface |
| ברק (BARAK) | Senior Code Agent | כותב כל הקוד — React, Firebase, hooks, באגים, פיצ'רים. מממש specs של DEX. |

---

## Team Profiles

### ברק (BARAK)
- **Role:** Senior Code Agent
- **Location:** `A-agents/BARAK/BARAK.md` | Full: `.claude/agents/barak.md`
- **Action:** Reads codebase → reads DEX spec → writes code directly to app/ → runs build → reports to Claude/DEX → calls BOB for indexing

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

### IRIS
- **Role:** Ideas & Recall Intelligence System
- **Location:** `A-agents/IRIS/IRIS.md` | Full: `.claude/agents/IRIS.md`
- **Action:** Captures ideas/tasks verbatim → stores in M-memory/ideas.md → surfaces at session start (H first) → proactive recall mid-conversation → sends lessons to BOB on Done

---

## Recruitment Pipeline
To recruit a new agent: tell Claude, Claude tells JOHN, JOHN uses מוטי for research, then creates everything.
JOHN adds the new agent to this roster automatically.
