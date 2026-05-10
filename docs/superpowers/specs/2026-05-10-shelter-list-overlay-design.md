# Shelter List Overlay — Design Spec

**Date:** 2026-05-10
**Feature:** Clicking the "X מקלטים" badge on MapPage opens a floating glassmorphism card listing all shelters with edit/delete actions.

---

## Goal

Give the user a quick way to view, edit, and delete shelters directly from the map — without navigating away.

---

## Trigger

The existing badge in MapPage:
```jsx
{shelters.length > 0 && !placingPin && (
  <div className="absolute top-14 right-4 z-30 ...">
    <span>{shelters.length} מקלטים</span>
  </div>
)}
```
Becomes a clickable button that sets `showShelterList = true`.

---

## Visual Design

**Container:**
- Position: fixed, centered on screen (`inset-0`, flex center)
- Backdrop: `rgba(0,0,0,0.45)` dim + `backdrop-blur-sm` — clicking backdrop closes card
- Card: `width: 92%`, `max-width: 420px`, `max-height: 70vh`
- Background: `rgba(15,32,53,0.85)` + `backdrop-filter: blur(16px)`
- Border: `1px solid rgba(0,229,160,0.2)`
- Border-radius: `20px`
- Shadow: `0 24px 60px rgba(0,0,0,0.6)`

**Header:**
- Right: "🛡 המקלטים שלי" + green count badge (`rgba(0,229,160,0.12)` bg)
- Left: ✕ close button (circular, `rgba(255,255,255,0.07)` bg)
- Bottom border: `1px solid rgba(255,255,255,0.07)`

**Shelter rows** (scrollable list, `overflow-y: auto`):
```
[type badge]  shelter name (13px bold, #E6F4F0)    [✏️] [🗑]
              address (11px, white/35)
```
- Row padding: `12px 18px`
- Row separator: `1px solid rgba(255,255,255,0.05)`
- Type badge: colored per `SHELTER_TYPES[type].color`, small rounded pill
- Edit button: `rgba(59,158,255,0.1)` bg, blue border, 30×30px
- Delete button: `rgba(255,65,84,0.08)` bg, red border, 30×30px

**Empty state** (no shelters): "אין מקלטים עדיין — הוסף דרך כפתור + מקלט"

---

## Behavior

| Action | Result |
|--------|--------|
| Click badge "X מקלטים" | Opens overlay |
| Click ✕ or backdrop | Closes overlay |
| Click ✏️ on row | Closes overlay → opens existing edit Drawer for that shelter |
| Click 🗑 on row | `confirm()` → `deleteShelter(id)` → row disappears (state updates via `useShelters`) |

---

## Implementation Scope

**One file only: `src/pages/MapPage.jsx`**

Changes:
1. Add `showShelterList` state (`useState(false)`)
2. Badge → clickable `<button>` that sets `showShelterList(true)`
3. New `ShelterListOverlay` component (defined inside MapPage.jsx or as separate component in same file) — renders the glassmorphism card
4. Pass `shelters`, `onEdit`, `onDelete`, `onClose` props to overlay
5. `onEdit` handler: set `editingShelter` + close overlay
6. `onDelete` handler: existing `handleDelete` function (already calls `deleteShelter`)

No new files. No new packages. No changes to `useShelters`, `firestore.js`, or any other file.

---

## Out of Scope

- Search/filter within the list
- Sorting shelters
- Distance display (not requested)
- Any changes to the edit Drawer (reuse as-is)
