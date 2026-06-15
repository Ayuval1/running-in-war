# deploy

**Full skill:** `.claude/skills/deploy/SKILL.md`
**סוג:** Project skill (הועבר מגלובלי)

## מה הסקיל עושה
מנחה על deploy של RunningInWar ל-Vercel production. כולל בדיקת build, git push, ו-vercel --prod מתוך תיקיית app/.

## מתי לטעון
- כש-Yuval אומר "deploy", "פרסם", "תעלה לproduction"
- אחרי שינוי שמוכן לproduction

## מי משתמש
- Claude (Orchestrator) — כל deploy

## עקרונות עיקריים
- תמיד מריץ מתוך `app/` — לא מה-root
- git push לפני vercel
- Production: https://running-in-war.vercel.app
