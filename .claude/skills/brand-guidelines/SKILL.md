---
name: brand-guidelines
description: Use when working on the RunningInWar app — adding/modifying UI components, writing copy/error messages/empty states, picking colors or typography, building new screens or features, designing animations, or making any decision that touches the look, feel, voice, or structure of the app. The skill encodes the product DNA: what the app is, the vibe it transmits (security, power, flow), the architecture, the visual language (tactical dark/neon), and the do/don't rules. Trigger broadly on any UI/CSS/copy/component work, on words like "brand", "design", "color", "פונט", "צבע", "מותג", "עיצוב", and whenever a new feature or screen is being planned or built.
---

# RunningInWar — Brand & Product DNA

## What This Skill Is
**The DNA of the RunningInWar product.** Not just visual guidelines — also what the app IS, the vibe it must transmit, the architecture decisions, and the rules that keep it coherent.

Read this whole file. Then load only the references you need for your current task.

---

## The Three Layers

Every decision about this app passes through three filters, in order:

### 1. WHY — Vibe & Mission
- **Mission:** אפליקציית מפות מקלטים. כל אחד יודע איפה המקלט הקרוב אליו תמיד.
- **Vibe (3 words):** **ביטחון, עוצמה, זרימה**
- **Feeling we transmit:** "אני בשליטה, אני יודע איפה ללכת, גם בזמן מלחמה אני יוצא החוצה."
- **What we are NOT:** עוד אפליקציית מפות (לא Moovit, לא Waze). לא רשת חברתית. לא משחק.

### 2. WHAT — Product Surface
- **Core:** מפת מקלטים + ניתוב + כפתור SOS תמידי
- **Screens:** Home, Map, Route, Profile, Auth, Sharing flow
- **Key features:** סימון מקלטים אישיים, מקלטים ציבוריים לפי עיר, מסלולי OSRM, ציון בטיחות, שיתוף מסלולים, אזעקות פיקוד העורף
- **Stack rules:** Leaflet only, Tailwind only, lucide-react only, Firebase + IndexedDB, dark only, RTL default

### 3. HOW — Execution
- **Visual:** Tactical command-center — navy darks, neon-green primary, alert-red emergency, gold warning, gridded background, glow shadows, radar/pulse animations
- **Font:** Rubik (Hebrew + Latin), Space Mono backup for numeric readouts
- **Voice:** ישיר, קצר, פרגמטי. חירום = דחוף ופעמי. רגיל = יבש ובהיר.

---

## The Golden Rules — אסור לשבור

1. **חוק עליון:** כל שינוי בינוני ומעלה דורש אישור מפורש לפני יישום. ספק = שואל.
2. **לעולם** לא modal/popup/overlay חוסם את כפתור SOS.
3. **לעולם** לא טקסט מתחת ל-12px.
4. **תמיד** overlay = `bg-black/60 + backdrop-blur`.
5. **תמיד** כפתור גדול = `rounded-2xl` או `rounded-full` — לא `rounded-md`.
6. **תמיד** אייקונים מ-`lucide-react`. שום ספרייה אחרת.
7. **תמיד** מצב חירום = רטט + טקסט גדול + אדום זוהר.
8. **תמיד** מספרים/מרחקים/זמנים = `font-mono` / `tabular-nums` (יציבות ויזואלית בעדכונים בזמן אמת).
9. **תמיד** אדום `brand-red` = **חירום בלבד**. ירוק `neon` = פעולה אקטיבית או סטטוס "בטוח" בלבד.
10. **תמיד** עברית default. אנגלית רק כשאין תרגום טוב (SOS, GPS, OSRM, PWA, וכו').

---

## Navigation — מתי לקרוא איזה reference

| המשימה שלך | קרא את הקובץ |
|------------|---------------|
| מבין את המהות / vibe / קהל היעד / מי המתחרים | `references/identity.md` |
| מבין מבנה האפליקציה / מסכים / hooks / context / pattern החלטות | `references/architecture.md` |
| עורך/מוסיף צבע, פונט, shadow, animation, glow | `references/design-tokens.md` |
| כותב error message / empty state / button copy / כותרת / כל UI text | `references/voice-tone.md` |
| בונה כפתור / card / drawer / modal / nav / badge חדש | `references/components.md` |
| מסך חירום (SOS, אזעקה) / שאלות נגישות / color-blind / reduced-motion | `references/accessibility.md` |

**אם המשימה נוגעת לכמה קבצים — קרא את כולם לפי הסדר הזה.**

---

## Decision Flow — לפני שמתחילים שינוי UI

1. **בדוק WHY:** האם השינוי מחזק ביטחון/עוצמה/זרימה? אם לא — עצור.
2. **בדוק WHAT:** האם זה משתלב בפיצ'רים הקיימים? אם פיצ'ר חדש — דרוש אישור.
3. **בדוק HOW:** האם משתמשים רק ב-tokens קיימים? אם לא — דרוש אישור.
4. **בדוק Golden Rules:** עוברים כל ה-10? אם לא — שאל.
5. **בדוק נגישות:** אם נוגע לחירום — קרא `accessibility.md` חובה.
6. **רק אז:** קוד.

---

## Things to Always Ask Before Building

כשמוסיפים פיצ'ר/UI חדש, שאל את יובל:
- האם זה משדר ביטחון/עוצמה/זרימה?
- האם זה לא דומה ל-Moovit/Waze?
- האם הצבעים מהפלטה הקיימת?
- האם יש מצב חירום בפיצ'ר הזה? איך נראה?
- האם זה עובד גם במצב reduced-motion?
- האם הטקסט עברית? יש מצבי error/empty?

אם **כל** התשובות "כן ברור" — אפשר להתחיל. אחרת — שאל.

---

## Inspiration
- **Strava (60%):** סטטיסטיקה אישית, מסלולים משותפים, מפה במרכז, תחושת שליטה
- **What we do NOT take from Strava (40%):** הצבעים החמים/כתום — אנחנו cool/cyber, dark-only, tactical
- **Original vibe:** Command-center / Cyberpunk-tactical / Military-grade UX לאזרחים

---

## Final Note
Yuval is 14, training competitively, building this app himself. The bar is HIGH — this isn't a school project, it's something real people will use to feel safe. Every pixel matters.
