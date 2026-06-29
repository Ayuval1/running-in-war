# Wiki Graph Report: Code/React/Frontend Context
**For:** JOHN (Agent Recruitment)  
**Prepared by:** BOB (DB Manager)  
**Date:** 2026-06-27  
**Purpose:** Inventory of existing code infrastructure, patterns, agents, and skills before recruiting new Code Agent

---

## Executive Summary

RunningInWar is a **React 18 + Vite + Tailwind + Leaflet** web app (PWA-enabled). No dedicated code agent exists yet — the CLAUDE.md routing table explicitly marks "UI, קוד, פיצ'רים, באגים" as **"סוכן קוד (עתידי)"** (future code agent).

Current codebase:
- **~50 React components** (JSX/hooks-based)
- **10 utility libraries** (routing, geolocation, Firebase, IndexedDB, safety scoring, GPX export, Pikud HaOref integration)
- **6 context providers** (Auth, Language, CityName, CityShelters, etc.)
- **Tech stack locked:** Leaflet only, Tailwind only, lucide-react only, Firebase + IndexedDB only
- **Architecture locked:** Dark mode + RTL default + Hebrew first

**Related existing agents:**
- **DEX** (Design Execution) — exists in agent registry, handles ALL visual design work (UI layouts, component design, mockups, design system)
- **MOTI** (Research Agent) — can explore codebase structure via `explore-structure` skill
- No code implementation agent yet

