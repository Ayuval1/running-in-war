# Learning Log
Where we capture what works, what doesn't, and why.

## What Works
- 2026-06-13: ABC-TOM folder structure — separates app code from project knowledge. Cleaner than having everything at root.
- 2026-06-13: node:sqlite built-in (Node 22.5+) — no native compilation, no extra package.json needed for BOB scripts.

## What Doesn't Work
- 2026-06-13: Keeping all files at repo root — gets cluttered fast. Screenshots, planning files, and app code all mixed together.

## Patterns to Remember
- brand-guidelines skill lives at `.claude/skills/brand-guidelines/SKILL.md` (not `.agents/skills/`)
- Deploy order: GitHub first (`git push`), then Vercel (`cd app && vercel --prod`)
- BOB session end protocol: run `add-session.mjs` THEN `index-update.mjs`

*Update this file after every project. The system gets smarter over time.*
