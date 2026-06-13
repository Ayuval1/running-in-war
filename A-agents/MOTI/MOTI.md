# מוטי Agent

**Full definition:** `.claude/agents/MOTI.md`

## Summary
Research Agent for RunningInWar. Searches the web, reads project files, and delivers structured research reports. Used primarily by JOHN before creating any new agent, but can be called for any research need.

## Triggers
- "חקור..."
- "מחקר על..."
- Called internally by JOHN as first step of every agent creation

## Workflow (quick view)
1. קורא C-core/core-identity.md + roster.md
2. WebSearch + WebFetch (+ Chrome אם זמין)
3. מסנתז ממצאים בהקשר RunningInWar
4. כותב דו"ח → O-output/Owner's Output/MOTI-research-[ROLE].md
