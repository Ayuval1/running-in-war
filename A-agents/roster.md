# Roster — Who Does What

| Agent | תפקיד | אחריות |
|-------|-------|--------|
| Claude | בוחר סוכנים | בוחר את הסוכן המתאים לכל משימה |
| BOB | DB Manager | data/index.db, Team Output, session log |

---

## Team Profiles

### Claude
- **Role:** Orchestrator — never executes directly
- **Trigger:** Every request from Yuval
- **Action:** Reads roster, picks the right agent, delegates, reports result

### BOB
- **Role:** DB Manager
- **Location:** `A-agents/BOB/BOB.md`
- **Scripts:** `A-agents/BOB/scripts/`
- **Action:** Indexes files, logs sessions, watches Team Output

---

## Recruitment Pipeline
Future agents go here before becoming active.
Add a row to the table above + create `A-agents/[NAME]/[NAME].md` using the agent template.
