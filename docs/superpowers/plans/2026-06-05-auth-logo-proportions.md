# Auth Screen Logo & Proportions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the vertical logo (`image.png`) with the horizontal logo (`image2.png`) on the auth screen and adjust proportions accordingly.

**Architecture:** Single-file change in `AuthPage.jsx`. The current logo is vertical/square (`h-60` = 240px). `image2.png` is a wide horizontal logo — needs smaller height (`h-20` = 80px) and more bottom margin to maintain visual balance.

**Tech Stack:** React, Tailwind CSS

---

## Files

- Modify: `src/pages/AuthPage.jsx` (lines 18–23)

---

### Task 1: Update logo in AuthPage.jsx

**Files:**
- Modify: `src/pages/AuthPage.jsx`

- [ ] **Step 1: Open the file and locate the logo `<img>` tag**

It's at line 18–23:
```jsx
<img
  src="/logo/full/image.png"
  alt="RunningINWar"
  className="h-60 mb-2"
  style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,160,0.55))' }}
/>
```

- [ ] **Step 2: Replace with updated logo + proportions**

```jsx
<img
  src="/logo/full/image2.png"
  alt="RunningINWar"
  className="h-20 mb-6"
  style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,160,0.55))' }}
/>
```

Changes:
- `image.png` → `image2.png` (horizontal logo)
- `h-60` → `h-20` (240px → 80px — horizontal logo needs width not height)
- `mb-2` → `mb-6` (more breathing room between logo and hero text)

- [ ] **Step 3: Deploy to Vercel**

```bash
vercel --prod
```

Wait for deployment URL to confirm success.

- [ ] **Step 4: Verify with Playwright on live site**

Use `mcp__plugin_playwright_playwright__browser_navigate` to go to `https://running-in-war.vercel.app/auth`, then `mcp__plugin_playwright_playwright__browser_take_screenshot`.

Verify in screenshot:
- Logo is horizontal (icon left, "RunningINWar" text right)
- Logo not oversized — proportional to screen width
- "ריצה בזמן מלחמה" visible below with clear spacing
- Login card fully visible without scrolling

- [ ] **Step 5: Ask user for approval**

Show screenshot to user and ask: "נראה טוב? לאשר העלאה ל-GitHub?"

**STOP — do not proceed to Step 6 without explicit user approval.**

- [ ] **Step 6: Push to GitHub (only after user approves)**

```bash
git add src/pages/AuthPage.jsx
git commit -m "feat(auth): replace logo with horizontal image2.png, adjust proportions"
git push origin main
```
