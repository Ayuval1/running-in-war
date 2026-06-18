# BOB Agent

**Full definition:** `.claude/agents/BOB.md`

## Summary
DB Manager for RunningInWar. Indexes files, builds file links graph, writes to learning-log. Only BOB writes to `M-memory/learning-log.md`.

**Wiki Graph:** 238 קבצים, 250 links (wiki_mention + mentions + imports). סוכנים שואלים BOB "מה קשור ל-X?" → BOB מריץ query על links table ומחזיר רשימת קבצים רלוונטיים.

## Skills
**Uses skill:** `write-to-learning-log` (פרויקט) — טוען בסוף שיחה לכתיבת Iteration Log

## Scripts
Located in `A-agents/BOB/scripts/`:
- `init-db.mjs` — creates DB + seeds (run once)
- `index-update.mjs` — scans all dirs → updates files table + runs link-update
- `link-update.mjs` — reads all files, finds path mentions + imports, writes to links table (auto-called by index-update)
- `watch-team-output.mjs` — file watcher for O-output/Team Output/ (run on-demand)
