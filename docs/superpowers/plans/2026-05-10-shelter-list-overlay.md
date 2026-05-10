# Shelter List Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a glassmorphism floating card that opens when the user clicks the "X מקלטים" badge on MapPage, listing all shelters with edit and delete actions.

**Architecture:** All changes in one file: `src/pages/MapPage.jsx`. Add a `showShelterList` state, convert the badge to a button, and define a `ShelterListOverlay` component above `MapPage`. The overlay reuses existing `handleDelete` and `editingShelter` state — no new data layer needed.

**Tech Stack:** React 19, Tailwind CSS, Lucide React (Pencil + Trash2 icons), existing `SHELTER_TYPES` constants

---

## Files

| Action | File | What changes |
|--------|------|-------------|
| Modify | `src/pages/MapPage.jsx` | Add state, convert badge to button, add ShelterListOverlay component |

---

### Task 1: Add `showShelterList` state + convert badge to button

**Files:**
- Modify: `src/pages/MapPage.jsx`

- [ ] **Step 1: Add `showShelterList` state**

Find this block (around line 288):
```jsx
const [manualPosition, setManualPosition] = useState(null)
```

Add one line directly after it:
```jsx
const [showShelterList, setShowShelterList] = useState(false)
```

- [ ] **Step 2: Convert badge to clickable button**

Find the existing badge (around line 470):
```jsx
{shelters.length > 0 && !placingPin && (
  <div className="absolute top-14 right-4 z-30 bg-brand-card border border-white/10 rounded-full px-3 py-1 text-xs text-white/40">
    <span>{shelters.length} מקלטים</span>
  </div>
)}
```

Replace with:
```jsx
{shelters.length > 0 && !placingPin && (
  <button
    onClick={() => setShowShelterList(true)}
    className="absolute top-14 right-4 z-30 bg-brand-card border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 cursor-pointer hover:border-white/20 hover:text-white/60 transition-colors"
  >
    {shelters.length} מקלטים
  </button>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: make shelter count badge clickable"
```

---

### Task 2: Add `ShelterListOverlay` component

**Files:**
- Modify: `src/pages/MapPage.jsx` (add component above `MapPage` function)

- [ ] **Step 1: Add Pencil and Trash2 to lucide imports**

Find the existing lucide import at line 3:
```jsx
import { Shield, MapPin, LocateFixed, Loader2, CheckCircle2, X, AlertTriangle, Search } from 'lucide-react'
```

Replace with:
```jsx
import { Shield, MapPin, LocateFixed, Loader2, CheckCircle2, X, AlertTriangle, Search, Pencil, Trash2 } from 'lucide-react'
```

- [ ] **Step 2: Add `ShelterListOverlay` component**

Find the line `export default function MapPage() {` and insert this entire component BEFORE it:

```jsx
function ShelterListOverlay({ shelters, onEdit, onDelete, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dim backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      />

      {/* Card */}
      <div
        className="relative w-[92%] flex flex-col"
        style={{
          maxWidth: 420,
          maxHeight: '70vh',
          background: 'rgba(15,32,53,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,229,160,0.2)',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-[18px] py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-black text-[#E6F4F0]">🛡 המקלטים שלי</span>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(0,229,160,0.12)',
                border: '1px solid rgba(0,229,160,0.3)',
                color: '#00E5A0',
              }}
            >
              {shelters.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1" style={{ padding: '6px 0' }}>
          {shelters.length === 0 ? (
            <p className="text-center text-xs py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
              אין מקלטים עדיין — הוסף דרך כפתור + מקלט
            </p>
          ) : (
            shelters.map((shelter, i) => {
              const type = SHELTER_TYPES[shelter.type] || SHELTER_TYPES.building
              return (
                <div
                  key={shelter.id}
                  className="flex items-center gap-3 px-[18px] py-3"
                  style={{
                    borderBottom: i < shelters.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {/* Type badge */}
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                    style={{
                      background: `${type.color}18`,
                      border: `1px solid ${type.color}44`,
                      color: type.color,
                    }}
                  >
                    {type.icon} {type.label}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: '#E6F4F0' }}>
                      {shelter.name || type.label}
                    </p>
                    {shelter.address && (
                      <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {shelter.address}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onEdit(shelter)}
                      className="w-[30px] h-[30px] rounded-lg flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(59,158,255,0.1)',
                        border: '1px solid rgba(59,158,255,0.35)',
                        color: '#3B9EFF',
                      }}
                    >
                      <Pencil size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onDelete(shelter.id)}
                      className="w-[30px] h-[30px] rounded-lg flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(255,65,84,0.08)',
                        border: '1px solid rgba(255,65,84,0.35)',
                        color: '#FF4154',
                      }}
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: add ShelterListOverlay glassmorphism component"
```

---

### Task 3: Wire overlay into MapPage + handle edit action

**Files:**
- Modify: `src/pages/MapPage.jsx`

- [ ] **Step 1: Add overlay to MapPage JSX**

Find this block near the end of the `return` statement in `MapPage` (around line 460, just before `<BottomNav />`):
```jsx
      <BottomNav />
    </div>
  )
}
```

Insert the overlay render BEFORE `<BottomNav />`:
```jsx
      {showShelterList && (
        <ShelterListOverlay
          shelters={shelters}
          onClose={() => setShowShelterList(false)}
          onEdit={(shelter) => {
            setShowShelterList(false)
            setEditing(shelter)
          }}
          onDelete={handleDelete}
        />
      )}

      <BottomNav />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/MapPage.jsx
git commit -m "feat: wire ShelterListOverlay into MapPage"
```

---

### Task 4: Verify in browser

**Files:** none — verification only

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:5173` → go to Map page.

- [ ] **Step 2: Verify badge is clickable**

With shelters saved: badge "X מקלטים" appears top-right. Click it. Card opens with dim backdrop.

- [ ] **Step 3: Verify shelter rows**

Each shelter shows: type badge (colored), name (bold), address below (dimmer). Edit (blue ✏️) and delete (red 🗑) buttons on the right.

- [ ] **Step 4: Verify close behavior**

Click ✕ button → card closes. Click backdrop (dim area outside card) → card closes.

- [ ] **Step 5: Verify edit flow**

Click ✏️ on a shelter → overlay closes → edit Drawer opens with that shelter's data.

- [ ] **Step 6: Verify delete flow**

Click 🗑 → confirm dialog appears → confirm → shelter row disappears immediately (Firestore update + `useShelters` subscription refreshes list).

- [ ] **Step 7: Push**

```bash
git push
```
