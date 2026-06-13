# BOB Agent

**Full definition:** `.claude/agents/BOB.md`

## Summary
DB Manager for RunningInWar. Indexes files, logs sessions, watches Team Output.

## Scripts
Located in `A-agents/BOB/scripts/`:
- `init-db.mjs` — creates DB + seeds (run once)
- `index-update.mjs` — scans all dirs → updates files table
- `add-session.mjs` — logs one session row
- `watch-team-output.mjs` — file watcher for O-output/Team Output/
 