**Skills already available for code agent:**
- `explore-structure` (MOTI's skill, can be shared or templated)
- `brand-guidelines` (already in use for UI/copy/brand work)
- All deployment, auth, and Firebase patterns documented in learning-log

---

## Codebase Overview

### Technology Stack (Locked)
```
Frontend:  React 18.3.1 + React Router 6.23.1
Bundler:   Vite 5.3.1 + React Compiler (Babel plugin)
Styling:   Tailwind CSS 3.4.4 only (no CSS-in-JS, no other frameworks)
UI Icons:  lucide-react 1.7.0 only
Maps:      Leaflet 1.9.4 + react-leaflet 4.2.1 only (no Google Maps, no Mapbox)
Backend:   Firebase 10.12.0 (Firestore + Auth)
Local DB:  IndexedDB (via app/src/lib/indexedDB.js)
PWA:       vite-plugin-pwa 0.20.0
```

### App Structure

```
app/src/
├── App.jsx                    # Main router + Leaflet map wrapper
├── main.jsx                   # Entry point
├── index.css                  # Global styles (Tailwind + custom)
├── pages/                     # 6 route pages
│   ├── AuthPage.jsx           # Login/signup flow
│   ├── HomePage.jsx           # Initial state / post-auth home
│   ├── MapPage.jsx            # Primary interface — map + shelter markers + route display
│   ├── RoutePage.jsx          # Route editing, waypoints, safety scoring
│   ├── ProfilePage.jsx        # User profile / settings
│   ├── SharingPage.jsx        # Share route + shelters
│   └── SharedImportPage.jsx + SharedRoutePage.jsx  # Public link imports
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx      # Email/password input
│   │   └── SignupForm.jsx     # New user registration
│   ├── map/
│   │   ├── ShelterMarker.jsx  # Shelter popup on map
│   │   ├── UserMarker.jsx     # Current location + heading
│   │   ├── RoutePolyline.jsx  # Route line + waypoints
│   │   ├── RoutePointMarker.jsx  # Waypoint markers
│   │   └── CityFilter.jsx     # City dropdown selector
│   ├── shelters/
│   │   └── ShelterForm.jsx    # Shelter add/edit form
│   ├── route/
│   │   └── SafetyScoreBar.jsx # Color-coded safety visualization
│   ├── sos/
│   │   ├── SOSButton.jsx      # Emergency red button
│   │   └── SOSOverlay.jsx     # SOS action sheet
│   └── ui/
│       ├── Drawer.jsx         # Bottom sheet / side drawer
│       ├── BottomNav.jsx      # Tab navigation
│       ├── LoadingSpinner.jsx
│       └── ErrorBoundary.jsx  # Error fallback
├── context/
│   ├── AuthContext.jsx        # User auth state (Firebase)
│   ├── LanguageContext.jsx    # i18n en/he/ar
│   ├── CityNameContext.jsx    # Current city filter
│   ├── CitySheltersContext.jsx  # Shelter cache per city
│   └── (more custom contexts if needed)
├── hooks/
│   ├── useAuth.js             # Auth state hook
│   ├── useLocation.js         # Geolocation + heading
│   ├── useShelters.js         # Fetch shelters from Firestore
│   ├── useCityShelters.js     # City-specific shelter cache
│   ├── useAlerts.js           # Pikud HaOref alert subscription
│   ├── useInstallPrompt.js    # PWA install banner
│   └── useAddressAutocomplete.js  # Address suggestions
├── firebase/
│   ├── config.js              # Firebase init (keys in .env)
│   ├── auth.js                # Auth helpers (sign-up, sign-in)
│   └── firestore.js           # Firestore queries (shelters, routes, users)
├── lib/
│   ├── routeAlgorithm.js      # Main route-finding (OSRM + safety scoring)
│   ├── safetyScore.js         # Route safety calculation
│   ├── osrmRouting.js         # OSRM API wrapper
│   ├── pikudHaOref.js         # Pikud HaOref alerts API
│   ├── geo.js                 # Geospatial helpers (distance, bounds)
│   ├── gpxExport.js           # Export route as GPX
│   └── indexedDB.js           # Local cache layer
├── i18n/
│   └── translations.js        # en/he/ar text strings
├── constants/
│   └── shelterTypes.js        # Shelter classification (Type 1-5)
└── (vite assets, manifest, etc.)
```

### File Counts (Static Snapshot)
- **React Components (JSX):** ~50 files
- **JavaScript Utilities:** ~10 files
- **Total App Source:** ~65 files
- **Supporting (dev, docs, scripts):** ~50 files
- **Total Repo:** ~238 files (indexed in `data/index.db`)

---

## Existing Design Agent: DEX

**Status:** Active agent (available in system agent types)

**Role:** Design Execution — owns ALL visual design work
- UI layouts, component design, screen mockups
- Design system specifications
- Color/typography decisions
- Image generation, brand assets
- New feature visual execution

**Pattern:** DEX does NOT touch `app/src/` code unless explicitly told to. After design is complete, Yuval passes output to a code agent for implementation.

**Implication for Code Agent:** Clean separation of concerns. Code agent implements designs that DEX specifies.

---

## Existing Research Agent: מוטי

**Relevant Capability:** `explore-structure` skill

**What It Does:**
- Deep exploration of folder/file structure
- Code mapping (reads `.jsx`, `.js`, identifies imports, exports, functions)
- Generates tree views + per-file summaries
- Returns "quick" / "medium" / "very thorough" scopes

**Use for Code Agent Recruitment:**
- JOHN can spawn מוטי to map current app architecture in full detail
- Can identify code patterns, dead code, naming conventions
- Good for "state of the codebase" baseline before onboarding new agent

---

## Current Skill Inventory (For Code Agent Use)

| Skill | Category | Purpose | Available |
|-------|----------|---------|-----------|
| `brand-guidelines` | Product | UI/copy/design/brand consistency | ✅ Yes (`.claude/skills/brand-guidelines/SKILL.md`) |
| `deploy` | Operations | Vercel production deploy | ✅ Yes (`T-tools/deploy.md`) |
| `explore-structure` | Research | Local codebase mapping | ✅ Yes (MOTI's skill) |
| `write-to-learning-log` | Memory | Log lessons after work | ✅ Yes (BOB's skill) |
| `react-performance-optimizer` | React | React 19 performance, compiler, bundle analysis | ✅ Available (system agent types) |
| `frontend-engineer` | React | Hands-on component building | ✅ Available (system agent types) |
| `web-designer` | Frontend | CSS architecture, animations, design systems | ✅ Available (system agent types) |
| `clean-code` | Refactor | Code readability, naming, reduce complexity | ✅ Available (system agent types) |

---

## Code Patterns & Rules Already Established

### Architecture Rules (from learning-log + CLAUDE.md)
1. **No package installations** without explicit approval (locked stack)
2. **No config file changes** (package.json, vite.config, .env)
3. **Finish what you start** — no half-done work
4. **Plan before code** — all non-trivial tasks (3+ steps) need plan mode first
5. **Explore-structure required for ALL code tasks** — not just ambiguous ones
6. **Verify before done** — test, check logs, prove correctness

### Tech Stack Rules (Locked)
- Leaflet only (no Google Maps, Mapbox, alternative)
- Tailwind only (no CSS-in-JS, no Bootstrap, no other frameworks)
- lucide-react only (no other icon sets)
- Firebase + IndexedDB (no alternative backends)
- Dark mode only (no light mode variants)
- RTL default + Hebrew first (localization is baked in)

### Code Quality Rules (from learning-log)
- **Simplicity First:** Make every change as simple as possible. Minimal code impact.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes touch only what's necessary. Avoid introducing bugs.

### React Compiler Enabled
- Babel plugin active in vite.config (`target: '18'`)
- Auto-memoization of components + functions
- Enables more aggressive optimization

---

## Links & References (Wiki Graph)

### Files Directly Related to Code Work
- `app/src/App.jsx` — Main entry point, routing structure
- `app/src/components/` — All visual components
- `app/src/lib/` — Algorithm + utility functions
- `app/src/hooks/` — React hooks for state/effects
- `app/src/context/` — Global state (Auth, Language, City, Shelters)
- `C-core/core-identity.md` — Product requirements (read this first)
- `C-core/yuval-voice.md` — Tone/communication style for error messages, UI text
- `M-memory/learning-log.md` — Code quality rules + patterns to follow
- `CLAUDE.md` — Tech stack rules (locked components, no changes)
- `T-tools/brand-guidelines.md` — UI consistency guidelines

### Output Protocol
- **Work Output:** Write to `O-output/Owner's Output/` (visible to Yuval)
- **Indexing:** After any save to Owner's Output, **call BOB to run index-update.mjs**
- **Learning:** Log lessons to `M-memory/learning-log.md` via BOB only

---

## Recruitment Recommendation

**Code Agent Scope (Proposed):**

The new Code Agent should be positioned as the **implementation layer** for:
1. Feature building (new React components, new pages, new hooks)
2. Bug fixing (app crashes, route failures, UI bugs)
3. Refactoring (code simplification, pattern consistency, dead code removal)
4. Performance optimization (render efficiency, bundle size, load time)

**Will NOT Touch:**
- Design decisions (DEX owns this) — but receives designs from DEX as input
- Product decisions (Yuval owns this)
- Config/package changes (needs explicit approval from Yuval)
- Learning-log writing (BOB owns this)

**Upstream Dependencies:**
1. **DEX** (Design) — code agent receives design specs, builds components
2. **JOHN** (Recruitment) — when agent needs teammates
3. **MOTI** (Research) — for codebase exploration, best practices research
4. **BOB** (Database) — for logging work, session tracking
5. **IRIS** (Ideas) — for idea/task context at session start

**Should Know at Startup:**
- Read `C-core/core-identity.md` (product)
- Read `M-memory/learning-log.md` (patterns)
- Read `CLAUDE.md` (stack rules)
- Know how to call BOB for indexing
- Know how to call other agents (DEX, MOTI, JOHN)

---

## Questions for JOHN Before Design

1. **Scope:** Should this agent handle React-specific work only, or also Node.js/backend tasks (Firebase Cloud Functions, API endpoints)?
2. **Skill Integration:** Should the agent auto-load `explore-structure`, `brand-guidelines`, and `react-performance-optimizer` skills at startup?
3. **Verification Depth:** How thorough should "verify before done" be? (e.g., run dev server, test in mobile browser, check accessibility?)
4. **Collaboration:** Should this agent have "check with DEX first" for UI work, or is design already finalized by the time it receives work?
5. **Performance Focus:** React Compiler is enabled — should optimization be a default step in every task, or only when explicitly requested?
6. **Error Handling:** For bugs, should it automatically trace through Firestore queries, hooks, and component lifecycle, or escalate to MOTI for deep structure analysis?

---

**Ready for next steps:** JOHN clarifies scope with Yuval → JOHN designs agent spec → create agent files.
