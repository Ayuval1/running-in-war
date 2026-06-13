# JOHN Update Note — BOB.md Fixes

**Date:** 2026-06-13
**File patched:** `.claude/agents/BOB.md`

## Changes Made

### 1. DB Schema — agents table added
Added `agents (id, name TEXT, role, persona, created)` to the schema block.
This table was created today (by JOHN during agent registration) but was missing from BOB's definition, meaning BOB had no knowledge of it.

### 2. watch-team-output.mjs — clarifying note added
Added inline note to the scripts table: the script runs on-demand, not auto-started.
Previously the entry gave no hint about how/when to invoke it, which could cause confusion about whether it runs in the background automatically.

## What Was NOT Changed
Everything else in BOB.md is untouched. Minimal edits only, as instructed.
